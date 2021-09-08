import React from 'react';

// https://teenyicons.com

export const MoneyIcon: React.FC<React.RefAttributes<SVGSVGElement>> = (
  props,
) => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    {...props}
  >
    <path
      d="M0 12.5h15m-15 2h15M2.5 4V2.5H4m7 0h1.5V4m-10 3v1.5H4m7 0h1.5V7m-5 .5a2 2 0 110-4 2 2 0 010 4zm-6-7h12a1 1 0 011 1v8a1 1 0 01-1 1h-12a1 1 0 01-1-1v-8a1 1 0 011-1z"
      stroke="currentColor"
    ></path>
  </svg>
);

export const KeyIcon: React.FC<React.RefAttributes<SVGSVGElement>> = (
  props,
) => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    {...props}
  >
    <path
      d="M.5 14.5l8-8m-6 6l2 2m0-4l2 2m4.5-5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"
      stroke="currentColor"
    ></path>
  </svg>
);
