import React from 'react'

interface NbLogoProps {
  className?: string
}

const NbLogo = ({ className }: NbLogoProps) => {
  return (
    <div className={`w-8 h-8 bg-primary rounded-lg flex items-center justify-center ${className || ''}`}>
      <span className="text-primary-foreground font-bold text-sm relative inline-block">
        n.
        <span 
          className="absolute -top-1.5 left-1.5 text-[6px] italic font-bold transform -rotate-12" 
          style={{ fontFamily: 'Quintessential, cursive' }}
        >
          pro
        </span>
      </span>
    </div>
  )
}

export default NbLogo

