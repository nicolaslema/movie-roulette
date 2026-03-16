export type Genre = {
  id: number;
  name: string;
};

export type MovieOrSeries = {
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  id: number;
  name?: string;
  title?: string;
  poster_path?: string;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  video?: string;
};

export type TMDBVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
};

export type MovieOrSeriesDetails = {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  tagline?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres?: Genre[];
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  videos?: { results: TMDBVideo[] };
};
