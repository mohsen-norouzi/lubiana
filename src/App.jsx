import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import albumArt from './assets/album-beloved.jpg'
import CelestialEffects from './components/CelestialEffects'

const NAV = ['Music', 'Live', 'Videos', 'About', 'Journal', 'Contact']

function StarIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5l1.6 7.1L21 10l-7.4 1.4L12 22.5l-1.6-11.1L3 10l7.4-1.4L12 1.5z" />
    </svg>
  )
}

function EightPointStar({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0l1.85 8.15L22 10l-8.15 1.85L12 20l-1.85-8.15L2 10l8.15-1.85L12 0z" />
      <path
        d="M12 4.5l.9 4.1L17.5 10l-4.6.9-.9 4.6-.9-4.6L7 10l4.1-.9.9-4.6z"
        opacity="0.35"
      />
    </svg>
  )
}

function SpotifyIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.3.18.42.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.99-.12-1.14-.6-.12-.48.12-.99.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.42.24.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-3.2 1.7-4.8 4.9-4.9 1.3-.1 1.7-.1 4.9-.1zm0 1.8c-3.2 0-3.5 0-4.8.1-2.3.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.8s0 3.5.1 4.8c.1 2.2 1.2 3.3 3.4 3.4 1.2.1 1.6.1 4.8.1s3.5 0 4.8-.1c2.2-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.8s0-3.5-.1-4.8c-.1-2.2-1.2-3.3-3.4-3.4-1.3-.1-1.6-.1-4.8-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 8.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.4-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const artistRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-anim="nav"]', { y: -24, opacity: 0, duration: 0.9 })
        .from(
          '[data-anim="eyebrow"]',
          { y: 18, opacity: 0, duration: 0.7 },
          '-=0.35',
        )
        .from(
          '[data-anim="title"]',
          { y: 40, opacity: 0, duration: 0.95 },
          '-=0.35',
        )
        .from(
          '[data-anim="outnow"]',
          { scaleX: 0.6, opacity: 0, duration: 0.7 },
          '-=0.45',
        )
        .from(
          '[data-anim="cta"]',
          { y: 22, opacity: 0, stagger: 0.12, duration: 0.7 },
          '-=0.35',
        )
        .from(
          '[data-anim="tour"]',
          { y: 28, opacity: 0, duration: 0.8 },
          '-=0.35',
        )
        .from(
          '[data-anim="copy"]',
          { opacity: 0, duration: 0.6 },
          '-=0.4',
        )

      gsap.from(artistRef.current, {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.15,
      })

      gsap.to('[data-twinkle]', {
        opacity: 0.35,
        scale: 0.85,
        duration: 1.6,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative min-h-svh w-full overflow-hidden bg-transparent text-cream"
    >
      {/* Stars behind */}
      <CelestialEffects />

      {/* girl.png — normal <img>, untouched file. lighten = black sky lets stars show through */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <img
          ref={artistRef}
          src="/img/girl.png"
          alt="Lubiana with kora"
          className="absolute inset-0 h-full w-full object-cover object-center mix-blend-lighten"
        />
      </div>

      <header
        data-anim="nav"
        className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-10 lg:px-14 lg:pt-8"
      >
        <a
          href="#top"
          className="font-display text-[1.65rem] leading-none tracking-[0.02em] text-cream md:text-[1.85rem]"
        >
          Lubiana
        </a>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[11px] font-light uppercase tracking-[0.28em] text-cream/90 transition-colors hover:text-gold"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-cream/90">
          <a href="https://spotify.com" aria-label="Spotify" className="transition-colors hover:text-gold">
            <SpotifyIcon />
          </a>
          <a href="https://youtube.com" aria-label="YouTube" className="transition-colors hover:text-gold">
            <YoutubeIcon />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="transition-colors hover:text-gold">
            <InstagramIcon />
          </a>
          <button
            type="button"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 lg:hidden"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-3.5 bg-cream" />
              <span className="block h-px w-3.5 bg-cream" />
              <span className="block h-px w-3.5 bg-cream" />
            </span>
          </button>
        </div>
      </header>

      <div className="relative z-20 flex min-h-[calc(100svh-5.5rem)] flex-col justify-center px-6 pb-24 pt-10 md:px-10 lg:max-w-[52%] lg:px-14 lg:pb-28 lg:pt-6 xl:max-w-[48%]">
        <div data-anim="eyebrow" className="mb-4 flex items-center gap-2.5 text-gold">
          <span data-twinkle>
            <EightPointStar className="h-3.5 w-3.5" />
          </span>
          <span className="text-[12px] font-light uppercase tracking-[0.32em]">New Album</span>
        </div>

        <h1 data-anim="title" className="m-0 w-full max-w-[min(100%,34rem)]">
          <img
            src="/img/beloved.png"
            alt="Beloved"
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </h1>

        <div
          data-anim="outnow"
          className="mt-5 mb-8 flex max-w-[16rem] items-center gap-3 origin-left"
        >
          <span className="h-px flex-1 bg-gold/70" />
          <span data-twinkle className="text-gold">
            <StarIcon className="h-2.5 w-2.5" />
          </span>
          <span className="text-[12px] font-light uppercase tracking-[0.35em] text-gold">
            Out Now
          </span>
          <span data-twinkle className="text-gold">
            <StarIcon className="h-2.5 w-2.5" />
          </span>
          <span className="h-px flex-1 bg-gold/70" />
        </div>

        <div className="mb-14 flex flex-wrap items-center gap-5 sm:gap-7">
          <a
            data-anim="cta"
            href="#listen"
            className="inline-flex items-center gap-2.5 rounded-full bg-gold-btn px-7 py-3 text-[11px] font-medium tracking-[0.22em] text-night-deep uppercase transition-transform hover:scale-[1.03]"
          >
            Listen Now
            <StarIcon className="h-2.5 w-2.5" />
          </a>
          <a
            data-anim="cta"
            href="#video"
            className="inline-flex items-center gap-3 text-[11px] font-light tracking-[0.28em] text-cream uppercase transition-colors hover:text-gold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/70">
              <svg className="ml-0.5 h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M3 1.5v9l8-4.5-8-4.5z" />
              </svg>
            </span>
            Watch Video
          </a>
        </div>

        <div data-anim="tour" className="flex items-end gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div
              className="absolute -right-2 -top-1 h-[4.5rem] w-[4.5rem] rounded-full border border-cream/15 bg-gradient-to-br from-[#2a3340] to-[#121820] sm:h-[5rem] sm:w-[5rem]"
              aria-hidden="true"
            />
            <img
              src={albumArt}
              alt="Beloved album cover"
              className="relative h-[4.5rem] w-[4.5rem] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-[5rem] sm:w-[5rem]"
            />
          </div>
          <div className="pb-0.5">
            <div className="mb-1.5 flex items-center gap-2 text-gold">
              <span data-twinkle>
                <StarIcon className="h-2.5 w-2.5" />
              </span>
              <p className="text-[12px] font-light tracking-[0.04em]">
                European Tour 26{' '}
                <span className="text-gold/50">/</span>{' '}
                <span className="text-gold-soft">Tickets on sale now</span>
              </p>
            </div>
            <a
              href="#tour"
              className="text-[11px] font-light tracking-[0.28em] text-cream/90 uppercase underline decoration-cream/40 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
            >
              See Dates
            </a>
          </div>
        </div>
      </div>

      <p
        data-anim="copy"
        className="absolute bottom-5 left-6 z-20 text-[10px] tracking-[0.06em] text-cream/45 md:left-10 lg:left-14"
      >
        © 2026 Lubiana. All rights reserved.
      </p>
    </section>
  )
}
