import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("Place your index finger to biometrics...");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleLogin = async () => {
    setShowModal(true);
    setMessage("🟡 Initializing fingerprint scanner...");

    try {
      const res = await axios.get("http://192.168.8.167:8000/api/login/biometrics", {
        headers: { Accept: "application/json" },
      });

      // ✅ Successful response handling
      if (res.status === 200 && res.data?.person_id) {
        const { name, person_id, message } = res.data;
        setMessage(`✅ ${message}`);
        // Wait 1.5s before redirecting
        setTimeout(() => navigate(`/profile/${person_id}`), 1500);
      } else {
        setMessage("⚠️ Unexpected response format.");
      }
    } catch (error: any) {
      if (error.response) {
        setMessage(`❌ ${error.response.status} ${error.response.statusText}`);
      } else {
        setMessage("❌ Failed to connect to sensor or server.");
      }
    }
  };

  const handleRegister = () => {
  navigate("/register");
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center relative">
      <h1 className="text-4xl font-extrabold mb-6">Welcome to AI.V</h1>

      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Register
        </button>
      </div>

      {/* === Modal Overlay === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-[90%] max-w-md text-center animate-fadeIn">
            <h3 className="text-2xl font-semibold mb-4">Fingerprint Login</h3>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
