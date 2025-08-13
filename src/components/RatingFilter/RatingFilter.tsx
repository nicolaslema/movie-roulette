type RatingFilterProps = {
    minRating: number;
    onChange: (value: number) => void;
  };
  
  export default function RatingFilter({ minRating, onChange }: RatingFilterProps) {
    const ratings = [0, 2, 4, 6, 8];

    return (
      <div className="my-4">
  <span className="mr-4">Filtrar por puntuación mínima:</span>
  {ratings.map((rating) => (
    <button
      key={rating}
      onClick={() => onChange(rating)}
      className={`mr-2 px-3 py-1 rounded 
        ${minRating === rating ? 'bg-[#e50914]' : 'bg-slate-900/30'} 
        text-white cursor-pointer transition`}
    >
      <div className="flex flex-wrap gap-4 items-center">
        {rating} ⭐
      </div>
    </button>
  ))}
</div>

    );
  }