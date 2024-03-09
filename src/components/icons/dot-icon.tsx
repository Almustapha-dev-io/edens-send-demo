import { SVGProps } from 'react';

export default function DotIcon({
  width = 13,
  height = 13,
  color = '#000',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6.83334" cy="6.875" r="6" fill={color} />
    </svg>
  );
}
