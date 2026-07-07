import * as React from "react"
export const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        {...props}
    >
        <g
            stroke="#99A1AF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.167}
            clipPath="url(#a)"
        >
            <path d="M8.4 15.533c1.24-1.07 4.933-4.537 4.933-7.866a5.333 5.333 0 1 0-10.666 0c0 3.329 3.692 6.795 4.932 7.866a.667.667 0 0 0 .801 0Z" />
            <path d="M8 9.666a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
)
