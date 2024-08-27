// lib/sonarqube.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';



export function useExists(projectKey: string) {
  return useQuery({
    queryKey: ['projectExists', projectKey],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/check-sonarqube-project?projectKey=${projectKey}`);
        return {success: res.data.components.length > 0, repo: res.data};
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


export function useMeasures(projectKey: string, metricKeys="bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density") {
  return useQuery({
    queryKey: ['projectMetrics', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/measures?projectKey=${projectKey}&metricKeys=${metricKeys}`)
        return res.data.data.component.measures
    },
    enabled: !!projectKey,
    });
}

export function useMetrics(projectKey : string){
  return useQuery({
    queryKey: ['metrics', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/metrics?projectKey=${projectKey}`)
        return res.data
    },
    enabled:!!projectKey,
  });
}

export function useLanguages(projectKey: string){
  return useQuery({
    queryKey: ['languages', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/languages?projectKey=${projectKey}`)
        return res.data.languages
    },
    enabled:!!projectKey,
  });
}

export function usePullRequests(projectKey: string){
  return useQuery({
    queryKey: ['pull-requests', projectKey],
    queryFn: async () => {
        const res = await axios.get(`/api/pull-requests?projectKey=${projectKey}`)
        console.log('res', res);
        // projectKey=${projectKey}
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

