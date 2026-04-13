import type {
  CategoryOption,
  IntensityValue,
  JujeobItem,
  SituationOption,
  ToneOption,
} from "@/lib/types";

type SeedItem = {
  text: string;
  tags?: string[];
  situation?: SituationOption[];
  tone?: ToneOption[];
  intensity?: IntensityValue;
  usesName?: boolean;
};

type CategoryDefaults = {
  tags: string[];
  situation: SituationOption[];
  tone: ToneOption[];
  intensity: IntensityValue;
  usesName: boolean;
};

function buildCategoryItems(
  category: CategoryOption,
  prefix: string,
  seeds: SeedItem[],
  defaults: CategoryDefaults,
) {
  return seeds.map<JujeobItem>((seed, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    text: seed.text,
    tags: [...new Set([...defaults.tags, ...(seed.tags ?? [])])],
    situation: seed.situation ?? defaults.situation,
    tone: seed.tone ?? defaults.tone,
    intensity: seed.intensity ?? defaults.intensity,
    usesName: seed.usesName ?? defaults.usesName,
    category,
  }));
}

const punSeeds: SeedItem[] = [
  { text: "{name}{josa:subject} 오늘 렌즈 꼈지? 마이 걸프렌즈.", tags: ["렌즈", "밈"] },
  { text: "{name}{josa:subject} 레게 잘하네. 내 마음을 설레게.", tags: ["음악"] },
  { text: "{name}{josa:subject} 내 몸 어디에 들어왔는지 알아? 좌심방.", tags: ["의학", "밈"], intensity: 3 },
  { text: "{name}{josa:topic} 완벽해서 벽이 느껴져.", tags: ["완벽"], intensity: 2 },
  { text: "혹시 자석이야? 내 시선이 자꾸 {name}{josa:object} 향해 붙잖아.", tags: ["비유"] },
  { text: "{name}{josa:subject} 이름이 아니라 심장 단축키 같아. 부르면 바로 반응해.", tags: ["이름"] },
  { text: "{name}{josa:subject} 지나가면 내 하루가 자동으로 하이라이트 처리돼.", tags: ["일상"] },
  { text: "혹시 와이파이야? 가까이 오면 내 마음이 자동 연결돼.", tags: ["인터넷"] },
  { text: "{name}{josa:subject} 네컷 찍으면 안 되겠다. 네 컷으로 매력이 안 담겨.", tags: ["사진"] },
  { text: "{name}{josa:topic} 봄이야? 보기만 해도 주변이 피어나네.", tags: ["계절"], tone: ["가벼움", "다정함"] },
  { text: "{name}{josa:subject} 햇빛이야? 보기만 해도 하루가 환해져.", tags: ["햇빛"], tone: ["가벼움", "다정함"] },
  { text: "카메라 보정 필요 없겠다. 원본이 이미 사기잖아.", tags: ["사진"], usesName: false },
  { text: "{name}{josa:subject} 커피야? 안 마셔도 잠이 확 깨네.", tags: ["커피"] },
  { text: "{name}{josa:subject} 알람이야? 생각만 해도 심장이 먼저 울려.", tags: ["알람"] },
  { text: "{name}{josa:subject} 비타민이야? 하루 권장 설렘량을 초과했어.", tags: ["건강"] },
  { text: "지도 앱이야? 자꾸 내 방향을 {name}{josa:object} 향하게 하잖아.", tags: ["길찾기"] },
  { text: "{name}{josa:subject} 드라마야? 한 번 보기 시작하니까 다음 화가 계속 궁금해.", tags: ["드라마"] },
  { text: "노래 제목이 뭐야? {name}만 보면 심장 박자가 자동 재생되는데.", tags: ["음악"] },
  { text: "{name}{josa:subject} 구름이야? 멍하니 계속 보게 돼.", tags: ["날씨"], tone: ["가벼움", "능청"] },
  { text: "{name}{josa:subject} 형광펜이야? 하루 중 제일 눈에 띄어.", tags: ["학교"] },
];

