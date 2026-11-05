// lib/vercel-analytics.ts

export interface VercelDailyPoint {
  date: string;
  pageviews: number;
  visitors: number;
}

export interface VercelTopRoute {
  path: string;
  pageviews: number;
  visitors: number;
}

export interface VercelDimensionBreakdown {
  label: string;
  count: number;
  percentage: number;
}

export interface VercelAnalyticsData {
  isConfigured: boolean;
  totals: {
    pageviews: number;
    visitors: number;
    viewsPerVisitor: number;
  };
  dailyTraffic: VercelDailyPoint[];
  topPages: VercelTopRoute[];
  devices: VercelDimensionBreakdown[];
  countries: VercelDimensionBreakdown[];
  rangeDays: number;
}

export async function getVercelAnalytics(days = 14): Promise<VercelAnalyticsData> {
  const token = process.env.VERCEL_ACCESS_TOKEN || process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  const now = new Date();
  const sinceDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  // Tambah 24 jam ke until agar data hari ini (UTC) tidak terpotong
  const untilDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const since = sinceDate.toISOString();
  const until = untilDate.toISOString();

  const emptyFallback: VercelAnalyticsData = {
    isConfigured: Boolean(token && projectId),
    totals: { pageviews: 0, visitors: 0, viewsPerVisitor: 0 },
    dailyTraffic: [],
    topPages: [],
    devices: [],
    countries: [],
    rangeDays: days,
  };

  if (!token || !projectId) {
    return emptyFallback;
  }

  const baseParams = new URLSearchParams({
    projectId,
    since,
    until,
    ...(teamId ? { teamId } : {}),
  });

  const countParams = new URLSearchParams({
    projectId,
    ...(teamId ? { teamId } : {}),
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Total counts (semua kunjungan / all-time snapshot)
    const countUrl = `https://api.vercel.com/v1/query/web-analytics/visits/count?${countParams.toString()}`;
    const countPromise = fetch(countUrl, { headers, next: { revalidate: 180 } });

    // 2. Daily time series (by=day)
    const dayParams = new URLSearchParams(baseParams);
    dayParams.set('by', 'day');
    const dayUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${dayParams.toString()}`;
    const dayPromise = fetch(dayUrl, { headers, next: { revalidate: 180 } });

    // 3. Top Pages (by=requestPath)
    const pagesParams = new URLSearchParams(baseParams);
    pagesParams.set('by', 'requestPath');
    pagesParams.set('limit', '6');
    const pagesUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${pagesParams.toString()}`;
    const pagesPromise = fetch(pagesUrl, { headers, next: { revalidate: 180 } });

    // 4. Device types (by=deviceType)
    const devicesParams = new URLSearchParams(baseParams);
    devicesParams.set('by', 'deviceType');
    devicesParams.set('limit', '5');
    const devicesUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${devicesParams.toString()}`;
    const devicesPromise = fetch(devicesUrl, { headers, next: { revalidate: 180 } });

    // 5. Countries (by=country)
    const countryParams = new URLSearchParams(baseParams);
    countryParams.set('by', 'country');
    countryParams.set('limit', '5');
    const countryUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${countryParams.toString()}`;
    const countryPromise = fetch(countryUrl, { headers, next: { revalidate: 180 } });

    const [countRes, dayRes, pagesRes, devicesRes, countryRes] = await Promise.all([
      countPromise,
      dayPromise,
      pagesPromise,
      devicesPromise,
      countryPromise,
    ]);

    // Parse Daily Traffic
    let dailyTraffic: VercelDailyPoint[] = [];
    if (dayRes.ok) {
      const dayJson = await dayRes.json();
      const rawDays = Array.isArray(dayJson?.data) ? dayJson.data : [];
      dailyTraffic = rawDays.map((d: any) => ({
        date: String(d.timestamp || '').slice(0, 10),
        pageviews: Number(d.pageviews ?? 0),
        visitors: Number(d.visitors ?? 0),
      }));
    }

    // Parse Totals
    let pageviews = 0;
    let visitors = 0;
    if (countRes.ok) {
      const countJson = await countRes.json();
      pageviews = Number(countJson?.data?.pageviews ?? countJson?.pageviews ?? 0);
      visitors = Number(countJson?.data?.visitors ?? countJson?.visitors ?? 0);
    }

    // Jika count API 0 tapi dailyTraffic ada data, gunakan kalkulasi dari dailyTraffic
    if (pageviews === 0 && dailyTraffic.length > 0) {
      pageviews = dailyTraffic.reduce((acc, d) => acc + d.pageviews, 0);
      visitors = Math.max(...dailyTraffic.map((d) => d.visitors), 0);
    }

    // Parse Top Pages
    let topPages: VercelTopRoute[] = [];
    if (pagesRes.ok) {
      const pagesJson = await pagesRes.json();
      const rawPages = Array.isArray(pagesJson?.data) ? pagesJson.data : [];
      topPages = rawPages.map((p: any) => ({
        path: String(p.requestPath ?? '/'),
        pageviews: Number(p.pageviews ?? 0),
        visitors: Number(p.visitors ?? 0),
      }));
    }

    // Helper to calculate percentages
    const parseDimension = (rawList: any[], keyName: string): VercelDimensionBreakdown[] => {
      const total = rawList.reduce((acc, item) => acc + Number(item.pageviews || item.visitors || 0), 0);
      return rawList.map((item) => {
        const count = Number(item.pageviews || item.visitors || 0);
        return {
          label: String(item[keyName] || 'Unknown'),
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      });
    };

    let devices: VercelDimensionBreakdown[] = [];
    if (devicesRes.ok) {
      const devJson = await devicesRes.json();
      devices = parseDimension(Array.isArray(devJson?.data) ? devJson.data : [], 'deviceType');
    }

    let countries: VercelDimensionBreakdown[] = [];
    if (countryRes.ok) {
      const countryJson = await countryRes.json();
      countries = parseDimension(Array.isArray(countryJson?.data) ? countryJson.data : [], 'country');
    }

    const viewsPerVisitor = visitors > 0 ? Number((pageviews / visitors).toFixed(1)) : 0;

    return {
      isConfigured: true,
      totals: {
        pageviews,
        visitors,
        viewsPerVisitor,
      },
      dailyTraffic,
      topPages,
      devices,
      countries,
      rangeDays: days,
    };
  } catch (error) {
    console.error('Failed to query Vercel Analytics:', error);
    return emptyFallback;
  }
}
