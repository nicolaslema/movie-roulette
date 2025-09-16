import { useState } from 'react';
import type { MovieOrSeries } from '../../types/MovieTypes';
import MovieDetailModal from '../MovieDetailModal/MovieDetailModal';

type Props = {
  items: MovieOrSeries[];
  selectedItems: MovieOrSeries[];
  toggleSelection: (item: MovieOrSeries) => void;
};

export default function ContentGrid({ items, selectedItems, toggleSelection }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<MovieOrSeries | null>(null);


  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4">
        {items.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          items.map((item) => {
            const isSelected = selectedItems.some((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className={`flex flex-col w-[190px] min-h-[400px] p-2 rounded-lg bg-slate-700/30 backdrop-blur-3xl shadow-2xl ${
                  isSelected ? 'border-2 border-green-500' : 'border border-gray-300/30'
                }`}
              >
                <h4 className="font-semibold text-base mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.title || item.name}
                  
                </h4>

                {item.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded-lg mb-2"
                  />
                )}

                <button
                  onClick={() => toggleSelection(item)}
                  className="mt-2 w-full px-2 py-1 bg-slate-700 text-gray-200 rounded hover:bg-slate-900 transition"
                >
                  {isSelected ? 'Quitar de la lista' : 'Agregar a mi lista'}
                </button>

                <button
                  onClick={() => setSelectedDetail(item)}
                  className="mt-2 w-full px-2 py-1 bg-[#093359] text-white rounded hover:bg-[#1c0a82] transition"
                >
                  📄 Detalles
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal renderizado fuera del loop */}
      {selectedDetail && (
        <MovieDetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}