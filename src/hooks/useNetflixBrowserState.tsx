import { useEffect, useState } from 'react';
import { fetchGenres, fetchContent, getTrailerUrl } from '../services/tmdbService';
import type { MovieOrSeries, Genre } from '../types/MovieTypes';

export function useNetflixBrowserState() {
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
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null); // 👈 nuevo estado
  const contentType = isTV ? 'tv' : 'movie';

  useEffect(() => {
    fetchGenres(contentType).then(setGenres);
  }, [contentType]);
useEffect(() => {
  let isMounted = true;

  fetchContent(contentType, page, searchQuery, selectedGenre).then(({ results, totalPages }) => {
    if (!isMounted) return;

setContentList(prev => {
  if (page === 1) return results; // reemplaza si es primera página
  const merged = [...prev, ...results];
  return merged.filter((item, idx, self) => idx === self.findIndex(t => t.id === item.id));
});

    setTotalPages(totalPages);
  });

  return () => {
    isMounted = false;
  };
}, [contentType, selectedGenre, searchQuery, page]);

  const toggleSelection = (item: MovieOrSeries) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    setSelectedItems(exists ? selectedItems.filter((i) => i.id !== item.id) : [...selectedItems, item]);
  };

  const pickRandomFromSelection = async () => {
    if (selectedItems.length === 0) return;
    const randomItem = selectedItems[Math.floor(Math.random() * selectedItems.length)];
    setRandomPick(randomItem);

    // 👇 traer trailer
    try {
      const url = await getTrailerUrl(randomItem);
      setTrailerUrl(url);
      console.log(url)
    } catch (error) {
      console.error('Error al obtener el trailer:', error);
      setTrailerUrl(null);
    }
  };
  const resetContent = () => {
  setContentList([]);
  setPage(1);
  setTotalPages(1); 
};

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetContent()
  };

  const handleTypeChange = (type: 'movie' | 'tv') => {
   setIsTV(type === 'tv');
  setSelectedGenre(null);
  setSearchQuery('');
  resetContent(); // 👈 solo aquí
  };

  const handleGenreChange = (genreId: number | null) => {
   setSelectedGenre(genreId);
  resetContent(); // 🔥 con esto basta
};

  return {
    contentList,
    genres,
    selectedGenre,
    setSelectedGenre,
    isTV,
    setIsTV,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    randomPick,
    setRandomPick,
    selectedItems,
    setSelectedItems,
    minRating,
    setMinRating,
    toggleSelection,
    pickRandomFromSelection,
    handleSearch,
    handleTypeChange,
    handleGenreChange,
    contentType,
    trailerUrl,
    resetContent, // 👈 exportamos el trailer
  };
}