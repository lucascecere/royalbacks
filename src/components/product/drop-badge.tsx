import { cn } from '@/src/lib/utils'
import type { DropStatus } from '@/src/types/drops'

interface DropBadgeProps {
  status: DropStatus
  className?: string
}

const BADGE_CONFIG: Record<DropStatus, { label: string; className: string }> = {
  live: { label: 'Live Now', className: 'bg-green-500 text-white' },
  ending_soon: { label: 'Ending Soon', className: 'bg-rb-gold text-rb-navy' },
  upcoming: { label: 'Coming Soon', className: 'bg-rb-navy text-rb-cream' },
  archived: { label: 'Ended', className: 'bg-rb-muted text-white' },
}

export function DropBadge({ status, className }: DropBadgeProps) {
  const config = BADGE_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
        config.className,
        className
      )}
    >
      {status === 'live' && (
        <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
      )}
      {config.label}
    </span>
  )
}
