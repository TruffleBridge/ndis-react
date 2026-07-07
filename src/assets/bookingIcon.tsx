import * as React from "react"
export const BookingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill={"none"}
    {...props}
  >
    <path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.25 16.303v-.084m5.063.084v-.084m0-4.5v-.085m4.5.085v-.085M1.874 7.22h15.75M3.911.75v1.688M15.375.75v1.688m0 0H4.125A3.375 3.375 0 0 0 .75 5.812v11.25a3.375 3.375 0 0 0 3.375 3.376h11.25a3.375 3.375 0 0 0 3.375-3.375V5.813a3.375 3.375 0 0 0-3.375-3.375Z"
    />
  </svg>
)
