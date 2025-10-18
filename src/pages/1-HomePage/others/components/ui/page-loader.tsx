import React from 'react';
import LoadingSpinner from './loading-spinner';

/**
 * Page Loader - Full screen loading overlay
 * Used for page transitions and lazy-loaded components
 */
const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading page...' }) => {
  return <LoadingSpinner fullScreen size="lg" text={text} />;
};

export default PageLoader;

