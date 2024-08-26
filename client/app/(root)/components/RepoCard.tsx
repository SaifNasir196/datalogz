"use client"
import React, { useState, useEffect } from 'react'
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
import { FileIcon, FileTextIcon, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addProjectKey, findProjectKey, removeProjectKey } from '@/app/actions/user'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import HeartIcon from '@/components/Heart'
import { useUser } from '@clerk/nextjs'

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
    const [repoKey, setRepoKey] = useState<string | null>(null);
    const date = repo.lastAnalysisDate;
    const lastAnalysisDate = date ? new Date(date) : null;
    const queryClient = useQueryClient();
    const user = useUser();

    useEffect(() => {
        setRepoKey(repo.key);
    }, [repo.key])

    console.log('repo', repo.key);

    const { data: isFav } = useQuery({
        queryKey: ['favourite', repo.key],
        queryFn: async () => {
            if (!repo.key && !repoKey) return { found: false, key: null };
            const res = await findProjectKey(repoKey || repo.key);
            return res;
        },
        enabled: !!repo.key
    })

    const { mutate: addFav, isPending: isAddingPending } = useMutation({
        mutationFn: async () => {
            if (!repo.key) return null;
            const res = await addProjectKey(repo.key);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favourite'] });
        },

    })

    const { mutate: removeFav, isPending: isRemovingPending } = useMutation({
        mutationFn: async () => {
            if (!repo.key) return null;
            const res = await removeProjectKey(repo.key);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favourite'] });
        }
    })

    return (
        <div className='my-10 w-full'>
            <h3 className="text-2xl font-semibold mb-4">Overview</h3>

            <Card className="w-full max-w-3xl flex items-center justify-between">
                <CardHeader className="flex flex-row items-center gap-4 pb-7 pl-7 flex-1">

                    <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                        <FileTextIcon className="text-primary-foreground" size={24} />
                    </div>
                    <div>

                        <CardTitle className="text-xl font-bold flex items-center">
                            {repo.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Last analyzed: {lastAnalysisDate?.toDateString()}
                        </CardDescription>
                    </div>

                </CardHeader>

                <CardContent className='flex items-center justify-center h-full'>
                    {/* favoutire */}
                    {user.isSignedIn
                        ? (isFav && isFav.found
                            ? <HeartIcon
                                filled
                                onClick={() => removeFav()}
                                disabled={isRemovingPending}
                            />
                            : <HeartIcon
                                onClick={() => addFav()}
                                disabled={isAddingPending}
                            />
                        ) : (null)
                    }

                </CardContent>
            </Card>
        </div>
    );
};

export default RepoCard;