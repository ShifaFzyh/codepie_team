import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage        from "./pages/landingpage";
import Login              from "./pages/login";
import Register           from "./pages/register";
import DashboardAdmin     from "./pages/dashboardAdmin";
import AdminCreateArtikel from "./pages/adminCreateArtikel";
import AdminKelolaUser    from "./pages/adminKelolaUser";
import DashboardUser      from "./pages/dashboardUser";
import UserEditArtikel    from "./pages/userEditArtikel";

// Definisikan PrivateRoute dulu sebelum App
function PrivateRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role") || "user";
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={
          <PrivateRoute allowedRole="admin">
            <DashboardAdmin />
          </PrivateRoute>
        }/>
        <Route path="/admin/articles/create" element={
          <PrivateRoute allowedRole="admin">
            <AdminCreateArtikel />
          </PrivateRoute>
        }/>
        <Route path="/admin/users" element={
          <PrivateRoute allowedRole="admin">
            <AdminKelolaUser />
          </PrivateRoute>
        }/>

        {/* User */}
        <Route path="/editor/create" element={
          <PrivateRoute allowedRole="user">
            <DashboardUser />
          </PrivateRoute>
        }/>
        <Route path="/editor/edit/:id" element={
          <PrivateRoute allowedRole="user">
            <UserEditArtikel />
          </PrivateRoute>
        }/>

        {/* Fallback — taruh paling bawah */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}