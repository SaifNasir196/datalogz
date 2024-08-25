// lib/sonarqube.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';



export function useProjectExists(projectKey: string) {
  return useQuery({
    queryKey: ['projectExists', projectKey],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/projects/search?projects=${projectKey}`);
        return res.data.components.length > 0;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return false;
        }
        throw error;
      }
    },
    enabled: !!projectKey,
  });
}


export function useProjectMetrics(projectKey: string) {
  const metricsToFetch = 'bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density';
  return useQuery({
    queryKey: ['projectMetrics', projectKey],
    queryFn: async () => {

        const res = await fetch(`/api/project-metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectKey, metricKeys: metricsToFetch }),
        })
        return res.json()
    },
    enabled: !!projectKey,
    });
}


export function useProjectIssues(projectKey: string) {
  return useQuery({
    queryKey: ['projectIssues', projectKey],
    queryFn: () => axios.get(`/project-issues?projectKey=${projectKey}`)
      .then(response => response.data),
    enabled: !!projectKey,
  });
}


export function useQualityGateStatus(projectKey: string) {
  return useQuery({
    queryKey: ['qualityGateStatus', projectKey],
    queryFn: () => axios.get(`/api/qualitygates/project_status?projectKey=${projectKey}`)
      .then(response => response.data),
    enabled: !!projectKey,
  });
}