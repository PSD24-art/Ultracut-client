// src/components/HeadSelector.jsx
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  {
    title: "RayTools Laser Cutting Heads",
    items: [
      "RayTools BM110 Head",
      "RayTools BM111 Head",
      "RayTools BM06K Head",
      "RayTools BM115 Head",
      "RayTools BM114 Head",
      "RayTools BM109 Head",
      "RayTools BT220 Head",
      "RayTools BT240 Head",
    ],
  },
  {
    title: "OSPRI Laser Cutting Heads",
    items: [
      "OSPRI LC40 Head",
      "OSPRI LC80 Head",
      "OSPRI LC80 PLUS Head",
      "OSPRI LC218 Head",
      "OSPRI LC608 Head",
      "OSPRI LC808 Head",
    ],
  },
  {
    title: "WSX Laser Cutting Heads",
    items: ["WSX NC30 Head", "WSX NC63 Head", "WSX NC68 Head"],
  },
];

function slugifyHead(head) {
  return head
    .toLowerCase()
    .replace(" plus", "-plus")
    .replace(" head", "")
    .replace(/\s+/g, "-");
}

export default function HeadSelector() {
  console.log("HeadSelector rendered"); // ✅ correct place
  const navigate = useNavigate();

  return (
    <section className="w-full py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {sec.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sec.items.map((head) => {
                const slug = slugifyHead(head);

                return (
                  <div
                    key={slug}
                    onClick={() =>
                      navigate(`/spares-by-head/${slug}`, { replace: true })
                    }
                    className="cursor-pointer bg-white border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-600 text-center px-2">
                      {head}
                    </div>

                    <div className="mt-3 text-sm font-medium text-gray-800">
                      {head.replace(" Head", "")}
                    </div>

                    <div className="text-xs text-gray-500">
                      View compatible spares
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
