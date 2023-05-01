import { useRef, useState, useMemo, useCallback } from 'react';
import { searchMovies } from '../services/movies';

export function useMovies({search, sort}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);
  
  const getMovies = useCallback(async ({search}) => {
      if(search === previousSearch.current) return;

      try{
        setLoading(true);
        setError(null);

        previousSearch.current = search;

        const newMovies = await searchMovies({search})
        setMovies(newMovies);
      }catch(e){
        setError(e.message);
      } finally{
        setLoading(false)
      }
  }, []);

  // Compara de forma local con acento
  // También memorizamos para que cada vez que cambie el input del search
  // no se vuelva a renderizar otra vez
  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a,b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies]);

  return {movies: sortedMovies, getMovies, loading}
}