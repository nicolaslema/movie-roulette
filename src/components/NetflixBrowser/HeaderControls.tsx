// components/NetflixBrowser/HeaderControls.tsx
import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import type { Genre } from '../../types/MovieTypes';

interface Props {
  isTV: boolean;
  onTypeChange: (type: 'movie' | 'tv') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  genres: Genre[];
  selectedGenre: number | null;
  onGenreChange: (id: number | null) => void;
}

export default function HeaderControls({
  isTV,
  onTypeChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  genres,
  selectedGenre,
  onGenreChange,
}: Props) {
  return (
    <>
      <div className="mb-6 flex gap-3 z-10">
        <button
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            isTV ? 'bg-indigo-600 hover:bg-indigo-700/30' : 'bg-gray-800 opacity-60 cursor-not-allowed'
          }`}
          onClick={() => onTypeChange('movie')}
          disabled={!isTV}
        >
          Películas
        </button>
        <button
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            isTV ? 'bg-gray-800 opacity-60 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700/30'
          }`}
          onClick={() => onTypeChange('tv')}
          disabled={isTV}
        >
          Series
        </button>
      </div>

      <div className="mb-6">
        <SearchBar query={searchQuery} onChange={onSearchChange} onSubmit={onSearchSubmit} />
      </div>

      {!searchQuery && (
        <div className="mb-6">
          <GenreSelector
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={onGenreChange}
          />
        </div>
      )}
    </>
  );
}