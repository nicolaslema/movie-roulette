import { type MovieOrSeries } from '../NetflixBrowser/NetflixBrowser';
interface Props {
  item: MovieOrSeries;
  onClose: () => void;
}

export default function MovieDetailModal({ item, onClose }: Props) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#181818',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '800px',
        padding: '1rem',
        color: 'white',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}>×</button>

        {item.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
            alt={item.title || item.name}
            style={{ width: '100%', borderRadius: '10px' }}
          />
        )}

        <h2>{item.title || item.name}</h2>
        <p><strong>Rating:</strong> ⭐ {item.vote_average}</p>
        <p><strong>Fecha:</strong> {item.release_date || item.first_air_date}</p>
        <p style={{ marginTop: '1rem' }}>{item.overview}</p>
      </div>
    </div>
  );
}