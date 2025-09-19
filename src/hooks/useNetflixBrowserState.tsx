import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchGenres, fetchContent, getTrailerUrl } from '../services/tmdbService';
import type { MovieOrSeries } from '../types/MovieTypes';
export type ReturnTypeOfUseNetflixBrowserState = ReturnType<typeof useNetflixBrowserState>;

export function useNetflixBrowserState() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isTV, setIsTV] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [randomPick, setRandomPick] = useState<MovieOrSeries | null>(null);
  const [selectedItems, setSelectedItems] = useState<MovieOrSeries[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const contentType: 'movie' | 'tv' = isTV ? 'tv' : 'movie';
  

  // 🔍 Fetch de géneros
  const { data: genres = [] } = useQuery({
    queryKey: ['genres', contentType],
    queryFn: () => fetchGenres(contentType),
    staleTime: 1000 * 60 * 10,
  });

  // 🎬 Scroll infinito de contenido
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['content', contentType, searchQuery, selectedGenre],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      fetchContent(contentType, pageParam as number, searchQuery, selectedGenre),
    getNextPageParam: (lastPage: { totalPages: number }, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  const contentList =
    data?.pages.flatMap((page) => page.results) ?? [];

  const totalPages = data?.pages[0]?.totalPages ?? 1;

  // 🎥 Trailer del item seleccionado
  const { data: trailerUrl } = useQuery({
    queryKey: ['trailer', randomPick?.id],
    queryFn: () => getTrailerUrl(randomPick!),
    enabled: !!randomPick,
  });

  // ✅ Acciones
  const toggleSelection = (item: MovieOrSeries) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    setSelectedItems(
      exists
        ? selectedItems.filter((i) => i.id !== item.id)
        : [...selectedItems, item]
    );
  };

  const pickRandomFromSelection = () => {
    if (selectedItems.length === 0) return;
    const randomItem =
      selectedItems[Math.floor(Math.random() * selectedItems.length)];
    setRandomPick(randomItem);
  };

  const resetContent = () => {
    setRandomPick(null);
    refetch(); 
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetContent();
  };

  const handleTypeChange = (type: 'movie' | 'tv') => {
    setIsTV(type === 'tv');
    setSelectedGenre(null);
    setSearchQuery('');
    resetContent();
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    resetContent();
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalPages,
    resetContent,
  };
}
