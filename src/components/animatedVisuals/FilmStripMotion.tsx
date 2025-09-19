import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

type Props = {
  movies: Movie[];
};

export default function FilmStripByGenre({ movies }: Props) {
  const loopedMovies = [...movies, ...movies, ...movies];
  const [waveIndex, setWaveIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveIndex((prev) => (prev + 1) % loopedMovies.length);
    }, 100); // ⏱️ velocidad de barrido

    return () => clearInterval(interval);
  }, [loopedMovies.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-zinc-700/30 bg-neutral-900 flex items-center justify-center">
      <motion.div
        className="flex gap-4 px-4"
        initial={{ x: 0 }}
        animate={{ x: '-33.333%' }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 40,
          ease: 'linear',
        }}
      >
        {loopedMovies.map((movie, index) => {
          const distance = Math.abs(index - waveIndex);
          const isNear = distance < 3; // afecta 3 tarjetas a la vez
          const opacity = isNear ? 1 - distance * 0.3 : 0;

          return (
            <motion.div
              key={`${movie.id}-${index}`}
              className="min-w-[8rem] h-80 bg-white border-4 border-white rounded-sm overflow-hidden relative"
            >
              <motion.img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {opacity < 0.1 && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 text-xs font-mono text-center px-2">
                  {/* {movie.title} */}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}