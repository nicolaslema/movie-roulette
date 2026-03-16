// src/services/tmdbService.ts

import { type MovieOrSeries, type MovieOrSeriesDetails } from '../types/MovieTypes';

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

function resolveMediaType(item: MovieOrSeries): 'movie' | 'tv' {
  if (item.media_type === 'movie' || item.media_type === 'tv') return item.media_type;
  if (item.first_air_date && !item.release_date) return 'tv';
  if (item.name && !item.title) return 'tv';
  return 'movie';
}

export async function getTrailerUrl(item: MovieOrSeries): Promise<string | null> {
  const { id } = item;
  const type = resolveMediaType(item);

  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  const trailer = data.results.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

export async function fetchContentDetails(item: MovieOrSeries): Promise<MovieOrSeriesDetails> {
  const type = resolveMediaType(item);
  const detailUrl = `${BASE_URL}/${type}/${item.id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos`;
  const response = await fetch(detailUrl);

  if (!response.ok) {
    throw new Error(`TMDB detail fetch failed (${response.status})`);
  }

  const data = await response.json();
  return {
    ...data,
    media_type: type,
  };
}

export const fetchContent = async (
  type: 'movie' | 'tv',
  page: number,
  searchQuery: string,
  genreId: number | null,
  releaseDateFrom?: string,
  releaseDateTo?: string
) => {
  const baseParams = `api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`;
  let url = '';

  if (searchQuery.trim()) {
    url = `${BASE_URL}/search/${type}?${baseParams}&query=${encodeURIComponent(searchQuery)}`;
  } else {
    url = `${BASE_URL}/discover/${type}?${baseParams}&with_watch_providers=${PROVIDER_ID}&watch_region=${REGION}&sort_by=popularity.desc`;
    if (genreId) url += `&with_genres=${genreId}`;
    if (releaseDateFrom) {
      url += type === 'movie'
        ? `&primary_release_date.gte=${releaseDateFrom}`
        : `&first_air_date.gte=${releaseDateFrom}`;
    }
    if (releaseDateTo) {
      url += type === 'movie'
        ? `&primary_release_date.lte=${releaseDateTo}`
        : `&first_air_date.lte=${releaseDateTo}`;
    }
  }

  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results,
    totalPages: data.total_pages > 500 ? 500 : data.total_pages,
  };
};
