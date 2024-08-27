import React from 'react'
import { useMeasures, useProjectIssues, useQualityGateStatus, useIssues, useMetrics } from '@/app/hooks/sonarqube'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton'

const ProjectDetails = ({ projectKey }: { projectKey: string }) => {


    const { data: issues, isLoading: issuesLoading } = useIssues(projectKey)
    const { data: qualityGate, isLoading: qualityGateLoading } = useQualityGateStatus(projectKey)
    const { data: measures, isLoading: measuresLoading } = useMeasures(projectKey)
    // console.log('metrics', metrics);
    // console.log('issues', issues);
    // console.log('qualityGate', qualityGate);
    // console.log('languages', languages);
    // console.log('metric', metricsdata);
    // console.log('error message', error);



    return (
        <div className="space-y-5 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Project Analysis Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* measures */}
                <Card >
                    <CardHeader> <h3 className="text-xl font-semibold">Metrics</h3> </CardHeader>
                    <CardContent>
                        {measuresLoading ? (
                            <Skeleton className='w-full h-24' />
                        ) : (

                            <ul>
                                {measures.map((measure: any) => (
                                    <li key={measure.metric} className="mb-1">
                                        <span className="font-semibold capitalize">{measure.metric}:</span> {measure.value}
                                    </li>
                                ))}
                            </ul>
                        )

                        }
                    </CardContent>
                </Card>
                {/* quality gate */}
                <Card >
                    <CardHeader> <h3 className="text-xl font-semibold">Quality Gate</h3> </CardHeader>
                    <CardContent>
                        {measuresLoading ? (
                            <Skeleton className='w-full h-24' />
                        ) : (
                            <p className={`font-bold ${qualityGate?.projectStatus.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                                Status: {qualityGate?.projectStatus.status}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* issues */}
            <Card >
                <CardHeader> <h3 className="text-xl font-semibold">Issues</h3> </CardHeader>
                <CardContent>
                    {measuresLoading ? (
                        <Skeleton className='w-full h-48' />
                    ) : (
                        <>
                            <ul>
                                {issues?.issues?.slice(0, 5).map((issue: any) => (
                                    <li key={issue.key} className="mb-2">
                                        <p className="font-medium">{issue.message}</p>
                                        <p className="text-sm text-gray-600">Severity: {issue.severity}</p>
                                    </li>
                                ))}
                            </ul>
                            {issues?.issues?.length > 5 && (
                                <p className="text-sm text-gray-600">Showing 5 of {issues.issues.length} issues</p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectDetails