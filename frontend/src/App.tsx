import './index.css'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import GuestFormPage from './pages/GuestFormPage';
import GuestListPage from './pages/GuestListPage';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex gap-6">
      <span className="font-bold text-lg mr-4">Guest Registration</span>
      <Link
        to="/"
        className={`hover:underline ${location.pathname === "/" ? "font-semibold underline" : ""}`}
      >
        Registrasi
      </Link>
      <Link
        to="/guests"
        className={`hover:underline ${location.pathname === "/guests" ? "font-semibold underline" : ""}`}
      >
        Daftar Tamu
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<GuestFormPage />} />
          <Route path="/guests" element={<GuestListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
