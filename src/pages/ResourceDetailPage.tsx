import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  container: {
    maxWidth: "1160px",
    margin: "36px auto",
    padding: "0 0 24px",
    background: "#fff",
    borderRadius: "1.5rem",
    boxShadow: "0 4px 16px #0001",
    overflow: "hidden",
  },
  heroImageWrap: {
    width: "100%",
    height: "410px",
    background: "#f6f8fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 18,
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
    },
    "&::after": {
      content: '""',
      display: "block",
      position: "absolute",
      left: 0, right: 0, bottom: 0, height: "56px",
      background: "linear-gradient(0deg, #fff 60%, transparent)",
      zIndex: 1,
    },
  },
  mainInfo: {
    padding: "0 38px 8px 38px",
    display: "flex",
    gap: "28px",
    alignItems: "flex-start",
    "@media (max-width: 900px)": {
      flexDirection: "column",
      padding: "0 16px 0 16px",
      gap: 10,
    },
  },
  infoBlock: { flex: 1, minWidth: 230 },
  title: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#222",
    marginBottom: "0.4rem",
    letterSpacing: "-0.5px",
  },
  tagRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  tag: {
    background: "#1976d2",
    color: "#fff",
    fontSize: "0.90rem",
    borderRadius: "999px",
    padding: "0.32em 1.15em",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  meta: {
    fontSize: "1.07rem",
    color: "#666",
    marginBottom: "1rem",
  },
  viewBox: {
    fontSize: "0.98rem",
    color: "#888",
    marginBottom: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  button: {
    display: "inline-block",
    marginTop: 6,
    fontSize: "1rem",
    fontWeight: 700,
    borderRadius: "2rem",
    padding: "0.67em 1.9em",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": { background: "#b71c1c" },
  },
  descSection: {
    padding: "0 38px",
    marginTop: 28,
    "@media (max-width: 900px)": { padding: "0 16px" },
  },
  sectionTitle: {
    fontSize: "1.18rem",
    fontWeight: 700,
    color: "#b71c1c",
    marginBottom: "0.6rem",
    letterSpacing: "0.02em",
    borderBottom: "2px solid #f3d9d9",
    paddingBottom: "0.12em",
  },
  description: {
    fontSize: "1.05rem",
    color: "#3a3a3a",
    marginBottom: 14,
    lineHeight: 1.68,
  },
  detailList: {
    fontSize: "0.96rem",
    color: "#555",
    marginBottom: 18,
    listStyle: "none",
    padding: 0,
    "& li": { marginBottom: "0.36em" },
  },
  relatedWrap: {
    padding: "0 38px",
    marginTop: 24,
    "@media (max-width: 900px)": { padding: "0 10px" },
  },
  relatedRow: {
    display: "flex",
    gap: "1.1rem",
    flexWrap: "wrap",
  },
  relatedCard: {
    width: 178,
    background: "#f8fafd",
    borderRadius: "8px",
    boxShadow: "0 2px 7px #d32f2f12",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.18s",
    "&:hover": { transform: "translateY(-4px) scale(1.03)" },
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  relatedImg: {
    width: "100%",
    height: "118px",
    objectFit: "cover",
    borderBottom: "1px solid #eee",
  },
  relatedTitle: {
    padding: "0.7em 0.85em 0.7em",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#2b2b2b",
    lineHeight: 1.2,
    minHeight: 52,
    display: "flex",
    alignItems: "center",
  },
});

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDownload } = useDownloadHistory();
  const classes = useStyles();
  const { user } = useAuth();
  const resource = resourcesData.resources.find((r) => r.id === id);
  if (!resource) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลทรัพยากร</p>;

  // หา related images by TAG
  const relatedByTag = resourcesData.resources
    .filter((item) =>
      item.id !== resource.id &&
      item.tags?.some(tag => resource.tags?.includes(tag))
    ).slice(0, 8);

  // related by category (ยกเว้นตัวเองและไม่ซ้ำ tag)
  const relatedByCategory = resourcesData.resources
    .filter((item) =>
      item.category === resource.category &&
      item.id !== resource.id &&
      !item.tags?.some(tag => resource.tags?.includes(tag))
    ).slice(0, 5);

  const handleLoginRedirect = () => {
    navigate(`/login?redirect=/resource/${id}`);
  };

  const handleDownload = () => {
    if (!user) return;
    addDownload(user.id || user.email, {
      id: resource.id,
      title: resource.title,
      type: resource.type,
      date: new Date().toISOString(),
      url: resource.fileUrl,
    });
    const link = document.createElement("a");
    link.href = resource.fileUrl;
    link.download = resource.title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={classes.container}>
      {/* HERO IMAGE */}
      <div className={classes.heroImageWrap}>
        <img src={resource.thumbnailUrl} alt={resource.title} />
      </div>
      <div className={classes.mainInfo}>
        <div className={classes.infoBlock}>
          <div className={classes.title}>{resource.title}</div>
          <div className={classes.tagRow}>
            <span className={classes.tag}>{resource.type?.toUpperCase()}</span>
            {resource.tags && resource.tags.map((t, i) =>
              <span key={i} className={classes.tag} style={{ background: "#607d8b" }}>{t}</span>
            )}
          </div>
          <div className={classes.meta}>
            ผู้ดูแลเนื้อหา: <strong>{resource.uploadedBy}</strong>
          </div>
          <div className={classes.viewBox}>
            <i className="pi pi-eye" style={{ fontSize: "1.18rem" }} /> {resource.viewCount || 0} ครั้ง
          </div>
          {user ? (
            <button className={classes.button} onClick={handleDownload}>
              ดาวน์โหลดเอกสาร
            </button>
          ) : (
            <button className={classes.button} onClick={handleLoginRedirect}>
              เข้าสู่ระบบเพื่อดาวน์โหลด
            </button>
          )}
        </div>
      </div>
      <div className={classes.descSection}>
        <div className={classes.sectionTitle}>คำอธิบาย</div>
        <div className={classes.description}>{resource.description}</div>
        <div className={classes.sectionTitle} style={{ marginTop: 16 }}>รายละเอียดเพิ่มเติม</div>
        <ul className={classes.detailList}>
          <li>หมวดหมู่: {resource.category}</li>
          <li>ประเภทไฟล์: {resource.type}</li>
          <li>เผยแพร่เมื่อ: {new Date(resource.createdAt).toLocaleDateString("th-TH")}</li>
          <li>อัปเดตล่าสุด: {new Date(resource.updatedAt).toLocaleDateString("th-TH")}</li>
          <li>จำนวนดาวน์โหลด: {resource.downloadCount} ครั้ง</li>
        </ul>
      </div>
      {relatedByTag.length > 0 && (
        <div className={classes.relatedWrap}>
          <div className={classes.sectionTitle}>รูปภาพที่มี TAG เดียวกัน</div>
          <div className={classes.relatedRow}>
            {relatedByTag.map((item) => (
              <div
                key={item.id}
                className={classes.relatedCard}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImg} />
                <div className={classes.relatedTitle}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {relatedByCategory.length > 0 && (
        <div className={classes.relatedWrap}>
          <div className={classes.sectionTitle}>รายการที่เกี่ยวข้องในหมวดเดียวกัน</div>
          <div className={classes.relatedRow}>
            {relatedByCategory.map((item) => (
              <div
                key={item.id}
                className={classes.relatedCard}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImg} />
                <div className={classes.relatedTitle}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailPage;
