"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { renderTemplate } from "@/lib/josa";
import { jujeobItems } from "@/lib/jujeob-data";
import { jujeobChatDB } from "@/lib/jujeob-chat-data";
import { normalizeName, renderChatItem, validateName } from "@/lib/jujeob-engine";
import type { JujeobChatItem } from "@/lib/types";

const DEFAULT_NAME = "민지";
const FAVORITES_STORAGE_KEY = "jujeob-machine:favorites";
const MAX_FAVORITES = 12;
const MAC_WINDOW_CONTROLS = [
  { id: "close", color: "bg-[#ff5f57]" },
  { id: "minimize", color: "bg-[#febc2e]" },
  { id: "maximize", color: "bg-[#28c840]" },
] as const;

const BACKGROUND_NAMES = ["민주", "민지", "해린", "서연", "지민", "준혁", "유진", "하린"];
const ROTATIONS = [-3, 2, -2, 4, -4, 3, -1, 1];

const backgroundPosts = jujeobItems.slice(0, 20).map((item, index) => ({
  id: `background-${item.id}`,
  author: `user_${index + 11}`,
  text: renderTemplate(item.text, BACKGROUND_NAMES[index % BACKGROUND_NAMES.length]),
  likes: 30 + index * 7,
  comments: 2 + (index % 9),
  rotation: ROTATIONS[index % ROTATIONS.length],
}));

type FavoriteChat = {
  id: string;
  itemId: string;
  name: string;
  opener: string;
  reply: string;
  punchline: string;
  savedAt: number;
};

function createFavoriteId(itemId: string, name: string) {
  return `${itemId}:${name}`;
}

function isFavoriteChat(value: unknown): value is FavoriteChat {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.itemId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.opener === "string" &&
    typeof candidate.reply === "string" &&
    typeof candidate.punchline === "string" &&
    typeof candidate.savedAt === "number"
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    const result = document.execCommand("copy");
    document.body.removeChild(textarea);

    return result;
  }
}

function pickNextChatItem(currentItemId: string, seenIds: string[]) {
  const freshPool = jujeobChatDB.filter(
    (item) => item.id !== currentItemId && !seenIds.includes(item.id),
  );

  if (freshPool.length > 0) {
    return freshPool[Math.floor(Math.random() * freshPool.length)];
  }

  const fallbackPool = jujeobChatDB.filter((item) => item.id !== currentItemId);
  return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
}

const collageSources = [
  { id: "collage-1", src: "/background-collage/1.jpg" },
  { id: "collage-2", src: "/background-collage/2.jpeg" },
  { id: "collage-3", src: "/background-collage/3.png" },
  { id: "collage-4", src: "/background-collage/4.jpg" },
  { id: "collage-5", src: "/background-collage/5.jpeg" },
  { id: "collage-6", src: "/background-collage/6.jpg" },
  { id: "collage-7", src: "/background-collage/7.jpg" },
  { id: "collage-8", src: "/background-collage/8.jpg" },
  { id: "collage-9", src: "/background-collage/9.jpg" },
  { id: "collage-10", src: "/background-collage/10.jpg" },
  { id: "collage-11", src: "/background-collage/11.jpg" },
  { id: "collage-12", src: "/background-collage/12.png" },
  { id: "collage-13", src: "/background-collage/13.jpeg" },
  { id: "collage-14", src: "/background-collage/14.jpeg" },
  { id: "collage-15", src: "/background-collage/15.jpg" },
];

const collageSourceOrder = [15, 4, 7, 12, 10, 2, 14, 9, 3, 11, 1, 13, 5, 8, 6] as const;

