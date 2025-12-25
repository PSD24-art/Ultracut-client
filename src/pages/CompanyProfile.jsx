function CompanyProfile() {
  return (
    <section className="w-full bg-white">
      {/* ================= HERO IMAGE ================= */}
      <div className="w-full">
        <img
          src="https://cpimg.tistatic.com//144922/15/template_photo_10.jpg"
          alt="Ultracut Innovation Technology Manufacturing Facility"
          className="w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
          loading="lazy"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* HEADING */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Company Profile
          </h1>
        </div>

        {/* INTRO + VIDEO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* TEXT */}
          <div className="lg:col-span-2 space-y-5 text-gray-700 text-base leading-relaxed">
            <p>
              With excellence and proficiency in our work approaches, we,
              <strong> Ultracut Innovation Technology</strong>, have emerged as
              a prominent name in the laser cutting machine industry. Since our
              establishment in <strong>2013</strong>, we have been consistently
              delivering reliable and high-performance machines such as{" "}
              <strong>Automatic Fiber Laser Cutting Machines</strong>,
              <strong> CNC Fiber Laser Cutting Machines</strong>,
              <strong> CNC Laser Metal Cutting Machines</strong>, and
              <strong> Fiber Metal Laser Cutting Machines</strong>.
            </p>

            <p>
              We operate from our <strong>Vadodara, Gujarat (India)</strong>
              based facility, which is equipped with modern infrastructure,
              advanced tools, and state-of-the-art machinery. Our experienced
              professionals utilize advanced technologies to manufacture cutting
              machines that meet global quality standards.
            </p>

            <p>
              Continuous research and development is a core part of our
              operations. These efforts help us enhance manufacturing
              efficiency, optimize processes, and introduce technologically
              advanced laser cutting solutions to our customers worldwide.
            </p>
          </div>

          {/* VIDEO */}
          <div className="w-full">
            <video controls loop className="w-full rounded-xl shadow-lg">
              <source
                src="https://tiimg.tistatic.com/video/flv/catalogs/144922/video144922_new_hindi_10_001.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        {/* ================= KEY FACTS ================= */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
            Key Facts About Ultracut Innovation Technology
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["Nature of Business", "Manufacturer, Supplier, and Exporter"],
              ["Year of Establishment", "2013"],
              ["Location", "Vadodara, Gujarat, India"],
              ["No. of Employees", "15"],
              ["GST Number", "24AAGFU3117J1Z9"],
              ["IE Code", "AAGFU3117J"],
              ["Brand Names", "Ultracut Innovation, Axis India"],
              ["Export Percentage", "50%"],
              ["Banker", "Bank of Baroda"],
            ].map(([label, value], i) => (
              <div
                key={i}
                className="flex justify-between items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5"
              >
                <span className="font-semibold text-gray-800">{label}</span>
                <span className="text-gray-700 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyProfile;
