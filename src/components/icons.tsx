import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function WaterBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z" />
      <path d="M12 12.5V17" />
      <path d="M9.5 14.5L12 12l2.5 2.5" />
    </svg>
  )
}

export function EnergyBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 3L6 14h4v7l7-11h-4z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export function RecycleBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16l-4-4 4-4" />
      <path d="M8 12h9" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H7" />
      <path d="M12 8V5a3 3 0 013-3h1" />
      <path d="M12 16v3a3 3 0 003 3h1" />
    </svg>
  )
}

export function LeafBadge(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 18a6 6 0 006-6c0-2-1-3.7-2.5-4.9" />
            <path d="M12 6a6 6 0 00-6 6c0 2 1 3.7 2.5 4.9" />
        </svg>
    )
}

export function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.39,13.25a3.63,3.63,0,0,1-1.24,2.3,4.69,4.69,0,0,1-2.21,1.21,4,4,0,0,1-2.45,0,5.2,5.2,0,0,1-1.92-1.38,10,10,0,0,1-.36-1.31,1.83,1.83,0,0,1,.84-2,1.74,1.74,0,0,1,1.9-.1,2.1,2.1,0,0,1,1,1.6,2.32,2.32,0,0,0-.3,1.38,1.69,1.69,0,0,0,.68,1.39,1.52,1.52,0,0,0,1.22.45,1.46,1.46,0,0,0,1.26-.51,2.12,2.12,0,0,0,.5-1.4,5,5,0,0,0-1.32-3.41,4.71,4.71,0,0,0-3.35-1.78,4.78,4.78,0,0,0-3.7,1.7,9,9,0,0,0-1.87,5.65,10.6,10.6,0,0,0,2.12,6.58,5,5,0,0,0,3.69,2.1,4.3,4.3,0,0,0,2.6-.09,5,5,0,0,0,2.1-1.3,1.28,1.28,0,0,1-.21-.92A3.33,3.33,0,0,1,19.39,13.25ZM15.17,5.5A2.71,2.71,0,0,1,16,4.7a2.5,2.5,0,0,1,1.2-1.2,2.66,2.66,0,0,1,1.41-.35,3,3,0,0,1,1.17.25,1.67,1.67,0,0,1-.85,1.28,2.77,2.77,0,0,1-1.49.53,2.83,2.83,0,0,1-1.63-.3A1.17,1.17,0,0,1,15.17,5.5Z" />
    </svg>
  )
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.28,5 12.19,5C14.73,5 16.13,6.16 16.83,6.82L18.83,4.88C17.03,3.27 14.9,2.5 12.19,2.5C6.42,2.5 2,7.2 2,12C2,16.8 6.5,21.5 12.19,21.5C18,21.5 22,17.42 22,11.33C22,10.87 21.68,10.42 21.35,11.1Z" />
    </svg>
  );
}
