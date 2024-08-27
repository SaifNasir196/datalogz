import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { repoUrl } = await request.json();

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  const repoDetails = repoUrl.replace('https://github.com/', '').split('/');
  const [owner, repo] = repoDetails;

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 });
  }

  const githubToken = process.env.GITHUB_TOKEN; // Ensure this is set in your environment variables

  if (!githubToken) {
    return NextResponse.json({ error: 'GitHub token is not set' }, { status: 500 });
  }

  try {
    // Step 1: Fork the repository
    const forkUrl = `https://api.github.com/repos/${owner}/${repo}/forks`;

    const forkResponse = await fetch(forkUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!forkResponse.ok) {
      const errorData = await forkResponse.json();
      return NextResponse.json({ error: `Failed to fork repository: ${errorData.message}` }, { status: forkResponse.status });
    }

    const forkedRepo = await forkResponse.json();
    console.log('Forked Repository:', forkedRepo);

    // Step 2: Create the workflow file in the forked repository
    const workflowContent = `
    name: Sync with Upstream and Code Quality Analysis

    on:
      schedule:
        - cron: '0 */4 * * *' # Runs every 4 hours
      push:
        branches:
          - main
      pull_request:
        branches:
          - main
      workflow_dispatch:
        inputs:
          sha:
            description: 'The commit SHA to analyze'
            required: true
            default: ''

    jobs:
      sync-and-analyze:
        runs-on: ubuntu-latest

        steps:
          - name: Check out the forked repository
            uses: actions/checkout@v3
            with:
              repository: ${forkedRepo.full_name}
              token: \${{ secrets.GITHUB_TOKEN }}

          - name: Add Upstream Repository
            run: |
              git remote add upstream https://github.com/${owner}/${repo}.git
              git fetch upstream

          - name: Sync with Upstream
            run: |
              git checkout main
              git merge upstream/main
              git push origin main

          - name: Set up Python
            uses: actions/setup-python@v4
            with:
              python-version: '3.9'

          - name: Install dependencies
            run: |
              python -m pip install --upgrade pip
              pip install -r requirements.txt

          - name: Run SonarQube Scanner
            run: sonar-scanner
            env:
              SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}
              SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
    `;

    const createFileUrl = `https://api.github.com/repos/${forkedRepo.full_name}/contents/.github/workflows/sync_and_code_analysis.yml`;

    // Convert the content to Base64
    const contentBase64 = Buffer.from(workflowContent).toString('base64');

    const createFileResponse = await fetch(createFileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Add sync with upstream and code quality analysis workflow',
        content: contentBase64,
        branch: 'main',
      }),
    });

    if (!createFileResponse.ok) {
      const errorData = await createFileResponse.json();
      return NextResponse.json({ error: errorData.message || 'Failed to create workflow file' }, { status: createFileResponse.status });
    }

    // Step 3: Trigger the workflow
    const triggerUrl = `https://api.github.com/repos/${forkedRepo.full_name}/actions/workflows/sync_and_code_analysis.yml/dispatches`;

    const triggerResponse = await fetch(triggerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          sha: 'main',
        },
      }),
    });

    if (!triggerResponse.ok) {
      const errorData = await triggerResponse.json();
      return NextResponse.json({ error: errorData.message || 'Failed to trigger workflow' }, { status: triggerResponse.status });
    }

    return NextResponse.json({ message: 'Workflow created, synced, and triggered successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unexpected error occurred' }, { status: 500 });
  }
}
