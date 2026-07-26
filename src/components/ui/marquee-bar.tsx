interface MarqueeBarProps {
  items: string[]
  separator?: string
  className?: string
  /**
   * Times the message list is repeated per half of the track. One half has to
   * be wider than the viewport, otherwise the -50% scroll exposes empty bar.
   */
  repeat?: number
}

export function MarqueeBar({
  items,
  separator = '✸',
  className = '',
  repeat = 6,
}: MarqueeBarProps) {
  const text = items.map((item) => `${item} ${separator}`).join('  ')
  const half = Array.from({ length: repeat }, () => text).join('  ')

  return (
    <div className={`bg-rb-black overflow-hidden py-2.5 ${className}`} aria-hidden="true">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-inner { animation: none !important; }
        }
        .marquee-inner {
          animation: marquee 60s linear infinite;
          white-space: nowrap;
          display: flex;
          width: max-content;
        }
      `}</style>
      <div className="marquee-inner">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-white text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {half}&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}
