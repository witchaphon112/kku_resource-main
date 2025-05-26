import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Divider } from "primereact/divider";
import { FaFileImage, FaFileVideo, FaFileAlt, FaDownload, FaLink, FaSearch, FaFilter } from "react-icons/fa";
import React, { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const useStyles = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "32px 24px",
    background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
    borderRadius: 24,
    boxShadow: "0 4px 24px rgba(44,62,80,0.08)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#1a237e",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#1976d2",
    maxWidth: 480,
    margin: "0 auto 20px auto",
    lineHeight: 1.5,
  },
  filterSection: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap" as const,
    alignItems: "center",
    padding: "16px 20px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
  },
  searchBox: {
    flex: 1,
    minWidth: 200,
  },
  filterBox: {
    minWidth: 150,
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    padding: "20px 24px",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
    transition: "transform 0.2s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a237e",
  },
  tableContainer: {
    overflowX: "auto" as const,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: 820,
  },
  tableHeader: {
    background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
    color: "#fff",
    fontWeight: 600,
    textAlign: "left" as const,
    padding: "16px",
    fontSize: 15,
    position: "sticky" as const,
    top: 0,
    zIndex: 2,
  },
  tableCell: {
    padding: "16px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 15,
    verticalAlign: "middle" as const,
  },
  rowEven: {
    background: "#fff",
    transition: "background 0.2s",
  },
  rowOdd: {
    background: "#f8fafc",
    transition: "background 0.2s",
  },
  rowHover: {
    background: "#e3f2fd",
  },
  downloadButton: {
    background: "linear-gradient(45deg, #1976d2 0%, #2196f3 100%)",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 20,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    border: "none",
    boxShadow: "0 2px 8px rgba(25,118,210,0.25)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  downloadButtonHover: {
    background: "linear-gradient(45deg, #1565c0 0%, #1976d2 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25,118,210,0.35)",
  },
  fileLink: {
    color: "#1976d2",
    fontWeight: 500,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 15,
    transition: "color 0.2s",
    "&:hover": {
      color: "#1565c0",
    },
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "60px 20px",
    color: "#bdbdbd",
  },
  emptyIcon: {
    fontSize: 48,
    color: "#e0e0e0",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
  },
};

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

const DownloadHistoryPage = () => {
  const { user } = useAuth();
  const { getDownloads } = useDownloadHistory();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  if (!user) return (
    <div style={{ textAlign: "center", marginTop: 60, color: "#888", fontSize: 18 }}>
      กรุณาเข้าสู่ระบบเพื่อดูประวัติการดาวน์โหลด
    </div>
  );

  const downloads = getDownloads(user.id);
  
  const typeOptions = [
    { label: "ทั้งหมด", value: null },
    { label: "รูปภาพ", value: "image" },
    { label: "วิดีโอ", value: "video" },
    { label: "ไฟล์อื่นๆ", value: "other" },
  ];

  const filteredDownloads = useMemo(() => {
    return downloads.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [downloads, searchTerm, filterType]);

  const stats = useMemo(() => {
    return {
      total: downloads.length,
      images: downloads.filter(item => item.type === "image").length,
      videos: downloads.filter(item => item.type === "video").length,
      others: downloads.filter(item => item.type !== "image" && item.type !== "video").length,
    };
  }, [downloads]);

  return (
    <div style={useStyles.container}>
      <div style={useStyles.header}>
        <h1 style={useStyles.title}>ประวัติการดาวน์โหลด</h1>
        <div style={useStyles.subtitle}>
          รายการดาวน์โหลดไฟล์ของคุณ จัดเรียงล่าสุดไว้บนสุด
        </div>
      </div>

      <div style={useStyles.statsSection}>
        <div style={useStyles.statCard}>
          <div style={useStyles.statTitle}>ดาวน์โหลดทั้งหมด</div>
          <div style={useStyles.statValue}>{stats.total}</div>
        </div>
        <div style={useStyles.statCard}>
          <div style={useStyles.statTitle}>รูปภาพ</div>
          <div style={useStyles.statValue}>{stats.images}</div>
        </div>
        <div style={useStyles.statCard}>
          <div style={useStyles.statTitle}>วิดีโอ</div>
          <div style={useStyles.statValue}>{stats.videos}</div>
        </div>
        <div style={useStyles.statCard}>
          <div style={useStyles.statTitle}>ไฟล์อื่นๆ</div>
          <div style={useStyles.statValue}>{stats.others}</div>
        </div>
      </div>

      <div style={useStyles.filterSection}>
        <span style={useStyles.searchBox}>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาไฟล์..."
            style={{ width: "100%", padding: "8px 12px" }}
          />
        </span>
        <span style={useStyles.filterBox}>
          <Dropdown
            value={filterType}
            options={typeOptions}
            onChange={(e) => setFilterType(e.value)}
            placeholder="ประเภทไฟล์"
            style={{ width: "100%" }}
          />
        </span>
      </div>

      {filteredDownloads.length === 0 ? (
        <div style={useStyles.emptyState}>
          <FaFileAlt style={useStyles.emptyIcon} />
          <div style={useStyles.emptyText}>
            {searchTerm || filterType ? "ไม่พบรายการที่ค้นหา" : "ไม่มีประวัติการดาวน์โหลด"}
          </div>
        </div>
      ) : (
        <div style={useStyles.tableContainer}>
          <table style={useStyles.table}>
            <thead>
              <tr>
                <th style={useStyles.tableHeader}>#</th>
                <th style={useStyles.tableHeader}>ชื่อไฟล์</th>
                <th style={useStyles.tableHeader}>ประเภท</th>
                <th style={useStyles.tableHeader}>วันที่ดาวน์โหลด</th>
                <th style={useStyles.tableHeader}>ลิงก์ไฟล์</th>
                <th style={useStyles.tableHeader}>ดาวน์โหลดอีกครั้ง</th>
              </tr>
            </thead>
            <tbody>
              {filteredDownloads.map((item, idx) => (
                <tr
                  key={item.id + item.date}
                  style={{
                    ...(idx % 2 === 0 ? useStyles.rowEven : useStyles.rowOdd),
                    ...(hoveredRow === idx ? useStyles.rowHover : {}),
                  }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={useStyles.tableCell}>{idx + 1}</td>
                  <td style={useStyles.tableCell}>
                    {typeIcon(item.type)}
                    {item.title}
                  </td>
                  <td style={useStyles.tableCell}>
                    {item.type === "image"
                      ? "รูปภาพ"
                      : item.type === "video"
                      ? "วิดีโอ"
                      : item.type}
                  </td>
                  <td style={useStyles.tableCell}>
                    {new Date(item.date).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={useStyles.tableCell}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={useStyles.fileLink}
                    >
                      <FaLink style={{ fontSize: 16 }} /> เปิดไฟล์
                    </a>
                  </td>
                  <td style={useStyles.tableCell}>
                    <a
                      href={item.url}
                      download={item.title || "download"}
                      style={{
                        ...useStyles.downloadButton,
                        ...(hoveredRow === idx ? useStyles.downloadButtonHover : {}),
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
