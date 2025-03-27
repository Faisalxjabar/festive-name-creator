
#!/bin/bash

# Exit on error
set -e

# Colors for prettier output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}سكربت النشر للإنتاج لمشروع بطاقة معايدة عيد الفطر${NC}"
echo -e "${BLUE}===================================================${NC}"

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: Not in the project directory.${NC}" >&2
  echo -e "${BLUE}Please run this script from the project root directory.${NC}"
  exit 1
fi

# Install PM2 if not already installed
if ! [ -x "$(command -v pm2)" ]; then
  echo -e "${BLUE}Installing PM2 for process management...${NC}"
  npm install -g pm2
else
  echo -e "${GREEN}PM2 is already installed.${NC}"
fi

# Build the project
echo -e "${BLUE}Building the project for production...${NC}"
npm run build

# Determine port to use (default: 8080)
PORT=${1:-8080}

# Set up the PM2 configuration
echo -e "${BLUE}Setting up PM2 configuration...${NC}"

# Domain configuration
DOMAIN="eid.b-k.coffee"
echo -e "${BLUE}Configuring for domain: ${GREEN}$DOMAIN${NC}"

cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "festive-name-creator",
    script: "serve",
    env: {
      PM2_SERVE_PATH: "./dist",
      PM2_SERVE_PORT: ${PORT},
      PM2_SERVE_SPA: "true",
      PM2_SERVE_HOMEPAGE: "/index.html"
    }
  }]
}
EOL

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

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}The application is now running at:${NC}"
echo -e "${BLUE}http://$DOMAIN${NC}"
echo -e "${GREEN}PM2 commands:${NC}"
echo -e "${BLUE}  View logs: pm2 logs festive-name-creator${NC}"
echo -e "${BLUE}  Stop app: pm2 stop festive-name-creator${NC}"
echo -e "${BLUE}  Restart app: pm2 restart festive-name-creator${NC}"
echo -e "${BLUE}  Monitor: pm2 monit${NC}"
echo -e "${GREEN}==========================================${NC}"

# Add note about domain configuration
echo -e "${BLUE}Note:${NC} Make sure your domain ${GREEN}$DOMAIN${NC} is pointing to this server's IP address"
echo -e "${BLUE}and that you have configured your web server (Nginx/Apache) to proxy requests to port ${PORT}.${NC}"

exit 0
