import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'

function AnimatedSphere() {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 4,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#00ff00"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
        metalness={0.8}
      />
    </Sphere>
  )
}

function Preloader() {
  const preloaderRef = useRef()
  const textRef = useRef()
  const progressRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial setup
    gsap.set([textRef.current, progressRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate text in
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })

    // Animate progress bar
    tl.to(progressRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.5")

    // Animate progress bar fill
    tl.to(progressRef.current.querySelector('.progress-fill'), {
      width: '100%',
      duration: 2,
      ease: "power2.inOut"
    })

    // Animate text out
    tl.to([textRef.current, progressRef.current], {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: "power3.in"
    })

    // Animate preloader out
    tl.to(preloaderRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: "power3.in"
    })

    // Hide preloader
    tl.set(preloaderRef.current, {
      display: 'none'
    })

  }, [])

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0">
        <Canvas ref={canvasRef} camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        <h1
          ref={textRef}
          className="text-6xl md:text-8xl font-bold text-white mb-8"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          DHIRAJ
        </h1>
        
        <div
          ref={progressRef}
          className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto"
        >
          <div 
            className="progress-fill h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            style={{ width: '0%' }}
          />
        </div>

        <p className="text-gray-400 mt-4 text-lg">
          Loading Portfolio...
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Preloader
