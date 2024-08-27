"use client"
import React from 'react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { Progress } from '@/components/ui/progress'
import { usePullRequests } from '@/app/hooks/sonarqube'

const Statistics = ({ projectKey }: { projectKey: string }) => {

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Repository Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Issues</p>
                        {/* <p className="text-2xl font-bold">{data.issuesCount}</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Pull Requests</p>
                        {/* <p className="text-2xl font-bold">{data.pullRequestsCount}</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Stars</p>
                        {/* <p className="text-2xl font-bold">{data.starsCount}</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Forks</p>
                        {/* <p className="text-2xl font-bold">{data.forksCount}</p> */}
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardContent className="pt-6">
                    <h4 className="text-lg font-semibold mb-2">Health Score</h4>
                    {/* <Progress value={data.healthScore} className="w-full" /> */}
                    {/* <p className="text-sm text-muted-foreground mt-2">{data.healthScore}% healthy</p> */}
                </CardContent>
            </Card>
        </div>
    );
}

export default Statistics;