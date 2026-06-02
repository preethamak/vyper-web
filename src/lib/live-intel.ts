import { projectFacts } from "./vyper-data";

type PepyProjectResponse = {
  total_downloads?: number;
  downloads?: Record<string, Record<string, number>>;
};

export type ProjectIntel = {
  pypi: {
    version: string;
    requiresPython: string;
    releasedAt: string | null;
  };
  downloads: {
    source: "pepy" | "pypistats" | "none";
    total: number | null;
    last30d: number | null;
    latestDay: number | null;
    latestDate: string | null;
  };
  github: {
    stars: number | null;
    forks: number | null;
    openIssues: number | null;
    watchers: number | null;
    defaultBranch: string | null;
  };
  fetchedAt: string;
};

const pypiEndpoint = "https://pypi.org/pypi/vyper-guard/json";
const pepyEndpoint = "https://api.pepy.tech/api/v2/projects/vyper-guard";
const pypistatsEndpoint = "https://pypistats.org/api/packages/vyper-guard/recent";
const githubEndpoint = "https://api.github.com/repos/preethamak/vyper";

function sumVersionDownloads(versions: Record<string, number> | undefined) {
  if (!versions) return 0;
  return Object.values(versions).reduce((sum, value) => sum + value, 0);
}

function parsePepyStats(data: PepyProjectResponse | null) {
  if (!data || typeof data.total_downloads !== "number") return null;

  const byDate = data.downloads ?? {};
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  const latestDate = dates[0] ?? null;
  const latestDay = latestDate ? sumVersionDownloads(byDate[latestDate]) : null;

  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 30);

  let last30d = 0;
  for (const date of dates) {
    const asDate = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(asDate.getTime())) continue;
    if (asDate < cutoff) continue;
    last30d += sumVersionDownloads(byDate[date]);
  }

  return {
    source: "pepy" as const,
    total: data.total_downloads,
    last30d,
    latestDay,
    latestDate,
  };
}

export async function fetchProjectIntel(): Promise<ProjectIntel> {
  const fallback: ProjectIntel = {
    pypi: {
      version: projectFacts.pypiVersion,
      requiresPython: projectFacts.python,
      releasedAt: projectFacts.releaseDate,
    },
    downloads: {
      source: "none",
      total: null,
      last30d: null,
      latestDay: null,
      latestDate: null,
    },
    github: {
      stars: null,
      forks: null,
      openIssues: null,
      watchers: null,
      defaultBranch: null,
    },
    fetchedAt: new Date().toISOString(),
  };

  try {
    const pepyApiKey = process.env.PEPY_API_KEY?.trim();
    const pepyRequest = pepyApiKey
      ? fetch(pepyEndpoint, {
          next: { revalidate: 3600 },
          headers: { "X-API-Key": pepyApiKey },
        })
      : Promise.resolve(null);

    const [pypiRes, pepyRes, pypistatsRes, githubRes] = await Promise.all([
      fetch(pypiEndpoint, { next: { revalidate: 3600 } }),
      pepyRequest,
      fetch(pypistatsEndpoint, { next: { revalidate: 3600 } }),
      fetch(githubEndpoint, { next: { revalidate: 3600 } }),
    ]);

    const [pypiData, pepyData, pypistatsData, githubData] = await Promise.all([
      pypiRes.ok ? pypiRes.json() : Promise.resolve(null),
      pepyRes && "ok" in pepyRes && pepyRes.ok ? pepyRes.json() : Promise.resolve(null),
      pypistatsRes.ok ? pypistatsRes.json() : Promise.resolve(null),
      githubRes.ok ? githubRes.json() : Promise.resolve(null),
    ]);

    const pepyStats = parsePepyStats(pepyData as PepyProjectResponse | null);
    const pypistatsLast30 = pypistatsData?.data?.last_month ?? null;

    return {
      pypi: {
        version: pypiData?.info?.version ?? fallback.pypi.version,
        requiresPython: pypiData?.info?.requires_python ?? fallback.pypi.requiresPython,
        releasedAt: pypiData?.releases?.[pypiData?.info?.version]?.[0]?.upload_time_iso_8601 ?? fallback.pypi.releasedAt,
      },
      downloads: pepyStats ?? {
        source: pypistatsLast30 !== null ? "pypistats" : "none",
        total: null,
        last30d: pypistatsLast30,
        latestDay: null,
        latestDate: null,
      },
      github: {
        stars: githubData?.stargazers_count ?? fallback.github.stars,
        forks: githubData?.forks_count ?? fallback.github.forks,
        openIssues: githubData?.open_issues_count ?? fallback.github.openIssues,
        watchers: githubData?.subscribers_count ?? fallback.github.watchers,
        defaultBranch: githubData?.default_branch ?? fallback.github.defaultBranch,
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return fallback;
  }
}
