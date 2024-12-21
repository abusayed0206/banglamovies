'use client'

import { useEffect, useState } from 'react'

const ImagePage = ({ params }: { params: { type: string; tmdbid: string } }) => {
    const { type, tmdbid } = params
    interface Image {
        file_path: string;
    }

    const [images, setImages] = useState<Image[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState<string | null>(null); // Store the copied URL

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/images/${type}/${tmdbid}`)
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                const result = await response.json()
                setImages(result)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || 'Error fetching images');
                } else {
                    setError('Error fetching images');
                }
            } finally {
                setLoading(false)
            }
        }

        fetchImages()
    }, [type, tmdbid])

    const handleImageClick = async (filePath: string) => {
        const originalUrl = `https://image.tmdb.org/t/p/original${filePath}`
        try {
            await navigator.clipboard.writeText(originalUrl);
            setCopied(originalUrl); // Set the copied URL
            setTimeout(() => {
                setCopied(null); // Clear the message after 2 seconds
            }, 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
            setCopied("Failed to copy URL"); // Display error message
            setTimeout(() => {
                setCopied(null);
            }, 2000);
        }
    };

    return (
        <div className="flex justify-center text-black items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Backdrops for {tmdbid}</h1>

                {loading ? (
                    <p className="text-center">Loading images...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image: Image, index: number) => (
                            <div key={index} className="relative group cursor-pointer">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                                    alt={`Backdrop ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg transition duration-300 ease-in-out hover:opacity-75"
                                    onClick={() => handleImageClick(image.file_path)}
                                />
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white transition duration-300 ease-in-out">
                                    <span>Copy Link</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Improved Confirmation/Error Message */}
                {copied && (
                    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg transition duration-300 ease-in-out ${copied.startsWith("Failed") ? "bg-red-500" : "bg-green-500"}`}>
                        <p className="text-sm text-white">{copied.startsWith("Failed") ? copied : "Image URL copied!"}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImagePage
export const runtime = "edge";