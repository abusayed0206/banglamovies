// app/imdb/page.tsx

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface MediaData {
    id: number;
    title: string;
    release_date: string;
    backdrop_path: string | null;
    overview: string;
}

const ImdbPage = () => {
    const [tmdbId, setTmdbId] = useState('')
    const [type, setType] = useState('movie')
    const [data, setData] = useState<MediaData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/byimdbid/${type}/tt${tmdbId}`)
            const result = await response.json()

            if (response.ok) {
                setData(result)
            } else {
                setError(result.error || 'An error occurred')
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handlePosterClick = () => {
        if (data) {
            router.push(`/imdb/${type}/${data.id}`)
        }
    }

    return (
        <div className="flex text-black justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Search IMDb Movie or Show</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="type" className="block text-lg font-medium">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full mt-2 p-2 border rounded-md"
                        >
                            <option value="movie">Movie</option>
                            <option value="tv">TV Show</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tmdbId" className="block text-lg font-medium">TMDb ID (without tt)</label>
                        <input
                            id="tmdbId"
                            type="text"
                            value={tmdbId}
                            onChange={(e) => setTmdbId(e.target.value)}
                            className="w-full mt-2 p-2 border rounded-md"
                            placeholder="Enter TMDb ID"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                    >
                        {loading ? 'Loading...' : 'Search'}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

                {data && !loading && (
                    <div className="mt-6 text-center">
                        <h2 className="text-xl font-semibold">{data.title}</h2>
                        <p className="text-sm text-gray-500">{data.release_date}</p>

                        <div className="mt-4">
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${data.backdrop_path}`}
                                alt={data.title}
                                width={500}
                                height={256}
                                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                onClick={handlePosterClick}
                            />


                        </div>

                        <div className="mt-4">
                            <p className="text-lg font-medium">Overview</p>
                            <p className="text-lg font-medium">{data.overview}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImdbPage
