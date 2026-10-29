'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Headphones,
  ExternalLink,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Laptop,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SlingButton from '@/components/ui/sling-button';
import { SpotifyData, SpotifyTrack } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpotifyModalProps {
  spotifyData?: SpotifyData;
  className?: string;
}

interface LanyardSpotifyData {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps?: {
    start: number;
    end: number;
  };
}

interface LanyardResponse {
  success: boolean;
  data: {
    listening_to_spotify: boolean;
    spotify?: LanyardSpotifyData;
    active_on_discord_desktop?: boolean;
    active_on_discord_mobile?: boolean;
    active_on_discord_web?: boolean;
  };
}

const STORAGE_KEY = 'fnh_spotify_last_played';

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('w-4 h-4 text-[#1DB954]', className)}
      aria-label="Spotify"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306a.754.754 0 0 1-1.04.25c-2.85-1.74-6.438-2.134-10.665-1.168a.753.753 0 1 1-.338-1.468c4.629-1.057 8.587-.604 11.793 1.346a.755.755 0 0 1 .25 1.04zm1.467-3.262a.944.944 0 0 1-1.3.313c-3.26-2.004-8.23-2.586-12.086-1.415a.944.944 0 1 1-.555-1.802c4.41-1.339 9.897-.686 13.628 1.604a.944.944 0 0 1 .313 1.3zm.126-3.41c-3.91-2.321-10.362-2.535-14.095-1.401a1.132 1.132 0 0 1-.655-2.167c4.29-1.303 11.41-1.055 15.918 1.621a1.132 1.132 0 0 1-1.168 1.947z" />
    </svg>
  );
}

