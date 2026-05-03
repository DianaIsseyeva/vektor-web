import type { ReactNode } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { OrderFormValues } from "@/entities/order";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

type ClientSectionProps = {
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
};

export function ClientSection({ register, errors }: ClientSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 font-semibold text-slate-950">1. Client</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client Name" error={errors.clientName?.message}>
          <Input
            aria-invalid={Boolean(errors.clientName)}
            {...register("clientName")}
          />
        </Field>
        <Field label="Reference #" error={errors.referenceNumber?.message}>
          <Input
            aria-invalid={Boolean(errors.referenceNumber)}
            {...register("referenceNumber")}
          />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
