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
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setWaveIndex((prev) => (prev + 1) % loopedMovies.length);
    }, 200);

    return () => clearInterval(interval);
  }, [loopedMovies.length, isHovering]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-zinc-700/30 bg-neutral-900 flex items-center justify-center">
      {/* Viñeta izquierda */}
      <div className="absolute left-0 top-0 h-full w-34 pointer-events-none z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      {/* Viñeta derecha */}
      <div className="absolute right-0 top-0 h-full w-34 pointer-events-none z-10 bg-gradient-to-l from-black/80 via-transparent to-transparent" />

      <motion.div
        className="flex gap-4 px-4"
        initial={{ x: 0 }}
        animate={{ x: isHovering ? undefined : '-33.333%' }}
        transition={{
          repeat: isHovering ? 0 : Infinity,
          repeatType: 'loop',
          duration: 40,
          ease: 'linear',
        }}
      >
        {loopedMovies.map((movie, index) => {
          const isHovered = hoveredIndex === index;
          const distance = Math.abs(index - waveIndex);
          const isNear = distance < 4;
          const opacity = isHovered ? 1 : isNear ? 1 - distance * 0.3 : 0;

          return (
            <motion.div
              key={`${movie.id}-${index}`}
              className="min-w-[8rem] h-80 bg-white border-2 border-neutral-100 rounded-sm overflow-hidden relative"
              onMouseEnter={() => {
                setIsHovering(true);
                setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setHoveredIndex(null);
              }}
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