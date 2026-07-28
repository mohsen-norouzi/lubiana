import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const STAR = {
  count: 140,
  opacity: 0.85,
  glow: 6,
  size: 1,
  skyCoverage: 70,
  frameSteps: 4,
  animDuration: 1,
  spinAmount: 55,
  minScale: 0.15,
  stagger: 0.3,
}

const LINK = {
  count: 10,
  maxDist: 22,
  opacity: 0.1,
  width: 0.7,
  color: '#e8e2d8',
}

function buildStars(count, topPercent) {
  const rand = seededRandom(42)
  return Array.from({ length: count }, (_, i) => {
    const roll = rand()
    const size = roll > 0.92 ? 14 : roll > 0.75 ? 10 : roll > 0.45 ? 7 : 5
    const x = rand() * 100
    const y = rand() * topPercent
    return {
      id: i,
      x,
      y,
      left: `${x}%`,
      top: `${y}%`,
      size,
      baseOpacity: 0.3 + rand() * 0.7,
      twinkle: rand() > 0.25,
      rotation: rand() > 0.5 ? 0 : 45,
      glow: size >= 10,
    }
  })
}

function pickRandomPair(stars, maxDist) {
  const maxAttempts = 40
  for (let n = 0; n < maxAttempts; n++) {
    const a = Math.floor(Math.random() * stars.length)
    let b = Math.floor(Math.random() * stars.length)
    if (a === b) continue
    const dx = stars[a].x - stars[b].x
    const dy = stars[a].y - stars[b].y
    const dist = Math.hypot(dx, dy)
    if (dist > maxDist || dist < 2) continue
    return {
      x1: stars[a].x,
      y1: stars[a].y,
      x2: stars[b].x,
      y2: stars[b].y,
    }
  }
  // fallback: any two distinct stars
  const a = Math.floor(Math.random() * stars.length)
  let b = (a + 1 + Math.floor(Math.random() * (stars.length - 1))) % stars.length
  return {
    x1: stars[a].x,
    y1: stars[a].y,
    x2: stars[b].x,
    y2: stars[b].y,
  }
}

function XStar({ size, glow, color = '#e8e2d8' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      style={{
        display: 'block',
        overflow: 'visible',
        filter: glow
          ? `drop-shadow(0 0 ${glow}px rgba(232,226,216,0.95)) drop-shadow(0 0 ${glow * 1.8}px rgba(212,168,106,0.4))`
          : `drop-shadow(0 0 ${Math.max(glow * 0.45, 1)}px rgba(232,226,216,0.55))`,
      }}
    >
      <path d="M12 0 L13.8 10.2 L24 12 L13.8 13.8 L12 24 L10.2 13.8 L0 12 L10.2 10.2 Z" />
      <circle cx="12" cy="12" r="1.2" fill="#fff" />
    </svg>
  )
}

