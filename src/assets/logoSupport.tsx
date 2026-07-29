export const LogoSupportIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width ?? 29}
        height={props?.height ?? 29}
        fill="none"
        {...props}
    >
        <path
            fill="#086D63"
            fillRule="evenodd"
            d="M18.528 8.472A7.25 7.25 0 0 0 14.5 7.25V0A14.5 14.5 0 1 1 0 14.5h7.25a7.25 7.25 0 1 0 11.278-6.028Z"
            clipRule="evenodd"
        />
        <path
            fill="#086D63"
            fillRule="evenodd"
            d="M7.25 0A7.25 7.25 0 0 1 0 7.25v7.25A14.5 14.5 0 0 0 14.5 0H7.25Z"
            clipRule="evenodd"
        />
    </svg>
)
