import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PersonDetail from "./pages/PersonDetail";
import AIAnalysis from "./pages/AIanalysis";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import PhotoCapture from "./pages/PhotoCapture";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-blue-600 text-white p-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/person/1">Person Detail</Link>
        <Link to="/ai/1">AI Analysis</Link>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/ai/:id" element={<AIAnalysis />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/photo/:id" element={<PhotoCapture />} />

        </Routes>
      </main>
    </div>
  );
}
