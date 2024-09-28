import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Provider {
  logo_path: string;
  provider_name: string;
  link: string;
}

interface WatchProviderResponse {
  flatrate: Provider[];
  link: string;
}

// Fetch watch providers from your API
async function getWatchProviders(tmdb_id: string): Promise<WatchProviderResponse | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/watch/provider/${tmdb_id}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    // Return flatrate providers and the TMDB link if available
    if (data.flatrate && data.link) {
      return {
        flatrate: data.flatrate,
        link: data.link,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}

export default async function WatchProviders({ params }: { params: { tmdb_id: string } }) {
  const { tmdb_id } = params;
  const watchProviders = await getWatchProviders(tmdb_id);

  if (!watchProviders) {
    // Handle the case where no data is available
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold mb-4">এখানে স্ট্রিমিং করুনঃ</h2>
      
      <div className="flex flex-wrap justify-center mb-4">
        {watchProviders.flatrate.map((provider, index) => (
          <a
            key={index}
            href={watchProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="m-2"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
              alt={provider.provider_name}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
          </a>
        ))}
      </div>

      <p className="text-sm mt-4 flex items-center">
        স্ট্রিমিং লিংক সংগ্রহে সহযোগিতায়
        <Image src="/jw.png" alt="JustWatch" width={16} height={16} className="ml-2" />
      </p>
    </div>
  );
}
