import React from 'react';
import { InteractiveImageAccordion } from '../ui/interactive-image-accordion';

interface DashboardShowcaseProps {
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
}

export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({
  title,
  subtitle,
  features,
  cta
}) => {
  return (
    <div>
      <InteractiveImageAccordion />
    </div>
  );
};