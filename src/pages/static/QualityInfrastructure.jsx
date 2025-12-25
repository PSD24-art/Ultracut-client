function QualityInfrastructure() {
  return (
    <section className="w-full secondary-bg-color">
      {/* IMAGE SECTION */}
      <div className="relative w-full">
        <img
          src="https://tiimg.tistatic.com/catalogs/template157406/para-bg.jpg"
          alt="Laser Cutting Infrastructure"
          className="w-full h-[300px] sm:h-[380px] md:h-[460px] object-cover"
          loading="lazy"
        />
      </div>

      {/* FLOATING CONTENT CARDS */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 -mt-24 sm:-mt-32 md:-mt-36 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QUALITY CONTROL CARD */}
          <div className="secondary-bg-color rounded-2xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-extrabold highlighted-text mb-4">
              Quality Control
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              We aim at delivering the best. And to do so, we follow a number of
              planned approaches and methodologies in our business process. We
              have a Total Quality Management policy, which our team members
              sincerely follow to help us deliver a commendable range of laser
              cutting machines. By following this policy, we select the finest
              materials and employ the right techniques to develop a remarkable
              range of machines.
            </p>
          </div>

          {/* INFRASTRUCTURE CARD */}
          <div className="bg-gray-100 rounded-2xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-extrabold highlighted-text mb-4">
              Infrastructure
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              We operate at an international level and easily take on and fulfil
              global demands because of the support we have from our
              infrastructure. It is loaded with cutting-edge facilities that
              enhance our efficiency and help us deliver our CNC Laser Metal
              Cutting Machine, CNC Fiber Laser Cutting Machine, Fiber Metal
              Laser Cutting Machine, Automatic Fiber Laser Cutting Machine, and
              many other machines to customers within the minimal possible time
              period.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QualityInfrastructure;
