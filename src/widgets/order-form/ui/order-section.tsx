import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type Control,
} from "react-hook-form";
import {
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPES,
  LOAD_TYPE_LABELS,
  LOAD_TYPES,
  type OrderFormValues,
} from "@/entities/order";
import { carrierApi } from "@/entities/carrier";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type OrderSectionProps = {
  control: Control<OrderFormValues>;
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
};

export function OrderSection({ control, register, errors }: OrderSectionProps) {
  const carriersQuery = useQuery({
    queryKey: ["carriers"],
    queryFn: () => carrierApi.getCarriers(),
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 font-semibold text-slate-950">2. Order</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Carrier</Label>
          <Controller
            control={control}
            name="carrierId"
            render={({ field }) => (
              <>
                <Input
                  list="carriers"
                  aria-invalid={Boolean(errors.carrierId)}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
                <datalist id="carriers">
                  {(carriersQuery.data ?? []).map((carrier) => (
                    <option key={carrier.id} value={carrier.id}>
                      {carrier.name} ({carrier.mcNumber})
                    </option>
                  ))}
                </datalist>
              </>
            )}
          />
          {errors.carrierId?.message ? (
            <p className="text-sm text-red-500">{errors.carrierId.message}</p>
          ) : null}
        </div>
        <SelectField
          control={control}
          name="equipmentType"
          label="Equipment Type"
          values={EQUIPMENT_TYPES}
          labels={EQUIPMENT_TYPE_LABELS}
        />
        <SelectField
          control={control}
          name="loadType"
          label="Load Type"
          values={LOAD_TYPES}
          labels={LOAD_TYPE_LABELS}
        />
        <Field label="Rate" error={errors.rate?.message}>
          <Input
            type="number"
            aria-invalid={Boolean(errors.rate)}
            {...register("rate", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Weight" error={errors.weight?.message}>
          <Input
            type="number"
            aria-invalid={Boolean(errors.weight)}
            {...register("weight", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Notes" error={errors.notes?.message}>
          <Textarea {...register("notes")} />
        </Field>
      </div>
    </section>
  );
}

type SelectFieldProps<
  TName extends "equipmentType" | "loadType",
  TValue extends string,
> = {
  control: Control<OrderFormValues>;
  name: TName;
  label: string;
  values: TValue[];
  labels: Record<TValue, string>;
};

function SelectField<
  TName extends "equipmentType" | "loadType",
  TValue extends string,
>({ control, name, label, values, labels }: SelectFieldProps<TName, TValue>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {values.map((value) => (
                <SelectItem key={value} value={value}>
                  {labels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
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
