import { useParams, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";

export default function RecordVitalsStep5() {
  const { person_id } = useParams();
  const location = useLocation();
  const vitals = location.state || {};

  const qrUrl = `http://192.168.8.167:8000/api/persondetail/${person_id}`;

  // === Computations ===
  const weight = vitals.weight ?? 0; // kg
  const heightFt = vitals.height ?? 0; // ft
  const heightM = heightFt * 0.3048;
  const heightCm = heightFt * 30.48;
  const age = 30; // default if none

  const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;
  const bmr = weight > 0 && heightCm > 0 ? 10 * weight + 6.25 * heightCm - 5 * age + 5 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">✅ Final Check</h1>
      <p className="text-gray-700 mb-6">
        Showing final recorded vitals for <strong>{person_id}</strong>
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-gray-300 rounded-full h-3 mb-8">
        <div className="bg-green-600 h-3 rounded-full" style={{ width: "100%" }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Step 5 of 5 — Results Summary</p>

      {/* Layout: Summary + QR */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        {/* === Summary === */}
        <div className="text-left w-full md:w-1/2">
          <h3 className="text-xl font-semibold mb-3">📊 Recorded Vitals</h3>
          <ul className="space-y-2 text-gray-700">
            <li><strong>SpO₂:</strong> {vitals.spo2 ? `${vitals.spo2.toFixed(1)} %` : "Not recorded"}</li>
            <li><strong>Blood Pulse:</strong> {vitals.bpm ? `${vitals.bpm} BPM` : "Not recorded"}</li>
            <li><strong>Temperature:</strong> {vitals.temperature ? `${vitals.temperature.toFixed(2)} °C` : "Not recorded"}</li>
            <li><strong>Height:</strong> {vitals.height ? `${vitals.height.toFixed(2)} ft` : "Not recorded"}</li>
            <li><strong>Weight:</strong> {vitals.weight ? `${vitals.weight.toFixed(1)} kg` : "Not recorded"}</li>
            <li><strong>BMI:</strong> {bmi ? `${bmi.toFixed(1)} kg/m²` : "—"}</li>
            <li><strong>BMR (approx):</strong> {bmr ? `${bmr.toFixed(0)} kcal/day` : "—"}</li>
          </ul>
        </div>

        {/* === QR Code === */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <QRCode value={qrUrl} size={180} />
          <p className="mt-3 text-sm text-gray-600 break-all">
            Scan to view details:<br />
            <span className="text-blue-600">{qrUrl}</span>
          </p>
        </div>
      </div>

      {/* === Buttons === */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mt-8">
        <button
          className="flex-1 px-6 py-3 rounded-md text-lg bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          🤖 Check with AI
        </button>
        <button
          className="flex-1 px-6 py-3 rounded-md text-lg bg-green-600 hover:bg-green-700 text-white transition"
        >
          ✅ Done
        </button>
      </div>
    </div>
  );
}
