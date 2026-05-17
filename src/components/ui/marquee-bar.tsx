interface MarqueeBarProps {
  items: string[]
  separator?: string
  className?: string
}

export function MarqueeBar({ items, separator = '✸', className = '' }: MarqueeBarProps) {
  const text = items.map((item) => `${item} ${separator}`).join('  ')

  return (
    <div
      className={`bg-rb-black overflow-hidden py-2.5 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-inner { animation: none !important; }
        }
        .marquee-inner {
          animation: marquee 24s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
      `}</style>
      <div className="marquee-inner">
        <span className="text-white text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {text} {text}
        </span>
      </div>
    </div>
  )
}
