"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { renderTemplate } from "@/lib/josa";
import { jujeobItems } from "@/lib/jujeob-data";
import { jujeobChatDB } from "@/lib/jujeob-chat-data";
import { normalizeName, renderChatItem, validateName } from "@/lib/jujeob-engine";
import type { JujeobChatItem } from "@/lib/types";

type PreviewMode = "kakao" | "instagram";
type RenderedChat = ReturnType<typeof renderChatItem>;

const DEFAULT_NAME = "민지";
const MAC_WINDOW_CONTROLS = [
  { id: "close", color: "bg-[#ff5f57]" },
  { id: "minimize", color: "bg-[#febc2e]" },
  { id: "maximize", color: "bg-[#28c840]" },
] as const;
const PREVIEW_MODE_OPTIONS = [
  { id: "kakao", label: "카카오톡" },
  { id: "instagram", label: "인스타 DM" },
] as const satisfies ReadonlyArray<{ id: PreviewMode; label: string }>;

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

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path d="M15 5L8 12L15 19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10V16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="7.2" r="1" fill="currentColor" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M8.5 7.5L10 5.5H14L15.5 7.5H18C19.1 7.5 20 8.4 20 9.5V16.5C20 17.6 19.1 18.5 18 18.5H6C4.9 18.5 4 17.6 4 16.5V9.5C4 8.4 4.9 7.5 6 7.5H8.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="9" y="4" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M6.5 11.5C6.5 14.5 8.8 16.5 12 16.5C15.2 16.5 17.5 14.5 17.5 11.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M12 16.5V20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path d="M7 17L11 13L13.5 15.5L17 12L20 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function StickerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M10 11H10.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      <path d="M14 11H14.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      <path d="M9 14C9.8 15.2 10.8 15.8 12 15.8C13.2 15.8 14.2 15.2 15 14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M12 19.2L5.8 13.3C4.1 11.7 4.1 9 5.8 7.4C7.4 5.9 10.1 5.9 11.7 7.4L12 7.8L12.3 7.4C13.9 5.9 16.6 5.9 18.2 7.4C19.9 9 19.9 11.7 18.2 13.3L12 19.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfilePhoto({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 overflow-hidden rounded-full bg-[#f5d64f] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_3px_8px_rgba(0,0,0,0.08)] ${className}`}
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

function KakaoProfileAvatar() {
  return <ProfilePhoto className="h-11 w-11" />;
}

function PreviewModeToggle({
  previewMode,
  onChange,
}: {
  previewMode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PREVIEW_MODE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            previewMode === option.id
              ? "bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              : "bg-white/10 text-white/78 hover:bg-white/16"
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function KakaoPreview({
  effectiveName,
  chat,
  onCopyBubble,
}: {
  effectiveName: string;
  chat: RenderedChat;
  onCopyBubble: (text: string) => void;
}) {
  return (
    <div className="rounded-[22px] border border-white/25 bg-[#abc1d1] px-2.5 pb-2.5 pt-2 text-left text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:rounded-[26px] sm:px-4 sm:pb-4 sm:pt-3">
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
              onClick={() => onCopyBubble(chat.renderedOpener)}
            >
              {chat.renderedOpener}
            </button>
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              className="max-w-[82%] rounded-[16px] rounded-bl-md bg-white px-3.5 py-2.5 text-left text-sm leading-6 text-slate-900 shadow-sm transition hover:bg-slate-50 sm:max-w-[78%] sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-[15px] sm:leading-7"
              onClick={() => onCopyBubble(chat.renderedReply)}
            >
              {chat.renderedReply}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="max-w-[88%] rounded-[16px] rounded-br-md bg-[#ffe45c] px-3.5 py-2.5 text-left text-sm font-semibold leading-6 text-slate-900 shadow-sm transition hover:brightness-[0.98] sm:max-w-[84%] sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-[15px] sm:leading-7"
              onClick={() => onCopyBubble(chat.renderedPunchline)}
            >
              {chat.renderedPunchline}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstagramPreview({
  effectiveName,
  chat,
  onCopyBubble,
}: {
  effectiveName: string;
  chat: RenderedChat;
  onCopyBubble: (text: string) => void;
}) {
  return (
    <div className="rounded-[22px] bg-[linear-gradient(145deg,#ff4fd8_0%,#f42493_32%,#ff5c39_74%,#ffca2d_100%)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:rounded-[26px] sm:p-5">
      <div className="mx-auto w-full max-w-[320px] rounded-[34px] border border-black/10 bg-white px-3 pb-3 pt-3 text-slate-900 shadow-[0_22px_45px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between px-2 text-[11px] font-semibold tracking-[0.02em] text-slate-500">
          <span>9:41</span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="h-1.5 w-4 rounded-full bg-slate-400" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 border-b border-slate-100 px-1 pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center text-slate-800">
              <ChevronLeftIcon />
            </span>
            <ProfilePhoto className="h-8 w-8 border border-black/10" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-slate-900">{effectiveName}</p>
              <p className="truncate text-[11px] font-medium text-slate-400">활동 중</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center">
              <PhoneIcon />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center">
              <InfoCircleIcon />
            </span>
          </div>
        </div>

        <div className="space-y-3 px-1 py-4">
          <div className="text-center text-[11px] font-medium text-slate-400">오늘</div>

          <div className="flex justify-end">
            <button
              type="button"
              className="max-w-[84%] rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#d946ef_0%,#7c3aed_100%)] px-3.5 py-2.5 text-left text-[13px] font-medium leading-5 text-white shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition hover:brightness-[1.03]"
              onClick={() => onCopyBubble(chat.renderedOpener)}
            >
              {chat.renderedOpener}
            </button>
          </div>

          <div className="flex items-end gap-2">
            <ProfilePhoto className="h-6 w-6 border border-black/10" />
            <button
              type="button"
              className="max-w-[78%] rounded-[18px] rounded-bl-md bg-[#f2f2f5] px-3.5 py-2.5 text-left text-[13px] font-medium leading-5 text-slate-900 transition hover:bg-slate-200"
              onClick={() => onCopyBubble(chat.renderedReply)}
            >
              {chat.renderedReply}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="max-w-[84%] rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#d946ef_0%,#7c3aed_100%)] px-3.5 py-2.5 text-left text-[13px] font-semibold leading-5 text-white shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition hover:brightness-[1.03]"
              onClick={() => onCopyBubble(chat.renderedPunchline)}
            >
              {chat.renderedPunchline}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-1 pt-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#7c3aed]">
            <CameraIcon />
          </span>
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-slate-200 px-4 text-[13px] font-medium text-slate-400">
            Message...
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center text-slate-500">
            <MicrophoneIcon />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center text-slate-500">
            <GalleryIcon />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center text-slate-500">
            <StickerIcon />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center text-slate-500">
            <HeartIcon />
          </span>
        </div>
      </div>
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
  const [previewMode, setPreviewMode] = useState<PreviewMode>("kakao");
  const [selectedItem, setSelectedItem] = useState<JujeobChatItem>(jujeobChatDB[0]);
  const [seenIds, setSeenIds] = useState<string[]>([jujeobChatDB[0].id]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveName = normalizeName(name) || DEFAULT_NAME;
  const chat = renderChatItem(selectedItem, effectiveName);
  const resultText = [chat.renderedOpener, chat.renderedReply, chat.renderedPunchline].join("\n");
  const subtitleText = `나 몰랐는데 ${effectiveName} 좋아하네..`;

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
              className="h-11 w-full flex-1 rounded-md border border-white/30 bg-white/94 px-4 text-sm text-slate-900 outline-none transition focus:border-white"
              onChange={(event) => {
                setName(event.target.value);
                if (error) {
                  setError("");
                }
              }}
            />
            <button
              type="submit"
              className="h-11 w-full rounded-md border border-white/35 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-white/92 sm:w-auto"
            >
              주접 뽑기
            </button>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>

        <div className="mt-6 w-full max-w-[760px] rounded-[22px] border border-white/15 bg-[rgba(10,11,15,0.5)] p-3 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:mt-8 sm:rounded-[26px] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Preview Mode
              </p>
              <p className="mt-1 text-sm font-semibold text-white/88">
                원하는 메신저 스타일로 미리보기
              </p>
            </div>

            <PreviewModeToggle previewMode={previewMode} onChange={setPreviewMode} />
          </div>

          <div className="mt-4">
            {previewMode === "kakao" ? (
              <KakaoPreview
                effectiveName={effectiveName}
                chat={chat}
                onCopyBubble={handleCopyBubble}
              />
            ) : (
              <InstagramPreview
                effectiveName={effectiveName}
                chat={chat}
                onCopyBubble={handleCopyBubble}
              />
            )}
          </div>
        </div>

        <p className="mt-3 px-3 text-sm text-white/76">말풍선을 누르면 해당 문장만 복사돼요.</p>

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
