import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Login from "./pages/login";
import Register from "./pages/register";
import DashboardAdmin from "./pages/dashboardAdmin";
import AdminCreateArtikel from "./pages/adminCreateArtikel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin"    element={<DashboardAdmin />} />
        <Route path="/admin/articles/create" element={<AdminCreateArtikel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}