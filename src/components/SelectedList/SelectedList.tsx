import { useState, useEffect } from 'react';
import { type MovieOrSeries } from '../../types/MovieTypes';

type Props = {
  items: MovieOrSeries[];
  onRemove: (id: number) => void;
  onClear: () => void;
   onPickRandom: () => void;

};

export default function SelectedList({ items, onRemove, onClear, onPickRandom }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Abrir automáticamente en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Botón flotante solo en mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 bg-[#457b9d] text-white px-4 py-2 rounded-full shadow-lg md:hidden"
        >
          📂 Abrir lista
        </button>
      )}

      {/* Overlay solo en mobile */}
      {isOpen && window.innerWidth < 768 && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Panel lateral flotante */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 p-6 bg-slate-800/90 text-white overflow-y-scroll scrollbar-hide shadow-xl z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🎞️ Mi lista personalizada</h3>
          {/* Botón cerrar solo en mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white text-2xl font-bold"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <button
          onClick={onClear}
          className="mb-4 px-4 py-2 bg-[#e63946] text-white rounded hover:bg-[#d52c39] transition"
        >
          🧹 Vaciar toda la lista
        </button>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#1a1918] rounded-lg p-1 shadow-sm text-center"
            >
              <h5 className="text-xs font-medium min-h-[2rem] mb-1">
                {item.title || item.name}
              </h5>

              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full rounded-md"
                />
              )}

              <button
                onClick={() => onRemove(item.id)}
                title="Eliminar de la lista"
                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-white font-bold bg-[#ff6b6b] rounded-full hover:bg-[#ff4c4c] transition text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
  <button
    onClick={() => {
      onPickRandom();
      if (window.innerWidth < 768) setIsOpen(false);
    }}
    className="mt-6 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
  >
    🎲 Selección aleatoria ({items.length})
  </button>
)}


      </div>
    </>
  );
}