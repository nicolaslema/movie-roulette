import { type MovieOrSeries } from '../NetflixBrowser/NetflixBrowser';
import MovieDetailModal from '../MovieDetailModal/MovieDetailModal';
import { useState } from 'react';

type Props = {
  items: MovieOrSeries[];
  selectedItems: MovieOrSeries[];
  toggleSelection: (item: MovieOrSeries) => void;
};

export default function ContentGrid({ items, selectedItems, toggleSelection }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<MovieOrSeries | null>(null);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {items.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        items.map((item) => {
          const isSelected = selectedItems.some((i) => i.id === item.id);
          return (
            <div
              key={item.id}
              style={{
                width: '200px',
                border: isSelected ? '2px solid green' : '1px solid #ccc',
                padding: '0.5rem',
                borderRadius: '8px',
              }}
            >
              <h4>{item.title || item.name}</h4>
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title || item.name}
                  style={{ borderRadius: '8px' }}
                />
              )}
              <button onClick={() => toggleSelection(item)} style={{ marginTop: '0.5rem' }}>
                {isSelected ? 'Quitar de la lista' : 'Agregar a mi lista'}
      
    
              </button>
              <button
              onClick={() => setSelectedDetail(item)}
              style={{
                marginTop: '0.5rem',
                backgroundColor: '#912f32',
                color: 'white',
                padding: '0.25rem 0.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              📄 Detalles
            </button>
            {selectedDetail && (
                <MovieDetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
            )}
            </div>
            
          );
        })
      )}
    </div>
  );
}
