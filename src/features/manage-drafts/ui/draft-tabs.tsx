import { FileText } from "lucide-react";
import { useDraftStore } from "@/features/manage-drafts/model/draft-store";

export function DraftTabs() {
  const savedAt = useDraftStore((state) => state.savedAt);

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
      <FileText className="size-4" />
      {savedAt ? "Saved" : "Draft"}
    </div>
  );
}
