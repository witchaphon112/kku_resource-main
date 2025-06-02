import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaRegBookmark, FaDownload, FaEye, FaFilter, FaSpinner, FaTimes, FaUser, FaFileAlt, FaList, FaChevronDown, FaChevronUp } from "react-icons/fa";
import resourcesData from "../mock/resources.json";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";

type ViewType = 'grid' | 'list';
type SortEvent = React.ChangeEvent<HTMLSelectElement>;

interface Category {
  label: string;
  value: string;
  icon: React.ReactNode;
  children?: { label: string; value: string; }[];
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  fileUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  downloadCount: number;
  tags: string[];
  uploadedBy: string;
  type: string;
}

const useStyles = createUseStyles({
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  "@keyframes shimmer": {
    "100%": {
      transform: "translateX(100%)",
    }
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
    }
  },
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "2rem",
    gap: "1rem",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#b71c1c",
    marginBottom: "2rem",
  },
  filterGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#555",
    transition: "all 0.2s",
    "&:hover": {
      background: "#f2f2f2",
    },
  },
  activeIconButton: {
    background: "#b71c1c",
    color: "#fff",
    borderColor: "#b71c1c",
  },
  dropdown: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    minWidth: "180px",
    backgroundColor: "#fff",
    "&:focus": {
      outline: "none",
      borderColor: "#b71c1c",
    },
  },
  grid: {
    display: "grid",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  gridLarge: {
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  },
  gridMedium: {
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  },
  gridSmall: {
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  },
  viewControls: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  imageContainer: {
    height: "160px",
    overflow: "hidden",
    position: "relative",
    "&:hover": {
      "& $imageOverlay": {
        opacity: 1,
      },
      "& $image": {
        transform: "scale(1.1)",
      },
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to top, rgba(183, 28, 28, 0.8), rgba(183, 28, 28, 0))",
    opacity: 0,
    transition: "opacity 0.3s ease",
    display: "flex",
    alignItems: "flex-end",
    padding: "1rem",
  },
  overlayText: {
    color: "white",
    fontSize: "0.8rem",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
  },
  cardBody: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.8rem",
    color: "#333",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    lineHeight: 1.4,
  },
  cardMeta: {
    fontSize: "0.8rem",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.8rem",
  },
  tagSection: {
    borderTop: "1px solid #f0f0f0",
    marginTop: "auto",
    padding: "0.8rem 1rem 0",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginBottom: "0.8rem",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    backgroundColor: "#f5f5f5",
    color: "#666",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e8e8e8",
    },
  },
  categoryTag: {
    backgroundColor: "#f8f8f8",
    border: "1px solid #eee",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    color: "#555",
    fontWeight: 500,
  },
  tagIcon: {
    fontSize: "0.85rem",
    marginRight: "0.3rem",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  },
  pageButton: {
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
  emptyState: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
    gridColumn: "1 / -1",
  },
  gridView: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  listCard: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateX(5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  listImageContainer: {
    width: "240px",
    height: "180px",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    "&:hover": {
      "& $imageOverlay": {
        opacity: 1,
      },
      "& $image": {
        transform: "scale(1.1)",
      },
    },
  },
  listContent: {
    padding: "1rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#333",
  },
  listDescription: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.5rem",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    transition: "all 0.3s ease",
  },
  listDescriptionExpanded: {
    "-webkit-line-clamp": "unset",
  },
  listMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.8rem",
    color: "#666",
  },
  learnMore: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    color: "#b71c1c",
    fontSize: "0.8rem",
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  loadingSpinner: {
    animation: "$spin 1s linear infinite",
    color: "#3F72AF",
    fontSize: "2rem",
    display: "block",
    margin: "2rem auto",
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
  previewVideo: {
    width: '100%',
    aspectRatio: '16/9',
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
  tagBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem",
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
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    "& h3": {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#1a1a1a",
    }
  },
  filterSection: {
    marginBottom: "2rem",
    "&:last-child": {
      marginBottom: 0,
    }
  },
  filterTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: "1rem",
  },
  filterOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.7rem 1rem",
    cursor: "pointer",
    color: "#666",
    borderRadius: "10px",
    transition: "all 0.2s",
    "&:hover": {
      background: "#f8faff",
      color: "#3F72AF",
    },
    "& span": {
      fontSize: "0.95rem",
    },
    "& input[type='checkbox']": {
      width: 20,
      height: 20,
      borderRadius: "6px",
      border: "2px solid #ddd",
      transition: "all 0.2s",
      cursor: "pointer",
      "&:checked": {
        borderColor: "#3F72AF",
        backgroundColor: "#3F72AF",
      }
    }
  },
  main: {
    flex: 1,
    minWidth: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.8rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&.expanded": {
      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    }
  },
  videoCard: {
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
  videoCardBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  videoCardTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.4,
    fontFamily: "'Sarabun', 'Inter', sans-serif",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden"
  },
  videoCardMeta: {
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
  videoTagBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem"
  },
  videoTag: {
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
  noResults: {
    textAlign: "center",
    padding: "2.5rem",
    color: "#3F72AF",
    fontSize: "1.18rem",
    fontWeight: 500,
    gridColumn: "1 / -1"
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "4rem",
    padding: "1rem 0"
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#3F72AF",
    animation: "$spin 1s linear infinite",
  },
  videoCardImageBox: {
    width: "100%",
    aspectRatio: "16/9",
    overflow: "hidden",
    position: "relative",
    background: "#f5f5f5",
    "& img, & iframe": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },
  videoCardActionBar: {
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
  videoCardActionBtn: {
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
  pageEllipsisText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    color: "#666",
    fontSize: "1.2rem",
    fontWeight: 600,
  },
});

