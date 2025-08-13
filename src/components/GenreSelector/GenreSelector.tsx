// src/components/GenreSelector.tsx
import {type Genre}  from '../../types/MovieTypes';

type Props = {
  genres: Genre[];
  selectedGenre: number | null;
  onChange: (id: number | null) => void;
};

export default function GenreSelector({ genres, selectedGenre, onChange }: Props) {
  return (
    <select className='flex p-2 border border-zinc-300/30 rounded-2xl ' onChange={(e) => onChange(Number(e.target.value) || null)} value={selectedGenre ?? ''}>
      <option className='text-black bg-slate-800' value="">Todos los géneros</option>
      {genres.map((genre) => (
        <option className='text-white bg-slate-800' key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}
