/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Modal from "../../components/Modal";
import GalleryModal from "@/app/components/GalleryModal";
import { numBang, dateBang, timeBang } from "bang-utils";

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
  images?: {
    posters: { file_path: string }[];
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

// Interface for Watch Providers
interface Provider {
  logo_path: string;
  provider_name: string;
}

interface WatchProviderResponse {
  flatrate: Provider[];
  link: string;
}

// Fetch movie details
const fetchMovieDetails = async (tmdbId: string): Promise<Movie> => {
  const response = await fetch(`/api/movie/${tmdbId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

// Fetch watch providers from the API
const fetchWatchProviders = async (
  tmdbId: string
): Promise<WatchProviderResponse | null> => {
  const response = await fetch(`/api/watch/provider/${tmdbId}`);
  if (!response.ok) {
    console.error("Failed to fetch watch providers");
    return null;
  }
  const data = await response.json();
  if (data.flatrate && data.link) {
    return {
      flatrate: data.flatrate,
      link: data.link,
    };
  }
  return null;
};

const MovieDetails: React.FC = () => {
  const { tmdb_id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenYoutube, setIsOpenYoutube] = useState(false);
  const [isOpenDownload, setIsOpenDownload] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // State to store watch providers
  const [watchProviders, setWatchProviders] =
    useState<WatchProviderResponse | null>(null);

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

  const [isWatched, setIsWatched] = useState<boolean | null>(null);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(null);
  const [isOpenStatusModal, setIsOpenStatusModal] = useState<boolean>(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Function to check if the movie is watched
  const checkIfWatched = async (tmdbId: string) => {
    const response = await fetch(`/api/trakt/lookup?tmdbid=${tmdbId}`);
    if (!response.ok) {
      console.error("Failed to fetch watched status");
      return;
    }
    const data = await response.json();
    setIsWatched(data[0]?.watched_at !== "none");
  };

  // Call the checkIfWatched function
  useEffect(() => {
    if (tmdb_id) {
      checkIfWatched(tmdb_id as string);
    }
  }, [tmdb_id]);

  // Fetch watch providers when the download modal opens
  useEffect(() => {
    if (isOpenDownload && tmdb_id) {
      const loadWatchProviders = async () => {
        try {
          const data = await fetchWatchProviders(tmdb_id as string);
          setWatchProviders(data);
        } catch (err) {
          console.error("Error fetching watch providers:", err);
        }
      };

      loadWatchProviders();
    }
  }, [isOpenDownload, tmdb_id]);

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
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const releaseYearBengali = numBang((releaseYear || 0).toString());
  const runtimeBengali = numBang(movie.runtime.toString());

  const productionCountries = movie.production_countries.map((country) => {
    if (country.name === "Bangladesh") return "বাংলাদেশ";
    if (country.name === "India") return "ভারত";
    return country.name;
  });

  const youtubeVideos =
    movie.videos?.results?.filter((video) => video.site === "YouTube") || [];

  const handleYoutubeClick = () => {
    setIsOpenYoutube(true);
    if (youtubeVideos.length > 0) {
      setSelectedVideo(youtubeVideos[0]);
    } else {
      setSelectedVideo(null);
    }
  };

  return (
    <div className="justify-center container mx-auto px-4">
      <div className="min-h-screen flex flex-col">
        <div className="p-6 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <Image
                src={posterUrl}
                alt={`${movie.title} পোস্টার`}
                width={300}
                height={450}
                className="rounded-lg shadow-lg mx-auto"
                priority={true}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex md:flex-col flex-row justify-center items-center gap-4">
                <button onClick={() => setIsGalleryModalOpen(true)}>
                  <Image
                    src="/gallery.svg"
                    alt="YouTube Logo"
                    width={50}
                    height={50}
                  />
                </button>

                <button
                  onClick={handleYoutubeClick}
                  aria-label="Open YouTube"
                  className="flex items-center justify-center w-12 h-12 rounded-lg  hover:bg-red-700 transition-colors duration-300"
                >
                  <Image
                    src="/yt.svg"
                    alt="YouTube Logo"
                    width={50}
                    height={50}
                  />
                </button>

                <button
                  onClick={() => setIsOpenDownload(true)}
                  aria-label="Download"
                  className="flex items-center justify-center w-10 h-10  rounded-lg hover:bg-white transition-colors duration-300"
                >
                  <Image src="/dl.svg" alt="Download" width={50} height={50} />
                </button>

                <div className="flex items-center justify-center">
                  {isWatched ? (
                    <div
                      className="cursor-pointer text-green-600"
                      onClick={() => {
                        const currentDate = new Date();
                        const dayOfMonth = currentDate.getDate();
                        const year = currentDate.getFullYear();

                        const formattedDate =
                          dateBang(
                            `${dayOfMonth}-${
                              currentDate.getMonth() + 1
                            }-${year}`,
                            ",",
                            "D M, YYYY"
                          ) || "";

                        const formattedTime = timeBang(
                          currentDate.toISOString(),
                          "detailed"
                        );

                        // Set the modal message with an additional div
                        setModalMessage(
                          <div className="flex flex-col items-center justify-center text-center">
                            <p>
                              আমি এই সিনেমাটি দেখেছি {formattedDate}{" "}
                              {formattedTime}
                            </p>
                            <p>আমাকে অনুসরণ করতে পারেনঃ</p>
                            <div className="flex justify-center space-x-6">
                              <a
                                href="https://letterboxd.com/abusayed"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-orange-500 transition-colors duration-300"
                              >
                                <Image
                                  src="/lb.svg"
                                  alt="Letterboxd Logo"
                                  width={50}
                                  height={50}
                                />
                              </a>
                              <a
                                href="https://trakt.tv/users/lrs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded bg-black hover:bg-red-600 transition-colors duration-300"
                              >
                                <Image
                                  src="/trakt.svg"
                                  alt="Trakt.tv Logo"
                                  width={40}
                                  height={50}
                                />
                              </a>
                            </div>
                          </div>
                        );
                        setIsOpenStatusModal(true);
                      }}
                    >
                      <Image
                        src="/ok.svg"
                        alt="Watched"
                        width={45}
                        height={45}
                        priority
                      />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer text-red-600"
                      onClick={() => {
                        setModalMessage(
                          <div className="flex flex-col items-center justify-center text-center">
                            <p>এখনো দেখা হয়নি এই সিনেমাটি। সময় পেলে দেখবো।</p>
                            <p>আমাকে অনুসরণ করতে পারেনঃ</p>
                            <div className="flex justify-center space-x-6">
                              <a
                                href="https://letterboxd.com/abusayed"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded hover:bg-orange-500 transition-colors duration-300"
                              >
                                <Image
                                  src="/lb.svg"
                                  alt="Letterboxd Logo"
                                  width={50}
                                  height={50}
                                />
                              </a>
                              <a
                                href="https://trakt.tv/users/lrs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded bg-black hover:bg-red-600 transition-colors duration-300"
                              >
                                <Image
                                  src="/trakt.svg"
                                  alt="Trakt.tv Logo"
                                  width={40}
                                  height={50}
                                />
                              </a>
                            </div>
                          </div>
                        );
                        setIsOpenStatusModal(true);
                      }}
                    >
                      <Image
                        src="/cross.svg"
                        alt="Watched"
                        width={35}
                        height={35}
                        priority
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col justify-center items-center gap-4">
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
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
                className="flex items-center rounded-lg justify-center w-12 h-12 bg-gray-200 hover:bg-green-700 transition-colors duration-300"
              >
                <Image src="/tmdb.svg" alt="TMDB Logo" width={40} height={40} />
              </a>

              <a
                href={`https://letterboxd.com/imdb/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded bg-black hover:bg-red-600 transition-colors duration-300"
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
                className="flex items-center justify-center w-12 h-12 rounded bg-black hover:bg-red-600 transition-colors duration-300"
              >
                <Image
                  src="/trakt.svg"
                  alt="Trakt.tv Logo"
                  width={40}
                  height={50}
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
                      alt={`${crew.name} এর ছবি`}
                      width={100}
                      height={150}
                      className="rounded-lg shadow-md"
                    />
                    <p className="text-center mt-2">{crew.name}</p>
                    <p className="text-sm text-oldlace">{crew.job}</p>{" "}
                  </a>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-8">
              উল্লেখযোগ্য অভিনেতা ও অভিনেত্রী
            </h2>
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
                      alt={`${actor.name} এর ছবি`}
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
          <Modal
            isOpen={isOpenYoutube}
            onClose={() => setIsOpenYoutube(false)}
            title="YouTube Videos"
          >
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
                        className={`px-3 py-1 rounded mx-2 ${
                          selectedVideo?.key === video.key
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
                <div className="text-lg text-black text-center">
                  কোন ইউটিউব ভিডিও নাই। আপনি চাইলে টিএমডিবি ওয়েবসাইটে ভিডিও লিংক
                  যুক্ত করতে পারেন{" "}
                  <a
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto mt-2 rounded-lg w-10 h-10 text-green-700 transition-colors duration-300"
                  >
                    এখানে
                  </a>{" "}
                  ক্লিক করে।
                  <a
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center mx-auto mt-2 rounded-lg w-12 h-12 transition-colors bg-gray-200duration-300"
                  >
                    <Image
                      src="/tmdb.svg"
                      alt="TMDB Logo"
                      width={50}
                      height={50}
                    />
                  </a>
                </div>
              )}
            </div>
          </Modal>
          <Modal
            isOpen={isOpenDownload}
            onClose={() => setIsOpenDownload(false)}
            title="Download Options"
          >
            <div className="p-4">
              {watchProviders ? (
                <div className="flex flex-col items-center">
                  <h2 className="text-xl text-black font-bold mb-4 text-center">
                    এখানে স্ট্রিম করুনঃ
                  </h2>
                  <div className="flex flex-wrap justify-center mb-4">
                    {watchProviders.flatrate.map((provider, index) => (
                      <a
                        key={index}
                        href={watchProviders.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="m-2 rounded-lg overflow-hidden" // Add rounded-lg and overflow-hidden
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain rounded-lg" // Optional: add rounded-lg here too
                        />
                      </a>
                    ))}
                  </div>

                  <p className="text-xs mt-4 flex text-black items-center justify-center">
                    স্ট্রিমিং লিংক সংগ্রহে সহযোগিতায়
                    <Image
                      src="/jw.png"
                      alt="JustWatch"
                      width={16}
                      height={16}
                      className="ml-2"
                    />
                  </p>
                </div>
              ) : (
                <p className="text-black">
                  কোন স্ট্রিমিং পরিষেবা পাওয়া যায়নি।
                </p>
              )}
            </div>
          </Modal>
          <Modal
            isOpen={isOpenStatusModal}
            onClose={() => setIsOpenStatusModal(false)}
            title="Watch Status"
          >
            <div className="p-4">
              <p className="text-black">{modalMessage}</p>
            </div>
          </Modal>
          <GalleryModal
            isOpen={isGalleryModalOpen}
            onClose={() => setIsGalleryModalOpen(false)}
            posters={movie.images?.posters}
          >
            <div className="p-4">
              <p className="text-black">এখানে ছবির গ্যালারি থাকবে।</p>
            </div>
          </GalleryModal>

          
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
