import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  body {
    font-family: 'Hanken Grotesk', sans-serif;
    background-color: #f7f9fb;
    min-height: max(884px, 100dvh);
    margin: 0;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
  }

  .login-card {
    box-shadow: 0 4px 12px rgba(19, 27, 46, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .focus-ring:focus-within {
    border-color: #0058be;
    box-shadow: 0 0 0 4px rgba(0, 88, 190, 0.1);
  }
`;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("username", result.user.username);

        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Email atau password salah");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <form
        onSubmit={handleLoginSubmit}
        style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          backgroundColor: "#f7f9fb",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          margin: 0,
        }}
      >
        {/* Header */}
        <header style={{ width: "100%", backgroundColor: "#f7f9fb", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px 16px 24px" }}>
          <img
            alt="Article Flow Logo"
            style={{ height: "115px", width: "auto", objectFit: "contain" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSExBgzhJWTbltZ3q1ePhsvyvOSXfmWrZCR8HQkGiBnOBHIkpq8xDux73IBJ8bAPgAiwtbCS0C81NeSsXfMliKYXLow8k62lFGp0Uq9CppG8Acc5iMA_fWkPEdsToN7EC1drsLkwxCaYftEdxtPkVDjS4UBzODNgx3nBjA-4qdRtRluL_yVsNQ4lBXVO5wtyf9AxLlecNYjs3t0ywJOAjEH18gnByclugfcf61Lkt5E2Xm7SYM3HmnHkX-2uoOQFbuCkCuROhQI8c"
          />
        </header>

        {/* Main */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 24px 32px 24px", maxWidth: "448px", margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: 700, color: "#191c1e", marginBottom: "8px" }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: "16px", lineHeight: "24px", color: "#45464d" }}>
              Please enter your details to sign in to your account.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ backgroundColor: "#ffdad6", color: "#93000a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {/* Card */}
          <div className="login-card" style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 600, color: "#45464d", padding: "0 4px" }}>Email</label>
              <div className="focus-ring" style={{ display: "flex", alignItems: "center", backgroundColor: "#f7f9fb", border: "1px solid #c6c6cd", borderRadius: "8px", padding: "12px", transition: "all 0.2s" }}>
                <span className="material-symbols-outlined" style={{ color: "#45464d", marginRight: "12px" }}>mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", width: "100%", fontSize: "16px", color: "#191c1e" }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 600, color: "#45464d", padding: "0 4px" }}>Password</label>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "12px", fontWeight: 500, color: "#0058be", textDecoration: "none" }}>Forgot Password?</a>
              </div>
              <div className="focus-ring" style={{ display: "flex", alignItems: "center", backgroundColor: "#f7f9fb", border: "1px solid #c6c6cd", borderRadius: "8px", padding: "12px", transition: "all 0.2s" }}>
                <span className="material-symbols-outlined" style={{ color: "#45464d", marginRight: "12px" }}>key</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", width: "100%", fontSize: "16px", color: "#191c1e" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="material-symbols-outlined"
                  style={{ color: "#45464d", marginLeft: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 4px" }}>
              <input id="remember" type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#0058be" }} />
              <label htmlFor="remember" style={{ fontSize: "14px", fontWeight: 600, color: "#45464d" }}>Remember me</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", backgroundColor: loading ? "#666" : "#000000", color: "#ffffff", fontSize: "14px", fontWeight: 600, padding: "16px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "transform 0.15s" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? "Sedang masuk..." : "Login"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "8px 0" }}>
              <div style={{ height: "1px", backgroundColor: "#c6c6cd", flex: 1 }} />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#45464d" }}>Or login with</span>
              <div style={{ height: "1px", backgroundColor: "#c6c6cd", flex: 1 }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", border: "1px solid #c6c6cd", backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                <img alt="Google" style={{ width: "20px", height: "20px" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT3Z3hRAcYlythCf9cE_ktpzNGO3O5AIfjvTE6P-8ZHLtyjT_8ceAvOHxNmUKI_ynpgpks4Ejlzg0Go05nA2AwaEMPGOZgbbXOpXzYan8AxY3AgC6hMzR31fNTsG6D8w3MPii50VHceDHDYwZDVFV9c6gm7eV_JClbuoIx94kP14jOd1q-dA6_-Now0hrd93_NhyPtmvJwldnyf5ifUygkBvWIRCtdPNqxzvs7CR21-rRPrbQSkeQTeUTGiX6OSvm0_oAf39K_bpw" />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#191c1e" }}>Continue with Google</span>
              </button>

              <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", border: "1px solid #c6c6cd", backgroundColor: "#ffffff", padding: "12px", borderRadius: "12px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f4f6")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                <span className="material-symbols-outlined" style={{ color: "#191c1e", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>ios</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#191c1e" }}>Continue with Apple</span>
              </button>
            </div>
          </div>

          {/* Register link */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px" }}>
            <p style={{ fontSize: "16px", color: "#45464d" }}>
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/register")}
                style={{ color: "#0058be", fontWeight: 600, textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Register
              </button>
            </p>
          </div>
        </main>

        <footer className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", display: "flex", alignItems: "center", padding: "8px 24px", backgroundColor: "#eceef0", boxShadow: "0 -4px 12px rgba(19,27,46,0.04)", borderRadius: "12px 12px 0 0", zIndex: 50 }} />
      </form>
    </>
  );
}