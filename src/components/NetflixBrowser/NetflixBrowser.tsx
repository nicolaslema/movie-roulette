import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RandomPickModal from './RandomPickModal';
import { useNetflixBrowserState } from '../../hooks/useNetflixBrowserState';
import { useRef, useEffect, useCallback } from 'react';

export default function NetflixBrowser() {
  const state = useNetflixBrowserState();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 🔍 Filtrar por rating mínimo
  const filteredContent = state.contentList.filter(
    (item) => (item.vote_average ?? 0) >= state.minRating
  );

  // 🧠 Scroll infinito con IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && state.hasNextPage && !state.isFetchingNextPage) {
        state.fetchNextPage();
      }
    },
    [state.hasNextPage, state.isFetchingNextPage, state.fetchNextPage]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: '200px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="bg-gradient-to-t from-neutral-950/90 to-red-900/60 text-white shadow-lg oxanium-uniquifier px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="min-h-screen py-8 text-zinc-50 relative transition-colors duration-500 z-2">
        <div className="z-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center font-bold mb-10 tracking-tight major-mono-display-regular">
            Movie Roulette
          </h1>

          {/* Header Controls */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between w-full mb-6">
            <SearchBar
              query={state.searchQuery}
              onChange={state.setSearchQuery}
              onSubmit={state.handleSearch}
            />

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition ${
                  state.isTV
                    ? 'bg-neutral-800/80 hover:bg-neutral-900/90 border border-zinc-500/30'
                    : 'bg-neutral-900/80 hover:bg-neutral-800/90 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => state.handleTypeChange('movie')}
                disabled={!state.isTV}
              >
                Películas
              </button>
              <button
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition ${
                  state.isTV
                    ? 'bg-gray-800/80 opacity-60 cursor-not-allowed border border-zinc-500/30'
                    : 'bg-neutral-900/80 hover:bg-neutral-800/80 border border-zinc-500/30'
                }`}
                onClick={() => state.handleTypeChange('tv')}
                disabled={state.isTV}
              >
                Series
              </button>
            </div>
          </div>

          {!state.searchQuery && (
            <GenreSelector
              genres={state.genres}
              selectedGenre={state.selectedGenre}
              onChange={state.handleGenreChange}
            />
          )}

          <ContentGrid
            items={filteredContent}
            selectedItems={state.selectedItems}
            toggleSelection={state.toggleSelection}
          />

          <RandomPickModal pick={state.randomPick} onClose={() => state.setRandomPick(null)} />

          {state.selectedItems.length > 0 && (
            <SelectedList
              items={state.selectedItems}
              onRemove={(id) =>
                state.setSelectedItems(state.selectedItems.filter((i) => i.id !== id))
              }
              onClear={() => state.setSelectedItems([])}
              onPickRandom={state.pickRandomFromSelection}
            />
          )}

          {/* Loader para scroll infinito */}
          <div ref={loaderRef} className="py-8 text-center text-gray-400">
            {state.hasNextPage ? 'Cargando más...' : 'No hay más resultados'}
          </div>
        </div>
      </div>
    </div>
  );
}
