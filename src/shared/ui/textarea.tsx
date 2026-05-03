import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
