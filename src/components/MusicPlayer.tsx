"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type MusicPlayerHandle = {
  play: () => Promise<void>;
  toggle: () => Promise<void>;
};

const MusicPlayer = forwardRef<MusicPlayerHandle>(function MusicPlayer(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function play() {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    try {
      await audioElement.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  async function toggle() {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    try {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
        return;
      }

      await audioElement.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  useImperativeHandle(ref, () => ({
    play,
    toggle,
  }));

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/vals-poetico.mp3"
        loop
        preload="auto"
        className="hidden"
      />

      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/55 px-3 py-2 text-xs font-medium text-[var(--color-ink)] shadow-[0_16px_40px_rgba(93,63,59,0.14)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)] sm:bottom-6 sm:right-6 sm:min-h-11 sm:px-4 sm:text-sm"
        aria-pressed={isPlaying}
      >
        <span className="text-sm leading-none text-[var(--color-blush-deep)]">
          ♪
        </span>
        <span>{isPlaying ? "Pausar música" : "Reproducir música"}</span>
      </button>
    </>
  );
});

export default MusicPlayer;
