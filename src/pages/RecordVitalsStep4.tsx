import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
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

  const API_BASE = "http://192.168.8.112:8000";

  // === Record weight using HX711 API ===
  const handleRecordWeight = async () => {
    setStatus("recording");
    setMessage("⚖️ Measuring weight... Please stay still on the scale.");
    setWeight(null);

    try {
      const response = await axios.get(`${API_BASE}/api/hx711/read/${person_id}`);
      const data = response.data;

      if (!data || !data.weight_kg) throw new Error("Invalid sensor response.");

      setWeight(parseFloat(data.weight_kg.toFixed(2)));
      setStatus("done");
      setMessage("✅ Weight recorded successfully!");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("❌ Failed to record weight. Please try again.");
    }
  };

  // === Compute BMI and BMR ===
  const computeMetrics = () => {
    if (!prevVitals.height || !weight) return { bmi: null, bmr: null };

    const height_m = prevVitals.height * 0.3048; // feet → meters
    const height_cm = height_m * 100;
    const bmi = weight / (height_m * height_m);

    // Mifflin-St Jeor Formula (male, 25 yrs)
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

  // === UI ===
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] p-6 relative">
      {/* === Home and Back Buttons === */}
      <div className="absolute top-10 right-10">
        <Link
          to="/"
          className="text-xl inline-flex items-center gap-2 text-white font-semibold px-10 py-2 rounded-full shadow-md hover:brightness-110 transition-all"
        >
          🏠
        </Link>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-10 left-10 px-6 py-3 rounded-full text-lg font-semibold bg-gray-200 text-[#1C7DA6] hover:bg-gray-300 transition-all shadow-sm"
      >
        ⬅️ Back
      </button>

      {/* === Main Kiosk Card === */}
      <div className="w-[900px] h-[1700px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-center px-16 py-12">
        {/* === Header === */}
        <h1 className="text-[56px] font-extrabold text-[#1C7DA6] leading-tight tracking-tight mb-4">
          ⚖️ Record Weight
        </h1>
        <p className="text-xl text-[#3F3F3F]/80 mb-10">
          Recording weight for{" "}
          <span className="font-semibold text-[#1C7DA6]">{person_id}</span>
        </p>

        {/* === Step Progress === */}
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
                  index <= 3
                    ? "border-[#1C7DA6] bg-[#EAF8FB] text-[#1C7DA6]"
                    : "border-[#D7E7EB] bg-white text-[#D7E7EB]"
                } transition-all duration-300`}
              >
                <span className="text-2xl">{step.icon}</span>
              </div>
              {index < 4 && (
                <div
                  className={`w-20 h-[4px] ${
                    index < 3 ? "bg-[#1C7DA6]" : "bg-[#D7E7EB]"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <p className="text-lg text-[#3F3F3F]/70 mb-10">
          Step 4 of 5 — Record Weight
        </p>

        {/* === Instructions === */}
        <div className="mx-auto max-w-[700px] bg-[#F5F7FA] rounded-3xl shadow-inner text-left p-10 mb-10">
          <h2 className="text-2xl font-bold text-[#1C7DA6] mb-4">
            📋 Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-[20px] text-[#3F3F3F]">
            <li>Step on the digital weight scale evenly with both feet.</li>
            <li>Wait until the reading stabilizes.</li>
            <li>Click <strong>Record Weight</strong> to begin measurement.</li>
          </ol>
        </div>

        {/* === Status Message === */}
        {message && (
          <div
            className={`text-[22px] font-semibold mb-10 ${
              status === "error"
                ? "text-red-600"
                : status === "done"
                ? "text-green-600"
                : "text-[#3F3F3F]"
            }`}
          >
            {message}
          </div>
        )}

        {/* === Record Button === */}
        <button
          onClick={handleRecordWeight}
          disabled={status === "recording"}
          className={`inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md transition-all ${
            status === "recording"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1C7DA6] hover:brightness-110"
          }`}
        >
          ⚖️ {status === "recording" ? "Recording..." : "Record Weight"}
        </button>

        {/* === Summary Section === */}
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
              {prevVitals.height
                ? `${prevVitals.height.toFixed(2)} ft`
                : "Not yet recorded"}
            </li>
            <li>
              <strong>Weight:</strong>{" "}
              {weight ? `${weight.toFixed(2)} kg` : "Not yet recorded"}
            </li>
          </ul>
        </div>

        {/* === Proceed Button === */}
        {status === "done" && (
          <button
            onClick={handleProceed}
            className="mt-14 inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md transition-all bg-green-600 hover:bg-green-700"
          >
            ➡️ Proceed to Step 5: Results Summary
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
