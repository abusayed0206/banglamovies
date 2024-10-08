import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex flex-col items-center mt-4">
      <a href="https://www.themoviedb.org/" className="mb-2">
        <Image
          src="/tmdb.svg"
          alt="TMDB Logo"
          width={100}
          height={100}
          className="shadow-md"
        />
      </a>
      <p className="text-oldlace text-center">
        কৃতজ্ঞতা স্বীকারঃ এই ওয়েবসাইটটি TMDB API ব্যবহার করে কিন্তু TMDB দ্বারা
        এন্ডোর্স বা সার্টিফাইড না! সব ধরনের তথ্য TMDB থেকে নেয়া হয়েছে।
      </p>
      <p className="text-oldlace text-center">
        সোর্স কোড:{" "}
        <a
          className="text-oldlace text-xl"
          href="https://github.com/abusayed0206/banglamovies/"
          target="_blank"
        >
          গিটহাব
        </a>
        <br />
      </p>
    </div>
  );
};

export default Footer;
