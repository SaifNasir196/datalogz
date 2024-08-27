'use client'
import React from 'react'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProjectKeys } from '../actions/user';
import ProjectItem from './components/ProjectItem';


const Dashboard = () => {
    const queryClient = useQueryClient();

    const { data: projects } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await getAllProjectKeys();
            console.log('res', res);
            return res;
        }
    });


    return (
        <main className="container w-full flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-semibold mb-8">Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
                {projects?.map((project: any) => (
                    <ProjectItem projectKey={project} />
                ))}
            </div>

        </main>
    )
}

export default Dashboard