import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

async function getMovies(query: string): Promise<Movie[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await res.json();
  return data.results;
}

export async function SearchResults({ query }: { query: string }) {
    const movies = await getMovies(query);
  
    if (movies.length === 0) {
      return <p className="text-center">কোন মুভি পাওয়া যায়নি এই নামে &quot;{query}&quot;</p>;
    }
  
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }
  
  