'use client';

import React from 'react';
import { 
  FaLinkedinIn, 
  FaGithub, 
  FaTwitter, 
  FaInstagram, 
  FaGlobe 
} from 'react-icons/fa';
import { SOCIAL_LINKS } from '../../utils/constants';

interface SocialLinksProps {
  variant?: 'dark' | 'light' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
}) => {
  // Mapping keys in lowercase for safety
  const iconMap: Record<string, React.ElementType> = {
    linkedin: FaLinkedinIn,
    github: FaGithub,
    twitter: FaTwitter,
    x: FaTwitter,
    instagram: FaInstagram,
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const variantClasses = {
    // Use on dark backgrounds (e.g. Footer)
    dark: 'bg-white/10 text-[#8c52ff] hover:bg-gray-600 hover:text-white border border-white/10',
    // Use on light backgrounds (e.g. Hero / Cards)
    light: 'bg-gray-100 text-gray-800 hover:bg-[#8c52ff] hover:text-black border border-gray-200',
    // Brand purple button
    brand: 'bg-[#8c52ff] text-white hover:bg-gray-900 hover:text-white',
  };

  // Guard against missing array
  if (!SOCIAL_LINKS || SOCIAL_LINKS.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((social) => {
        // Normalize key to lowercase
        const iconKey = social.icon?.toLowerCase().trim();
        const Icon = iconMap[iconKey] || FaGlobe; // Fallback to FaGlobe if key mismatch

        return (
          <a
            key={social.name || social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant] || variantClasses.dark}
              rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5
              shadow-sm hover:shadow-md
            `}
            aria-label={social.name}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;