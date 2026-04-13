const JOSA_MAP = {
  subject: ["이", "가"],
  topic: ["은", "는"],
  object: ["을", "를"],
  vocative: ["아", "야"],
} as const;

export type JosaKey = keyof typeof JOSA_MAP;

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;

const NUMBER_BATCHIM_MAP: Record<string, boolean> = {
  "0": false,
  "1": true,
  "2": false,
  "3": true,
  "4": false,
  "5": false,
  "6": true,
  "7": true,
  "8": true,
  "9": false,
};

const ENGLISH_BATCHIM_ENDINGS = ["b", "c", "k", "l", "m", "n", "p", "q", "t"];

export function hasBatchim(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const lastChar = trimmed[trimmed.length - 1];
  const codePoint = lastChar.charCodeAt(0);

  if (codePoint >= HANGUL_BASE && codePoint <= HANGUL_END) {
    return (codePoint - HANGUL_BASE) % 28 !== 0;
  }

  if (NUMBER_BATCHIM_MAP[lastChar] !== undefined) {
    return NUMBER_BATCHIM_MAP[lastChar];
  }

  return ENGLISH_BATCHIM_ENDINGS.includes(lastChar.toLowerCase());
}

export function pickJosa(value: string, type: JosaKey) {
  return hasBatchim(value) ? JOSA_MAP[type][0] : JOSA_MAP[type][1];
}

export function renderTemplate(template: string, name: string) {
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{josa:(subject|topic|object|vocative)\}/g, (_, type: JosaKey) => pickJosa(name, type));
}
