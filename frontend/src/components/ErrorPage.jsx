import React from 'react'

function ErrorPage({ onRetry }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Unable to Load Portfolio
          </h1>
          
          <p className="text-gray-300 mb-8">
            We're having trouble connecting to the server. This might be due to:
          </p>
          
          <ul className="text-left text-gray-400 mb-8 space-y-2">
            <li>• Server is starting up (cold start)</li>
            <li>• Network connectivity issues</li>
            <li>• Temporary server maintenance</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
          
          <div className="text-sm text-gray-500">
            Or contact me directly at{' '}
            <a 
              href="mailto:dhiraj.pandit@adypu.edu.in" 
              className="text-green-400 hover:text-green-300"
            >
              dhiraj.pandit@adypu.edu.in
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Meanwhile, you can check out my work on{' '}
            <a 
              href="https://github.com/dhiraj-pandit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              GitHub
            </a>
            {' '}or connect on{' '}
            <a 
              href="https://linkedin.com/in/dhiraj-pandit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage