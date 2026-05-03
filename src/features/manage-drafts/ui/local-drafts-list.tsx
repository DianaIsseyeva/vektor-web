import { useDraftStore } from "@/features/manage-drafts/model/draft-store";

export function LocalDraftsList() {
  const draft = useDraftStore((state) => state.draft);

  if (!draft) {
    return <p className="text-sm text-slate-500">No local draft</p>;
  }

  return <p className="text-sm text-slate-600">{draft.referenceNumber || "Untitled draft"}</p>;
}
