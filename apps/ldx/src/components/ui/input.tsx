import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const ariaLabel =
    props['aria-label'] ??
    (typeof props.placeholder === 'string' ? props.placeholder : undefined) ??
    (typeof props.name === 'string' ? props.name : undefined) ??
    'Campo de entrada';

  return (
    <input
      type={type}
      data-slot="input"
      aria-label={ariaLabel}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs transition-colors outline-none placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
