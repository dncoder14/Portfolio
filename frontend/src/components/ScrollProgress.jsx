import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollProgress = () => {
  const progressRef = useRef()

  useEffect(() => {
    // Create scroll progress animation
    gsap.to(progressRef.current, {
      scaleY: 1,
      transformOrigin: 'top',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // Optional: Add any additional effects based on scroll progress
        }
      }
    })

    // Animate progress bar on mount
    gsap.fromTo(progressRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.5, ease: "power2.out" }
    )
  }, [])

  return (
    <div className="fixed top-0 left-0 w-1 h-full bg-gray-800 z-40">
      <div
        ref={progressRef}
        className="w-full bg-gradient-to-b from-green-400 to-green-600 origin-top"
        style={{ scaleY: 0 }}
      />
    </div>
  )
}

export default ScrollProgress
