"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";

/* ================= TYPES ================= */

type ChatMessage = {
  sender: "user" | "bot";
  type: "text" | "buttons" | "report_analysis" | "prescription_analysis";
  content: string;
  buttons?: { label: string; action: string }[];
  metadata?: any;
};

/* ================= ROLE CONFIG ================= */

const ROLE_CONFIG = {
  parent: {
    greeting: "Welcome to Savemom Hospital",
    subtitle: "Maternal & family care support",
    actions: [
      { title: "Check-Up", desc: "Get a check-up with a doctor.", action: "checkup" },
      { title: "Appointments", desc: "Book or view appointments.", action: "appointments" },
      { title: "My Reports", desc: "View medical reports.", action: "my reports" },
      { title: "My Prescriptions", desc: "View prescriptions.", action: "my prescriptions" },
    ],
  },
  doctor: {
    greeting: "Doctor Dashboard",
    subtitle: "Patient management & clinical tools",
    actions: [
      { title: "Patient Appointments", desc: "View schedules.", action: "doctor appointments" },
      { title: "Patient Reports", desc: "Review reports.", action: "review reports" },
      { title: "Prescriptions", desc: "Manage prescriptions.", action: "manage prescriptions" },
      { title: "Clinical Guidance", desc: "Ask clinical questions.", action: "clinical guidance" },
    ],
  },
  nurse: {
    greeting: "Nurse Console",
    subtitle: "Checkups, vitals & patient assistance",
    actions: [
      { title: "Scheduled Checkups", desc: "View checkups.", action: "scheduled checkups" },
      { title: "Record Vitals", desc: "Record patient vitals.", action: "record vitals" },
      { title: "Assist Doctor", desc: "Assist consultations.", action: "assist doctor" },
      { title: "Follow-ups", desc: "Pending follow-ups.", action: "patient followups" },
    ],
  },
};

/* ================= HELPER COMPONENTS ================= */

const WellnessGauge = ({ score }: { score: number }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const offset = circumference - (safeScore / 100) * circumference;
  const color = safeScore > 80 ? "#10b981" : safeScore > 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="45" cy="45" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center", width: "100%" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#f8fafc" }}>{safeScore}</div>
        <div style={{ fontSize: 8, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Score</div>
      </div>
    </div>
  );
};

const MetricBar = ({ label, current, min, max, unit }: any) => {
  const range = max - min;
  const percentage = range === 0 ? 50 : Math.min(100, Math.max(0, ((current - min) / range) * 100));
  const isNormal = current >= min && current <= max;
  const color = isNormal ? "#10b981" : "#ef4444";

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
        <span style={{ color: "#94a3b8", fontWeight: "bold" }}>{label}</span>
        <span style={{ color: "#f8fafc" }}>{current} {unit}</span>
      </div>
      <div style={{ height: 6, background: "#1f2937", borderRadius: 3, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            background: color,
            borderRadius: 3,
            transition: "width 1s ease"
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 9, color: "#64748b" }}>
        <span>Ref: {min}-{max}</span>
        <span style={{ color: isNormal ? "#10b981" : "#ef4444" }}>{isNormal ? "Normal" : "Out of Range"}</span>
      </div>
    </div>
  );
};

const MedicalIcon = ({ type }: { type: string }) => {
  const icons: any = {
    diet: "🥗",
    water: "💧",
    rest: "🛌",
    activity: "🚶",
    default: "✨"
  };
  return <span style={{ fontSize: 18 }}>{icons[type] || icons.default}</span>;
};

/* ================= COMPONENT ================= */

