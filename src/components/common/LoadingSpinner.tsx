import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean; // Para centrarlo en toda la pantalla
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  const spinner = (
    <div 
      className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light"
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen w-screen fixed inset-0 bg-white/50 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  // Versión simple (como en tu App.tsx)
  return spinner;
};

export default LoadingSpinner;