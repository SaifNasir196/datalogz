"use client"
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import RepoCard from "./components/RepoCard";
import Overview from "./components/Overview";
import { validateGitUrl } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import LoadingItem from "@/components/LoadingItem";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDetails from "./components/ProjectDetails";

const mockData = {
  title: 'react-hook-form',
  url: "https://github.com/react-hook-form/react-hook-form",
  description: "React Hooks for form state management and validation (Web + React Native)",
  tags: [
    "dx",
    "form-builder",
    "forms",
    "react-hooks",
    "react-native",
    "reactjs",
    "typescript",
    "ux",
    "validation",
  ],
  license: "MIT",
  overview: {
    issuesCount: 124,
    pullRequestsCount: 15,
    starsCount: 32150,
    forksCount: 3980,
    commitsCount: 2567,
    contributorsCount: 378,
    healthScore: 92
  },
  adoption: {
    downloads: 1500000,
    usedBy: 75000,
    topCompanies: ['Microsoft', 'Amazon', 'Netflix']
  },
  contribution: {
    activeContributors: 85,
    openIssues: 34,
    closedIssues: 90,
    mergedPRs: 150
  },
  diversity: {
    countries: 45,
    languages: 12,
    genderDistribution: { male: 60, female: 35, other: 5 }
  },
  governance: {
    license: 'MIT',
    codeOfConduct: true,
    securityPolicy: true,
    issueTemplates: 3
  }
};



export default function Home() {
  const repoRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState<"fetch" | "analyze" | "fetched" | null>(null);
  const [data, setData] = useState({});
  const [projectKey, setProjectKey] = useState<string>('')

  const { mutate: checkProject, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      if (!repoRef.current?.value)
        throw new Error('Git URL is required');
      const gitUrl = repoRef.current.value
      if (!validateGitUrl(gitUrl))
        throw new Error('Invalid Git URL format');

      const projectKey = gitUrl.split('/').pop()?.replace('.git', '') || '';
      setProjectKey(projectKey);
      const response = await fetch('/api/check-sonarqube-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check SonarQube project');
      }

      return response.json();
    },

    onSuccess: (data) => {
      setData(data.data)
      console.log('data: ', data.data.components);
      if (data.data.components.length >= 1) {
        setResponse('fetch');
        setStatus('Project exists. Fetching analysis results...');
        // Logic to fetch and display analysis results
      } else {
        setResponse('analyze');
        setStatus('Analyzing project...');
        // triggerJenkinsMutation.mutate();
        // check in sonar again
      }
    },
    onError: (error: any) => {
      setStatus('');
      setResponse(null);
    }
  });



  return (
    <main className="container w-full flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col items-center space-y-4 justify-center">
        <h1 className="text-4xl font-bold">Open Source Project <span className="text-primary">Analytics</span>  with <span className="text-primary">AI</span></h1>
        <p className=" text-center  text-gray-400">
          Paste the link to any open source GitHub repository to view its analytics dashboard
        </p>


        <div className="flex mt-2 focus:ring-none w-full h-full">
          <div className="flex flex-col w-full h-full relative">

            <Input
              type="text"
              placeholder="https://github.com/username/repository"
              ref={repoRef}
              className=" flex-grow rounded-br-none rounded-tr-none transition-all"
            />
            {/* loading spinner */}
            {isPending && <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-6 h-6 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            </div>}
            {isError && <p className="text-red-500 text-sm ml-3">{error.message}</p>}
          </div>
          <Button onClick={() => checkProject()} className="rounded-bl-none rounded-tl-none px-8">Analyze</Button>
        </div>



        {response === 'analyze' && (
          <div className="space-y-5 w-full">
            <p className="text-gray-500"> {status}</p>

            <RepoCard repo={data} />

            <Skeleton className="w-full h-44" />
            <div className="flex gap-5">
              <Skeleton className="w-full h-44" />
              <Skeleton className="w-full h-44" />
              <Skeleton className="w-full h-44" />
            </div>
          </div>
        )}


        {response === 'fetch' && projectKey && (
          <div className="w-full">
            <RepoCard repo={data} />
            <ProjectDetails projectKey={projectKey} />
            <Overview data={mockData} />
          </div>
        )}





      </div>
    </main>
  );
}
