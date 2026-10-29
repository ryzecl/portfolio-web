import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export interface ContributionDay {
  date: string;
  level: number;
  count: number;
  text: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'ryzecl';

  try {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub responded with status: ${response.status}`);
    }

    const html = await response.text();

    // 1. Parse Total Contributions
    const totalMatch = html.match(
      /([0-9,]+)\s+contributions\s+in\s+the\s+last\s+year/i
    );
    const totalContributions = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ''), 10)
      : 0;

    // 2. Parse Tooltips
    const tooltipMap = new Map<string, string>();
    const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
    let tipMatch;
    while ((tipMatch = tipRegex.exec(html)) !== null) {
      tooltipMap.set(tipMatch[1], tipMatch[2].trim());
    }

    // 3. Parse Days
    const cellRegex = /<td[^>]*data-date="([^"]+)"[^>]*>/g;
    const days: ContributionDay[] = [];
    let cellMatch;

    while ((cellMatch = cellRegex.exec(html)) !== null) {
      const fullTag = cellMatch[0];
      const date = cellMatch[1];
      const levelMatch = fullTag.match(/data-level="(\d+)"/);
      const idMatch = fullTag.match(/id="([^"]+)"/);

      const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
      const id = idMatch ? idMatch[1] : '';
      const tooltipText = id ? tooltipMap.get(id) || '' : '';

      let count = 0;
      const countMatch = tooltipText.match(/(\d+)\s+contribution/i);
      if (countMatch) {
        count = parseInt(countMatch[1], 10);
      } else if (level > 0) {
        count = level;
      }

      days.push({
        date,
        level,
        count,
        text:
          tooltipText ||
          (count === 0
            ? `No contributions on ${date}`
            : `${count} contribution${count > 1 ? 's' : ''} on ${date}`),
      });
    }

    return NextResponse.json(
      {
        success: true,
        username,
        totalContributions,
        days,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch contributions from GitHub:', error);

    // Return empty fallback with 0 days instead of 500 error
    return NextResponse.json(
      {
        success: false,
        username,
        totalContributions: 0,
        days: [],
        message: 'Could not fetch live GitHub activity.',
      },
      { status: 200 }
    );
  }
}
