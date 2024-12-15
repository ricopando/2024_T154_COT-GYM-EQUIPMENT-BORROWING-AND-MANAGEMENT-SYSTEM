import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "./Hero";
import Developers from "./Developer";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./TopProducts";
import Banner from "./Banner";
import Testimonials from "./Testimonials";
import Footer from "./Footer";


const LandingPage = () => {
    const [orderPopup, setOrderPopup] = React.useState(false);

    const handleOrderPopup = () => {
      setOrderPopup(!orderPopup);
    };
    React.useEffect(() => {
      AOS.init({
        offset: 100,
        duration: 800,
        easing: "ease-in-sine",
        delay: 100,
      });
      AOS.refresh();
    }, []);
  
    return (
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar handleOrderPopup={handleOrderPopup} />
        <Hero handleOrderPopup={handleOrderPopup} />
        <Developers />
        <TopProducts handleOrderPopup={handleOrderPopup} />
        <Banner />
        <Testimonials />
        <Footer />
      </div>
    );
};

export default LandingPage;
