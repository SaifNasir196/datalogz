import React from 'react';
import { Button } from './ui/button';

interface HeartIconProps {
    filled?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled = false, onClick, disabled, className = '' }) => {
    return (
        <Button disabled={disabled} onClick={onClick} variant="ghost" size="icon" className='hover:none'>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-primary cursor-pointer ${filled && 'fill-current'} ${className}`}
                onClick={onClick}
            >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        </Button>
    );
};

export default HeartIcon;
