import { consumables } from "../data/consumablesData";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
export default function Consumables() {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-full py-10 bg-white" id="consumables">
        {/* Inner container: matches layout of Banner + Brands */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800">
            Fiber Laser Machine Consumables
          </h1>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 gap-x-8">
            {consumables.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/consumables/${item.slug}`)}
                className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Title */}
                <div className="p-3">
                  <h2 className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {item.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
