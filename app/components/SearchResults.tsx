import MovieCard from "./MovieCard";
import TvCard from "./TvCard"; // Import the TvCard component

interface Media {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  poster_path: string | null;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
}

async function getResults(query: string, type: string): Promise<Media[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(
      query
    )}&type=${type}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch ${type === "movie" ? "movies" : "TV shows"}`
    );
  }
  const data = await res.json();
  return data.results;
}

export async function SearchResults({
  query,
  type,
}: {
  query: string;
  type: string;
}) {
  const results = await getResults(query, type);

  if (results.length === 0) {
    return (
      <p className="text-center">
        কোন {type === "movie" ? "মুভি" : "টিভি শো"} পাওয়া যায়নি এই নামে &quot;
        {query}&quot;
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
        {results.map((media) => {
          // Conditional rendering based on media type
          if (type === "movie") {
            const movie = {
              id: media.id,
              title: media.title || "Untitled", // Fallback if title is undefined
              poster_path: media.poster_path,
              release_date: media.release_date || "Unknown", // Fallback if release_date is undefined
            };
            return <MovieCard key={movie.id} movie={movie} />;
          } else if (type === "tv") {
            const tv = {
              id: media.id,
              name: media.name || "Untitled", // Fallback if name is undefined
              poster_path: media.poster_path,
              first_air_date: media.first_air_date || "Unknown", // Fallback if first_air_date is undefined
            };
            return <TvCard key={tv.id} tv={tv} />;
          }
          return null; // Fallback if media type is neither
        })}
      </div>
    </div>
  );
}
