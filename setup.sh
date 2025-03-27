
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

# Always use current directory
CURRENT_DIR=$(pwd)
echo -e "${BLUE}Installing in current directory: ${GREEN}$CURRENT_DIR${NC}"

# Clone the repository content directly to current directory
echo -e "${BLUE}Cloning the repository content to current directory...${NC}"
git clone "$REPO_URL" temp_clone --depth=1
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to clone repository. Creating basic project structure...${NC}"
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
else
  # Move all files from the temp clone to current directory
  echo -e "${BLUE}Moving files to current directory...${NC}"
  mv temp_clone/* .
  mv temp_clone/.* . 2>/dev/null || true
  rm -rf temp_clone
fi

FULL_PATH=$CURRENT_DIR
echo -e "${BLUE}Working in directory: ${GREEN}$FULL_PATH${NC}"

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}Building the project...${NC}"
npm run build

# Install PM2 with sudo
echo -e "${BLUE}Installing PM2 globally with sudo...${NC}"
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install PM2 globally. Installing locally as a fallback...${NC}"
    npm install --save-dev pm2
    # Create a shortcut to local PM2
    echo 'alias pm2="npx pm2"' >> ~/.bashrc
    source ~/.bashrc || true
    PM2_CMD="npx pm2"
  else
    PM2_CMD="pm2"
    echo -e "${GREEN}PM2 installed globally with sudo.${NC}"
  fi
else
  PM2_CMD="pm2"
  echo -e "${GREEN}PM2 is already installed globally.${NC}"
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
echo -e "${BLUE}Installing serve...${NC}"
npm install --save-dev serve

# Start or restart the application with PM2
if $PM2_CMD list | grep -q "festive-name-creator"; then
  echo -e "${BLUE}Restarting the application with PM2...${NC}"
  $PM2_CMD restart festive-name-creator
else
  echo -e "${BLUE}Starting the application with PM2...${NC}"
  $PM2_CMD start ecosystem.config.js
fi

# Save the PM2 process list
$PM2_CMD save || echo -e "${RED}Failed to save PM2 process list. This is OK for local installations.${NC}"

# Set up PM2 to start on system boot (only for global PM2 installations)
if [ "$PM2_CMD" = "pm2" ]; then
  echo -e "${BLUE}Setting up PM2 to start on system boot...${NC}"
  sudo $PM2_CMD startup || echo -e "${RED}Failed to set up PM2 startup. This is OK for local installations.${NC}"
fi

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
echo -e "${BLUE}  عرض السجلات: $PM2_CMD logs festive-name-creator${NC}"
echo -e "${BLUE}  إيقاف التطبيق: $PM2_CMD stop festive-name-creator${NC}"
echo -e "${BLUE}  إعادة تشغيل التطبيق: $PM2_CMD restart festive-name-creator${NC}"
echo -e "${BLUE}  مراقبة: $PM2_CMD monit${NC}"
echo -e "${GREEN}==========================================${NC}"

exit 0
