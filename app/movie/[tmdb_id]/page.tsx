"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaYoutube, FaDownload } from "react-icons/fa";
import Link from "next/link";
import Modal from "../../components/Modal";
import Navbar from "@/app/components/Navbar";
import WatchProvider from "@app/components/WatchProvider"

// Define types for movie details
interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  poster_path?: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  production_countries: { name: string }[];
  imdb_id: string;
  videos?: {
    results: Video[];
  };
}

interface CastMember {
  id: number;
  name: string;
  profile_path?: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}

interface Video {
  name: string;
  type: string;
  key: string;
  site: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Function to convert English digits to Bengali digits
const convertToBengaliDigits = (num: number): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString() // Convert the number to a string
    .split("") // Split it into individual characters
    .map((digit) => bengaliDigits[parseInt(digit)]) // Map each digit to its Bengali counterpart
    .join(""); // Join the mapped digits back together
};

const fetchMovieDetails = async (tmdbId: string): Promise<Movie> => {
  const response = await fetch(`/api/movie/${tmdbId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

const MovieDetails: React.FC = () => {
  const { tmdb_id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenYoutube, setIsOpenYoutube] = useState(false);
  const [isOpenDownload, setIsOpenDownload] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (tmdb_id) {
      const loadMovieDetails = async () => {
        setLoading(true);
        try {
          const data = await fetchMovieDetails(tmdb_id as string);
          setMovie(data);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("An error occurred while fetching movie details.");
        } finally {
          setLoading(false);
        }
      };

      loadMovieDetails();
    }
  }, [tmdb_id]);

  if (loading) return <div className="text-center py-10">লোড হচ্ছে......</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/sayed.jpg";
  const topCrew =
    movie.credits?.crew?.filter(
      (person) => person.job === "Director" || person.job === "Writer"
    ) || [];
  const cast = movie.credits?.cast || [];

  // Convert release year and runtime to Bengali digits
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const releaseYearBengali = convertToBengaliDigits(releaseYear || 0);

  const runtimeBengali = convertToBengaliDigits(movie.runtime);

  const productionCountries = movie.production_countries.map((country) => {
    if (country.name === "Bangladesh") return "বাংলাদেশ";
    if (country.name === "India") return "ভারত";
    return country.name;
  });

  const youtubeVideos =
    movie.videos?.results?.filter((video) => video.site === "YouTube") || [];

  const handleYoutubeClick = () => {
    // Open the modal regardless of whether videos are available
    setIsOpenYoutube(true);

    if (youtubeVideos.length > 0) {
      setSelectedVideo(youtubeVideos[0]); // Select the first video by default
    } else {
      setSelectedVideo(null); // No videos available, set to null
    }
  };

  return (
    <div className="justify-center container mx-auto px-4">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                width={300}
                height={450}
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>

            <div className="flex flex-row md:flex-col justify-center items-center gap-4">
              <button
                onClick={handleYoutubeClick}
                className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300"
              >
                <FaYoutube className="text-2xl  text-white" />
              </button>
              <button
                onClick={() => setIsOpenDownload(true)}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <FaDownload className="text-2xl text-white" />
              </button>
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <Image
                  src="/imdb.png"
                  alt="IMDb Logo"
                  width={100}
                  height={100}
                  priority
                />
              </a>

              <a
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg justify-center w-10 h-10 hover:bg-green-700 transition-colors duration-300"
              >
                <Image
                  src="/tmdb.svg"
                  alt="TMDB Logo"
                  width={50}
                  height={50}
                />
              </a>

              <a
                href={`https://letterboxd.com/imdb/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex rounded-lg items-center justify-center w-10 h-10  hover:bg-orange-700 transition-colors duration-300"
              >
                <Image
                  src="/lb.svg"
                  alt="Letterboxd Logo"
                  width={50}
                  height={50}
                />
              </a>

              <a
                href={`https://trakt.tv/movies/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-sm justify-center bg-white rounded- w-10 h-10  hover:bg-orange-700 transition-colors duration-300"
              >
                <Image
                  src="/trakt.png"
                  alt="Trakt.tv Logo"
                  width={100}
                  height={100}
                />
              </a>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 mt-8">
            {movie.title}{" "}
            <span className="text-lg font-normal">({releaseYearBengali})</span>
          </h1>

          <div className="mt-6 text-lg">
            <p>
              <strong>সংক্ষিপ্ত বিবরণ:</strong>
            </p>
            <p>{movie.overview || "বর্ণনা উপলভ্য নেই।"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <p>
              <strong>মুক্তির বছর:</strong> {releaseYearBengali}
            </p>
            <p>
              <strong>শ্রেণী:</strong>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p>
              <strong>সময়কাল:</strong> {runtimeBengali} মিনিট
            </p>
            <p>
              <strong>দেশ:</strong> {productionCountries.join(", ")}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold">পরিচালক ও লেখকগণ</h2>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {topCrew.map((crew) => (
                <div key={crew.id} className="flex flex-col items-center">
                  <a
                    href={`https://www.themoviedb.org/person/${crew.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        crew.profile_path
                          ? `https://image.tmdb.org/t/p/w200${crew.profile_path}`
                          : "/sayed.jpg"
                      }
                      alt={crew.name}
                      width={100}
                      height={150}
                      className="rounded-lg shadow-md"
                    />
                    <p className="text-center mt-2">{crew.name}</p>
                    <p className="text-sm text-gray-400">{crew.job}</p>
                  </a>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-8">অভিনেতা</h2>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {cast.slice(0, 5).map((actor) => (
                <div key={actor.id} className="flex flex-col items-center">
                  <a
                    href={`https://www.themoviedb.org/person/${actor.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : "/sayed.jpg"
                      }
                      alt={actor.name}
                      width={100}
                      height={150}
                      className="rounded-lg shadow-md"
                    />
                    <p className="text-center mt-2">{actor.name}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <Modal isOpen={isOpenYoutube} onClose={() => setIsOpenYoutube(false)}>
            <div className="p-3">
              {youtubeVideos.length > 0 ? (
                <div className="space-y-4">
                  {selectedVideo && (
                    <div className="flex flex-col items-center">
                      <iframe
                        className="w-full aspect-video border-2 border-gray-300 rounded-lg"
                        src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&mute=1&controls=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>

                      <Link
                        href={`https://www.youtube.com/watch?v=${selectedVideo.key}`}
                        target="_blank"
                      >
                        <h4 className="text-base text-black font-semibold mb-2 mt-2">
                          {selectedVideo.name}
                        </h4>
                      </Link>
                    </div>
                  )}

                  <div className="flex justify-center mb-2 overflow-x-auto">
                    {youtubeVideos.map((video) => (
                      <button
                        key={video.key}
                        onClick={() => setSelectedVideo(video)}
                        className={`px-3 py-1 rounded mx-2 ${selectedVideo?.key === video.key
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        {video.type}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-lg text-black">
                  কোন ইউটিউব ভিডিও নাই। আপনি চাইলে টিএমডিবি ওয়েবসাইটে ভিডিও লিংক
                  যুক্ত করতে পারেন।
                </div>
              )}
            </div>
          </Modal>

          <Modal
            isOpen={isOpenDownload}
            onClose={() => setIsOpenDownload(false)}
          >
          </WatchProvider/>
        </Modal>

        {/* TMDB attribution */}
        <div className="flex flex-col items-center mt-4">
          <a href="https://www.themoviedb.org/" className="mb-2">
            <Image
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
              alt="TMDB Logo"
              width={100}
              height={100}
              className="shadow-md"
            />
          </a>
          <p className="text-gray-500 text-center">
            কৃতজ্ঞতা স্বীকারঃ এই ওয়েবসাইটটি TMDB API ব্যবহার করে কিন্তু TMDB
            দ্বারা এন্ডোর্স বা সার্টিফাইড না! সব ধরনের তথ্য TMDB থেকে নেয়া
            হয়েছে।
          </p>
          <p className="text-gray-500 text-center">
            সোর্স কোড:{" "}
            <a
              className="text-blue-500 text-xl"
              href="https://github.com/abusayed0206/banglamovies/"
            >
              গিটহাব
            </a>
            <br />
          </p>
        </div>
      </div>
    </div>
    </div >
  );
};

export default MovieDetails;
