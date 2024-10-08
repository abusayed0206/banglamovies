"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "../components/SearchResults";

interface SearchFormProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

function SearchForm({ initialQuery, onSearch }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
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
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [finalQuery, setFinalQuery] = useState(query);

  useEffect(() => {
    setFinalQuery(query);
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setFinalQuery(newQuery);
    router.push(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <SearchForm initialQuery={query} onSearch={handleSearch} />
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
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
