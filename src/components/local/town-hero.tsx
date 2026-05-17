interface TownHeroProps {
  town: string
  county: string
  isHq: boolean
  coordinates: { lat: number; lng: number }
}

export function TownHero({ town, county, isHq, coordinates }: TownHeroProps) {
  const mapSrc = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=13&output=embed`
  return (
    <section className="bg-rb-navy text-rb-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {isHq && (
              <span className="inline-block bg-rb-gold/20 text-rb-gold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Our Home Base
              </span>
            )}
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              Custom Embroidery in {town}, MA
            </h1>
            <p className="text-rb-cream/70 text-lg mb-6">
              Royal Backs provides custom embroidery services to businesses, sports teams, and
              organizations in {town} and across {county}. Serving the South Shore since 2017.
            </p>
            <a
              href="/embroidery/quote"
              className="inline-block bg-rb-gold text-rb-navy font-medium px-6 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
            >
              Get a Free Quote
            </a>
          </div>
          <div className="rounded-sm overflow-hidden h-64 lg:h-80 bg-rb-navy-light">
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
