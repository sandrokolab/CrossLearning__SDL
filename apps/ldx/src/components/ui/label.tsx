import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium leading-none text-slate-800', className)} {...props} />;
}

export { Label };
