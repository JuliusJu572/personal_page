export type GitHubReleaseAsset = {
  name: string
  browser_download_url: string
  size: number
}

export type GitHubRelease = {
  tag_name: string
  name: string | null
  published_at: string
  html_url: string
  body: string | null
  assets: GitHubReleaseAsset[]
}

export async function fetchLatestRelease(params: { owner: string; repo: string }): Promise<GitHubRelease> {
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/releases/latest`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`)
  }
  return (await res.json()) as GitHubRelease
}

export function pickReleaseAsset(
  release: GitHubRelease,
  target: 'windows' | 'mac',
): GitHubReleaseAsset | undefined {
  const candidates = release.assets
    .map((a) => ({ a, n: a.name.toLowerCase() }))
    .filter(({ n }) => {
      if (target === 'windows') return /win|windows|\.exe$|\.msi$|\.zip$/.test(n) && !/mac|dmg|pkg/.test(n)
      return /mac|osx|darwin|\.dmg$|\.pkg$|\.zip$/.test(n) && !/win|windows|\.exe|\.msi/.test(n)
    })

  const preferredExt = target === 'windows' ? ['.exe', '.msi', '.zip'] : ['.dmg', '.pkg', '.zip']
  for (const ext of preferredExt) {
    const hit = candidates.find(({ n }) => n.endsWith(ext))
    if (hit) return hit.a
  }
  return candidates[0]?.a
}

