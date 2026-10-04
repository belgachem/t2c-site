type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function DomainIcon({ name, size = 36, className }: IconProps & { name?: string }) {
  const p = { ...base(size), className }
  switch (name) {
    case 'industry':
      return (
        <svg {...p}>
          <path d="M2 20h20" />
          <path d="M4 20V10l5 3V10l5 3V6h6v14" />
          <path d="M16 10h2M16 14h2" />
        </svg>
      )
    case 'health':
      return (
        <svg {...p}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      )
    case 'robotics':
      return (
        <svg {...p}>
          <rect x="5" y="7" width="14" height="11" rx="2" />
          <path d="M12 7V3" />
          <circle cx="12" cy="3" r="1" />
          <circle cx="9" cy="12" r="1.2" />
          <circle cx="15" cy="12" r="1.2" />
          <path d="M9 15.5h6M2 12v3M22 12v3" />
        </svg>
      )
    case 'ai':
      return (
        <svg {...p}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
          <path d="M10 10h4v4h-4z" />
        </svg>
      )
    case 'energy':
      return (
        <svg {...p}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
        </svg>
      )
  }
}

export function DownloadIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

export function MenuIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function LinkedinIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </svg>
  )
}
