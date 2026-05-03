import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCreateOrder } from "@/features/create-order";
import { useDraftStore } from "@/features/manage-drafts";
import type { OrderDraftInput, OrderFormValues } from "@/entities/order";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/cn";
import { OrderForm } from "./order-form";

type DraftWorkspaceProps = {
  open: boolean;
  initialDraftId?: string | null;
  onOpenChange: (open: boolean) => void;
  onCreated?: (orderId: string) => void;
};

export function DraftWorkspace({
  open,
  initialDraftId,
  onOpenChange,
  onCreated,
}: DraftWorkspaceProps) {
  const drafts = useDraftStore((state) => state.drafts);
  const createDraft = useDraftStore((state) => state.createDraft);
  const updateDraft = useDraftStore((state) => state.updateDraft);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const clearDrafts = useDraftStore((state) => state.clearDrafts);
  const createOrder = useCreateOrder();
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const createdDraftForOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      createdDraftForOpenRef.current = false;
      return;
    }

    if (initialDraftId && drafts.some((draft) => draft.id === initialDraftId)) {
      setActiveDraftId(initialDraftId);
      return;
    }

    if (!createdDraftForOpenRef.current && drafts.length < 5) {
      const draft = createDraft(createDefaultValues());
      createdDraftForOpenRef.current = true;
      setActiveDraftId(draft.id);
      return;
    }

    if (
      drafts.length > 0 &&
      !drafts.some((draft) => draft.id === activeDraftId)
    ) {
      setActiveDraftId(drafts[0].id);
    }
  }, [activeDraftId, createDraft, drafts, initialDraftId, open]);

  const activeDraft = drafts.find((draft) => draft.id === activeDraftId);
  const formValues = useMemo(
    () => mergeDraft(createDefaultValues(), activeDraft?.formData),
    [activeDraft?.formData],
  );
  const savedLabel = activeDraft
    ? `Draft saved ${formatSavedTime(activeDraft.savedAt)}`
    : "Draft saved";

  const handleCreateDraft = () => {
    if (drafts.length >= 5) {
      return;
    }

    const draft = createDraft(createDefaultValues());
    setActiveDraftId(draft.id);
  };

  const handleDeleteActiveDraft = () => {
    if (!activeDraftId) {
      return;
    }

    const nextDraft = drafts.find((draft) => draft.id !== activeDraftId);
    deleteDraft(activeDraftId);
    setActiveDraftId(nextDraft?.id ?? null);
  };

  const handleClearDrafts = () => {
    clearDrafts();
    const draft = createDraft(createDefaultValues());
    setActiveDraftId(draft.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-4 top-4 h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-none translate-x-0 translate-y-0">
        {toastMessage ? (
          <div className="absolute right-16 top-4 z-10 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
            {toastMessage}
          </div>
        ) : null}
        <div className="border-b border-slate-200 bg-white p-4 pr-14">
          <DialogTitle className="text-lg font-semibold text-slate-950">
            Draft Workspace
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Create drafts as tabs, fill data, then submit a draft to create a
            pending order.
          </DialogDescription>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {drafts.map((draft) => (
              <button
                key={draft.id}
                type="button"
                className={cn(
                  "rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50",
                  draft.id === activeDraftId &&
                    "border-blue-200 bg-blue-50 text-blue-700",
                )}
                onClick={() => setActiveDraftId(draft.id)}
              >
                {draft.title}
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={drafts.length >= 5}
              onClick={handleCreateDraft}
            >
              <Plus className="size-4" />
              New Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearDrafts}
            >
              Clear All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!activeDraftId}
              onClick={handleDeleteActiveDraft}
            >
              <Trash2 className="size-4" />
              Delete Draft
            </Button>
          </div>
        </div>
        <div className="overflow-y-auto p-4">
          {activeDraft ? (
            <OrderForm
              key={activeDraft.id}
              defaultValues={formValues}
              submitLabel="Submit Draft"
              savedLabel={savedLabel}
              isSubmitting={createOrder.isPending}
              submitError={createOrder.error?.message}
              onValuesChange={(values) => updateDraft(activeDraft.id, values)}
              onSubmit={async (values) => {
                try {
                  const order = await createOrder.mutateAsync(values);
                  deleteDraft(activeDraft.id);
                  setToastMessage("Order created");
                  onCreated?.(order.id);
                  onOpenChange(false);
                } catch (error) {
                  setToastMessage(
                    error instanceof Error
                      ? error.message
                      : "Failed to create order",
                  );
                  window.setTimeout(() => setToastMessage(null), 3000);
                  throw error;
                }
              }}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No active draft
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function createDefaultValues(): OrderFormValues {
  return {
    clientName: "",
    referenceNumber: `ORD-2026-${String(Date.now()).slice(-4)}`,
    carrierId: "carrier-1",
    equipmentType: "dry_van",
    loadType: "ftl",
    rate: 0,
    weight: 0,
    notes: "",
    stops: [
      {
        id: crypto.randomUUID(),
        type: "pick_up",
        order: 1,
        address: { city: "", state: "", zip: "" },
        locationName: "",
        refNumber: "",
        appointmentType: "fixed",
        appointmentDate: "",
        notes: "",
      },
      {
        id: crypto.randomUUID(),
        type: "drop_off",
        order: 2,
        address: { city: "", state: "", zip: "" },
        locationName: "",
        refNumber: "",
        appointmentType: "fixed",
        appointmentDate: "",
        notes: "",
      },
    ],
  };
}

function mergeDraft(
  defaults: OrderFormValues,
  draft?: Partial<OrderDraftInput>,
): OrderFormValues {
  if (!draft) {
    return defaults;
  }

  return {
    ...defaults,
    ...draft,
    stops:
      draft.stops && draft.stops.length >= 2 ? draft.stops : defaults.stops,
  };
}

function formatSavedTime(savedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(savedAt));
}
