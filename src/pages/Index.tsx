
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import EidCard from "@/components/EidCard";
import Header from "@/components/Header";

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
    <div className="min-h-screen bg-gradient-to-b from-eid-yellow/90 to-eid-gold/60">
      <Header />
      
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-black mb-3 font-arabic">
              بطاقة معايدة عيد الفطر
            </h2>
            <p className="text-lg text-black/80 font-arabic animate-slide-up max-w-2xl mx-auto">
              أضف اسمك لبطاقة المعايدة وقم بتحميلها لمشاركتها مع العائلة والأصدقاء
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="glass-panel p-8 rounded-xl shadow-xl animate-fade-in order-2 lg:order-1">
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
                
                <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm text-black/70 font-arabic text-center">
                    يمكنك تحميل البطاقة بعد إنشائها ومشاركتها على وسائل التواصل الاجتماعي
                  </p>
                </div>
              </form>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-2xl animate-fade-in order-1 lg:order-2">
              <div className="w-full aspect-[9/16] bg-white/20 rounded-xl flex items-center justify-center">
                {submittedName ? (
                  <div className="w-full h-full overflow-auto bg-white/10 rounded-xl">
                    <div className="transform scale-[0.3] origin-top-left">
                      <EidCard 
                        employeeName={submittedName} 
                        onImageGenerated={handleImageGenerated} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-black font-arabic">
                    <div className="bg-black/5 p-6 rounded-xl backdrop-blur-sm">
                      <p className="text-lg mb-2">أدخل اسمك واضغط على إنشاء البطاقة</p>
                      <p className="text-sm opacity-70">سيظهر هنا معاينة للبطاقة</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-black/60 font-arabic text-sm mt-8 border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
