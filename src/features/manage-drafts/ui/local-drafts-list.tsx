import { Link } from "react-router-dom";
import { useDraftStore } from "@/features/manage-drafts/model/draft-store";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export function LocalDraftsList() {
  const drafts = useDraftStore((state) => state.drafts);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);

  if (drafts.length === 0) {
    return <p className="text-sm text-slate-500">No local draft</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 font-semibold text-slate-950">Local Drafts</h2>
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div>
              <p className="font-medium text-slate-700">{draft.title}</p>
              <p className="text-xs text-slate-400">Saved locally</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to={`${routes.newOrder}?draftId=${draft.id}`}>
                  Resume
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => deleteDraft(draft.id)}
              >
                Discard
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
