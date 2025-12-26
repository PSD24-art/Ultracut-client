import Banner from "../components/Banner";
import ShopByBrands from "../components/ShopByBrands";
import Consumables from "../components/Consumables";
import Contact from "../components/Contact";
import UltracutIntro from "../components/UltracutIntro";
import AboutTeam from "./static/AboutTeam";
import QualityInfrastructure from "./static/QualityInfrastructure";
import HeadSelector from "../components/HeadSelector";

function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Banner */}
      <Banner />
      {/* Shop by Brands */}
      <ShopByBrands />
      {/* Example consumables / other sections */}
      <Consumables />
      <UltracutIntro />
      <HeadSelector />

      <AboutTeam />
      <QualityInfrastructure />
      <Contact />
      {/* <CompanyProfile /> */}
    </div>
  );
}

export default Home;