const collageLayouts = [
  { top: -4, left: -4, width: 21, rotate: -7, zIndex: 2 },
  { top: -6, left: 20, width: 22, rotate: 3, zIndex: 4 },
  { top: -7, left: 39, width: 19, rotate: -2, zIndex: 6 },
  { top: -6, left: 56, width: 23, rotate: 5, zIndex: 5 },
  { top: -3, left: 78, width: 19, rotate: 7, zIndex: 3 },
  { top: 17, left: -12, width: 24, rotate: -13, zIndex: 7 },
  { top: 29, left: 1, width: 22, rotate: -7, zIndex: 8 },
  { top: 14, left: 80, width: 20, rotate: 9, zIndex: 8 },
  { top: 34, left: 82, width: 22, rotate: 3, zIndex: 9 },
  { top: 57, left: 81, width: 21, rotate: -4, zIndex: 10 },
  { top: 58, left: -9, width: 30, rotate: 4, zIndex: 1 },
  { top: 70, left: 11, width: 19, rotate: -5, zIndex: 5 },
  { top: 72, left: 32, width: 21, rotate: 1, zIndex: 6 },
  { top: 71, left: 54, width: 18, rotate: -2, zIndex: 6 },
  { top: 66, left: 70, width: 20, rotate: -3, zIndex: 7 },
] as const;

const collageOffsets = [
  { x: 0, y: 0, rotate: 0.5 },
  { x: -1, y: 1, rotate: -0.8 },
  { x: 1, y: 0, rotate: 0.6 },
  { x: -1, y: -1, rotate: 0.9 },
  { x: 1, y: 1, rotate: -0.7 },
  { x: 0, y: -1, rotate: -1.1 },
  { x: 1, y: 0, rotate: 0.7 },
  { x: -1, y: 1, rotate: -0.5 },
  { x: 0, y: 0, rotate: 0.8 },
  { x: -1, y: 1, rotate: -0.6 },
  { x: 1, y: 0, rotate: 1.0 },
  { x: 1, y: -1, rotate: -0.8 },
  { x: 0, y: 0, rotate: 0.6 },
  { x: -1, y: -1, rotate: -0.5 },
  { x: 1, y: 0, rotate: 0.4 },
] as const;

const mobileCollageSourceOrder = [15, 4, 10, 2, 14, 1, 13, 5, 6] as const;

const mobileCollageLayouts = [
  { top: -10, left: -14, width: 40, rotate: -10, zIndex: 2 },
  { top: -12, left: 24, width: 39, rotate: 3, zIndex: 4 },
  { top: -9, left: 68, width: 37, rotate: 7, zIndex: 3 },
  { top: 13, left: -18, width: 41, rotate: -13, zIndex: 6 },
  { top: 18, left: 82, width: 36, rotate: 9, zIndex: 6 },
  { top: 54, left: -16, width: 43, rotate: 3, zIndex: 1 },
  { top: 68, left: 18, width: 32, rotate: -4, zIndex: 5 },
  { top: 71, left: 49, width: 31, rotate: -2, zIndex: 5 },
  { top: 60, left: 76, width: 35, rotate: -5, zIndex: 7 },
] as const;

function buildCollageItems<
  TLayout extends ReadonlyArray<{ top: number; left: number; width: number; rotate: number; zIndex: number }>,
  TOrder extends ReadonlyArray<number>,
>(layouts: TLayout, order: TOrder, offsets: ReadonlyArray<{ x: number; y: number; rotate: number }>) {
  return layouts.map((layout, index) => {
    const source = collageSources[order[index] - 1];
    const offset = offsets[index % offsets.length];

    return {
      id: `${source.id}-${index}`,
      src: source.src,
      fallbackText: backgroundPosts[index % backgroundPosts.length].text,
      style: {
        top: `${layout.top + offset.y}%`,
        left: `${layout.left + offset.x}%`,
        width: `${layout.width}%`,
        transform: `rotate(${layout.rotate + offset.rotate}deg)`,
        zIndex: layout.zIndex,
      } satisfies CSSProperties,
    };
  });
}

