import React from 'react'

interface NbLogoProps {
  className?: string
}

const NbLogo = ({ className }: NbLogoProps) => {
  // Determine if it's a small size based on className
  const isSmall = className?.includes('w-6') || className?.includes('w-8');
  
  return (
    <div className={`flex items-center justify-center ${className || 'w-12 h-12'}`}>
      <span className={`text-primary-foreground font-bold relative inline-block ${isSmall ? 'text-sm' : 'text-xl'}`}>
        n.
        <span 
          className={`absolute italic font-bold transform -rotate-12 ${isSmall ? '-top-1 left-1 text-[5px]' : '-top-2 left-2 text-[9px]'}`}
          style={{ fontFamily: 'Quintessential, cursive' }}
        >
          pro
        </span>
      </span>
    </div>
  )
}

export default NbLogo

