// components/ui/spotify-island.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SpotifyTrack } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpotifyIslandProps {
  isNavbarCollapsed: boolean;
  className?: string;
}

interface NowPlayingResponse {
  isPlaying: boolean;
  track: SpotifyTrack;
}

export function SpotifyIsland({ isNavbarCollapsed, className }: SpotifyIslandProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/now-playing', { cache: 'no-store' });
        if (!res.ok) return;
        const data: NowPlayingResponse = await res.json();
        if (data && data.track) {
          setTrack(data.track);
          setIsPlaying(Boolean(data.isPlaying));
        }
      } catch (err) {
        // Silently fail on network glitch
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !isPlaying || !track) {
    return null;
  }

  // Island expands when navbar is collapsed OR when user hovers directly on the island
  const isExpanded = isNavbarCollapsed || isHovered;

  return (
    <a
      href={track.trackUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Open "${track.song}" by ${track.artist} on Spotify`}
      aria-label={`Now playing ${track.song} by ${track.artist}`}
      className={cn(
        'group pointer-events-auto hidden sm:inline-flex items-center h-[38px] rounded-full',
        'bg-zinc-950/95 dark:bg-black/95 text-white',
        'border border-white/15 hover:border-[#1DB954]/50',
        'shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(29,185,84,0.25)]',
        'backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
        'select-none overflow-hidden shrink-0 cursor-pointer',
        isExpanded ? 'w-[155px] sm:w-[168px] px-2.5 gap-2' : 'w-[50px] px-2 justify-between',
        className
      )}
    >
      {/* Spinning Vinyl Album Artwork */}
      <div className="relative w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-full overflow-hidden shrink-0 border border-white/20 shadow-xs">
        {track.albumArtUrl ? (
          <Image
            src={track.albumArtUrl}
            alt={`${track.song} album art`}
            fill
            sizes="26px"
            unoptimized
            className="object-cover animate-[spin_8s_linear_infinite]"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
          </div>
        )}
        {/* Center Vinyl Spindle Hole */}
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-zinc-950 border border-white/40 z-10" />
      </div>

      {/* Expandable Track Information (Center) */}
      <div
        className={cn(
          'flex flex-col min-w-0 text-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isExpanded
            ? 'flex-1 opacity-100 max-w-[88px] sm:max-w-[98px]'
            : 'max-w-0 opacity-0 overflow-hidden pointer-events-none'
        )}
      >
        <span className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-[#1DB954] transition-colors">
          {track.song}
        </span>
        <span className="text-[9.5px] text-zinc-400 truncate leading-tight">
          {track.artist}
        </span>
      </div>

      {/* Animated Mini Equalizer Bars (Right) */}
      <div className="flex items-end gap-0.5 h-3 shrink-0" aria-hidden="true">
        <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] h-2.5" />
        <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.25s] h-3.5" />
        <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_0.45s] h-1.5" />
      </div>
    </a>
  );
}
