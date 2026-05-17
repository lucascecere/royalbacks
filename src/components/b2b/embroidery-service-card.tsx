import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface EmbroideryServiceCardProps {
  title: string
  description: string
  href: string
  icon?: React.ReactNode
}

export function EmbroideryServiceCard({
  title,
  description,
  href,
  icon,
}: EmbroideryServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 border border-rb-border rounded-[12px] hover:border-rb-black hover:shadow-md transition-all bg-white"
    >
      {icon && <div className="mb-4 text-rb-green">{icon}</div>}
      <h3 className="font-display text-lg font-bold text-rb-black mb-2 group-hover:text-rb-green transition-colors uppercase">
        {title}
      </h3>
      <p className="text-sm text-rb-muted leading-relaxed mb-4">{description}</p>
      <span className="flex items-center gap-1 text-sm font-bold text-rb-black group-hover:gap-2 transition-all" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        Learn more <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}
