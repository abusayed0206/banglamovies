"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaDownload } from 'react-icons/fa';
import { SiLetterboxd, SiThemoviedatabase, SiImdb } from "react-icons/si";
import Link from 'next/link';

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

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const fetchMovieDetails = async (tmdbId: string): Promise<Movie> => {
    const [bnResponse, enResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=bn-BD`),
        fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=en-US`)
    ]);

    if (!bnResponse.ok || !enResponse.ok) {
        throw new Error('Failed to fetch movie details');
    }

    const bnData = await bnResponse.json();
    const enData = await enResponse.json();

    return {
        ...enData,
        ...bnData,
        overview: bnData.overview || enData.overview,
        title: bnData.title || enData.title,
    };
};

const MovieDetails: React.FC = () => {
    const { tmdb_id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (tmdb_id) {
            const loadMovieDetails = async () => {
                setLoading(true);
                try {
                    const data = await fetchMovieDetails(tmdb_id as string);
                    setMovie(data);
                    setError(null); // Reset error state on successful fetch
                } catch (err) {
                    console.error(err); // Log the error for debugging
                    setError('An error occurred while fetching movie details.'); // Set error message
                } finally {
                    setLoading(false); // Stop loading regardless of success or error
                }
            };

            loadMovieDetails();
        }
    }, [tmdb_id]);

    if (loading) return <div className="text-center py-10">লোড হচ্ছে......</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!movie) return null;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : '/sayed.jpg';
    const topCrew = movie.credits?.crew?.filter((person) => person.job === "Director" || person.job === "Writer") || [];
    const cast = movie.credits?.cast || [];

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

    const productionCountries = movie.production_countries.map((country) => {
        if (country.name === 'Bangladesh') return 'বাংলাদেশ';
        if (country.name === 'India') return 'ভারত';
        return country.name;
    });

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <Link href="/" passHref>
                            <button className="bg-[#1db954] text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-[#1ed760] transition-colors duration-300">
                                হোমপেজ
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

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
                        <a
                            href="https://sayed.page"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300"
                        >
                            <FaYoutube className="text-2xl text-white" />
                        </a>
                        <a
                            href="https://sayed.page"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            <FaDownload className="text-2xl text-white" />
                        </a>
                        <a
                            href={`https://www.imdb.com/title/${movie.imdb_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
                        >
                            <SiImdb className="text-2xl text-white" />
                        </a>

                        <a
                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300"
                        >
                            <SiThemoviedatabase className="text-2xl text-white" />
                        </a>
                        <a
                            href={`https://letterboxd.com/imdb/${movie.imdb_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-full shadow-lg hover:bg-orange-700 transition-colors duration-300"
                        >
                            <SiLetterboxd className="text-2xl text-green " />
                        </a>
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 mt-8">
                    {movie.title} <span className="text-lg font-normal">({releaseYear})</span>
                </h1>

                <div className="mt-6 text-lg">
                    <p><strong>সংক্ষিপ্ত বিবরণ:</strong></p>
                    <p>{movie.overview || 'বর্ণনা উপলভ্য নেই।'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <p><strong>মুক্তির বছর:</strong> {releaseYear}</p>
                    <p><strong>শ্রেণী:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
                    <p><strong>সময়কাল:</strong> {movie.runtime} মিনিট</p>
                    <p><strong>দেশ:</strong> {productionCountries.join(', ')}</p>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold">পরিচালক ও লেখকগণ</h2>
                    <div className="flex flex-wrap justify-center gap-6 mt-4">
                        {topCrew.map((crew) => (
                            <div key={crew.id} className="flex flex-col items-center">
                                <a href={`https://www.themoviedb.org/person/${crew.id}`} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        src={crew.profile_path ? `https://image.tmdb.org/t/p/w200${crew.profile_path}` : '/sayed.jpg'}
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
                                <a href={`https://www.themoviedb.org/person/${actor.id}`} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/sayed.jpg'}
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
                        কৃতজ্ঞতা স্বীকারঃ এই ওয়েবসাইটটি TMDB API ব্যবহার করে কিন্তু TMDB দ্বারা এন্ডোর্স বা সার্টিফাইড না! সব ধরনের তথ্য TMDB থেকে নেয়া হয়েছে।
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
