import { useEffect, useState } from 'react';
import { fetchGenres, fetchContent } from '../../services/tmdbService';
import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RatingFilter from '../RatingFilter/RatingFilter';
import { motion, AnimatePresence } from 'framer-motion';


export type Genre = {
  id: number;
  name: string;
};

export type MovieOrSeries = {
  id: number;
  name?: string;
  title?: string;
  poster_path: string;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

export default function NetflixBrowser() {
  const [contentList, setContentList] = useState<MovieOrSeries[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isTV, setIsTV] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [randomPick, setRandomPick] = useState<MovieOrSeries | null>(null);
  const [selectedItems, setSelectedItems] = useState<MovieOrSeries[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  const contentType = isTV ? 'tv' : 'movie';

  const toggleSelection = (item: MovieOrSeries) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const pickRandomFromSelection = () => {
    if (selectedItems.length === 0) return;
    const randomItem = selectedItems[Math.floor(Math.random() * selectedItems.length)];
    setRandomPick(randomItem);
  };

  useEffect(() => {
    fetchGenres(contentType).then(setGenres);
  }, [contentType]);

  useEffect(() => {
    fetchContent(contentType, page, searchQuery, selectedGenre).then(({ results, totalPages }) => {
      setContentList(results);
      setTotalPages(totalPages);
    });
  }, [isTV, selectedGenre, searchQuery, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTypeChange = (type: 'movie' | 'tv') => {
    setIsTV(type === 'tv');
    setSelectedGenre(null);
    setPage(1);
    setSearchQuery('');
  };

  return (
  <div className="p-6 bg-slate-800/30 text-white rounded-xl shadow-lg">
  <h2 className="text-4xl font-bold mb-6 tracking-tight">🎥 Movie Roulette</h2>

  <div className="mb-6 flex gap-3">
    <button
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
        isTV ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 opacity-60 cursor-not-allowed'
      }`}
      onClick={() => handleTypeChange('movie')}
      disabled={!isTV}
    >
      Películas
    </button>
    <button
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
        isTV ? 'bg-gray-800 opacity-60 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
      onClick={() => handleTypeChange('tv')}
      disabled={isTV}
    >
      Series
    </button>
  </div>

  <div className="mb-6">
    <SearchBar query={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} />
  </div>

  <div className="mb-6">
    {!searchQuery && (
      <GenreSelector
        genres={genres}
        selectedGenre={selectedGenre}
        onChange={setSelectedGenre}
      />
    )}
  </div>

  <RatingFilter minRating={minRating} onChange={setMinRating} />

  <ContentGrid
    items={contentList.filter(item => (item.vote_average ?? 0) >= minRating)}
    selectedItems={selectedItems}
    toggleSelection={toggleSelection}
  />

  {randomPick && (
        <AnimatePresence>
      {randomPick && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-md w-full p-6 bg-slate-900 border border-gray-700 rounded-xl text-white shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h3 className="text-2xl font-semibold mb-2">🎲 Tu elección aleatoria:</h3>
            <h4 className="text-lg mb-3">{randomPick.title || randomPick.name}</h4>

            {randomPick.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${randomPick.poster_path}`}
                alt={randomPick.title || randomPick.name}
                className="rounded-lg mb-4 w-full max-w-[300px] mx-auto"
              />
            )}

            <button
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              onClick={() => setRandomPick(null)}
            >
              Borrar elección
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

  )}

  {selectedItems.length > 0 && (
    <>
      <SelectedList
        items={selectedItems}
        onRemove={(id) => setSelectedItems(selectedItems.filter((i) => i.id !== id))}
        onClear={() => setSelectedItems([])}
      />

      <div className="mt-6">
        <button
          onClick={pickRandomFromSelection}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          🎲 Seleccionar aleatoriamente ({selectedItems.length} seleccionadas)
        </button>
      </div>
    </>
  )}

  {totalPages > 1 && (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 transition"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        ← Anterior
      </button>
      <span className="text-sm">Página {page} de {totalPages}</span>
      <button
        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 transition"
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
      >
        Siguiente →
      </button>
    </div>
  )}
</div>


  );
}
