interface TownHeroProps {
  town: string
  county: string
  isHq: boolean
  coordinates: { lat: number; lng: number }
}

export function TownHero({ town, county, isHq, coordinates }: TownHeroProps) {
  const mapSrc = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=13&output=embed`
  return (
    <section className="bg-rb-black text-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {isHq && (
              <span className="inline-block bg-rb-green/20 text-rb-green text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Our Home Base
              </span>
            )}
            <h1
              className="font-display font-bold text-white uppercase leading-[0.9] tracking-[-0.03em] mb-4"
              style={{ fontSize: 'clamp(32px, 4vw, 64px)' }}
            >
              Custom Embroidery in {town}, MA
            </h1>
            <p className="text-white/70 text-lg mb-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              Royal Backs provides custom embroidery services to businesses, sports teams, and
              organizations in {town} and across {county}. Serving the South Shore since 2017.
            </p>
            <a
              href="/embroidery/quote"
              className="inline-block bg-rb-green text-white font-bold px-6 py-3 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase text-sm"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              Get a Free Quote
            </a>
          </div>
          <div className="rounded-[12px] overflow-hidden h-64 lg:h-80 bg-rb-ink">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${town}, MA`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
