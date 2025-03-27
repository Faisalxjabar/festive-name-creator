
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
      
      // Use a temporary div that we'll style exactly as needed for the capture
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Clone our card element into this temporary div
      tempDiv.innerHTML = cardRef.current.outerHTML;
      const tempCard = tempDiv.firstChild as HTMLElement;
      
      // Make sure the clone has the same dimensions
      tempCard.style.width = '576px';
      tempCard.style.height = '1024px';
      
      // Find and modify the name element in the clone
      const nameElement = tempCard.querySelector('.employee-name-text');
      if (nameElement) {
        const nameStyle = nameElement as HTMLElement;
        nameStyle.style.opacity = '1';
        nameStyle.style.visibility = 'visible';
        nameStyle.style.display = 'block';
        nameStyle.style.fontSize = '26px';
        nameStyle.style.fontWeight = '700';
        nameStyle.style.color = '#000000';
        nameStyle.style.textShadow = '0 0 2px rgba(0,0,0,0.8)';
        nameStyle.style.letterSpacing = '-0.5px';
        nameStyle.textContent = employeeName; // Ensure name is set
        console.log("Name element styled and content set:", nameStyle.textContent);
      } else {
        console.error("Name element not found in cloned card");
      }
      
      // Capture the modified clone
      const canvas = await html2canvas(tempCard, {
        scale: 8, // Very high quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: true,
        onclone: (documentClone) => {
          console.log("Document cloned for html2canvas");
        }
      });
      
      // Clean up the temporary element
      document.body.removeChild(tempDiv);
      
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
