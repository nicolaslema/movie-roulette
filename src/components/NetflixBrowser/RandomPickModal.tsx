import { useEffect, useState } from 'react';
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
const VIEWPORT_WIDTH = 680;

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
  const [track, setTrack] = useState<MovieOrSeries[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (!pick) return;

    const { cards, targetIndex: nextTarget } = buildTrack(pool, pick);
    setTrack(cards);
    setTargetIndex(nextTarget);
    setXPos(0);
    setAnimationDone(false);

    const frame = requestAnimationFrame(() => {
      const center = nextTarget * STRIDE + CARD_WIDTH / 2;
      const end = -(center - VIEWPORT_WIDTH / 2);
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

          <div className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-zinc-700/60 bg-black/35 px-2 py-5">
            <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[calc(100%-1rem)] -translate-x-1/2 border-l-4 border-dashed border-amber-300" />

            <motion.div
              className="flex"
              animate={{ x: [0, xPos + 20, xPos] }}
              transition={{ duration: 6.2, ease: [0.05, 0.92, 0.14, 1], times: [0, 0.93, 1] }}
              onAnimationComplete={() => setAnimationDone(true)}
              style={{ gap: `${CARD_GAP}px` }}
            >
              {track.map((item, idx) => (
                <article
                  key={`${item.id}-${idx}`}
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
                </article>
              ))}
            </motion.div>
          </div>

          {animationDone ? (
            <div className="mt-5 rounded-2xl border border-zinc-700/60 bg-zinc-900/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Resultado final
              </p>
              <h4 className="text-xl font-semibold text-amber-100">{pick.title || pick.name}</h4>
            </div>
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
