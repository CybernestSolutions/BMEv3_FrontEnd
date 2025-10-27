import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
      // ✅ Updated API format
      const response = await axios.get(
        `${API_BASE}/api/sensors/max30102/read/${person_id}?duration=5`
      );

      // ✅ New response structure
      const result = response.data;
      setSpo2(result.spo2 ?? null);
      setBpm(result.bpm ?? null);
      setStatus("done");

      // ✅ Show backend message if available
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">🩺 Record Vital Signs</h1>

      <p className="text-gray-700 mb-6">
        Recording vitals for <strong>{person_id}</strong>
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md bg-gray-300 rounded-full h-3 mb-8">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: "20%" }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Step 1 of 5 — Record SpO₂ and Blood Pulse
      </p>

      {/* Instructions */}
      <div className="bg-white shadow-md rounded-lg p-6 text-left w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-3">📋 Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click the <strong>Record</strong> button below.</li>
          <li>Place your index finger gently on the pulse sensor.</li>
          <li>Stay still until the results appear on screen.</li>
        </ol>
      </div>

      {/* Status message */}
      {status !== "idle" && (
        <div className="mb-4 text-lg font-medium text-gray-800">
          {message}{" "}
          {countdown !== null && (
            <span className="text-blue-600 font-bold">{countdown}</span>
          )}
        </div>
      )}

      {/* Record button */}
      <button
        onClick={handleRecord}
        disabled={status === "recording" || status === "countdown"}
        className={`px-6 py-3 rounded-md text-lg transition ${
          status === "recording" || status === "countdown"
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        🔴 {status === "recording" ? "Recording..." : "Record SpO₂ and Blood Pulse"}
      </button>

      {/* Vitals summary */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 w-full max-w-md text-left">
        <h3 className="text-xl font-semibold mb-3">📊 Vitals Summary</h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>SpO₂:</strong>{" "}
            {spo2 !== null ? `${spo2.toFixed(1)}%` : "Not yet recorded"}
          </li>
          <li>
            <strong>Blood Pulse:</strong>{" "}
            {bpm !== null ? `${bpm} BPM` : "Not yet recorded"}
          </li>
          <li>
            <strong>Temp:</strong> Not yet recorded
          </li>
          <li>
            <strong>Height:</strong> Not yet recorded
          </li>
          <li>
            <strong>Weight:</strong> Not yet recorded
          </li>
        </ul>
      </div>

      {/* Proceed to Step 2 */}
      {status === "done" && (
        <button
          onClick={handleProceed}
          className="mt-6 px-6 py-3 rounded-md text-lg bg-green-600 hover:bg-green-700 text-white transition"
        >
          ➡️ Proceed to Step 2: Record Temperature
        </button>
      )}
    </div>
  );
}
