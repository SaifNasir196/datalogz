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
        const res = await axios.get(`/api/project-metrics?projectKey=${projectKey}&metricKeys=${metricsToFetch}`)
        return res.data
    },
    enabled: !!projectKey,
    });
}

export function useLanguages(projectKey: string){
  return useQuery({
    queryKey: ['languages', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/languages?projectKey=${projectKey}`)
        return res.data
    },
    enabled:!!projectKey,
  });
}

export function useIssues(projectKey: string) {
    return useQuery({
    queryKey: ['issues', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/issues?projectKey=${projectKey}`)
        return res.data
    },
    enabled: !!projectKey,
  });
}

export function useProjectIssues(projectKey: string) {
  return useQuery({
    queryKey: ['projectIssues', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/project-issues?projectKey=${projectKey}`)
        return res.data
    },
    enabled: !!projectKey,
  });
}

export function useQualityGateStatus(projectKey: string) {
  return useQuery({
    queryKey: ['qualityGateStatus', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/quality-gate-status?projectKey=${projectKey}`)
        return res.data
    },
    enabled: !!projectKey,
  });
}