const categories: Category[] = [
  { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
  { label: "การแพทย์", value: "medical", icon: <FaHeart /> },
  { label: "การศึกษา", value: "education", icon: <FaBook /> },
  { label: "รอบรั้ว", value: "campus", icon: <FaUniversity /> },
];

const VideosPage = () => {
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
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<VideoItem | null>(null);

  const itemsPerPage = 12;

  const videos = resourcesData.resources.filter((item): item is VideoItem => item.type === "video");
  const filteredItems = useMemo(() => (
    category === "all" ? videos : videos.filter(item => item.category === category)
  ), [category, videos]);
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
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [category, sortBy]);

  const handleVideoLoad = useCallback((videoId: string) => {
    setLoadedVideos(prev => new Set(prev).add(videoId));
  }, []);

  const handlePreview = (e: React.MouseEvent, item: VideoItem) => {
    e.stopPropagation();
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleDownload = async (e: React.MouseEvent, item: VideoItem) => {
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

  const handleBookmark = (e: React.MouseEvent, item: VideoItem) => {
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

  const embedYT = (url: string) => {
    const id = url.match(/(?:youtu\.be\/|v=)([^?&]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  return (
    <div className={classes.pageWrap}>
      <div className={classes.topBar}>
        <button 
          className={classes.toggleFiltersBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <i className="pi pi-filter" />
          {sidebarCollapsed ? 'Show Filters' : 'ซ่อนตัวกรอง'}
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
          </div>
          
          <div className={classes.filterSection}>
            <h4 className={classes.filterTitle}>หมวดหมู่</h4>
            {categories.map(cat => (
              <label key={cat.value} className={classes.filterOption}>
                <span>{cat.label}</span>
                <input
                  type="checkbox"
                  checked={category === cat.value}
                  onChange={() => setCategory(cat.value)}
                />
              </label>
            ))}
          </div>

          <div className={classes.filterSection}>
            <h4 className={classes.filterTitle}>Date Added</h4>
            {/* Add date filter options here */}
          </div>
        </aside>

        <main className={`${classes.main}`}>
          <div className={`${classes.gridContainer} ${sidebarCollapsed ? 'expanded' : ''}`}>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={`skeleton-${index}`} className={`${classes.videoCard} ${classes.shimmer}`} style={{ height: "300px" }} />
              ))
            ) : paginatedItems.length === 0 ? (
              <div className={classes.noResults}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
            ) : (
              paginatedItems.map(item => (
                <div
                  key={item.id}
                  className={classes.videoCard}
                  onClick={() => navigate(`/resource/${item.id}`)}
                >
                  <div className={classes.videoCardImageBox}>
                    {!loadedVideos.has(item.id) && (
                      <FaSpinner className={classes.imageLoader} />
                    )}
                    {item.videoUrl ? (
                      <iframe
                        src={embedYT(item.videoUrl)}
                        className={classes.image}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={item.title}
                        onLoad={() => handleVideoLoad(item.id)}
                        style={{ opacity: loadedVideos.has(item.id) ? 1 : 0 }}
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, "")}`}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => handleVideoLoad(item.id)}
                        style={{ opacity: loadedVideos.has(item.id) ? 1 : 0 }}
                      />
                    )}
                    <div className={classes.videoCardActionBar}>
                      <button 
                        className={classes.videoCardActionBtn} 
                        title="ดูตัวอย่าง"
                        aria-label="ดูตัวอย่าง"
                        onClick={(e) => handlePreview(e, item)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`${classes.videoCardActionBtn} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
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
                        className={classes.videoCardActionBtn} 
                        title="ดาวน์โหลด"
                        aria-label="ดาวน์โหลด"
                        onClick={(e) => handleDownload(e, item)}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                  <div className={classes.videoCardBody}>
                    <div className={classes.videoCardTitle}>{item.title}</div>
                    <div className={classes.videoCardMeta}>
                      <span>{item.category === "medical"
                        ? <> <FaHeart /> การแพทย์ </>
                        : item.category === "education"
                        ? <> <FaBook /> การศึกษา </>
                        : <> <FaUniversity /> รอบรั้วมหาวิทยาลัย </>}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                      <span>ดู: {item.viewCount ?? 0} ครั้ง</span>
                    </div>
                    <div className={classes.videoTagBar}>
                      {item.tags?.slice(0,3).map(tag => (
                        <span className={classes.videoTag} key={tag}>{tag}</span>
                      ))}
                      {item.tags?.length > 3 && (
                        <span className={classes.videoTag}>+{item.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {!loading && paginatedItems.length > 0 && (
            <div className={classes.paginationContainer}>
              <button
                className={`${classes.pageButton} ${page === 1 ? 'disabled' : ''}`}
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                <i className="pi pi-chevron-left" />
              </button>
              
              {totalPages <= 7 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    className={`${classes.pageButton} ${page === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))
              ) : (
                <>
                  <button
                    className={`${classes.pageButton} ${page === 1 ? 'active' : ''}`}
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  
                  {page > 3 && <span className={classes.pageEllipsisText}>...</span>}
                  
                  {page > 2 && (
                    <button
                      className={classes.pageButton}
                      onClick={() => setPage(page - 1)}
                    >
                      {page - 1}
                    </button>
                  )}
                  
                  {page !== 1 && page !== totalPages && (
                    <button className={`${classes.pageButton} active`}>
                      {page}
                    </button>
                  )}
                  
                  {page < totalPages - 1 && (
                    <button
                      className={classes.pageButton}
                      onClick={() => setPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  )}
                  
                  {page < totalPages - 2 && <span className={classes.pageEllipsisText}>...</span>}
                  
                  <button
                    className={`${classes.pageButton} ${page === totalPages ? 'active' : ''}`}
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                className={`${classes.pageButton} ${page === totalPages ? 'disabled' : ''}`}
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
              {previewItem.videoUrl ? (
                <iframe
                  src={embedYT(previewItem.videoUrl)}
                  className={classes.previewVideo}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={previewItem.title}
                />
              ) : (
                <img 
                  src={`${import.meta.env.BASE_URL}${previewItem.thumbnailUrl.replace(/^\//, "")}`}
                  alt={previewItem.title}
                  className={classes.previewVideo}
                />
              )}
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
                    ผู้อัพโหลด: {previewItem.uploadedBy || "ไม่ระบุ"}
                  </span>
                  <span>
                    <FaEye />
                    จำนวนการเข้าชม: {previewItem.viewCount || 0} ครั้ง
                  </span>
                </div>
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className={classes.videoTagBar}>
                    {previewItem.tags.map((tag: string) => (
                      <span key={tag} className={classes.videoTag}>{tag}</span>
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

export default VideosPage;
