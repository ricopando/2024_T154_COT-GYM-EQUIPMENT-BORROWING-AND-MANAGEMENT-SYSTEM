import React from "react";
import Img1 from "../../assets/developer/johan.png";
import Img2 from "../../assets/developer/rico.png";
import Img3 from "../../assets/developer/benz.png";
import Img4 from "../../assets/developer/nikko.png";
const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Degenion, Johan Jay E.",
    color: "Backend",
    aosDelay: "0",

  },
  {
    id: 2,
    img: Img2,
    title: "Pando, Rico T.",
    color: "Project manager",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Barquilla, Benz D.",
    color: "Frontend",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Padilla, Nikko B.",
    color: "Designer",
    aosDelay: "600",
  },

];

const Developers = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
         
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Developers
          </h1>
          
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[220px] w-[150px] object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600">{data.color}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;
