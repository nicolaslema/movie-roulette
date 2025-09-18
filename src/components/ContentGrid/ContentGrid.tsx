import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
import type { MovieOrSeries } from '../../types/MovieTypes';
import MovieDetailModal from '../MovieDetailModal/MovieDetailModal';

type Props = {
  items: MovieOrSeries[];
  selectedItems: MovieOrSeries[];
  toggleSelection: (item: MovieOrSeries) => void;
};

export default function ContentGrid({ items, selectedItems, toggleSelection }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<MovieOrSeries | null>(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 ">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full"></p>
        ) : (
          items.map((item, index) => {
            const isSelected = selectedItems.some((i) => i.id === item.id);

            return (
              <motion.div
              key={`${item.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col justify-between min-h-[420px] p-4 rounded-xl bg-gradient-to-br from-neutral-800/50 to-neutral-700/50 shadow-xl hover:shadow-2xl transform-gpu  ${
                  isSelected ? 'border-2 shadow-red-500/20 border-red-500/30' : 'border border-neutral-700/30'
                }`}
              >
                <h4 className="font-bold text-lg text-white mb-2 truncate">
                  {item.title || item.name}
                </h4>

                {item.poster_path && (
                  <motion.img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded-lg mb-4 object-cover w-full h-[280px]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                <div className="flex flex-col gap-2 mt-auto">
                  <motion.button
                    onClick={() => toggleSelection(item)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isSelected
                        ? 'bg-red-500/30 hover:bg-red-700/30 text-white'
                        : 'bg-neutral-900/30 hover:bg-green-700/30 text-white'
                    }`}
                  >
                    {isSelected ? <FaMinus /> : <FaPlus />}
                    {isSelected ? 'Quitar de la lista' : 'Agregar a mi lista'}
                  </motion.button>

                  <motion.button
                    onClick={() => setSelectedDetail(item)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-800/30 hover:bg-blue-700/50 text-white transition"
                  >
                    <FaInfoCircle />
                    Ver detalles
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {selectedDetail && (
        <MovieDetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}
