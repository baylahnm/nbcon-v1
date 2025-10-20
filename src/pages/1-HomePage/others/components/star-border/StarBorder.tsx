import React from 'react';
import './StarBorder.css';

interface StarBorderProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

const StarBorder: React.FC<StarBorderProps> = ({
  as = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style: customStyle,
}) => {
  const Component = as;
  const style = {
    '--star-color': color,
    '--star-speed': speed,
    '--star-thickness': `${thickness}px`,
    ...customStyle,
  } as React.CSSProperties;

  const props: Record<string, unknown> = {
    className: `star-border-container ${className}`,
    style,
  };

  if (onClick) props.onClick = onClick;
  if (onMouseEnter) props.onMouseEnter = onMouseEnter;
  if (onMouseLeave) props.onMouseLeave = onMouseLeave;

  return (
    <Component {...(props as any)}>
      <div className="border-gradient-bottom" />
      <div className="border-gradient-top" />
      <div className="inner-content">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
