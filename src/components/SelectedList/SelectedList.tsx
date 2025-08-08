import { type MovieOrSeries } from '../NetflixBrowser/NetflixBrowser';


type Props = {
  items: MovieOrSeries[];
  onRemove: (id: number) => void;
  onClear: () => void;
};

export default function SelectedList({ items, onRemove, onClear }: Props) {
  return (
  <div className="fixed top-0 right-0 h-screen w-80 p-6 bg-slate-800/30 text-white overflow-y-scroll scrollbar-hide shadow-xl z-50">
  <h3 className="text-xl font-semibold mb-4">🎞️ Mi lista personalizada</h3>

  <button
    onClick={onClear}
    className="mb-4 px-4 py-2 bg-[#e63946] text-white rounded hover:bg-[#d52c39] transition"
  >
    🧹 Vaciar toda la lista
  </button>

  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
    {items.map((item) => (
     <div className="relative bg-[#1a1918] rounded-lg p-1 shadow-sm text-center">
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
</div>


  );
}
