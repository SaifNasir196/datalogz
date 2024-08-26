import React from 'react'
import { useProjectMetrics, useProjectIssues, useQualityGateStatus, useLanguages, useIssues, useMetrics } from '@/app/hooks/sonarqube'

const ProjectDetails = ({ projectKey }: { projectKey: string }) => {

    const { data: metrics, isLoading, error, isLoadingError } = useProjectMetrics(projectKey)
    const { data: issues } = useIssues(projectKey)
    const { data: qualityGate } = useQualityGateStatus(projectKey)
    const {data : languages} = useLanguages(projectKey)
    const {data: metricsdata} = useMetrics(projectKey)
    console.log('metrics', metrics);
    console.log('issues', issues);
    console.log('qualityGate', qualityGate);
    console.log('languages', languages);
    console.log('metric', metricsdata);
    console.log('error message', error);

    if (!metrics || !issues || !qualityGate) {
        return null
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-4">Project Analysis Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2">Metrics</h3>
                    <ul>
                        {metrics.data.component?.measures.map((measure: any) => (

                            <li key={measure.metric} className="mb-1">
                                <span className="font-semibold capitalize">{measure.metric}:</span> {measure.value}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2">Quality Gate</h3>
                    <p className={`font-bold ${qualityGate?.projectStatus.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {qualityGate?.projectStatus.status}
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">Issues</h3>
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
            </div>
        </div>
    )
}

export default ProjectDetails