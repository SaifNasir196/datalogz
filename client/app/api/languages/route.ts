import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const sonarqubeUrl = process.env.SONARQUBE_URL;
    const sonarqubeToken = process.env.SONARQUBE_TOKEN;
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
  
    if (!projectKey) {
      return NextResponse.json({ error: 'Project key is required' }, { status: 400 });
    }
  
    try {
        const response = await axios.get(`${sonarqubeUrl}/api/languages/list`, {
            params: { project: projectKey },
            headers: {
              'Authorization': `Bearer ${sonarqubeToken}`,
              'Accept': 'application/json',
            },
        })

        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
          }
          return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}