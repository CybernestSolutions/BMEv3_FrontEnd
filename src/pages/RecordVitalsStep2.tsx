import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RecordVitalsStep2() {
  const { person_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const prevVitals = location.state || {}; // Data from step 1

  const [status, setStatus] = useState<"idle" | "countdown" | "recording" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const API_BASE = "http://192.168.8.167:8000";

  // === handle countdown + record ===
  const handleRecord = async () => {
    if (status === "recording") return;

    setStatus("countdown");
    setMessage("🌡 Please prepare for temperature measurement...");
    setTemperature(null);

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

  // === start sensor reading ===
  const startReading = async () => {
    setStatus("recording");
    setCountdown(null);
    setMessage("🔄 Measuring temperature... Please stay still...");

    try {
      // ✅ Corrected API format
      const response = await axios.get(
        `${API_BASE}/api/sensors/mlx90614/reading/${person_id}`
      );

      const result = response.data;

      // ✅ Extract object_temp as body temperature
      setTemperature(result.object_temp ?? null);
      setStatus("done");
      setMessage("✅ Temperature measurement completed successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to read temperature sensor. Please try again.");
      setStatus("error");
    }
  };

  // === proceed to next step (Step 3) ===
  const handleProceed = () => {
    navigate(`/record_vitals_step3/${person_id}`, {
      state: { ...prevVitals, temperature },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">🌡 Record Temperature</h1>

      <p className="text-gray-700 mb-6">
        Recording temperature for <strong>{person_id}</strong>
      </p>

      {/* === Progress Bar === */}
      <div className="w-full max-w-md bg-gray-300 rounded-full h-3 mb-8">
        <div className="bg-blue-600 h-3 rounded-full" style={{ width: "40%" }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Step 2 of 5 — Record Body Temperature</p>

      {/* === Instructions === */}
      <div className="bg-white shadow-md rounded-lg p-6 text-left w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-3">📋 Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click the <strong>Record</strong> button below.</li>
          <li>Place the temperature sensor near your forehead or underarm.</li>
          <li>Stay still until the measurement completes.</li>
        </ol>
      </div>

      {/* === Status Message === */}
      {status !== "idle" && (
        <div className="mb-4 text-lg font-medium text-gray-800">
          {message}{" "}
          {countdown !== null && (
            <span className="text-blue-600 font-bold">{countdown}</span>
          )}
        </div>
      )}

      {/* === Record Button === */}
      <button
        onClick={handleRecord}
        disabled={status === "recording" || status === "countdown"}
        className={`px-6 py-3 rounded-md text-lg transition ${
          status === "recording" || status === "countdown"
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        🌡 {status === "recording" ? "Recording..." : "Record Temperature"}
      </button>

      {/* === Vitals Summary === */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 w-full max-w-md text-left">
        <h3 className="text-xl font-semibold mb-3">📊 Vitals Summary</h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>SpO₂:</strong>{" "}
            {prevVitals.spo2 ? `${prevVitals.spo2.toFixed(1)}%` : "Not yet recorded"}
          </li>
          <li>
            <strong>Blood Pulse:</strong>{" "}
            {prevVitals.bpm ? `${prevVitals.bpm} BPM` : "Not yet recorded"}
          </li>
          <li>
            <strong>Temp:</strong>{" "}
            {temperature !== null ? `${temperature.toFixed(2)} °C` : "Not yet recorded"}
          </li>
          <li>
            <strong>Height:</strong> Not yet recorded
          </li>
          <li>
            <strong>Weight:</strong> Not yet recorded
          </li>
        </ul>
      </div>

      {/* === Proceed to Step 3 === */}
      {status === "done" && (
        <button
          onClick={handleProceed}
          className="mt-6 px-6 py-3 rounded-md text-lg bg-green-600 hover:bg-green-700 text-white transition"
        >
          ➡️ Proceed to Step 3: Record Height
        </button>
      )}
    </div>
  );
}
