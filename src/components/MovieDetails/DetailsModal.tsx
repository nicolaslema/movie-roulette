import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { fetchContentDetails } from '../../services/tmdbService';
import type { MovieOrSeries, TMDBVideo } from '../../types/MovieTypes';

type Props = {
  item: MovieOrSeries;
  onClose: () => void;
};

function resolveRuntimeLabel(item: { media_type: 'movie' | 'tv'; runtime?: number; episode_run_time?: number[] }) {
  const minutes = item.media_type === 'tv' ? item.episode_run_time?.[0] : item.runtime;
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${rest}m` : `${rest} min`;
}

function pickTrailer(videos: TMDBVideo[] = []): TMDBVideo | null {
  const youtube = videos.filter((video) => video.site === 'YouTube');
  return (
    youtube.find((video) => video.type === 'Trailer') ||
    youtube.find((video) => video.type === 'Teaser') ||
    youtube[0] ||
    null
  );
}

export default function DetailsModal({ item, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const detailQuery = useQuery({
    queryKey: ['details-modal', item.id, item.media_type ?? (item.name ? 'tv' : 'movie')],
    queryFn: () => fetchContentDetails(item),
    staleTime: 1000 * 60 * 5,
  });

  const detail = detailQuery.data;
  const title = detail?.title || detail?.name || item.title || item.name || 'Titulo sin nombre';
  const overview = detail?.overview || item.overview || 'No hay sinopsis disponible.';
  const releaseDate = detail?.release_date || detail?.first_air_date || item.release_date || item.first_air_date || 'Sin fecha';
  const rating = (detail?.vote_average ?? item.vote_average ?? 0).toFixed(1);
  const runtimeLabel = detail ? resolveRuntimeLabel(detail) : 'N/A';
  const genreLabel = detail?.genres?.map((genre) => genre.name).join(', ') || 'Sin genero';
  const countryLabel = detail?.production_countries?.map((country) => country.name).join(', ') || 'Sin datos';
  const trailer = pickTrailer(detail?.videos?.results ?? []);

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={panelRef}
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-700/70 bg-[#0f131b] text-zinc-100 shadow-[0_35px_90px_-45px_rgba(0,0,0,1)]"
        initial={{ y: 16, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-[190px] sm:h-[250px]">
          {detail?.backdrop_path || item.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w1280${detail?.backdrop_path || item.backdrop_path}`}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f131b] via-[#0f131b]/55 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full border border-zinc-500/80 bg-black/70 text-xl text-zinc-100 transition hover:border-amber-300/60 hover:text-amber-200"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          {detailQuery.isLoading ? (
            <div className="space-y-3">
              <div className="h-8 w-1/2 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
              <div className="h-24 animate-pulse rounded bg-zinc-800" />
            </div>
          ) : detailQuery.isError ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-900/20 p-4 text-rose-100">
              No se pudo cargar el detalle. Intenta nuevamente.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <div>
                {detail?.poster_path || item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${detail?.poster_path || item.poster_path}`}
                    alt={title}
                    className="w-full rounded-xl border border-zinc-700/70"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-600 text-sm text-zinc-400">
                    Sin poster
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-100">{title}</h2>
                  {detail?.tagline ? <p className="mt-1 text-zinc-400">{detail.tagline}</p> : null}
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-100">Fecha: {releaseDate}</span>
                  <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-zinc-200">Duracion: {runtimeLabel}</span>
                  <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-zinc-200">Rating: {rating}</span>
                </div>

                <p className="leading-relaxed text-zinc-300">{overview}</p>

                <div className="grid gap-2 rounded-xl border border-zinc-700/70 bg-zinc-900/70 p-3 text-sm">
                  <p><span className="font-semibold text-zinc-100">Generos:</span> <span className="text-zinc-300">{genreLabel}</span></p>
                  <p><span className="font-semibold text-zinc-100">Paises:</span> <span className="text-zinc-300">{countryLabel}</span></p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-100">Trailer</h3>
                  {trailer ? (
                    <div className="aspect-video overflow-hidden rounded-xl border border-zinc-700/70">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={trailer.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/80 p-4 text-sm text-zinc-400">
                      No hay trailer disponible para este titulo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}
