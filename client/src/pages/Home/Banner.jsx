import React from "react";
import BannerImg from "../../assets/bannerIMG.jpg";
import { MdVerifiedUser } from "react-icons/md";
import { MdHandyman } from "react-icons/md";
import { MdSecurity } from "react-icons/md";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0 bg-primary">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* image section */}
          <div data-aos="zoom-in">
            <img
              src={BannerImg}
              alt=""
              className="max-w-[800px] h-[600px]  w-full mx-auto  object-cover"
            />
          </div>

          {/* text details section */}
          <div className="flex flex-col justify-center gap-6 sm:pt-0">
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center gap-4">
                <MdVerifiedUser className="text-5xl h-14 w-14 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                <p className="text-white text-lg">
                  Users must present valid identification{" "}
                </p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <MdHandyman className="text-5xl h-14 w-14 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                <p className="text-white text-lg">
                  Users are responsible for the proper care of borrowed
                  equipment.
                </p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <MdSecurity className="text-5xl h-14 w-14 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400" />
                <p className="text-white text-lg">
                  Users will be held responsible for any damage or loss of
                  equipment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
