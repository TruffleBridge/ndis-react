import * as React from "react"

export const VerificationIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M10.5 12.443 8.557 10.5 7.5 11.557l3 3 6-6L15.443 7.5 10.5 12.443Z"
        fill="currentColor"
      />
      <path
        d="m12 22.5-4.632-2.47A8.235 8.235 0 0 1 3 12.75V3a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 3v9.75a8.234 8.234 0 0 1-4.368 7.28L12 22.5ZM4.5 3v9.75a6.742 6.742 0 0 0 3.575 5.956L12 20.8l3.925-2.093A6.743 6.743 0 0 0 19.5 12.75V3h-15Z"
        fill="currentColor"
      />
    </svg>
  )
}