import React, { MouseEvent, useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";

interface Poster {
  file_path: string;
}

interface GalleryModalProps {  
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  posters?: Poster[];
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen,
  onClose,
  children,
  posters,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posters && posters.length > 0) {
      setCurrentIndex(0); 
    }
  }, [posters]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : (posters?.length || 1) - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < (posters?.length || 1) - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white dark:bg-gray-800 w-[450px] rounded-[10px] overflow-hidden">
        {posters ? (
          <div>
            {posters.length > 0 && (
              <div className="relative">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${posters[currentIndex].file_path}`}
                  alt="মুভির পোস্টার"
                  width={450}
                  height={675}
                  className="rounded-[10px]"
                />
                <a
                  href={`https://image.tmdb.org/t/p/original${posters[currentIndex].file_path}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-black dark:bg-white text-white dark:text-black p-2 rounded-full shadow-md"
                >
                  <FaDownload size={20} />
                </a>
                <button
                  onClick={handlePrevious}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-green-500 p-2 rounded-full shadow-md"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 p-2 rounded-full shadow-md"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default GalleryModal; 