import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MovieOrSeries } from '../../types/MovieTypes';

interface Props {
  pick: MovieOrSeries | null;
  pool: MovieOrSeries[];
  onClose: () => void;
}

const CARD_WIDTH = 136;
const CARD_GAP = 12;
const STRIDE = CARD_WIDTH + CARD_GAP;

function buildTrack(pool: MovieOrSeries[], pick: MovieOrSeries) {
  const base = pool.length > 0 ? pool : [pick];
  const loops = 12;
  const targetLoop = loops - 2;

  const cards: MovieOrSeries[] = [];
  for (let i = 0; i < loops * base.length; i += 1) {
    cards.push(base[i % base.length]);
  }

  const pickIndex = Math.max(
    0,
    base.findIndex((item) => item.id === pick.id)
  );

  const targetIndex = targetLoop * base.length + pickIndex;
  return { cards, targetIndex };
}

export default function RandomPickModal({ pick, pool, onClose }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [track, setTrack] = useState<MovieOrSeries[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!pick) return;

    const { cards, targetIndex: nextTarget } = buildTrack(pool, pick);
    setTrack(cards);
    setTargetIndex(nextTarget);
    setXPos(0);
    setAnimationDone(false);
    setIsRolling(false);

    const frame = requestAnimationFrame(() => {
      const viewportWidth = viewportRef.current?.clientWidth ?? 680;
      const center = nextTarget * STRIDE + CARD_WIDTH / 2;
      const end = -(center - viewportWidth / 2);
      setIsRolling(true);
      setXPos(end);
    });

    return () => cancelAnimationFrame(frame);
  }, [pick, pool]);

  if (!pick) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-4xl rounded-3xl border border-zinc-700/60 bg-[#11151d] p-5 shadow-[0_35px_90px_-45px_rgba(0,0,0,1)] sm:p-7"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Festival Roulette</p>
              <h3 className="text-2xl font-bold text-zinc-100">Sorteo cinematografico</h3>
            </div>
            <button
              className="rounded-full border border-zinc-600/70 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-amber-300/40 hover:text-amber-200"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>

          <div
            ref={viewportRef}
            className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-zinc-700/60 bg-black/35 px-2 py-5"
          >
            <div className="pointer-events-none absolute inset-y-2 left-1/2 z-30 -translate-x-1/2">
              <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
              <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border border-cyan-200/80 bg-cyan-300/60 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
              <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border border-cyan-200/80 bg-cyan-300/60 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
            </div>

            <motion.div
              className="flex"
              animate={{ x: xPos }}
              transition={{ duration: 6, ease: [0.08, 0.86, 0.18, 1] }}
              onAnimationComplete={() => {
                if (isRolling) {
                  setAnimationDone(true);
                  setIsRolling(false);
                }
              }}
              style={{ gap: `${CARD_GAP}px` }}
            >
              {track.map((item, idx) => (
                <motion.article
                  key={`${item.id}-${idx}`}
                  animate={
                    idx === targetIndex && animationDone
                      ? {
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            '0 0 0 rgba(251,191,36,0)',
                            '0 0 14px rgba(251,191,36,0.42), 0 0 24px rgba(249,115,22,0.22)',
                            '0 0 0 rgba(251,191,36,0)',
                          ],
                        }
                      : {
                          scale: 1,
                          boxShadow: '0 0 0 rgba(0,0,0,0)',
                        }
                  }
                  transition={
                    idx === targetIndex && animationDone
                      ? {
                          duration: 1.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                      : { duration: 0.2 }
                  }
                  className={`w-[136px] shrink-0 overflow-hidden rounded-xl border bg-zinc-900/80 ${
                    idx === targetIndex ? 'border-amber-300/80' : 'border-zinc-700/70'
                  }`}
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title || item.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-xs text-zinc-400">
                      Sin poster
                    </div>
                  )}
                  <div className="line-clamp-2 min-h-[3rem] p-2 text-xs font-semibold text-zinc-100">
                    {item.title || item.name}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {animationDone ? (
            <motion.div
              className="mt-5 rounded-2xl border border-amber-300/35 bg-zinc-900/70 px-4 py-3"
              initial={{
                boxShadow: '0 0 0 rgba(251,191,36,0)',
              }}
              animate={{
                boxShadow: '0 0 16px rgba(251,191,36,0.28), 0 0 30px rgba(249,115,22,0.18)',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Resultado final
              </p>
              <h4 className="text-xl font-semibold text-amber-100">
                {pick.title || pick.name}
              </h4>
            </motion.div>
          ) : (
            <div className="mt-5 rounded-2xl border border-zinc-700/40 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-500">
              Resolviendo resultado...
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
