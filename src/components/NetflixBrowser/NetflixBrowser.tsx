import { useRef, useEffect, useCallback } from 'react';
import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RandomPickModal from './RandomPickModal';
import { useNetflixBrowserState } from '../../hooks/useNetflixBrowserState';
import HeaderControls from './HeaderControls';
import ScrambledTitle from '../animatedVisuals/ScrambleTitle';
import { FaAngleDoubleDown, FaListUl } from 'react-icons/fa';

const FETCH_COOLDOWN_MS = 700;

export default function NetflixBrowser() {
  const state = useNetflixBrowserState();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const selectedListRef = useRef<HTMLDivElement | null>(null);
  const isLoadingLockRef = useRef(false);
  const wasIntersectingRef = useRef(false);
  const lastFetchAtRef = useRef(0);

  const {
    contentList,
    minRating,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = state;

  const filteredContent = contentList.filter(
    (item) => (item.vote_average ?? 0) >= minRating
  );

  const scrollToSelectedList = () => {
    if (!selectedListRef.current) return;
    selectedListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || isLoadingLockRef.current) return;

    const now = Date.now();
    if (now - lastFetchAtRef.current < FETCH_COOLDOWN_MS) return;

    isLoadingLockRef.current = true;
    lastFetchAtRef.current = now;

    try {
      await fetchNextPage();
    } finally {
      window.setTimeout(() => {
        isLoadingLockRef.current = false;
      }, 150);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (entry.isIntersecting && !wasIntersectingRef.current) {
        wasIntersectingRef.current = true;
        void loadNextPage();
      }

      if (!entry.isIntersecting) {
        wasIntersectingRef.current = false;
      }
    },
    [loadNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '260px 0px 260px 0px',
      threshold: 0.2,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  return (
    <div className="relative overflow-x-hidden px-4 pb-16 pt-8 sm:px-8 lg:px-14">
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#6d1d28]/45 blur-3xl" />
      <div className="pointer-events-none absolute top-28 right-0 h-96 w-96 rounded-full bg-[#7a5f1f]/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#1d2b5d]/35 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px]">
        <section className="relative z-[200] overflow-visible rounded-[2rem] border border-zinc-700/50 bg-zinc-900/55 px-5 py-8 shadow-[0_25px_75px_-42px_rgba(0,0,0,0.9)] backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-700/50 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/70">Movie Roulette Festival</p>
              <h2 className="text-sm text-zinc-300">
                Selecciona, curatoria y activa una eleccion aleatoria cinematica
              </h2>
            </div>
            <div className="rounded-full border border-amber-300/35 bg-zinc-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
              {state.isTV ? 'Modo Series' : 'Modo Peliculas'}
            </div>
          </div>

          <div className="mt-8 flex min-h-[220px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <ScrambledTitle targetText="Movie Roulette" />
              <p className="mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg">
                Explora catalogo, arma tu shortlist y deja que la ruleta decida el proximo titulo.
              </p>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Baja para ver cartelera</span>
              <FaAngleDoubleDown />
            </div>
          </div>

          <HeaderControls state={state} />
        </section>

        <div ref={selectedListRef} className="relative z-[20]">
          <SelectedList
            items={state.selectedItems}
            onRemove={(id) =>
              state.setSelectedItems(state.selectedItems.filter((i) => i.id !== id))
            }
            onClear={() => state.setSelectedItems([])}
            onPickRandom={state.pickRandomFromSelection}
          />
        </div>

        <section className="mt-10 rounded-[2rem] border border-zinc-700/50 bg-zinc-900/50 px-5 py-8 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.85)] backdrop-blur-md sm:px-8 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Cartelera</p>
              <h3 className="text-3xl font-semibold text-zinc-100">Panel de hallazgos</h3>
            </div>
            <p className="rounded-full border border-amber-300/20 bg-black/30 px-4 py-2 text-sm font-medium text-amber-100/90">
              {filteredContent.length} resultados visibles
            </p>
          </div>

          <ContentGrid
            items={filteredContent}
            selectedItems={state.selectedItems}
            toggleSelection={state.toggleSelection}
            isFetchingMore={state.isFetchingNextPage}
          />

          <div ref={loaderRef} className="pt-10 text-center text-sm font-medium text-zinc-400">
            {state.isFetchingNextPage
              ? 'Cargando mas titulos...'
              : state.hasNextPage
                ? 'Desliza para cargar la siguiente tanda'
                : 'Ya viste todo lo disponible por ahora'}
          </div>
        </section>

        <RandomPickModal
          pick={state.randomPick}
          pool={state.selectedItems}
          onClose={() => state.setRandomPick(null)}
        />
      </div>

      <button
        onClick={scrollToSelectedList}
        className="fixed bottom-5 right-5 z-[1000] inline-flex items-center gap-2 rounded-full border border-amber-300/45 bg-black/75 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-amber-100 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.9)] transition hover:bg-zinc-900"
      >
        <FaListUl />
        Ir a mi lista
      </button>
    </div>
  );
}
