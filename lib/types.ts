export const situations = ["일상", "스토리 답장", "썸", "고백 직전", "시험 응원", "자기 전"] as const;

export const categories = ["말장난형", "과장형", "짧은 밈형", "상황형"] as const;

export const tones = ["가벼움", "다정함", "능청", "직진", "밈"] as const;

export const intensityLevels = [
  { value: 1, label: "순한맛" },
  { value: 2, label: "보통" },
  { value: 3, label: "위험" },
  { value: 4, label: "차단직전" },
] as const;

export type SituationOption = (typeof situations)[number];
export type CategoryOption = (typeof categories)[number];
export type ToneOption = (typeof tones)[number];
export type IntensityValue = (typeof intensityLevels)[number]["value"];
export type FilterOption<T extends string | number> = T | "전체";

export type JujeobItem = {
  id: string;
  text: string;
  tags: string[];
  situation: SituationOption[];
  tone: ToneOption[];
  intensity: IntensityValue;
  usesName: boolean;
  category: CategoryOption;
};

export type JujeobFilters = {
  situation: FilterOption<SituationOption>;
  category: FilterOption<CategoryOption>;
  tone: FilterOption<ToneOption>;
  intensity: FilterOption<IntensityValue>;
};

export type RenderedJujeobItem = JujeobItem & {
  renderedText: string;
};

export type JujeobChatItem = {
  id: string;
  opener: string;
  reply: string;
  punchline: string;
  tags: string[];
  situation: SituationOption[];
  intensity: IntensityValue;
};

export type RenderedJujeobChatItem = JujeobChatItem & {
  renderedOpener: string;
  renderedReply: string;
  renderedPunchline: string;
};