function Equalizer() {
  return (
    <div className="flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden="true">
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] h-2.5" />
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.2s] h-3.5" />
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_0.4s] h-1.5" />
    </div>
  );
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SpotifyModal({ spotifyData, className }: SpotifyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const discordUserId = spotifyData?.discordUserId || '1129671251271622746';

  const fallbackTrack: SpotifyTrack = spotifyData?.defaultTrack || {
    song: 'Teh Hijau',
    artist: 'Tulus',
    album: 'Monokrom',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273fb31e82b5f6ff9e5ed448dd4',
    trackUrl: 'https://open.spotify.com',
  };

  const [track, setTrack] = useState<SpotifyTrack>(fallbackTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timestamps, setTimestamps] = useState<{ start: number; end: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load cached track
  useEffect(() => {
    setMounted(true);
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SpotifyTrack;
        if (parsed?.song) {
          setTrack(parsed);
        }
      }
    } catch {
      // Ignore
    }

    const fetchLanyard = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${discordUserId}`,
          { cache: 'no-store' }
        );
        if (!res.ok) return;

        const data: LanyardResponse = await res.json();
        if (data.success && data.data) {
          if (data.data.listening_to_spotify && data.data.spotify) {
            const currentTrack: SpotifyTrack = {
              song: data.data.spotify.song,
              artist: data.data.spotify.artist,
              album: data.data.spotify.album,
              albumArtUrl: data.data.spotify.album_art_url,
              trackUrl: `https://open.spotify.com/track/${data.data.spotify.track_id}`,
            };
            setTrack(currentTrack);
            setIsPlaying(true);
            if (data.data.spotify.timestamps) {
              setTimestamps(data.data.spotify.timestamps);
            }

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTrack));
            } catch {
              // Ignore
            }
          } else {
            setIsPlaying(false);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Lanyard Spotify data:', err);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 12000);
    return () => clearInterval(interval);
  }, [discordUserId]);

  // Real-time progress bar tick every 500ms when playing
  useEffect(() => {
    if (!isPlaying || !timestamps) return;
    const ticker = setInterval(() => {
      setCurrentTime(Date.now());
    }, 500);
    return () => clearInterval(ticker);
  }, [isPlaying, timestamps]);

  // Compute live progress percentage & elapsed time
  const { elapsedMs, durationMs, progressPercent } = useMemo(() => {
    if (timestamps && isPlaying) {
      const total = Math.max(1, timestamps.end - timestamps.start);
      const elapsed = Math.min(total, Math.max(0, currentTime - timestamps.start));
      const pct = (elapsed / total) * 100;
      return { elapsedMs: elapsed, durationMs: total, progressPercent: pct };
    }
    // Fallback static duration for showcase
    return { elapsedMs: 72000, durationMs: 224000, progressPercent: 32 };
  }, [timestamps, isPlaying, currentTime]);

  const loreText =
    spotifyData?.lore ||
    'Kalau lagi senggang, intip apa yang lagi nemenin gw ngoding.';

  return (
    <>
      {/* Trigger: Tactile Sling Button in Heatmap Card Header */}
      <div
        className={cn(
          'inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-surface-raised border border-border hover:border-[#1DB954]/50 transition-colors shadow-2xs group touch-manipulation',
          className
        )}
      >
        <div className="flex items-center gap-1.5 pl-0.5 sm:pl-1 min-w-0">
          <Headphones className="w-3.5 h-3.5 text-muted group-hover:text-[#1DB954] transition-colors shrink-0" />
          <span className="text-xs font-mono font-medium text-foreground truncate">
            <span className="inline sm:hidden">Spotify</span>
            <span className="hidden sm:inline">Spotify Player</span>
          </span>
          {mounted && isPlaying && (
            <span className="flex items-center gap-1 ml-0.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              <Equalizer />
            </span>
          )}
        </div>

        {/* SlingButton trigger */}
        <div className="shrink-0 flex items-center justify-center">
          <SlingButton
            size={30}
            strokeWidth={2}
            padColor="#18181b"
            iconColor="#1DB954"
            accentColor="#1DB954"
            wellColor="#27272a"
            bandColor="#52525b"
            maxPull={90}
            ariaLabel="Open Spotify player"
            onSend={() => setIsOpen(true)}
          >
            <SpotifyIcon className="w-3.5 h-3.5 text-[#1DB954]" />
          </SlingButton>
        </div>
      </div>

      {/* Spotify Player Modal — macOS Style Launch, Zero Scroller Kanan-Kiri, No AI Slop */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[370px] p-0 border border-zinc-800 bg-[#121212] text-white rounded-3xl shadow-2xl overflow-hidden focus:outline-none">
          <div className="w-full max-h-[88dvh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 sm:p-6 space-y-4">
            {/* Header Status Bar */}
            <DialogHeader className="space-y-0 text-left">
              <div className="flex items-center justify-between gap-2 pr-7">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-zinc-900 border border-zinc-800 text-[#1DB954]">
                    <SpotifyIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{mounted && isPlaying ? 'NOW PLAYING' : 'RECENTLY PLAYED'}</span>
                  </span>
                  {mounted && isPlaying && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1DB954] font-medium">
                      <Equalizer />
                      <span className="text-[10px]">LIVE</span>
                    </span>
                  )}
                </div>
              </div>

              <DialogTitle className="sr-only">
                Spotify: {track.song} by {track.artist}
              </DialogTitle>
            </DialogHeader>

            {/* Album Cover Canvas */}
            <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border border-white/10 group/cover">
              {track.albumArtUrl ? (
                <Image
                  src={track.albumArtUrl}
                  alt={`${track.song} album artwork`}
                  fill
                  sizes="(max-width: 640px) 192px, 224px"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover/cover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                  <SpotifyIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Track Info & Like Action */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="min-w-0 flex-1">
                <a
                  href={track.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg sm:text-xl font-bold tracking-tight text-white hover:underline truncate"
                >
                  {track.song}
                </a>
                <p className="text-xs sm:text-sm text-zinc-400 truncate mt-0.5">
                  <span>{track.artist}</span>
                  {track.album && (
                    <span className="text-zinc-500"> • {track.album}</span>
                  )}
                </p>
              </div>

              {/* Like Toggle */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors shrink-0 touch-manipulation active:scale-90"
                aria-label={isLiked ? 'Unlike track' : 'Like track'}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isLiked
                      ? 'fill-[#1DB954] text-[#1DB954]'
                      : 'hover:text-white'
                  )}
                />
              </button>
            </div>

            {/* Spotify Scrubber / Seek Bar */}
            <div className="space-y-1 pt-1">
              <div className="py-1 cursor-pointer touch-manipulation group/bar">
                <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white group-hover/bar:bg-[#1DB954] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-zinc-500">
                <span>{formatTime(elapsedMs)}</span>
                <span>{formatTime(durationMs)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1 px-1">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-full transition-all touch-manipulation active:scale-90',
                  isShuffle ? 'text-[#1DB954]' : 'text-zinc-400 hover:text-white'
                )}
                aria-label="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-300 hover:text-white transition-all touch-manipulation active:scale-90"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause */}
              <a
                href={track.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-90 shadow-lg touch-manipulation"
                aria-label="Play on Spotify"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </a>

              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-300 hover:text-white transition-all touch-manipulation active:scale-90"
                aria-label="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-full transition-all touch-manipulation active:scale-90',
                  isRepeat ? 'text-[#1DB954]' : 'text-zinc-400 hover:text-white'
                )}
                aria-label="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Lore Note */}
            {loreText && (
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider block">
                  Curator&apos;s Note
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  &ldquo;{loreText}&rdquo;
                </p>
              </div>
            )}

            {/* Bottom Section: Device Status & Open in Spotify CTA */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 min-w-0">
                <Laptop className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                <span className="truncate">
                  {isPlaying ? 'Listening via Spotify' : 'Synced with Discord'}
                </span>
              </div>

              <a
                href={track.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold text-xs transition-colors shrink-0 touch-manipulation active:scale-95"
              >
                <SpotifyIcon className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Open Spotify</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
