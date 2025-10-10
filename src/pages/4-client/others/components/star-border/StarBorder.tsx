import React from 'react';
import './StarBorder.css';

interface StarBorderProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: React.ReactNode;
  [key: string]: any;
}

const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}) => {
  const style = {
    '--star-color': color,
    '--star-speed': speed,
    '--star-thickness': `${thickness}px`,
  } as React.CSSProperties;

  return (
    <Component
      className={`star-border-container ${className}`}
      style={style}
      {...rest}
    >
      <div className="border-gradient-bottom" />
      <div className="border-gradient-top" />
      <div className="inner-content">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

