"use client";

import { useRouter } from "next/navigation";

export default function RoleSelectPage() {
  const router = useRouter();

  const selectRole = (role: string) => {
    localStorage.setItem("role", role);
    router.push("/chat");
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
      <div style={{ width: "360px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "24px" }}>Choose Your Role</h2>

        <button onClick={() => selectRole("parent")} style={btn}>
         Parent
        </button>
        <button onClick={() => selectRole("doctor")} style={btn}>
          Doctor
        </button>
        <button onClick={() => selectRole("nurse")} style={btn}>
           Nurse
        </button>
      </div>
    </main>
  );
}

const btn = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  background: "#2563eb",
  color: "white",
  borderRadius: "4px",
};
