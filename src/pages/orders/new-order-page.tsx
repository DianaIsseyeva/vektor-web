import { useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { DraftWorkspace } from "@/widgets/order-form";

export function NewOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <DraftWorkspace
      open
      initialDraftId={searchParams.get("draftId")}
      onOpenChange={(open) => {
        if (!open) {
          navigate(routes.orders);
        }
      }}
      onCreated={(orderId) => navigate(routes.orderDetail(orderId))}
    />
  );
}
