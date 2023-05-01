import { useEffect, useState, useRef } from 'react';
import './App.css'
import { Movies } from './components/Movies';
import { useMovies } from './hooks/useMovies';

function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('No se puede buscar una película vacía');
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número');
      return
    }

    if (search.length < 3) {
      setError('La búsqueda debe tener al menos 3 caracteres');
      return
    }

    setError(null)

  }, [search])

  return { search, updateSearch, error }
}


function App() {
  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search });

  const handleSubmit = (e) => {
    e.preventDefault();
    getMovies();
  }

  const handleChange = (e) => {
    updateSearch(e.target.value);
  }

  return (
    <div className='page-wrapper'>
      <header>
        <h1>Buscador de películas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <label htmlFor="movie">Put your movie here:</label>
          <input style={{
            border: '1px solid transparent',
            borderColor: error ? 'red' : 'transparent'
          }} onChange={handleChange} value={search} name="query" id='movie' placeholder='Avengers, Star Wars, The Matrix...' />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : null
        }
        <Movies movies={movies} />
      </main>
    </div>
  )
}

export default App
