import React from 'react'

interface NbLogoProps {
  className?: string
}

const NbLogo = ({ className }: NbLogoProps) => {
  // Determine if it's a small size based on className
  const isSmall = className?.includes('w-6') || className?.includes('w-8');
  
  return (
    <div className={`flex items-center justify-center bg-primary-gradient rounded-lg ${className || 'w-9 h-9'}`}>
      <span className={`text-primary-foreground font-bold relative inline-block ${isSmall ? 'text-sm' : 'text-2xl'}`}>
        n.
        <span 
          className={`absolute italic font-bold transform -rotate-12 ${isSmall ? '-top-1 left-0 text-[6px]' : '-top-2 left-2 text-[8px]'}`}
          style={{ fontFamily: 'Quintessential, cursive' }}
        >
          pro
        </span>
      </span>
    </div>
  )
}

export default NbLogo

