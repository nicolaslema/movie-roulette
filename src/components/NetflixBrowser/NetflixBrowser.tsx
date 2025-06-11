import { useEffect, useState } from 'react';
import { fetchGenres, fetchContent } from '../../services/tmdbService';
import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import ContentGrid from '../ContentGrid/ContentGrid';
import SelectedList from '../SelectedList/SelectedList';
import RatingFilter from '../RatingFilter/RatingFilter';

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
    <div 
    >
      <h2>{isTV ? 'Series' : 'Películas'} en Netflix Argentina</h2>

      <div >
        <button style={{marginRight: '1rem'}} onClick={() => handleTypeChange('movie')} disabled={!isTV}>
          Películas
        </button>
        <button onClick={() => handleTypeChange('tv')} disabled={isTV}>
          Series
        </button>
      </div>

      <div style={{padding: '1rem'}}><SearchBar query={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} /></div>

   <div style={{padding: '1rem'}}>
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
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Tu elección aleatoria:</h3>
          <h4>{randomPick.title || randomPick.name}</h4>
          {randomPick.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${randomPick.poster_path}`}
              alt={randomPick.title || randomPick.name}
              style={{ borderRadius: '8px' }}
            />
          )}
        </div>
      )}

      {selectedItems.length > 0 && (
        <>
          <SelectedList
            items={selectedItems}
            onRemove={(id) => setSelectedItems(selectedItems.filter((i) => i.id !== id))}
            onClear={() => setSelectedItems([])}
          />

          <div style={{ marginTop: '1rem' }}>
            <button onClick={pickRandomFromSelection}>
              🎲 Seleccionar aleatoriamente ({selectedItems.length} seleccionadas)
            </button>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            ← Anterior
          </button>
          <span style={{ margin: '0 1rem' }}>
            Página {page} de {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
