"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SearchResults } from "../components/SearchResults";
import Navbar from "../components/Navbar";

// Separate component to use useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [finalQuery, setFinalQuery] = useState(query);
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(query);
    setFinalQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFinalQuery(searchQuery);
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
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
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
