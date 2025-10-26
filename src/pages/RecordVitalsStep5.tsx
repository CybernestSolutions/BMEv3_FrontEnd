import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

export default function RecordVitalsStep5() {
  const { person_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vitals = location.state || {};

  const [aiResult, setAiResult] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "http://192.168.8.167:8000";
  const qrUrl = `${API_BASE}/api/persondetail/${person_id}`;

  // === Trigger AI Analysis ===
  const handleAiAnalysis = async () => {
    setLoading(true);
    setMessage("🤖 Analyzing your health data...");
    setAiResult(null);
    setDisclaimer(null);

    try {
      const response = await axios.get(`${API_BASE}/api/ai_analysis/${person_id}`);
      const data = response.data;
      setAiResult(data.ai_analysis || "No AI analysis found.");
      setDisclaimer(data.disclaimer || null);
      setMessage("✅ AI Health Analysis completed!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to retrieve AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  // === Done Button ===
  const handleDone = () => {
    navigate("/"); // You can adjust this to your home or dashboard
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">🏁 Vitals Summary</h1>
      <p className="text-gray-700 mb-6">
        Review the recorded vitals and AI-powered health insights for{" "}
        <strong>{person_id}</strong>
      </p>

      {/* === Progress Bar === */}
      <div className="w-full max-w-md bg-gray-300 rounded-full h-3 mb-8">
        <div className="bg-blue-600 h-3 rounded-full" style={{ width: "100%" }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Step 5 of 5 — Results Summary</p>

      {/* === Results Section === */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Left: Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-3">📊 Final Vitals Summary</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>SpO₂:</strong>{" "}
              {vitals.spo2 ? `${vitals.spo2.toFixed(1)}%` : "Not recorded"}
            </li>
            <li>
              <strong>Blood Pulse:</strong>{" "}
              {vitals.bpm ? `${vitals.bpm} BPM` : "Not recorded"}
            </li>
            <li>
              <strong>Temperature:</strong>{" "}
              {vitals.temperature ? `${vitals.temperature.toFixed(2)} °C` : "Not recorded"}
            </li>
            <li>
              <strong>Height:</strong>{" "}
              {vitals.height ? `${vitals.height.toFixed(2)} ft` : "Not recorded"}
            </li>
            <li>
              <strong>Weight:</strong>{" "}
              {vitals.weight ? `${vitals.weight} kg` : "Not recorded"}
            </li>
            <li>
              <strong>BMI:</strong>{" "}
              {vitals.bmi ? `${vitals.bmi.toFixed(2)}` : "Not recorded"}
            </li>
            <li>
              <strong>BMR:</strong>{" "}
              {vitals.bmr ? `${vitals.bmr.toFixed(2)} kcal/day` : "Not recorded"}
            </li>
          </ul>
        </div>

        {/* Right: QR + AI */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-3">🔗 QR Code</h2>
          <QRCode value={qrUrl} size={160} />
          <p className="mt-2 text-sm text-gray-600 break-all">{qrUrl}</p>
        </div>
      </div>

      {/* === Buttons === */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={handleDone}
          className="px-6 py-3 rounded-md text-lg bg-gray-700 hover:bg-gray-800 text-white transition"
        >
          ✅ Done
        </button>
        <button
          onClick={handleAiAnalysis}
          disabled={loading}
          className={`px-6 py-3 rounded-md text-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          🤖 {loading ? "Analyzing..." : "Health Analysis (Powered by AI)"}
        </button>
      </div>

      {/* === Status Message === */}
      {message && <p className="mt-4 text-gray-700 font-medium">{message}</p>}

      {/* === AI Analysis Output === */}
      {aiResult && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 w-full max-w-3xl text-left">
          <h3 className="text-xl font-semibold mb-3 text-blue-700">🧠 AI Health Analysis</h3>
          <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
            {aiResult}
          </pre>
          {disclaimer && (
            <p className="mt-4 text-xs text-gray-500 italic border-t pt-3">{disclaimer}</p>
          )}
        </div>
      )}
    </div>
  );
}
