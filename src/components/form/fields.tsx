'use client';

import { AlertCircle } from 'lucide-react';
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-[13px] font-medium leading-snug text-rose-600"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

interface ShellProps {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ label, htmlFor, hint, optional, error, children, className }: ShellProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional ? (
          <span className="text-xs font-normal text-zinc-400">Facultatif</span>
        ) : null}
      </div>
      {children}
      {hint && !error ? (
        <p className="text-[13px] leading-snug text-zinc-500">{hint}</p>
      ) : null}
      <FieldError message={error} />
    </div>
  );
}

type BaseProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  optional?: boolean;
  error?: string;
  className?: string;
};

export function TextField({
  label,
  value,
  onValueChange,
  hint,
  optional,
  error,
  className,
  ...props
}: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'id'>) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      optional={optional}
      error={error}
      className={className}
    >
      <Input
        id={id}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FieldShell>
  );
}

export function TextareaField({
  label,
  value,
  onValueChange,
  hint,
  optional,
  error,
  className,
  ...props
}: BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'id'>) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      optional={optional}
      error={error}
      className={className}
    >
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Sélectionner…',
  hint,
  optional,
  error,
  className,
}: BaseProps & {
  options: readonly string[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      optional={optional}
      error={error}
      className={className}
    >
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger id={id} aria-invalid={error ? true : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

export function RadioField({
  label,
  value,
  onValueChange,
  options,
  hint,
  optional,
  error,
  className,
  columns = 1,
}: BaseProps & {
  options: readonly string[];
  columns?: 1 | 2 | 3;
}) {
  const name = useId();
  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className="flex items-center gap-2 text-sm font-medium leading-none text-zinc-800">
        {label}
        {optional ? <span className="text-xs font-normal text-zinc-400">Facultatif</span> : null}
      </legend>
      <RadioGroup
        name={name}
        value={value}
        onValueChange={onValueChange}
        className={cn(
          'mt-2',
          columns === 1 && 'grid gap-2',
          columns === 2 && 'grid gap-2 sm:grid-cols-2',
          columns === 3 && 'grid gap-2 sm:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              'flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 text-[15px] text-zinc-800 transition-all duration-200 ease-out',
              'hover:border-zinc-300 hover:bg-zinc-50',
              'has-[:focus-visible]:border-indigo-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-600/25',
              value === option && 'border-indigo-300 bg-indigo-50/60 text-zinc-900',
            )}
          >
            <RadioGroupItem value={option} />
            <span className="leading-snug">{option}</span>
          </label>
        ))}
      </RadioGroup>
      {hint && !error ? <p className="text-[13px] leading-snug text-zinc-500">{hint}</p> : null}
      <FieldError message={error} />
    </fieldset>
  );
}

export function CheckboxField({
  label,
  description,
  checked,
  onCheckedChange,
  error,
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border border-zinc-200/80 bg-white p-3.5 transition-all duration-200 ease-out',
          'hover:border-zinc-300 hover:bg-zinc-50',
          error && 'border-rose-300 bg-rose-50/40',
        )}
      >
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(state) => onCheckedChange(state === true)}
          className="mt-0.5"
        />
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="cursor-pointer font-medium leading-snug">
            {label}
          </Label>
          {description ? (
            <p className="text-[13px] leading-relaxed text-zinc-500">{description}</p>
          ) : null}
        </div>
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function Fieldset({
  legend,
  description,
  children,
  className,
}: {
  legend: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn('flex flex-col gap-5', className)}>
      <legend className="mb-1 text-sm font-semibold tracking-tight text-zinc-900">
        {legend}
      </legend>
      {description ? (
        <p className="-mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-500">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
