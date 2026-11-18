'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-2.5', className)}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-5 w-5 shrink-0 rounded-full border border-zinc-300 bg-white text-white shadow-xs transition-all duration-200 ease-out',
      'hover:border-zinc-400',
      'focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/25',
      'data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex h-full w-full items-center justify-center">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
