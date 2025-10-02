import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef()
  const titleRef = useRef()
  const contentRef = useRef()
  const imageRef = useRef()
  const { userInfo } = useApp()

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    })

    // Initial setup
    gsap.set([titleRef.current, contentRef.current, imageRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate elements
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .to(imageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")

    // Parallax effect for image
    gsap.to(imageRef.current, {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h2
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              About Me
            </h2>

            <div ref={contentRef} className="space-y-6">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {userInfo?.summary || 'I am a passionate Full-Stack Developer with a strong focus on creating exceptional user experiences through modern web technologies.'}
              </p>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                With expertise in React, Node.js, and modern JavaScript frameworks, I specialize in building scalable web applications that combine beautiful design with robust functionality. My journey in web development has been driven by a constant desire to learn and implement cutting-edge technologies.
              </p>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I believe in the power of technology to solve real-world problems and create meaningful impact.
              </p>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    <strong className="text-white">Location:</strong> {userInfo?.location || 'Pune, India'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    <strong className="text-white">Email:</strong> {userInfo?.email || 'dhiraj.pandit@adypu.edu.in'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    <strong className="text-white">Experience:</strong> 3+ Years
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    <strong className="text-white">Status:</strong> Available for Work
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-6 py-3 text-white bg-transparent border-2 border-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 rounded-lg"
                >
                  View My Work
                </button>
                <button
                  onClick={() => window.open(userInfo?.socialLinks?.github || '#', '_blank')}
                  className="inline-flex items-center px-6 py-3 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub Profile
                </button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
              {userInfo?.profileImage ? (
                <img
                  src={userInfo.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full ${userInfo?.profileImage ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-green-400 to-green-600`}
              >
                <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-6xl font-bold text-black">
                  DP
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-600 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-green-500 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
