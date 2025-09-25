import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import Emergency from "./pages/Emergency";
import SchoolPanel from "./pages/SchoolPanel";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/school" element={<SchoolPanel />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
