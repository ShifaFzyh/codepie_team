import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Login from "./pages/login";
import Register from "./pages/register";
import DashboardAdmin from "./pages/dashboardAdmin";
import DashboardUser from "./pages/dashboardUser";
import UserEditArtikel from "./pages/userEditArtikel";
import UserCreateArtikel from "./pages/UserCreateArtikel";
import Navbar from "./components/Navbar";
import Profile from "./pages/profile";
import ArticleDetail from "./pages/articledetail";

function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function WithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={
          <WithNavbar><LandingPage /></WithNavbar>
        } />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Editor */}
        <Route path="/editor/create" element={
          <PrivateRoute allowedRole="editor">
            <WithNavbar><UserCreateArtikel /></WithNavbar>
          </PrivateRoute>
        } />
        <Route path="/editor/edit/:id" element={
          <PrivateRoute allowedRole="editor">
            <WithNavbar><UserEditArtikel /></WithNavbar>
          </PrivateRoute>
        } />
        <Route path="/editor" element={
          <PrivateRoute allowedRole="editor">
            <WithNavbar><DashboardUser /></WithNavbar>
          </PrivateRoute>
        } />

        {/* Admin */}
        {/* Verifikasi Artikel & Kelola Pengguna sekarang jadi tab di dalam DashboardAdmin,
            jadi cukup satu route untuk keduanya. Gunakan query param ?tab=users
            untuk membuka tab Kelola Pengguna langsung dari link eksternal/sidebar. */}
        <Route path="/admin" element={
          <PrivateRoute allowedRole="admin"><DashboardAdmin /></PrivateRoute>
        } />

        {/* Profile */}
        <Route path="/profile" element={
          <PrivateRoute>
            <WithNavbar><Profile /></WithNavbar>
          </PrivateRoute>
        } />

        <Route path="/artikel/:slug" element={
          <WithNavbar><ArticleDetail /></WithNavbar>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}