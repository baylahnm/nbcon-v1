"use client"

import { motion } from "framer-motion"
import { ReactNode, useRef, useEffect, useState } from "react"
import { cn } from "../../lib/utils"

interface TimelineContentProps {
  children: ReactNode
  animationNum?: number
  timelineRef?: React.RefObject<HTMLElement>
  customVariants?: any
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as: Component = "div",
  ...props
}: TimelineContentProps) {
  const [isInView, setIsInView] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!timelineRef?.current || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [timelineRef])

  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hidden: {
      y: 50,
      opacity: 0,
    },
  }

  const variants = customVariants || defaultVariants

  return (
    <Component
      ref={elementRef}
      className={cn(className)}
      {...props}
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        custom={animationNum}
      >
        {children}
      </motion.div>
    </Component>
  )
}

