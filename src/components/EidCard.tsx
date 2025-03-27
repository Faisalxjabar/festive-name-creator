
import React, { useRef, useState, useEffect } from "react";

interface EidCardProps {
  employeeName: string;
  onImageGenerated: (imageData: string) => void;
}

const EidCard: React.FC<EidCardProps> = ({ employeeName, onImageGenerated }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // Load the background image on component mount
  useEffect(() => {
    const image = new Image();
    image.src = "/lovable-uploads/f2da7eb5-1b03-460a-ba3b-21ba5f1b32e2.png";
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      setIsLoaded(true);
      setBgImage(image);
    };
    image.onerror = (err) => {
      console.error("Error loading background image:", err);
    };
  }, []);

  const generateImage = async () => {
    if (!employeeName || isRendering || !bgImage) return;
    
    try {
      setIsRendering(true);
      console.log("Starting image generation with name:", employeeName);
      
      // Create a canvas with higher resolution
      const canvas = document.createElement('canvas');
      canvas.width = 576 * 2; // Higher resolution
      canvas.height = 1024 * 2; // Higher resolution
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw background image
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      
      // Add text - Swissra font with increased size for better visibility
      ctx.font = "bold 74px Swissra, Cairo, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.direction = "rtl";
      ctx.textBaseline = "middle";
      
      // Draw text at the correct position - adjusted for the new image
      ctx.fillText(employeeName, canvas.width / 2, canvas.height * 0.78);
      
      // Convert to image data
      const imageData = canvas.toDataURL("image/png", 1.0);
      console.log("Image generated successfully");
      
      // Return the image data
      onImageGenerated(imageData);
    } catch (error) {
      console.error("Error generating image:", error);
      onImageGenerated("error"); // Send error signal
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (employeeName && isLoaded && bgImage) {
      generateImage();
    }
  }, [employeeName, isLoaded, bgImage]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-eid-yellow/50 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-black text-xl font-cairo">جاري تحميل الصورة...</div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef} 
      className="relative w-full h-full overflow-hidden card-image"
      style={{ 
        backgroundImage: `url(/lovable-uploads/f2da7eb5-1b03-460a-ba3b-21ba5f1b32e2.png)`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {employeeName && (
        <div 
          className="absolute"
          style={{
            left: '0',
            right: '0',
            top: '78%', // Adjusted for the new image
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'rtl'
          }}
        >
          <div 
            className="font-swissra font-bold employee-name-text" 
            style={{ 
              fontSize: 'min(34px, 6vw)', 
              color: '#000000',
              width: '70%',
              textAlign: 'center',
              direction: 'rtl',
              letterSpacing: '-0.5px',
              wordSpacing: '0.5px',
              lineHeight: '1.2',
              padding: '0 10px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 700,
              textShadow: '0 0 1px rgba(0,0,0,0.4)'
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
