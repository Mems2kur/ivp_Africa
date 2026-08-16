import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo6.png';


interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* Logo Icon */}
      <div
        className={`${sizeClasses[size]} aspect-square rounded-lg flex items-center justify-center bg-transparent
          transition-transform duration-300 group-hover:scale-110`}
      >
        <span
          className={`font-heading font-bold ${
            variant === 'dark' ? 'text-secondary' : 'text-secondary'
          } ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}
        >
          <Image src={logo} alt="logo" width={40} height={40} />
        </span>
      </div>
      
      {/* Logo Text */}
      <span
        className={`font-heading font-bold ${textSizeClasses[size]} ${
          variant === 'dark' ? 'text-primary' : 'text-secondary'
        }`}
      >
      </span>
    </Link>
  );
};

export default Logo;