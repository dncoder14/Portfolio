import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

const Certificates = () => {
  const sectionRef = useRef()
  const titleRef = useRef()
  const certificatesRef = useRef()
  const { certificates } = useApp()

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
    gsap.set([titleRef.current], {
      opacity: 0,
      y: 50
    })

    gsap.set(certificatesRef.current?.children, {
      opacity: 0,
      y: 100,
      rotationY: 15
    })

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    // Animate certificates with stagger
    tl.to(certificatesRef.current?.children, {
      opacity: 1,
      y: 0,
      rotationY: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.4")

    // Hover animations for certificate cards
    if (certificatesRef.current?.children) {
      Array.from(certificatesRef.current.children).forEach((certCard) => {
      certCard.addEventListener('mouseenter', () => {
        gsap.to(certCard, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      certCard.addEventListener('mouseleave', () => {
        gsap.to(certCard, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
      })
    }

  }, [certificates])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <section 
      id="certificates" 
      ref={sectionRef}
      className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Certificates & Achievements
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Professional certifications and achievements that validate my expertise in various technologies and methodologies.
          </p>
        </div>

        <div 
          ref={certificatesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certificates.map((certificate, index) => (
            <div
              key={certificate.id}
              className="group relative bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 cursor-pointer"
            >
              {/* Certificate Image/Icon */}
              <div className="relative mb-6">
                <div className="w-full h-48 rounded-lg flex items-center justify-center overflow-hidden bg-gray-900">
                  {certificate.imageUrl ? (
                    <img 
                      src={certificate.imageUrl} 
                      alt={certificate.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-green-400">
                      🏆
                    </div>
                  )}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => window.open(certificate.certificateUrl, '_blank')}
                    className="px-4 py-2 bg-green-400 text-black rounded-lg font-semibold hover:bg-green-500 transition-colors duration-300"
                  >
                    View Certificate
                  </button>
                </div>
              </div>

              {/* Certificate Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                  {certificate.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">
                      {certificate.organization}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">
                      {formatDate(certificate.date)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={() => window.open(certificate.certificateUrl, '_blank')}
                    className="w-full px-4 py-2 bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-lg transition-all duration-300 font-semibold"
                  >
                    View Certificate
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Additional Achievements */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Additional Achievements</h3>
            <p className="text-gray-300">Recognition and milestones in my professional journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">100+</div>
              <div className="text-gray-300">GitHub Commits</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">25+</div>
              <div className="text-gray-300">Open Source Contributions</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">10+</div>
              <div className="text-gray-300">Technologies Mastered</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">5★</div>
              <div className="text-gray-300">Client Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Certificates
