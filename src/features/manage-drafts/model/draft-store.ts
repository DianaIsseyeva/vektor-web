import { create } from "zustand";
import type { OrderFormValues } from "@/entities/order";

type DraftState = {
  draft: OrderFormValues | null;
  savedAt: string | null;
  setDraft: (draft: OrderFormValues) => void;
  clearDraft: () => void;
};

export const useDraftStore = create<DraftState>((set) => ({
  draft: null,
  savedAt: null,
  setDraft: (draft) => set({ draft, savedAt: new Date().toISOString() }),
  clearDraft: () => set({ draft: null, savedAt: null }),
}));
