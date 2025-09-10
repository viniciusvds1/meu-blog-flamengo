'use client';

const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Flamengo-themed spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-red-600 rounded-full animate-spin`} />
        
        {/* Inner spinning element */}
        <div className={`absolute inset-2 border-2 border-transparent border-b-red-400 rounded-full animate-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      
      {/* Loading text */}
      {text && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">{text}</p>
          <p className="text-sm text-gray-500 mt-1">Preparando o melhor do Mengão...</p>
        </div>
      )}
      
      {/* Animated dots */}
      <div className="flex gap-1 mt-3">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
};

export default LoadingSpinner;