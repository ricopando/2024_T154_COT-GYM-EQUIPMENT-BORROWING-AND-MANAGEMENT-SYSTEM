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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

          {/* Dashboard Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Total Transactions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Transactions
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {totalTransactions}
              </p>
            </div>

            {/* Equipment Count Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Equipment
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {equipmentCount}
              </p>
            </div>

            {/* Pending Borrows Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Pending Borrow Requests
              </h2>
              <p className="text-3xl font-bold text-orange-500">
                {pendingBorrowCount}
              </p>
            </div>

            {/* Returned Borrows Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Returned Borrow Requests
              </h2>
              <p className="text-3xl font-bold text-green-500">
                {returnedBorrowCount}
              </p>
            </div>

            {/* Approved Borrows Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Approved Borrow Requests
              </h2>
              <p className="text-3xl font-bold text-green-500">
                {approvedBorrowCount}
              </p>
            </div>

            {/* Weather Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Current Weather
              </h2>
              {weatherData ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={weatherData.current.condition.icon}
                    alt={weatherData.current.condition.text}
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {weatherData.current.temp_c}°C
                    </p>
                    <p className="text-gray-600">
                      {weatherData.current.condition.text}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading weather data...</p>
              )}
            </div>

            {/* Advice Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Daily Advice
              </h2>
              <div className="flex flex-col">
                <p className="text-gray-600 italic">
                  "{adviceData.slip.advice}"
                </p>
                <button
                  onClick={handleFetchAdvice}
                  className="mt-4 text-sm text-blue-500 hover:text-blue-700 self-end"
                  aria-label="Get new advice"
                >
                  Get New Advice
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
