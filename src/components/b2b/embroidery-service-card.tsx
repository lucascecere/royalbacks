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
      className="group block p-6 border border-rb-border rounded-sm hover:border-rb-navy hover:shadow-md transition-all bg-white"
    >
      {icon && <div className="mb-4 text-rb-gold">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-rb-navy mb-2 group-hover:text-rb-gold transition-colors">
        {title}
      </h3>
      <p className="text-sm text-rb-muted leading-relaxed mb-4">{description}</p>
      <span className="flex items-center gap-1 text-sm font-medium text-rb-navy group-hover:gap-2 transition-all">
        Learn more <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}
