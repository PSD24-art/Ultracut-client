function AboutTeam() {
  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN CARD */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10 space-y-12">
          {/* ABOUT TEAM SECTION */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* IMAGE */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="bg-white border rounded-xl shadow-md p-6">
                <img
                  src="https://cpimg.tistatic.com//144922/15/template_photo_11.png"
                  alt="Ultracut Team"
                  loading="lazy"
                  className="max-h-64 w-auto object-contain"
                />
              </div>
            </div>

            {/* TEXT */}
            <div className="w-full md:w-1/2 space-y-4">
              <h4 className="text-sm font-semibold highlighted-text uppercase tracking-wide">
                About us
              </h4>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Team, Our Power House
              </h2>

              <p className="text-gray-700 text-base leading-relaxed">
                A highly energetic and enthusiastic team gives us high
                confidence and the ability to serve the market and fulfill
                demands for laser cutting machines like CNC Fiber Laser Cutting
                Machine, CNC Laser Metal Cutting Machine, Fiber Metal Laser
                Cutting Machine, Automatic Fiber Laser Cutting Machine, etc.
                Each member of our team holds expertise in their work, and it
                gets reflected in our consistently increasing growth rate and
                achievements.
              </p>

              <div>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold highlighted-text hover:text-pink-500 transition"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>

          {/* FACTS / STRENGTHS AREA */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                "https://cpimg.tistatic.com//144922/15/template_photo_12.png",
                "https://cpimg.tistatic.com//144922/15/template_photo_13.png",
                "https://cpimg.tistatic.com//144922/15/template_photo_14.png",
                "https://cpimg.tistatic.com//144922/15/template_photo_15.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md p-6 flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Ultracut Fact ${i + 1}`}
                    loading="lazy"
                    className="w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[220px] h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutTeam;
