import { Link } from "react-router-dom";

function Banner() {
  // Use a background image or product image. For now we keep placeholder content.
  return (
    // Outer: full width background (keeps spacing)
    <section className="w-full py-6 bg-gray-50">
      {/* Inner container: on larger screens content is constrained and centered (LinkedIn-like) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col items-center">
          {/* Left: textual content */}
          <div className="w-full  p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Powerful Fiber Laser Consumables
            </h1>
            <p className="mt-2 text-gray-600">
              High Precision • Fast Delivery • Trusted Brands
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#shop"
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              >
                Shop Now
              </a>
              <Link
                to="/contact"
                className="inline-block px-5 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Right: hero image (hide on very small screens) */}
          <div className="w-full p-4 flex justify-center items-center bg-gray-50">
            <div className="w-full h-44 md:h-90 bg-gray-200 rounded-md flex justify-center items-center">
              {/* Replace with <img src="..." /> */}
              <span className="text-gray-400">Banner Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
