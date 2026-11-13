import React from 'react';
import { ChevronDownIcon } from './Icons';

export type SelectSize = 'sm' | 'md';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string | boolean;
  containerClassName?: string;
  selectSize?: SelectSize;
  options?: SelectOption[];
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'px-2.5 py-1.5 pr-8 text-xs',
  md: 'px-3 py-2 pr-8 text-xs',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      containerClassName = '',
      selectSize = 'md',
      required,
      disabled,
      className = '',
      children,
      id,
      ...rest
    },
    ref
  ) => {
    const selectId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : null;

    const borderStyles = hasError
      ? 'border-[#C81E2B] focus:border-[#C81E2B] focus:ring-1 focus:ring-[#C81E2B]'
      : 'border-[#CBD5E1] focus:border-[#1D63B8] focus:ring-1 focus:ring-[#1D63B8]';

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName}`.trim()}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#475569] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#C81E2B] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            className={`w-full appearance-none bg-[#F8FAFC] border rounded-md text-[#0F172A] outline-none cursor-pointer transition-colors disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed ${sizeStyles[selectSize]} ${borderStyles} ${className}`.trim()}
            {...rest}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-2.5 flex items-center justify-center pointer-events-none text-[#64748B]">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </div>
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

Select.displayName = 'Select';
