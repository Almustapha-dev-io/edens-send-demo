import { SVGProps } from 'react';

export default function EqualsIcon({
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
        d="M0 3.625C0 3.27958 0.279583 3 0.625 3H9.375C9.72042 3 10 3.27958 10 3.625C10 3.97042 9.72042 4.25 9.375 4.25H0.625C0.279583 4.25 0 3.97042 0 3.625ZM9.375 6.75H0.625C0.279583 6.75 0 7.03 0 7.375C0 7.72 0.279583 8 0.625 8H9.375C9.72042 8 10 7.72 10 7.375C10 7.03 9.72042 6.75 9.375 6.75Z"
        fill={color}
      />
    </svg>
  );
}
