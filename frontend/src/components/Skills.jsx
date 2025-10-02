import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

const Skills = () => {
  const sectionRef = useRef()
  const titleRef = useRef()
  const skillsRef = useRef()
  const { userInfo } = useApp()

  // Use new skills with logos if available, fallback to old format
  const skills = userInfo?.skillsWithLogos || userInfo?.skills || [
    { name: 'React', icon: '⚛️', level: 90 },
    { name: 'JavaScript', icon: '🟨', level: 95 },
    { name: 'Node.js', icon: '🟢', level: 85 },
    { name: 'Python', icon: '🐍', level: 80 },
    { name: 'MySQL', icon: '🗄️', level: 85 },
    { name: 'MongoDB', icon: '🍃', level: 75 },
    { name: 'Tailwind CSS', icon: '🎨', level: 90 },
    { name: 'GSAP', icon: '✨', level: 85 },
    { name: 'Three.js', icon: '🎮', level: 70 },
    { name: 'Prisma', icon: '🔧', level: 80 }
  ]

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

    gsap.set(skillsRef.current?.children, {
      opacity: 0,
      y: 50,
      scale: 0.8
    })

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    // Animate skills with stagger
    tl.to(skillsRef.current?.children, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.4")

    // Hover animations for skill cards
    if (skillsRef.current?.children) {
      Array.from(skillsRef.current.children).forEach((skillCard) => {
        skillCard.addEventListener('mouseenter', () => {
          gsap.to(skillCard, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out"
          })
        })

        skillCard.addEventListener('mouseleave', () => {
          gsap.to(skillCard, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        })
      })
    }

  }, [])

  return (
    <section 
      id="skills" 
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
            Skills & Technologies
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive overview of the technologies and tools I work with to create amazing digital experiences.
          </p>
        </div>

        <div 
          ref={skillsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-all duration-300 cursor-pointer"
            >
              {/* Skill Icon/Logo */}
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                {skill.logoSvg ? (
                  <span
                    className="w-12 h-12"
                    dangerouslySetInnerHTML={{ __html: skill.logoSvg }}
                  />
                ) : skill.logoUrl ? (
                  <img 
                    src={skill.logoUrl} 
                    alt={skill.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                <div 
                  className={`text-4xl ${(skill.logoSvg || skill.logoUrl) ? 'hidden' : 'block'}`}
                  style={{ display: (skill.logoSvg || skill.logoUrl) ? 'none' : 'block' }}
                >
                  {skill.icon || '🔧'}
                </div>
              </div>

              {/* Skill Name */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                {skill.name}
              </h3>

              {/* No proficiency display anymore */}

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">3+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
