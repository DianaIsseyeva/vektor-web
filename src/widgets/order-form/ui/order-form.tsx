import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import { DraftTabs, useDraftStore } from "@/features/manage-drafts";
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
  draftId?: string;
  onSubmit: (values: OrderDraftInput) => Promise<void>;
};

export function OrderForm({
  defaultValues,
  submitLabel,
  isSubmitting = false,
  submitError,
  draftId,
  onSubmit,
}: OrderFormProps) {
  const updateDraft = useDraftStore((state) => state.updateDraft);
  const createDraft = useDraftStore((state) => state.createDraft);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const activeDraftIdRef = useRef<string | null>(draftId ?? null);
  const [localSubmitError, setLocalSubmitError] = useState<string | null>(null);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const draft = draftId ? { id: draftId } : createDraft(defaultValues);
    activeDraftIdRef.current = draft.id;
    const subscription = form.watch(() => {
      updateDraft(draft.id, form.getValues());
    });

    return () => subscription.unsubscribe();
  }, [createDraft, defaultValues, draftId, form, updateDraft]);

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
      if (activeDraftIdRef.current) {
        deleteDraft(activeDraftIdRef.current);
      }
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
        <div className="flex items-center gap-3">
          <DraftTabs />
          <span className="text-sm text-slate-500">
            {isSubmitting ? "Saving order..." : "Draft autosaved"}
          </span>
        </div>
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
