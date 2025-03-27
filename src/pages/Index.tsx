
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

    // Validate name length to prevent overflow
    if (employeeName.length > 25) {
      toast({
        title: "تنبيه",
        description: "الاسم طويل جدًا، قد يتم اقتصاصه في البطاقة",
      });
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
            <h2 className="text-3xl font-bold text-black mb-3 font-cairo">
              بطاقة معايدة عيد الفطر
            </h2>
            <p className="text-lg text-black/80 font-cairo animate-slide-up max-w-2xl mx-auto">
              أضف اسمك لبطاقة المعايدة وقم بتحميلها لمشاركتها مع العائلة والأصدقاء
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="glass-panel p-8 rounded-xl shadow-xl animate-fade-in order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xl text-black font-cairo font-semibold">
                    اسم الموظف
                  </label>
                  <Input
                    id="name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="أدخل اسمك هنا"
                    className="eid-input"
                    dir="rtl"
                    maxLength={25} // Reduced maximum length for better readability
                  />
                  <p className="text-xs text-black/60 mt-1">
                    {employeeName.length > 0 && `${employeeName.length} / 25 حرف`}
                  </p>
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
                  <p className="text-sm text-black/70 font-cairo text-center">
                    يمكنك تحميل البطاقة بعد إنشائها ومشاركتها على وسائل التواصل الاجتماعي
                  </p>
                </div>
              </form>
            </div>

            <div className="relative rounded-xl shadow-2xl animate-fade-in order-1 lg:order-2 flex justify-center">
              <div className="relative" style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}>
                {submittedName ? (
                  <div className="overflow-hidden" style={{ width: '576px', height: '1024px', transform: 'scale(0.5)', transformOrigin: 'top center' }}>
                    <EidCard 
                      employeeName={submittedName} 
                      onImageGenerated={handleImageGenerated} 
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 text-black font-cairo" style={{ width: '288px', height: '512px' }}>
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
      
      <footer className="py-6 text-center text-black/60 font-cairo text-sm mt-8 border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
