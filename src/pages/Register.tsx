import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", sex: "", email: "" });
  const [personId, setPersonId] = useState<string>("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [bioDone, setBioDone] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [bioMsg, setBioMsg] = useState("");

  const navigate = useNavigate();
  const API_BASE = "http://192.168.8.167:8000";

  // === Handle form changes ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // === Register API ===
  const handleRegister = async () => {
    setRegistering(true);
    try {
      const res = await axios.post(`${API_BASE}/api/people/register`, form, {
        headers: { "Content-Type": "application/json" },
      });

      if (
        (res.status === 200 || res.status === 201) &&
        (res.data?.id || res.data?.person_id)
      ) {
        const id = res.data.id || res.data.person_id;
        setPersonId(id);
        setRegistered(true);
        alert(`✅ Registration successful!\nPerson ID: ${id}`);
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err: any) {
      if (err?.response) {
        alert(`❌ ${err.response.status} ${err.response.statusText}`);
      } else {
        alert("❌ Failed to connect to server.");
      }
    } finally {
      setRegistering(false);
    }
  };

  // === Fingerprint Enrollment ===
  const handleProceedToBio = async () => {
    setShowModal(true);
    setBioMsg(
      "📋 Instructions — Please Read Carefully\n\n" +
        "👉 Place your finger on the biometric scanner.\n" +
        "💡 When the green light starts blinking, remove your finger.\n" +
        "✋ When the blinking stops, place your finger again to confirm.\n\n" +
        "⏳ Please wait while we store your fingerprint template..."
    );

    try {
      const res = await axios.post(
        `${API_BASE}/api/people/${personId}/biometrics/fingerprint/enroll`,
        {},
        { headers: { Accept: "application/json" } }
      );

      if (res.status === 200 || res.status === 201) {
        setBioMsg(
          (prev) =>
            prev + "\n\n✅ Fingerprint enrollment completed successfully!"
        );
        setBioDone(true);
      } else {
        setBioMsg(
          (prev) => prev + `\n⚠️ Enrollment failed with status ${res.status}`
        );
      }
    } catch (err: any) {
      if (err?.response) {
        const details =
          typeof err.response.data === "object"
            ? JSON.stringify(err.response.data, null, 2)
            : String(err.response.data);
        setBioMsg(
          `❌ ${err.response.status} ${err.response.statusText}\n${details}`
        );
      } else {
        setBioMsg("❌ Failed to connect to sensor or server.");
      }
    }
  };

  // === Redirect to Photo Capture ===
  const handlePhotoCapture = () => {
    navigate(`/photo/${personId}`);
  };

  // === Render UI ===
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6">Register Person</h1>

      {/* === Form Section === */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md text-left space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Sex</label>
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            required
          />
        </div>

        {/* === Buttons === */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            disabled={registering || registered}
            className={`px-4 py-2 rounded text-white ${
              registering || registered
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {registering ? "Registering..." : "Register"}
          </button>

          {/* Proceed to Biometrics */}
          <button
            type="button"
            onClick={handleProceedToBio}
            disabled={!registered || !personId || bioDone}
            className={`px-4 py-2 rounded text-white ${
              !registered || !personId || bioDone
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {bioDone ? "Biometrics Completed" : "Proceed to Biometrics"}
          </button>

          {/* Capture Photo */}
          <button
            type="button"
            onClick={handlePhotoCapture}
            disabled={!registered || !bioDone}
            className={`px-4 py-2 rounded text-white ${
              !registered || !bioDone
                ? "bg-gray-400"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Capture Photo
          </button>
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-[90%] max-w-md text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Fingerprint Registration
            </h3>
            <pre className="text-gray-700 text-left whitespace-pre-wrap bg-gray-50 p-3 rounded-md border mb-6 max-h-80 overflow-y-auto">
              {bioMsg}
            </pre>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
