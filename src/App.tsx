import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PersonDetail from "./pages/PersonDetail";

import Profile from "./pages/Profile";
import Register from "./pages/Register";
import PhotoCapture from "./pages/PhotoCapture";
import RecordVitals from "./pages/RecordVitals";
import RecordVitalsStep2 from "./pages/RecordVitalsStep2";
import RecordVitalsStep3 from "./pages/RecordVitalsStep3";
import RecordVitalsStep4 from "./pages/RecordVitalsStep4";
import RecordVitalsStep5 from "./pages/RecordVitalsStep5";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person/:id" element={<PersonDetail />} />
  
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/photo/:id" element={<PhotoCapture />} />
          <Route path="/record_vitals/:person_id" element={<RecordVitals />} />
          <Route path="/record_vitals_step2/:person_id" element={<RecordVitalsStep2 />}/>
          <Route path="/record_vitals_step3/:person_id" element={<RecordVitalsStep3 />}/>
          <Route path="/record_vitals_step4/:person_id" element={<RecordVitalsStep4 />}/>
          <Route path="/record_vitals_step5/:person_id" element={<RecordVitalsStep5 />} />
          
        </Routes>
      </main>
    </div>
  );
}
