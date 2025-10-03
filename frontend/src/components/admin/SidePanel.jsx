import React, { useEffect, useRef } from 'react'

const sizeToClasses = {
  sm: 'w-[88vw] sm:w-[420px] md:w-[460px] lg:w-[480px]',
  md: 'w-[90vw] sm:w-[500px] md:w-[560px] lg:w-[600px]',
  lg: 'w-[92vw] sm:w-[560px] md:w-[640px] lg:w-[720px]'
}

const SidePanel = ({ title, isOpen, onClose, children, size = 'md' }) => {
  const panelRef = useRef()

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
      if (panelRef.current) panelRef.current.focus()
    }
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="flex-1 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close side panel overlay"
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        className={`${sizeToClasses[size] || sizeToClasses.md} max-h-[85vh] h-auto my-4 bg-gradient-to-b from-gray-900 to-gray-950 border-l border-gray-800 shadow-2xl focus:outline-none rounded-l-2xl transform transition-transform duration-300 ease-out`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Close side panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(85vh-56px)]">
          {children}
        </div>
      </aside>
    </div>
  )
}

export default SidePanel


