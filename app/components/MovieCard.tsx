import Link from "next/link";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null; // Allow poster_path to be null
  release_date: string;
}

interface MovieCardProps {
  movie: Movie;
}

// Function to convert English digits to Bengali digits
const convertToBengaliDigits = (num: number): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString() // Convert the number to string
    .split("") // Split into individual characters
    .map((digit) => bengaliDigits[parseInt(digit)]) // Map each digit to Bengali
    .join(""); // Join them back to form a string
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const releaseYear = new Date(movie.release_date).getFullYear();
  const releaseYearBengali = convertToBengaliDigits(releaseYear); // Convert release year to Bengali

  // Use fallback image if poster_path is not available
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/sayed.jpg"; // Fallback image path

  return (
    <Link
      href={`/movie/${movie.id}`} // Ensure this links to the dynamic route
      passHref
      className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
      aria-label={`${movie.title}`}
    >
      <div className="relative">
        <Image
          src={posterUrl} // Use the posterUrl variable here
          alt={`${movie.title} poster`}
          width={500}
          height={750}
          layout="responsive"
          loading="lazy"
          className="rounded-lg"
        />
      </div>

      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold" aria-label={`${movie.title}`}>
          {movie.title}
        </h2>
        <hr className="my-2 border-gray-300" />
        <p
          className="text-gray-600"
          aria-label={`Release year: ${releaseYearBengali}`}
        >
          {releaseYearBengali} {/* Display release year in Bengali */}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
