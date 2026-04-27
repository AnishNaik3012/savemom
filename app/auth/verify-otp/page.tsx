"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const identifier = localStorage.getItem("identifier");
    if (!identifier) {
      router.replace("/auth/login");
    }
  }, [router]);

  const verifyOtp = async () => {
    const identifier = localStorage.getItem("identifier");
    if (!identifier || !otp) {
      alert("Missing OTP");
      return;
    }

    const payload = identifier.includes("@")
      ? { email: identifier, otp }
      : { phone: identifier, otp };

    const res = await fetch("http://127.0.0.1:8001/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Invalid OTP");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);

    if (data.is_new_user) {
      router.push("/auth/role-select");
    } else {
      router.push("/chat");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div style={{ width: "320px" }}>
        <h2 style={{ marginBottom: "16px" }}>Enter OTP</h2>

        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "4px",
          }}
        />

        <button
          onClick={verifyOtp}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Verify OTP
        </button>
      </div>
    </main>
  );
}