const exaggerationSeeds: SeedItem[] = [
  { text: "내 눈은 두 개인데 왜 {name} 하나만 보이지?", tags: ["직진"], tone: ["직진", "다정함"], intensity: 3 },
  { text: "{name}{josa:subject} 지나가면 배경이 다 엑스트라 돼.", tags: ["과장"] },
  { text: "오늘 예쁜 정도가 아니라 기상청 특보감이야.", tags: ["특보"], usesName: false, intensity: 2 },
  { text: "{name}{josa:topic} 그냥 사람이 아니라 분위기 자체야.", tags: ["분위기"], tone: ["다정함", "직진"] },
  { text: "세상이 고화질 된 줄 알았는데 {name}{josa:object} 봐서 그런 거였네.", tags: ["고화질"] },
  { text: "{name}{josa:subject} 웃으면 주변 조도 자동 상승하잖아.", tags: ["조명"] },
  { text: "{name}{josa:topic} 오늘도 혼자 장르가 다르네.", tags: ["분위기"], intensity: 2 },
  { text: "첫인상 저장 용량이 꽉 찼어. {name}{josa:subject} 너무 강력해서.", tags: ["기억"] },
  { text: "{name}{josa:subject} 나타나면 공기가 좀 달라져. 약간 영화 엔딩 컷 같아.", tags: ["영화"] },
  { text: "{name}{josa:topic} 원본이 이미 완성형이라 보정이 민망하겠다.", tags: ["원본"], intensity: 2 },
  { text: "사람이 아니라 전시회야. 보고 또 봐도 계속 새롭네.", tags: ["전시"], usesName: false },
  { text: "{name}{josa:subject} 서 있으면 그 자리만 명소 되는 거 알아?", tags: ["명소"], intensity: 3 },
  { text: "{name}{josa:topic} 칭찬 한 줄로는 택도 없고 논문급 분량이 필요해.", tags: ["논문"], intensity: 2 },
  { text: "오늘도 {name}{josa:subject} 미모로 경제 살리는 중이네.", tags: ["밈", "경제"], tone: ["능청", "밈"] },
  { text: "{name}{josa:subject} 웃을 때마다 주변 사람들이 잠깐씩 현실 잊을 듯.", tags: ["웃음"], intensity: 3 },
  { text: "너무 반짝여서 선글라스 필요할 뻔했어.", tags: ["반짝임"], usesName: false },
  { text: "{name}{josa:topic} 그냥 귀여운 게 아니라 규격 외 귀여움이야.", tags: ["귀여움"], intensity: 2 },
  { text: "{name}{josa:subject} 말 한마디 하면 주변 공기까지 호감형 되네.", tags: ["호감"] },
  { text: "내 하루 집중력 다 가져간 범인 찾음. {name}.", tags: ["집중력"], intensity: 3 },
  { text: "{name}{josa:subject} 존재감이 너무 세서 화면 밝기부터 낮추고 봐야겠어.", tags: ["존재감"], tone: ["능청", "직진"] },
];

