import React from "react";
import Image1 from "../../assets/hero/sport.png";
import Image2 from "../../assets/hero/furniture.png";
import Image3 from "../../assets/hero/electronic.png";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import BackgroundPattern from "../../assets/bgpattern.jpg";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Sports Equipment",
    description:
      "Sports equipment encompasses a wide range of items used to participate in various sports. These items can be categorized into several types based on their function and the sport they are associated with:",
  },
  {
    id: 2,
    img: Image2,
    title: "Furniture",
    description:
      "Furniture refers to movable objects intended to support various human activities such as seating, eating, and sleeping. Additionally, furniture serves to hold objects at a convenient height for work (as horizontal surfaces above the ground), or to store things.",
  },
  {
    id: 3,
    img: Image3,
    title: "Electronic",
    description:
      "Electronics are devices or systems that involve the controlled flow of electrons or other charged particles. They are used in a vast array of applications, from simple household items to complex industrial systems.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[800px] flex justify-center items-center dark:bg-slate-950 dark:text-white duration-200">
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider
          {...settings}
          style={{
            backgroundColor: "#12203A",
            color: "white",
            paddingLeft: "3rem",
          }}
        >
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <Link
                      to="/catalog"
                      className="hover:scale-105 duration-200 text-white py-2 px-4 rounded"
                      style={{
                        backgroundColor: "#96ABD8",
                        fontWeight: "normal",
                      }}
                    >
                      BORROW NOW!
                    </Link>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
