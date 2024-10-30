import React from 'react';
import './home.css'; // Import the CSS file
import buksuLogo from '../assets/buksuLogo.jpg'; // Adjust the path based on your project structure

const Home = () => {
  const loginwithgoogle = ()=>{
    window.open("http://localhost:8000/auth/google/callback","_self")
}
  return (
    
    <div className="home-container">
      {/* Logo container */}
      <div className="logoContainer">
        <img src={buksuLogo} alt="BukSU Logo" />
      </div>
       {/* Title container */}
       <div className="titleContainer">
        <h1>GEMBS</h1>
        <p>
          Find the equipment you need right here <br />
          Borrow wisely, return timely.
        </p>
        <button className='login-with-google-btn' onClick={loginwithgoogle}>
                    Continue With Google
                </button>
      </div>
    </div>
  );
};

export default Home;
