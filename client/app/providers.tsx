'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"



export function Providers({ children, ...props }: ThemeProviderProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
            },
        },
    }));

    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <NextThemesProvider {...props}>
                    {children}
                </NextThemesProvider>
            </QueryClientProvider>
        </ClerkProvider>
    );
}