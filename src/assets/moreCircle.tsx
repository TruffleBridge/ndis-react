import * as React from "react"
export const MoreCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#00C950"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.75 20.75c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
    />
    <path
      fill="#00C950"
      d="M5.75 12.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10.75 12.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.75 12.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
    />
  </svg>
)
