import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";
import { useState, useCallback, useRef, useEffect } from "react";
import Modal from "react-modal";
import { FaDownload, FaEye, FaHeart, FaBookmark, FaShare, FaPlay, FaTimes, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useBookmarks } from "../contexts/BookmarkContext";

const THEME = {
  colors: {
    primary: "#112D4E",
    primaryLight: "rgba(17,45,78,0.9)",
    primaryDark: "#0c1c2e",
    secondary: "#3F72AF",
    secondaryLight: "rgba(63,114,175,0.9)",
    secondaryDark: "#2c5a8f",
    text: {
      primary: "#112D4E",
      secondary: "#666666",
      light: "#DBE2EF"
    },
    background: {
      main: "#ffffff",
      light: "#F9F7F7",
      gradient: "linear-gradient(120deg, #F9F7F7 70%, #DBE2EF 100%)"
    },
    border: "#DBE2EF"
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px"
  },
  shadows: {
    card: "0 4px 20px rgba(17,45,78,0.08)",
    cardHover: "0 8px 30px rgba(17,45,78,0.12)",
  }
};

const useStyles = createUseStyles({
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(180deg, rgba(63,114,175,0.05) 0%, rgba(255,255,255,0) 100%)",
    '@media (max-width: 768px)': {
      padding: "1.5rem",
    },
  },
  heroContent: {
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: "24px",
    padding: "2rem",
    '@media (max-width: 1024px)': {
      gap: "2rem",
      padding: "1.5rem",
    },
  },
  heroMain: {
    display: "flex",
    gap: "3rem",
    padding: "3rem",
    alignItems: "flex-start",
    '@media (max-width: 1024px)': {
      flexDirection: "column",
      gap: "2rem",
    },
  },
  heroImageWrap: {
    flex: "1 1 55%",
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(63,114,175,0.12)",
    background: "#fff",
    aspectRatio: "16/9",
    '@media (max-width: 1024px)': {
      width: "100%",
    },
    '&:hover': {
      '& $heroImage': {
        transform: "scale(1.05)",
      },
      '& $playButton': {
        transform: "translate(-50%, -50%) scale(1.1)",
      },
    },
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 80,
    height: 80,
    background: "rgba(63,114,175,0.95)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(63,114,175,0.25)",
    border: "none",
    color: "#fff",
    fontSize: "1.8rem",
    '&:hover': {
      background: "rgba(63,114,175,1)",
      transform: "translate(-50%, -50%) scale(1.1)",
    },
  },
  infoSection: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    '@media (max-width: 1024px)': {
      width: "100%",
    },
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#112D4E",
    lineHeight: 1.2,
    marginBottom: "1rem",
    fontFamily: "'Sarabun', sans-serif",
    '@media (max-width: 768px)': {
      fontSize: "2rem",
    },
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
    padding: "1rem",
    borderRadius: "12px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#3F72AF",
    fontSize: "1rem",
    '& svg': {
      fontSize: "1.2rem",
    },
  },
  tagRow: {
    display: "flex",
    gap: "0.8rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  tag: {
    background: "rgba(63,114,175,0.1)",
    color: "#3F72AF",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: 600,
    transition: "all 0.2s",
    '&:hover': {
      background: "rgba(63,114,175,0.15)",
      transform: "translateY(-2px)",
    },
  },
  actionRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem 2rem",
    background: "#3F72AF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 20px rgba(63,114,175,0.2)",
    '&:hover': {
      background: "#112D4E",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(63,114,175,0.3)",
    },
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem 2rem",
    background: "#fff",
    color: "#3F72AF",
    border: "2px solid #3F72AF",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    '&:hover': {
      background: "rgba(63,114,175,0.05)",
      transform: "translateY(-2px)",
    },
  },
  contentSection: {
    maxWidth: 1200,
    margin: "0 auto",
    '@media (max-width: 768px)': {
      padding: "2rem 1rem",
    },
  },
  contentSectionGray: {
    width: "100%",
    background: "#f8faff",
    '@media (max-width: 768px)': {
      padding: "2rem 0",
    },
  },
  contentWrapper: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    '@media (max-width: 768px)': {
      padding: "0 1rem",
    },
  },
  mainContent: {
    borderRadius: 24,
    '@media (max-width: 768px)': {
      padding: "1.5rem",
      borderRadius: 16,
    },
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#112D4E",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    '&::before': {
      content: '""',
      width: 4,
      height: 24,
      background: "#3F72AF",
      borderRadius: 2,
    },
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: 1.7,
    color: "#666",
    '& p': {
      marginBottom: "1rem",
    },
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
    padding: "1.5rem",
    borderRadius: 16,
  },
  detailItem: {
    background: "#fff",
    padding: "1.2rem",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(63,114,175,0.06)",
    transition: "all 0.2s",
    '&:hover': {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 24px rgba(63,114,175,0.1)",
    },
  },
  detailLabel: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.5rem",
  },
  detailValue: {
    fontSize: "1.1rem",
    color: "#112D4E",
    fontWeight: 600,
  },
  sidebar: {
    position: "sticky",
    top: "2rem",
    background: "#fff",
    borderRadius: 24,
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(63,114,175,0.08)",
    height: "fit-content",
  },
  relatedSection: {
    background: "#fff",
    padding: "3rem 0",
    width: "100%",
    '@media (max-width: 768px)': {
      padding: "1.5rem 0",
    },
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
    padding: "0 3rem",
    '@media (max-width: 768px)': {
      padding: "0 1.5rem",
      gap: "1rem",
    },
  },
  relatedHeader: {
    padding: "0 3rem",
    '@media (max-width: 768px)': {
      padding: "0 1.5rem",
    },
  },
  relatedCard: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(63,114,175,0.08)",
    transition: "all 0.3s",
    cursor: "pointer",
    '&:hover': {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 32px rgba(63,114,175,0.12)",
      '& $relatedImage': {
        transform: "scale(1.05)",
      },
    },
  },
  relatedImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  relatedInfo: {
    padding: "1.2rem",
  },
  relatedTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#112D4E",
    marginBottom: "0.8rem",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  },
  relatedMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#666",
    fontSize: "0.9rem",
  },
  videoModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 1200,
    aspectRatio: "16/9",
    background: "#000",
    borderRadius: 16,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    '&:hover': {
      background: "rgba(255,255,255,0.2)",
      transform: "scale(1.1)",
    },
  },
  "@keyframes slideUp": {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 }
  },
  animatedEntry: {
    animation: "$slideUp 0.5s ease-out forwards",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
    marginBottom: "2rem",
    '& a': {
      color: THEME.colors.text.secondary,
      textDecoration: "none",
      '&:hover': {
        color: THEME.colors.secondary,
      }
    },
  },
  mainImage: {
    width: "100%",
    maxHeight: "600px",
    objectFit: "contain",
    borderRadius: THEME.borderRadius.lg,
    marginBottom: "2rem",
    background: THEME.colors.background.light,
  },
  attributesSection: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: THEME.shadows.card,
  },
  attributeTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: THEME.colors.text.primary,
    marginBottom: "1.5rem",
  },
  attributeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  attributeItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  attributeLabel: {
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
  },
  attributeValue: {
    fontSize: "1rem",
    color: THEME.colors.text.primary,
    fontWeight: 500,
  },
  addToCollectionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "1rem",
    background: THEME.colors.background.main,
    border: `2px solid ${THEME.colors.border}`,
    borderRadius: THEME.borderRadius.md,
    color: THEME.colors.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "1rem",
    '&:hover': {
      background: THEME.colors.background.light,
      borderColor: THEME.colors.secondary,
    }
  },
  signInLink: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
    marginBottom: "2rem",
    '& a': {
      color: THEME.colors.secondary,
      textDecoration: "none",
      fontWeight: 500,
      '&:hover': {
        textDecoration: "underline",
      }
    }
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  gallerySection: {
    width: "100%",
    position: "relative",
    padding: "1rem",
    background: "rgba(63,114,175,0.02)",
    borderRadius: "16px",
  },
  galleryGrid: {
    display: "flex",
    gap: "1rem",
    overflowX: "hidden",
    scrollBehavior: "smooth",
    padding: "0.5rem",
    marginLeft: "-0.5rem",
    marginRight: "-0.5rem",
  },
  galleryItem: {
    flex: "0 0 280px",
    position: "relative",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(63,114,175,0.08)",
    transition: "all 0.3s",
    '&:hover': {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(63,114,175,0.12)",
      '& $galleryImage': {
        transform: "scale(1.05)",
      },
    },
  },
  carouselButton: {
    position: "absolute",
    top: "62%",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    boxShadow: "0 8px 24px rgba(63,114,175,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    transition: "all 0.3s",
    color: "#3F72AF",
    '&:hover': {
      background: "#3F72AF",
      color: "#fff",
      transform: "translateY(-50%) scale(1.1)",
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: "not-allowed",
      '&:hover': {
        background: "#fff",
        color: "#3F72AF",
        transform: "translateY(-50%)",
      },
    },
    '& svg': {
      fontSize: "1.2rem",
    },
  },
  prevButton: {
    left: "-22px",
  },
  nextButton: {
    right: "-28px",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  imageModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: 8,
  },
});

