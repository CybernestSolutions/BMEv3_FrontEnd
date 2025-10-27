import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import doctorImage from "@/assets/doctor-2.png"; // ✅ doctor header image
import { Link } from "react-router-dom";
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

  const API_BASE = "http://192.168.8.112:8000";

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

  if (loading)
    return <p className="text-center mt-10 text-[#3F3F3F]">Loading patient info...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  const patientId = person?.person_id || person?.id || id;
  const qrLink = `${API_BASE}/api/persondetail/${patientId}`;

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
      <div className="w-[900px] h-[1700px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-center">
        {/* === Hero Image === */}
        <div className="relative h-[720px] rounded-t-[28px] overflow-hidden">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-full h-full object-cover object-center rounded-t-[28px]"
            draggable={false}
          />
        </div>

        {/* === Welcome Text === */}
        <div className="px-10 pb-10 pt-15 text-center">
          <h2  className="text-[#3F3F3F] text-2xl font-extrabold mt-4 flex items-center justify-center gap-2"   style={{  fontSize: 40 }}>
            Welcome Back!
          </h2>
          <h3 className="text-[#1C7DA6] text-xl font-bold tracking-tight capitalize" style={{  fontSize: 80 }}>
            {person?.name || "Patient"}
          </h3>

          {/* === Patient Details Box === */}
          <div className="mt-10 mx-auto max-w-[600px] rounded-2xl bg-[color:var(--secondary)]/40 p-8 text-left text-[20px] text-[color:var(--ink)]/80 shadow-inner">
            <p className="text-md text-[#3F3F3F] font-semibold mb-1">
              <span className="text-[#1C7DA6] font-bold">🆔 Patient ID:</span>{" "}
              {patientId}
            </p>
            <p className="text-md text-[#3F3F3F] font-semibold mb-1">
              <span className="text-[#1C7DA6] font-bold">👤 Name:</span>{" "}
              {person?.name}
            </p>
            <p className="text-md text-[#3F3F3F] font-semibold mb-1">
              <span className="text-[#1C7DA6] font-bold">🎂 Age:</span>{" "}
              {person?.age}
            </p>
            <p className="text-md text-[#3F3F3F] font-semibold mb-1">
              <span className="text-[#1C7DA6] font-bold">🚻 Sex:</span>{" "}
              {person?.sex}
            </p>
            <p className="text-md text-[#3F3F3F] font-semibold">
              <span className="text-[#1C7DA6] font-bold">📧 Email:</span>{" "}
              {person?.email}
            </p>
          </div>

          {/* === Message === */}
          <p className="mt-6 text-[#3F3F3F] text-md leading-relaxed text-center">
            Making yourself healthy is the biggest comeback! 💪
          </p>

          {/* === Buttons === */}
          <div className="mt-14 pt-2 flex flex-col items-center gap-7">
            <button
              onClick={() => navigate(`/record_vitals/${patientId}`)}
              className="inline-flex w-[700px] min-h-[96px] items-center bg-[#1C7DA6] justify-center gap-5 rounded-full px-16 py-8 text-[28px] font-extrabold text-white shadow-md" 
            >
           Record Vital Signs
            </button>

            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex w-[700px] min-h-[96px] items-center justify-center gap-5 rounded-full border-3 bg-white px-16 py-8 text-[28px] font-extrabold text-[color:var(--ink)] shadow-md"
            >
              View last Result
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Redirecting to home (15 seconds)
          </p>
        </div>
      </div>

      {/* === QR Code Modal === */}
      {showQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center">
            <h3 className="text-xl font-bold text-[#1C7DA6] mb-4">
              Scan to View Details
            </h3>
            <QRCode value={qrLink} size={200} />
            <p className="text-xs mt-3 text-gray-600 break-all">{qrLink}</p>
            <button
              onClick={() => setShowQRModal(false)}
              className="mt-6 bg-[#1C7DA6] text-white px-6 py-2 rounded-full font-semibold hover:brightness-110 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
