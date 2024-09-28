"use client";

import { useEffect, useState, Suspense } from 'react';
import MovieCard from './components/MovieCard';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'; // Import for optimized image

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const fetchMovies = async (page: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=bn&region=BD&language=bn-BD&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
};

const MovieList = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setError(null); // Clear any previous errors
      } catch (err) { // Use `err` for better context
        console.error(err); // Log the actual error
        setError('An error occurred while fetching movies.'); // Set error message
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [currentPage]);

  const handlePagination = (newPage: number) => {
    window.location.href = `/?page=${newPage}`;
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1); // Use const

    // Adjust startPage if endPage is at maxPagesToShow limit
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) return <div className="text-center py-10">চলচ্চিত্রের সংগ্রহশালা লোড হচ্ছে........</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>; // Error handling

  return (
    <div className="justify-center container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4 text-center">বাংলা চলচ্চিত্রের সংগ্রহশালা</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mx-auto">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {getPaginationNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePagination(page)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePagination(currentPage + 1)}
            className="mx-1 px-3 py-1 border rounded bg-blue-500 text-white"
          >
            Next
          </button>
        )}
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
  );
};

const HomePage: React.FC = () => {
  return (
    <Suspense fallback={<div>লোড হচ্ছে ....</div>}>
      <MovieList />
    </Suspense>
  );
};

export default HomePage;
