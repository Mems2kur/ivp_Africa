import React, { useState } from 'react';
import { generatePlaceholder } from '../../utils/placeholders';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 300,
  fallbackText = 'Image',
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(generatePlaceholder(width, height, fallbackText));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;