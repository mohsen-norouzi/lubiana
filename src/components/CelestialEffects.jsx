import { useEffect, useMemo, useRef } from 'react'
import { useControls, folder } from 'leva'
import gsap from 'gsap'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildStars(count, topPercent) {
  const rand = seededRandom(42)
  return Array.from({ length: count }, (_, i) => {
    const roll = rand()
    const size = roll > 0.92 ? 14 : roll > 0.75 ? 10 : roll > 0.45 ? 7 : 5
    return {
      id: i,
      left: `${rand() * 100}%`,
      top: `${rand() * topPercent}%`,
      size,
      baseOpacity: 0.3 + rand() * 0.7,
      twinkle: rand() > 0.25,
      rotation: rand() > 0.5 ? 0 : 45,
      glow: size >= 10,
    }
  })
}

/** Classic 4-point sparkle (X / ✦) */
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
      {/* Sharp 4-point X sparkle */}
      <path d="M12 0 L13.8 10.2 L24 12 L13.8 13.8 L12 24 L10.2 13.8 L0 12 L10.2 10.2 Z" />
      <circle cx="12" cy="12" r="1.2" fill="#fff" />
    </svg>
  )
}

const STAR = {
  count: 140,
  opacity: 0.85,
  glow: 6,
  size: 1,
  twinkleSpeed: 1.4,
  twinkleMin: 0,
  spinAmount: 55,
  skyCoverage: 70,
}

const ORBIT_PATHS = [
  'M720 480 C 920 220, 1120 150, 1380 240',
  'M640 520 C 860 280, 1100 200, 1320 300',
  'M780 400 C 980 160, 1200 120, 1400 200',
]

export default function CelestialEffects() {
  const layerRef = useRef(null)
  const pathsRef = useRef([])
  const shimmerRefs = useRef([])

  const {
    showLines,
    lineCount,
    lineOpacity,
    lineWidth,
    dashLength,
    gapLength,
    lineColor,
    drawDuration,
    shimmerSpeed,
    showSun,
    sunSize,
  } = useControls('Celestial', {
    Lines: folder({
      showLines: { value: true, label: 'Show lines' },
      lineCount: { value: 2, min: 1, max: 3, step: 1, label: 'Arc count' },
      lineOpacity: { value: 0.55, min: 0, max: 1, step: 0.01, label: 'Opacity' },
      lineWidth: { value: 1.2, min: 0.4, max: 4, step: 0.1, label: 'Stroke width' },
      dashLength: { value: 3, min: 1, max: 16, step: 0.5, label: 'Dash' },
      gapLength: { value: 7, min: 1, max: 24, step: 0.5, label: 'Gap' },
      lineColor: { value: '#e8e2d8', label: 'Color' },
      drawDuration: { value: 2.6, min: 0.4, max: 6, step: 0.1, label: 'Draw duration' },
      shimmerSpeed: { value: 3.2, min: 0.8, max: 8, step: 0.1, label: 'Shimmer speed' },
      showSun: { value: true, label: 'Sun tip' },
      sunSize: { value: 1, min: 0.4, max: 2.5, step: 0.05, label: 'Sun scale' },
    }),
  })

  const stars = useMemo(
    () => buildStars(STAR.count, STAR.skyCoverage),
    [],
  )

  const activePaths = ORBIT_PATHS.slice(0, lineCount)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.killTweensOf('[data-star]')
      const twinklers = gsap.utils.toArray('[data-star][data-twinkle="true"]')
      twinklers.forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        gsap.set(el, { transformOrigin: '50% 50%', rotation: 0 })
        gsap.to(el, {
          opacity: STAR.twinkleMin,
          scale: 0.15,
          rotation: STAR.spinAmount * dir,
          duration: STAR.twinkleSpeed * (0.85 + (i % 5) * 0.06),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: (i % 17) * 0.08,
        })
      })

      if (showLines) {
        pathsRef.current.forEach((path, i) => {
          if (!path) return
          const length = path.getTotalLength()
          gsap.killTweensOf(path)
          gsap.set(path, {
            strokeDasharray: `${dashLength} ${gapLength}`,
            strokeDashoffset: length,
          })
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: drawDuration,
            ease: 'power2.inOut',
            delay: 0.35 + i * 0.25,
          })
        })

        shimmerRefs.current.forEach((dot, i) => {
          if (!dot || !pathsRef.current[i]) return
          const path = pathsRef.current[i]
          const length = path.getTotalLength()
          gsap.killTweensOf(dot)
          gsap.set(dot, { opacity: 0.9 })
          gsap.to(dot, {
            duration: shimmerSpeed,
            repeat: -1,
            ease: 'none',
            delay: drawDuration + i * 0.2,
            onUpdate() {
              const t = this.progress()
              const pt = path.getPointAtLength(t * length)
              gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } })
            },
          })
        })

        gsap.fromTo(
          '[data-anim="sun"]',
          { scale: 0, opacity: 0, transformOrigin: 'center' },
          {
            scale: sunSize,
            opacity: 1,
            duration: 0.75,
            delay: drawDuration + 0.2,
            ease: 'back.out(2)',
          },
        )
      }
    }, layerRef)

    return () => ctx.revert()
  }, [
    showLines,
    dashLength,
    gapLength,
    drawDuration,
    shimmerSpeed,
    lineCount,
    sunSize,
  ])

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {stars.map((star) => {
        const s = star.size * STAR.size
        return (
          <span
            key={star.id}
            data-star
            data-twinkle={star.twinkle ? 'true' : 'false'}
            className="absolute"
            style={{
              left: star.left,
              top: star.top,
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              opacity: star.baseOpacity * STAR.opacity,
              willChange: 'opacity, transform',
            }}
          >
            <span className="block" style={{ transform: `rotate(${star.rotation}deg)` }}>
              <XStar size={s} glow={star.glow ? STAR.glow : STAR.glow * 0.35} />
            </span>
          </span>
        )
      })}

      {showLines && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {activePaths.map((d, i) => (
            <g key={i}>
              <path
                ref={(el) => {
                  pathsRef.current[i] = el
                }}
                d={d}
                stroke={lineColor}
                strokeOpacity={lineOpacity * (i === 0 ? 1 : 0.55)}
                strokeWidth={lineWidth * (i === 0 ? 1 : 0.75)}
                strokeLinecap="round"
              />
              <circle
                ref={(el) => {
                  shimmerRefs.current[i] = el
                }}
                r={i === 0 ? 2.8 : 1.8}
                fill={lineColor}
                opacity={0}
                style={{
                  filter: `drop-shadow(0 0 6px ${lineColor})`,
                }}
              />
            </g>
          ))}

          {showSun && (
            <g data-anim="sun" transform="translate(1375, 235)">
              <circle r={4 * sunSize} fill="#d4a86a" />
              <path
                d="M0 -12 L1.5 -3.4 L9.5 -3.4 L3 1.3 L5.5 9 L0 4.2 L-5.5 9 L-3 1.3 L-9.5 -3.4 L-1.5 -3.4 Z"
                fill="#d4a86a"
                opacity="0.95"
                transform={`scale(${sunSize})`}
              />
              <circle
                r={10 * sunSize}
                fill="none"
                stroke="#d4a86a"
                strokeOpacity="0.35"
                strokeWidth="0.6"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
