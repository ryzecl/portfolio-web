// components/admin/sidebar-spotify-card.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SpotifyTrack } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

interface NowPlayingResponse {
  isPlaying: boolean;
  track: SpotifyTrack;
}

const STORAGE_KEY = 'fnh_spotify_last_played';

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('w-3.5 h-3.5 text-[#1DB954] shrink-0', className)}
      aria-label="Spotify"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306a.754.754 0 0 1-1.04.25c-2.85-1.74-6.438-2.134-10.665-1.168a.753.753 0 1 1-.338-1.468c4.629-1.057 8.587-.604 11.793 1.346a.755.755 0 0 1 .25 1.04zm1.467-3.262a.944.944 0 0 1-1.3.313c-3.26-2.004-8.23-2.586-12.086-1.415a.944.944 0 1 1-.555-1.802c4.41-1.339 9.897-.686 13.628 1.604a.944.944 0 0 1 .313 1.3zm.126-3.41c-3.91-2.321-10.362-2.535-14.095-1.401a1.132 1.132 0 0 1-.655-2.167c4.29-1.303 11.41-1.055 15.918 1.621a1.132 1.132 0 0 1-1.168 1.947z" />
    </svg>
  );
}

function MusicEqualizer() {
  return (
    <span className="inline-flex items-end gap-[1.5px] h-2.5 w-2.5 ml-1 shrink-0" aria-hidden="true">
      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] h-2" />
      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.2s] h-2.5" />
      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_0.4s] h-1.5" />
    </span>
  );
}

export function SidebarSpotifyCard() {
  const fallbackTrack: SpotifyTrack = {
    song: 'the cure',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273c8e97cafeb2acb85b21a777e',
    trackUrl: 'https://open.spotify.com',
  };

  const [track, setTrack] = useState<SpotifyTrack>(fallbackTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
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

    const fetchTrack = async () => {
      try {
        const res = await fetch('/api/now-playing', { cache: 'no-store' });
        if (!res.ok) return;

        const data: NowPlayingResponse = await res.json();
        if (data?.track) {
          setTrack(data.track);
          setIsPlaying(Boolean(data.isPlaying));

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.track));
          } catch {
            // Ignore
          }
        }
      } catch (err) {
        console.error('Failed to fetch Spotify track for sidebar:', err);
      }
    };

    fetchTrack();
    const timer = setInterval(fetchTrack, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="group-data-[collapsible=icon]:hidden px-2 mb-2 w-full">
      <a
        href={track.trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Listen to "${track.song}" by ${track.artist} on Spotify`}
        className={cn(
          'group/spotify relative flex flex-row items-center gap-3 p-3 rounded-2xl w-full',
          'bg-surface-raised border border-border/80',
          'hover:border-border hover:bg-surface-muted hover:shadow-2xs',
          'transition-all duration-200 select-none cursor-pointer'
        )}
      >
        {/* 1. Image di Kiri Sendiri (Fixed Square) */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface border border-border/80 shadow-2xs">
          {track.albumArtUrl ? (
            <Image
              src={track.albumArtUrl}
              alt={track.album || track.song}
              fill
              unoptimized
              sizes="48px"
              className="object-cover transition-transform duration-300 group-hover/spotify:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Music className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* 2. Keterangan di Kanan (Stacked Vertically) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Baris 1: Logo Spotify + Status (LAST PLAYED / NOW PLAYING) */}
          <div className="flex items-center gap-1.5 leading-none mb-1">
            <SpotifyIcon />
            <span
              className={cn(
                'text-[10px] font-mono font-semibold tracking-wider uppercase truncate',
                isPlaying ? 'text-[#1DB954]' : 'text-muted'
              )}
            >
              {isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'}
            </span>
            {isPlaying && <MusicEqualizer />}
          </div>

          {/* Baris 2: Judul Lagu (Bold) */}
          <p className="text-[13px] font-bold text-foreground truncate leading-snug group-hover/spotify:text-accent transition-colors">
            {track.song}
          </p>

          {/* Baris 3: Nama Artis (Muted) */}
          <p className="text-xs text-muted truncate leading-snug">
            {track.artist}
          </p>
        </div>
      </a>
    </div>
  );
}
