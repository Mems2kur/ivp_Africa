'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  // New icons for the job/recruitment services
  FaSearch,
  FaClipboardList,
  FaBriefcase,
  FaBuilding,
  FaShieldAlt,
  FaBell,
  // Original fallback icons
  FaBrain, 
  FaCode, 
  FaPalette, 
  FaLayerGroup, 
  FaMobileAlt, 
  FaUsers, 
  FaDatabase, 
  FaServer, 
  FaRobot 
} from 'react-icons/fa';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SectionHeading from '../common/SectionHeading';
import { SERVICES } from '../../utils/constants';

// Complete icon map covering job platform features and fallbacks
const iconMap: Record<string, React.ElementType> = {
  // Job Platform specific mappings
  'search': FaSearch,
  'clipboard-list': FaClipboardList,
  'briefcase': FaBriefcase,
  'building': FaBuilding,
  'shield-check': FaShieldAlt,
  'bell': FaBell,
  
  // Existing fallbacks
  brain: FaBrain,
  code: FaCode,
  palette: FaPalette,
  layout: FaLayerGroup,
  smartphone: FaMobileAlt,
  mobile: FaMobileAlt,
  users: FaUsers,
  database: FaDatabase,
  server: FaServer,
  robot: FaRobot,
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section ref={sectionRef} id="services" className="bg-white lg:px-20 py-20 section-padding">
      <div className="section-container">
        <SectionHeading
          className="text-gray-900"
          title="Services I Offer"
          subtitle="From development to design, We provide comprehensive opportunity to bring your vision to life."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SERVICES.map((service, index) => {
            // Safe fallback to FaCode if an unmapped string is passed or icon is undefined
            const Icon = (service.icon && iconMap[service.icon]) ? iconMap[service.icon] : FaCode;

            return (
              <motion.div
                key={service.id ? `${service.id}-${index}` : `service-${index}`}
                variants={itemVariants}
                className="card group bg-white border border-gray-100 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#8c52ff]/10 hover:border-[#8c52ff]/30 hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-outline rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                  <Icon className="text-2xl text-secondary group-hover:text-primary transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-4 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-grayDark group-hover:text-black mb-6 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features?.slice(0, 4).map((feature, featureIdx) => (
                    <li
                      key={`${service.id || index}-feat-${featureIdx}`}
                      className="flex items-center gap-2 text-sm text-grayDark group-hover:text-grayMedium transition-colors duration-300"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
