"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "../components/SearchResults";

interface SearchFormProps {
  initialQuery: string;
  initialType: string;
  onSearch: (query: string, type: string) => void;
}

function SearchForm({ initialQuery, initialType, onSearch }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchType);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center mb-4 gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="খুঁজ দ্য সার্চ"
        className="px-4 py-2 w-64 text-black rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-2 py-2 text-black border-2 border-gray-300 focus:outline-none focus:border-blue-500"
      >
        <option value="movie">মুভি</option>
        <option value="tv">টিভি শো</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        খুঁজুন
      </button>
    </form>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "movie"; // Default to movie
  const [finalQuery, setFinalQuery] = useState(query);
  const [finalType, setFinalType] = useState(type);

  useEffect(() => {
    setFinalQuery(query);
    setFinalType(type);
  }, [query, type]);

  const handleSearch = (newQuery: string, newType: string) => {
    setFinalQuery(newQuery);
    setFinalType(newType);
    router.push(
      `/search?query=${encodeURIComponent(newQuery)}&type=${newType}`
    );
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <SearchForm
        initialQuery={query}
        initialType={type}
        onSearch={handleSearch}
      />
      <h1 className="text-3xl font-bold mb-8 text-center">
        খুঁজ দ্য সার্চ: {finalQuery || "কিছু লিখুন"} -{" "}
        {finalType === "movie" ? "মুভি" : "টিভি শো"}
      </h1>
      {finalQuery ? (
        <Suspense
          fallback={
            <p className="text-center">
              সঠিকভাবে সিনেমার নাম লিখার চেষ্টা করুন
            </p>
          }
        >
          <SearchResults query={finalQuery} type={finalType} />
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
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
