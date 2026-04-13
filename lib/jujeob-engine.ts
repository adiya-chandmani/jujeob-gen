import { renderTemplate } from "@/lib/josa";
import type {
  JujeobChatItem,
  JujeobFilters,
  JujeobItem,
  RenderedJujeobChatItem,
  RenderedJujeobItem,
} from "@/lib/types";

export const RESULT_COUNT = 5;

export function normalizeName(input: string) {
  return input.trim();
}

export function validateName(input: string) {
  const normalized = normalizeName(input);

  if (!normalized) {
    return "이름이나 별명을 1자 이상 입력해줘.";
  }

  if (normalized.length > 10) {
    return "이름은 10자 이하로 입력해줘.";
  }

  if (!/^[0-9A-Za-z가-힣]+$/.test(normalized)) {
    return "한글, 영문, 숫자만 사용할 수 있어.";
  }

  return "";
}

export function filterItems(items: JujeobItem[], filters: JujeobFilters) {
  return items.filter((item) => {
    if (filters.situation !== "전체" && !item.situation.includes(filters.situation)) {
      return false;
    }

    if (filters.category !== "전체" && item.category !== filters.category) {
      return false;
    }

    if (filters.tone !== "전체" && !item.tone.includes(filters.tone)) {
      return false;
    }

    if (filters.intensity !== "전체" && item.intensity !== filters.intensity) {
      return false;
    }

    return true;
  });
}

export function shuffleItems<T>(items: T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export function pickRecommendations({
  items,
  filters,
  count = RESULT_COUNT,
  excludeIds = [],
  prioritizeNewIds = [],
}: {
  items: JujeobItem[];
  filters: JujeobFilters;
  count?: number;
  excludeIds?: string[];
  prioritizeNewIds?: string[];
}) {
  const matchedItems = filterItems(items, filters);

  const hardPool = matchedItems.filter((item) => !excludeIds.includes(item.id));
  const freshPool = hardPool.filter((item) => !prioritizeNewIds.includes(item.id));

  const selected = shuffleItems(freshPool).slice(0, count);

  if (selected.length >= count) {
    return selected;
  }

  const fillFromHardPool = shuffleItems(hardPool).filter(
    (item) => !selected.some((selectedItem) => selectedItem.id === item.id),
  );

  const fillFromAllMatches = shuffleItems(matchedItems).filter(
    (item) =>
      !selected.some((selectedItem) => selectedItem.id === item.id) &&
      !excludeIds.includes(item.id),
  );

  return [...selected, ...fillFromHardPool, ...fillFromAllMatches].slice(0, count);
}

export function renderRecommendations(items: JujeobItem[], name: string): RenderedJujeobItem[] {
  return items.map((item) => ({
    ...item,
    renderedText: renderTemplate(item.text, name),
  }));
}

export function renderChatItem(item: JujeobChatItem, name: string): RenderedJujeobChatItem {
  return {
    ...item,
    renderedOpener: renderTemplate(item.opener, name),
    renderedReply: renderTemplate(item.reply, name),
    renderedPunchline: renderTemplate(item.punchline, name),
  };
}

export function intensityLabel(value: number) {
  switch (value) {
    case 1:
      return "순한맛";
    case 2:
      return "보통";
    case 3:
      return "위험";
    case 4:
      return "차단직전";
    default:
      return "알 수 없음";
  }
}
