'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export default function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon - Inspired by modern tech logos */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Main logo symbol - Abstract "B" with chart elements */}
        <svg className="w-2/3 h-2/3 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
          {/* Letter B with modern styling */}
          <path d="M6 4h7c2.2 0 4 1.8 4 4 0 1.1-.4 2.1-1.1 2.8.7.7 1.1 1.7 1.1 2.8 0 2.2-1.8 4-4 4H6V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M6 11h6c1.1 0 2-.9 2-2s-.9-2-2-2H6v4z" fill="currentColor"/>
          <path d="M6 15h7c1.1 0 2-.9 2-2s-.9-2-2-2H6v4z" fill="currentColor"/>
          
          {/* Chart elements - small ascending bars */}
          <g opacity="0.8">
            <rect x="16" y="18" width="1.5" height="2" fill="currentColor" rx="0.5"/>
            <rect x="18" y="16" width="1.5" height="4" fill="currentColor" rx="0.5"/>
            <rect x="20" y="14" width="1.5" height="6" fill="currentColor" rx="0.5"/>
          </g>
        </svg>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
      </div>

      {/* Text Logo */}
      {variant === 'full' && (
        <div>
          <h1 className={`${textSizes[size]} font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight`}>
            BetTracker
          </h1>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">PRO</span>
            <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}