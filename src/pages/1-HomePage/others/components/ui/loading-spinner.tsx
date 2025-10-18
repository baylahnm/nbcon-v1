import React from 'react';
import { motion } from 'framer-motion';
import NbLogo from './nb-logo';

interface LoadingSpinnerProps {
  /**
   * Optional loading text to display below the spinner
   * @default "Loading..."
   */
  text?: string;
  
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Show/hide loading text
   * @default true
   */
  showText?: boolean;
  
  /**
   * Full screen centered loader
   * @default false
   */
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md',
  showText = true,
  fullScreen = false,
}) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo Container */}
      <motion.div
        className={`${sizeMap[size]} relative`}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
          },
          scale: {
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }}
      >
        {/* Gradient border with animation */}
        <div 
          className="absolute inset-0 rounded-xl opacity-50"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, transparent 60%)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        
        {/* Logo with gradient background */}
        <div className="bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/50 relative z-10 w-full h-full">
          <NbLogo className={sizeMap[size]} />
        </div>
      </motion.div>

      {/* Loading Text with Animated Dots */}
      {showText && text && (
        <motion.div 
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm font-medium text-muted-foreground">
            {text}
          </span>
          <motion.span
            className="text-sm font-medium text-muted-foreground"
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ...
          </motion.span>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;

