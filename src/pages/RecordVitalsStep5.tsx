import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecordVitalsStep5() {
  const { person_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vitals = location.state || {};

  const [aiResult, setAiResult] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const API_BASE = "http://192.168.8.112:8000";
  const qrUrl = `${API_BASE}/api/persondetail/${person_id}`;

  // === AI Analysis ===
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

  // === DONE (Send Email + Redirect) ===
  const handleDone = async () => {
    setSendingEmail(true);
    setMessage("📧 Sending summary email... Please wait.");

    try {
      await axios.post(
        `${API_BASE}/api/send/email/vosotrosandteam@gmail.com/xrgmcdpoxqlkuoks/${person_id}`
      );

      setMessage("✅ Thank you for using Ai.V! Redirecting to home in 3..2..1..");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] p-6">
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
      {/* === Main Card === */}
      <div className="w-[900px] h-[1700px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-center px-16 py-12">
        {/* === Header === */}
        <h1 className="text-[56px] font-extrabold text-[#1C7DA6] mb-4 leading-tight">
          🏁 Vitals Summary
        </h1>
        <p className="text-xl text-[#3F3F3F]/80 mb-10">
          Review the recorded vitals and AI-powered health insights for{" "}
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
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${
                  index <= 4
                    ? "border-[#1C7DA6] bg-[#EAF8FB] text-[#1C7DA6]"
                    : "border-[#D7E7EB] bg-white text-[#D7E7EB]"
                } transition-all duration-300`}
              >
                <span className="text-2xl">{step.icon}</span>
              </div>
              {index < 4 && (
                <div
                  className={`w-20 h-[4px] ${
                    index < 4 ? "bg-[#1C7DA6]" : "bg-[#D7E7EB]"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <p className="text-lg text-[#3F3F3F]/70 mb-10">
          Step 5 of 5 — Results Summary
        </p>

        {/* === Results Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 text-left">
          {/* Summary */}
          <div className="bg-[#F5F7FA] rounded-3xl shadow-inner p-10 text-[22px] text-[#3F3F3F]">
            <h2 className="text-2xl font-bold text-[#1C7DA6] mb-4">
              📊 Final Vitals Summary
            </h2>
            <ul className="space-y-3">
              <li><strong>SpO₂:</strong> {vitals.spo2 ? `${vitals.spo2.toFixed(1)}%` : "Not recorded"}</li>
              <li><strong>Blood Pulse:</strong> {vitals.bpm ? `${vitals.bpm} BPM` : "Not recorded"}</li>
              <li><strong>Temperature:</strong> {vitals.temperature ? `${vitals.temperature.toFixed(2)} °C` : "Not recorded"}</li>
              <li><strong>Height:</strong> {vitals.height ? `${vitals.height.toFixed(2)} ft` : "Not recorded"}</li>
              <li><strong>Weight:</strong> {vitals.weight ? `${vitals.weight} kg` : "Not recorded"}</li>
              <li><strong>BMI:</strong> {vitals.bmi ? `${vitals.bmi.toFixed(2)}` : "Not recorded"}</li>
              <li><strong>BMR:</strong> {vitals.bmr ? `${vitals.bmr.toFixed(2)} kcal/day` : "Not recorded"}</li>
            </ul>
          </div>

          {/* QR Code */}
          <div className="bg-[#F5F7FA] rounded-3xl shadow-inner p-10 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-[#1C7DA6] mb-4">🔗 QR Code</h2>
            <QRCode value={qrUrl} size={180} />
            <p className="mt-3 text-sm text-[#3F3F3F]/70 break-all">{qrUrl}</p>
          </div>
        </div>

        {/* === Action Buttons === */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <button
            onClick={handleDone}
            disabled={sendingEmail}
            className={`inline-flex w-[320px] min-h-[80px] items-center justify-center gap-3 rounded-full px-10 py-6 text-[24px] font-extrabold text-white shadow-md transition-all ${
              sendingEmail
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            ✅ {sendingEmail ? "Sending..." : "Finish Session"}
          </button>

          <button
            onClick={handleAiAnalysis}
            disabled={loading}
            className={`inline-flex w-[480px] min-h-[80px] items-center justify-center gap-3 rounded-full px-10 py-6 text-[24px] font-extrabold text-white shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1C7DA6] hover:brightness-110"
            }`}
          >
            🤖 {loading ? "Analyzing..." : "Health Analysis (Powered by AI)"}
          </button>
        </div>

        {/* === Status Message === */}
        {message && (
          <p className="text-[20px] text-[#3F3F3F] font-medium mb-8">{message}</p>
        )}

        {/* === AI Analysis Output === */}
        {aiResult && (
          <div className="mt-8 mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner p-10 text-left text-[#3F3F3F]">
            <h3 className="text-2xl font-bold text-[#1C7DA6] mb-4">
              🧠 AI Health Analysis
            </h3>
  <pre
  className="whitespace-pre-wrap text-[18px] leading-relaxed max-h-[300px] overflow-y-auto px-3 py-2 rounded-lg border border-gray-200 bg-[#F9FAFB] scroll-smooth"
>
  {aiResult}
</pre>

            {disclaimer && (
              <p className="mt-6 text-xs text-[#3F3F3F]/60 italic border-t pt-3">
                {disclaimer}
              </p>
            )}
          </div>
        )}

        {/* === Footer === */}
        <p className="mt-14 text-[18px] text-[#3F3F3F]/50">
          AI.V Health Monitor · 2025
        </p>
      </div>
    </div>
  );
}