const shortMemeSeeds: SeedItem[] = [
  { text: "경보 울렸다. 설렘 감지됨.", tags: ["짧은형", "밈"], usesName: false, tone: ["밈", "가벼움"], intensity: 1 },
  { text: "{name}{josa:subject} 또 혼자 분위기 다 가져감.", tags: ["짧은형"], tone: ["밈", "가벼움"], intensity: 1 },
  { text: "방금 심장 로그아웃함.", tags: ["짧은형", "밈"], usesName: false, tone: ["밈", "능청"], intensity: 2 },
  { text: "내 하루 하이라이트: {name} 봄.", tags: ["짧은형"], tone: ["가벼움", "다정함"], intensity: 1 },
  { text: "이 정도면 반칙이지.", tags: ["짧은형"], usesName: false, tone: ["밈", "직진"], intensity: 2 },
  { text: "말이 안 되네. 너무 좋네.", tags: ["짧은형"], usesName: false, tone: ["직진", "가벼움"], intensity: 2 },
  { text: "{name}{josa:subject} 오늘도 기준치 초과.", tags: ["짧은형"], tone: ["밈", "가벼움"], intensity: 1 },
  { text: "예쁨 치사량이네.", tags: ["짧은형"], usesName: false, tone: ["밈", "직진"], intensity: 2 },
  { text: "{name}{josa:subject} 내 기분 서버 관리자야?", tags: ["인터넷", "짧은형"], tone: ["능청", "밈"], intensity: 2 },
  { text: "심장아 버텨.", tags: ["짧은형"], usesName: false, tone: ["밈", "가벼움"], intensity: 1 },
  { text: "내 눈 지금 호강 중.", tags: ["짧은형"], usesName: false, tone: ["다정함", "가벼움"], intensity: 1 },
  { text: "{name}{josa:subject} 너무 잘생기고 예뻐서 현실감이 없다.", tags: ["짧은형"], tone: ["직진", "다정함"], intensity: 3 },
  { text: "오늘도 심장 낭비 완료.", tags: ["짧은형"], usesName: false, tone: ["밈", "능청"], intensity: 2 },
  { text: "{name}{josa:topic} 자꾸 한 줄 요약이 안 돼. 좋은 점이 너무 많아.", tags: ["짧은형"], tone: ["다정함", "직진"], intensity: 2 },
  { text: "존재감 미쳤다.", tags: ["짧은형"], usesName: false, tone: ["밈", "직진"], intensity: 2 },
  { text: "{name}{josa:subject} 오늘도 내 알고리즘 장악함.", tags: ["알고리즘", "짧은형"], tone: ["밈", "능청"], intensity: 2 },
  { text: "지금 약간 과몰입 중.", tags: ["짧은형"], usesName: false, tone: ["밈", "가벼움"], intensity: 1 },
  { text: "{name}{josa:topic} 걍 유죄다.", tags: ["짧은형", "밈"], tone: ["밈", "직진"], intensity: 3 },
  { text: "심장에 저장.", tags: ["짧은형"], usesName: false, tone: ["가벼움", "다정함"], intensity: 1 },
  { text: "{name}{josa:subject} 내 하루 대표 썸네일.", tags: ["짧은형"], tone: ["가벼움", "다정함"], intensity: 2 },
];

