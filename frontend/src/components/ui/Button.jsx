import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Button = ({ className, variant = 'primary', size = 'default', isLoading, children, ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700',
    secondary: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
  };

  const sizes = {
    default: 'px-6 py-3 rounded-2xl text-sm font-bold',
    sm: 'px-4 py-2 rounded-xl text-xs font-bold',
    lg: 'px-8 py-4 rounded-[1.25rem] text-base font-bold',
    icon: 'p-3 rounded-xl'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        'btn-premium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : children}
    </motion.button>
  );
};

export default Button;
