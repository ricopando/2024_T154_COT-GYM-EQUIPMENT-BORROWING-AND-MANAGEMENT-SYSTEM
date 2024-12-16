import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/AdminNavbar";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { FaExchangeAlt } from "react-icons/fa"; // For Total Transactions
import { FaTools } from "react-icons/fa"; // For Total Equipment
import { FaClock } from "react-icons/fa"; // For Pending Requests
import { FaCheckCircle } from "react-icons/fa"; // For Returned Requests
import { FaThumbsUp } from "react-icons/fa"; // For Approved Requests

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const Dashboard = () => {
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [pendingBorrowCount, setPendingBorrowCount] = useState(0);
  const [returnedBorrowCount, setReturnedBorrowCount] = useState(0);
  const [approvedBorrowCount, setApprovedBorrowCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [adviceData, setAdviceData] = useState({ slip: { advice: "" } });

  // Add chart data
  const chartData = {
    labels: ["Approved", "Returned", "Pending"],
    datasets: [
      {
        data: [approvedBorrowCount, returnedBorrowCount, pendingBorrowCount],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)", // green for approved
          "rgba(59, 130, 246, 0.6)", // blue for returned
          "rgba(249, 115, 22, 0.6)", // orange for pending
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(249, 115, 22, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Borrow Requests Distribution",
        font: {
          size: 16,
        },
      },
    },
  };

  // Move fetchAdvice outside of useEffect
  const handleFetchAdvice = async () => {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice", {
        withCredentials: false,
        headers: { Accept: "application/json" },
      });
      setAdviceData(response.data);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdviceData({ slip: { advice: "Failed to load advice." } });
    }
  };

  useEffect(() => {
    const fetchEquipmentCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/equipment");
        setEquipmentCount(response.data.length);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setEquipmentCount(0);
      }
    };

    const fetchAllBorrowTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/borrow-items",
          {
            withCredentials: true,
          }
        );

        const validTransactions = response.data.filter(
          (item) => item.equipment && item.equipment.length > 0
        );

        // Set total transactions count
        setTotalTransactions(validTransactions.length);

        // Count transactions by status
        const counts = validTransactions.reduce(
          (acc, item) => {
            switch (item.status) {
              case "Pending":
                acc.pending++;
                break;
              case "Returned":
                acc.returned++;
                break;
              case "Approved":
                acc.approved++;
                break;
              default:
                break;
            }
            return acc;
          },
          { pending: 0, returned: 0, approved: 0 }
        );

        setPendingBorrowCount(counts.pending);
        setReturnedBorrowCount(counts.returned);
        setApprovedBorrowCount(counts.approved);
      } catch (error) {
        console.error("Failed to fetch borrow transactions:", error);
        setTotalTransactions(0);
        setPendingBorrowCount(0);
        setReturnedBorrowCount(0);
        setApprovedBorrowCount(0);
      }
    };

    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&q=Malaybalay,Bukidnon,Philippines&aqi=no`,
          { withCredentials: false }
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
      }
    };

    fetchEquipmentCount();
    fetchAllBorrowTransactions();
    fetchWeatherData();
    handleFetchAdvice();
  }, []);

  // Add this useEffect for auto-generating advice
  useEffect(() => {
    // Initial fetch
    handleFetchAdvice();

    // Set up interval for fetching every 5 seconds
    const intervalId = setInterval(handleFetchAdvice, 5000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="text-left mt-8 mb-10">
            <h1
              className="text-5xl font-bold text-black dark:text-white relative inline-block
              after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
              after:mt-2 after:rounded-full"
            >
              DASHBOARD
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
              Monitor and manage your system overview
            </p>
          </div>

          {/* Dashboard Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* First Row - 3 Cards */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Total Transactions
                </h2>
                <FaExchangeAlt className="text-primary text-2xl" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {totalTransactions}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Total Equipment
                </h2>
                <FaTools className="text-secondary text-2xl" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {equipmentCount}
              </p>
            </div>

            {/* Weather & Advice Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                {/* Weather Section */}
                {weatherData ? (
                  <div className="flex items-center">
                    <img
                      src={weatherData.current.condition.icon}
                      alt={weatherData.current.condition.text}
                      className="w-12 h-12 mr-3"
                    />
                    <div>
                      <p className="text-2xl font-bold text-black">
                        {weatherData.current.temp_c}°C
                      </p>
                      <p className="text-sm text-black">
                        {weatherData.current.condition.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-black text-sm">Loading weather...</p>
                )}

                {/* Divider */}
                <div className="h-12 w-px bg-gray-200 mx-6"></div>

                {/* Advice Section */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm italic mb-2">
                    "{adviceData.slip.advice}"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Pending Borrow Requests
                </h2>
                <FaClock className="text-yellow-500 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {pendingBorrowCount}
              </p>
            </div>

            {/* Second Row - 3 Cards */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Returned Borrow Requests
                </h2>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {returnedBorrowCount}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Approved Borrow Requests
                </h2>
                <FaThumbsUp className="text-green-500 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {approvedBorrowCount}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
