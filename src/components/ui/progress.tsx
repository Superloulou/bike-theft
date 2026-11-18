'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/80',
      className,
    )}
    value={value}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 rounded-full bg-indigo-600 transition-transform duration-500 ease-out',
        indicatorClassName,
      )}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = 'Progress';

export { Progress };