function CollageTile({
  src,
  fallbackText,
  style,
}: {
  src: string;
  fallbackText: string;
  style: CSSProperties;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="absolute overflow-hidden rounded-[6px] border border-black/15 bg-white px-5 py-6 text-center text-[clamp(14px,1.8vw,26px)] font-semibold leading-[1.35] text-black shadow-[0_18px_35px_rgba(0,0,0,0.24)]"
        style={style}
      >
        <p className="line-clamp-5 whitespace-pre-line break-keep">{fallbackText}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="absolute block select-none rounded-[4px] object-cover shadow-[0_18px_35px_rgba(0,0,0,0.24)]"
      style={style}
      onError={() => setHasError(true)}
    />
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M6.7 4.8C7.1 4.3 7.8 4.1 8.4 4.4L10.6 5.5C11.2 5.8 11.5 6.5 11.3 7.1L10.7 9.4C10.6 9.8 10.7 10.2 11 10.5L13.5 13C13.8 13.3 14.2 13.4 14.6 13.3L16.9 12.7C17.5 12.5 18.2 12.8 18.5 13.4L19.6 15.6C19.9 16.2 19.7 16.9 19.2 17.3L17.9 18.4C17.1 19.1 16 19.4 15 19.1C12.3 18.3 9.8 16.8 7.8 14.8C5.8 12.8 4.3 10.3 3.5 7.6C3.2 6.6 3.5 5.5 4.2 4.7L6.7 4.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="3.5" y="6.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M14.5 10L19.5 7.5V16.5L14.5 14V10Z" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path d="M5 7H19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M5 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M5 17H19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function KakaoProfileAvatar() {
  return (
    <div
      aria-hidden="true"
      className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#f5d64f] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_3px_8px_rgba(0,0,0,0.08)]"
    >
      <img
        src="/background-collage/0.jpg"
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

function BackgroundWall() {
  const desktopCollageItems = buildCollageItems(collageLayouts, collageSourceOrder, collageOffsets);
  const mobileCollageItems = buildCollageItems(
    mobileCollageLayouts,
    mobileCollageSourceOrder,
    collageOffsets,
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-white/18" />
      <div className="absolute left-1/2 top-1/2 h-[140vw] w-[138vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.9] blur-[0.15px] sm:hidden">
        {mobileCollageItems.map((item) => (
          <CollageTile
            key={item.id}
            src={item.src}
            fallbackText={item.fallbackText}
            style={item.style}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 hidden h-[min(92vw,920px)] w-[min(99vw,1380px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.95] blur-[0.15px] sm:block">
        {desktopCollageItems.map((item) => (
          <CollageTile
            key={item.id}
            src={item.src}
            fallbackText={item.fallbackText}
            style={item.style}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.08)_18%,rgba(12,12,12,0.18)_34%,rgba(8,8,8,0.74)_100%)]" />
    </div>
  );
}

export function JujeobMachine() {
  const [name, setName] = useState("");
  const [selectedItem, setSelectedItem] = useState<JujeobChatItem>(jujeobChatDB[0]);
  const [seenIds, setSeenIds] = useState<string[]>([jujeobChatDB[0].id]);
  const [favorites, setFavorites] = useState<FavoriteChat[]>([]);
  const [error, setError] = useState("");
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [toast, setToast] = useState("");
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedName = normalizeName(name);
  const effectiveName = normalizedName || DEFAULT_NAME;
  const chat = renderChatItem(selectedItem, effectiveName);
  const resultText = [chat.renderedOpener, chat.renderedReply, chat.renderedPunchline].join("\n");
  const subtitleText = `나 몰랐는데 ${effectiveName} 좋아하네..`;
  const currentFavoriteId = createFavoriteId(selectedItem.id, effectiveName);
  const isCurrentFavorite = favorites.some((favorite) => favorite.id === currentFavoriteId);
  const isShareSupported = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

      if (rawFavorites) {
        const parsedFavorites = JSON.parse(rawFavorites);

        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites.filter(isFavoriteChat).slice(0, MAX_FAVORITES));
        }
      }
    } catch {
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } finally {
      setHasLoadedFavorites(true);
    }

    const currentUrl = new URL(window.location.href);
    const sharedName = normalizeName(currentUrl.searchParams.get("name") ?? "");
    const sharedItemId = currentUrl.searchParams.get("chat");

    if (sharedName && !validateName(sharedName)) {
      setName(sharedName);
    }

    if (sharedItemId) {
      const sharedItem = jujeobChatDB.find((item) => item.id === sharedItemId);

      if (sharedItem) {
        setSelectedItem(sharedItem);
        setSeenIds([sharedItem.id]);
      }
    }

    setHasHydratedFromUrl(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFavorites || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, hasLoadedFavorites]);

  useEffect(() => {
    if (!hasHydratedFromUrl || typeof window === "undefined") {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(window.location.href);
    const hasCustomState = Boolean(normalizedName) || selectedItem.id !== jujeobChatDB[0].id;

    if (!hasCustomState) {
      const clearedUrl = `${nextUrl.pathname}${nextUrl.hash}`;
      const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

      if (currentPath !== clearedUrl) {
        window.history.replaceState(null, "", clearedUrl);
      }

      return;
    }

    if (normalizedName) {
      nextUrl.searchParams.set("name", normalizedName);
    } else {
      nextUrl.searchParams.delete("name");
    }

    nextUrl.searchParams.set("chat", selectedItem.id);

    const nextPath = `${nextUrl.pathname}?${nextUrl.searchParams.toString()}${nextUrl.hash}`;
    const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

    if (currentPath !== nextPath) {
      window.history.replaceState(null, "", nextPath);
    }
  }, [hasHydratedFromUrl, normalizedName, selectedItem.id]);

  function showToast(message: string) {
    setToast(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast("");
    }, 1800);
  }

  function generateJujeob() {
    const currentNameError = validateName(name);

    if (currentNameError) {
      setError(currentNameError);
      return;
    }

    const selected = pickNextChatItem(selectedItem.id, seenIds);

    if (!selected) {
      showToast("지금은 더 뽑을 멘트가 없어.");
      return;
    }

    setSelectedItem(selected);
    setSeenIds((current) => [...new Set([...current, selected.id])]);
    setError("");
  }

  async function handleCopyBubble(text: string) {
    const copied = await copyText(text);
    showToast(copied ? "복사됨" : "복사 실패");
  }

  async function handleCopyConversation() {
    const copied = await copyText(resultText);
    showToast(copied ? "대화 전체 복사됨" : "복사 실패");
  }

  function handleToggleFavorite() {
    if (isCurrentFavorite) {
      setFavorites((current) => current.filter((favorite) => favorite.id !== currentFavoriteId));
      showToast("즐겨찾기 해제됨");
      return;
    }

    const nextFavorite: FavoriteChat = {
      id: currentFavoriteId,
      itemId: selectedItem.id,
      name: effectiveName,
      opener: chat.renderedOpener,
      reply: chat.renderedReply,
      punchline: chat.renderedPunchline,
      savedAt: Date.now(),
    };

    setFavorites((current) => [nextFavorite, ...current.filter((favorite) => favorite.id !== nextFavorite.id)].slice(0, MAX_FAVORITES));
    showToast("즐겨찾기에 저장됨");
  }

  function getShareUrl() {
    if (typeof window === "undefined") {
      return "";
    }

    const shareUrl = new URL(window.location.href);

    if (normalizedName) {
      shareUrl.searchParams.set("name", normalizedName);
    } else {
      shareUrl.searchParams.delete("name");
    }

    shareUrl.searchParams.set("chat", selectedItem.id);

    return shareUrl.toString();
  }

  async function handleCopyShareLink() {
    const copied = await copyText(getShareUrl());
    showToast(copied ? "링크 복사됨" : "복사 실패");
  }

  async function handleShare() {
    const shareUrl = getShareUrl();

    if (!shareUrl) {
      showToast("공유 링크 생성 실패");
      return;
    }

    if (!isShareSupported) {
      await handleCopyShareLink();
      return;
    }

    try {
      await navigator.share({
        title: "주접자판기",
        text: resultText,
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const copied = await copyText(shareUrl);
      showToast(copied ? "링크 복사됨" : "공유 실패");
    }
  }

  function handleLoadFavorite(favorite: FavoriteChat) {
    const favoriteItem = jujeobChatDB.find((item) => item.id === favorite.itemId);

    if (!favoriteItem) {
      showToast("원본 멘트를 찾을 수 없어.");
      return;
    }

    setName(favorite.name);
    setSelectedItem(favoriteItem);
    setSeenIds((current) => [...new Set([favoriteItem.id, ...current])]);
    setError("");
    showToast("즐겨찾기 불러옴");
  }

  async function handleCopyFavorite(favorite: FavoriteChat) {
    const copied = await copyText([favorite.opener, favorite.reply, favorite.punchline].join("\n"));
    showToast(copied ? "즐겨찾기 복사됨" : "복사 실패");
  }

  function handleRemoveFavorite(favoriteId: string) {
    setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId));
    showToast("즐겨찾기 삭제됨");
  }

  async function handleSavePreviewImage() {
    const previewNode = previewRef.current;

    if (!previewNode || isSavingImage) {
      return;
    }

    setIsSavingImage(true);

    try {
      const dataUrl = await toPng(previewNode, {
        cacheBust: true,
        pixelRatio: Math.max(2, window.devicePixelRatio || 1),
      });
      const downloadLink = document.createElement("a");
      const fileName = `jujeob-${effectiveName}.png`;

      downloadLink.href = dataUrl;
      downloadLink.download = fileName;
      downloadLink.click();
      showToast("이미지 저장됨");
    } catch {
      showToast("이미지 저장 실패");
    } finally {
      setIsSavingImage(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#111214] px-3 py-5 text-white sm:min-h-screen sm:px-4 sm:py-8">
      <BackgroundWall />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center sm:max-w-3xl">
        <h1 className="text-[2.5rem] font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)] sm:text-6xl">
          주접자판기
        </h1>
        <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white/92 sm:mt-4 sm:text-3xl">
          {subtitleText}
        </p>

        <form
          className="mt-7 flex w-full max-w-md flex-col items-center gap-3 sm:mt-10"
          onSubmit={(event) => {
            event.preventDefault();
            generateJujeob();
          }}
        >
          <label htmlFor="name" className="text-sm font-medium text-white/82">
            이름이 뭐야..
          </label>
          <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <input
              id="name"
              value={name}
              maxLength={10}
              placeholder="이름/별명"
              className="h-12 min-h-12 w-full flex-1 appearance-none rounded-md border border-white/30 bg-white/94 px-4 py-3 text-base leading-5 text-slate-900 outline-none transition focus:border-white sm:h-11 sm:min-h-11 sm:py-0 sm:text-sm"
              onChange={(event) => {
                setName(event.target.value);
                if (error) {
                  setError("");
                }
              }}
            />
            <button
              type="submit"
              className="h-12 min-h-12 w-full rounded-md border border-white/35 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-white/92 sm:h-11 sm:min-h-11 sm:w-auto"
            >
              주접 뽑기
            </button>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>

        <div className="mt-6 flex w-full max-w-[720px] flex-col gap-3 sm:mt-8">
          <div
            ref={previewRef}
            className="block w-full rounded-[22px] border border-white/25 bg-[#abc1d1] px-2.5 pb-2.5 pt-2 text-left text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:rounded-[26px] sm:px-4 sm:pb-4 sm:pt-3"
          >
            <div className="overflow-hidden rounded-[18px] bg-[#b9cfdd] sm:rounded-[22px]">
              <div className="border-b border-black/5 bg-[#a7bece] px-4 pb-2.5 pt-0.5 sm:px-5 sm:pb-3 sm:pt-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {MAC_WINDOW_CONTROLS.map((control) => (
                      <span
                        key={control.id}
                        aria-hidden="true"
                        className={`h-3 w-3 rounded-full border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${control.color}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5" aria-hidden="true">
                    <span className="h-1.5 w-10 rounded-full bg-black/8" />
                    <span className="h-3 w-3 rounded-full border border-white/60 bg-white/45" />
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <KakaoProfileAvatar />

                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-800">
                        {effectiveName}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 text-slate-800 sm:gap-1">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
                      <SearchIcon />
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
                      <PhoneIcon />
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
                      <VideoIcon />
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
                      <MenuIcon />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 bg-[#b9cfdd] px-3 py-3 sm:space-y-3 sm:px-5 sm:py-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="max-w-[88%] rounded-[16px] rounded-br-md bg-[#ffe45c] px-3.5 py-2.5 text-left text-sm leading-6 text-slate-900 shadow-sm transition hover:brightness-[0.98] sm:max-w-[84%] sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-[15px] sm:leading-7"
                    onClick={() => handleCopyBubble(chat.renderedOpener)}
                  >
                    {chat.renderedOpener}
                  </button>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    className="max-w-[82%] rounded-[16px] rounded-bl-md bg-white px-3.5 py-2.5 text-left text-sm leading-6 text-slate-900 shadow-sm transition hover:bg-slate-50 sm:max-w-[78%] sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-[15px] sm:leading-7"
                    onClick={() => handleCopyBubble(chat.renderedReply)}
                  >
                    {chat.renderedReply}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="max-w-[88%] rounded-[16px] rounded-br-md bg-[#ffe45c] px-3.5 py-2.5 text-left text-sm font-semibold leading-6 text-slate-900 shadow-sm transition hover:brightness-[0.98] sm:max-w-[84%] sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-[15px] sm:leading-7"
                    onClick={() => handleCopyBubble(chat.renderedPunchline)}
                  >
                    {chat.renderedPunchline}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex w-full max-w-[720px] flex-col items-center gap-3 px-1">
          <p className="px-3 text-center text-sm text-white/76">
            말풍선을 누르면 해당 문장만 복사돼요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/15"
              onClick={handleCopyConversation}
            >
              대화 전체 복사
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/15"
              onClick={handleToggleFavorite}
            >
              {isCurrentFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/15"
              onClick={handleCopyShareLink}
            >
              링크 복사
            </button>
            {isShareSupported ? (
              <button
                type="button"
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/15"
                onClick={handleShare}
              >
                공유하기
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-55"
              onClick={handleSavePreviewImage}
              disabled={isSavingImage}
            >
              {isSavingImage ? "저장 중..." : "이미지로 저장"}
            </button>
          </div>
        </div>

        {favorites.length > 0 ? (
          <section className="mt-4 w-full max-w-[720px] rounded-[24px] border border-white/15 bg-black/20 p-4 text-left backdrop-blur-md sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                  즐겨찾기
                </h2>
                <p className="mt-1 text-xs text-white/58 sm:text-sm">
                  저장한 주접 멘트를 다시 불러오거나 바로 복사할 수 있어요.
                </p>
              </div>
              <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/72">
                {favorites.length}개
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {favorites.map((favorite) => (
                <article
                  key={favorite.id}
                  className="rounded-[20px] border border-white/12 bg-white/8 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white sm:text-[15px]">
                        {favorite.name}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {new Date(favorite.savedAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/12 bg-black/15 px-2 py-1 text-[11px] font-semibold text-white/70">
                      {favorite.itemId}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-5 whitespace-pre-line break-keep text-sm leading-6 text-white/82">
                    {[favorite.opener, favorite.reply, favorite.punchline].join("\n")}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/84 transition hover:bg-white/15"
                      onClick={() => handleLoadFavorite(favorite)}
                    >
                      다시 보기
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/84 transition hover:bg-white/15"
                      onClick={() => handleCopyFavorite(favorite)}
                    >
                      복사
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/84 transition hover:bg-white/15"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                    >
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-4 px-4 text-xs leading-6 text-white/58 sm:text-sm">
          예쁜 보고 뽑으시다가 우리집 왼쪽 뺨 뚫지 마세요..
        </p>
      </div>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
