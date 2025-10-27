import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "@/assets/doctor.png";
import { Link } from "react-router-dom";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("Place your index finger to biometrics...");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleLogin = async () => {
    setShowModal(true);
    setMessage("Initializing fingerprint scanner...");

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

      <div className="mx-auto w-[900px] h-[1700px] rounded-[28px] bg-white shadow-md">
        {/* === Top Image Section === */}
        <div className="relative h-[720px] rounded-t-[28px] overflow-hidden">
  <img
    src={doctorImage}
    alt="Doctor"
    className="w-full h-full object-cover object-center rounded-t-[28px]"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
</div>


        {/* === Text Section === */}
        <div className="px-20 pb-10 pt-15 text-center">
          <h1 className="text-7xl font-extrabold leading-tight tracking-tight text-[color:var(--ink)]">
            Research Title
            <br />
            Second Line
          </h1>
         <div className="text-xl pt-8">
              <p className="mt-4 leading-relaxed text-[color:var(--ink)]/70">
                This portal supports a research study evaluating a self-service kiosk for capturing
                temperature, heart rate, and SpO₂ prior to outpatient consultation. Collected data is
                de-identified and stored securely for aggregate analysis only.
              </p>
              <p className="mt-4 pt-8 leading-relaxed text-[color:var(--ink)]/70">
                Eligible participants are adults (18+) who provide informed consent on site. The
                kiosk does not provide medical advice; please consult your clinician for any concerns..
              </p>
            </div>

          {/* === Buttons === */}
          <div className="mt-14 pt-2 flex flex-col items-center gap-7">
            <button
              onClick={handleLogin}
              className="winline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md"
            style={{ background: "var(--brand)" }}>
              Login
            </button>
            <button
              onClick={handleRegister}
              className="inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full border-3 bg-white px-16 py-8 text-[28px]"
            >
              Register
            </button>
          </div>

          <div className="mt-8 text-[18px] text-[color:var(--ink)]/55">
              AI.V 2025
            </div>
        </div>
      </div>

      {/* === Modal === */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div className="bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] rounded-[32px] shadow-2xl w-[460px] p-10 text-center animate-fadeIn relative overflow-hidden">

      {/* === Header === */}
      <h2 className="text-[26px] font-extrabold text-[#1C7DA6] mb-2 tracking-tight">
        Fingerprint Login
      </h2>
      <p className="text-[#3F3F3F]/70 text-[15px] mb-8">
        Please scan your fingerprint to verify your identity and access your account.
      </p>

      {/* === Inner Card === */}
      <div className="bg-white rounded-[24px] shadow-md px-8 py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Fingerprint Icon with scan animation */}
          <div className="relative w-[120px] h-[120px] mb-6 flex items-center justify-center">
            {/* Animated scanner line */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1C7DA6] animate-scanLine"></div>
            </div>
            {/* Fingerprint SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="#1C7DA6"
              className="w-[100px] h-[100px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a9.958 9.958 0 00-7.07 2.93M2 12a9.958 9.958 0 002.93 7.07M12 22a9.958 9.958 0 007.07-2.93M22 12a9.958 9.958 0 00-2.93-7.07M12 6a6 6 0 00-6 6v2m12 0v-2a6 6 0 00-6-6m0 12a4 4 0 01-4-4m8 0a4 4 0 01-4 4"
              />
            </svg>
          </div>

          <h3 className="text-[18px] font-bold text-[#1C7DA6] mb-4">
            Fingerprint Scan
          </h3>

          {/* Instructions */}
          <ul className="text-left text-sm font-semibold  text-[#3F3F3F]/85 mb-6 space-y-1">
            <li>• Place your index finger on the scanner once.</li>
            <li>• Wait for the scanner light to blink.</li>
            <li>• The system will automatically verify your identity.</li>
          </ul>

          {/* Dynamic message */}
          <p
            className={`font-semibold text-sm mb-4 transition-all ${
              message.includes("Failed") || message.includes("Error")
                ? "text-red-500"
                : "text-[#1C7DA6]"
            }`}
          >
            {message}
          </p>
        </div>
      </div>

      {/* === Close Button === */}
      <button
        onClick={() => setShowModal(false)}
        className="mt-8 inline-flex items-center justify-center gap-2 bg-[#1C7DA6] text-white text-[15px] font-semibold px-10 py-3 rounded-full hover:brightness-110 shadow-md transition-all"
      >
        ✖ Close
      </button>

      {/* === Scan line animation === */}
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 1; }
          100% { transform: translateY(115px); opacity: 0.2; }
        }
        .animate-scanLine {
          animation: scanLine 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  </div>
)}



    </div>
  );
}
