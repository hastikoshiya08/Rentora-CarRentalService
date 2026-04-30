import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/forgot-password",
        { email }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Something went wrong");
    }
  };

  return (
  <div className="fixed inset-0 z-[9999] bg-black/80 flex justify-center items-center">
      <div className="bg-black p-6 rounded-xl w-96 border border-yellow-500">
        <h2 className="text-white text-xl mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 bg-black border border-yellow-500 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-black py-2 rounded"
        >
          Send Reset Link
        </button>

        <p className="text-white mt-2">{msg}</p>

        <button
          onClick={onClose}
          className="text-red-500 mt-3 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};
const handleSubmit = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/forgot-password`,
      { email }
    );

    setMsg(res.data.message);

    // IMPORTANT: redirect after success
    if (res.data.token) {
      window.location.href = `/reset/${res.data.token}`;
    }

  } catch (err) {
    setMsg("Something went wrong");
  }
};
export default ForgotPassword;