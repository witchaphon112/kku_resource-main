import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Divider } from "primereact/divider";
import { FaFileImage, FaFileVideo, FaFileAlt, FaDownload, FaLink } from "react-icons/fa";

const tableHeaderStyle = {
  background: "#f6f7fb",
  fontWeight: 700,
  textAlign: "left" as const,
  padding: "12px 10px",
  borderBottom: "2.5px solid #e0e0e0",
  fontSize: 16,
  position: "sticky" as const,
  top: 0,
  zIndex: 2,
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: 15,
  verticalAlign: "middle" as const,
};

const rowStyleEven = {
  background: "#fff",
  transition: "background 0.2s",
};
const rowStyleOdd = {
  background: "#f9fafc",
  transition: "background 0.2s",
};

const btnStyle = {
  background: "#1976d2",
  color: "#fff",
  padding: "5px 18px",
  borderRadius: 18,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 15,
  border: "none",
  boxShadow: "0 1px 4px rgba(60,60,60,0.07)",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  transition: "background 0.15s, box-shadow 0.15s",
};

const btnHoverStyle = {
  background: "#1452a3",
  boxShadow: "0 2px 8px rgba(40,60,160,0.15)",
};

const typeIcon = (type: string) => {
  switch (type) {
    case "image":
      return <FaFileImage color="#b71c1c" title="Image" style={{ marginRight: 8 }} />;
    case "video":
      return <FaFileVideo color="#2962ff" title="Video" style={{ marginRight: 8 }} />;
    default:
      return <FaFileAlt color="#455a64" title="File" style={{ marginRight: 8 }} />;
  }
};

import React, { useState } from "react";

const DownloadHistoryPage = () => {
  const { user } = useAuth();
  const { getDownloads } = useDownloadHistory();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (!user) return (
    <div style={{ textAlign: "center", marginTop: 40, color: "#888", fontSize: 18 }}>
      กรุณาเข้าสู่ระบบเพื่อดูประวัติการดาวน์โหลด
    </div>
  );

  const downloads = getDownloads(user.id || user.email);

  return (
    <div style={{
      maxWidth: 980,
      margin: "40px auto",
      padding: "28px 16px 30px 16px",
      background: "#f8fafc",
      borderRadius: 24,
      boxShadow: "0 4px 24px rgba(44,62,80,0.06)",
    }}>
      <h2 style={{
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: 0.5,
        color: "#212121",
        fontWeight: 800,
        fontSize: 28,
      }}>ประวัติการดาวน์โหลด</h2>
      <div style={{ maxWidth: 420, margin: "0 auto 12px auto", color: "#1976d2", textAlign: "center", fontSize: 15 }}>
        รายการดาวน์โหลดไฟล์ของคุณ จัดเรียงล่าสุดไว้บนสุด
      </div>
      <Divider />
      {downloads.length === 0 ? (
        <div style={{ textAlign: "center", color: "#bdbdbd", marginTop: 44, fontSize: 18 }}>
          <FaFileAlt style={{ fontSize: 40, color: "#e0e0e0" }} /><br />
          ไม่มีประวัติการดาวน์โหลด
        </div>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 18 }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 820,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(30,60,120,0.05)"
          }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>#</th>
                <th style={tableHeaderStyle}>ชื่อไฟล์</th>
                <th style={tableHeaderStyle}>ประเภท</th>
                <th style={tableHeaderStyle}>วันที่ดาวน์โหลด</th>
                <th style={tableHeaderStyle}>ลิงก์ไฟล์</th>
                <th style={tableHeaderStyle}>ดาวน์โหลดอีกครั้ง</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((item, idx) => (
                <tr
                  key={item.id + item.date}
                  style={{
                    ...(idx % 2 === 0 ? rowStyleEven : rowStyleOdd),
                    ...(hoveredRow === idx ? { background: "#e3f2fd" } : {}),
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={cellStyle}>{idx + 1}</td>
                  <td style={cellStyle}>
                    {typeIcon(item.type)}
                    {item.title}
                  </td>
                  <td style={cellStyle}>
                    {item.type === "image"
                      ? "รูปภาพ"
                      : item.type === "video"
                      ? "วิดีโอ"
                      : item.type}
                  </td>
                  <td style={cellStyle}>
                    {new Date(item.date).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={cellStyle}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        fontWeight: 500,
                        textDecoration: "underline",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 15,
                      }}
                    >
                      <FaLink style={{ fontSize: 16 }} /> เปิดไฟล์
                    </a>
                  </td>
                  <td style={cellStyle}>
                    <a
                      href={item.url}
                      download={item.title || "download"}
                      style={{
                        ...btnStyle,
                        ...(hoveredRow === idx ? btnHoverStyle : {}),
                      }}
                    >
                      <FaDownload /> ดาวน์โหลด
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DownloadHistoryPage;