const embedYouTube = (url: string) => {
  if (!url) return "";
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
  return idMatch?.[1]
    ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0&modestbranding=1`
    : url;
};

// Add type definition for Resource
interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  gallery?: string[];
  uploadedBy: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
}

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  
  const resource = resourcesData.resources.find((r) => r.id === id) as Resource;
  
  // Use gallery images from resource data
  const images = resource?.gallery || [resource?.thumbnailUrl];

  if (!resource) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
      }}>
        <h2 style={{ fontSize: "2rem", color: "#112D4E" }}>ไม่พบข้อมูลทรัพยากร</h2>
        <button 
          className={classes.secondaryButton}
          onClick={() => navigate(-1)}
        >
          กลับไปหน้าก่อนหน้า
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (descRef.current) {
      setDescOverflow(descRef.current.scrollHeight > 300);
    }
  }, [resource.description]);

  useEffect(() => {
    if (resource) {
      setBookmarkStatus(isBookmarked(resource.id));
    }
  }, [resource, isBookmarked]);

  const handleOpenVideoModal = useCallback(() => {
    setIsVideoModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseVideoModal = useCallback(() => {
    setIsVideoModalOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const relatedByCategory = resourcesData.resources
    .filter((item) =>
      item.category === resource.category &&
      item.id !== resource.id
    ).slice(0, 6);

  const handleLoginRedirect = () => {
    navigate(`/login?redirect=/resource/${id}`);
  };

  const handleDownload = () => {
    if (!user) return;
    addDownload(user.id, {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      fileUrl: resource.fileUrl,
      downloadedAt: new Date().toISOString()
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

  const checkScrollButtons = useCallback(() => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = galleryRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      galleryRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => gallery.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    if (bookmarkStatus) {
      removeBookmark(resource.id);
      setBookmarkStatus(false);
    } else {
      addBookmark({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        imageUrl: resource.thumbnailUrl,
        type: resource.type,
        category: resource.category,
        createdAt: resource.createdAt
      });
      setBookmarkStatus(true);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.heroSection}>
        <div className={classes.heroContent}>
          <div className={classes.heroMain}>
            <div className={classes.heroImageWrap}>
              <img 
                src={`${import.meta.env.BASE_URL}${resource.thumbnailUrl.replace(/^\//, '')}`}
                alt={resource.title}
                className={classes.heroImage}
              />
              {isVideo && (
                <button
                  className={classes.playButton}
                  onClick={handleOpenVideoModal}
                  aria-label="เล่นวิดีโอ"
                >
                  <FaPlay />
                </button>
              )}
            </div>
            
            <div className={classes.infoSection}>
              <h1 className={classes.title}>{resource.title}</h1>
              
              <div className={classes.actionRow} style={{ gap: '1rem', marginBottom: '2rem' }}>
                {user ? (
                  <button 
                    className={classes.primaryButton}
                    onClick={handleDownload}
                    style={{ flex: 2 }}
                  >
                    <FaDownload />
                    ดาวน์โหลด
                  </button>
                ) : (
                  <button 
                    className={classes.primaryButton}
                    onClick={handleLoginRedirect}
                    style={{ flex: 2 }}
                  >
                    <FaDownload />
                    เข้าสู่ระบบเพื่อดาวน์โหลด
                  </button>
                )}
                
                <button 
                  className={classes.secondaryButton}
                  onClick={handleShare}
                  style={{ flex: 1 }}
                >
                  <FaShare />
                  แชร์
                </button>
                
                <button 
                  className={classes.secondaryButton}
                  onClick={handleBookmark}
                  style={{ 
                    flex: 1,
                    background: bookmarkStatus ? 'rgba(63,114,175,0.1)' : undefined,
                    borderColor: bookmarkStatus ? '#3F72AF' : undefined,
                  }}
                >
                  <FaBookmark style={{ color: bookmarkStatus ? '#3F72AF' : undefined }} />
                  {bookmarkStatus ? 'บันทึกแล้ว' : 'บันทึก'}
                </button>
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <div className={classes.gallerySection}>
              <h2 className={classes.sectionTitle}>รูปภาพทั้งหมด</h2>
              <button 
                className={`${classes.carouselButton} ${classes.prevButton}`}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous images"
              >
                <FaChevronLeft />
              </button>
              <button 
                className={`${classes.carouselButton} ${classes.nextButton}`}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next images"
              >
                <FaChevronRight />
              </button>
              <div className={classes.galleryGrid} ref={galleryRef}>
                {images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={classes.galleryItem}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`}
                      alt={`รูปภาพที่ ${index + 1}`}
                      className={classes.galleryImage}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={classes.contentSection}>
        <div className={classes.mainContent}>
          {resource.description && (
            <div style={{ marginTop: "2rem" }}>
              <h2 className={classes.sectionTitle}>เนื้อหา</h2>
              <div
                ref={descRef}
                className={classes.description}
                style={{
                  maxHeight: showFullDesc ? 'none' : 300,
                  overflow: showFullDesc ? 'visible' : 'hidden',
                  position: 'relative',
                }}
              >
                {resource.description}
                {!showFullDesc && descOverflow && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 100,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff)',
                  }} />
                )}
              </div>
              {descOverflow && (
                <button
                  onClick={() => setShowFullDesc(v => !v)}
                  style={{
                    marginTop: "1rem",
                    background: "none",
                    border: "none",
                    color: "#3F72AF",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showFullDesc ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
                </button>
              )}
            </div>
          )}

          <div style={{ 
            marginTop: "3rem",
            borderRadius: "16px",
          }}>
            <h2 className={classes.sectionTitle}>รายละเอียด</h2>
            <div className={classes.detailsGrid}>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>หมวดหมู่</div>
                <div className={classes.detailValue}>{resource.category}</div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>ประเภทไฟล์</div>
                <div className={classes.detailValue}>{resource.type}</div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>เผยแพร่เมื่อ</div>
                <div className={classes.detailValue}>
                  {new Date(resource.createdAt).toLocaleDateString("th-TH")}
                </div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>อัปเดตล่าสุด</div>
                <div className={classes.detailValue}>
                  {new Date(resource.updatedAt).toLocaleDateString("th-TH")}
                </div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>จำนวนการดู</div>
                <div className={classes.detailValue}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaEye />
                    {resource.viewCount || 0} ครั้ง
                  </div>
                </div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>จำนวนดาวน์โหลด</div>
                <div className={classes.detailValue}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaDownload />
                    {resource.downloadCount || 0} ครั้ง
                  </div>
                </div>
              </div>
              <div className={classes.detailItem}>
                <div className={classes.detailLabel}>ผู้เผยแพร่</div>
                <div className={classes.detailValue}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaHeart />
                    {resource.uploadedBy}
                  </div>
                </div>
              </div>
            </div>


              <div className={classes.tagRow} style={{ marginBottom: "1.5rem" }}>
                <span className={classes.tag}>
                  {resource.type?.toUpperCase()}
                </span>
                {resource.tags && resource.tags.map((t, i) => (
                  <span key={i} className={classes.tag}>{t}</span>
                ))}
              </div>
          </div>
        </div>
      </div>

      <div className={classes.contentSectionGray}>
        <div className={classes.relatedSection}>
          <div className={classes.relatedHeader}>
            <h2 className={classes.sectionTitle}>รายการที่เกี่ยวข้อง</h2>
          </div>
          <div className={classes.relatedGrid}>
            {relatedByCategory.map((item) => (
              <div
                key={item.id}
                className={classes.relatedCard}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                  alt={item.title}
                  className={classes.relatedImage}
                />
                <div className={classes.relatedInfo}>
                  <h3 className={classes.relatedTitle}>{item.title}</h3>
                  <div className={classes.relatedMeta}>
                    <span>{item.category}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className={classes.imageModal} onClick={() => setSelectedImage(null)}>
          <img
            src={`${import.meta.env.BASE_URL}${selectedImage.replace(/^\//, '')}`}
            alt="รูปภาพขยาย"
            className={classes.modalImage}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {isVideoModalOpen && (
        <div className={classes.videoModal} onClick={handleCloseVideoModal}>
          <div className={classes.videoContainer} onClick={e => e.stopPropagation()}>
            <button className={classes.closeButton} onClick={handleCloseVideoModal}>
              <FaTimes />
            </button>
            {isYouTube ? (
              <iframe
                src={embedYouTube(resource.videoUrl || "")}
                style={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={resource.title}
              />
            ) : (
              <video
                src={resource.fileUrl || resource.videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#000",
                }}
                controls
                autoPlay
                poster={resource.thumbnailUrl}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailPage;