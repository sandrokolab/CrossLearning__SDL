import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const ariaLabel =
    props['aria-label'] ??
    (typeof props.placeholder === 'string' ? props.placeholder : undefined) ??
    (typeof props.name === 'string' ? props.name : undefined) ??
    'Area de texto';

  return (
    <textarea
      data-slot="textarea"
      aria-label={ariaLabel}
      className={cn(
        'flex min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs transition-colors outline-none placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
