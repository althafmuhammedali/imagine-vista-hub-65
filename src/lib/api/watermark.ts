export const addWatermark = async (imageBlob: Blob): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const img = new Image();
  const objectUrl = URL.createObjectURL(imageBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Configure watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = `${Math.max(20, img.width * 0.03)}px Arial`;
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'right';
      
      // Add watermark text
      const text = 'ComicForge AI';
      const padding = img.width * 0.02;
      ctx.fillText(text, img.width - padding, img.height - padding);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create watermarked image'));
        }
      }, 'image/png');
      
      URL.revokeObjectURL(objectUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for watermarking'));
    };
    
    img.src = objectUrl;
  });
};