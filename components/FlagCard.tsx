import React from 'react';

interface FlagCardProps {
  isoCode: string;
  onClick: () => void;
  status: 'default' | 'correct' | 'wrong' | 'dimmed';
  disabled: boolean;
}

export const FlagCard: React.FC<FlagCardProps> = ({ isoCode, onClick, status, disabled }) => {
  let borderColor = 'border-white';
  let opacity = 'opacity-100';
  let scale = 'scale-100';
  let overlayIcon = null;

  if (status === 'correct') {
    borderColor = 'border-kid-green';
    scale = 'scale-105';
    overlayIcon = (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
        <div className="bg-kid-green text-white rounded-full p-2 animate-bounce shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
    );
  } else if (status === 'wrong') {
    borderColor = 'border-kid-pink';
    opacity = 'opacity-80';
    overlayIcon = (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
         <div className="bg-kid-pink text-white rounded-full p-2 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </div>
      </div>
    );
  } else if (status === 'dimmed') {
    opacity = 'opacity-50';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-md 
        border-4 ${borderColor} ${opacity} ${scale}
        transition-all duration-300 pop-in hover:shadow-xl
        ${!disabled && status === 'default' ? 'hover:-translate-y-1 hover:border-kid-blue' : ''}
      `}
    >
      <img
        src={`https://flagcdn.com/w320/${isoCode}.png`}
        srcSet={`https://flagcdn.com/w640/${isoCode}.png 2x`}
        alt="Flag option"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {overlayIcon}
    </button>
  );
};