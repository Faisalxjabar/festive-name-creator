
import React, { useRef, useState, useEffect } from "react";

interface EidCardProps {
  employeeName: string;
  onImageGenerated: (imageData: string) => void;
}

const EidCard: React.FC<EidCardProps> = ({ employeeName, onImageGenerated }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = "/lovable-uploads/3ca3041a-3d6f-42b5-bd45-0ca8aa506516.png";
    image.onload = () => setIsLoaded(true);
  }, []);

  const generateImage = async () => {
    if (!cardRef.current || !employeeName || isRendering) return;
    
    try {
      setIsRendering(true);
      console.log("Starting image generation with name:", employeeName);
      
      // Wait for HTML2Canvas to be loaded dynamically
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      
      // Create a completely new div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '576px';
      tempDiv.style.height = '1024px';
      document.body.appendChild(tempDiv);
      
      // Create a clean card element with proper styling
      tempDiv.innerHTML = `
        <div 
          style="
            width: 576px; 
            height: 1024px; 
            background-image: url('/lovable-uploads/3ca3041a-3d6f-42b5-bd45-0ca8aa506516.png');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            font-family: 'Cairo', sans-serif;
          "
        >
          <div 
            style="
              position: absolute;
              left: 80px;
              top: 650px;
              width: 417px;
              height: 72px;
              display: flex;
              align-items: center;
              justify-content: center;
              direction: rtl;
              text-align: center;
            "
          >
            <div 
              style="
                font-family: 'Cairo', sans-serif;
                font-size: 26px;
                font-weight: 700;
                color: #000000;
                text-shadow: 0 0 2px rgba(0,0,0,0.8);
                letter-spacing: -0.5px;
                width: 100%;
                text-align: center;
                direction: rtl;
                line-height: 1.2;
                padding: 0 10px;
              "
            >${employeeName}</div>
          </div>
        </div>
      `;
      
      // Force load the Cairo font before capturing
      const fontLoader = document.createElement('div');
      fontLoader.style.fontFamily = 'Cairo, sans-serif';
      fontLoader.style.position = 'absolute';
      fontLoader.style.left = '-9999px';
      fontLoader.style.top = '-9999px';
      fontLoader.textContent = employeeName;
      document.body.appendChild(fontLoader);
      
      // Wait briefly for fonts to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the image
      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
        scale: 8, // Very high quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: true
      });
      
      // Clean up the temporary elements
      document.body.removeChild(tempDiv);
      document.body.removeChild(fontLoader);
      
      const imageData = canvas.toDataURL("image/png", 1.0);
      console.log("Image generated successfully");
      onImageGenerated(imageData);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (employeeName && isLoaded) {
      generateImage();
    }
  }, [employeeName, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-[576px] h-[1024px] bg-eid-yellow/50 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-black text-xl font-cairo">جاري تحميل الصورة...</div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef} 
      className="relative w-[576px] h-[1024px] overflow-hidden card-image"
      style={{ 
        backgroundImage: `url(/lovable-uploads/3ca3041a-3d6f-42b5-bd45-0ca8aa506516.png)`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {employeeName && (
        <div 
          className="absolute"
          style={{
            left: '80px',
            top: '650px',
            width: '417px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'rtl'
          }}
        >
          <div 
            className="font-cairo font-bold employee-name-text" 
            style={{ 
              fontSize: '26px',
              color: '#000000',
              width: '100%',
              textAlign: 'center',
              direction: 'rtl',
              fontFamily: 'Cairo, sans-serif',
              letterSpacing: '-0.5px',
              wordSpacing: '0.5px',
              lineHeight: '1.2',
              padding: '0 10px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 700,
              textShadow: '0 0 2px rgba(0,0,0,0.8)'
            }}
          >
            {employeeName}
          </div>
        </div>
      )}
    </div>
  );
};

export default EidCard;
