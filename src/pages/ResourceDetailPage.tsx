import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";
import { useState, useCallback, useRef, useEffect } from "react";
import Modal from "react-modal";

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
    height: "70vh",
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
      left: 0,
      right: 0,
      bottom: 0,
      height: "48%",
      background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 100%)",
      zIndex: 1,
      pointerEvents: "none",
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
    padding: "1.5rem",
    background: "none",
    color: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
    '@media (max-width: 900px)': {
      padding: "1rem",
    },
  },
  infoBlock: { 
    maxWidth: 1400,
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#fff",
    marginBottom: "1rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.22)",
    lineHeight: 1.2,
    '@media (max-width: 900px)': {
      fontSize: "2rem",
    },
  },
  tagRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  tag: {
    background: "rgba(255,255,255,0.85)",
    color: "#b71c1c",
    fontSize: "0.95rem",
    borderRadius: "999px",
    padding: "0.35em 1em",
    fontWeight: 500,
    border: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    transition: "all 0.2s",
    outline: "none",
    '&:hover': {
      background: "#fff",
      color: "#d32f2f",
    },
  },
  meta: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
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
    gap: "0.5rem",
    marginTop: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: "2rem",
    padding: "0.7em 2em",
    background: "#b71c1c",
    color: "#fff",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
    '&:hover': {
      background: "#d32f2f",
      color: "#fff",
      boxShadow: "0 4px 16px rgba(183,28,28,0.18)",
    },
  },
  contentSection: {
    background: "#fff",
    padding: "2rem 1.5rem",
    "@media (max-width: 900px)": { 
      padding: "1.5rem 1rem",
    },
  },
  contentInner: {
    maxWidth: 1400,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "rgba(161, 61, 35, 0.98)",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    "&::before": {
      content: '""',
      display: "block",
      width: "4px",
      height: "28px",
      background: "linear-gradient(to bottom, #d32f2f 0%, #b71c1c 100%)",
      borderRadius: "2px",
    },
  },
  description: {
    fontSize: "1.1rem",
    color: "#333",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)",
    padding: "1.5rem",
    borderRadius: "1rem",
    marginBottom: "2rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
  },
  detailItem: {
    padding: "1rem",
    background: "#fff",
    borderRadius: "0.8rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },
    "& h4": {
      fontSize: "0.8rem",
      color: "#666",
      marginBottom: "0.5rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    "& p": {
      fontSize: "1.1rem",
      color: "rgba(161, 61, 35, 0.98)",
      fontWeight: 700,
    },
  },
  relatedWrap: {
    marginTop: "2rem",
  },
  relatedGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "1.5rem",
    marginTop: "1.5rem",
    overflowX: "auto",
    paddingBottom: "0.5rem",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
  },
  relatedCard: {
    background: "#fff",
    borderRadius: "1rem",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
    minWidth: 320,
    maxWidth: 340,
    flex: "0 0 320px",
    scrollSnapAlign: "start",
    "&:hover": { 
      transform: "translateY(-5px)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
      "& $relatedImg": {
        transform: "scale(1.05)",
      },
    },
  },
  relatedImg: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
  },
  relatedTitle: {
    padding: "1rem 1rem 0.5rem 1rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "rgba(161, 61, 35, 0.98)",
    lineHeight: 1.4,
  },
  relatedMeta: {
    padding: "0 1rem 1rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#666",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "rgba(161, 61, 35, 0.98)",
      },
    },
  },
  videoModal: {
    background: "transparent",
    maxWidth: "1200px",
    width: "90%",
    margin: "auto",
    padding: 0,
    position: "relative",
    outline: "none",
    "@media (max-width: 768px)": {
      width: "95%"
    }
  },
  videoModalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem"
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 80,
    height: 80,
    background: "rgba(183,28,28,0.92)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(183,28,28,0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translate(-50%, -50%) scale(1.1)",
      background: "rgba(183,28,28,1)",
    },
    "& i": {
      fontSize: "2.5rem",
      color: "#fff",
      marginLeft: 8,
    }
  },
  heroImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "rgba(0,0,0,0.0)",
    transition: "background 0.2s",
    '&:hover': {
      background: "rgba(0,0,0,0.18)",
      '& $playButton': {
        transform: "translate(-50%, -50%) scale(1.15)",
        background: "rgba(183,28,28,1)",
      }
    },
    outline: "none",
  },
});

