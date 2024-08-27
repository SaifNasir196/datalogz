import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowUpRightFromSquare } from 'lucide-react'
import { useMeasures, useMetrics } from '@/app/hooks/sonarqube'


const ProjectItem = ({ projectKey }: { projectKey: string }) => {
    const { data: measures } = useMetrics(projectKey)

    // console.log('metrics', measures);
    return (
        <Card>
            <CardHeader>
                <CardTitle>{projectKey}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <p className="text-sm text-muted-foreground">Last analysis: { }</p>
                </CardDescription>
                {JSON.stringify(measures)}
            </CardContent>


        </Card>
    )
}

export default ProjectItem