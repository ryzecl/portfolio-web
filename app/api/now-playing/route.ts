import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/data';
import { SpotifyTrack } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const site = getSiteData();

  const defaultTrack: SpotifyTrack = site.spotify?.defaultTrack || {
    song: 'Every Breath You Take',
    artist: 'The Police',
    album: 'Synchronicity (Remastered)',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273c8e97cafeb2acb85b21a777e',
    trackUrl: 'https://open.spotify.com/track/1JSTJqkT5qHq8MDJnJbRE1',
  };

  const username =
    searchParams.get('username') ||
    site.spotify?.lastfmUsername ||
    'donjuannn18';

  const apiKey =
    process.env.LASTFM_API_KEY || '6079bb9722675f7468e4413b10bf39f6';

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
        username
      )}&api_key=${apiKey}&format=json&limit=1`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { isPlaying: false, track: defaultTrack },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const data = await response.json();
    const rawTrack = data?.recenttracks?.track;

    if (!rawTrack) {
      return NextResponse.json(
        { isPlaying: false, track: defaultTrack },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const trackItem = Array.isArray(rawTrack) ? rawTrack[0] : rawTrack;

    if (!trackItem || !trackItem.name) {
      return NextResponse.json(
        { isPlaying: false, track: defaultTrack },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const isPlaying = trackItem['@attr']?.nowplaying === 'true';
    const song = String(trackItem.name);
    const artist =
      typeof trackItem.artist === 'string'
        ? trackItem.artist
        : trackItem.artist?.['#text'] || 'Unknown Artist';
    const album =
      typeof trackItem.album === 'string'
        ? trackItem.album
        : trackItem.album?.['#text'] || '';

    let albumArtUrl = '';
    if (Array.isArray(trackItem.image)) {
      const bestImage =
        trackItem.image.find((img: { size?: string; '#text'?: string }) => img.size === 'extralarge') ||
        trackItem.image.find((img: { size?: string; '#text'?: string }) => img.size === 'large') ||
        trackItem.image[trackItem.image.length - 1];

      if (bestImage && bestImage['#text'] && bestImage['#text'].startsWith('http')) {
        albumArtUrl = bestImage['#text'];
      }
    }

    if (!albumArtUrl) {
      albumArtUrl = defaultTrack.albumArtUrl;
    }

    const trackUrl =
      trackItem.url ||
      `https://open.spotify.com/search/${encodeURIComponent(`${song} ${artist}`)}`;

    const currentTrack: SpotifyTrack = {
      song,
      artist,
      album: album || undefined,
      albumArtUrl,
      trackUrl,
    };

    return NextResponse.json(
      {
        isPlaying,
        track: currentTrack,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Last.fm track:', error);
    return NextResponse.json(
      { isPlaying: false, track: defaultTrack },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
