import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  container: {
    maxWidth: "100%",
    margin: "0",
    padding: "0",
    background: "#000",
    minHeight: "calc(100vh - 64px)",
    position: "relative",
  },
  heroImageWrap: {
    width: "100%",
    height: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 0,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "150px",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
      zIndex: 1,
    },
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      transition: "transform 0.5s ease",
    },
  },
  mainInfo: {
    padding: "2.5rem",
    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%)",
    color: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backdropFilter: "blur(10px)",
    "@media (max-width: 900px)": {
      padding: "2rem 1.5rem",
    },
  },
  infoBlock: { 
    maxWidth: 1400,
    margin: "0 auto",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: 800,
    color: "#fff",
    marginBottom: "1.5rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    lineHeight: 1.2,
    "@media (max-width: 900px)": {
      fontSize: "2.5rem",
    },
  },
  tagRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  tag: {
    background: "rgba(25, 118, 210, 0.2)",
    color: "#fff",
    fontSize: "1rem",
    borderRadius: "999px",
    padding: "0.6em 1.5em",
    fontWeight: 500,
    backdropFilter: "blur(4px)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(25, 118, 210, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  meta: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "3rem",
    flexWrap: "wrap",
  },
  viewBox: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#fff",
      transform: "translateY(-2px)",
    },
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.8rem",
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: 600,
    borderRadius: "3rem",
    padding: "1em 2.5em",
    background: "linear-gradient(45deg, #d32f2f 0%, #f44336 100%)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(211,47,47,0.3)",
    "&:hover": { 
      transform: "translateY(-3px)",
      boxShadow: "0 8px 30px rgba(211,47,47,0.5)",
      background: "linear-gradient(45deg, #b71c1c 0%, #d32f2f 100%)",
    },
  },
  contentSection: {
    background: "#fff",
    padding: "4rem 2rem",
    "@media (max-width: 900px)": { 
      padding: "3rem 1.5rem",
    },
  },
  contentInner: {
    maxWidth: 1400,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#1a237e",
    marginBottom: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    "&::before": {
      content: '""',
      display: "block",
      width: "6px",
      height: "35px",
      background: "linear-gradient(to bottom, #d32f2f 0%, #b71c1c 100%)",
      borderRadius: "3px",
    },
  },
  description: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "3rem",
    lineHeight: 1.8,
    maxWidth: 900,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    marginBottom: "4rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
  },
  detailItem: {
    padding: "1.5rem",
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },
    "& h4": {
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "0.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    "& p": {
      fontSize: "1.25rem",
      color: "#1a237e",
      fontWeight: 700,
    },
  },
  relatedWrap: {
    marginTop: "4rem",
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  relatedCard: {
    background: "#fff",
    borderRadius: "1.5rem",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
    "&:hover": { 
      transform: "translateY(-10px)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
      "& $relatedImg": {
        transform: "scale(1.1)",
      },
    },
  },
  relatedImg: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
  },
  relatedTitle: {
    padding: "1.5rem 1.5rem 1rem 1.5rem",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a237e",
    lineHeight: 1.4,
  },
  relatedMeta: {
    padding: "0 1.5rem 1.5rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#666",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#1a237e",
      },
    },
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
    addDownload(user.id, {
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
      <div className={classes.heroImageWrap}>
        <img src={resource.thumbnailUrl} alt={resource.title} />
        <div className={classes.mainInfo}>
          <div className={classes.infoBlock}>
            <div className={classes.title}>{resource.title}</div>
            <div className={classes.tagRow}>
              <span className={classes.tag} style={{ background: "rgba(211,47,47,0.3)", borderColor: "rgba(211,47,47,0.5)" }}>
                {resource.type?.toUpperCase()}
              </span>
              {resource.tags && resource.tags.map((t, i) =>
                <span key={i} className={classes.tag}>{t}</span>
              )}
            </div>
            <div className={classes.meta}>
              <div className={classes.viewBox}>
                <i className="pi pi-user" style={{ fontSize: "1.4rem" }} />
                {resource.uploadedBy}
              </div>
              <div className={classes.viewBox}>
                <i className="pi pi-eye" style={{ fontSize: "1.4rem" }} />
                {resource.viewCount || 0} ครั้ง
              </div>
              <div className={classes.viewBox}>
                <i className="pi pi-download" style={{ fontSize: "1.4rem" }} />
                {resource.downloadCount || 0} ครั้ง
              </div>
            </div>
            {user ? (
              <button className={classes.button} onClick={handleDownload}>
                <i className="pi pi-download" style={{ fontSize: "1.4rem" }} />
                ดาวน์โหลด
              </button>
            ) : (
              <button className={classes.button} onClick={handleLoginRedirect}>
                <i className="pi pi-sign-in" style={{ fontSize: "1.4rem" }} />
                เข้าสู่ระบบเพื่อดาวน์โหลด
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={classes.contentSection}>
        <div className={classes.contentInner}>
          <div className={classes.detailGrid}>
            <div className={classes.detailItem}>
              <h4>หมวดหมู่</h4>
              <p>{resource.category}</p>
            </div>
            <div className={classes.detailItem}>
              <h4>ประเภทไฟล์</h4>
              <p>{resource.type}</p>
            </div>
            <div className={classes.detailItem}>
              <h4>เผยแพร่เมื่อ</h4>
              <p>{new Date(resource.createdAt).toLocaleDateString("th-TH")}</p>
            </div>
            <div className={classes.detailItem}>
              <h4>อัปเดตล่าสุด</h4>
              <p>{new Date(resource.updatedAt).toLocaleDateString("th-TH")}</p>
            </div>
          </div>

          {resource.description && (
            <>
              <div className={classes.sectionTitle}>เกี่ยวกับรูปภาพ</div>
              <div className={classes.description}>{resource.description}</div>
            </>
          )}

          {relatedByTag.length > 0 && (
            <div className={classes.relatedWrap}>
              <div className={classes.sectionTitle}>รูปภาพที่มี TAG เดียวกัน</div>
              <div className={classes.relatedGrid}>
                {relatedByTag.map((item) => (
                  <div
                    key={item.id}
                    className={classes.relatedCard}
                    onClick={() => navigate(`/resource/${item.id}`)}
                  >
                    <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImg} />
                    <div className={classes.relatedTitle}>{item.title}</div>
                    <div className={classes.relatedMeta}>
                      <span>
                        <i className="pi pi-eye" />
                        {item.viewCount || 0}
                      </span>
                      <span>
                        <i className="pi pi-download" />
                        {item.downloadCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedByCategory.length > 0 && (
            <div className={classes.relatedWrap}>
              <div className={classes.sectionTitle}>รายการในหมวดเดียวกัน</div>
              <div className={classes.relatedGrid}>
                {relatedByCategory.map((item) => (
                  <div
                    key={item.id}
                    className={classes.relatedCard}
                    onClick={() => navigate(`/resource/${item.id}`)}
                  >
                    <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImg} />
                    <div className={classes.relatedTitle}>{item.title}</div>
                    <div className={classes.relatedMeta}>
                      <span>
                        <i className="pi pi-eye" />
                        {item.viewCount || 0}
                      </span>
                      <span>
                        <i className="pi pi-download" />
                        {item.downloadCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
