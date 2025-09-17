import { useState, useEffect } from 'react';
import type { MovieOrSeries } from '../../types/MovieTypes';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { FaDiceFive } from "react-icons/fa";

type Props = {
  items: MovieOrSeries[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onPickRandom: () => void;
};

const DESKTOP_BREAKPOINT = 1280;

export default function SelectedList({ items, onRemove, onClear, onPickRandom }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDevice = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobile(mobile);
      setIsOpen(!mobile); // abrir automáticamente en desktop
    };
    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return (
    <>
      {/* Botón flotante para abrir en mobile y desktop */}
      {(isMobile && !isOpen) || (!isMobile && !isOpen) ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[999] bg-[#142b397d] text-white px-4 py-2 rounded-full shadow-xl"
        >
          📂 Abrir lista
        </button>
      ) : null}

      {/* Overlay solo en mobile */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-[998]"
        />
      )}

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 p-6 border-l border-neutral-400/30 bg-neutral-900/30 backdrop-blur-lg text-white overflow-y-scroll scrollbar-hide shadow-2xl z-[1000] transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${!isMobile ? 'translate-x-0' : ''}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🎞️ Mi lista</h3>
          {/* Botón cerrar en mobile */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-bold"
              title="Cerrar"
            >
              ×
            </button>
          )}
          {/* Botón colapsar en desktop */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold hover:text-red-400 transition"
              title="Colapsar"
            >
              <IoIosArrowDroprightCircle size={34}/>
            </button>
          )}
        </div>

   <div className='flex justify-center items-center'>
         <button
          onClick={onClear}
          className="mb-4 px-4 py-2 bg-red-900 text-white rounded hover:bg-[#d52c39] transition"
        >
          Vaciar toda la lista
        </button>
   </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-300">No hay elementos seleccionados aún.</p>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative bg-[#1a1918] p-5 rounded-lg shadow-sm text-center"
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
                  className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-white font-bold bg-slate-200/30 rounded-full hover:bg-[#ff4c4c] transition text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <button
            onClick={() => {
              onPickRandom();
              if (isMobile) setIsOpen(false);
            }}
            className="mt-6 w-full px-4 py-2 bg-neutral-900/70 hover:bg-neutral-700/70 text-white rounded-lg flex justify-center items-center gap-4 transition"
          >
            <FaDiceFive/> Randomize ({items.length})
          </button>
        )}
      </div>
    </>
  );
}
