function UltracutIntro() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 sm:p-10 space-y-8">
          {/* TOP CERTIFICATION CARD */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-6">
              {[
                "https://cpimg.tistatic.com//144922/15/template_photo_6.png",
                "https://cpimg.tistatic.com//144922/15/template_photo_7.png",
                "https://cpimg.tistatic.com//144922/15/template_photo_8.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="h-14 w-20 flex items-center justify-center bg-gray-50 border rounded-xl shadow-sm"
                >
                  <img
                    src={src}
                    alt={`Ultracut Certification ${i + 1}`}
                    loading="lazy"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="text-sm sm:text-base font-semibold text-gray-700 bg-blue-50 px-5 py-2 rounded-full w-fit">
              Manufacturer • Supplier • Exporter
            </div>
          </div>

          {/* HEADING */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight max-w-4xl">
            Trusted company that deals in{" "}
            <span className="highlighted-text">quality-made</span> products
          </h2>

          {/* DESCRIPTION BLOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base leading-relaxed">
            <p>
              Ultracut Innovation Technology is a reliable support to businesses
              that require hi-tech cutting machines to perform their several
              operations. We are one of the largest manufacturers and exporters
              of Cutting Machines that are used in various industries.
            </p>

            <p>
              We regularly supply CNC Fiber Laser Cutting Machine, Automatic
              Fiber Laser Cutting Machine, CNC Laser Metal Cutting Machine,
              Fiber Metal Laser Cutting Machine, and many other machines to
              customers in different models, sizes, and technical
              specifications.
            </p>

            <p>
              These are engineered by assembling strong motors with sharp
              cutting blades, components, and spares as per international
              standards. The quality we design makes our cutting machines
              extensively demanded in markets across the world.
            </p>

            <p>
              Their low maintenance, high working speed, power efficiency, and
              durability further enhance the demand and make us enjoy good
              business in the market. Furthermore, we value time and ensure to
              deliver our modern cutting machines as early as possible, after
              confirmation of the orders.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <a
              href="/company-information.html"
              className="inline-flex items-center gap-2 text-base font-semibold highlighted-text hover:text-blue-700 transition"
            >
              Read More
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UltracutIntro;
