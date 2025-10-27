import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "@/assets/doctor.png";

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
      const res = await axios.get("http://192.168.8.112:8000/api/login/biometrics", {
        headers: { Accept: "application/json" },
      });

      if (res.status === 200 && res.data?.person_id) {
        const { person_id, message } = res.data;
        setMessage(`✅ ${message}`);
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

  const handleRegister = () => navigate("/register");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7]">
      {/* === Card === */}
      <div className="home-card w-full max-w-[460px] rounded-[28px] shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-[#e1ecf9]">
        {/* === Top Image Section === */}
        <div className="relative h-[360px] overflow-hidden">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-full h-full object-cover object-top rounded-t-[28px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
        </div>

        {/* === Text Section === */}
        <div className="px-8 pb-10 text-center">
          <h1 className="text-[1.75rem] font-extrabold text-[#0078d7] leading-tight mt-4">
            Research Title
            <br />
            Second Line
          </h1>
          <p className="text-gray-600 mt-3 text-[0.95rem] leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac libero ac nunc
            lacinia egestas. Curabitur malesuada augue sit amet ligula elementum.
          </p>

          <p className="text-gray-600 mt-2 text-[0.95rem] leading-relaxed">
            Suspendisse potenti. Praesent nec enim sed sapien fringilla imperdiet.
          </p>

          {/* === Buttons === */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-[#007BFF] text-white font-semibold py-3 rounded-full text-base shadow-md transition-colors hover:bg-[#0066dd]"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="w-full border border-[#007BFF] text-[#007BFF] font-semibold py-3 rounded-full text-base transition-colors hover:bg-[#e9f3ff]"
            >
              Register
            </button>
          </div>

          <p className="mt-10 text-xs text-gray-400 tracking-wide">
            © AI.V Health Monitor, 2025
          </p>
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center animate-fadeIn">
            <h3 className="text-xl font-semibold text-[#007BFF] mb-4">Fingerprint Login</h3>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
