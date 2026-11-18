import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-24 w-full rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 text-[15px] text-zinc-900 shadow-xs transition-all duration-200 ease-out',
      'placeholder:text-zinc-400',
      'focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/25',
      'disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500',
      'aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:ring-2 aria-[invalid=true]:focus-visible:ring-rose-500/25',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
