'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Headphones, ExternalLink } from 'lucide-react';
import { SpotifyData, SpotifyTrack } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpotifyBadgeProps {
  spotifyData?: SpotifyData;
  className?: string;
}

interface LanyardResponse {
  success: boolean;
  data: {
    listening_to_spotify: boolean;
    spotify?: {
      track_id: string;
      song: string;
      artist: string;
      album: string;
      album_art_url: string;
      timestamps?: {
        start: number;
        end: number;
      };
    };
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
    <div className="flex items-end gap-0.5 h-3 w-3" aria-hidden="true">
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] h-2.5" />
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.2s] h-3.5" />
      <span className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_0.4s] h-1.5" />
    </div>
  );
}

export function SpotifyBadge({ spotifyData, className }: SpotifyBadgeProps) {
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
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Try reading cached last played track from localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SpotifyTrack;
        if (parsed?.song) {
          setTrack(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
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

            // Persist as last played
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
    const interval = setInterval(fetchLanyard, 15000);
    return () => clearInterval(interval);
  }, [discordUserId]);

  const loreText =
    spotifyData?.lore ||
    'Status: Headphones ON, Distractions OFF. Kalau lagi senggang, intip apa yang lagi nemenin gw ngoding.';
  const tagline = spotifyData?.tagline || 'HEADPHONE CHECK';

  return (
    <div
      className={cn(
        'rounded-2xl p-3.5 sm:p-4 bg-surface-raised/80 border border-border/70 hover:border-border transition-colors duration-200 space-y-3',
        className
      )}
    >
      {/* Lore Header / Story */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[#1DB954]">
          <Headphones className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
            {tagline}
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-muted leading-relaxed text-pretty font-normal">
          {loreText}
        </p>
      </div>

      {/* Spotify Interactive Capsule */}
      <a
        href={track.trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-surface/90 border border-border/80 hover:border-[#1DB954]/50 hover:bg-surface transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1DB954]"
        title={`Listen to ${track.song} by ${track.artist} on Spotify`}
      >
        {/* Album Artwork */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-surface-raised border border-border/50">
          {track.albumArtUrl ? (
            <Image
              src={track.albumArtUrl}
              alt={`${track.song} album artwork`}
              fill
              sizes="56px"
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-muted">
              <SpotifyIcon className="w-6 h-6 text-muted" />
            </div>
          )}
        </div>

        {/* Track Metadata */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <SpotifyIcon className="w-3.5 h-3.5 shrink-0" />
            <span
              className={cn(
                'text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5',
                isPlaying ? 'text-[#1DB954]' : 'text-muted'
              )}
            >
              {mounted && isPlaying ? (
                <>
                  <span>NOW PLAYING</span>
                  <Equalizer />
                </>
              ) : (
                'LAST PLAYED'
              )}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-[#1DB954] transition-colors">
            {track.song}
          </p>
          <p className="text-[11px] sm:text-xs text-muted truncate">
            {track.artist}
          </p>
        </div>

        {/* Hover External Link Icon */}
        <div className="shrink-0 p-1 text-muted group-hover:text-[#1DB954] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>
    </div>
  );
}
