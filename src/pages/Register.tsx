// -------------------------------------------------------------
// src/pages/Register.tsx
// With custom on-screen keyboard for kiosk use
// -------------------------------------------------------------
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";

export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", sex: "", email: "" });
  const [personId, setPersonId] = useState<string>("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [bioDone, setBioDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bioMsg, setBioMsg] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [keyboardValue, setKeyboardValue] = useState("");

  const navigate = useNavigate();
  const API_BASE = "http://192.168.8.112:8000";

  const notify = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    warn: (msg: string) => toast.warn(msg),
  };

  const handleFocus = (field: string, value: string) => {
    setActiveField(field);
    setKeyboardValue(value);
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (val: string) => {
    setKeyboardValue(val);
    setForm({ ...form, [activeField]: val });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // === Register API ===
  const handleRegister = async () => {
    if (!form.name || !form.age || !form.sex || !form.email) {
      notify.warn("⚠️ Please fill in all required fields.");
      return;
    }

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
        notify.success(`✅ Registration successful! Person ID: ${id}`);
      } else {
        notify.warn("⚠️ Unexpected response from server.");
      }
    } catch (err: any) {
      if (err?.response)
        notify.error(`❌ ${err.response.status} ${err.response.statusText}`);
      else notify.error("❌ Failed to connect to server.");
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
          (prev) => prev + "\n\n✅ Fingerprint enrollment completed successfully!"
        );
        setBioDone(true);
        notify.success("✅ Fingerprint enrollment completed successfully!");
      } else {
        setBioMsg(
          (prev) => prev + `\n⚠️ Enrollment failed with status ${res.status}`
        );
        notify.warn("⚠️ Fingerprint enrollment failed. Try again.");
      }
    } catch (err: any) {
      if (err?.response)
        notify.error(`❌ ${err.response.status} ${err.response.statusText}`);
      else notify.error("❌ Failed to connect to sensor or server.");
    }
  };

  const handlePhotoCapture = () => navigate(`/photo/${personId}`);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] relative">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-10 left-10 px-8 py-4 rounded-full text-2xl font-semibold bg-gray-200 text-[#1C7DA6] hover:bg-gray-300 transition-all shadow-sm"
      >
        ⬅ Back
      </button>

      {/* === Main Card === */}
      <div className="mx-auto w-[900px] h-[1500px] bg-white rounded-[28px] shadow-md flex flex-col items-center">
        {/* Header */}
        <div className="pt-20 pb-10 text-center">
          <h1 className="text-[42px] font-extrabold text-[#1C7DA6] mb-2">
            Registration Step 1
          </h1>
          <p className="text-[24px] text-gray-500">Information</p>
        </div>

        {/* Form */}
        <div className="flex-1 w-[700px] text-left space-y-10">
          {/* Full Name */}
          <div>
            <label className="block text-[22px] font-semibold text-[#1C7DA6] mb-2">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onFocus={() => handleFocus("name", form.name)}
              readOnly
              placeholder="Enter full name"
              className="w-full border border-[#C6E4EA] focus:border-[#1C7DA6] px-6 py-6 rounded-[14px] text-[22px] outline-none bg-white"
            />
          </div>

          {/* Age + Sex */}
          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="block text-[22px] font-semibold text-[#1C7DA6] mb-2">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={form.age}
                onFocus={() => handleFocus("age", form.age)}
                readOnly
                placeholder="e.g. 25"
                className="w-full border border-[#C6E4EA] focus:border-[#1C7DA6] px-6 py-6 rounded-[14px] text-[22px] outline-none bg-white"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-[22px] font-semibold text-[#1C7DA6] mb-2">
                Sex
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full border border-[#C6E4EA] focus:border-[#1C7DA6] px-6 py-6 rounded-[14px] text-[22px] outline-none bg-white"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[22px] font-semibold text-[#1C7DA6] mb-2">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onFocus={() => handleFocus("email", form.email)}
              readOnly
              placeholder="name@email.com"
              className="w-full border border-[#C6E4EA] focus:border-[#1C7DA6] px-6 py-6 rounded-[14px] text-[22px] outline-none bg-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pb-20 pt-16 flex flex-col items-center gap-8">
          <button
            onClick={handleRegister}
            disabled={registering || registered}
            className={`w-[700px] min-h-[96px] text-[28px] font-extrabold rounded-full text-white shadow-md transition-all ${
              registering || registered
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1C7DA6] hover:brightness-110"
            }`}
          >
            {registering ? "Registering..." : "Register"}
          </button>

          <button
            onClick={handleProceedToBio}
            disabled={!registered || !personId || bioDone}
            className={`w-[700px] min-h-[96px] text-[28px] font-extrabold rounded-full text-white shadow-md transition-all ${
              !registered || !personId || bioDone
                ? "bg-gray-300"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {bioDone ? "Biometrics Completed" : "Proceed to Biometrics"}
          </button>

          <button
            onClick={handlePhotoCapture}
            disabled={!registered || !bioDone}
            className={`w-[700px] min-h-[96px] text-[28px] font-extrabold rounded-full text-white shadow-md transition-all ${
              !registered || !bioDone
                ? "bg-gray-300"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Capture Photo
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-b from-[#eaf6ff] to-[#d1f4f7] rounded-[32px] shadow-2xl w-[600px] p-10 text-center animate-fadeIn relative overflow-hidden">
            <h2 className="text-[30px] font-extrabold text-[#1C7DA6] mb-6">
              Fingerprint Registration
            </h2>
            <pre className="text-[18px] text-gray-700 text-left whitespace-pre-wrap bg-white p-5 rounded-[20px] border border-[#D5E9ED] mb-8 max-h-[500px] overflow-y-auto">
              {bioMsg}
            </pre>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#1C7DA6] text-white px-12 py-4 rounded-full font-semibold text-[20px] hover:brightness-110 shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* On-Screen Keyboard */}
      {showKeyboard && (
        <OnScreenKeyboard
          value={keyboardValue}
          onInput={handleKeyboardInput}
          onClose={() => setShowKeyboard(false)}
          mode={activeField === "age" ? "number" : "text"}
        />
      )}
    </div>
  );
}
