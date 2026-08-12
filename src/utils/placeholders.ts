// Generate a simple SVG placeholder as a data URL
export const generatePlaceholder = (
  width: number,
  height: number,
  text: string = 'Image',
  bgColor: string = '#e5e7eb',
  textColor: string = '#9ca3af'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${Math.min(width, height) * 0.1}px" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
};

// Pre-defined placeholders
export const PLACEHOLDERS = {
  avatar: generatePlaceholder(100, 100,'avatar', '#f3f4f6', '#6b7280'),
  logo: generatePlaceholder(120, 48, 'Logo', '#f3f4f6', '#6b7280'),
  project: generatePlaceholder(400, 250, 'Project', '#f3f4f6', '#6b7280'),
  about: generatePlaceholder(500, 600, 'about', '#f3f4f6', '#6b7280'),
  hero: generatePlaceholder(400, 400, 'hello', '#f3f4f6', '#6b7280'),
  contact: generatePlaceholder(500, 400, 'contact', '#f3f4f6', '#6b7280'),
};

// Alternative: Simple colored placeholder
export const colorPlaceholder = (
  width: number,
  height: number,
  color: string = '#e5e7eb'
): string => {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`
  )}`;
};