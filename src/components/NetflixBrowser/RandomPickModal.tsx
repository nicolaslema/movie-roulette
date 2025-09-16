import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MovieOrSeries } from '../../types/MovieTypes';

interface Props {
  pick: MovieOrSeries | null;
  onClose: () => void;
}

export default function RandomPickModal({ pick, onClose }: Props) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!pick) return;

      const type = pick.media_type || 'movie'; // fallback
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${pick.id}/videos?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        } else {
          setTrailerUrl(null);
        }
      } catch (error) {
        console.error('Error al obtener el trailer:', error);
        setTrailerUrl(null);
      }
    };

    fetchTrailer();
  }, [pick]);

  if (!pick) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="max-w-md w-full p-6 bg-slate-900 border border-gray-700 rounded-xl text-white shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <h3 className="text-2xl font-semibold mb-2">🎲 Tu elección aleatoria:</h3>
          <h4 className="text-lg mb-3">{pick.title || pick.name}</h4>

          {pick.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${pick.poster_path}`}
              alt={pick.title || pick.name}
              className="rounded-lg mb-4 w-full max-w-[300px] mx-auto"
            />
          )}

          {trailerUrl && (
            <div className="mb-4">
              <h5 className="text-md font-semibold mb-2">🎬 Trailer</h5>
              <div className="aspect-video">
                <iframe
                  src={trailerUrl}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          )}

          <button
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            onClick={onClose}
          >
            Borrar elección
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
