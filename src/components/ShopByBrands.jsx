const brands = [
  { id: 1, name: "Brand A", image: "" },
  { id: 2, name: "Brand B", image: "" },
  { id: 3, name: "Brand C", image: "" },
  { id: 4, name: "Brand D", image: "" },
];

function ShopByBrands() {
  return (
    <section id="brands" className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Shop by Brands
          </h2>
          <a
            href="#shop"
            className="text-sm text-blue-600 hover:underline hidden sm:inline"
          >
            View All
          </a>
        </div>

        {/* 4 cards - responsive */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3">
                {/* replace with <img src={b.image} alt={b.name} /> */}
                <span className="text-sm text-gray-400">Logo</span>
              </div>
              <div className="text-sm font-medium text-gray-700">{b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ShopByBrands;
