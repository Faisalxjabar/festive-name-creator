
import React from "react";
import { Moon, Sun } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white/20 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/6eed17ca-6afb-4bf1-bf5b-bed81f71ee62.png" 
            alt="شعار الشركة" 
            className="h-12 w-auto"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="bg-black/5 px-3 py-1 rounded-full text-sm text-black/70 font-arabic">
            عيد فطر مبارك
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
