import React, { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface SkillBarProps {
  name: string;
  percentage: number;
  delay?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, percentage, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(ref);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-primary">{name}</span>
        <span className="text-grayDark font-semibold">{percentage}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{
            width: isVisible ? `${percentage}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;