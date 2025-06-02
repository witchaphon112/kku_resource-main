import { useEffect, useMemo, useState } from "react";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import { FaFileImage, FaFileVideo, FaFileAlt, FaDownload, FaLink, FaEye } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const COLORS = {
  black: "#2d3436",
  darkGray: "#636e72",
  gray: "#b2bec3",
  lightGray: "#f1f2f6",
  white: "#ffffff",
  accent: "#4a90e2",
  accentLight: "#f5f9ff",
  danger: "#ff6b6b",
  success: "#51cf66",
  warning: "#ffd43b",
};

const GRADIENTS = {
  header: "linear-gradient(135deg, #2d3436 0%, #434343 100%)",
  background: "linear-gradient(135deg, #fff 0%, #f7f7f7 100%)",
  card: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
};

const useStyles = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "4rem",
    background: GRADIENTS.background,
    borderRadius: 24,
    boxShadow: "0 4px 24px rgba(45,52,54,0.08)",
    transition: "all 0.3s ease",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 48,
    animation: "fadeIn 0.5s ease-out",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: 0.5,
    position: "relative" as const,
    display: "inline-block",
    "&::after": {
      content: '""',
      position: "absolute" as const,
      bottom: -8,
      left: "50%",
      transform: "translateX(-50%)",
      width: 80,
      height: 4,
      background: COLORS.accent,
      borderRadius: 2,
    },
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.darkGray,
    maxWidth: 580,
    margin: "0 auto 20px auto",
    lineHeight: 1.6,
  },
  filterSection: {
    display: "flex",
    gap: 20,
    marginBottom: 32,
    flexWrap: "wrap" as const,
    alignItems: "center",
    padding: "24px",
    background: COLORS.white,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 20px rgba(30,60,120,0.1)",
    },
  },
  searchBox: {
    flex: 1,
    minWidth: 280,
  },
  filterBox: {
    minWidth: 180,
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  statCard: {
    background: GRADIENTS.card,
    padding: "28px 32px",
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(45,52,54,0.05)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: `2px solid ${COLORS.lightGray}`,
    position: "relative" as const,
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 24px rgba(45,52,54,0.12)",
      borderColor: COLORS.accent,
      "& $statValue": {
        color: COLORS.accent,
      },
    },
    "&::before": {
      content: '""',
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(45deg, transparent, rgba(74, 144, 226, 0.03))",
      transition: "opacity 0.3s ease",
      opacity: 0,
    },
    "&:hover::before": {
      opacity: 1,
    },
  },
  statTitle: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    fontWeight: 600,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.black,
    transition: "color 0.3s ease",
  },
  tableContainer: {
    overflowX: "auto" as const,
    borderRadius: 20,
    background: COLORS.white,
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 20px rgba(30,60,120,0.1)",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "separate" as const,
    borderSpacing: "0",
    minWidth: 820,
  },
  tableHeader: {
    background: GRADIENTS.header,
    color: COLORS.white,
    fontWeight: 600,
    textAlign: "left" as const,
    padding: "20px 24px",
    fontSize: 15,
    position: "sticky" as const,
    top: 0,
    zIndex: 2,
    letterSpacing: 0.8,
    borderBottom: `3px solid ${COLORS.black}`,
    "&:first-child": {
      borderTopLeftRadius: 16,
    },
    "&:last-child": {
      borderTopRightRadius: 16,
    },
  },
  tableCell: {
    padding: "16px 24px",
    borderBottom: `1px solid ${COLORS.lightGray}`,
    fontSize: 15,
    verticalAlign: "middle" as const,
    color: COLORS.black,
    transition: "all 0.2s ease",
  },
  rowEven: {
    background: COLORS.white,
    transition: "all 0.3s ease",
  },
  rowOdd: {
    background: COLORS.lightGray,
    transition: "all 0.3s ease",
  },
  rowHover: {
    background: COLORS.accentLight,
    "& $tableCell": {
      color: COLORS.accent,
    },
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    color: COLORS.darkGray,
    "&:hover": {
      background: COLORS.accentLight,
      color: COLORS.accent,
      transform: "translateY(-2px)",
    },
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "80px 20px",
    color: COLORS.darkGray,
    background: COLORS.white,
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(30,60,120,0.05)",
  },
  emptyIcon: {
    fontSize: 64,
    color: COLORS.gray,
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    fontSize: 15,
    border: `2px solid ${COLORS.lightGray}`,
    borderRadius: 12,
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: COLORS.accent,
      boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
    },
  },
  typeDropdown: {
    width: "100%",
    "& .p-dropdown": {
      border: `2px solid ${COLORS.lightGray}`,
      borderRadius: 12,
      transition: "all 0.3s ease",
    },
    "& .p-dropdown:hover": {
      borderColor: COLORS.accent,
    },
    "& .p-dropdown:not(.p-disabled).p-focus": {
      boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
      borderColor: COLORS.accent,
    },
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    "& .p-button": {
      width: 36,
      height: 36,
      transition: "all 0.2s ease",
    },
    "& .p-button:hover": {
      transform: "translateY(-2px)",
    },
    "& .p-button.p-button-danger:hover": {
      backgroundColor: `${COLORS.danger} !important`,
    },
  },
};

