import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const sectionRef = useRef()
  const titleRef = useRef()
  const projectsRef = useRef()
  const { projects } = useApp()

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

    gsap.set(projectsRef.current?.children, {
      opacity: 0,
      y: 100,
      scale: 0.9
    })

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    // Animate projects with stagger
    tl.to(projectsRef.current?.children, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4")

    // Hover animations for project cards
    if (projectsRef.current?.children) {
      Array.from(projectsRef.current.children).forEach((projectCard) => {
      const image = projectCard.querySelector('.project-image')
      const overlay = projectCard.querySelector('.project-overlay')
      const content = projectCard.querySelector('.project-content')

      projectCard.addEventListener('mouseenter', () => {
        gsap.to(projectCard, {
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(image, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(content, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      projectCard.addEventListener('mouseleave', () => {
        gsap.to(projectCard, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(image, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        })
        gsap.to(content, {
          y: 20,
          duration: 0.3,
          ease: "power2.out"
        })
      })
      })
    }

  }, [projects])

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Featured Projects
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my recent work and projects that demonstrate my skills and passion for web development.
          </p>
        </div>

        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="project-image w-full h-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center text-4xl font-bold text-green-400"
                  style={{ backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none' }}
                >
                  {!project.imageUrl && project.title.charAt(0)}
                </div>
                
                {/* Overlay */}
                <div className="project-overlay absolute inset-0 bg-black/70 opacity-0 flex items-center justify-center">
                  <div className="project-content text-center transform translate-y-5">
                    <div className="flex space-x-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-300"
                          aria-label="View on GitHub"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-300"
                          aria-label="View Live Demo"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-green-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-300"
                    >
                      Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-green-400 hover:bg-green-500 text-black text-sm rounded-lg transition-colors duration-300"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.open('https://github.com/dncoder14', '_blank')}
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-transparent border-2 border-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 rounded-lg"
          >
            View All Projects
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Projects
