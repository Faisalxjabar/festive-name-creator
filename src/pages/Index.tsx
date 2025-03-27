import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import EidCard from "@/components/EidCard";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setGeneratedImage(null);
    setSubmittedName("");
  }, []);

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

    if (employeeName.length > 18) {
      toast({
        title: "تنبيه",
        description: "الاسم طويل جدًا، قد يتم اقتصاصه في البطاقة",
      });
    }

    setIsLoading(true);
    setSubmittedName(employeeName);
  };

  const handleImageGenerated = (imageData: string) => {
    if (imageData === "error") {
      setIsLoading(false);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء البطاقة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }
    
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

  const getCardDimensions = () => {
    if (isMobile) {
      return {
        width: '320px',
        height: '568px'
      };
    } else {
      return {
        width: '375px',
        height: '667px'
      };
    }
  };

  const cardDimensions = getCardDimensions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-yellow/90 to-eid-gold/60">
      <Header />
      
      <div className="container mx-auto py-6 px-4 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 sm:mb-3 font-cairo">
              بطاقة معايدة عيد الفطر
            </h2>
            <p className="text-base sm:text-lg text-black/80 font-cairo animate-slide-up max-w-2xl mx-auto px-2">
              أضف اسمك لبطاقة المعايدة وقم بتحميلها لمشاركتها مع العائلة والأصدقاء
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            <div className="glass-panel p-5 sm:p-8 rounded-xl shadow-xl animate-fade-in w-full md:w-1/2 order-2 md:order-1">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-lg sm:text-xl text-black font-cairo font-semibold">
                    اسم الموظف
                  </label>
                  <Input
                    id="name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="أدخل اسمك هنا"
                    className="eid-input"
                    dir="rtl"
                    maxLength={18}
                  />
                  <p className="text-xs text-black/60 mt-1">
                    {employeeName.length > 0 && `${employeeName.length} / 18 حرف`}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="eid-button w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري إنشاء البطاقة..." : "إنشاء بطاقة المعايدة"}
                </Button>
                
                {generatedImage && !isLoading && (
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
                
                <div className="mt-4 p-3 sm:p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-xs sm:text-sm text-black/70 font-cairo text-center">
                    يمكنك تحميل البطاقة بعد إنشائها ومشاركتها على وسائل التواصل الاجتماعي
                  </p>
                </div>
              </form>
            </div>

            <div className="relative order-1 md:order-2 w-full md:w-1/2 flex justify-center items-center animate-fade-in">
              <div className="relative mx-auto overflow-hidden rounded-xl shadow-xl border-2 border-white/30" 
                   style={{ width: cardDimensions.width, height: cardDimensions.height }}>
                {submittedName ? (
                  generatedImage && generatedImage !== "error" ? (
                    <img 
                      src={generatedImage} 
                      alt="بطاقة عيد" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <EidCard 
                      employeeName={submittedName} 
                      onImageGenerated={handleImageGenerated} 
                    />
                  )
                ) : (
                  <div 
                    className="text-center p-4 sm:p-8 text-black font-cairo bg-black/5 w-full h-full flex flex-col items-center justify-center backdrop-blur-sm"
                    style={{ 
                      backgroundImage: `url(/lovable-uploads/f2da7eb5-1b03-460a-ba3b-21ba5f1b32e2.png)`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundBlendMode: 'overlay'
                    }}
                  >
                    <div className="bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-base sm:text-lg mb-2">أدخل اسمك واضغط على إنشاء البطاقة</p>
                      <p className="text-xs sm:text-sm opacity-70">سيظهر هنا معاينة للبطاقة</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 sm:py-6 text-center text-black/60 font-cairo text-xs sm:text-sm mt-6 sm:mt-8 border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ Black Knight</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
