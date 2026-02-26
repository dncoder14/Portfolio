import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

const Experience = () => {
  const sectionRef = useRef()
  const titleRef = useRef()
  const timelineRef = useRef()
  const { experiences } = useApp()

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    })

    gsap.set([titleRef.current], { opacity: 0, y: 50 })
    gsap.set('.exp-item', { opacity: 0, scale: 0.8 })
    gsap.set('.branch-line', { scaleX: 0 })

    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    
    experiences.forEach((_, index) => {
      tl.to(`.branch-line-${index}`, { scaleX: 1, duration: 0.4, ease: "power2.out" }, `-=0.2`)
        .to(`.exp-item-${index}`, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, `-=0.2`)
    })
  }, [experiences])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <section id="experience" ref={sectionRef} className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'JetBrains Mono' }}>
            Experience Journey
          </h2>
          <p className="text-lg text-gray-400">My professional path through the tech industry</p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Main vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-green-500 to-green-600 transform -translate-x-1/2 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>

          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0
            return (
              <div key={exp.id} className="relative mb-24 last:mb-0">
                {/* Branch line */}
                <div className={`branch-line branch-line-${index} absolute top-8 w-16 h-0.5 bg-green-400 ${isLeft ? 'right-1/2 origin-right' : 'left-1/2 origin-left'}`}></div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 top-8 w-5 h-5 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-black shadow-[0_0_15px_rgba(34,197,94,0.6)] z-10"></div>

                {/* Content card */}
                <div className={`exp-item exp-item-${index} ${isLeft ? 'pr-[calc(50%+4rem)]' : 'pl-[calc(50%+4rem)]'}`}>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-400 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{exp.position}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {exp.companyLogo && <img src={exp.companyLogo} alt={exp.company} className="w-6 h-6 rounded object-cover" />}
                          <p className="text-green-400 font-semibold text-sm">{exp.company}</p>
                        </div>
                      </div>
                      {exp.current && <span className="px-3 py-1 bg-green-400 text-black text-xs font-bold rounded-full">Current</span>}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          {exp.location}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies?.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded border border-gray-700">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
