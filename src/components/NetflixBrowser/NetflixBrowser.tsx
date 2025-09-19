import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RandomPickModal from './RandomPickModal';
import { useNetflixBrowserState } from '../../hooks/useNetflixBrowserState';
import { useRef, useEffect, useCallback } from 'react';
import HeaderControls from './HeaderControls';
import ScrambledTitle from '../animatedVisuals/ScrambleTitle';
import { FaAngleDoubleDown } from "react-icons/fa";



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
    <div className="bg-gradient-to-t from-neutral-950/90 from-50% to-zinc-900/60 text-white shadow-lg oxanium-uniquifier px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="min-h-screen py-8 text-zinc-50 relative transition-colors duration-500 z-2">
        <div className="z-20">
        
          <div className='mt-8 mb-16 h-[75vh]'>
            <ScrambledTitle/>
          {/* Header Controls */}
        <HeaderControls state={state}/>
          <div className='flex-col flex justify-center items-center mt-24'><h1 className='text-2xl'>View all</h1> <span><FaAngleDoubleDown/></span></div>
          
          </div>
 
          {/* Content */}
          <ContentGrid
            items={filteredContent}
            selectedItems={state.selectedItems}
            toggleSelection={state.toggleSelection}
            />

            {/* Random Pick modal */}
          <RandomPickModal pick={state.randomPick} onClose={() => state.setRandomPick(null)} />

            {/* Selected item List */}
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
