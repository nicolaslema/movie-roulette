// components/NetflixBrowser/PaginationControls.tsx
interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationControls({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 transition"
        onClick={onPrev}
        disabled={page === 1}
      >
        ← Anterior
      </button>
      <span className="text-sm">Página {page} de {totalPages}</span>
      <button
        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 transition"
        onClick={onNext}
        disabled={page === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
}