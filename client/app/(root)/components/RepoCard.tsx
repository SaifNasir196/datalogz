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
import { FileTextIcon } from 'lucide-react'
import { addProjectKey, findProjectKey, removeProjectKey } from '@/app/actions/user'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import HeartIcon from '@/components/Heart'
import { useUser } from '@clerk/nextjs'
import { useLanguages } from '@/app/hooks/sonarqube'


const RepoCard = ({ repo }: { repo: any }) => {
    const date = repo.lastAnalysisDate;
    const lastAnalysisDate = date ? new Date(date) : null;
    const queryClient = useQueryClient();
    const user = useUser();
    const { data: languages } = useLanguages(repo.key);
    console.log('languages', languages);

    const { data: isFav } = useQuery({
        queryKey: ['favourite', repo.key],
        queryFn: async () => {
            if (!repo.key) return { found: false, key: null };
            const res = await findProjectKey(repo.key);
            return res;
        },
    })

    const { mutate: addFav, isPending: isAddingPending } = useMutation({
        mutationFn: async () => {
            if (!repo.key) return null;
            const res = await addProjectKey(repo.key);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favourite'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });

        },

    })

    const { mutate: removeFav, isPending: isRemovingPending } = useMutation({
        mutationFn: async () => {
            if (!repo.key) return null;
            const res = await removeProjectKey(repo.key);
            return res;
        },
        onSuccess: () => {
            console.log('removed');
            queryClient.invalidateQueries({ queryKey: ['favourite'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
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
                            {isFav?.found}
                        </CardDescription>

                    </div>


                </CardHeader>

                <CardContent className='flex items-center justify-center h-full'>
                    {user.isSignedIn
                        ? (isFav && isFav.found
                            ? <HeartIcon filled onClick={() => removeFav()} disabled={isRemovingPending} />
                            : <HeartIcon onClick={() => addFav()} disabled={isAddingPending} />
                        ) : (null)
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default RepoCard;