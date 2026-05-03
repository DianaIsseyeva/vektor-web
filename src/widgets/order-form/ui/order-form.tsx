import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import {
  orderFormSchema,
  type OrderDraftInput,
  type OrderFormValues,
} from "@/entities/order";
import { Button } from "@/shared/ui/button";
import { ClientSection } from "./client-section";
import { OrderSection } from "./order-section";
import { StopsSection } from "./stops-section";

type OrderFormProps = {
  defaultValues: OrderFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  submitError?: string;
  savedLabel?: string;
  onValuesChange?: (values: OrderDraftInput) => void;
  onSubmit: (values: OrderDraftInput) => Promise<void>;
};

export function OrderForm({
  defaultValues,
  submitLabel,
  isSubmitting = false,
  submitError,
  savedLabel,
  onValuesChange,
  onSubmit,
}: OrderFormProps) {
  const [localSubmitError, setLocalSubmitError] = useState<string | null>(null);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    if (!onValuesChange) {
      return undefined;
    }

    const subscription = form.watch(() => onValuesChange(form.getValues()));

    return () => subscription.unsubscribe();
  }, [form, onValuesChange]);

  const handleInvalid: SubmitErrorHandler<OrderFormValues> = () => {
    window.setTimeout(() => {
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleValid = async (values: OrderFormValues) => {
    setLocalSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setLocalSubmitError(
        error instanceof Error ? error.message : "Failed to save order",
      );
    }
  };

  const visibleSubmitError = submitError ?? localSubmitError;

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(handleValid, handleInvalid)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {isSubmitting ? "Saving order..." : (savedLabel ?? "Draft saved")}
        </span>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
      {visibleSubmitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {visibleSubmitError}
        </div>
      ) : null}
      <ClientSection register={form.register} errors={form.formState.errors} />
      <OrderSection
        control={form.control}
        register={form.register}
        errors={form.formState.errors}
      />
      <StopsSection
        control={form.control}
        register={form.register}
        errors={form.formState.errors}
      />
    </form>
  );
}
