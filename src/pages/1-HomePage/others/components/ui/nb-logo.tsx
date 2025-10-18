import React from 'react'

interface NbLogoProps {
  className?: string
}

const NbLogo = ({ className }: NbLogoProps) => {
  return (
    <div className={`w-12 h-12 flex items-center justify-center ${className || ''}`}>
      <span className="text-primary-foreground font-bold text-xl relative inline-block">
        n.
        <span 
          className="absolute -top-2 left-2 text-[9px] italic font-bold transform -rotate-12" 
          style={{ fontFamily: 'Quintessential, cursive' }}
        >
          pro
        </span>
      </span>
    </div>
  )
}

export default NbLogo

