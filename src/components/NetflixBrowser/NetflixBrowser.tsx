import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RatingFilter from '../RatingFilter/RatingFilter';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';
import { useNetflixBrowserState } from '../../hooks/useNetflixBrowserState';
import PaginationControls from './PaginationControls';
import RandomPickModal from './RandomPickModal';

export default function NetflixBrowser() {
  const state = useNetflixBrowserState();
  const filteredContent = state.contentList.filter(item => (item.vote_average ?? 0) >= state.minRating);

  return (
   <div className=" bg-slate-800/30 text-white rounded-xl shadow-lg  oxanium-uniquifier ">
      <div className="min-h-screen px-4 py-12 text-zinc-50 relative transition-colors duration-500 z-2">
        <AnimatedBackground darkMode={true} />
        <div className="z-20">
          <h1 className="text-6xl font-bold mb-12 tracking-tight z-10 oxanium-uniquifier ">Movie Roulette </h1>

          {/* Header Controls */}
          <div className="flex-col md:flex gap-4 z-10 justify-between items-center w-full h-full p-4">
           <div className='md:flex flex gap-4 justify-center items-center '> <button
              className={`px-2 py-2 rounded-lg text-sm font-semibold transition w-[100%]  ${
                state.isTV ? 'bg-slate-700/30 hover:bg-indigo-700 border border-zinc-500/30' : 'bg-gray-800/30 border border-zinc-500/30 opacity-60 cursor-not-allowed'
              }`}
              onClick={() => state.handleTypeChange('movie')}
              disabled={!state.isTV}
            >
              Películas
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition w-[100%] ${
                state.isTV ? 'bg-gray-800/30 opacity-60 cursor-not-allowed border border-zinc-500/30' : 'bg-slate-700/30 hover:bg-indigo-700 border border-zinc-500/30'
              }`}
              onClick={() => state.handleTypeChange('tv')}
              disabled={state.isTV}
            >
              Series
            </button>
            </div>
          {!state.searchQuery && (
            <div className="flex md:flex-col mt-2 mb-2 ">
              <GenreSelector
                genres={state.genres}
                selectedGenre={state.selectedGenre}
                onChange={state.setSelectedGenre}
              />
            </div>
          )}
          <div className="w-full">
            <SearchBar query={state.searchQuery} onChange={state.setSearchQuery} onSubmit={state.handleSearch} />
          </div>
          </div>


          <RatingFilter minRating={state.minRating} onChange={state.setMinRating} />

          <ContentGrid
            items={filteredContent}
            selectedItems={state.selectedItems}
            toggleSelection={state.toggleSelection}
          />

          <RandomPickModal pick={state.randomPick} onClose={() => state.setRandomPick(null)} />

          {state.selectedItems.length > 0 && (
            <div className="pointer-events-auto">
              <SelectedList
              items={state.selectedItems}
              onRemove={(id) => state.setSelectedItems(state.selectedItems.filter((i) => i.id !== id))}
              onClear={() => state.setSelectedItems([])}
              onPickRandom={state.pickRandomFromSelection}
              />
            </div>
          )}

          {state.totalPages > 1 && (
            <PaginationControls
              page={state.page}
              totalPages={state.totalPages}
              onPrev={() => state.setPage((p) => Math.max(p - 1, 1))}
              onNext={() => state.setPage((p) => Math.min(p + 1, state.totalPages))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
