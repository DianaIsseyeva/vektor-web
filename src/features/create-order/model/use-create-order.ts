import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, type OrderDraftInput } from "@/entities/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: OrderDraftInput) => orderApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
