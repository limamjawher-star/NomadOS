import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  onClick,
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const svgSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Emblem Icon */}
      <div
        className={`${iconSize} relative rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 p-[1.5px] shadow-md shadow-orange-500/25 ${
          onClick ? 'group-hover:shadow-lg group-hover:shadow-orange-500/35 group-hover:scale-105 transition-all duration-300' : ''
        }`}
      >
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xs"
          >
            {/* Compass / Waypoint / Globe Geometric Path */}
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.35" />
            <path
              d="M12 3V21M3 12H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.25"
              strokeDasharray="2 2"
            />
            {/* Dynamic Nomad Waypoint Compass Arrow */}
            <path
              d="M14.8 9.2L11 11.2L9.2 14.8L13 12.8L14.8 9.2Z"
              fill="white"
            />
            <polygon
              points="14.8,9.2 12,12 11,11.2"
              fill="#FEF08A"
            />
            <polygon
              points="9.2,14.8 12,12 13,12.8"
              fill="#FED7AA"
            />
          </svg>
        </div>
        {/* Subtle glowing ring dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-white" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${textSize} font-semibold tracking-tight text-stone-900`}>
            Nomad<span className="text-orange-600">OS</span>
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-orange-700 text-[10px] font-semibold uppercase tracking-wider">
              2026
            </span>
          )}
        </div>
        <span className="text-[10px] font-normal text-stone-400 tracking-wide -mt-0.5">
          Global Life OS
        </span>
      </div>
    </div>
  );
};
