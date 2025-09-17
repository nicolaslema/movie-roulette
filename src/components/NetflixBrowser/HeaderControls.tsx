import { motion } from 'framer-motion';
import { FaFilm, FaTv, FaSearch, FaTags } from 'react-icons/fa';
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 z-10"
    >
      {/* Navegación de tipo */}
      <div className="flex gap-4 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onTypeChange('movie')}
          disabled={!isTV}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition transform-gpu ${
            isTV
              ? 'bg-red-600/30 hover:bg-red-700/40 text-white'
              : 'bg-neutral-700/50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FaFilm />
          Películas
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onTypeChange('tv')}
          disabled={isTV}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition transform-gpu ${
            isTV
              ? 'bg-neutral-700/30 text-gray-400 cursor-not-allowed'
              : 'bg-red-600/50 hover:bg-red-700/40 text-white'
          }`}
        >
          <FaTv />
          Series
        </motion.button>
      </div>

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 bg-neutral-800/40 px-4 py-2 rounded-lg shadow-md">
          <FaSearch className="text-white opacity-70" />
          <SearchBar query={searchQuery} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        </div>
      </motion.div>

      {/* Selector de géneros */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 bg-neutral-800/40 px-4 py-2 rounded-lg shadow-md">
            <FaTags className="text-white opacity-70" />
            <GenreSelector
              genres={genres}
              selectedGenre={selectedGenre}
              onChange={onGenreChange}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
