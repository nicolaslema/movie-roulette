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