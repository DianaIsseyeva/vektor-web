import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import {
  APPOINTMENT_TYPE_LABELS,
  STOP_TYPE_LABELS,
  type OrderFormValues,
  type Stop,
} from "@/entities/order";
import { Button } from "@/shared/ui/button";
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

type StopsSectionProps = {
  control: Control<OrderFormValues>;
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
};

const appointmentTypes = ["fixed", "window", "fcfs"] as const;
const stopTypes = ["pick_up", "stop", "drop_off"] as const;

function createStop(order: number, type: Stop["type"]): Stop {
  return {
    id: crypto.randomUUID(),
    type,
    order,
    address: { city: "", state: "", zip: "" },
    locationName: "",
    refNumber: "",
    appointmentType: "fixed",
    appointmentDate: "",
    notes: "",
  };
}

export function StopsSection({ control, register, errors }: StopsSectionProps) {
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "stops",
  });
  const stopsError =
    typeof errors.stops?.message === "string"
      ? errors.stops.message
      : undefined;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950">3. Stops</h2>
          <p className="text-sm text-slate-500">
            Stops: {fields.length} | Time: --
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={fields.length >= 5}
          onClick={() =>
            append(
              createStop(
                fields.length + 1,
                fields.length === 0 ? "pick_up" : "stop",
              ),
            )
          }
        >
          <Plus className="size-4" />
          Add Stop
        </Button>
      </div>
      {stopsError ? (
        <p className="mb-3 text-sm text-red-500">{stopsError}</p>
      ) : null}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <Controller
                control={control}
                name={`stops.${index}.type`}
                render={({ field: typeField }) => (
                  <Select
                    value={typeField.value}
                    onValueChange={typeField.onChange}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stopTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {STOP_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                >
                  Up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === fields.length - 1}
                  onClick={() => swap(index, index + 1)}
                >
                  Down
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length <= 2}
                  onClick={() => remove(index)}
                  aria-label="Delete stop"
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="City"
                error={errors.stops?.[index]?.address?.city?.message}
              >
                <Input
                  aria-invalid={Boolean(errors.stops?.[index]?.address?.city)}
                  {...register(`stops.${index}.address.city`)}
                />
              </Field>
              <Field
                label="State"
                error={errors.stops?.[index]?.address?.state?.message}
              >
                <Input
                  aria-invalid={Boolean(errors.stops?.[index]?.address?.state)}
                  {...register(`stops.${index}.address.state`)}
                />
              </Field>
              <Field
                label="ZIP"
                error={errors.stops?.[index]?.address?.zip?.message}
              >
                <Input
                  aria-invalid={Boolean(errors.stops?.[index]?.address?.zip)}
                  {...register(`stops.${index}.address.zip`)}
                />
              </Field>
              <Field
                label="Location name"
                error={errors.stops?.[index]?.locationName?.message}
              >
                <Input {...register(`stops.${index}.locationName`)} />
              </Field>
              <Field
                label="Ref #"
                error={errors.stops?.[index]?.refNumber?.message}
              >
                <Input {...register(`stops.${index}.refNumber`)} />
              </Field>
              <Field
                label="Appointment Date"
                error={errors.stops?.[index]?.appointmentDate?.message}
              >
                <Input
                  type="date"
                  aria-invalid={Boolean(errors.stops?.[index]?.appointmentDate)}
                  {...register(`stops.${index}.appointmentDate`)}
                />
              </Field>
              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Controller
                  control={control}
                  name={`stops.${index}.appointmentType`}
                  render={({ field: typeField }) => (
                    <Select
                      value={typeField.value}
                      onValueChange={typeField.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {APPOINTMENT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Field
                label="Notes"
                error={errors.stops?.[index]?.notes?.message}
              >
                <Textarea {...register(`stops.${index}.notes`)} />
              </Field>
            </div>
          </div>
        ))}
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
