"use client";

import React, { useEffect, useState, Suspense } from "react";
import MovieCard from "./components/MovieCard";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "./components/Navbar";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const convertToBengaliDigits = (num: number): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString() // Convert the number to a string
    .split("") // Split it into individual characters
    .map((digit) => bengaliDigits[parseInt(digit)] || digit) // Map each digit to its Bengali counterpart, or keep non-digit characters
    .join(""); // Join the mapped digits back together
};

const fetchMovies = async (page: number) => {
  const response = await fetch(`/api/discover?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return response.json();
};

const MovieList = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("চলচ্চিত্র লোড করার সময় একটি ত্রুটি ঘটেছে।");
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
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading)
    return (
      <div className="text-center py-10">
        চলচ্চিত্রের সংগ্রহশালা লোড হচ্ছে........
      </div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="justify-center mx-auto px-4">
      <Navbar />
      <div className="text-center text-xl font-bold mt-4">
        <form onSubmit={handleSearch} className="flex justify-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="খুঁজ দ্য সার্চ"
            className="px-4 py-2 w-64 text-black rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            খুঁজুন
          </button>
        </form>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 mx-auto">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {getPaginationNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePagination(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {convertToBengaliDigits(page)}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePagination(currentPage + 1)}
            className="mx-1 px-3 py-1 border rounded bg-blue-500 text-white"
          >
            পরের পাতা
          </button>
        )}
      </div>
      <div className="flex flex-col items-center mt-4">
        <a href="https://www.themoviedb.org/" className="mb-2 ">
          <Image
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
            alt="TMDB Logo"
            width={100}
            height={100}
            className="rounded-sm"
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