export default function ChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [reason, setReason] = useState("");
  const [dateTime, setDateTime] = useState("");

  const [role, setRole] = useState<keyof typeof ROLE_CONFIG>("parent");
  const [userName, setUserName] = useState("User");
  const [token, setToken] = useState<string | null>(null);
  const [config, setConfig] = useState(ROLE_CONFIG.parent);

  /* ================= AUTH & STATE INITIALIZATION ================= */

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = (localStorage.getItem("role") as keyof typeof ROLE_CONFIG) || "parent";
    const storedName = localStorage.getItem("user_name") || "User";

    setToken(storedToken);
    setRole(storedRole);
    setUserName(storedName);
    setConfig(ROLE_CONFIG[storedRole]);

    if (!storedToken) {
      router.replace("/auth/login");
    }
  }, [router]);


  /* ================= CHAT SEND ================= */
  const [reportFile, setReportFile] = useState<File | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (text === "voice modular") {
      setMessages((prev) => [...prev, { sender: "user", type: "text", content: "Voice Modular" }]);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "🎙️ Voice modular system is a future update. We'll be implementing it soon!" },
      ]);
      return;
    }

    if (text === "upload report") {
      const fileInput = document.getElementById("report-upload") as HTMLInputElement;
      fileInput?.click();
      return;
    }

    if (text === "upload_prescription") {
      const fileInput = document.getElementById("prescription-upload") as HTMLInputElement;
      fileInput?.click();
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", type: "text", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8001/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, role }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: data.type,
          content: data.response,
          buttons: data.buttons || [],
          metadata: data.metadata
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview URL if it's an image
    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImagePreview(objectUrl);
    } else {
      setUploadedImagePreview(null);
    }

    setMessages((prev) => [...prev, { sender: "user", type: "text", content: `Uploading report: ${file.name}` }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8001/chat/upload-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      // If backend provided a preview image (for PDFs converted to images), use it
      if (data.metadata && data.metadata.preview_image) {
        setUploadedImagePreview(data.metadata.preview_image);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: data.type || "report_analysis",
          content: data.response,
          metadata: data.metadata
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "Failed to process the report." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImagePreview(objectUrl);
    }

    setMessages((prev) => [...prev, { sender: "user", type: "text", content: `Uploading prescription: ${file.name}` }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8001/chat/upload-prescription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: data.type || "prescription_analysis",
          content: data.response,
          metadata: data.metadata
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "Failed to process the prescription." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD FUNCTION ================= */
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadReport = async (msgMetadata: any) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // PAGE 1: Original Uploaded Report
      if (uploadedImagePreview) {
        const img = new Image();
        img.src = uploadedImagePreview;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        const imgProps = pdf.getImageProperties(imgData);
        const margin = 15;
        const displayWidth = pdfWidth - (margin * 2);
        const displayHeight = (imgProps.height * displayWidth) / imgProps.width;

        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text("PAGE 1: ORIGINAL MEDICAL DOCUMENT", 15, 12);
        pdf.addImage(imgData, "JPEG", 15, 15, displayWidth, Math.min(displayHeight, pdfHeight - 30));
      } else {
        pdf.setFontSize(20);
        pdf.text("Original Document Not Available", pdfWidth / 2, pdfHeight / 2, { align: "center" });
      }

      // PAGE 2: Professional AI Summary
      pdf.addPage();

      const templateId = `pdf-template-${msgMetadata.report_title.replace(/\s+/g, '-')}`;
      const pdfTemplate = document.getElementById(templateId);

      if (pdfTemplate) {
        // Temporarily make it reasonably sized for capture
        const originalStyle = pdfTemplate.style.cssText;
        pdfTemplate.style.display = "block";
        pdfTemplate.style.position = "fixed";
        pdfTemplate.style.top = "0";
        pdfTemplate.style.left = "0";
        pdfTemplate.style.width = "800px";
        pdfTemplate.style.zIndex = "-1000";

        const canvas = await html2canvas(pdfTemplate, {
          scale: 3,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false
        });

        pdfTemplate.style.cssText = originalStyle; // Restore hidden state

        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfImgHeight, pdfHeight));
      } else {
        pdf.setFontSize(14);
        pdf.text("AI Summary Content Generation Failed", 15, 20);
      }

      pdf.save(`SaveMom_Clinical_Summary_${msgMetadata.report_title.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to download professional PDF. Please try again.");
    }
  };

  /* ================= APPOINTMENT SUBMIT ================= */

  const submitAppointment = async () => {
    const res = await fetch("http://127.0.0.1:8001/appointments/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        doctor_name: doctorName,
        reason,
        appointment_time: dateTime,
      }),
    });

    if (res.ok) {
      setShowAppointmentForm(false);
      setDoctorName("");
      setReason("");
      setDateTime("");

      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "✅ Appointment booked successfully." },
      ]);
    } else {
      alert("Failed to book appointment");
    }
  };

  /* ================= UI ================= */

  return (
    <main style={{ minHeight: "100vh", background: "#0b1220", color: "white", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ color: "#3bc9db", marginBottom: 4 }}>Savemom Hospital Assistant</h2>
          <p style={{ opacity: 0.8, margin: 0 }}>BBMP Hospital – Madurai Branch</p>
        </div>
        <Link href="/analytics" style={{
          background: "rgba(59, 201, 219, 0.1)",
          color: "#3bc9db",
          padding: "8px 16px",
          borderRadius: 12,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: "bold",
          border: "1px solid rgba(59, 201, 219, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          📊 Health Analytics
        </Link>
      </div>

      <h1 style={{ color: "#4dabf7", marginTop: 20 }}>Hello {userName},</h1>
      <p>{config.greeting}</p>
      <p style={{ opacity: 0.85 }}>{config.subtitle}</p>

      {/* QUICK ACTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "24px 0" }}>
        {config.actions.map((item) => (
          <div
            key={item.title}
            onClick={() => sendMessage(item.action)}
            style={{ background: "#2f9e9e", padding: 20, borderRadius: 16, cursor: "pointer" }}
          >
            <h3>{item.title}</h3>
            <p style={{ fontSize: 14 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ minHeight: 200 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.type === "report_analysis" ? "center" : (msg.sender === "user" ? "right" : "left") }}>
            <div
              style={{
                display: msg.type === "report_analysis" ? "block" : "inline-block",
                background: msg.type === "report_analysis" ? "transparent" : (msg.sender === "user" ? "#2563eb" : "#1e293b"),
                padding: msg.type === "report_analysis" ? 0 : 10,
                borderRadius: 10,
                marginTop: 6,
                width: msg.type === "report_analysis" || msg.type === "prescription_analysis" ? "100%" : "auto"
              }}
            >
              {(msg.type === "report_analysis" || msg.type === "prescription_analysis") && msg.metadata ? (
                <div
                  ref={reportRef}
                  style={{ marginTop: 8, textAlign: "left", width: "100%", maxWidth: 800, background: "#1a2234", borderRadius: 16, overflow: "hidden", border: "1px solid #2d3748", margin: "0 auto" }}
                >
                  {/* HEADER IMAGE PREVIEW */}
                  <div style={{ height: 160, background: "#2d3748", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

                    {uploadedImagePreview ? (
                      // Display uploaded image if available
                      <img
                        src={uploadedImagePreview}
                        alt="Report Preview"
                        style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.9 }}
                      />
                    ) : (
                      // Fallback icon
                      <div style={{ color: "#4dabf7", textAlign: "center" }}>
                        <span style={{ fontSize: 40 }}>📄</span>
                        <div style={{ fontSize: 12, fontWeight: "bold" }}>{msg.metadata.report_title}</div>
                      </div>
                    )}

                  </div>

                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h4 style={{ color: "#3bc9db", margin: 0, fontSize: 20, fontWeight: "bold" }}>{msg.metadata.report_title}</h4>
                      <button
                        onClick={() => downloadReport(msg.metadata)}
                        style={{
                          background: "#228be6",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        }}
                        data-html2canvas-ignore
                      >
                        Download Summary ⬇️
                      </button>
                    </div>

                    {/* 1. DYNAMIC FIELDS GRID (PRIORITY) */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      {msg.metadata.extracted_fields?.map((field: any, idx: number) => (
                        <div key={idx} style={{
                          border: "1px solid #2d3748",
                          borderRadius: 12,
                          padding: "12px",
                          background: "#111827",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s"
                        }}>
                          <label style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 4 }}>
                            {field.label}
                          </label>
                          <div style={{ fontSize: 14, color: "#f8fafc", fontWeight: "600" }}>{field.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* 2. PREMIUM HIGHLIGHT METRIC (THE "DROPPER" LOOK) */}
                    {msg.metadata.highlight_metric && (
                      <div style={{
                        margin: "24px 0",
                        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                        borderRadius: 16,
                        padding: "24px",
                        border: "1px solid #334155",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                      }}>
                        {/* Background subtle glow */}
                        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(59, 201, 219, 0.15)", borderRadius: "50%", filter: "blur(40px)" }}></div>

                        <div style={{ position: "relative", zIndex: 1 }}>
                          <div style={{ fontSize: 11, color: "#3bc9db", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                            {msg.metadata.highlight_metric.label}
                          </div>

                          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                            <div style={{ fontSize: 48, fontWeight: "800", color: "#f8fafc", lineHeight: 1 }}>
                              {msg.metadata.highlight_metric.value}
                            </div>
                            <div style={{ fontSize: 18, color: "#94a3b8", fontWeight: "500" }}>
                              {msg.metadata.highlight_metric.unit}
                            </div>
                          </div>

                          {/* Metric Comparisons Graph */}
                          {msg.metadata.metric_comparisons && msg.metadata.metric_comparisons.length > 0 && (
                            <div style={{ marginTop: 24, padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                              <div style={{ fontSize: 10, color: "#3bc9db", fontWeight: "bold", marginBottom: 16, textTransform: "uppercase" }}>Clinical Marker Comparison</div>
                              {msg.metadata.metric_comparisons.map((m: any, idx: number) => (
                                <MetricBar key={idx} {...m} />
                              ))}
                            </div>
                          )}

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
                            <div style={{
                              padding: "6px 14px",
                              borderRadius: 30,
                              background: msg.metadata.health_status?.toLowerCase().includes("normal") ? "rgba(43, 138, 62, 0.2)" : "rgba(224, 49, 49, 0.2)",
                              border: `1px solid ${msg.metadata.health_status?.toLowerCase().includes("normal") ? "#2b8a3e" : "#e03131"}`,
                              color: msg.metadata.health_status?.toLowerCase().includes("normal") ? "#8ce99a" : "#ffa8a8",
                              fontSize: 11,
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              letterSpacing: 0.5
                            }}>
                              {msg.metadata.health_status}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <span style={{ fontSize: 24 }}>{msg.metadata.highlight_metric.icon || "📊"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. MEDICAL SUMMARY & WELLNESS GAUGE */}
                    {(msg.metadata.summary || msg.content) && msg.type !== 'prescription_analysis' && (
                      <div style={{
                        display: "flex",
                        gap: 16,
                        margin: "12px 0",
                        padding: "20px",
                        background: "rgba(59, 201, 219, 0.05)",
                        borderRadius: 16,
                        borderLeft: "5px solid #3bc9db",
                        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)"
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#3bc9db", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>📝</span> MEDICAL SUMMARY
                          </div>
                          <div style={{ fontSize: 15, color: "#f1f5f9", lineHeight: "1.7" }}>
                            {msg.metadata.summary || msg.content}
                          </div>
                        </div>

                        {msg.metadata.wellness_score !== undefined && msg.metadata.wellness_score !== null && (
                          <div style={{
                            borderLeft: "1px solid rgba(255,255,255,0.1)",
                            paddingLeft: 20,
                            textAlign: "center",
                            width: 110,
                            flexShrink: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                          }}>
                            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: "bold", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>AI Wellness</div>
                            <WellnessGauge score={Number(msg.metadata.wellness_score)} />
                            <div style={{ fontSize: 9, color: "#475569", marginTop: 8, width: 90, fontStyle: "italic", lineHeight: 1.2 }}>
                              Indicative Health Index
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PRESCRIPTION MEDICATIONS SECTION */}
                    {msg.type === "prescription_analysis" && msg.metadata.medications && msg.metadata.medications.length > 0 && (
                      <div style={{ marginTop: 20, padding: "20px", background: "rgba(37, 99, 235, 0.08)", borderRadius: 16, border: "1px solid rgba(37, 99, 235, 0.2)" }}>
                        <div style={{ fontSize: 11, color: "#4dabf7", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>💊</span> MEDICATIONS
                        </div>
                        <div style={{ display: "grid", gap: 12 }}>
                          {msg.metadata.medications.map((med: any, idx: number) => (
                            <div key={idx} style={{ padding: 16, background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b" }}>
                              <div style={{ fontSize: 16, fontWeight: "bold", color: "#f8fafc", marginBottom: 4 }}>{med.name}</div>
                              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#94a3b8" }}>
                                {med.dosage && <div><strong>Dosage:</strong> {med.dosage}</div>}
                                {med.frequency && <div><strong>Frequency:</strong> {med.frequency}</div>}
                              </div>
                              {med.instructions && <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}><em>Instructions: {med.instructions}</em></div>}
                              {med.side_effects && med.side_effects.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ fontSize: 11, color: "#ef4444", fontWeight: "bold", textTransform: "uppercase", marginBottom: 4 }}>Potential Side Effects:</div>
                                  <div style={{ fontSize: 12, color: "#fca5a5" }}>{med.side_effects.join(", ")}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3.5 WELLNESS INSIGHTS SECTION */}
                    {msg.metadata.wellness_insights && msg.metadata.wellness_insights.length > 0 && (
                      <div style={{
                        marginTop: 20,
                        padding: "20px",
                        background: "rgba(16, 185, 129, 0.08)", // Soft emerald background
                        borderRadius: 16,
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}>
                        <div style={{ fontSize: 11, color: "#10b981", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>🌿</span> WELLNESS INSIGHTS
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20, color: "#ecfdf5", fontSize: 14, lineHeight: "1.6" }}>
                          {msg.metadata.wellness_insights.map((insight: string, idx: number) => (
                            <li key={idx} style={{ marginBottom: 8, listStyle: "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <MedicalIcon type={insight.toLowerCase().includes("vitamin") ? "diet" : insight.toLowerCase().includes("hydrat") ? "water" : insight.toLowerCase().includes("rest") ? "rest" : insight.toLowerCase().includes("walk") ? "activity" : "default"} />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3.6 MEDICAL DISCLAIMER */}
                    <div style={{ padding: "0 16px", marginTop: 12 }}>
                      <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.4, border: "1px solid #1f2937", borderRadius: 8, padding: 8 }}>
                        <strong>CLINICAL DISCLAIMER:</strong> These AI-generated insights and wellness scores are for educational purposes.
                        They are indicative based on numerical parameters detected. Not a medical diagnosis.
                        Please consult your primary care physician for clinical correlation.
                      </div>
                    </div>

                    {/* 4. DESCRIPTION & FOOTER */}
                    <p style={{ fontSize: 14, color: "#64748b", margin: "16px 0 8px 0", lineHeight: "1.6", fontStyle: "italic" }}>
                      {msg.metadata.description}
                    </p>

                    <div style={{ borderTop: "1px solid #2d3748", marginTop: 20, paddingTop: 16, textAlign: "right" }}>
                      <span style={{ fontSize: 10, color: "#475569", fontWeight: "500" }}>Generated by SaveMom AI Clinical Engine v1.0</span>
                    </div>
                  </div>

                  {/* ================= PROFESSIONAL PDF TEMPLATE (HIDDEN) ================= */}
                  <div
                    id={`pdf-template-${msg.metadata.report_title.replace(/\s+/g, '-')}`}
                    style={{
                      display: "none",
                      width: "800px",
                      background: "white",
                      color: "#1a2234",
                      padding: "40px",
                      fontFamily: "Arial, sans-serif"
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #3bc9db", paddingBottom: "20px", marginBottom: "30px" }}>
                      <div>
                        <h1 style={{ margin: 0, color: "#1a2234", fontSize: "28px" }}>SAVEMOM HOSPITAL</h1>
                        <p style={{ margin: "4px 0", color: "#64748b", fontSize: "14px" }}>Official Clinical AI Summary • BBMP Madurai Branch</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>Date Generated</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>

                    <h2 style={{ fontSize: "22px", color: "#2563eb", marginBottom: "20px" }}>{msg.metadata.report_title}</h2>

                    {/* Fields Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
                      {msg.metadata.extracted_fields?.map((field: any, idx: number) => (
                        <div key={idx} style={{ padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                          <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold" }}>{field.label}</div>
                          <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1e293b" }}>{field.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Highlight Metric */}
                    {msg.metadata.highlight_metric && (
                      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginBottom: "30px" }}>
                        <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "bold", textTransform: "uppercase" }}>Key Clinical Finding: {msg.metadata.highlight_metric.label}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "10px" }}>
                          <span style={{ fontSize: "40px", fontWeight: "bold", color: "#1e3a8a" }}>{msg.metadata.highlight_metric.value}</span>
                          <span style={{ fontSize: "18px", color: "#64748b" }}>{msg.metadata.highlight_metric.unit}</span>
                        </div>
                        <div style={{ marginTop: "15px", padding: "4px 12px", background: msg.metadata.health_status === "Normal" ? "#dcfce7" : "#fee2e2", color: msg.metadata.health_status === "Normal" ? "#166534" : "#991b1b", display: "inline-block", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                          {msg.metadata.health_status}
                        </div>
                      </div>
                    )}

                    {/* Medications Grid for Prescription */}
                    {msg.metadata.medications && msg.metadata.medications.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "18px", color: "#2563eb", marginBottom: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>💊 MEDICATIONS PRESCRIBED</h3>
                        <div style={{ display: "grid", gap: "10px" }}>
                          {msg.metadata.medications.map((med: any, idx: number) => (
                            <div key={idx} style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #3bc9db" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                                <strong style={{ fontSize: "16px", color: "#1e293b" }}>{med.name}</strong>
                                <span style={{ fontSize: "13px", color: "#64748b", background: "#e2e8f0", padding: "2px 8px", borderRadius: "4px" }}>{med.dosage}</span>
                              </div>
                              <div style={{ fontSize: "13px", color: "#475569", marginBottom: "5px" }}>
                                <strong>Frequency:</strong> {med.frequency}
                              </div>
                              <div style={{ fontSize: "13px", color: "#475569", fontStyle: "italic" }}>
                                {med.instructions}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {(msg.metadata.summary || msg.content) && msg.type !== 'prescription_analysis' && (
                      <div style={{ background: "#f0fdfa", borderLeft: "5px solid #0d9488", padding: "20px", borderRadius: "0 8px 8px 0", marginBottom: "30px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#0d9488", marginBottom: "10px" }}>MEDICAL SUMMARY</div>
                        <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#1e293b" }}>{msg.metadata.summary || msg.content}</div>
                      </div>
                    )}

                    {/* Wellness Score in PDF */}
                    {msg.metadata.wellness_score !== undefined && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase" }}>AI Wellness Score</div>
                          <div style={{ fontSize: "32px", fontWeight: "900", color: msg.metadata.wellness_score > 80 ? "#10b981" : "#f59e0b" }}>{msg.metadata.wellness_score}/100</div>
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", maxWidth: "200px", textAlign: "right", fontStyle: "italic" }}>
                          A data-driven indicator of overall health parameters detected in this report.
                        </div>
                      </div>
                    )}

                    {/* Wellness Insights in PDF */}
                    {msg.metadata.wellness_insights && msg.metadata.wellness_insights.length > 0 && (
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#166534", marginBottom: "10px" }}>WELLNESS RECOMMENDATIONS</div>
                        <ul style={{ margin: 0, paddingLeft: "18px", color: "#1e293b", fontSize: "14px" }}>
                          {msg.metadata.wellness_insights.map((insight: string, idx: number) => (
                            <li key={idx} style={{ marginBottom: "6px" }}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p style={{ fontSize: "14px", color: "#475569", fontStyle: "italic", marginBottom: "40px" }}>{msg.metadata.description}</p>

                    {/* Signature Block */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
                      <div style={{ borderTop: "1px solid #1a2234", width: "200px", textAlign: "center", paddingTop: "10px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>SAVEMOM AI ENGINE</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Authorized Digital Summary</div>
                        <div style={{ fontSize: "10px", marginTop: "10px", color: "#94a3b8" }}>Verify at hospital.savemom.in</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "15px", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
                      DISCLAIMER: This document is an AI-generated clinical summary for assistive purposes only.
                      Not a replacement for professional clinical diagnosis. Please consult with your physician.
                    </div>
                  </div>
                </div>
              ) : (
                msg.content
              )}
            </div>

            {
              msg.buttons?.map((btn, j) => (
                <button
                  key={j}
                  onClick={() =>
                    btn.action === "book appointment"
                      ? setShowAppointmentForm(true)
                      : sendMessage(btn.action)
                  }
                  style={{
                    display: "block",
                    marginTop: 6,
                    background: "#334155",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 10px",
                  }}
                >
                  {btn.label}
                </button>
              ))
            }
          </div>
        ))}
        {loading && <p>Assistant is typing...</p>}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 12, borderRadius: 8 }}
        />
        <button onClick={() => sendMessage(input)} style={{ padding: "12px 16px" }}>
          Send
        </button>
        <input
          id="report-upload"
          type="file"
          accept=".pdf,image/*"
          style={{ display: "none" }}
          onChange={handleReportUpload}
        />
        <input
          id="prescription-upload"
          type="file"
          accept=".pdf,image/*"
          style={{ display: "none" }}
          onChange={handlePrescriptionUpload}
        />
      </div>

      {/* APPOINTMENT MODAL */}
      {
        showAppointmentForm && (
          <div style={overlay}>
            <div style={modal}>
              <h3>Book Appointment</h3>
              <input placeholder="Doctor Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
              <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
              <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
              <button onClick={submitAppointment}>Confirm</button>
              <button onClick={() => setShowAppointmentForm(false)}>Cancel</button>
            </div>
          </div>
        )
      }
    </main >
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#0b1220",
  padding: 20,
  borderRadius: 12,
  width: 300,
  display: "flex",
  flexDirection: "column" as const,
  gap: 8,
};
