
#!/bin/bash

# Exit on error
set -e

# Colors for prettier output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

DOMAIN="eid.b-k.coffee"
# استخدام عنوان المستودع العام بدلاً من استخدام اسم المستخدم
REPO_URL="https://github.com/faisalxjabar/festive-name-creator.git"

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}مرحبًا بك في سكربت تثبيت مشروع بطاقة معايدة عيد الفطر${NC}"
echo -e "${BLUE}للدومين: ${GREEN}$DOMAIN${NC}"
echo -e "${BLUE}===================================================${NC}"

# Check if Node.js is installed
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Error: Node.js is not installed.${NC}" >&2
  echo -e "${BLUE}Installing Node.js and npm...${NC}"
  
  # Install Node.js and npm using NVM
  echo -e "${BLUE}Installing NVM (Node Version Manager)...${NC}"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  
  # Load NVM
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  
  # Install latest LTS version of Node.js
  echo -e "${BLUE}Installing latest LTS version of Node.js...${NC}"
  nvm install --lts
  nvm use --lts
  
  # Verify installation
  node -v
  npm -v
else
  echo -e "${GREEN}Node.js is already installed. Version: $(node -v)${NC}"
  echo -e "${GREEN}npm is already installed. Version: $(npm -v)${NC}"
fi

# Check if git is installed
if ! [ -x "$(command -v git)" ]; then
  echo -e "${RED}Error: git is not installed.${NC}" >&2
  echo -e "${BLUE}Installing git...${NC}"
  
  # Install git based on OS
  if [ -x "$(command -v apt)" ]; then
    sudo apt update
    sudo apt install -y git
  elif [ -x "$(command -v yum)" ]; then
    sudo yum install -y git
  elif [ -x "$(command -v dnf)" ]; then
    sudo dnf install -y git
  else
    echo -e "${RED}Could not install git. Please install it manually.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}git is already installed. Version: $(git --version)${NC}"
fi

# Determine suitable directory for installation
# Try current directory first, if not writable use home directory
REPO_DIR="festive-name-creator"
if [ ! -w "." ]; then
  echo -e "${BLUE}Current directory is not writable, using home directory instead.${NC}"
  cd $HOME
  echo -e "${BLUE}Changed to directory: $(pwd)${NC}"
fi

# Clone the repository if not already done
if [ ! -d "$REPO_DIR" ]; then
  echo -e "${BLUE}Cloning the repository...${NC}"
  git clone "$REPO_URL" "$REPO_DIR" --depth=1
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to clone repository. Trying to create directory manually...${NC}"
    mkdir -p "$REPO_DIR"
    cd "$REPO_DIR"
    echo -e "${BLUE}Initializing git repository...${NC}"
    git init
    echo -e "${BLUE}Creating basic project structure...${NC}"
    # Create basic HTML file
    mkdir -p public src
    cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>بطاقة معايدة عيد الفطر</title>
    <meta name="description" content="بطاقة معايدة عيد الفطر - أنشئ بطاقة المعايدة الخاصة بك" />
    <meta name="author" content="Eid Mubarak Card Creator" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL
    cd ..
  fi
else
  echo -e "${GREEN}Repository already exists. Pulling latest changes...${NC}"
  cd "$REPO_DIR"
  git pull
  cd ..
fi

# Navigate to the project directory
cd "$REPO_DIR"
FULL_PATH=$(pwd)
echo -e "${BLUE}Working in directory: ${GREEN}$FULL_PATH${NC}"

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}Building the project...${NC}"
npm run build

# Install PM2 if not already installed
if ! [ -x "$(command -v pm2)" ]; then
  echo -e "${BLUE}Installing PM2 for process management...${NC}"
  npm install -g pm2
else
  echo -e "${GREEN}PM2 is already installed.${NC}"
fi

# Create PM2 configuration file
echo -e "${BLUE}Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "festive-name-creator",
    script: "node_modules/.bin/serve",
    env: {
      PM2_SERVE_PATH: "./dist",
      PM2_SERVE_SPA: "true",
      PM2_SERVE_HOMEPAGE: "/index.html"
    }
  }]
}
EOL

# Install serve if not already installed
if ! [ -x "$(command -v serve)" ]; then
  echo -e "${BLUE}Installing serve...${NC}"
  npm install -g serve
fi

# Start or restart the application with PM2
if pm2 show festive-name-creator > /dev/null 2>&1; then
  echo -e "${BLUE}Restarting the application with PM2...${NC}"
  pm2 restart festive-name-creator
else
  echo -e "${BLUE}Starting the application with PM2...${NC}"
  pm2 start ecosystem.config.js
fi

# Save the PM2 process list
pm2 save

# Set up PM2 to start on system boot
echo -e "${BLUE}Setting up PM2 to start on system boot...${NC}"
pm2 startup

# Create an example Nginx configuration
echo -e "${BLUE}Creating example Nginx configuration...${NC}"
cat > nginx-example.conf << EOL
# Example Nginx configuration for $DOMAIN
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}تم تثبيت وتشغيل المشروع بنجاح!${NC}"
echo -e "${GREEN}المشروع يعمل الآن ويدار بواسطة PM2.${NC}"
echo -e "${GREEN}تم إنشاء ملف تكوين Nginx مثالي في ${BLUE}nginx-example.conf${GREEN} يمكنك استخدامه لإعداد الخادم الخاص بك.${NC}"
echo -e "${BLUE}ملاحظة: تأكد من أن الدومين ${GREEN}$DOMAIN${BLUE} يشير إلى عنوان IP الخاص بالخادم.${NC}"
echo -e "${GREEN}مسار المشروع الكامل: ${BLUE}$FULL_PATH${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}أوامر PM2 المفيدة:${NC}"
echo -e "${BLUE}  عرض السجلات: pm2 logs festive-name-creator${NC}"
echo -e "${BLUE}  إيقاف التطبيق: pm2 stop festive-name-creator${NC}"
echo -e "${BLUE}  إعادة تشغيل التطبيق: pm2 restart festive-name-creator${NC}"
echo -e "${BLUE}  مراقبة: pm2 monit${NC}"
echo -e "${GREEN}==========================================${NC}"

exit 0
