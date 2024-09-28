"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SearchResults } from "../components/SearchResults";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // Use a temporary state for the input
  const [searchQuery, setSearchQuery] = useState(query);
  const [finalQuery, setFinalQuery] = useState(query); // This will hold the query to send to the router

  useEffect(() => {
    setSearchQuery(query); // Set the input state based on the query parameter
    setFinalQuery(query); // Ensure the final query reflects the initial query
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFinalQuery(searchQuery); // Set the final query before routing
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="text-white py-4 sticky top-0 z-50">
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
      <div className="flex-grow flex flex-col justify-center items-center">
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
        <h1 className="text-3xl font-bold mb-8 text-center">
          খুঁজ দ্য সার্চ: {finalQuery || "কিছু লিখুন"}
        </h1>
        {finalQuery ? (
          <Suspense
            fallback={
              <p className="text-center">
                সঠিকভাবে সিনেমার নাম লিখার চেষ্টা করুন
              </p>
            }
          >
            <SearchResults query={finalQuery} />
          </Suspense>
        ) : (
          <p className="text-center">অনুগ্রহ করে অনুসন্ধান করতে কিছু লিখুন।</p>
        )}
      </div>
    </div>
  );
}
