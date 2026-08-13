'use client';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = (
  ref: RefObject<HTMLElement | null>,
  options: UseScrollAnimationOptions = {}
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    const currentRef = ref.current;
    
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, rootMargin]);

  return isVisible;
};
