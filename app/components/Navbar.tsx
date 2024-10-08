import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4  rounded-md shadow-lg">
      <div className="container mx-auto px-4">
        {/* Flex container for large devices */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          {/* Social Links (on large screens they will appear on the right) */}
          <div className="flex justify-center lg:justify-start space-x-6">
            <a
              href="https://letterboxd.com/abusayed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  justify-center w-12 h-12 rounded  hover:bg-orange-500 transition-colors duration-300"
            >
              <Image
                src="/lb.svg"
                alt="Letterboxd Logo"
                width={50}
                height={50}
              />
            </a>

            <a
              href="https://trakt.tv/users/lrs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded bg-black hover:bg-red-600 transition-colors duration-300"
            >
              <Image
                src="/trakt.svg"
                alt="Trakt.tv Logo"
                width={40}
                height={50}
              />
            </a>
            <a
              href="https://www.themoviedb.org/u/abusayed0206"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded bg-white hover:bg-green-600 transition-colors duration-300"
            >
              <Image src="/tmdb.svg" alt="TMDB Logo" width={40} height={40} />
            </a>
          </div>

          {/* Main button (on large screens it will appear on the left) */}
          <div className="flex justify-center lg:justify-end">
            <Link href="/" passHref>
              <button className="bg-[#dbe918] text-black font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-[#1ed760] transition-colors duration-300 text-2xl">
                বাংলা চলচ্চিত্রের সংগ্রহশালা
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
