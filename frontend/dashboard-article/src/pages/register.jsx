import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logocodepie.png";

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

  const focusStyle = {
    borderColor: "#630ed4",
    boxShadow: "0 0 0 4px rgba(99,14,212,0.1)",
  };
  const blurStyle = {
    borderColor: "#c6c6cd",
    boxShadow: "none",
  };

  const handleFocus = (e) => {
    Object.assign(e.currentTarget.style, focusStyle);
  };
  const handleBlur = (e) => {
    Object.assign(e.currentTarget.style, blurStyle);
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
          <h2 style={styles.title}>Daftar Akun Baru</h2>
          <p style={styles.subtitle}>Bergabunglah dengan ribuan editor untuk berkontribusi fakta</p>
        </div>

        {/* Error / Success */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Nama Lengkap */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <div style={styles.inputWrapper} onFocus={handleFocus} onBlur={handleBlur}>
              <span style={styles.icon}>👤</span>
              <input
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Username */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper} onFocus={handleFocus} onBlur={handleBlur}>
              <span style={styles.icon}>@</span>
              <input
                name="username"
                type="text"
                placeholder="Masukkan username"
                required
                value={form.username}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Alamat Email</label>
            <div style={styles.inputWrapper} onFocus={handleFocus} onBlur={handleBlur}>
              <span style={styles.icon}>✉️</span>
              <input
                name="email"
                type="email"
                placeholder="nama@domain.com"
                required
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper} onFocus={handleFocus} onBlur={handleBlur}>
              <span style={styles.icon}>🔑</span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                required
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Konfirmasi Password</label>
            <div style={styles.inputWrapper} onFocus={handleFocus} onBlur={handleBlur}>
              <span style={styles.icon}>🔑</span>
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Ketik ulang password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: loading ? "#999" : "linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Atau daftar dengan</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social */}
          <div style={styles.socialGrid}>
            <button
              type="button"
              style={styles.socialBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <span style={{ fontSize: "16px", fontWeight: 700 }}>G</span>
              <span style={styles.socialLabel}>Google</span>
            </button>
            <button
              type="button"
              style={styles.socialBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <span style={{ fontSize: "16px" }}>🍎</span>
              <span style={styles.socialLabel}>Apple</span>
            </button>
          </div>
        </form>

        {/* Login link */}
        <p style={styles.loginText}>
          Sudah punya akun?{" "}
          <button type="button" onClick={() => navigate("/login")} style={styles.loginLink}>
            Masuk di sini
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
    marginBottom: "20px",
  },
  logo: {
    height: "90px",
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
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#191c1e",
    marginBottom: "6px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "13px",
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
  successBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
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
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7f9fb",
    border: "1px solid #c6c6cd",
    borderRadius: "10px",
    padding: "11px 14px",
    transition: "all 0.2s",
  },
  icon: {
    marginRight: "10px",
    fontSize: "15px",
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
    fontSize: "15px",
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
  socialGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
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
  loginText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#45464d",
    marginTop: "20px",
  },
  loginLink: {
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