const typeIcon = (type: string) => {
  switch (type) {
    case "image":
      return <FaFileImage color={COLORS.accent} title="Image" style={{ marginRight: 8 }} />;
    case "video":
      return <FaFileVideo color={COLORS.darkGray} title="Video" style={{ marginRight: 8 }} />;
    default:
      return <FaFileAlt color={COLORS.darkGray} title="File" style={{ marginRight: 8 }} />;
  }
};

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl: string;
  downloadedAt: string;
}

const DownloadHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { downloads = [], addDownload, removeDownload } = useDownloadHistory();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const filteredDownloads = useMemo(() => {
    if (!downloads) return [];
    
    return downloads.filter((item: DownloadItem) => {
      const matchesSearch = (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesType = !filterType || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [downloads, searchTerm, filterType]);

  const stats = useMemo(() => {
    if (!downloads) return {
      total: 0,
      images: 0,
      videos: 0,
      documents: 0,
      others: 0
    };

    return {
      total: downloads.length,
      images: downloads.filter((item: DownloadItem) => item.type === "image").length,
      videos: downloads.filter((item: DownloadItem) => item.type === "video").length,
      documents: downloads.filter((item: DownloadItem) => item.type === "document").length,
      others: downloads.filter((item: DownloadItem) => 
        !["image", "video", "document"].includes(item.type)
      ).length,
    };
  }, [downloads]);

  const handleViewResource = (resourceId: string) => {
    navigate(`/resource/${resourceId}`);
  };

  const handleDownload = async (item: DownloadItem) => {
    try {
      const response = await fetch(item.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      addDownload(item.id, {
        ...item,
        downloadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 60, color: COLORS.darkGray, fontSize: 18 }}>
        กรุณาเข้าสู่ระบบเพื่อดูประวัติการดาวน์โหลด
      </div>
    );
  }

  const typeOptions = [
    { label: "ทั้งหมด", value: null },
    { label: "รูปภาพ", value: "image" },
    { label: "วิดีโอ", value: "video" },
    { label: "เอกสาร", value: "document" },
    { label: "อื่นๆ", value: "other" },
  ];

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
          <div style={useStyles.statTitle}>เอกสาร</div>
          <div style={useStyles.statValue}>{stats.documents}</div>
        </div>
      </div>

      <div style={useStyles.filterSection}>
        <span style={useStyles.searchBox}>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาไฟล์..."
            className="p-inputtext-lg"
            style={useStyles.searchInput}
          />
        </span>
        <span style={useStyles.filterBox}>
          <Dropdown
            value={filterType}
            options={typeOptions}
            onChange={(e) => setFilterType(e.value)}
            placeholder="ประเภทไฟล์"
            className="p-dropdown-lg"
            style={useStyles.typeDropdown}
          />
        </span>
      </div>

      {filteredDownloads.length === 0 ? (
        <div style={useStyles.emptyState}>
          <FaFileAlt style={useStyles.emptyIcon} />
          <div style={useStyles.emptyText}>
            {searchTerm || filterType ? "ไม่พบรายการที่ค้นหา" : "ยังไม่มีประวัติการดาวน์โหลด"}
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
                <th style={useStyles.tableHeader}>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredDownloads.map((item: DownloadItem, idx: number) => (
                <tr
                  key={item.id}
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
                      : item.type === "document"
                      ? "เอกสาร"
                      : "ไฟล์อื่นๆ"}
                  </td>
                  <td style={useStyles.tableCell}>
                    {new Date(item.downloadedAt).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td style={useStyles.tableCell}>
                    <div style={useStyles.actionButtons}>
                      <Button
                        icon="pi pi-eye"
                        rounded
                        text
                        severity="info"
                        onClick={() => handleViewResource(item.id)}
                        tooltip="ดูรายละเอียด"
                      />
                      <Button
                        icon="pi pi-download"
                        rounded
                        severity="secondary"
                        onClick={() => handleDownload(item)}
                        tooltip="ดาวน์โหลดอีกครั้ง"
                      />
                      <Button
                        icon="pi pi-trash"
                        rounded
                        text
                        severity="danger"
                        onClick={() => removeDownload(item.id)}
                        tooltip="ลบออกจากประวัติ"
                      />
                    </div>
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
