import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateOrder } from "@/features/create-order";
import { useDraftStore } from "@/features/manage-drafts";
import type { OrderFormValues } from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { OrderForm } from "@/widgets/order-form";

export function NewOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const draft = useDraftStore((state) =>
    state.drafts.find((item) => item.id === draftId),
  );
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const createOrder = useCreateOrder();
  const defaultValues = useMemo(() => createDefaultValues(), []);
  const formValues = useMemo(
    () => (draft ? mergeDraft(defaultValues, draft.formData) : defaultValues),
    [defaultValues, draft],
  );

  return (
    <OrderForm
      defaultValues={formValues}
      submitLabel="Submit Draft"
      draftId={draft?.id}
      isSubmitting={createOrder.isPending}
      submitError={createOrder.error?.message}
      onSubmit={async (values) => {
        const order = await createOrder.mutateAsync(values);
        if (draft?.id) {
          deleteDraft(draft.id);
        }
        navigate(routes.orderDetail(order.id));
      }}
    />
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
  draft: Partial<OrderFormValues>,
): OrderFormValues {
  return {
    ...defaults,
    ...draft,
    stops:
      draft.stops && draft.stops.length >= 2 ? draft.stops : defaults.stops,
  };
}
