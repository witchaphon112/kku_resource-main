import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaRegBookmark, FaDownload, FaEye, FaFilter, FaSpinner, FaTimes, FaUser, FaFileAlt } from "react-icons/fa";
import resourcesData from "../mock/resources.json";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";

const useStyles = createUseStyles({
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },
  pageWrap: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#fff",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "2rem",
    gap: "2rem",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 0.5rem",
    gap: "1rem",
    flexWrap: "wrap",
    marginTop: "60px",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "0.8rem",
      marginTop: "70px",
    }
  },
  toggleFiltersBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    padding: "0.7rem 1.2rem",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    "&:hover": {
      borderColor: "#3F72AF",
      color: "#3F72AF",
      background: "#f8faff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(63,114,175,0.12)",
    },
    "& i": {
      fontSize: "1rem",
      color: "inherit",
    }
  },
  contentWrap: {
    display: "flex",
    gap: "2rem",
    position: "relative",
  },
  sidebar: {
    width: 300,
    minWidth: 300,
    height: "fit-content",
    alignSelf: "flex-start",
    position: "sticky",
    top: 90,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#fff",
    padding: "1.8rem",
    border: "1px solid #e0e0e0",
    borderRadius: "16px",
    opacity: 1,
    visibility: "visible",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    "&.collapsed": {
      width: 0,
      minWidth: 0,
      padding: 0,
      margin: 0,
      opacity: 0,
      visibility: "hidden",
      border: "none",
    },
    "@media (max-width: 768px)": {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      minWidth: "unset",
      maxWidth: "100%",
      height: "100%",
      borderRadius: 0,
      margin: 0,
      zIndex: 1000,
      transform: "translateY(0)",
      overflowY: "auto",
      "&.collapsed": {
        transform: "translateY(100%)",
      }
    }
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    "@media (max-width: 768px)": {
      position: "sticky",
      top: 0,
      background: "#fff",
      padding: "1rem",
      borderBottom: "1px solid #eee",
      marginBottom: "1rem",
      zIndex: 1,
    },
    "& h3": {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#1a1a1a",
    }
  },
  dateSection: {
    marginTop: "1.5rem",
    "& h4": {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#333",
      marginBottom: "1rem",
    }
  },
  overlay: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      opacity: 0,
      visibility: "hidden",
      transition: "all 0.3s ease",
      zIndex: 999,
      "&.visible": {
        opacity: 1,
        visibility: "visible",
      }
    }
  },
  filterSection: {
    marginBottom: "2rem",
    "&:last-child": {
      marginBottom: 0,
    }
  },
  filterTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: "1.2rem",
    paddingBottom: "0.8rem",
    borderBottom: "1px solid #eee",
  },
  filterOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1rem",
    cursor: "pointer",
    color: "#666",
    borderRadius: "10px",
    transition: "all 0.2s",
    marginBottom: "0.5rem",
    "&:hover": {
      background: "#f8faff",
      color: "#3F72AF",
    },
    "& span": {
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      "& svg": {
        fontSize: "1.1rem",
        color: "#666",
      }
    },
    "& input[type='checkbox']": {
      appearance: "none",
      width: 20,
      height: 20,
      borderRadius: "6px",
      border: "2px solid #ddd",
      position: "relative",
      cursor: "pointer",
      transition: "all 0.2s",
      "&:checked": {
        borderColor: "#3F72AF",
        backgroundColor: "#3F72AF",
        "&:after": {
          content: '""',
          position: "absolute",
          left: "6px",
          top: "2px",
          width: "4px",
          height: "9px",
          border: "solid #ffffff",
          borderWidth: "0 2px 2px 0",
          transform: "rotate(45deg)",
        }
      },
      "&:hover": {
        borderColor: "#3F72AF",
      }
    }
  },
  main: {
    flex: 1,
    minWidth: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.8rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&.expanded": {
      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    }
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.05)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
      "& $cardImageBox img": {
        transform: "scale(1.05)",
      },
      "& $cardActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  cardImageBox: {
    width: "100%",
    aspectRatio: "16/9",
    overflow: "hidden",
    position: "relative",
    background: "#f5f5f5",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },
  cardActionBar: {
    display: "flex",
    gap: "1rem",
    position: "absolute",
    top: "1.2rem",
    right: "1.2rem",
    zIndex: 3,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    padding: "0.6rem",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardActionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "8px",
    transition: "all 0.2s",
    "&:hover": {
      color: "#3F72AF",
      background: "#f0f5ff",
      transform: "scale(1.1)",
    }
  },
  cardBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.4,
    fontFamily: "'Sarabun', 'Inter', sans-serif",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  },
  cardMeta: {
    fontSize: "0.95rem",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    "& i, & svg": {
      fontSize: "1.1rem",
      color: "#3F72AF",
    }
  },
  tagBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  tag: {
    background: "rgba(63,114,175,0.08)",
    color: "#3F72AF",
    borderRadius: "8px",
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s",
    "&:hover": {
      background: "rgba(63,114,175,0.12)",
      transform: "translateY(-1px)",
    }
  },
  categoryTag: {
    background: "#DBE2EF",
    color: "#112D4E",
    borderRadius: 14,
    padding: "0.22rem 0.83rem",
    fontSize: ".9rem",
    fontWeight: 700,
    marginRight: 7
  },
  emptyState: {
    textAlign: "center",
    padding: "2.5rem",
    color: "#3F72AF",
    fontSize: "1.18rem",
    fontWeight: 500,
    gridColumn: "1 / -1"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "4rem",
    padding: "1rem 0",
  },
  pageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    padding: "0.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    background: "#fff",
    color: "#666",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    "&:hover": {
      borderColor: "#3F72AF",
      color: "#3F72AF",
      background: "#f8faff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(63,114,175,0.12)",
    },
    "&.active": {
      background: "#3F72AF",
      borderColor: "#3F72AF",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(63,114,175,0.2)",
    },
    "&.disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#e0e0e0",
        color: "#666",
        background: "#fff",
        transform: "none",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      }
    }
  },
  pageEllipsis: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    color: "#666",
    fontSize: "1.2rem",
    fontWeight: 600,
  },
  subCategoryItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 400,
    fontSize: "0.97rem",
    color: "#666",
    marginBottom: 7,
    marginLeft: 32,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderRadius: 8,
    padding: "0.35rem 0.7rem",
    transition: "all .15s",
    position: "relative",
    "&.active": {
      color: "#3F72AF",
      fontWeight: 600,
      background: "#F3F7FB",
    },
    "&:hover": {
      color: "#3F72AF",
      background: "#F3F7FB",
    },
    "@media (max-width: 700px)": {
      fontSize: "0.93rem",
      marginLeft: 18,
      padding: "0.28rem 0.5rem",
    },
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  loadingSpinner: {
    animation: "$spin 1s linear infinite",
    color: "#3F72AF",
    fontSize: "2rem",
    display: "block",
    margin: "2rem auto",
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#3F72AF",
    animation: "$spin 1s linear infinite",
  },
  shimmer: {
    position: "relative",
    overflow: "hidden",
    background: "#f6f7f8",
    "&::after": {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transform: "translateX(-100%)",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      animation: "$shimmer 1.5s infinite",
      content: '""',
    }
  },
  "@keyframes shimmer": {
    "100%": {
      transform: "translateX(100%)",
    }
  },
  sortSelect: {
    padding: "0.7rem 1.2rem",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    fontSize: "0.95rem",
    minWidth: 200,
    cursor: "pointer",
    background: "#fff",
    color: "#333",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    transition: "all 0.2s",
    "&:focus": {
      outline: "none",
      borderColor: "#3F72AF",
      boxShadow: "0 4px 8px rgba(63,114,175,0.12)",
    },
    "&:hover": {
      borderColor: "#3F72AF",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(63,114,175,0.12)",
    }
  },
  previewModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    animation: '$fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #DBE2EF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
    fontFamily: "'Sarabun', 'Inter', sans-serif",
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      color: '#112D4E',
      transform: 'scale(1.1)',
    },
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    maxHeight: 'calc(90vh - 140px)',
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '70vh',
    objectFit: 'contain',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
  },
  previewInfo: {
    marginTop: '20px',
    '& h3': {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#112D4E',
      marginBottom: '12px',
      fontFamily: "'Sarabun', 'Inter', sans-serif",
    },
  },
  previewMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#666',
      fontSize: '0.95rem',
      '& svg': {
        color: '#3F72AF',
        fontSize: '1.1rem',
      },
    },
  },
  previewActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  previewActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#3F72AF',
    color: '#fff',
    '&:hover': {
      background: '#112D4E',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(63,114,175,0.2)',
    },
    '& svg': {
      fontSize: '1.1rem',
    },
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem',
  },
});

