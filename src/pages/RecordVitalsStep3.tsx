import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function RecordVitalsStep3() {
  const { person_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const prevVitals = location.state || {};

  const [status, setStatus] = useState<
    "idle" | "countdown" | "recording" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const API_BASE = "http://192.168.8.112:8000";

  // === handle countdown + record ===
  const handleRecord = async () => {
    if (status === "recording") return;

    setStatus("countdown");
    setMessage("🧍 Please stand still near the sensor...");
    setHeight(null);

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

  // === start ultrasonic reading ===
  const startReading = async () => {
    setStatus("recording");
    setCountdown(null);
    setMessage("📡 Measuring height... Please avoid movement...");

    try {
      const response = await axios.get(
        `${API_BASE}/api/sensors/ultrasonic/read/${person_id}/7`
      );
      const result = response.data;

      if (!result || typeof result.computed_person_height_ft !== "number") {
        throw new Error("Invalid response from ultrasonic sensor");
      }

      setHeight(result.computed_person_height_ft);
      setStatus("done");
      setMessage(result.message || "✅ Height measurement completed successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to measure height. Please try again.");
      setStatus("error");
    }
  };

  // === proceed to next step (Step 4) ===
  const handleProceed = () => {
    navigate(`/record_vitals_step4/${person_id}`, {
      state: { ...prevVitals, height },
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
  {/* === Back Button (Top Left) === */}
<button
  onClick={() => navigate(-1)}
  className="absolute top-10 left-10 px-6 py-3 rounded-full text-lg font-semibold bg-gray-200 text-[#1C7DA6] hover:bg-gray-300 transition-all shadow-sm"
>
  ⬅️ Back
</button>
      <div className="w-[900px] h-[1700px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-center px-16 py-12">
        {/* === Header === */}
        <h1 className="text-[56px] font-extrabold text-[#1C7DA6] leading-tight tracking-tight mb-4">
          📏 Record Height
        </h1>
        <p className="text-xl text-[#3F3F3F]/80 mb-10">
          Measuring height for{" "}
          <span className="font-semibold text-[#1C7DA6]">{person_id}</span>
        </p>

        {/* === Step Progress Bar === */}
        <div className="flex justify-center items-center gap-8 mb-10">
          {[
            { icon: "🩸", label: "Vitals" },
            { icon: "🌡️", label: "Temp" },
            { icon: "📏", label: "Height" },
            { icon: "⚖️", label: "Weight" },
            { icon: "📄", label: "Summary" },
          ].map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step circle */}
              <div
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${
                  index <= 2
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
                    index < 2 ? "bg-[#1C7DA6]" : "bg-[#D7E7EB]"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <p className="text-lg text-[#3F3F3F]/70 mb-10">
          Step 3 of 5 — Record Height
        </p>

        {/* === Instructions === */}
        <div className="mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner text-left p-10 mb-10">
          <h2 className="text-2xl font-bold text-[#1C7DA6] mb-4">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-[20px] text-[#3F3F3F]">
            <li>Stand still under the ultrasonic sensor.</li>
            <li>Avoid movement during measurement.</li>
            <li>Wait until the results appear on screen.</li>
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
          📏 {status === "recording" ? "Measuring..." : "Record Height"}
        </button>

        {/* === Vitals Summary === */}
        <div className="mt-14 mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner text-left p-10 text-[22px] text-[#3F3F3F]">
          <h3 className="text-2xl font-bold text-[#1C7DA6] mb-4">
            📊 Vitals Summary
          </h3>
          <ul className="space-y-3">
            <li>
              <strong>SpO₂:</strong>{" "}
              {prevVitals.spo2
                ? `${prevVitals.spo2.toFixed(1)}%`
                : "Not yet recorded"}
            </li>
            <li>
              <strong>Blood Pulse:</strong>{" "}
              {prevVitals.bpm ? `${prevVitals.bpm} BPM` : "Not yet recorded"}
            </li>
            <li>
              <strong>Temperature:</strong>{" "}
              {prevVitals.temperature
                ? `${prevVitals.temperature.toFixed(2)} °C`
                : "Not yet recorded"}
            </li>
            <li>
              <strong>Height:</strong>{" "}
              {height ? `${height.toFixed(2)} ft` : "Not yet recorded"}
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
            ➡️ Proceed to Step 4: Record Weight
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
