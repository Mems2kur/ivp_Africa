// Validate Email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format Phone Number
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
};

// Smooth Scroll to Element
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Generate Random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Truncate Text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Delay Function (for animations)
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};