import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";

interface Person {
  id?: string;
  person_id?: string;
  name: string;
  age: number;
  sex: string;
  email: string;
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const API_BASE = "http://192.168.8.167:8000";

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/persondetail/${id}`);
        setPerson(response.data);
      } catch {
        setError("Failed to fetch patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading patient info...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const patientId = person?.person_id || person?.id || id;
  const qrLink = `${API_BASE}/api/persondetail/${patientId}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4">👋 Welcome, {person?.name || "Patient"}!</h1>

      {/* === Patient Info Card === */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-left mb-6">
        <p><strong>🆔 Patient ID:</strong> {patientId}</p>
        <p><strong>👤 Name:</strong> {person?.name}</p>
        <p><strong>🎂 Age:</strong> {person?.age}</p>
        <p><strong>🚻 Sex:</strong> {person?.sex}</p>
        <p><strong>📧 Email:</strong> {person?.email}</p>
      </div>

      {/* === Action Buttons === */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => navigate(`/record_vitals/${patientId}`)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          🩺 Record Vital Signs
        </button>

        <button
          onClick={() => setShowQRModal(true)}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          📊 View Last Vital Signs Reading
        </button>
      </div>

      {/* === QR Code Modal === */}
      {showQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center w-80">
            <h2 className="text-xl font-semibold mb-4">📱 Scan to View Details</h2>
            <QRCode value={qrLink} size={200} />
            <p className="text-sm mt-3 text-gray-600 break-all">{qrLink}</p>
            <button
              onClick={() => setShowQRModal(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
