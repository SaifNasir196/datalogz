// app/api/sonarcloud/project-metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const projectKey = searchParams.get('projectKey');
  const metricKeys = searchParams.get('metricKeys') || 'bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density';
  const sonarqubeUrl = process.env.SONARQUBE_URL;
  const sonarqubeToken = process.env.SONARQUBE_TOKEN;

  if (!projectKey) {
    return NextResponse.json({ error: 'Project key is required' }, { status: 400 });
  }

  try {
    // http://localhost:9000/api/measures/component?component=welcome-to-docker&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density
    const response = await fetch(`${sonarqubeUrl}/api/measures/component?component=${projectKey}&metricKeys=${metricKeys}`, {
      headers: {
        'Authorization': `Bearer ${sonarqubeToken}`
      }
    });

    if (!response.ok)
      throw new Error('SonarQube API request failed');

    const data = await response.json();
    return NextResponse.json({ data });

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}