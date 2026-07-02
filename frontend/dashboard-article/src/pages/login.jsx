import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logocodepie.png";
import "../css/login.css";

const API_BASE = "http://localhost:3000/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("username", result.user.username);
        localStorage.setItem("name", result.user.name || result.user.username);
        localStorage.setItem("email", result.user.email);

        if (remember) {
          localStorage.setItem("rememberIdentifier", identifier);
        }

        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Username/email atau password salah");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <div className="login-logo-wrapper">
        <img src={logo} alt="ArticleFlow Logo" className="login-logo" />
      </div>

      {/* Card */}
      <div className="login-card">
        <div className="login-card-header">
          <h2 className="login-title">Selamat Datang</h2>
          <p className="login-subtitle">Masuk ke akun Anda untuk menulis dan mengunduh artikel</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error-box">{error}</div>
        )}

        <form onSubmit={handleLoginSubmit} className="login-form">
          {/* Username atau Email */}
          <div className="login-field-group">
            <label className="login-label">Username atau Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">👤</span>
              <input
                type="text"
                placeholder="Masukkan username atau email"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field-group">
            <div className="login-label-row">
              <label className="login-label">Password</label>
              <span className="login-forgot-link">Lupa Password?</span>
            </div>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-eye-btn"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="login-remember-row">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="login-checkbox"
            />
            <label htmlFor="remember" className="login-remember-label">Ingat saya</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`login-submit-btn${loading ? " login-submit-btn--loading" : ""}`}
          >
            {loading ? "Sedang masuk..." : "Masuk Sekarang"}
          </button>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">Atau masuk dengan</span>
            <div className="login-divider-line" />
          </div>

          {/* Social Buttons */}
          <div className="login-social-group">
            <button type="button" className="login-social-btn">
              <span className="login-social-icon">G</span>
              <span className="login-social-label">Continue with Google</span>
            </button>
            <button type="button" className="login-social-btn">
              <span className="login-social-icon">🍎</span>
              <span className="login-social-label">Continue with Apple</span>
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="login-register-text">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="login-register-link"
          >
            Daftar Baru
          </button>
        </p>
      </div>
    </div>
  );
}
