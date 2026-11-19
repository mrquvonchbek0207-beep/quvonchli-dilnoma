import { useEffect, useState } from 'react'
import { Check, Copy, Heart, RotateCcw, Send } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import CardCanvas from './CardCanvas.jsx'

const particles = [
  { left: '12%', top: '18%', delay: 0 },
  { left: '23%', top: '72%', delay: 0.7 },
  { left: '34%', top: '12%', delay: 1.3 },
  { left: '67%', top: '16%', delay: 0.4 },
  { left: '79%', top: '31%', delay: 1.8 },
  { left: '88%', top: '70%', delay: 0.9 },
  { left: '15%', top: '48%', delay: 1.1 },
  { left: '73%', top: '82%', delay: 0.2 },
  { left: '48%', top: '86%', delay: 1.5 },
  { left: '91%', top: '47%', delay: 0.6 },
]

const petals = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2
  const distance = 90 + (index % 4) * 24
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (index % 2 ? 1 : -1) * (120 + index * 13),
    color: index % 3,
  }
})

const petalColors = [
  'bg-rose-400',
  'bg-amber-300',
  'bg-pink-300',
]

function EnvelopeAnim({ card }) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [shareFeedback, setShareFeedback] = useState('')
  const pageUrl = typeof window === 'undefined' ? '' : window.location.href
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(
    t('publicCard.telegramMessage'),
  )}`

  useEffect(() => {
    if (!showBurst) return undefined
    const timerId = window.setTimeout(() => setShowBurst(false), 1500)
    return () => window.clearTimeout(timerId)
  }, [showBurst])

  useEffect(() => {
    if (!shareFeedback) return undefined
    const timerId = window.setTimeout(() => setShareFeedback(''), 2400)
    return () => window.clearTimeout(timerId)
  }, [shareFeedback])

  function openEnvelope() {
    setIsOpen(true)
    setShowBurst(!reduceMotion)
  }

  function closeEnvelope() {
    setIsOpen(false)
    setShowBurst(false)
    setShareFeedback('')
  }

  async function copyCardLink() {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setShareFeedback('copied')
    } catch (error) {
      console.error('Unable to copy the public card link.', error)
      setShareFeedback('copyError')
    }
  }

  return (
    <section className="relative isolate grid min-h-[440px] place-items-center overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 px-4 py-14 sm:min-h-[560px] sm:px-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30">
      <div className="pointer-events-none absolute -left-20 -top-24 -z-10 size-72 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-700/15" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 -z-10 size-80 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-700/10" />

      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          aria-hidden="true"
          className={`pointer-events-none absolute rounded-full ${
            index % 3 === 0
              ? 'size-2 bg-rose-300 dark:bg-rose-500/60'
              : 'size-1.5 bg-amber-300 dark:bg-amber-400/50'
          }`}
          style={{ left: particle.left, top: particle.top }}
          animate={
            reduceMotion
              ? { opacity: 0.45 }
              : {
                  y: [0, -12, 0],
                  x: [0, index % 2 === 0 ? 6 : -6, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.1, 0.8],
                }
          }
          transition={{
            duration: 3.8 + (index % 4) * 0.45,
            delay: particle.delay,
            repeat: reduceMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative w-full max-w-[500px] [perspective:1200px]">
        <div className="relative aspect-[1.55] w-full">
          <div className="absolute inset-0 z-0 rounded-2xl border border-rose-300/70 bg-gradient-to-br from-rose-200 via-rose-300 to-rose-400 shadow-2xl shadow-rose-950/20 dark:border-rose-800 dark:from-rose-950 dark:via-rose-900 dark:to-rose-800" />

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-30 h-[68%] origin-top rounded-t-2xl border-x border-t border-rose-300/60 bg-gradient-to-br from-rose-300 to-rose-500 dark:border-rose-700 dark:from-rose-800 dark:to-rose-950"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
            initial={false}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }
            }
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl border border-rose-400/60 bg-gradient-to-br from-rose-300/95 via-rose-400/95 to-rose-500/95 dark:border-rose-700 dark:from-rose-800/95 dark:via-rose-900/95 dark:to-rose-950/95"
            style={{
              clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)',
            }}
            initial={false}
            animate={{ opacity: isOpen ? 0.2 : 1 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.4 }}
          />

          <AnimatePresence>
            {!isOpen ? (
              <motion.button
                key="envelope-seal"
                type="button"
                onClick={openEnvelope}
                aria-expanded={false}
                aria-label={t('publicCard.openEnvelope')}
                className="absolute inset-0 z-40 grid w-full place-items-center rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-rose-500/70"
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                exit={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 0.4,
                  rotate: reduceMotion ? 0 : 18,
                  transition: { duration: reduceMotion ? 0.01 : 0.28 },
                }}
              >
                <motion.span
                  className="grid size-16 place-items-center rounded-full border-[5px] border-rose-200 bg-gradient-to-br from-rose-600 to-rose-800 text-rose-50 shadow-xl shadow-rose-950/30 ring-4 ring-rose-50/40 dark:border-rose-300/70 dark:from-rose-500 dark:to-rose-700 dark:ring-rose-950/40"
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { scale: [1, 1.04, 1], rotate: [0, -3, 3, 0] }
                  }
                  transition={{
                    duration: 2.8,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart size={25} fill="currentColor" aria-hidden="true" />
                </motion.span>
                <span className="absolute bottom-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold tracking-wide text-rose-800 shadow-sm dark:bg-slate-950/85 dark:text-rose-100">
                  {t('publicCard.tapToOpen')}
                </span>
              </motion.button>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showBurst && !reduceMotion ? (
              <motion.div
                key="petal-burst"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
              >
                {petals.map((petal, index) => (
                  <motion.span
                    key={index}
                    className={`absolute left-1/2 top-1/2 h-3 w-2 rounded-full shadow-sm ${petalColors[petal.color]}`}
                    initial={{ opacity: 0, scale: 0.25, x: 0, y: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.25, 1, 0.8],
                      x: petal.x,
                      y: petal.y,
                      rotate: petal.rotate,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.15,
                      delay: (index % 4) * 0.025,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          layout
          className={`w-full transform-gpu will-change-transform ${
            isOpen
              ? 'relative z-[35] -mt-[55vw] sm:-mt-[280px]'
              : 'pointer-events-none absolute -left-[5%] top-0 z-10 w-[110%]'
          }`}
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? -28 : 52,
            scale: isOpen ? 1.02 : 0.84,
          }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 150, damping: 22, mass: 0.8 }
          }
        >
          <CardCanvas
            template={card.template}
            senderName={card.sender_name}
            recipientName={card.recipient_name}
            message={card.message}
            themeMode={card.theme_mode || 'light'}
          />
        </motion.div>

        {isOpen ? (
          <div className="relative z-40 mt-6 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={closeEnvelope}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.25 }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-200 dark:hover:bg-slate-800"
            >
              <RotateCcw size={16} aria-hidden="true" />
              {t('publicCard.closeEnvelope')}
            </motion.button>
            <button
              type="button"
              onClick={copyCardLink}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {shareFeedback === 'copied' ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              {t('publicCard.copyLink')}
            </button>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Send size={16} aria-hidden="true" />
              {t('publicCard.shareTelegram')}
            </a>
          </div>
        ) : null}

        <AnimatePresence>
          {isOpen && shareFeedback ? (
            <motion.p
              key={shareFeedback}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`relative z-40 mx-auto mt-3 w-fit rounded-full px-4 py-2 text-sm font-medium ${
                shareFeedback === 'copied'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
              }`}
            >
              {t(`publicCard.${shareFeedback}`)}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default EnvelopeAnim
