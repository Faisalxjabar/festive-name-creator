
#!/bin/bash

# Exit on error
set -e

# Colors for prettier output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

DOMAIN="eid.b-k.coffee"

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

# Clone the repository if not already done
REPO_DIR="festive-name-creator"
if [ ! -d "$REPO_DIR" ]; then
  echo -e "${BLUE}Cloning the repository...${NC}"
  git clone https://github.com/yourusername/festive-name-creator.git "$REPO_DIR"
else
  echo -e "${GREEN}Repository already exists. Pulling latest changes...${NC}"
  cd "$REPO_DIR"
  git pull
  cd ..
fi

# Navigate to the project directory
cd "$REPO_DIR"

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}Building the project...${NC}"
npm run build

# Set up a simple server to serve the built files
# Check if serve is installed
if ! [ -x "$(command -v serve)" ]; then
  echo -e "${BLUE}Installing serve...${NC}"
  npm install -g serve
fi

# Determine port to use (default: 8080)
PORT=${1:-8080}

# Add some additional info about domain configuration
echo -e "${BLUE}Domain configuration for ${GREEN}$DOMAIN${NC}:"
echo -e "${BLUE}You may need to set up a web server like Nginx or Apache to proxy requests to this application.${NC}"

cat > nginx-example.conf << EOL
# Example Nginx configuration for $DOMAIN
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

echo -e "${BLUE}Created example Nginx configuration in ${GREEN}nginx-example.conf${NC}"
echo -e "${BLUE}You can use this file to set up Nginx with your domain.${NC}"

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}To start the application, run:${NC}"
echo -e "${BLUE}cd $REPO_DIR && npm run dev${NC}"
echo -e "${GREEN}OR to serve the production build:${NC}"
echo -e "${BLUE}cd $REPO_DIR && serve -s dist -l $PORT${NC}"
echo -e "${GREEN}For production deployment, use:${NC}"
echo -e "${BLUE}./deploy.sh${NC}"
echo -e "${GREEN}The application will be available at:${NC}"
echo -e "${BLUE}http://$DOMAIN${NC} (after configuring your web server)"
echo -e "${GREEN}==========================================${NC}"

# Ask if the user wants to start the server now
read -p "Do you want to start the server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo -e "${BLUE}Starting the server on port $PORT...${NC}"
  echo -e "${BLUE}Press Ctrl+C to stop the server.${NC}"
  serve -s dist -l $PORT
fi

exit 0
