import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RecordVitalsStep4() {
  const { person_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const prevVitals = location.state || {};

  const [status, setStatus] = useState<"idle" | "recording" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [weight, setWeight] = useState<number | null>(null);

  const API_BASE = "http://192.168.8.167:8000";

  // === Record weight (mock for now) ===
  const handleRecordWeight = () => {
    setStatus("recording");
    setMessage("⚖️ Measuring weight...");
    setTimeout(() => {
      setWeight(75); // Mock data
      setStatus("done");
      setMessage("✅ Weight recorded successfully!");
    }, 2000);
  };

  // === Compute BMI and BMR ===
  const computeMetrics = () => {
    if (!prevVitals.height || !weight) return { bmi: null, bmr: null };

    const height_m = prevVitals.height * 0.3048;
    const height_cm = height_m * 100;

    const bmi = weight / (height_m * height_m);

    // Simple BMR formula (Mifflin-St Jeor, male, age = 25 for now)
    const bmr = 66 + 13.7 * weight + 5 * height_cm - 6.8 * 25;

    return { bmi, bmr };
  };

  // === Proceed to Step 5 ===
  const handleProceed = async () => {
    if (!weight || !prevVitals.height) {
      alert("Please record height and weight first!");
      return;
    }

    const { bmi, bmr } = computeMetrics();

    if (!bmi || !bmr) {
      alert("Failed to compute BMI/BMR. Please try again.");
      return;
    }

    try {
      setMessage("💾 Saving BMI and BMR to database...");
      await axios.post(`${API_BASE}/api/sensors/bmr_bmi/update/${person_id}`, {
        bmr: parseFloat(bmr.toFixed(2)),
        bmi: parseFloat(bmi.toFixed(2)),
      });

      setMessage("✅ Health metrics updated successfully!");
      navigate(`/record_vitals_step5/${person_id}`, {
        state: { ...prevVitals, weight, bmi, bmr },
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save BMI/BMR to database.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">⚖️ Record Weight</h1>
      <p className="text-gray-700 mb-6">
        Recording weight for <strong>{person_id}</strong>
      </p>

      {/* === Progress Bar === */}
      <div className="w-full max-w-md bg-gray-300 rounded-full h-3 mb-8">
        <div className="bg-blue-600 h-3 rounded-full" style={{ width: "80%" }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Step 4 of 5 — Record Weight</p>

      {/* === Instructions === */}
      <div className="bg-white shadow-md rounded-lg p-6 text-left w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-3">📋 Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Stand on the weight scale.</li>
          <li>Wait until the measurement completes.</li>
          <li>Click <strong>Record Weight</strong> below to simulate measurement.</li>
        </ol>
      </div>

      {/* === Status Message === */}
      {message && <div className="mb-4 text-lg font-medium text-gray-800">{message}</div>}

      {/* === Record Button === */}
      <button
        onClick={handleRecordWeight}
        disabled={status === "recording"}
        className={`px-6 py-3 rounded-md text-lg transition ${
          status === "recording"
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        ⚖️ {status === "recording" ? "Recording..." : "Record Weight"}
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
            {prevVitals.temperature
              ? `${prevVitals.temperature.toFixed(2)} °C`
              : "Not yet recorded"}
          </li>
          <li>
            <strong>Height:</strong>{" "}
            {prevVitals.height ? `${prevVitals.height.toFixed(2)} ft` : "Not yet recorded"}
          </li>
          <li>
            <strong>Weight:</strong>{" "}
            {weight ? `${weight} kg` : "Not yet recorded"}
          </li>
        </ul>
      </div>

      {/* === Proceed Button === */}
      {status === "done" && (
        <button
          onClick={handleProceed}
          className="mt-6 px-6 py-3 rounded-md text-lg bg-green-600 hover:bg-green-700 text-white transition"
        >
          ➡️ Proceed to Step 5: Results Summary
        </button>
      )}
    </div>
  );
}
