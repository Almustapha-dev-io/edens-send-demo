import { SVGProps } from 'react';

export default function RemoveIcon({
  width = 10,
  height = 11,
  color = '#102E34',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.49967 5.91665H2.49967C2.27051 5.91665 2.08301 5.72915 2.08301 5.49998C2.08301 5.27081 2.27051 5.08331 2.49967 5.08331H7.49967C7.72884 5.08331 7.91634 5.27081 7.91634 5.49998C7.91634 5.72915 7.72884 5.91665 7.49967 5.91665Z"
        fill={color}
      />
    </svg>
  );
}
