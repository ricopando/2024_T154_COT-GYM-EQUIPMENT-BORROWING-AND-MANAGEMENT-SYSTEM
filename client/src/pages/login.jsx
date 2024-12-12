import React, { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import ReCAPTCHA from "react-google-recaptcha";
import { CgGym } from "react-icons/cg";
import "../pages/style/style.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  const recaptchaRef = useRef(null);

  const validateInputs = () => {
    let isValid = true;

    // Email Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password Validation
    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Reset reCAPTCHA if there's any validation error
    if (!isValid) {
      recaptchaRef.current.reset();
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recaptchaToken) {
      setLoginError("Please complete the reCAPTCHA.");
      return;
    }

    if (validateInputs()) {
      setLoading(true);
      setLoginError(""); // Reset previous login error
      try {
        const response = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, recaptchaToken }),
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok && data.message.includes("login successful")) {
          if (data.user.role === "Admin" || data.user.role === "SuperAdmin") {
            // Navigate to Admin Dashboard
            window.location.href = "/dashboard";
          } else {
            // Navigate to User Dashboard
            window.location.href = "/home";
          }
        } else {
          setLoginError(data.message || "Incorrect email or password.");
          recaptchaRef.current.reset(); // Reset reCAPTCHA on login error
        }
      } catch (error) {
        setLoginError("Network error. Please try again later.");
        console.error("Error during login:", error);
        recaptchaRef.current.reset(); // Reset reCAPTCHA on network error
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleRecaptchaChange = (token) => {
    console.log("reCAPTCHA token:", token);
    setRecaptchaToken(token);
  };

  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/auth/google", "_self");
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gray-100 flex justify-center items-center dark:bg-slate-950 dark:text-white duration-200">
      <div className="h-[800px] w-[700px] bg-primary absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-8"></div>
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-8xl p-4 sm:p-20 min-h-[40vh] md:min-h-screen animate-fadeIn">
        <div className="relative z-10 max-w-4xl animate-slideIn flex-1 mb-6 md:mb-0">
          <h3
            className="font-bold mb-3 ml-3 text-primary text-left text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-shadow"
            style={{
              textTransform: "uppercase",
              fontFamily: "Poppins, sans-serif",
              lineHeight: "3.8rem",
            }}
          >
            Gym Equipment Management and Borrowing System
          </h3>
          <p
            className="text-black text-left text-sm sm:text-base md:text-xl opacity-90 animate-fadeInDelayed ml-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Find the equipment you need right here.
            <br />
            Borrow wisely, return timely.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:hover:bg-primary hover:text-white relative shadow-lg duration-300 group max-w-md w-full mx-4 rounded-2xl p-5 transition-transform transform hover:-translate-y-1 hover:shadow-2xl flex-1">
          <div className="text-center text-primary group-hover:text-primary flex items-center justify-center">
            <CgGym size="100" style={{ marginBottom: "0rem" }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-primary group-hover:text-primary flex items-center justify-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              marginBottom: "1rem",
              marginTop: "0rem",
            }}
          >
            GEMBS
          </h1>

          {loginError && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
                aria-label="Email address"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2">{emailErrorMessage}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                aria-label="Password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">
                  {passwordErrorMessage}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                className="transform scale-90 sm:scale-100"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-6 h-12 text-white font-bold rounded-lg ${
                loading ? "bg-primary" : "bg-primary hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-500">or</span>
              <hr className="flex-grow  border-gray-300" />
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
            >
              <FcGoogle className="mr-3" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-0">
              Not your computer? Use a private browsing window to login.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
