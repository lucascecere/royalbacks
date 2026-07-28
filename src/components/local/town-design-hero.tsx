import Image from 'next/image'
import Link from 'next/link'
import type { TownAssets } from '@/src/lib/seo'

interface TownDesignHeroProps {
  town: string
  assets: TownAssets
}

/**
 * Shown on a town page once that town's design exists: the wordmark as it's
 * actually stitched, the side mark, and a shot of the finished cap.
 *
 * Towns without a design skip this entirely and fall through to the standard
 * collection layout.
 */
export function TownDesignHero({ town, assets }: TownDesignHeroProps) {
  const accent = assets.accent ?? '#CC2929'

  return (
    <section className="rounded-[16px] overflow-hidden bg-rb-black mb-12">
      <div className="grid lg:grid-cols-2 items-center">
        <div className="px-8 py-12 lg:px-12 lg:py-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              color: accent,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            The {town} Cap
          </p>

          {assets.wordmark && (
            <Image
              src={assets.wordmark}
              alt={`${town} wordmark`}
              width={1200}
              height={824}
              className="w-[240px] sm:w-[300px] h-auto mb-8"
              sizes="(max-width: 640px) 240px, 300px"
              priority
            />
          )}

          <p
            className="text-white/70 text-base leading-relaxed max-w-md mb-8"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            Stitched in Milton, ten minutes up the road. Town wordmark across the front,
            {assets.icon ? ' local mark on the side,' : ''} on a structured five-panel with
            a contrast brim.
          </p>

          {assets.icon && (
            <div className="flex items-center gap-4 mb-10">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={assets.icon}
                  alt={`${town} side mark`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <p
                className="text-white/50 text-sm"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Side panel detail
              </p>
            </div>
          )}

          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-green text-white font-bold text-sm px-7 py-3.5 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            Order for your team
          </Link>
        </div>

        {assets.product && (
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[440px] bg-white">
            <Image
              src={assets.product}
              alt={assets.productAlt ?? `Royal Backs ${town} cap`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
