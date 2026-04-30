import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleReset = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password,
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Reset failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <div className="p-6 border border-yellow-500 rounded-xl w-96">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 mb-4 bg-black border border-yellow-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-yellow-500 text-black py-2 rounded"
        >
          Reset Password
        </button>

        <p className="mt-2">{msg}</p>
      </div>
    </div>
  );
};

export default ResetPassword;