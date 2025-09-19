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
    <div className="relative mt-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 ">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full"></p>
        ) : (
          items.map((item, index) => {
            const isSelected = selectedItems.some((i) => i.id === item.id);

            return (
            <motion.div
  key={`${item.id}-${index}`}
  initial={{ opacity: 0, scale: 0.7 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{  }}
  transition={{ duration: 0.3 }}
  className={`relative rounded-xl overflow-hidden shadow-2xl transform-gpu min-h-[420px] group hover:shadow-neutral-200/10 ${
    isSelected ? 'border-2 shadow-neutral-100/10 border-red-900/30 ' : 'border border-neutral-700/30'
  }`}
>
  {/* Fondo con imagen */}
  {item.poster_path && (
    <img
      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
      alt={item.title || item.name}
      className="absolute inset-0 w-full h-full object-cover"
    />
  )}
  {/* Degradado superior + título */}
<div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black via-black/20 to-transparent z-10 px-4 pt-4 flex items-start">
  <div className="absolute top-0 left-0 w-full mt-8 px-4 pb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
  <h4 className="text-white text-xl font-semibold drop-shadow-md truncate ">
    {item.title || item.name}
  </h4>
</div>
</div>

  {/* Título al hacer hover */}



  {/* Degradado + botones */}
  <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black from-20% via-black/60 to-transparent px-4 py-4 flex flex-col gap-2 justify-end">
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
