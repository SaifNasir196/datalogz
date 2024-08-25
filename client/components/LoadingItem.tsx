import React from 'react'
import { Skeleton } from './ui/skeleton'

const LoadingItem = ({ width, height }: { width: number, height: number }) => {
    return (
        <Skeleton className={`w-${width} h-${height}`} />
    )
}

export default LoadingItem