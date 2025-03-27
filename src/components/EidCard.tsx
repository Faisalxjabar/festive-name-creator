
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
      
      // Add text
      ctx.font = "bold 54px Cairo, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.direction = "rtl";
      ctx.textBaseline = "middle";
      
      // Draw text at the correct position - ADJUSTED POSITION LOWER
      // Changed from 0.635 to 0.65 to move the text down slightly
      ctx.fillText(employeeName, canvas.width / 2, canvas.height * 0.65);
      
      // Convert to image data
      const imageData = canvas.toDataURL("image/png", 1.0);
      console.log("Image generated successfully");
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Return the image data
      onImageGenerated(imageData);
    } catch (error) {
      console.error("Error generating image:", error);
      // Even on error, we need to reset the loading state to allow retry
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
            // Adjusted top position from 650px to 665px to move it lower
            top: '665px',
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
