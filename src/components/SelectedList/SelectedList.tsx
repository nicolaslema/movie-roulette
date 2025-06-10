import React from 'react';
import { type MovieOrSeries } from '../NetflixBrowser/NetflixBrowser';

type Props = {
  items: MovieOrSeries[];
  onRemove: (id: number) => void;
  onClear: () => void;
};

export default function SelectedList({ items, onRemove, onClear }: Props) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>🎞️ Mi lista personalizada</h3>
      <button
        onClick={onClear}
        style={{
          marginBottom: '1rem',
          backgroundColor: '#e63946',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        🧹 Vaciar toda la lista
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              backgroundColor: '#1a1918',
              borderRadius: '10px',
              padding: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <h5 style={{ fontSize: '0.9rem', minHeight: '2.4em' }}>{item.title || item.name}</h5>
            {item.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                alt={item.title || item.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
            <button
              onClick={() => onRemove(item.id)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '100%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '1',
                padding: 0,
              }}
              title="Eliminar de la lista"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
