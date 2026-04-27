// app/page.tsx (This is the file the user actually sees at http://localhost:3000)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Role {
  role_id: string;
  role_name: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [step, setStep] = useState<"email" | "otp" | "role">("email");
  const [loading, setLoading] = useState(false);

  // API base URL
  const API_BASE = "http://localhost:8001";

  const sendOtp = async () => {
    if (!email || !email.includes("@")) return alert("Enter valid email address");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep("otp");
      } else {
        alert("Failed to send OTP");
      }
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter 6 digit OTP");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.is_new_user) {
          // Fetch all available roles for registration
          const rolesRes = await fetch(`${API_BASE}/auth/roles`);
          const allRoles = await rolesRes.json();
          setRoles(allRoles);
        } else {
          // Use roles assigned to existing user
          setRoles(data.roles);
        }
        setStep("role");
      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (err) {
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const selectRole = async (roleId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/select-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role_id: roleId }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        router.push("/chat");
      } else {
        alert("Role selection failed");
      }
    } catch (err) {
      alert("Error selecting role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-4">
      <div className="w-full max-w-md bg-[#112240]/80 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 animate-gradient-x mb-2">
            ALLOCHAT
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Personalised Pregnancy Care</p>
        </div>

        {step === "email" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-3 ml-1">Email Identification</label>
              <input
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-5 outline-none focus:border-blue-500/50 focus:bg-slate-900/60 transition-all placeholder:text-slate-700 text-lg"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.97] transition-all rounded-2xl py-5 font-black text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></span>
                  PROCESSING...
                </span>
              ) : "GET ACCESS"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 font-sans">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80 mb-3 ml-1 text-center">Verification Code</label>
              <input
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-5 outline-none focus:border-emerald-500/50 focus:bg-slate-900/60 transition-all text-center text-3xl tracking-[0.8em] font-mono"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.97] transition-all rounded-2xl py-5 font-black text-lg shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
            >
              {loading ? "VERIFYING..." : "CONFIRM CODE"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors uppercase tracking-widest"
            >
              ← Back to login
            </button>
          </div>
        )}

        {step === "role" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-1">Welcome</h2>
              <p className="text-slate-400 text-sm">Select your journey path</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {roles.map((role) => (
                <button
                  key={role.role_id}
                  onClick={() => selectRole(role.role_id)}
                  className="bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all rounded-[2rem] p-6 flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-all group-hover:scale-110 shadow-inner">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">
                      {role.role_name === "Doctor" ? "🩺" :
                        role.role_name === "Mother" ? "🤰" :
                          role.role_name === "Father" ? "👨‍🍼" : "🔬"}
                    </span>
                  </div>
                  <span className="font-bold text-slate-300 group-hover:text-white transition-colors uppercase text-[10px] tracking-widest">{role.role_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <p className="text-[10px] text-center text-slate-600 leading-relaxed uppercase tracking-tighter">
            Secure maternal care orchestration <br />
            &copy; 2024 SAVEMOM ECOSYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
