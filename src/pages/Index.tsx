
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import EidCard from "@/components/EidCard";

const Index = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الموظف",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSubmittedName(employeeName);
    // البطاقة ستُنشأ تلقائياً عندما يتغير الاسم
  };

  const handleImageGenerated = (imageData: string) => {
    setGeneratedImage(imageData);
    setIsLoading(false);
    
    toast({
      title: "تم إنشاء البطاقة بنجاح",
      description: "يمكنك الآن تحميل الصورة",
    });
  };

  const downloadImage = () => {
    if (!generatedImage || !downloadLinkRef.current) return;
    
    const fileName = `eid_mubarak_${submittedName.replace(/\s+/g, '_')}.png`;
    
    downloadLinkRef.current.href = generatedImage;
    downloadLinkRef.current.download = fileName;
    downloadLinkRef.current.click();
    
    toast({
      title: "تم تحميل الصورة",
      description: "تم حفظ الصورة بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-yellow to-eid-gold/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-black mb-4 font-arabic">
            معايدة عيد الفطر
          </h1>
          <p className="text-xl text-black/80 font-arabic animate-slide-up">
            أضف اسمك لبطاقة المعايدة وقم بتحميلها
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="glass-panel p-6 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xl text-black font-arabic font-semibold">
                  اسم الموظف
                </label>
                <Input
                  id="name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="أدخل اسمك هنا"
                  className="eid-input"
                  dir="rtl"
                />
              </div>
              <Button 
                type="submit" 
                className="eid-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء البطاقة..." : "إنشاء بطاقة المعايدة"}
              </Button>
              
              {generatedImage && (
                <Button 
                  type="button" 
                  onClick={downloadImage} 
                  className="eid-button w-full bg-eid-gold hover:bg-eid-gold/90 text-black"
                >
                  تحميل البطاقة
                </Button>
              )}
              
              <a 
                ref={downloadLinkRef} 
                style={{ display: 'none' }}
                href={generatedImage || '#'} 
                download="eid_mubarak.png"
              />
            </form>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-xl animate-fade-in">
            <div className="w-full aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center">
              {submittedName ? (
                <div className="w-full h-full overflow-auto bg-white/5 rounded-lg">
                  <div className="transform scale-[0.3] origin-top-left">
                    <EidCard 
                      employeeName={submittedName} 
                      onImageGenerated={handleImageGenerated} 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-black font-arabic animate-pulse-gentle">
                  <p className="text-lg mb-2">أدخل اسمك واضغط على إنشاء البطاقة</p>
                  <p className="text-sm opacity-70">سيظهر هنا معاينة للبطاقة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
