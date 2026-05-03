import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useDeleteOrder } from "@/features/delete-order/model/use-delete-order";

type DeleteOrderButtonProps = {
  orderId: string;
  disabled?: boolean;
  onDeleted?: () => void;
};

export function DeleteOrderButton({
  orderId,
  disabled = false,
  onDeleted,
}: DeleteOrderButtonProps) {
  const deleteOrder = useDeleteOrder();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={disabled || deleteOrder.isPending}
      onClick={() => {
        if (!window.confirm("Delete this order?")) {
          return;
        }

        deleteOrder.mutate(orderId, { onSuccess: onDeleted });
      }}
    >
      <Trash2 className="size-4" />
      Delete
    </Button>
  );
}
