import { useId, type SVGProps } from "react";

export const SparkleIcon = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill={`url(#${gradientId})`}
        d="M13 7 9 5.5l4-1.502L14.5 0l1.501 3.998L20 5.5 16.001 7 14.5 11 13 7Zm-8 8-5-2 5-2 2-5 2 5 5 2-5 2-2 5-2-5Z"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={10}
          x2={10}
          y1={0}
          y2={20}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AD95FB" />
          <stop offset={0.265} stopColor="#5E40A6" />
          <stop offset={0.555} stopColor="#FFC077" />
          <stop offset={0.735} stopColor="#EB9481" />
          <stop offset={0.955} stopColor="#C057DD" />
        </linearGradient>
      </defs>
    </svg>
  );
};