export default function CelestialEffects({ playing = false }) {
  const layerRef = useRef(null)
  const starTweensRef = useRef([])
  const linkTweensRef = useRef([])
  const playingRef = useRef(playing)
  const starsRef = useRef([])

  const stars = useMemo(
    () => buildStars(STAR.count, STAR.skyCoverage),
    [],
  )
  starsRef.current = stars

  playingRef.current = playing

  // Stars fade in randomly, then twinkle while playing
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.killTweensOf('[data-star]')
      starTweensRef.current = []

      const allStars = gsap.utils.toArray('[data-star]')
      allStars.forEach((el, i) => {
        const base = Number(el.dataset.baseOpacity || 0.6)
        const dir = i % 2 === 0 ? 1 : -1

        gsap.set(el, {
          transformOrigin: '50% 50%',
          opacity: 0,
          scale: 0,
          rotation: 0,
        })

        gsap.to(el, {
          opacity: base,
          scale: 1,
          duration: 0.3 + Math.random() * 0.5,
          delay: 0.15 + Math.random() * 2.2,
          ease: 'power2.out',
          onComplete() {
            if (el.dataset.twinkle !== 'true') return
            const tween = gsap.to(el, {
              opacity: 0,
              scale: STAR.minScale,
              rotation: STAR.spinAmount * dir,
              duration: STAR.animDuration + (i % 3) * 0.08,
              ease: `steps(${STAR.frameSteps})`,
              repeat: -1,
              yoyo: true,
              delay: Math.random() * STAR.stagger * 4,
              paused: !playingRef.current,
            })
            starTweensRef.current.push(tween)
          },
        })
      })
    }, layerRef)

    return () => {
      ctx.revert()
      starTweensRef.current = []
    }
  }, [])

  // Random constellation links — new star pairs every blink cycle
  useEffect(() => {
    const stopLinks = () => {
      linkTweensRef.current.forEach((t) => t.kill())
      linkTweensRef.current = []
      gsap.set('[data-link]', { opacity: 0 })
    }

    if (!playing) {
      stopLinks()
      return stopLinks
    }

    const ctx = gsap.context(() => {
      stopLinks()
      const lines = gsap.utils.toArray('[data-link]')

      const runCycle = (el, i) => {
        if (!playingRef.current) {
          gsap.set(el, { opacity: 0 })
          return
        }

        const pair = pickRandomPair(starsRef.current, LINK.maxDist)
        gsap.set(el, {
          opacity: 0,
          attr: { x1: pair.x1, y1: pair.y1, x2: pair.x2, y2: pair.y2 },
        })

        const duration = STAR.animDuration + (i % 3) * 0.08
        const tween = gsap.to(el, {
          opacity: LINK.opacity,
          duration,
          ease: `steps(${STAR.frameSteps})`,
          yoyo: true,
          repeat: 1,
          delay: (i % 7) * 0.15,
          onComplete() {
            if (!playingRef.current) {
              gsap.set(el, { opacity: 0 })
              return
            }
            // brief gap, then reconnect two new random stars
            const wait = gsap.delayedCall(0.08 + Math.random() * 0.35, () => {
              runCycle(el, i)
            })
            linkTweensRef.current.push(wait)
          },
        })
        linkTweensRef.current.push(tween)
      }

      lines.forEach((el, i) => runCycle(el, i))
    }, layerRef)

    return () => {
      ctx.revert()
      stopLinks()
    }
  }, [playing])

  // Pause freezes stars in place
  useEffect(() => {
    starTweensRef.current.forEach((tween) => {
      if (playing) tween.resume()
      else tween.pause()
    })
  }, [playing])

  // Logo + main star entrance / glow pulse
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-anim="logo-sun"]',
        { scale: 0, opacity: 0, rotation: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          delay: 0.4,
          ease: 'back.out(1.6)',
        },
      )
      gsap.to('[data-anim="logo-sun"]', {
        rotation: 360,
        duration: 80,
        ease: 'none',
        repeat: -1,
        delay: 1.2,
      })

      gsap.fromTo(
        '[data-anim="main-star"]',
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 0.55, duration: 1.1, delay: 0.7, ease: 'power2.out' },
      )

      gsap.to('[data-anim="main-star"]', {
        scale: 1.05,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      })
    }, layerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: LINK.count }, (_, i) => (
          <line
            key={i}
            data-link
            x1={0}
            y1={0}
            x2={0}
            y2={0}
            stroke={LINK.color}
            strokeWidth={LINK.width}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            opacity={0}
          />
        ))}
      </svg>

      {stars.map((star) => {
        const s = star.size * STAR.size
        return (
          <span
            key={star.id}
            data-star
            data-twinkle={star.twinkle ? 'true' : 'false'}
            data-base-opacity={star.baseOpacity * STAR.opacity}
            className="absolute"
            style={{
              left: star.left,
              top: star.top,
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              opacity: 0,
              willChange: 'opacity, transform',
            }}
          >
            <span className="block" style={{ transform: `rotate(${star.rotation}deg)` }}>
              <XStar size={s} glow={star.glow ? STAR.glow : STAR.glow * 0.35} />
            </span>
          </span>
        )
      })}

      <img
        data-anim="main-star"
        src="/img/main-star.png"
        alt=""
        className="main-star absolute top-[46%] left-[40%] z-[2] h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain sm:h-20 sm:w-20 md:left-[42%] md:h-24 md:w-24"
      />

      <img
        data-anim="logo-sun"
        src="/img/logo.png"
        alt=""
        className="absolute top-[18%] right-[6%] mix-blend-lighten will-change-transform md:right-[8%] md:top-[16%]"
        style={{ width: 56, height: 'auto' }}
      />
    </div>
  )
}
