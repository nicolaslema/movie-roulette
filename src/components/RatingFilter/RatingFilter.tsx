type RatingFilterProps = {
    minRating: number;
    onChange: (value: number) => void;
  };
  
  export default function RatingFilter({ minRating, onChange }: RatingFilterProps) {
    const ratings = [0, 2, 4, 6, 8];

    
 
  
    return (
      <div style={{ margin: '1rem 0' }}>
        <span style={{ marginRight: '1rem' }}>Filtrar por puntuación mínima:</span>
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            style={{
              marginRight: '0.5rem',
              padding: '0.3rem 0.7rem',
              borderRadius: '5px',
              backgroundColor: minRating === rating ? '#e50914' : '#333',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
            {rating} ⭐
            </div>
          </button>
        ))}
      </div>
    );
  }