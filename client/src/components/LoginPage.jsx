import { useState } from "react";
// IMPORTS COMPONENTS HERE
import buksuLogo from "../assets/buksuLogo.jpg";
// CSS
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="container">
      <div className="row">
        {/* LOGO CONTAINER */}
        <div className="col-lg-5 col-md-4 col-sm-12" id="logoContainer">
          <img id="logo" src={buksuLogo} alt="" />
        </div>

        {/* LOGIN AND TEXT CONTAINER */}
        <div className="col-lg-7 col-md-4 col-sm-12" id="titleContainer">
          <h1>GEMBS</h1>
          <p>
            Find the equipment you need right here <br /> Borrow wisely, return
            timely.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