const embedYouTube = (url: string) => {
  if (!url) return "";
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
  return idMatch?.[1]
    ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0&modestbranding=1`
    : url;
};

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDownload } = useDownloadHistory();
  const classes = useStyles();
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
  const [descOverflow, setDescOverflow] = useState(false);
  
  const resource = resourcesData.resources.find((r) => r.id === id);
  if (!resource) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลทรัพยากร</p>;

  useEffect(() => {
    if (descRef.current) {
      setDescOverflow(descRef.current.scrollHeight > 300);
    }
  }, [resource.description]);

  const handleOpenVideoModal = useCallback(() => {
    setIsVideoModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseVideoModal = useCallback(() => {
    setIsVideoModalOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  // หา related images by TAG (type เดียวกันเท่านั้น)
  const relatedByTag = resourcesData.resources
    .filter((item) =>
      item.id !== resource.id &&
      item.type === resource.type &&
      item.tags?.some(tag => resource.tags?.includes(tag))
    ).slice(0, 8);

  // related by category (ทุกประเภทในหมวดเดียวกัน)
  const relatedByCategory = resourcesData.resources
    .filter((item) =>
      item.category === resource.category &&
      item.id !== resource.id
      
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

  const isVideo = resource.type === "video";
  const isYouTube = resource.videoUrl?.includes("youtube.com") || resource.videoUrl?.includes("youtu.be");

  return (
    <div className={classes.container}>
      <div className={classes.heroImageWrap}>
        <img src={resource.thumbnailUrl} alt={resource.title} />
        {isVideo && (
          <div
            className={classes.heroImageOverlay}
            tabIndex={0}
            role="button"
            aria-label="เล่นวิดีโอ"
            onClick={handleOpenVideoModal}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleOpenVideoModal();
            }}
          >
            <div className={classes.playButton}>
              <i className="pi pi-play" />
            </div>
          </div>
        )}
        <div className={classes.mainInfo}>
          <div className={classes.infoBlock}>
            <div className={classes.title}>{resource.title}</div>
            <div className={classes.tagRow}>
              <span className={classes.tag}>
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

      {/* Video Modal */}
      <Modal
        isOpen={isVideoModalOpen}
        onRequestClose={handleCloseVideoModal}
        contentLabel="Video Player Modal"
        className={classes.videoModal}
        overlayClassName={classes.videoModalOverlay}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <button
          onClick={handleCloseVideoModal}
          style={{
            position: "absolute",
            top: -15,
            right: -15,
            zIndex: 10020,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: "50%",
            background: "rgba(20,20,20,0.8)",
            color: "#fff",
            fontSize: 24,
            lineHeight: '36px',
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "all 0.2s ease",
          }}
          aria-label="ปิด"
        >
          ×
        </button>
        
        <div style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#000",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {isYouTube ? (
            <iframe
              style={{
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src={embedYouTube(resource.videoUrl || "")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={resource.title}
            />
          ) : (
            <video
              style={{
                width: "100%",
                height: "100%",
                background: "#000",
                border: 0,
              }}
              src={resource.fileUrl || resource.videoUrl}
              poster={resource.thumbnailUrl}
              controls
              preload="metadata"
              autoPlay
            />
          )}
        </div>
      </Modal>

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
            <div style={{ width: '100%', position: 'relative', marginBottom: 24 }}>
              <div className={classes.sectionTitle} style={{marginBottom: 12}}>เนื้อหา</div>
              <div
                ref={descRef}
                className={classes.description}
                style={{
                  maxHeight: showFullDesc ? 'none' : 200,
                  overflow: showFullDesc ? 'visible' : 'hidden',
                  position: 'relative',
                  transition: 'max-height 0.3s',
                  paddingRight: descOverflow && !showFullDesc ? 24 : undefined,
                }}
              >
                {resource.description}
                {!showFullDesc && descOverflow && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 48,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff 90%)',
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
              {descOverflow && (
                <button
                  onClick={() => setShowFullDesc(v => !v)}
                  style={{
                    marginTop: 8,
                    background: 'none',
                    border: 'none',
                    color: '#d32f2f',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    outline: 'none',
                    padding: 0,
                  }}
                >
                  {showFullDesc ? 'ย่อ' : 'เพิ่มเติม'}
                </button>
              )}
            </div>
          )}

          {relatedByCategory.length > 0 && (
            <div className={classes.relatedWrap}>
              <div className={classes.sectionTitle}>รายการที่เกี่ยวข้อง</div>
              {/* --- Horizontal Scrollable Card Row --- */}
              <div style={{ position: "relative", width: "100%", overflow: "hidden", margin: "0 auto 2rem auto" }}>
                {/* Arrow Left */}
                <button
                  onClick={() => {
                    const el = document.getElementById("related-scroll");
                    if (el) el.scrollBy({ left: -360, behavior: "smooth" });
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    fontSize: 22,
                    color: "#b71c1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    transition: "all 0.18s",
                    opacity: 0.85
                  }}
                  aria-label="เลื่อนไปก่อนหน้า"
                >
                  <i className="pi pi-chevron-left" />
                </button>
                {/* Scrollable Row */}
                <div
                  id="related-scroll"
                  style={{
                    display: "flex",
                    gap: 28,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                    padding: "0.5rem 2.5rem",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  onWheel={e => {
                    // horizontal scroll on wheel
                    const el = e.currentTarget;
                    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                      el.scrollLeft += e.deltaY;
                      e.preventDefault();
                    }
                  }}
                >
                  {relatedByCategory.map((item) => (
                    <div
                      key={item.id}
                      className={classes.relatedCard}
                      style={{ minWidth: 320, maxWidth: 340, width: 320, flex: "0 0 320px", scrollSnapAlign: "center", aspectRatio: "4/3", position: "relative", background: "#f8f9fa", cursor: "pointer" }}
                      onClick={() => navigate(`/resource/${item.id}`)}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.16)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
                      }}
                    >
                      <img src={item.thumbnailUrl} alt={item.title} className={classes.relatedImg} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }} />
                      {/* Overlay info */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          padding: "1.2rem",
                          background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 100%)",
                          color: "#fff",
                          transition: "opacity 0.3s",
                          zIndex: 3,
                          pointerEvents: "none"
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>{item.title}</div>
                        {item.category && (
                          <div style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: 4 }}>
                            <i className="pi pi-folder" style={{ marginRight: 6, fontSize: "0.9em" }} />
                            {Array.isArray(item.category) ? item.category.join(', ') : item.category}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: 4 }}>
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} style={{
                                background: "rgba(255,255,255,0.13)",
                                borderRadius: 12,
                                padding: "2px 10px",
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontWeight: 500
                              }}>
                                <i className="pi pi-tag" style={{ fontSize: "0.8em" }} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: 10, display: "flex", gap: "1.5rem", fontSize: "0.95rem", color: "#eee", alignItems: "center" }}>
                          <span><i className="pi pi-eye" style={{ marginRight: 4 }} />{item.viewCount || 0}</span>
                          <span><i className="pi pi-download" style={{ marginRight: 4 }} />{item.downloadCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Arrow Right */}
                <button
                  onClick={() => {
                    const el = document.getElementById("related-scroll");
                    if (el) el.scrollBy({ left: 360, behavior: "smooth" });
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    fontSize: 22,
                    color: "#b71c1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    transition: "all 0.18s",
                    opacity: 0.85
                  }}
                  aria-label="เลื่อนไปถัดไป"
                >
                  <i className="pi pi-chevron-right" />
                </button>
              </div>
              {/* --- END Horizontal Scrollable Card Row --- */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
