import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type MovieOrSeries } from '../../types/MovieTypes';

interface Props {
  item: MovieOrSeries;
  onClose: () => void;
}

export default function MovieDetailModal({ item, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleWatchTrailer = async () => {
    if (!item.id) return;
    const type = item.media_type || 'movie';

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      } else {
        setTrailerKey(null);
        setShowTrailer(false);
      }
    } catch (error) {
      console.error('Error al cargar el trailer:', error);
      setTrailerKey(null);
      setShowTrailer(false);
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-screen-lg h-[90vh] scrollbar overflow-y-auto bg-neutral-900 text-white rounded-t-xl shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-6 text-white bg-neutral-900/30 rounded-full w-8 h-8 text-3xl hover:text-red-500 transition z-10"
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <div className="flex flex-col">
              {item.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="w-full h-130 rounded-t-xl"
                />
              )}

              <div className="p-6">
                <h2 className="text-3xl font-bold mb-2">{item.title || item.name}</h2>
                <p className="mb-1 text-sm text-gray-300">
                  <strong>Fecha:</strong> {item.release_date || item.first_air_date}
                </p>
                <p className="mb-1 text-sm text-gray-300">
                  <strong>Rating:</strong> ⭐ {item.vote_average}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-200">{item.overview}</p>

                {!showTrailer && (
                  <button
                    onClick={handleWatchTrailer}
                    className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    🎬 Watch Trailer
                  </button>
                )}

                {showTrailer && trailerKey && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">🎬 Trailer</h3>
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        title="Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}