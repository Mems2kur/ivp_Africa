import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="heading-[#8c52ff] mb-4">{title}</h2>
      {subtitle && (
        <p className="text-grayDark text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div
        className={`w-20 h-1 bg-primary mt-4 ${
          centered ? 'mx-auto' : ''
        } rounded-full`}
      />
    </div>
  );
};

export default SectionHeading;