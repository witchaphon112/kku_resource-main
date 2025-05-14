import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";
import { Link } from "react-router-dom";

const useStyles = createUseStyles({
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "1rem",
    borderRadius: "1rem",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  topSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    alignItems: "flex-start",
  },
  imageBox: {
    flex: "0 0 280px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  detailBox: {
    flex: 1,
    minWidth: "250px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#212121",
  },
  tag: {
    display: "inline-block",
    background: "#1976d2",
    color: "#fff",
    padding: "0.3rem 0.9rem",
    fontSize: "0.85rem",
    borderRadius: "999px",
    marginBottom: "1rem",
    textTransform: "uppercase",
  },
  meta: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.2rem",
  },
  viewBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "1rem",
  },
  viewIcon: {
    fontSize: "1.2rem",
    color: "#888",
  },
  button: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "2rem",
    border: "none",
    backgroundColor: "#d32f2f",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
  },
  section: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#333",
    marginBottom: "0.75rem",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "0.3rem",
  },
  description: {
    fontSize: "1rem",
    color: "#444",
    lineHeight: 1.6,
  },
  detailList: {
    listStyle: "none",
    padding: 0,
    fontSize: "0.95rem",
    color: "#444",
    marginTop: "1rem",
    "& li": {
      marginBottom: "0.4rem",
    },
  },
  relatedWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  relatedCard: {
    width: "200px",
    background: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  relatedImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },
  relatedTitle: {
    padding: "0.75rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#333",
  },
});

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const resource = resourcesData.resources.find((r) => r.id === id);
  if (!resource) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลทรัพยากร</p>;

  // หารายการที่เกี่ยวข้องในหมวดเดียวกัน (ยกเว้นตัวปัจจุบัน)
  const relatedItems = resourcesData.resources
    .filter((item) => item.category === resource.category && item.id !== resource.id)
    .slice(0, 5);

  const handleLoginRedirect = () => {
    const redirectPath = `/resource/${id}`;
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.topSection}>
        <div className={classes.imageBox}>
          <img src={resource.thumbnailUrl} alt={resource.title} className={classes.image} />
        </div>
        <div className={classes.detailBox}>
          <h1 className={classes.title}>{resource.title}</h1>
          <div className={classes.tag}>{resource.type.toUpperCase()}</div>
          <p className={classes.meta}>ผู้ดูแลเนื้อหา: <strong>{resource.uploadedBy}</strong></p>
          <div className={classes.viewBox}>
            <i className={`pi pi-eye ${classes.viewIcon}`}></i>
            {resource.viewCount || 0} ครั้ง
          </div>
          {isLoggedIn ? (
            <a href={resource.fileUrl} download className={classes.button}>ดาวน์โหลดเอกสาร</a>
          ) : (
            <button className={classes.button} onClick={handleLoginRedirect}>เข้าสู่ระบบเพื่อดาวน์โหลด</button>
          )}
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>คำอธิบาย</h2>
        <p className={classes.description}>{resource.description}</p>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>รายละเอียดเพิ่มเติม</h2>
        <ul className={classes.detailList}>
          <li>หมวดหมู่: {resource.category}</li>
          <li>ประเภทไฟล์: {resource.type}</li>
          <li>เผยแพร่เมื่อ: {new Date(resource.createdAt).toLocaleDateString("th-TH")}</li>
          <li>อัปเดตล่าสุด: {new Date(resource.updatedAt).toLocaleDateString("th-TH")}</li>
          <li>จำนวนดาวน์โหลด: {resource.downloadCount} ครั้ง</li>
        </ul>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>รายการที่เกี่ยวข้อง</h2>
        <div className={classes.relatedWrapper}>
          {relatedItems.map((item) => (
            <div
              key={item.id}
              className={classes.relatedCard}
              onClick={() => navigate(`/resource/${item.id}`)}
            >
              <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImage} />
              <div className={classes.relatedTitle}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
