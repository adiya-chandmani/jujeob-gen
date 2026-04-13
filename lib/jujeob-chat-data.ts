import type { IntensityValue, JujeobChatItem, SituationOption } from "@/lib/types";

type ChatSeed = {
  opener: string;
  reply: string;
  punchline: string;
  tags?: string[];
  situation?: SituationOption[];
  intensity?: IntensityValue;
};

function createChatItems(seeds: ChatSeed[]) {
  return seeds.map<JujeobChatItem>((seed, index) => ({
    id: `chat-${String(index + 1).padStart(3, "0")}`,
    opener: seed.opener,
    reply: seed.reply,
    punchline: seed.punchline,
    tags: seed.tags ?? [],
    situation: seed.situation ?? ["일상", "썸"],
    intensity: seed.intensity ?? 2,
  }));
}

export const jujeobChatDB = createChatItems([
  {
    opener: "저기 혹시 피카츄세요?",
    reply: "네? 왜요?",
    punchline: "제가 방금 짜릿했거든요.",
    tags: ["밈", "말장난"],
    situation: ["썸", "스토리 답장"],
  },
  {
    opener: "너한테 벽이 느껴져.",
    reply: "무슨 벽?",
    punchline: "완벽.",
    tags: ["말장난", "짧은형"],
    situation: ["일상", "썸"],
  },
  {
    opener: "혹시 와이파이야?",
    reply: "아닌데 ㅋㅋ",
    punchline: "가까이 오면 내 마음이 자동 연결돼.",
    tags: ["밈", "짧은형"],
    situation: ["썸", "스토리 답장"],
  },
  {
    opener: "이 방 맘에 드네요.",
    reply: "무슨 방이요?",
    punchline: "당신의 좌심방.",
    tags: ["말장난", "드립"],
    situation: ["썸"],
    intensity: 4,
  },
  {
    opener: "종교 있으세요?",
    reply: "왜요?",
    punchline: "뭘 믿고 그렇게 예쁘시죠?",
    tags: ["칭찬", "직진"],
    situation: ["썸", "고백 직전"],
    intensity: 3,
  },
  {
    opener: "{name} 오늘 진짜 위험하다.",
    reply: "왜 또?",
    punchline: "보석인 줄 알고 누가 훔쳐가면 어떡해.",
    tags: ["칭찬", "직진"],
    situation: ["일상", "썸"],
    intensity: 3,
  },
  {
    opener: "경보 울린 거 못 들었어?",
    reply: "무슨 경보?",
    punchline: "설렘 감지 경보. 범인은 너.",
    tags: ["짧은형", "밈"],
    situation: ["일상", "스토리 답장"],
  },
  {
    opener: "혹시 오늘 렌즈 꼈어?",
    reply: "아니? 왜?",
    punchline: "마이 걸프렌즈..",
    tags: ["말장난", "밈"],
    situation: ["썸"],
  },
  {
    opener: "너 정말 레게 잘한다.",
    reply: "갑자기 레게는 왜?",
    punchline: "내 마음을 설레게 하잖아.",
    tags: ["말장난", "음악"],
    situation: ["썸", "일상"],
  },
  {
    opener: "너 혹시 알람이야?",
    reply: "그건 또 왜?",
    punchline: "생각만 해도 심장이 먼저 울려.",
    tags: ["밈", "설렘"],
    situation: ["썸"],
  },
  {
    opener: "오늘 스토리 뭐야.",
    reply: "왜, 이상해?",
    punchline: "아니, 너무 좋아서 답장 안 하면 예의가 아닌 수준.",
    tags: ["스토리", "직진"],
    situation: ["스토리 답장"],
  },
  {
    opener: "좋아요 누르려다가 멈췄어.",
    reply: "왜 멈췄는데?",
    punchline: "좋아요로는 부족해서. 감탄도 같이 보내야 할 것 같아서.",
    tags: ["스토리", "다정함"],
    situation: ["스토리 답장"],
  },
  {
    opener: "{name}{josa:subject} 웃으면 문제 있다.",
    reply: "무슨 문제가 있어?",
    punchline: "주변 사람들 집중력이 전부 무너져.",
    tags: ["칭찬", "과장형"],
    situation: ["일상", "썸"],
    intensity: 3,
  },
  {
    opener: "오늘 사진 찍었어?",
    reply: "왜 물어봐?",
    punchline: "안 찍었으면 아까워서. 오늘 분위기 저장해야 되잖아.",
    tags: ["칭찬", "일상"],
    situation: ["일상", "스토리 답장"],
  },
  {
    opener: "너 혹시 형광펜이야?",
    reply: "아니거든?",
    punchline: "이상하다. 하루 중에 제일 눈에 띄는데.",
    tags: ["말장난", "학교"],
    situation: ["일상", "썸"],
  },
  {
    opener: "너 왜 이렇게 자연스러워?",
    reply: "뭐가?",
    punchline: "사람 심장 흔드는 거.",
    tags: ["짧은형", "직진"],
    situation: ["썸"],
  },
  {
    opener: "혹시 비타민 챙겨 먹어?",
    reply: "갑자기 그건 왜?",
    punchline: "네가 이미 하루 권장 설렘량이라서 더 먹으면 과다복용일까 봐.",
    tags: ["말장난", "밈"],
    situation: ["썸", "일상"],
  },
  {
    opener: "오늘 별일 없었어?",
    reply: "응, 평범했는데?",
    punchline: "이상하네. 네가 있었으면 그날은 평범할 수가 없는데.",
    tags: ["다정함", "직진"],
    situation: ["일상", "썸"],
    intensity: 3,
  },
  {
    opener: "나 오늘 하루 요약 끝냈다.",
    reply: "뭐라고 썼는데?",
    punchline: "{name} 보고 기분 좋아짐.",
    tags: ["짧은형", "일상"],
    situation: ["일상"],
  },
  {
    opener: "자기 전에 한 가지만 물어볼게.",
    reply: "뭔데?",
    punchline: "좋은 꿈 예약해뒀어? 없으면 내가 {name} 넣어서 예약해줄게.",
    tags: ["자기 전", "다정함"],
    situation: ["자기 전", "썸"],
  },
  {
    opener: "잘 자라고 하기 전에.",
    reply: "또 무슨 말 하려고 ㅋㅋ",
    punchline: "오늘 하루 엔딩이 너라서 좋았다고 말해주고 싶었어.",
    tags: ["자기 전", "다정함"],
    situation: ["자기 전"],
    intensity: 3,
  },
  {
    opener: "시험장 들어가면 제일 불쌍한 게 뭔지 알아?",
    reply: "뭔데?",
    punchline: "문제지. 오늘 {name} 만나서 바로 털릴 예정이잖아.",
    tags: ["시험 응원", "밈"],
    situation: ["시험 응원"],
  },
  {
    opener: "시험 끝나고 제일 먼저 듣게 될 말 미리 말해줄까?",
    reply: "뭔데?",
    punchline: "수고했다. 그리고 원래도 잘하지만 오늘은 더 잘했을 거다.",
    tags: ["시험 응원", "다정함"],
    situation: ["시험 응원"],
  },
  {
    opener: "요즘 나 이상한 버릇 생겼어.",
    reply: "무슨 버릇?",
    punchline: "{name} 뜨면 바로 웃는 버릇.",
    tags: ["짧은형", "썸"],
    situation: ["썸", "일상"],
  },
  {
    opener: "내가 너한테 자꾸 반응하는 이유 찾았다.",
    reply: "또 시작이네",
    punchline: "네가 너무 잘 보여. 내 하루 하이라이트처럼.",
    tags: ["다정함", "일상"],
    situation: ["일상", "썸"],
  },
  {
    opener: "혹시 자석이야?",
    reply: "아닌데?",
    punchline: "이상하네. 자꾸 내 시선이 너한테 붙어.",
    tags: ["말장난", "직진"],
    situation: ["썸"],
  },
  {
    opener: "{name}{josa:topic} 오늘 너무 반짝여.",
    reply: "갑자기 왜 그러는데?",
    punchline: "선글라스 없이 보면 심장에 무리 갈 정도라서.",
    tags: ["칭찬", "과장형"],
    situation: ["일상", "썸"],
    intensity: 3,
  },
  {
    opener: "내가 요즘 되게 솔직해졌거든.",
    reply: "얼마나 솔직해졌는데?",
    punchline: "{name} 좋다고 돌려 말하는 것도 귀찮을 정도로.",
    tags: ["고백", "직진"],
    situation: ["고백 직전"],
    intensity: 4,
  },
  {
    opener: "숨기려 했는데 안 되겠다.",
    reply: "뭘?",
    punchline: "나 {name} 좋아하는 거.",
    tags: ["고백", "직진"],
    situation: ["고백 직전"],
    intensity: 4,
  },
  {
    opener: "요즘 내 알고리즘 좀 이상해.",
    reply: "왜 이상한데?",
    punchline: "무슨 생각을 해도 마지막 추천 결과가 너야.",
    tags: ["밈", "썸"],
    situation: ["썸", "일상"],
  },
]);
