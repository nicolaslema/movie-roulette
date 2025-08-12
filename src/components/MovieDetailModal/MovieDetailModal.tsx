import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type MovieOrSeries } from '../../types/MovieTypes';

interface Props {
  item: MovieOrSeries;
  onClose: () => void;
}

export default function MovieDetailModal({ item, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cierre al hacer click fuera del modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl "
       initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}

        >
          <motion.div
            ref={modalRef}
            className="relative w-[100%] max-w-3xl bg-[#181818] text-white rounded-xl p-6 shadow-2xl"
          initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
  animate={{ rotate: 0, scale: 1, opacity: 1 }}
  exit={{ rotate: 10, scale: 0.8, opacity: 0 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 20,
    duration: 0.6,
  }}

          >
            <button
              onClick={onClose}
              className="absolute top-0 right-1 text-white text-2xl hover:text-red-400 transition "
              aria-label="Cerrar modal"
            >
              ×
            </button>

            {item.backdrop_path && (
              <img
                src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
                alt={item.title || item.name}
                className="w-full rounded-lg mb-2"
              />
            )}

            <h2 className="text-2xl font-semibold mb-2">{item.title || item.name}</h2>
            <p className="mb-1">
              <strong>Rating:</strong> ⭐ {item.vote_average}
            </p>
            <p className="mb-1">
              <strong>Fecha:</strong> {item.release_date || item.first_air_date}
            </p>
            <p className="mt-4 text-sm leading-relaxed">{item.overview}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
