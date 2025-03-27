
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
    if (!employeeName || isRendering) return;
    
    try {
      setIsRendering(true);
      console.log("Starting image generation with name:", employeeName);
      
      // Create a temporary canvas directly
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '576px';
      tempDiv.style.height = '1024px';
      document.body.appendChild(tempDiv);
      
      // Load the background image first
      const backgroundImage = new Image();
      backgroundImage.src = '/lovable-uploads/3ca3041a-3d6f-42b5-bd45-0ca8aa506516.png';
      backgroundImage.crossOrigin = "Anonymous";
      
      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = reject;
      });
      
      // Set up the canvas
      const canvas = document.createElement('canvas');
      canvas.width = 576 * 2; // Higher resolution
      canvas.height = 1024 * 2; // Higher resolution
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw background image
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      
      // Add text - Swissra font with increased size
      ctx.font = "bold 70px Swissra, Cairo, sans-serif"; // Increased from 64px to 70px
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.direction = "rtl";
      ctx.textBaseline = "middle";
      
      // Draw text at the correct position - Moved down slightly more
      // Changed from 0.70 to 0.72 to move the text down further
      ctx.fillText(employeeName, canvas.width / 2, canvas.height * 0.72);
      
      // Convert to image data
      const imageData = canvas.toDataURL("image/png", 1.0);
      console.log("Image generated successfully");
      
      // Clean up
      document.body.removeChild(tempDiv);
      
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
            // Moved down further from 710px to 730px
            top: '730px', 
            width: '417px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'rtl'
          }}
        >
          <div 
            className="font-swissra font-bold employee-name-text" 
            style={{ 
              // Increased font size from 32px to 34px
              fontSize: '34px', 
              color: '#000000',
              width: '100%',
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
