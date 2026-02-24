import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 shadow-lg shadow-green-900/20',
        secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
        outline: 'border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10',
        ghost: 'hover:bg-white/5 text-gray-300 hover:text-white',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-lg px-8 text-lg',
        icon: 'h-10 w-10',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
