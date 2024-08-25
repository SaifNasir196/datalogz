"use server"
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { projectKey } = await request.json();
  const sonarqubeUrl = process.env.SONARQUBE_URL;
  const sonarqubeToken = process.env.SONARQUBE_TOKEN;

  try {
    const response = await fetch(`${sonarqubeUrl}/api/projects/search?projects=${projectKey}`, {
      headers: {
        'Authorization': `Bearer ${sonarqubeToken}`
      }
    });

    if (!response.ok)
      throw new Error('SonarQube API request failed');

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error checking SonarQube project:', error);
    return NextResponse.json({ error: 'Failed to check SonarQube project' }, { status: 500 });
  }
}