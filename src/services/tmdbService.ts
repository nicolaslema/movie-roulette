// src/services/tmdbService.ts

import { type MovieOrSeries } from "../types/MovieTypes";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'es';
const REGION = 'AR';
const PROVIDER_ID = 8; // Netflix



export const fetchGenres = async (type: 'movie' | 'tv') => {
  const response = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=${LANGUAGE}`);
  const data = await response.json();
  return data.genres;
};

export async function getTrailerUrl(item: MovieOrSeries): Promise<string | null> {
  const { id, media_type } = item;
  const type = media_type || 'movie'; // fallback por si falta

  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  const trailer = data.results.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}


export const getMovies = async (  searchQuery: string,  type: 'movie' | 'tv',)=>{
    const baseParams = `api_key=${API_KEY}&language=${LANGUAGE}`;

  let url = '';
  if (searchQuery.trim()) {
    url = `${BASE_URL}/search/${type}?${baseParams}&query=${encodeURIComponent(searchQuery)}`;
  } else {
    url = `${BASE_URL}/discover/${type}?${baseParams}&with_watch_providers=${PROVIDER_ID}&watch_region=${REGION}&sort_by=popularity.desc`;

  }

  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results
  };
}



export const fetchContent = async (
  type: 'movie' | 'tv',
  page: number,
  searchQuery: string,
  genreId: number | null
) => {
  const baseParams = `api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`;

  let url = '';
  if (searchQuery.trim()) {
    url = `${BASE_URL}/search/${type}?${baseParams}&query=${encodeURIComponent(searchQuery)}`;
  } else {
    url = `${BASE_URL}/discover/${type}?${baseParams}&with_watch_providers=${PROVIDER_ID}&watch_region=${REGION}&sort_by=popularity.desc`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
  }

  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results,
    totalPages: data.total_pages > 500 ? 500 : data.total_pages,
  };
};