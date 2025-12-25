import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const images = [
  "https://cpimg.tistatic.com/144922/15/template_photo_4.jpg",
  "https://cpimg.tistatic.com/144922/15/template_photo_3.jpg",
  "https://cpimg.tistatic.com/144922/15/template_photo_2.jpg",
];

function Banner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="w-full py-6 main-bg-color">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-300 shadow-sm flex flex-col items-center">
          {/* TEXT */}
          <div className="w-full p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Powerful Fiber Laser Consumables
            </h1>
            <p className="mt-2 text-gray-600">
              High Precision • Fast Delivery • Trusted Brands
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#shop"
                className="inline-block px-5 py-2 btn-color text-white rounded-md text-sm font-medium"
              >
                Shop Now
              </a>
              <Link
                to="/contact"
                className="inline-block px-5 py-2 border border-gray-300 rounded-md text-sm text-pink-700"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* SLIDER */}
          <div
            className="w-full p-4 bg-gray-50"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="w-full h-58 sm:h-65 md:h-90 lg:h-105 overflow-hidden rounded-md bg-gray-200">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                }}
              >
                {images.map((src, i) => (
                  <div key={i} className="w-full h-full flex-shrink-0">
                    <img
                      src={src}
                      alt={`Banner ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
