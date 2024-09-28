"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function EditPage({ params }: { params: { tmdb_id: string } }) {
  const [data, setData] = useState({ FDL: "", PDL: "" });
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    // Set loading to true before starting the fetch
    setLoading(true);
    fetch(`/api/mdbd/${params.tmdb_id}/edit`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(() => setLoading(false)); // Handle error, set loading to false
  }, [params.tmdb_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when saving the data

    const res = await fetch(`/api/mdbd/${params.tmdb_id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setLoading(false); // Set loading to false after successful submission
      alert(
        "সাবমিশন সফল হয়েছে। আপনি ৩ সেকেন্ডের মধ্যে মুভির পাতায় যাবেন।"
      );

      // Wait for 3 seconds before pushing to the new page
      setTimeout(() => {
        router.push(`/movie/${params.tmdb_id}`);
      }, 3000);
    } else {
      setLoading(false); // In case of an error
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div className="text-black visible min-h-screen flex flex-col">
      {/* Navbar component */}
      <Navbar />

      {/* Centered form */}
      <div className="flex flex-grow bg-gray-400 justify-center items-center">
        {/* Show loader if loading is true */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <h1 className="text-xl font-bold">
              টিএমডিবি আইডি:
              <a
                href={`https://www.themoviedb.org/movie/${params.tmdb_id}`}
                target="_blank"
                rel="noreferrer"
              >
                {params.tmdb_id}
              </a>
            </h1>
            <div>
              <label className="block">
                ফ্রি ডাউনলোড লিংক:
                <input
                  className="block border rounded-md border-gray-300 p-2 w-full"
                  value={data.FDL}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, FDL: e.target.value }))
                  }
                />
              </label>
            </div>
            <div>
              <label className="block">
                ব্যক্তিগত ডাউনলোড লিংক:
                <input
                  className="block border rounded-md border-gray-300 p-2 w-full"
                  value={data.PDL}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, PDL: e.target.value }))
                  }
                />
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              সংরক্ষণ করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
