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
    }, 200);

    return () => clearInterval(interval);
  }, [loopedMovies.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-zinc-700/30 bg-neutral-900 flex items-center justify-center">
      {/* Viñeta izquierda */}
      <div className="absolute left-0 top-0 h-full w-34 pointer-events-none z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      {/* Viñeta derecha */}
      <div className="absolute right-0 top-0 h-full w-34 pointer-events-none z-10 bg-gradient-to-l from-black/80 via-transparent to-transparent" />

      <div className="flex gap-4 px-4">
        {loopedMovies.map((movie, index) => {
          const distance = Math.abs(index - waveIndex);
        
          const opacity = 1 - distance * 0.3;

          return (
            <div key={`${movie.id}-${index}`} className="w-20 h-36 flex items-center justify-center z-40">
              {/* Triángulo SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-16 h-16"
                style={{ opacity }}
              >
                <polygon points="50,0 100,100 0,100" fill="#ffffff" stroke="#555" strokeWidth="4" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}