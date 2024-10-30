import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap
import React from "react";
import "./UserPage.css";
import buksuLogo from "../assets/buksuLogo.jpg";
import welcomeIMG from "../assets/v1.jpg";

function UserPage() {
  return (
    <div>
      {/*NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img className="mb-2" src={buksuLogo} alt="" />
            <span className="name">GEMBS</span>
          </a>
          <button
            className="navbar-toggler mb-4"
            type="button"
            data-bs-toggle="collapse"
            // data-bs-target="#navbarSupportedContent"
            // aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse" /*id="navbarSupportedContent"*/
          >
            <form className="d-flex mb-2">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                id="searchBox"
              />
              <button className="searchButton" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      {/* END */}

      <div className="container-fluid">
        <div className="row">
          {/* WELCOME PIC */}
          <div className="col-lg-6 col-md-12 col-sm-12" id="picContainer">
            <img className="welcomeIMG" src={welcomeIMG} alt="" />
          </div>
          {/* END */}

          {/* SYSTEM NAME,INFO AND BUTTON */}
          <div className="col-lg-6 col-md-12 col-sm-12" id="textContainer">
            <p className="systemName">
              GYM EQUIPMENT MANAGEMENT AND <br />
              BORROWING SYSTEM
            </p>
            <p className="infoText">
              This system is designed to streamline the process of borrowing and
              returning gym equipment. Here, you can easily view available
              equipment, reserve equipment in advance, borrow equipment directly
              from the system, and record equipment returns to update inventory.
              Let's get you moving!
            </p>
            <button className="seeMoreBTN" type="submit">
              See more
            </button>
          </div>
          {/* END */}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
