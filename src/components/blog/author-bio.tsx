export function AuthorBio() {
  return (
    <div className="flex gap-4 p-6 bg-rb-surface border border-rb-border rounded-sm">
      <div className="w-12 h-12 bg-rb-navy rounded-full flex-shrink-0 flex items-center justify-center">
        <span className="font-display text-rb-cream font-bold text-lg">D</span>
      </div>
      <div>
        <p className="font-medium text-rb-navy text-sm">Dylan McDougall</p>
        <p className="text-xs text-rb-muted mt-0.5">Founder, Royal Backs</p>
        <p className="text-sm text-rb-muted mt-2 leading-relaxed">
          Dylan has been embroidering in Milton, MA since 2017. He runs the machines, sources the
          garments, and has personal opinions about thread tension.
        </p>
      </div>
    </div>
  )
}
