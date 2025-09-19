// src/components/HeaderControls/HeaderControls.tsx
import { FaFilm, FaTv } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import type { ReturnTypeOfUseNetflixBrowserState } from '../../hooks/useNetflixBrowserState';

type Props = {
  state: ReturnTypeOfUseNetflixBrowserState;
};

export default function HeaderControls({ state }: Props) {
  return (
    <div className="w-full mb-10 rounded-xl bg-gradient-to-br from-zinc-900/30 via-zinc-950/30 to-zinc/30 border border-zinc-700/40 shadow-lg p-6 flex flex-col gap-6 md:gap-8">
      {/* Search */}
      <div className="w-full">
        <SearchBar
          query={state.searchQuery}
          onChange={state.setSearchQuery}
          onSubmit={state.handleSearch}
        />
      </div>

      {/* Type Switch */}
      <div className="flex flex-wrap items-center justify-start gap-4">
        <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Tipo de contenido:
        </span>

        <button
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
            state.isTV
              ? 'bg-neutral-800/80 hover:bg-neutral-900/90 text-white border border-zinc-500/30'
              : 'bg-neutral-900/80 opacity-60 cursor-not-allowed text-zinc-400'
          }`}
          onClick={() => state.handleTypeChange('movie')}
          disabled={!state.isTV}
        >
          <FaFilm className="text-red-400" />
          Películas
        </button>

        <button
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
            state.isTV
              ? 'bg-gray-800/80 opacity-60 cursor-not-allowed text-zinc-400'
              : 'bg-neutral-900/80 hover:bg-neutral-800/80 text-white border border-zinc-500/30'
          }`}
          onClick={() => state.handleTypeChange('tv')}
          disabled={state.isTV}
        >
          <FaTv className="text-blue-400" />
          Series
        </button>
      </div>

      {/* Genre Selector */}
      {!state.searchQuery && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wide">
            <MdFilterList className="text-green-400" />
            Filtro por género:
          </div>
          <GenreSelector
            genres={state.genres}
            selectedGenre={state.selectedGenre}
            onChange={state.handleGenreChange}
          />
        </div>
      )}
    </div>
  );
}