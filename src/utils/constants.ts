import type { NavLink, SocialLink, Service, Project, Testimonial } from '../types';

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { 
    name: 'About', 
    path: '#', 
    subLinks:[
      {name: 'About Us', path: '/about'},
      { name: 'Services', path: '/services' }
    ]
  },
  { 
    name: 'Jobs', 
    path: '#',
    subLinks: [
      { name: 'Search Jobs', path: '/jobs' },
      { name: 'Browse Categories', path: '/categories' },
      { name: 'Saved Jobs', path: '/saved-jobs' }
    ]
  },
  { name: 'Employers', path: '/employers' },
  { 
    name: 'Legal & FAQ', 
    path: '#',
    subLinks: [
      { name: 'FAQ', path: '/faqs' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms', path: '/terms' }
    ]
  },
  { name: 'Contact Us', path: '/contact' },
];

// Social Links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/',
    icon: 'linkedin',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/',
    icon: 'github',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/',
    icon: 'twitter',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    icon: 'instagram',
  },
];


// Services Data
export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Smart job search',
    description: 'Filter by role, location, industry, and experience across the continent.',
    icon: 'search', // Updated: More appropriate for searching/filtering
    features: [
      '',
    ],
  },
  {
    id: 2,
    title: 'Application tracking',
    description: 'See where every application stands — applied, reviewed, shortlisted, offered.',
    icon: 'clipboard-list', // Updated: Represents tracking and lists
    features: [
      '',
    ],
  },
  {
    id: 3,
    title: 'Job posting suite',
    description: 'Post, edit, and manage roles with applicant workflows and interview scheduling.',
    icon: 'briefcase', // Updated: Represents a job/posting
    features: [
      '',
    ],
  },
  // CHANGED
  {
    id: 4, // Also fixed duplicate ID 2
    title: 'Company profiles',
    description: 'Showcase your brand, team, and mission to attract the right candidates.',
    icon: 'building', // Changed to reflect a company/building
    features: [
      '',
    ],
  },
  // CHANGED
  {
    id: 5,
    title: 'Verified employers',
    description: 'Every company is vetted before they can post. Fewer scams, more real jobs.',
    icon: 'shield-check', // Changed to reflect security/verification
    features: [
      '',
    ],
  },
  // CHANGED
  {
    id: 6,
    title: 'Real-time notifications',
    description: 'Instant updates when things change — no email refresh anxiety.',
    icon: 'bell', // Changed to reflect alerts/notifications
    features: [
      '',
    ],
  },
];
// Projects Data
export const PROJECTS: Project[] = [
  {
    id: 7,
    title: 'AI - Virtual Assistant Chatbot',
    description: '',
    image: '',
    stacks: [],
    githubUrl: '',
    liveUrl: '',
    category: 'ai',
  },
];

// Testimonials Data
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'TechStart Inc.',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ullamcorper purus a mollis aliquam. Aliquam at odio justo. Phasellus feugiat aliquam lacus. Duis a tempus orci, ac lacinia magna',
    logo: '/assets/images/logos/techstart.png',
    avatar: '/assets/images/avatars/sarah.jpg',
  },
  
];

// Contact Info
export const CONTACT_INFO = {
  email: 'ivpafrica@gmail.com',
  phone: '+2346566788876',
  location: 'Nigeria',
  serviceFormUrl: '',
};

// API Endpoints
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
};