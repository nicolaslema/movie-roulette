import { useEffect, useState } from 'react';

const API_KEY = 'db1393edebdb0d8e7c902a57e7937428';

type Genre = {
  id: number;
  name: string;
};

type MovieOrSeries = {
  id: number;
  name?: string;
  title?: string;
  poster_path: string;
};

export default function NetflixBrowser() {
  const [contentList, setContentList] = useState<MovieOrSeries[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isTV, setIsTV] = useState(false); // false = películas
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [randomPick, setRandomPick] = useState<MovieOrSeries | null>(null);
  const [selectedItems, setSelectedItems] = useState<MovieOrSeries[]>([]);

  const contentType = isTV ? 'tv' : 'movie';

  //toggle seleccion  de pelicula
  const toggleSelection = (item: MovieOrSeries) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Carga una pelicula random de la lista
  const pickRandomFromSelection = () => {
    if (selectedItems.length === 0) return;
    const randomItem = selectedItems[Math.floor(Math.random() * selectedItems.length)];
    setRandomPick(randomItem);
  };

  // Carga una pelicula random 
//   const pickRandom = () => {
//     if (contentList.length === 0) return;
//     const randomItem = contentList[Math.floor(Math.random() * contentList.length)];
//     setRandomPick(randomItem);
//   };


  // Cargar géneros al cambiar el tipo de contenido
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/${contentType}/list?api_key=${API_KEY}&language=es`)
      .then((res) => res.json())
      .then((json) => setGenres(json.genres));
  }, [contentType]);

  // Cargar contenido (descubrimiento o búsqueda)
  useEffect(() => {
    let url = '';
    const baseParams = `api_key=${API_KEY}&language=es&page=${page}`;

    if (searchQuery.trim()) {
      // Búsqueda
      url = `https://api.themoviedb.org/3/search/${contentType}?${baseParams}&query=${encodeURIComponent(
        searchQuery
      )}`;
    } else {
      // Descubrimiento
      url = `https://api.themoviedb.org/3/discover/${contentType}?${baseParams}&with_watch_providers=8&watch_region=AR&sort_by=popularity.desc`;
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
    }

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setContentList(json.results);
        setTotalPages(json.total_pages > 500 ? 500 : json.total_pages); // Límite de TMDB
      });
  }, [isTV, selectedGenre, searchQuery, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTypeChange = (type: 'movie' | 'tv') => {
    setIsTV(type === 'tv');
    setSelectedGenre(null);
    setPage(1);
    setSearchQuery('');
  };

  return (
    <div>
      <h2>{isTV ? 'Series' : 'Películas'} en Netflix Argentina</h2>

      {/* Selector tipo */}
      <div>
        <button onClick={() => handleTypeChange('movie')} disabled={!isTV}>
          Películas
        </button>
        <button onClick={() => handleTypeChange('tv')} disabled={isTV}>
          Series
        </button>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Selector de género (solo si no hay búsqueda) */}
      {!searchQuery && (
        <select onChange={(e) => setSelectedGenre(Number(e.target.value))} value={selectedGenre ?? ''}>
          <option value="">Todos los géneros</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      )}

      {/* Lista */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {contentList.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
            contentList.map((item) => {
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
                  </div>
                );
              })
        )}
      </div>




      {/* Random Picker */}
      {/* <button onClick={pickRandom} style={{ marginTop: '1rem' }}>
  🎲 Sorpréndeme
</button> */}

{randomPick && (
  <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
    <h3>Tu elección aleatoria:</h3>
    <h4>{randomPick.title || randomPick.name}</h4>
    {randomPick.poster_path && (
      <img
        src={`https://image.tmdb.org/t/p/w300${randomPick.poster_path}`}
        alt={randomPick.title || randomPick.name}
        style={{ borderRadius: '8px' }}
      />
    )}
  </div>
)}

{selectedItems.length > 0 && (
  <div style={{ marginTop: '2rem' }}>
    <h3 style={{ marginBottom: '1rem' }}>🎞️ Mi lista personalizada</h3>
    <button
      onClick={() => setSelectedItems([])}
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

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
      }}
    >
      {selectedItems.map((item) => (
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
          <h5 style={{ fontSize: '0.9rem', minHeight: '2.4em' }}>
            {item.title || item.name}
          </h5>

          {item.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
              alt={item.title || item.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          )}

          <button
            onClick={() =>
              setSelectedItems(selectedItems.filter((i) => i.id !== item.id))
            }
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
  
)}
        {/* RANDOM LIST PICKER */}
        {selectedItems.length > 0 && (
  <div style={{ marginTop: '1rem' }}>
    <button onClick={pickRandomFromSelection}>
      🎲 Sorpréndeme desde mi lista ({selectedItems.length} seleccionadas)
    </button>
  </div>
)}
      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            ← Anterior
          </button>
          <span style={{ margin: '0 1rem' }}>
            Página {page} de {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}