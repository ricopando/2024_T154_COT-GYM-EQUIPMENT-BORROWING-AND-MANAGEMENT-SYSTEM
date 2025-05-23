import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { FaExchangeAlt } from "react-icons/fa"; // For Total Transactions
import { FaTools } from "react-icons/fa"; // For Total Equipment
import { FaClock } from "react-icons/fa"; // For Pending Requests
import { FaCheckCircle } from "react-icons/fa"; // For Returned Requests
import { FaThumbsUp } from "react-icons/fa"; // For Approved Requests

// Register ChartJS components
ChartJS.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [pendingBorrowCount, setPendingBorrowCount] = useState(0);
  const [returnedBorrowCount, setReturnedBorrowCount] = useState(0);
  const [approvedBorrowCount, setApprovedBorrowCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [adviceData, setAdviceData] = useState({ slip: { advice: "" } });
  const [monthlyData, setMonthlyData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    transactions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });
  const [yearlyData, setYearlyData] = useState({
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    transactions: [0, 0, 0, 0, 0, 0],
  });

  // Bar Chart Data (Monthly)
  const barChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Monthly Transactions",
        data: monthlyData.transactions,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data (Yearly)
  const lineChartData = {
    labels: yearlyData.labels,
    datasets: [
      {
        label: "Yearly Transactions",
        data: yearlyData.transactions,
        fill: false,
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.1,
      },
    ],
  };

  const barAndLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/borrow-items",
          {
            withCredentials: true,
          }
        );

        // Initialize monthly counts array with zeros
        const monthlyCounts = new Array(12).fill(0);

        // Process each transaction
        response.data.forEach((transaction) => {
          const month = new Date(transaction.createdAt).getMonth(); // 0-11
          monthlyCounts[month]++;
        });

        setMonthlyData((prev) => ({
          ...prev,
          transactions: monthlyCounts,
        }));
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    const fetchYearlyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/borrow-items",
          {
            withCredentials: true,
          }
        );

        // Initialize yearly counts array with zeros
        const yearlyCounts = new Array(6).fill(0);

        // Process each transaction
        response.data.forEach((transaction) => {
          const year = new Date(transaction.createdAt).getFullYear();
          const yearIndex = year - 2019; // Assuming we want data from 2019-2024
          if (yearIndex >= 0 && yearIndex < 6) {
            yearlyCounts[yearIndex]++;
          }
        });

        setYearlyData((prev) => ({
          ...prev,
          transactions: yearlyCounts,
        }));
      } catch (error) {
        console.error("Error fetching yearly data:", error);
      }
    };

    fetchEquipmentCount();
    fetchAllBorrowTransactions();
    fetchWeatherData();
    handleFetchAdvice();
    fetchMonthlyData();
    fetchYearlyData();
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
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-4xl font-bold text-black dark:text-white relative inline-block
              after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
              after:mt-2 after:rounded-full"
            >
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
              Monitor and manage your system performance
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {totalTransactions}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <FaExchangeAlt className="text-blue-500 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Equipment
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {equipmentCount}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <FaTools className="text-green-500 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Weather & Advice Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {weatherData ? (
              <div className="flex items-center space-x-4">
                <img
                  src={weatherData.current.condition.icon}
                  alt={weatherData.current.condition.text}
                  className="w-12 h-12"
                />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {weatherData.current.temp_c}°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {weatherData.current.condition.text}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Loading weather...
              </p>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{adviceData.slip.advice}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Status Cards */}
        <div className="lg:col-span-1">
          {/* Request Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-[340px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request Status
            </h3>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900 rounded-lg">
                      <FaClock className="text-orange-500 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pending
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {pendingBorrowCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <FaCheckCircle className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Returned
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {returnedBorrowCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900 rounded-lg">
                      <FaThumbsUp className="text-green-500 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Approved
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {approvedBorrowCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-[340px] flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Transactions
              </h3>
              <div className="flex-1">
                <Bar data={barChartData} options={barAndLineOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-[340px] flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Yearly Transactions
              </h3>
              <div className="flex-1">
                <Line data={lineChartData} options={barAndLineOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
