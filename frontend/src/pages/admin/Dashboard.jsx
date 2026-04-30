import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#8b5cf6", "#22c55e", "#3b82f6", "#f97316", "#ef4444"];

const Dashboard = () => {

  const [stats, setStats] = useState({
    revenue: 0,
    totalBookings: 0,
    rentedCars: 0,
    availableCars: 0
  });

  const [loading, setLoading] = useState(true);

  const bookingData = [
    { day: "Sun", value: 3000 },
    { day: "Mon", value: 5000 },
    { day: "Tue", value: 2000 },
    { day: "Wed", value: 4000 },
    { day: "Thu", value: 3500 },
    { day: "Fri", value: 4500 },
    { day: "Sat", value: 3800 }
  ];

  const pieData = [
    { name: "Sedan", value: 30 },
    { name: "SUV", value: 25 },
    { name: "Hatchback", value: 20 },
    { name: "Truck", value: 15 },
    { name: "Luxury", value: 10 }
  ];
function App() {
  useEffect(() => {
    socket.on("notification", (data) => {
      alert(data.message); //  simple test
    });

    return () => socket.off("notification");
  }, []);

  return <div>App</div>;
}
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/dashboard/stats"
        );
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-400 bg-black">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        Welcome to <span className="text-yellow-500">Rentora Admin</span>
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">
          <h3 className="text-gray-400 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-yellow-500 mt-2">
            ₹{stats.revenue}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">
          <h3 className="text-gray-400 text-sm">Total Bookings</h3>
          <p className="text-2xl font-bold text-yellow-500 mt-2">
            {stats.totalBookings}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">
          <h3 className="text-gray-400 text-sm">Rented Cars</h3>
          <p className="text-2xl font-bold text-yellow-500 mt-2">
            {stats.rentedCars}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">
          <h3 className="text-gray-400 text-sm">Available Cars</h3>
          <p className="text-2xl font-bold text-yellow-500 mt-2">
            {stats.availableCars}
          </p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">

          <h3 className="mb-4 text-gray-300 font-semibold">
            Weekly Bookings
          </h3>

         <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-md">

          <h3 className="mb-4 text-gray-300 font-semibold">
            Vehicle Categories
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

// const COLORS = ["#22c55e", "#eab308", "#3b82f6", "#ef4444"];

// const Dashboard = () => {

//   const API_URL = import.meta.env.VITE_API_URL;

//   const [stats, setStats] = useState({
//     revenue: 0,
//     totalBookings: 0,
//     rentedCars: 0,
//     availableCars: 0
//   });

//   const [bookingData, setBookingData] = useState([]);
//   const [pieData, setPieData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   //  Fetch ALL data together
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const statsRes = await axios.get(`${API_URL}/dashboard/stats`);
//         const weeklyRes = await axios.get(`${API_URL}/dashboard/weekly-bookings`);
//         const categoryRes = await axios.get(`${API_URL}/dashboard/category-data`);

//         setStats(statsRes.data);
//         setBookingData(weeklyRes.data);
//         setPieData(categoryRes.data);

//       } catch (err) {
//         console.error("Dashboard Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [API_URL]);

//   //  Loading UI
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-white">
//         Loading Dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6">

//       {/* Heading */}
//       <h1 className="text-3xl font-bold mb-8">
//         Welcome to <span className="text-yellow-500">Rentora Admin</span>
//       </h1>

//       {/* Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">

//         <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20">
//           <h3 className="text-gray-400 text-sm">Total Revenue</h3>
//           <p className="text-2xl font-bold text-yellow-500 mt-2">
//             ₹{stats.revenue || 0}
//           </p>
//         </div>

//         <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20">
//           <h3 className="text-gray-400 text-sm">Total Bookings</h3>
//           <p className="text-2xl font-bold text-yellow-500 mt-2">
//             {stats.totalBookings || 0}
//           </p>
//         </div>

//         <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20">
//           <h3 className="text-gray-400 text-sm">Rented Cars</h3>
//           <p className="text-2xl font-bold text-yellow-500 mt-2">
//             {stats.rentedCars || 0}
//           </p>
//         </div>

//         <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20">
//           <h3 className="text-gray-400 text-sm">Available Cars</h3>
//           <p className="text-2xl font-bold text-yellow-500 mt-2">
//             {stats.availableCars || 0}
//           </p>
//         </div>

//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-2 gap-6">

//         {/* Bar Chart */}
//         <div className="bg-white/5 p-6 rounded-xl">
//           <h3 className="mb-4">Weekly Bookings</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={bookingData}>
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#22c55e" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white/5 p-6 rounded-xl">
//           <h3 className="mb-4">Vehicle Categories</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 outerRadius={90}
//                 label
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell
//                     key={index}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;