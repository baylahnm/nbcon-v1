import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

interface NbconLogoProps {
  className?: string
  showMobileMenu?: boolean
  onMobileMenuClick?: () => void
}

const NbconLogo = ({ className, showMobileMenu = false, onMobileMenuClick }: NbconLogoProps) => {
  return (
    <div className={cn('flex w-full justify-between lg:w-auto', className)}>
      <Link
        to="/"
        aria-label="home"
        className="flex items-center space-x-2"
      >
        <div className="flex items-center">
          <div className="relative inline-block">
            <span 
              className="absolute -top-2 right-3 text-sm italic font-bold transform -rotate-12 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-[rainbow_3s_linear_infinite]" 
              style={{ 
                fontFamily: 'Quintessential, cursive',
                backgroundSize: '200% 100%'
              }}
            >
              pro
            </span>
            <div className="flex flex-col items-start relative top-1">
              <h1 className="text-2xl font-bold text-foreground leading-none tracking-tight" style={{ fontFamily: 'Carter One, cursive' }}>
                nbcon.
              </h1>
              <p className="text-primary text-[8px] tracking-[0.3em] mt-0.5 lowercase relative -top-1.5 left-1.5 font-bold" style={{ fontFamily: 'Alice, serif' }}>
                enterprise
              </p>
            </div>
          </div>
        </div>
      </Link>
      
      {showMobileMenu && (
        <button
          className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
          aria-label="Open Menu"
          onClick={onMobileMenuClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200"
          >
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      )}
    </div>
  )
}

export default NbconLogo
