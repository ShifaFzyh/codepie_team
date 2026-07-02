import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logocodepie.png";
import "../css/register.css";

const API_BASE = "http://localhost:3000/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      return setError("Password minimal 6 karakter");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Password dan konfirmasi password tidak cocok");
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Registrasi berhasil! Silakan login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(result.message || "Gagal mendaftar. Coba lagi.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Logo */}
      <div className="register-logo-wrapper">
        <img src={logo} alt="ArticleFlow Logo" className="register-logo" />
      </div>

      {/* Card */}
      <div className="register-card">
        <div className="register-card-header">
          <h2 className="register-title">Daftar Akun Baru</h2>
          <p className="register-subtitle">Bergabunglah dengan ribuan editor untuk berkontribusi fakta</p>
        </div>

        {/* Error / Success */}
        {error && <div className="register-error-box">{error}</div>}
        {success && <div className="register-success-box">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">

          {/* Nama Lengkap */}
          <div className="register-field-group">
            <label className="register-label">Nama Lengkap</label>
            <div className="register-input-wrapper">
              <span className="register-icon">👤</span>
              <input
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                value={form.name}
                onChange={handleChange}
                className="register-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="register-field-group">
            <label className="register-label">Username</label>
            <div className="register-input-wrapper">
              <span className="register-icon">@</span>
              <input
                name="username"
                type="text"
                placeholder="Masukkan username"
                required
                value={form.username}
                onChange={handleChange}
                className="register-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="register-field-group">
            <label className="register-label">Alamat Email</label>
            <div className="register-input-wrapper">
              <span className="register-icon">✉️</span>
              <input
                name="email"
                type="email"
                placeholder="nama@domain.com"
                required
                value={form.email}
                onChange={handleChange}
                className="register-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="register-field-group">
            <label className="register-label">Password</label>
            <div className="register-input-wrapper">
              <span className="register-icon">🔑</span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                required
                value={form.password}
                onChange={handleChange}
                className="register-input"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="register-eye-btn">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="register-field-group">
            <label className="register-label">Konfirmasi Password</label>
            <div className="register-input-wrapper">
              <span className="register-icon">🔑</span>
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Ketik ulang password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="register-input"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="register-eye-btn">
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`register-submit-btn${loading ? " register-submit-btn--loading" : ""}`}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>

          {/* Divider */}
          <div className="register-divider">
            <div className="register-divider-line" />
            <span className="register-divider-text">Atau daftar dengan</span>
            <div className="register-divider-line" />
          </div>

          {/* Social */}
          <div className="register-social-grid">
            <button type="button" className="register-social-btn">
              <span className="register-social-icon register-social-icon--bold">G</span>
              <span className="register-social-label">Google</span>
            </button>
            <button type="button" className="register-social-btn">
              <span className="register-social-icon">🍎</span>
              <span className="register-social-label">Apple</span>
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="register-login-text">
          Sudah punya akun?{" "}
          <button type="button" onClick={() => navigate("/login")} className="register-login-link">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}
