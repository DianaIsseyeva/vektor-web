import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
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
  const [carrierSearch, setCarrierSearch] = useState("");
  const [isCarrierOpen, setIsCarrierOpen] = useState(false);
  const carriersQuery = useQuery({
    queryKey: ["carriers", carrierSearch],
    queryFn: () => carrierApi.getCarriers({ search: carrierSearch }),
  });
  const carriers = useMemo(
    () => carriersQuery.data ?? [],
    [carriersQuery.data],
  );

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
              <div className="relative">
                <Input
                  aria-invalid={Boolean(errors.carrierId)}
                  value={carrierSearch}
                  onBlur={field.onBlur}
                  onFocus={() => setIsCarrierOpen(true)}
                  onChange={(event) => {
                    setCarrierSearch(event.target.value);
                    setIsCarrierOpen(true);
                  }}
                  placeholder="Search carrier by name or MC #"
                />
                {isCarrierOpen ? (
                  <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-lg">
                    {carriers.map((carrier) => (
                      <button
                        key={carrier.id}
                        type="button"
                        className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                        onClick={() => {
                          field.onChange(carrier.id);
                          setCarrierSearch(
                            `${carrier.name} (${carrier.mcNumber})`,
                          );
                          setIsCarrierOpen(false);
                        }}
                      >
                        <span className="font-medium text-slate-900">
                          {carrier.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {carrier.mcNumber}
                        </span>
                      </button>
                    ))}
                    {carriers.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        No carriers found
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <input type="hidden" value={field.value} readOnly />
              </div>
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
