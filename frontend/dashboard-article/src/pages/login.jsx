import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logocodepie.png";

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
    <div style={styles.page}>
      {/* Logo */}
      <div style={styles.logoWrapper}>
        <img src={logo} alt="ArticleFlow Logo" style={styles.logo} />
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Selamat Datang</h2>
          <p style={styles.subtitle}>Masuk ke akun Anda untuk menulis dan mengunduh artikel</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        <form onSubmit={handleLoginSubmit} style={styles.form}>
          {/* Username atau Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username atau Email</label>
            <div
              style={styles.inputWrapper}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#630ed4";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,14,212,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#c6c6cd";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="Masukkan username atau email"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <span style={styles.forgotLink}>Lupa Password?</span>
            </div>
            <div
              style={styles.inputWrapper}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#630ed4";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,14,212,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#c6c6cd";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={styles.inputIcon}>🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={styles.rememberRow}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#630ed4" }}
            />
            <label htmlFor="remember" style={styles.rememberLabel}>Ingat saya</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: loading
                ? "#999"
                : "linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sedang masuk..." : "Masuk Sekarang"}
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Atau masuk dengan</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social Buttons */}
          <div style={styles.socialGroup}>
            <button
              type="button"
              style={styles.socialBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <span style={{ fontSize: "18px" }}>G</span>
              <span style={styles.socialLabel}>Continue with Google</span>
            </button>
            <button
              type="button"
              style={styles.socialBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <span style={{ fontSize: "18px" }}>🍎</span>
              <span style={styles.socialLabel}>Continue with Apple</span>
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p style={styles.registerText}>
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={styles.registerLink}
          >
            Daftar Baru
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    backgroundColor: "#f7f9fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "'Inter', sans-serif",
  },
  logoWrapper: {
    marginBottom: "24px",
  },
  logo: {
    height: "100px",
    width: "auto",
    objectFit: "contain",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 4px 24px rgba(19,27,46,0.08)",
    border: "1px solid rgba(0,0,0,0.06)",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "28px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#191c1e",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#45464d",
    lineHeight: 1.5,
  },
  errorBox: {
    backgroundColor: "#ffdad6",
    color: "#93000a",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#45464d",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#630ed4",
    cursor: "pointer",
    fontWeight: 500,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7f9fb",
    border: "1px solid #c6c6cd",
    borderRadius: "10px",
    padding: "12px 14px",
    transition: "all 0.2s",
  },
  inputIcon: {
    marginRight: "10px",
    fontSize: "16px",
  },
  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "15px",
    color: "#191c1e",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginLeft: "8px",
    fontSize: "16px",
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  rememberLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#45464d",
  },
  submitBtn: {
    width: "100%",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    marginTop: "4px",
    transition: "opacity 0.2s",
    letterSpacing: "0.3px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "4px 0",
  },
  dividerLine: {
    height: "1px",
    backgroundColor: "#c6c6cd",
    flex: 1,
  },
  dividerText: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#45464d",
    whiteSpace: "nowrap",
  },
  socialGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    border: "1px solid #c6c6cd",
    backgroundColor: "#ffffff",
    padding: "11px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  socialLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#191c1e",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#45464d",
    marginTop: "24px",
  },
  registerLink: {
    color: "#630ed4",
    fontWeight: 700,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontSize: "14px",
    textDecoration: "underline",
  },
};