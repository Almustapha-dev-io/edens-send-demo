import { SVGProps } from 'react';

export default function CheckCircleIcon({
  width = 60,
  height = 60,
  color = '#38C16F',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_208_8120)">
        <path
          d="M45.535 22.745C46.5025 23.73 46.4875 25.3125 45.5 26.28L34.435 37.1425C32.4775 39.0625 29.9575 40.02 27.435 40.02C24.94 40.02 22.445 39.08 20.495 37.1975L15.7475 32.53C14.7625 31.5625 14.75 29.98 15.7175 28.995C16.6825 28.0075 18.27 27.995 19.2525 28.965L23.985 33.6175C25.925 35.4925 28.9875 35.4825 30.9375 33.5725L42 22.7125C42.9825 21.7425 44.56 21.76 45.535 22.745ZM60 30C60 46.5425 46.5425 60 30 60C13.4575 60 0 46.5425 0 30C0 13.4575 13.4575 0 30 0C46.5425 0 60 13.4575 60 30ZM55 30C55 16.215 43.785 5 30 5C16.215 5 5 16.215 5 30C5 43.785 16.215 55 30 55C43.785 55 55 43.785 55 30Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_208_8120">
          <rect width="60" height="60" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
