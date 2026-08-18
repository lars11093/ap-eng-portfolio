import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { env, isDev } from './env';

export interface WriteResult {
  mode: 'local' | 'github';
  path: string;
  url?: string;
}

const GITHUB_API = 'https://api.github.com';

function toBase64(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Blocks path traversal — everything must stay inside the project. */
function assertSafePath(repoPath: string): void {
  const backslash = String.fromCharCode(92);
  if (
    repoPath.includes('..') ||
    repoPath.startsWith('/') ||
    repoPath.includes(backslash)
  ) {
    throw new Error(`Refusing to write outside the project: ${repoPath}`);
  }
}

async function writeLocal(
  repoPath: string,
  content: string | Uint8Array,
): Promise<WriteResult> {
  const target = resolve(join(process.cwd(), repoPath));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
  return { mode: 'local', path: repoPath };
}

async function githubRequest(path: string, init?: RequestInit): Promise<Response> {
  const token = env('GITHUB_TOKEN');
  const repo = env('GITHUB_REPO');
  if (!token || !repo) {
    throw new Error(
      'The online editor needs GITHUB_TOKEN and GITHUB_REPO set in the Vercel project settings.',
    );
  }
  return fetch(`${GITHUB_API}/repos/${repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

/** Existing file SHA, or undefined when the file is new. */
async function currentSha(repoPath: string, branch: string): Promise<string | undefined> {
  const response = await githubRequest(
    `/contents/${encodeURIComponent(repoPath).replace(/%2F/g, '/')}?ref=${branch}`,
  );
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`GitHub read failed (${response.status}): ${await response.text()}`);
  }
  const data = (await response.json()) as { sha?: string };
  return data.sha;
}

async function writeGitHub(
  repoPath: string,
  content: string | Uint8Array,
  message: string,
): Promise<WriteResult> {
  const branch = env('GITHUB_BRANCH') ?? 'main';
  const sha = await currentSha(repoPath, branch);

  const response = await githubRequest(
    `/contents/${encodeURIComponent(repoPath).replace(/%2F/g, '/')}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: toBase64(content),
        branch,
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub write failed (${response.status}): ${await response.text()}`);
  }

  const data = (await response.json()) as { commit?: { html_url?: string } };
  return { mode: 'github', path: repoPath, url: data.commit?.html_url };
}

/**
 * Writes a file into the project.
 *
 * Locally that means straight to disk, so `npm run dev` reloads instantly.
 * On the deployed site it means a commit to GitHub, which triggers a rebuild.
 * Either way the content ends up as a plain file in version control.
 */
export async function writeRepoFile(
  repoPath: string,
  content: string | Uint8Array,
  message: string,
): Promise<WriteResult> {
  assertSafePath(repoPath);
  return isDev ? writeLocal(repoPath, content) : writeGitHub(repoPath, content, message);
}
