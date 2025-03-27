
#!/bin/bash

# Exit on error
set -e

# Colors for prettier output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}مرحبًا بك في سكربت تثبيت مشروع بطاقة معايدة عيد الفطر${NC}"
echo -e "${BLUE}===================================================${NC}"

# Always use sudo for all operations
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}هذا السكربت يتطلب صلاحيات المستخدم الجذر (root).${NC}"
  echo -e "${BLUE}جاري إعادة تشغيل السكربت باستخدام sudo...${NC}"
  sudo bash "$0" "$@"
  exit $?
fi

# Check if Node.js is installed
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Node.js غير مثبت. جاري التثبيت...${NC}"
  
  # Install Node.js LTS using appropriate package manager
  if [ -x "$(command -v apt)" ]; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
  elif [ -x "$(command -v yum)" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
  else
    echo -e "${RED}تعذر تثبيت Node.js. الرجاء تثبيته يدويًا.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Node.js مُثبت بالفعل. الإصدار: $(node -v)${NC}"
  echo -e "${GREEN}npm مُثبت بالفعل. الإصدار: $(npm -v)${NC}"
fi

# Create project structure
echo -e "${BLUE}جاري إنشاء بنية المشروع...${NC}"
mkdir -p public src

# Create basic files
echo -e "${BLUE}جاري إنشاء الملفات الأساسية...${NC}"

# index.html
cat > public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>بطاقة معايدة عيد الفطر</title>
    <meta name="description" content="بطاقة معايدة عيد الفطر - أنشئ بطاقة المعايدة الخاصة بك" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL

# Create package.json
cat > package.json << 'EOL'
{
  "name": "eid-greeting-card",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    "start": "serve -s dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "serve": "^14.2.0",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
EOL

# Create main.tsx
mkdir -p src
cat > src/main.tsx << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOL

# Create App.tsx
cat > src/App.tsx << 'EOL'
import React, { useState } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

function App() {
  const [name, setName] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(1);
  
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  const handleDesignChange = (designId) => {
    setSelectedDesign(designId);
  };
  
  const downloadCard = () => {
    const cardElement = document.getElementById('eid-card');
    if (!cardElement) return;
    
    html2canvas(cardElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'eid-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">بطاقة معايدة عيد الفطر</h1>
      
      <div className="mb-6">
        <label className="block mb-2 text-lg">أدخل اسمك:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full p-2 border rounded text-right"
          placeholder="اكتب اسمك هنا..."
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl mb-4">اختر تصميم البطاقة:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((designId) => (
            <div
              key={designId}
              className={`border p-4 cursor-pointer ${selectedDesign === designId ? 'border-4 border-blue-500' : ''}`}
              onClick={() => handleDesignChange(designId)}
            >
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                تصميم {designId}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl mb-4">معاينة البطاقة:</h2>
        <div id="eid-card" className="border p-8 bg-yellow-50 text-center">
          <h3 className="text-2xl font-bold mb-4">عيد فطر مبارك</h3>
          {name && <p className="text-xl">تهنئة من: {name}</p>}
          <p className="mt-4">كل عام وأنتم بخير</p>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={downloadCard}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          تحميل البطاقة
        </button>
      </div>
    </div>
  );
}

export default App;
EOL

# Create index.css
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  direction: rtl;
  text-align: right;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
EOL

# Create App.css
cat > src/App.css << 'EOL'
.container {
  max-width: 1200px;
  margin: 0 auto;
}
EOL

# Create vite.config.js
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOL

# Create tailwind.config.js
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Create postcss.config.js
cat > postcss.config.js << 'EOL'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Create tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

# Create tsconfig.node.json
cat > tsconfig.node.json << 'EOL'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}
EOL

# Install dependencies
echo -e "${BLUE}جاري تثبيت الاعتماديات...${NC}"
npm install

# Build the project
echo -e "${BLUE}جاري بناء المشروع...${NC}"
npm run build

# Install PM2 globally with sudo
echo -e "${BLUE}جاري تثبيت PM2 عالميًا...${NC}"
npm install -g pm2

# Create PM2 configuration
echo -e "${BLUE}جاري إنشاء تكوين PM2...${NC}"
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: "eid-greeting-app",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
    }
  }]
}
EOL

# Start the application with PM2
echo -e "${BLUE}جاري بدء التطبيق باستخدام PM2...${NC}"
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup

# Create example Nginx configuration
echo -e "${BLUE}جاري إنشاء مثال لتكوين Nginx...${NC}"
cat > nginx.conf << 'EOL'
server {
    listen 80;
    server_name eid.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}تم تثبيت وتشغيل المشروع بنجاح!${NC}"
echo -e "${GREEN}المشروع يعمل الآن على المنفذ 3000${NC}"
echo -e "${GREEN}يمكنك فتح المتصفح وزيارة http://localhost:3000${NC}"
echo -e "${BLUE}تم إنشاء ملف تكوين Nginx في ${GREEN}nginx.conf${BLUE}${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}أوامر PM2 المفيدة:${NC}"
echo -e "${BLUE}  عرض السجلات: pm2 logs eid-greeting-app${NC}"
echo -e "${BLUE}  إيقاف التطبيق: pm2 stop eid-greeting-app${NC}"
echo -e "${BLUE}  إعادة تشغيل التطبيق: pm2 restart eid-greeting-app${NC}"
echo -e "${BLUE}  مراقبة: pm2 monit${NC}"
echo -e "${GREEN}==========================================${NC}"

exit 0
