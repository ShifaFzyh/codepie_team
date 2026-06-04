import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  }
  .transition-cubic { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
`;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <>
      <style>{styles}</style>

      <div style={{ backgroundColor: "#f7f9fb", color: "#191c1e", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        
        {/* Header - Logo Tengah */}
        <header style={{ backgroundColor: "#f7f9fb", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px", fixed: "top", zIndex: 50 }}>
          <img 
            alt="Article Flow Logo" 
            style={{ height: "155px", width: "auto", objectFit: "contain" }} 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSExBgzhJWTbltZ3q1ePhsvyvOSXfmWrZCR8HQkGiBnOBHIkpq8xDux73IBJ8bAPgAiwtbCS0C81NeSsXfMliKYXLow8k62lFGp0Uq9CppG8Acc5iMA_fWkPEdsToN7EC1drsLkwxCaYftEdxtPkVDjS4UBzODNgx3nBjA-4qdRtRluL_yVsNQ4lBXVO5wtyf9AxLlecNYjs3t0ywJOAjEH18gnByclugfcf61Lkt5E2Xm7SYM3HmnHkX-2uoOQFbuCkCuROhQI8c"
          />
        </header>

        {/* Main Container (Dipaksa melebar lewat inline style) */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", maxWidth: "448px", margin: "0 auto", width: "100%" }}>
          
          {/* Header Judul */}
          <div style={{ width: "100%", textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", tracking: "-0.02em" }}>Create Account</h2>
            <p style={{ fontSize: "16px", color: "#45464d", marginTop: "8px" }}>Sign up to get started</p>
          </div>

          {/* Form Container Card */}
          <div style={{ width: "100%", backgroundColor: "#ffffff", border: "1px solid #c6c6cd", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(19,27,46,0.04)" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleRegisterSubmit}>
              
              {/* Full Name Field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#45464d", marginLeft: "4px" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <input 
                    style={{ window: "100%", width: "100%", backgroundColor: "#f7f9fb", border: "1px solid #c6c6cd", borderRadius: "12px", padding: "12px 12px 12px 40px", fontSize: "16px", outline: "none" }} 
                    placeholder="John Doe" 
                    type="text"
                    required
                  />
                  <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#76777d" }}>person</span>
                </div>
              </div>

              {/* Email Field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#45464d", marginLeft: "4px" }}>Email</label>
                <div style={{ position: "relative" }}>
                  <input 
                    style={{ width: "100%", backgroundColor: "#f7f9fb", border: "1px solid #c6c6cd", borderRadius: "12px", padding: "12px 12px 12px 40px", fontSize: "16px", outline: "none" }} 
                    placeholder="name@example.com" 
                    type="email"
                    required
                  />
                  <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#76777d" }}>mail</span>
                </div>
              </div>

              {/* Password Field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#45464d", marginLeft: "4px" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    style={{ width: "100%", backgroundColor: "#f7f9fb", border: "1px solid #c6c6cd", borderRadius: "12px", padding: "12px 40px 12px 40px", fontSize: "16px", outline: "none" }} 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#76777d" }}>lock</span>
                  <button 
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#45464d", background: "none", border: "none", cursor: "pointer" }} 
                    onClick={() => setShowPassword(!showPassword)} 
                    type="button"
                  >
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button type="submit" style={{ width: "100%", backgroundColor: "#000000", color: "#ffffff", fontSize: "14px", fontWeight: "600", py: "16px", padding: "16px", borderRadius: "12px", border: "none", cursor: "pointer", marginTop: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                Register
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
              <div style={{ height: "1px", flex: 1, backgroundColor: "#c6c6cd" }}></div>
              <span style={{ fontSize: "12px", color: "#45464d", fontWeight: "500" }}>Or register with</span>
              <div style={{ height: "1px", flex: 1, backgroundColor: "#c6c6cd" }}></div>
            </div>

            {/* Social Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <button onClick={() => navigate("/")} type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid #c6c6cd", backgroundColor: "#ffffff", borderRadius: "12px", py: "12px", padding: "12px", cursor: "pointer" }}>
                <img alt="Google" style={{ width: "20px", height: "20px" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8OqEBcAdJvw22mN4V7qJFz_kvWJFefEaa5vDHJVWyuNAhVFmnJ3PoTsPBtZaDc4s2KmXWDGtOdtkJj7dQLh5TS_ZOm6xnCCIc5H31809evnSJJc2NDF7Nm1dYTD8VDV2nIXS10JEbeZZGrygye4KbDzw9c5ADcvqmOOYQCf8WBw1cmODT0pLcupQH42VIsjHRTZN2o92vltDZDCvOcNRcfMTsKchR3F0KdyY2w6e1K7S7SeNmR34zlBCpMez_TFCUt3D421Dou2k"/>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#45464d" }}>Google</span>
              </button>
              <button onClick={() => navigate("/")} type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid #c6c6cd", backgroundColor: "#ffffff", borderRadius: "12px", py: "12px", padding: "12px", cursor: "pointer" }}>
                <span className="material-symbols-outlined" style={{ color: "#000000" }}>ios</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#45464d" }}>Apple</span>
              </button>
            </div>
          </div>

          {/* Link Kembali ke Login */}
          <p style={{ fontSize: "16px", color: "#45464d", marginTop: "24px" }}>
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => navigate("/login")} 
              style={{ color: "#0058be", fontWeight: "600", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Login
            </button>
          </p>
        </main>
      </div>
    </>
  );
}