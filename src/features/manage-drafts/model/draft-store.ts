import { create } from "zustand";
import type { LocalDraft, OrderDraftInput } from "@/entities/order";

const MAX_DRAFTS = 5;
const DRAFT_INDEX_KEY = "draft:index";
const legacyDraftsKey = "vektor:drafts";

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

function draftKey(id: string) {
  return `draft:${id}`;
}

function readDraftIndex() {
  const rawIndex = window.localStorage.getItem(DRAFT_INDEX_KEY);
  if (!rawIndex) {
    return [];
  }

  try {
    return JSON.parse(rawIndex) as string[];
  } catch {
    return [];
  }
}

function writeDraftIndex(ids: string[]) {
  window.localStorage.setItem(
    DRAFT_INDEX_KEY,
    JSON.stringify(ids.slice(0, MAX_DRAFTS)),
  );
}

function readDraft(id: string) {
  const rawDraft = window.localStorage.getItem(draftKey(id));
  if (!rawDraft) {
    return null;
  }

  try {
    return JSON.parse(rawDraft) as LocalDraft;
  } catch {
    return null;
  }
}

function writeDraft(draft: LocalDraft) {
  window.localStorage.setItem(draftKey(draft.id), JSON.stringify(draft));
}

function removeDraft(id: string) {
  window.localStorage.removeItem(draftKey(id));
}

function loadLegacyDrafts() {
  const rawLegacyDrafts = window.localStorage.getItem(legacyDraftsKey);
  if (!rawLegacyDrafts) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawLegacyDrafts) as {
      state?: { drafts?: LocalDraft[] };
    };
    const drafts = parsed.state?.drafts ?? [];
    drafts.forEach(writeDraft);
    writeDraftIndex(drafts.map((draft) => draft.id));
    window.localStorage.removeItem(legacyDraftsKey);
    return drafts;
  } catch {
    return [];
  }
}

function readDrafts() {
  const indexedDrafts = readDraftIndex()
    .map(readDraft)
    .filter((draft): draft is LocalDraft => Boolean(draft));

  if (indexedDrafts.length > 0) {
    return indexedDrafts.slice(0, MAX_DRAFTS);
  }

  return loadLegacyDrafts().slice(0, MAX_DRAFTS);
}

function persistDrafts(drafts: LocalDraft[]) {
  const limitedDrafts = drafts.slice(0, MAX_DRAFTS);
  limitedDrafts.forEach(writeDraft);
  writeDraftIndex(limitedDrafts.map((draft) => draft.id));
}

export const useDraftStore = create<DraftState>((set, get) => ({
  drafts: readDrafts(),
  createDraft: (formData) => {
    const draft = makeDraft(formData);
    const drafts = [draft, ...get().drafts].slice(0, MAX_DRAFTS);
    persistDrafts(drafts);
    set({ drafts });
    return draft;
  },
  updateDraft: (id, formData) => {
    const savedAt = new Date().toISOString();
    const drafts = get().drafts.map((draft) =>
      draft.id === id
        ? {
            ...draft,
            title: formData.referenceNumber || draft.title,
            formData: { ...draft.formData, ...formData },
            savedAt,
          }
        : draft,
    );

    persistDrafts(drafts);
    set({ drafts });
  },
  deleteDraft: (id) => {
    removeDraft(id);
    const drafts = get().drafts.filter((draft) => draft.id !== id);
    persistDrafts(drafts);
    set({ drafts });
  },
  clearDrafts: () => {
    get().drafts.forEach((draft) => removeDraft(draft.id));
    writeDraftIndex([]);
    set({ drafts: [] });
  },
}));
