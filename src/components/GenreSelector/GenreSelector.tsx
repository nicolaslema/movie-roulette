// src/components/GenreSelector.tsx
import {type Genre}  from '../NetflixBrowser/NetflixBrowser';

type Props = {
  genres: Genre[];
  selectedGenre: number | null;
  onChange: (id: number | null) => void;
};

export default function GenreSelector({ genres, selectedGenre, onChange }: Props) {
  return (
    <select onChange={(e) => onChange(Number(e.target.value) || null)} value={selectedGenre ?? ''}>
      <option className='text-black' value="">Todos los géneros</option>
      {genres.map((genre) => (
        <option className='text-black' key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}
