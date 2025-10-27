import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PhotoCapture() {
  const { id } = useParams(); // person_id from the route
  const navigate = useNavigate();

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://192.168.8.112:8000";

  // === Capture photo ===
  const handleCapture = async () => {
    setLoading(true);
    try {
      // ✅ Call the correct API endpoint
      await axios.get(`${API_BASE}/api/capture_image/${id}`);
      // The image should now exist in your Pi folder
      const newImgUrl = `${API_BASE}/pictures/${id}.jpg?time=${Date.now()}`;
      setImgUrl(newImgUrl);
      setIsCaptured(true);
    } catch {
      alert("❌ Failed to capture image from Raspberry Pi.");
    } finally {
      setLoading(false);
    }
  };

  // === Retake photo ===
  const handleRetake = () => {
    setIsCaptured(false);
    setImgUrl(null);
  };

  // === Done button redirect ===
  const handleDone = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">📸 Photo Capture</h1>
      <p className="text-gray-700 mb-6">Person ID: {id}</p>

      {/* === Display captured photo === */}
      <div className="w-[320px] h-[240px] bg-black flex items-center justify-center border rounded-md overflow-hidden mb-4">
        {imgUrl ? (
          <img src={imgUrl} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-sm opacity-60">No photo captured yet</span>
        )}
      </div>

      {/* === Buttons === */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!isCaptured ? (
          <button
            onClick={handleCapture}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Capturing..." : "Capture"}
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Retake
          </button>
        )}

        <button
          onClick={handleDone}
          disabled={!isCaptured}
          className={`px-4 py-2 rounded text-white ${
            !isCaptured
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
