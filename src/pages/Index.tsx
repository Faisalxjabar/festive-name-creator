
import React, { useState } from "react";
import Header from "@/components/Header";
import EidCard from "@/components/EidCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Share2 } from "lucide-react";

const Index = () => {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");
  
  // Fixed TypeScript error by adding proper type annotation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value);
  };
  
  // Fixed TypeScript error by adding proper type annotation
  const handleDesignChange = (designId: number) => {
    console.log("Design changed:", designId);
    // Add logic to handle design change
  };
  
  const handleImageGenerated = (data: string) => {
    setImageData(data);
  };
  
  const handleDownload = () => {
    if (!imageData) return;
    
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `eid-card-${employeeName.replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (!imageData) return;
    
    if (navigator.share) {
      try {
        const blob = await fetch(imageData).then(r => r.blob());
        const file = new File([blob], "eid-card.png", { type: "image/png" });
        
        await navigator.share({
          title: "بطاقة معايدة عيد الفطر",
          text: "شارك بطاقة معايدة عيد الفطر",
          files: [file]
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Web Share API not supported");
      // Fallback sharing method
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold font-cairo mb-6 text-center">
          بطاقة معايدة عيد الفطر
        </h1>
        
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-right mb-2 font-cairo font-medium">
              أدخل الاسم
            </label>
            <Input
              id="name"
              value={employeeName}
              onChange={handleNameChange}
              placeholder="الاسم كاملًا"
              className="text-right font-cairo"
              dir="rtl"
            />
          </div>
          
          <div className="aspect-[9/16] w-full h-auto mb-6 rounded-lg overflow-hidden shadow-lg">
            <EidCard 
              employeeName={employeeName} 
              onImageGenerated={handleImageGenerated} 
            />
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleDownload}
              disabled={!imageData || !employeeName}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download size={18} />
              <span className="font-cairo">تحميل</span>
            </Button>
            
            <Button 
              onClick={handleShare}
              disabled={!imageData || !employeeName}
              className="flex items-center gap-2"
            >
              <Share2 size={18} />
              <span className="font-cairo">مشاركة</span>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4 text-center text-sm text-gray-500 font-cairo border-t">
        © 2025 جميع الحقوق محفوظة لـ Black Knight
      </footer>
    </div>
  );
};

export default Index;
