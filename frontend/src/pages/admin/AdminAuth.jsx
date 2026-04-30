// import { useState } from "react";

// const AdminAuth = () => {

//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">

//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

//         {/* Heading */}
//         <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
//           {isLogin ? "Admin Login" : "Admin Register"}
//         </h2>

//         {/* Form */}
//         <form className="space-y-4">

//           {!isLogin && (
//             <input
//               type="text"
//               placeholder="Admin Name"
//               className="w-full border p-2 rounded"
//             />
//           )}

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border p-2 rounded"
//           />

//           {!isLogin && (
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className="w-full border p-2 rounded"
//             />
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>

//         </form>

//         {/* Toggle */}
//         <p className="text-center mt-4 text-gray-600">

//           {isLogin ? "Don't have an account?" : "Already have an account?"}

//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-800 font-semibold ml-2"
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>

//         </p>

//       </div>

//     </div>
//   );
// };

// export default AdminAuth;