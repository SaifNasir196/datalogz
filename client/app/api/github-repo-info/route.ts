import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const repoUrl = url.searchParams.get('repoUrl');

    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }
  
    const repoDetails = repoUrl.replace('https://github.com/', '').split('/');
    const [owner, repo] = repoDetails;
    try {
        const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const pullsApiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`;

        const [repoResponse, pullsResponse] = await Promise.all([
            fetch(repoApiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            }),
            fetch(pullsApiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            })
        ]);

        if (!repoResponse.ok || !pullsResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch data from GitHub API' }, { status: 500 });
        }

        const repoData = await repoResponse.json();
        const pullsData = await pullsResponse.json();

        const result = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: repoData.open_issues_count,
            pullRequests: pullsData.length
        };

        console.log(result)
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
