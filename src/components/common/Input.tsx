import React from 'react';

export type InputSize = 'sm' | 'md';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-xs',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      containerClassName = '',
      inputSize = 'md',
      required,
      disabled,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : null;

    const borderStyles = hasError
      ? 'border-[#C81E2B] focus:border-[#C81E2B] focus:ring-1 focus:ring-[#C81E2B]'
      : 'border-[#CBD5E1] focus:border-[#1D63B8] focus:ring-1 focus:ring-[#1D63B8]';

    const paddingLeft = leftIcon ? 'pl-9' : '';
    const paddingRight = rightIcon ? 'pr-9' : '';

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName}`.trim()}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#475569] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#C81E2B] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-2.5 flex items-center justify-center pointer-events-none text-[#64748B]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            className={`w-full bg-[#F8FAFC] border rounded-md text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed ${sizeStyles[inputSize]} ${borderStyles} ${paddingLeft} ${paddingRight} ${className}`.trim()}
            {...rest}
          />

          {rightIcon && (
            <div className="absolute right-2.5 flex items-center justify-center text-[#64748B]">
              {rightIcon}
            </div>
          )}
        </div>

        {errorMessage && (
          <span className="text-[11px] text-[#C81E2B] font-medium leading-none">
            {errorMessage}
          </span>
        )}

        {!errorMessage && helperText && (
          <span className="text-[11px] text-[#64748B] leading-none">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