const situationalSeeds: SeedItem[] = [
  {
    text: "{name}{josa:subject} 오늘도 아무렇지 않게 예쁘네. 그게 더 반칙이야.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["가벼움", "다정함"],
    intensity: 1,
  },
  {
    text: "일상 사진 하나로 이 정도면 규정 위반 아닌가.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["밈", "능청"],
    intensity: 2,
    usesName: false,
  },
  {
    text: "{name}{josa:topic} 대체 평소에도 이렇게 사람 심장 흔들고 다녀?",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["가벼움", "직진"],
    intensity: 2,
  },
  {
    text: "그냥 지나가는 일상인데 왜 혼자 화보야.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["가벼움", "밈"],
    intensity: 1,
    usesName: false,
  },
  {
    text: "{name}{josa:subject} 오늘도 무심한 척 치명적이네.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["능청", "직진"],
    intensity: 2,
  },
  {
    text: "평범한 하루에 {name}만 추가됐는데 난이도가 확 올라갔네.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["가벼움", "능청"],
    intensity: 2,
  },
  {
    text: "{name}{josa:topic} 별일 없는 날도 별일 있게 만들어.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["다정함", "가벼움"],
    intensity: 1,
  },
  {
    text: "오늘의 TMI: 방금 {name} 보고 기분 좋아짐.",
    tags: ["일상"],
    situation: ["일상"],
    tone: ["밈", "가벼움"],
    intensity: 1,
  },
  {
    text: "스토리 올리기 전에 경고 좀 해줘. 심장 준비할 시간은 줘야지.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["능청", "밈"],
    intensity: 2,
    usesName: false,
  },
  {
    text: "{name}{josa:subject} 올린 스토리 보고 손가락이 아니라 심장이 먼저 반응했어.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["다정함", "직진"],
    intensity: 2,
  },
  {
    text: "이 스토리 저장 안 되나? 오늘 하루 재생 목록으로 쓰게.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["능청", "가벼움"],
    intensity: 2,
    usesName: false,
  },
  {
    text: "{name}{josa:topic} 스토리 하나 올렸을 뿐인데 내 집중력은 다 가져갔네.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["가벼움", "직진"],
    intensity: 2,
  },
  {
    text: "좋아요 누르려다가 고백할 뻔했어.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["밈", "직진"],
    intensity: 3,
    usesName: false,
  },
  {
    text: "{name}{josa:subject} 이 스토리 올린 이유가 뭐야? 내 심장 테스트하려고?",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["능청", "밈"],
    intensity: 3,
  },
  {
    text: "답장 안 하려고 했는데 이건 예의상 심장 한 번 흔들리고 와야겠더라.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["밈", "가벼움"],
    intensity: 1,
    usesName: false,
  },
  {
    text: "{name}{josa:subject} 올린 사진, 유해 콘텐츠 아냐? 너무 심하게 좋잖아.",
    tags: ["스토리"],
    situation: ["스토리 답장"],
    tone: ["능청", "직진"],
    intensity: 3,
  },
  {
    text: "{name}{josa:subject} 썸 타는 거 아니고 심장 줄다리기 하는 거지 지금?",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["가벼움", "능청"],
    intensity: 2,
  },
  {
    text: "요즘 자꾸 웃는 이유 찾았어. {name} 때문이더라.",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["다정함", "직진"],
    intensity: 2,
  },
  {
    text: "{name}{josa:topic} 연락 한 번만 와도 하루 난이도가 쉬워져.",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["다정함", "가벼움"],
    intensity: 1,
  },
  {
    text: "썸인지 아닌지 모르겠는데 내 마음은 이미 답안 제출했어.",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["밈", "직진"],
    intensity: 3,
    usesName: false,
  },
  {
    text: "{name}{josa:subject} 자꾸 다정해서 내가 혼자 의미 부여하게 되잖아.",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["다정함", "직진"],
    intensity: 3,
  },
  {
    text: "썸은 무슨, 나는 거의 {name}{josa:object} 응원봉 들고 있다니까.",
    tags: ["썸", "밈"],
    situation: ["썸"],
    tone: ["밈", "능청"],
    intensity: 2,
  },
  {
    text: "{name}{josa:topic} 은근한데 그래서 더 치명적이야.",
    tags: ["썸"],
    situation: ["썸"],
    tone: ["직진", "다정함"],
    intensity: 2,
  },
  {
    text: "요즘 내 알고리즘은 {name} 얘기만 추천해.", tags: ["썸", "알고리즘"], situation: ["썸"], tone: ["밈", "가벼움"], intensity: 1
  },
  {
    text: "오늘은 그냥 말할게. {name}{josa:subject} 진짜 많이 좋다.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진", "다정함"],
    intensity: 4,
  },
  {
    text: "돌려 말하는 거 못 하겠다. 내 하루 제일 큰 변수는 항상 {name}야.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진"],
    intensity: 4,
  },
  {
    text: "{name}{josa:topic} 웃을 때마다 내가 더 확신하게 돼.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진", "다정함"],
    intensity: 3,
  },
  {
    text: "이쯤 되면 숨기는 게 더 티 나. 나 {name} 좋아해.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진"],
    intensity: 4,
  },
  {
    text: "{name}{josa:subject} 자꾸 생각나는 수준이 아니라 그냥 하루에 상주해.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진", "능청"],
    intensity: 3,
  },
  {
    text: "플러팅 테스트 끝났고 이제 본게임 들어가도 되지? 나 진심이야.",
    tags: ["고백", "밈"],
    situation: ["고백 직전"],
    tone: ["직진", "밈"],
    intensity: 4,
    usesName: false,
  },
  {
    text: "{name}{josa:topic} 좋아하냐고 물으면 애매하게 못 답하겠어. 너무 맞거든.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["직진", "다정함"],
    intensity: 4,
  },
  {
    text: "내가 요즘 제일 솔직해지고 싶은 사람은 {name}야.",
    tags: ["고백"],
    situation: ["고백 직전"],
    tone: ["다정함", "직진"],
    intensity: 3,
  },
  {
    text: "{name}{josa:subject} 시험장 들어가면 문제들이 먼저 긴장할 듯.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["가벼움", "다정함"], intensity: 1
  },
  {
    text: "찍는 것마다 정답 되라고 내가 몰래 기도해둘게.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["다정함"], intensity: 1, usesName: false
  },
  {
    text: "{name}{josa:topic} 오늘도 잘할 사람이라 걱정보다 기대가 더 커.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["다정함"], intensity: 1
  },
  {
    text: "시험지야 긴장해라. 오늘 {name} 만난다.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["밈", "가벼움"], intensity: 1
  },
  {
    text: "{name}{josa:subject} 푼 문제들은 다 스스로 정답 체크할 것 같아. 너무 확신형이라.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["가벼움", "다정함"], intensity: 2
  },
  {
    text: "잘 보고 오고, 끝나면 내가 제일 먼저 잘했다고 해줄게.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["다정함"], intensity: 1, usesName: false
  },
  {
    text: "{name}{josa:topic} 이미 충분히 잘하고 있어. 오늘은 침착하게만 가면 돼.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["다정함"], intensity: 1
  },
  {
    text: "문제보다 {name}{josa:subject} 더 차분할 걸? 그러니까 이긴 거야.", tags: ["시험", "응원"], situation: ["시험 응원"], tone: ["다정함", "가벼움"], intensity: 1
  },
  {
    text: "자기 전에 {name} 생각하고 자면 좋은 꿈 확률 100퍼.", tags: ["자기 전"], situation: ["자기 전"], tone: ["가벼움", "다정함"], intensity: 2
  },
  {
    text: "오늘 하루 수고했어. 마지막 생각이 {name}라서 좀 더 좋네.", tags: ["자기 전"], situation: ["자기 전"], tone: ["다정함"], intensity: 2
  },
  {
    text: "{name}{josa:subject} 잘 자라는 말도 왜 이렇게 설레게 하지.", tags: ["자기 전"], situation: ["자기 전"], tone: ["다정함", "직진"], intensity: 2
  },
  {
    text: "좋은 꿈 꿔. 가능하면 내가 나오는 쪽으로.", tags: ["자기 전"], situation: ["자기 전"], tone: ["밈", "능청"], intensity: 2, usesName: false
  },
  {
    text: "{name}{josa:topic} 오늘 내 마지막 알림이었으면 좋겠다. 기분 좋게 잠들게.", tags: ["자기 전"], situation: ["자기 전"], tone: ["다정함", "직진"], intensity: 3
  },
  {
    text: "잘 자 한마디에 심장이 이렇게 바빠도 되나 싶다.", tags: ["자기 전"], situation: ["자기 전"], tone: ["다정함", "직진"], intensity: 3, usesName: false
  },
  {
    text: "{name}{josa:subject} 오늘 내 생각 조금만 하고 자. 나는 많이 할 거니까.", tags: ["자기 전"], situation: ["자기 전"], tone: ["직진", "다정함"], intensity: 3
  },
  {
    text: "오늘 하루 엔딩 멘트는 {name}한테 맡기고 싶네.", tags: ["자기 전"], situation: ["자기 전"], tone: ["가벼움", "다정함"], intensity: 2
  },
];

export const jujeobItems: JujeobItem[] = [
  ...buildCategoryItems("말장난형", "pun", punSeeds, {
    tags: ["말장난", "개인화"],
    situation: ["일상", "썸", "스토리 답장"],
    tone: ["가벼움", "능청"],
    intensity: 2,
    usesName: true,
  }),
  ...buildCategoryItems("과장형", "exg", exaggerationSeeds, {
    tags: ["과장", "칭찬"],
    situation: ["일상", "썸", "고백 직전"],
    tone: ["직진", "다정함"],
    intensity: 3,
    usesName: true,
  }),
  ...buildCategoryItems("짧은 밈형", "meme", shortMemeSeeds, {
    tags: ["짧은형", "밈"],
    situation: ["일상", "스토리 답장", "썸"],
    tone: ["밈", "가벼움"],
    intensity: 2,
    usesName: true,
  }),
  ...buildCategoryItems("상황형", "sit", situationalSeeds, {
    tags: ["상황형"],
    situation: ["일상"],
    tone: ["가벼움", "다정함"],
    intensity: 2,
    usesName: true,
  }),
];

export const previewItems = jujeobItems.slice(0, 2);
