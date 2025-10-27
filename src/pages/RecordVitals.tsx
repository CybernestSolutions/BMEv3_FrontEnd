import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export default function RecordVitals() {
  const { person_id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("idle");
  const [message, setMessage] = useState<string>("");
  const [spo2, setSpo2] = useState<number | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const API_BASE = "http://192.168.8.112:8000";

  const handleRecord = async () => {
    if (status === "recording") return;

    setStatus("countdown");
    setMessage("🩸 Please place your finger on the sensor...");
    setSpo2(null);
    setBpm(null);

    let timeLeft = 3;
    setCountdown(timeLeft);
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        startReading();
      }
    }, 1000);
  };

  const startReading = async () => {
    setStatus("recording");
    setCountdown(null);
    setMessage("🔄 Reading SpO₂ and Pulse... Please stay still...");

    try {
      const response = await axios.get(
        `${API_BASE}/api/sensors/max30102/read/${person_id}?duration=5`
      );
      const result = response.data;
      setSpo2(result.spo2 ?? null);
      setBpm(result.bpm ?? null);
      setStatus("done");
      setMessage(result.message || "✅ Measurement completed successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to read sensor. Please try again.");
      setStatus("error");
    }
  };

  const handleProceed = () => {
    navigate(`/record_vitals_step2/${person_id}`, {
      state: { spo2, bpm },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] p-6">
      {/* === Main Card === */}
              <div className="absolute top-10 right-10">
    <Link
      to="/"
      className=" text-xl inline-flex items-center gap-2  text-white font-semibold px-10 py-2 rounded-full shadow-md hover:brightness-110 transition-all"
    >
      🏠
    </Link>
  </div>
      <div className="w-[900px] h-[1700px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-center px-16 py-12">
        {/* === Header === */}
        <h1 className="text-[56px] font-extrabold text-[#1C7DA6] leading-tight tracking-tight mb-4">
          🩺 Record Vital Signs
        </h1>
        <p className="text-xl text-[#3F3F3F]/80 mb-10">
          Recording vitals for{" "}
          <span className="font-semibold text-[#1C7DA6]">{person_id}</span>
        </p>

        {/* === Step Progress Bar === */}
        <div className="flex justify-center items-center gap-8 mb-10">
          {[
            { icon: "🩸", label: "Vitals" },
            { icon: "💓", label: "Heart" },
            { icon: "🌡️", label: "Temp" },
            { icon: "✏️", label: "Details" },
            { icon: "📄", label: "Summary" },
          ].map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step circle */}
              <div
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${
                  index === 0
                    ? "border-[#1C7DA6] bg-[#EAF8FB] text-[#1C7DA6]"
                    : "border-[#D7E7EB] bg-white text-[#D7E7EB]"
                } transition-all duration-300`}
              >
                <span className="text-2xl">{step.icon}</span>
              </div>

              {/* Connecting line (except after last) */}
              {index < 4 && (
                <div
                  className={`w-20 h-[4px] ${
                    index === 0 ? "bg-[#1C7DA6]" : "bg-[#D7E7EB]"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <p className="text-lg text-[#3F3F3F]/70 mb-10">
          Step 1 of 5 — Record SpO₂ and Blood Pulse
        </p>

        {/* === Instructions === */}
        <div className="mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner text-left p-10 mb-10">
          <h2 className="text-2xl font-bold text-[#1C7DA6] mb-4">
            📋 Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-[20px] text-[#3F3F3F]">
            <li>Click the <strong>Record</strong> button below.</li>
            <li>Place your index finger gently on the pulse sensor.</li>
            <li>Stay still until the results appear on screen.</li>
          </ol>
        </div>

        {/* === Status Message === */}
        {status !== "idle" && (
          <div className="text-[22px] font-semibold text-[#3F3F3F] mb-10">
            {message}{" "}
            {countdown !== null && (
              <span className="text-[#1C7DA6] font-bold">{countdown}</span>
            )}
          </div>
        )}

        {/* === Record Button === */}
        <button
          onClick={handleRecord}
          disabled={status === "recording" || status === "countdown"}
          className={`inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md transition-all ${
            status === "recording" || status === "countdown"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1C7DA6] hover:brightness-110"
          }`}
        >
          🔴{" "}
          {status === "recording" ? "Recording..." : "Record SpO₂ and Blood Pulse"}
        </button>

        {/* === Results Summary === */}
        <div className="mt-14 mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner text-left p-10 text-[22px] text-[#3F3F3F]">
          <h3 className="text-2xl font-bold text-[#1C7DA6] mb-4">
            📊 Vitals Summary
          </h3>
          <ul className="space-y-3">
            <li>
              <strong>SpO₂:</strong>{" "}
              {spo2 !== null ? `${spo2.toFixed(1)}%` : "Not yet recorded"}
            </li>
            <li>
              <strong>Blood Pulse:</strong>{" "}
              {bpm !== null ? `${bpm} BPM` : "Not yet recorded"}
            </li>
            <li>
              <strong>Temperature:</strong> Not yet recorded
            </li>
            <li>
              <strong>Height:</strong> Not yet recorded
            </li>
            <li>
              <strong>Weight:</strong> Not yet recorded
            </li>
          </ul>
        </div>

        {/* === Proceed Button === */}
        {status === "done" && (
          <button
            onClick={handleProceed}
            className="mt-14 inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md transition-all bg-green-600 hover:bg-green-700"
          >
            ➡️ Proceed to Step 2: Record Temperature
          </button>
        )}

        {/* === Footer === */}
        <p className="mt-14 text-[18px] text-[#3F3F3F]/50">
          AI.V Health Monitor · 2025
        </p>
      </div>
    </div>
  );
}
