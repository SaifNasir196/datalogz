
"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQualityGateStatus } from '@/app/hooks/sonarqube'
import { FileIcon, FileTextIcon } from 'lucide-react'

const data = {
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


const RepoCard = ({ repo }: { repo: any }) => {
    const date = repo.components[0]?.lastAnalysisDate;
    const lastAnalysisDate = date ? new Date(date) : null;

    return (
        <div className='my-10 w-full'>
            <h3 className="text-2xl font-semibold mb-4">Overview</h3>

            <Card className="w-full max-w-3xl">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                        <FileTextIcon className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center">
                            {repo.components[0]?.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {/* {data.description} */}
                            {/* {repo} */}
                            {lastAnalysisDate?.toDateString()}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag: string) => (
                            <Badge className='bg-gray-400' key={tag}>{tag}</Badge>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-end space-x-4 text-sm text-muted-foreground">
                        <span>Licence: {data.license}</span>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default RepoCard;