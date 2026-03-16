import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaInfoCircle, FaStar } from 'react-icons/fa';
import type { MovieOrSeries } from '../../types/MovieTypes';
import DetailsModal from '../MovieDetails/DetailsModal';

type Props = {
  items: MovieOrSeries[];
  selectedItems: MovieOrSeries[];
  toggleSelection: (item: MovieOrSeries) => void;
  isFetchingMore?: boolean;
};

export default function ContentGrid({
  items,
  selectedItems,
  toggleSelection,
  isFetchingMore = false,
}: Props) {
  const [selectedDetail, setSelectedDetail] = useState<MovieOrSeries | null>(null);

  return (
    <div className="relative mt-3">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-zinc-600 bg-zinc-900/70 p-10 text-center text-zinc-400">
            No hay resultados para los filtros actuales.
          </p>
        ) : (
          items.map((item, index) => {
            const isSelected = selectedItems.some((i) => i.id === item.id);

            return (
              <motion.article
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`group overflow-hidden rounded-3xl border bg-zinc-900/85 shadow-[0_14px_35px_-22px_rgba(0,0,0,0.9)] ${
                  isSelected
                    ? 'border-amber-300/50 ring-2 ring-amber-300/35'
                    : 'border-zinc-700/70'
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-800 text-sm text-zinc-400">
                      Sin poster
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full border border-zinc-700/80 bg-black/70 px-2 py-1 text-xs font-semibold text-zinc-100 shadow-sm">
                    <span className="inline-flex items-center gap-1">
                      <FaStar className="text-amber-400" />
                      {(item.vote_average ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  <h4 className="line-clamp-2 min-h-[3rem] text-sm font-semibold text-zinc-100">
                    {item.title || item.name}
                  </h4>

                  <div className="grid gap-2">
                    <motion.button
                      onClick={() => toggleSelection(item)}
                      whileTap={{ scale: 0.96 }}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isSelected
                          ? 'bg-[#513126] text-amber-100 hover:bg-[#6c3f31]'
                          : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                      }`}
                    >
                      {isSelected ? <FaMinus /> : <FaPlus />}
                      {isSelected ? 'Quitar' : 'Guardar'}
                    </motion.button>

                    <motion.button
                      onClick={() => setSelectedDetail(item)}
                      whileTap={{ scale: 0.96 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-600/70 bg-black/40 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:border-amber-300/35 hover:text-amber-200"
                    >
                      <FaInfoCircle />
                      Detalles
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}

        {isFetchingMore &&
          Array.from({ length: 5 }).map((_, idx) => (
            <motion.div
              key={`loading-skeleton-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.08 }}
              className="overflow-hidden rounded-3xl border border-zinc-700/60 bg-zinc-900/70"
            >
              <div className="aspect-[3/4] bg-zinc-800/80" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-4/5 rounded bg-zinc-700/70" />
                <div className="h-4 w-3/5 rounded bg-zinc-700/60" />
                <div className="mt-3 h-9 rounded-xl bg-zinc-800/80" />
              </div>
            </motion.div>
          ))}
      </div>

      {selectedDetail && (
        <DetailsModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}
