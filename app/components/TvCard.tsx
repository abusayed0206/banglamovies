import Link from "next/link";
import Image from "next/image";

interface TV {
  id: number;
  name: string; // Use 'name' for TV show title
  poster_path: string | null; // Allow poster_path to be null
  first_air_date: string; // Use first_air_date for TV shows
}

interface TvCardProps {
  tv: TV;
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

const TvCard: React.FC<TvCardProps> = ({ tv }) => {
  const releaseYear = new Date(tv.first_air_date).getFullYear();
  const releaseYearBengali = convertToBengaliDigits(releaseYear); // Convert release year to Bengali

  // Use fallback image if poster_path is not available
  const posterUrl = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : "/sayed.jpg"; // Fallback image path

  return (
    <Link
      href={`/tv/${tv.id}`} // Ensure this links to the dynamic route
      passHref
      className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
      aria-label={`${tv.name}`}
    >
      <div className="relative">
        <Image
          src={posterUrl} // Use the posterUrl variable here
          alt={`${tv.name} poster`}
          width={500}
          height={750}
          layout="responsive"
          loading="lazy"
          className="rounded-lg"
        />
      </div>

      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold" aria-label={`${tv.name}`}>
          {tv.name}
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

export default TvCard;
