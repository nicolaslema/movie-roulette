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
    fetchContent(contentType, page, searchQuery, selectedGenre).then(({ results, totalPages }) => {
      setContentList(results);
      setTotalPages(totalPages);
    });
  }, [isTV, selectedGenre, searchQuery, page]);

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
    contentType,
    trailerUrl, // 👈 exportamos el trailer
  };
}