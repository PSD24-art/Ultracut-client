import { useNavigate } from "react-router-dom";

function SearchResults({ results, onClose }) {
  const navigate = useNavigate();

  if (!results.length) {
    return <div className="p-4 text-sm text-gray-500">No products found</div>;
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {results.map((item) => (
        <div
          key={item._id}
          onClick={() => {
            navigate(`/products/${item.slug}`, { replace: true });
            onClose();
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
        >
          <img
            src={item.images?.[0]}
            alt={item.title}
            className="w-10 h-10 object-contain bg-gray-50 rounded"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {item.title}
            </span>
            <span className="text-xs text-gray-500">₹{item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
