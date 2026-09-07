import React, { useState } from 'react';

interface CountryFlagProps {
  code: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  indonesia: 'id',
  portugal: 'pt',
  spain: 'es',
  france: 'fr',
  germany: 'de',
  italy: 'it',
  thailand: 'th',
  japan: 'jp',
  mexico: 'mx',
  colombia: 'co',
  'united states': 'us',
  usa: 'us',
  'united kingdom': 'gb',
  uk: 'gb',
  bulgaria: 'bg',
  greece: 'gr',
  croatia: 'hr',
  netherlands: 'nl',
  vietnam: 'vn',
  brazil: 'br',
  canada: 'ca',
  australia: 'au',
  georgia: 'ge',
  montenegro: 'me',
  albania: 'al',
  cyprus: 'cy',
  global: 'un',
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  name,
  size = 'sm',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Normalize code (can be 2-letter ISO or country name)
  let iso = (code || '').toLowerCase().trim();
  if (iso.length > 2 && COUNTRY_NAME_TO_CODE[iso]) {
    iso = COUNTRY_NAME_TO_CODE[iso];
  } else if (name && COUNTRY_NAME_TO_CODE[name.toLowerCase().trim()]) {
    iso = COUNTRY_NAME_TO_CODE[name.toLowerCase().trim()];
  }

  // Dimension sizes
  const sizeClasses = {
    xs: 'w-3.5 h-2.5 rounded-xs',
    sm: 'w-4.5 h-3.5 rounded-sm',
    md: 'w-6 h-4 rounded-sm',
    lg: 'w-8 h-5.5 rounded-md',
  };

  if (!iso || iso.length !== 2 || hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center font-mono font-black text-[9px] uppercase tracking-tighter bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.5 rounded ${className}`}
        title={name || code}
      >
        {code ? code.slice(0, 3).toUpperCase() : 'GLB'}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      alt={name || code}
      onError={() => setHasError(true)}
      className={`inline-block object-cover shadow-xs border border-black/10 shrink-0 select-none ${sizeClasses[size]} ${className}`}
      loading="lazy"
    />
  );
};
