import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-[6px] transition-all duration-150 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-white text-kid-blue border-4 border-kid-blue hover:bg-blue-50",
    secondary: "bg-kid-purple text-white border-4 border-kid-purple hover:bg-purple-700",
    success: "bg-kid-green text-white border-4 border-kid-green",
    danger: "bg-kid-pink text-white border-4 border-kid-pink",
  };

  const sizes = {
    md: "py-3 px-6 text-xl",
    lg: "py-4 px-8 text-2xl w-full",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};