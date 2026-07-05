import * as React from "react"
export const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        fill="none"
        {...props}
    >
        <path
            stroke="#7F7F7F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.27 12.25h4.685c.688 0 1.245.557 1.245 1.245v7.955a2 2 0 0 1-2 2H5.6M2.8 5.794V21a2.45 2.45 0 0 0 4.9 0v-7.505c0-.688.557-1.245 1.244-1.245h13.767V9.308c0-.687-.557-1.244-1.244-1.244h-8.2l-1.9-2.945a1.245 1.245 0 0 0-1.046-.569H4.044c-.687 0-1.244.557-1.244 1.244Z"
        />
    </svg>
)
