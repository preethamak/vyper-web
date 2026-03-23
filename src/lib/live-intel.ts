import { projectFacts } from "./vyper-data";

export type ProjectIntel = {
  pypi: {
    version: string;
    downloads30d: number | null;
    requiresPython: string;
    releasedAt: string | null;
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
const pypistatsEndpoint = "https://pypistats.org/api/packages/vyper-guard/recent";
const githubEndpoint = "https://api.github.com/repos/preethamak/vyper";

export async function fetchProjectIntel(): Promise<ProjectIntel> {
  const fallback: ProjectIntel = {
    pypi: {
      version: projectFacts.pypiVersion,
      downloads30d: null,
      requiresPython: projectFacts.python,
      releasedAt: projectFacts.releaseDate,
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
    const [pypiRes, pypistatsRes, githubRes] = await Promise.all([
      fetch(pypiEndpoint, { next: { revalidate: 3600 } }),
      fetch(pypistatsEndpoint, { next: { revalidate: 3600 } }),
      fetch(githubEndpoint, { next: { revalidate: 3600 } }),
    ]);

    const [pypiData, pypistatsData, githubData] = await Promise.all([
      pypiRes.ok ? pypiRes.json() : Promise.resolve(null),
      pypistatsRes.ok ? pypistatsRes.json() : Promise.resolve(null),
      githubRes.ok ? githubRes.json() : Promise.resolve(null),
    ]);

    return {
      pypi: {
        version: pypiData?.info?.version ?? fallback.pypi.version,
        downloads30d: pypistatsData?.data?.last_month ?? fallback.pypi.downloads30d,
        requiresPython: pypiData?.info?.requires_python ?? fallback.pypi.requiresPython,
        releasedAt: pypiData?.releases?.[pypiData?.info?.version]?.[0]?.upload_time_iso_8601 ?? fallback.pypi.releasedAt,
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
