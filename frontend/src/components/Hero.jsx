import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

function AnimatedBackground() {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#00ff00"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </Float>
  )
}

const Hero = () => {
  const heroRef = useRef()
  const titleRef = useRef()
  const subtitleRef = useRef()
  const descriptionRef = useRef()
  const socialRef = useRef()
  const ctaRef = useRef()
  const { userInfo } = useApp()
  const hasAnimatedSocial = useRef(false)

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial setup
    gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, socialRef.current, ctaRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate elements in sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      // Reveal the container first
      // Social links animate via a separate effect once data is available
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")

    // Parallax effect on scroll
    gsap.to(heroRef.current, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

  }, [])

  const socialLinks = userInfo?.socialLinks || {}
  
  // Filter social links to only show the ones with URLs
  const filteredSocialLinks = Object.entries(socialLinks).filter(([_, url]) => url && url.trim() !== '')  

  // Animate social links when they become available (handles async data)
  useEffect(() => {
    if (!socialRef.current) return
    if (!filteredSocialLinks.length) return
    if (hasAnimatedSocial.current) return

    // Prepare initial hidden state
    gsap.set(socialRef.current, { opacity: 0, y: 24 })
    const items = socialRef.current.querySelectorAll('a')
    if (items && items.length) {
      gsap.set(items, { opacity: 0, y: 10 })
    }

    // Reveal container then stagger children
    const tl = gsap.timeline()
    tl.to(socialRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(items, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 }, '-=0.2')
      .add(() => { hasAnimatedSocial.current = true })

    return () => {
      tl.kill()
    }
  }, [filteredSocialLinks.length])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedBackground />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          DHIRAJ
        </h1>

        <h2
          ref={subtitleRef}
          className="text-2xl md:text-4xl lg:text-5xl font-light text-green-400 mb-8"
        >
          PANDIT
        </h2>

        <p
          ref={descriptionRef}
          className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {userInfo?.summary || 'Full-Stack Developer & UI/UX Enthusiast'}
        </p>

        {/* Social Links */}
        {filteredSocialLinks.length > 0 && (
          <div
            ref={socialRef}
            className="mx-auto w-fit grid grid-flow-col auto-cols-max place-items-center justify-items-center justify-center items-center gap-4 mb-12 opacity-0"
          >
            {filteredSocialLinks.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-300 inline-flex items-center justify-center w-10 h-10 shrink-0"
                aria-label={platform}
              >
                <span className="inline-flex w-10 h-10 rounded-full items-center justify-center bg-white/0">
                  {platform === 'codeforces' && (
                    <svg className="w-7 h-7" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="22" width="12" height="30" rx="6"/>
                      <rect x="20" y="4" width="12" height="48" rx="6"/>
                      <rect x="36" y="32" width="12" height="20" rx="6"/>
                    </svg>
                  )}
                  {platform === 'codechef' && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.5c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm3-6c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z"/>
                    </svg>
                  )}
                  {platform === 'github' && (
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  {platform === 'linkedin' && (
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {platform === 'leetcode' && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l2.396 2.392a1.378 1.378 0 0 0 1.951.003c.54-.54.54-1.414.003-1.955l-2.396-2.392A5.83 5.83 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                    </svg>
                  )}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-black bg-green-400 hover:bg-green-500 transition-all duration-300 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
          >
            Get In Touch
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          {userInfo?.cvUrl && (
            <a
              href={userInfo.cvUrl}
              download
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-all duration-300 rounded-lg hover:scale-105 hover:shadow-lg"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
