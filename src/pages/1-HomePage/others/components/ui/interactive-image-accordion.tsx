import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }) => {
  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error'; }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Caption Text */}
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0' // Active state: horizontal, bottom-center
              // Inactive state: vertical, positioned at the bottom, for all screen sizes
              : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main App Component ---
export function InteractiveImageAccordion() {
  const { t } = useTranslation('homepage');
  const [activeIndex, setActiveIndex] = useState(4);

  // --- Data for the image accordion ---
  const accordionItems = [
    {
      id: 1,
      title: t('aiAssistant.featuresList.items.sceCompliance.title'),
      imageUrl: '/dashboardShowcase/SCE Compliance.png',
    },
    {
      id: 2,
      title: t('aiAssistant.featuresList.items.smartMatching.title'),
      imageUrl: '/dashboardShowcase/Smart Engineer Matching.png',
    },
    {
      id: 3,
      title: t('aiAssistant.featuresList.items.costEstimation.title'),
      imageUrl: '/dashboardShowcase/Real-time Cost Estimation.png',
    },
    {
      id: 4,
      title: t('aiAssistant.featuresList.items.projectManagement.title'),
      imageUrl: '/dashboardShowcase/Project Management.png',
    },
    {
      id: 5,
      title: t('aiAssistant.featuresList.items.quality.title'),
      imageUrl: '/dashboardShowcase/Quality Assurance.png',
    },
  ];

  const handleItemHover = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-background font-sans">
      <section className="container mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tighter">
              {t('imageAccordion.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              {t('imageAccordion.description')}
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-300"
              >
                {t('imageAccordion.cta')}
              </a>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full md:w-1/2">
            {/* Changed flex-col to flex-row to keep the layout consistent */}
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
