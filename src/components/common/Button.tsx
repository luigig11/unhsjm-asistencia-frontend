import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#0F3C6E] hover:bg-[#0A294D] text-white border border-[#0F3C6E] shadow-xs focus-visible:ring-[#0F3C6E]',
  secondary: 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1] shadow-xs focus-visible:ring-[#CBD5E1]',
  outline: 'bg-transparent hover:bg-[#EBF3FC] text-[#0F3C6E] border border-[#CBD5E1] focus-visible:ring-[#1D63B8]',
  danger: 'bg-[#C81E2B] hover:bg-[#A51723] text-white border border-[#C81E2B] shadow-xs focus-visible:ring-[#C81E2B]',
  ghost: 'bg-transparent hover:bg-[#F1F5F9] text-[#475569] border border-transparent focus-visible:ring-[#94A3B8]',
  success: 'bg-[#15803D] hover:bg-[#166534] text-white border border-[#15803D] shadow-xs focus-visible:ring-[#15803D]',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-[11px] gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-xs gap-2',
  lg: 'px-4 py-2.5 text-sm gap-2',
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: 'p-1 text-[11px]',
  sm: 'p-1.5 text-xs',
  md: 'p-2 text-xs',
  lg: 'p-2.5 text-sm',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isIconOnly = !children && Boolean(icon);
    const sizeCls = isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size];
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-semibold rounded-md transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeCls} ${className}`.trim()}
        {...rest}
      >
        {isLoading ? (
          <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}

        {children && <span>{children}</span>}

        {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
