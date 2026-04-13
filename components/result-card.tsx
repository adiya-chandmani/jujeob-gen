import { intensityLabel } from "@/lib/jujeob-engine";
import type { RenderedJujeobItem } from "@/lib/types";

type ResultCardProps = {
  item: RenderedJujeobItem;
  isFavorite: boolean;
  onCopy: (text: string) => void;
  onRefresh: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  showRefresh?: boolean;
};

export function ResultCard({
  item,
  isFavorite,
  onCopy,
  onRefresh,
  onToggleFavorite,
  showRefresh = true,
}: ResultCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1">{item.category}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{intensityLabel(item.intensity)}</span>
        {item.situation.map((label) => (
          <span key={`${item.id}-${label}`} className="rounded-full bg-slate-100 px-2 py-1">
            {label}
          </span>
        ))}
      </div>

      <p className="mb-4 whitespace-pre-wrap break-keep text-base leading-7 text-slate-900">
        {item.renderedText}
      </p>

      <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {item.tags.map((tag) => (
          <span key={`${item.id}-${tag}`} className="rounded-full border border-slate-200 px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          onClick={() => onCopy(item.renderedText)}
        >
          복사
        </button>
        {showRefresh ? (
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            onClick={() => onRefresh(item.id)}
          >
            다시 추천
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          onClick={() => onToggleFavorite(item.id)}
        >
          {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
        </button>
      </div>
    </article>
  );
}