const categories = [
  { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
  { label: "การแพทย์", value: "medical", icon: <FaHeart />, children: [
    { label: "โรงพยาบาล", value: "hospital" },
    { label: "คลินิก", value: "clinic" },
  ] },
  { label: "การศึกษา", value: "education", icon: <FaBook />, children: [
    { label: "คณะวิทยาศาสตร์", value: "science" },
    { label: "คณะวิศวกรรมศาสตร์", value: "engineering" },
  ] },
  { label: "รอบรั้ว", value: "campus", icon: <FaUniversity /> }
];

const ImagesPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addDownload } = useDownloadHistory();
  const { user } = useAuth();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<any>(null);

  const itemsPerPage = 12;

  const images = resourcesData.resources.filter((item) => item.type === "image");
  const filteredItems = useMemo(() => (
    category === "all" ? images : images.filter(item => item.category === category)
  ), [category, images]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular": return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "az": return a.title.localeCompare(b.title, "th");
        case "za": return b.title.localeCompare(a.title, "th");
        default: return 0;
      }
    });
  }, [filteredItems, sortBy]);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((page-1)*itemsPerPage, page*itemsPerPage);

  const toggleCat = (val: string) => {
    setOpenCats(open => open.includes(val) ? open.filter(v => v !== val) : [...open, val]);
  };

  const mainCategories = ["all", "medical", "education", "campus"];
  useEffect(() => {
    if (!mainCategories.includes(category)) setSidebarCollapsed(true);
  }, [category]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [category, sortBy]);

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  }, []);

  const handlePreview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleDownload = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (!user) return;
    
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

      // Add to download history
      addDownload(user.id, {
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        fileUrl: item.fileUrl,
        downloadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleBookmark = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (bookmarks.some(bookmark => bookmark.id === item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, "")}`,
        fileUrl: item.fileUrl,
        type: item.type,
        category: item.category,
        createdAt: item.createdAt,
        tags: item.tags
      });
    }
  };

  return (
    <div className={classes.pageWrap}>
      <div className={classes.topBar}>
        <button 
          className={classes.toggleFiltersBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <FaFilter />
          {sidebarCollapsed ? 'แสดงตัวกรอง' : 'ซ่อนตัวกรอง'}
        </button>

        <select 
          className={classes.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">เรียงตาม: ยอดนิยม</option>
          <option value="latest">เรียงตาม: ล่าสุด</option>
          <option value="oldest">เรียงตาม: เก่าสุด</option>
          <option value="az">เรียงตาม: ก-ฮ</option>
          <option value="za">เรียงตาม: ฮ-ก</option>
        </select>
      </div>

      <div className={classes.contentWrap}>
        <aside className={`${classes.sidebar} ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className={classes.filterHeader}>
            <h3>ตัวกรอง</h3>
            <button className={classes.closeButton} onClick={() => setSidebarCollapsed(true)}>
              <FaTimes />
            </button>
          </div>
          
          <div className={classes.filterSection}>
            <h4 className={classes.filterTitle}>หมวดหมู่</h4>
            {categories.map(cat => (
              <label key={cat.value} className={classes.filterOption}>
                <span>{cat.icon} {cat.label}</span>
                <input
                  type="checkbox"
                  checked={category === cat.value}
                  onChange={() => setCategory(cat.value)}
                />
              </label>
            ))}
          </div>

          <div className={classes.filterActions}>
            <button className="clear" onClick={() => {
              setCategory("all");
              setSidebarCollapsed(true);
            }}>
              ล้างตัวกรอง
            </button>
            <button className="apply" onClick={() => setSidebarCollapsed(true)}>
              แสดงผล
            </button>
          </div>
        </aside>

        {!sidebarCollapsed && (
          <div 
            className={`${classes.overlay} ${!sidebarCollapsed ? 'visible' : ''}`}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        <main className={`${classes.main}`}>
          <div className={`${classes.grid} ${sidebarCollapsed ? 'expanded' : ''}`}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={`skeleton-${index}`} className={`${classes.card} ${classes.shimmer}`} style={{ height: "300px" }} />
              ))
            ) : paginatedItems.length === 0 ? (
              <div className={classes.emptyState}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
            ) : (
              paginatedItems.map(item => (
                <div
                  key={item.id}
                  className={classes.card}
                  onClick={() => navigate(`/resource/${item.id}`)}
                >
                  <div className={classes.cardImageBox}>
                    {!loadedImages.has(item.id) && (
                      <FaSpinner className={classes.imageLoader} />
                    )}
                    <img
                      src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, "")}`}
                      alt={item.title}
                      loading="lazy"
                      onLoad={() => handleImageLoad(item.id)}
                      style={{ opacity: loadedImages.has(item.id) ? 1 : 0 }}
                    />
                    <div className={classes.cardActionBar} onClick={e => e.stopPropagation()}>
                      <button 
                        className={classes.cardActionBtn} 
                        title="ดูตัวอย่าง"
                        aria-label="ดูตัวอย่าง"
                        onClick={(e) => handlePreview(e, item)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`${classes.cardActionBtn} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
                        title={bookmarks.some(b => b.id === item.id) ? "ลบบุ๊คมาร์ค" : "บุ๊คมาร์ค"}
                        aria-label={bookmarks.some(b => b.id === item.id) ? "ลบบุ๊คมาร์ค" : "บุ๊คมาร์ค"}
                        onClick={(e) => handleBookmark(e, item)}
                        style={{ 
                          color: bookmarks.some(b => b.id === item.id) ? '#3F72AF' : '#666',
                          background: bookmarks.some(b => b.id === item.id) ? '#f0f5ff' : 'none'
                        }}
                      >
                        <FaRegBookmark />
                      </button>
                      <button 
                        className={classes.cardActionBtn} 
                        title="ดาวน์โหลด"
                        aria-label="ดาวน์โหลด"
                        onClick={(e) => handleDownload(e, item)}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                  <div className={classes.cardBody}>
                    <div className={classes.cardTitle}>{item.title}</div>
                    <div className={classes.cardMeta}>
                      <span>{item.category === "medical"
                        ? <> <FaHeart /> การแพทย์ </>
                        : item.category === "education"
                        ? <> <FaBook /> การศึกษา </>
                        : <> <FaUniversity /> รอบรั้วมหาวิทยาลัย </>}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                      <span>ดาวน์โหลด: {item.downloadCount ?? 0}</span>
                    </div>
                    <div className={classes.tagBar}>
                      {item.tags?.slice(0,3).map(tag => (
                        <span className={classes.tag} key={tag}>{tag}</span>
                      ))}
                      {item.tags?.length > 3 && (
                        <span className={classes.tag}>+{item.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {!loading && paginatedItems.length > 0 && (
            <div className={classes.pagination}>
              <button
                className={`${classes.pageBtn} ${page === 1 ? 'disabled' : ''}`}
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                <i className="pi pi-chevron-left" />
              </button>
              
              {totalPages <= 7 ? (
                // Show all pages if total pages are 7 or less
                Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    className={`${classes.pageBtn} ${page === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))
              ) : (
                // Show pagination with ellipsis
                <>
                  <button
                    className={`${classes.pageBtn} ${page === 1 ? 'active' : ''}`}
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  
                  {page > 3 && <span className={classes.pageEllipsis}>...</span>}
                  
                  {page > 2 && (
                    <button
                      className={classes.pageBtn}
                      onClick={() => setPage(page - 1)}
                    >
                      {page - 1}
                    </button>
                  )}
                  
                  {page !== 1 && page !== totalPages && (
                    <button className={`${classes.pageBtn} active`}>
                      {page}
                    </button>
                  )}
                  
                  {page < totalPages - 1 && (
                    <button
                      className={classes.pageBtn}
                      onClick={() => setPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  )}
                  
                  {page < totalPages - 2 && <span className={classes.pageEllipsis}>...</span>}
                  
                  <button
                    className={`${classes.pageBtn} ${page === totalPages ? 'active' : ''}`}
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                className={`${classes.pageBtn} ${page === totalPages ? 'disabled' : ''}`}
                onClick={() => page < totalPages && setPage(page + 1)}
                disabled={page === totalPages}
              >
                <i className="pi pi-chevron-right" />
              </button>
            </div>
          )}
        </main>
      </div>

      {previewItem && (
        <div className={classes.previewModal} onClick={closePreview}>
          <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h2 className={classes.modalTitle}>{previewItem.title}</h2>
              <button className={classes.closeButton} onClick={closePreview}>
                <FaTimes />
              </button>
            </div>
            <div className={classes.modalBody}>
              <img 
                src={`${import.meta.env.BASE_URL}${previewItem.thumbnailUrl.replace(/^\//, "")}`}
                alt={previewItem.title}
                className={classes.previewImage}
              />
              <div className={classes.previewInfo}>
                <h3>รายละเอียด</h3>
                <div className={classes.previewMeta}>
                  <span>
                    <FaFileAlt />
                    หมวดหมู่: {
                      previewItem.category === "medical" ? "การแพทย์" :
                      previewItem.category === "education" ? "การศึกษา" :
                      previewItem.category === "clinic" ? "คลินิก" :
                      previewItem.category === "campus" ? "รอบรั้วมหาวิทยาลัย" :
                      previewItem.category
                    }
                  </span>
                  <span>
                    <FaUser />
                    ผู้อัพโหลด: {previewItem.uploader || "ไม่ระบุ"}
                  </span>
                  <span>
                    <FaDownload />
                    ดาวน์โหลด: {previewItem.downloadCount || 0} ครั้ง
                  </span>
                </div>
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className={classes.tagBar}>
                    {previewItem.tags.map((tag: string) => (
                      <span key={tag} className={classes.tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <div className={classes.previewActions}>
                  <button 
                    className={classes.previewActionBtn}
                    onClick={(e) => handleDownload(e, previewItem)}
                  >
                    <FaDownload /> ดาวน์โหลด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesPage;
