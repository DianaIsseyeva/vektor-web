import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalDraft, OrderDraftInput } from "@/entities/order";

const MAX_DRAFTS = 5;

type DraftState = {
  drafts: LocalDraft[];
  createDraft: (formData?: Partial<OrderDraftInput>) => LocalDraft;
  updateDraft: (id: string, formData: Partial<OrderDraftInput>) => void;
  deleteDraft: (id: string) => void;
  clearDrafts: () => void;
};

function makeDraft(formData: Partial<OrderDraftInput> = {}): LocalDraft {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: formData.referenceNumber || "New Draft",
    formData,
    savedAt: now,
  };
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: [],
      createDraft: (formData) => {
        const draft = makeDraft(formData);
        set({ drafts: [draft, ...get().drafts].slice(0, MAX_DRAFTS) });
        return draft;
      },
      updateDraft: (id, formData) => {
        const savedAt = new Date().toISOString();
        set({
          drafts: get().drafts.map((draft) =>
            draft.id === id
              ? {
                  ...draft,
                  title: formData.referenceNumber || draft.title,
                  formData: { ...draft.formData, ...formData },
                  savedAt,
                }
              : draft,
          ),
        });
      },
      deleteDraft: (id) =>
        set({ drafts: get().drafts.filter((draft) => draft.id !== id) }),
      clearDrafts: () => set({ drafts: [] }),
    }),
    { name: "vektor:drafts" },
  ),
);
