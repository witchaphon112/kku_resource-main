import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaList, FaChevronDown, FaChevronUp, 
  FaRegBookmark, FaDownload, FaEye, FaSpinner, FaTimes, FaUser, FaFileAlt, FaFilter } from "react-icons/fa";
import resourcesData from "../mock/resources.json";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import FilterModal from '../components/FilterModal';

type ViewType = 'grid' | 'list';
type SortType = 'latest' | 'oldest' | 'popular' | 'az' | 'za';
type CategoryType = 'all' | 'medical' | 'education' | 'campus';

interface GraphicItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  fileUrl: string;
  category: string;
  tags: string[];
  uploadedBy?: string;
  downloadCount?: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  type: string;
}

interface Category {
  label: string;
  value: CategoryType;
  icon: React.ReactNode;
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
    "@media (max-width: 600px)": {
      padding: "1rem",
      gap: "1rem",
    }
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
    top: 20,
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
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "2rem",
    gap: "1rem",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#3F72AF",
    marginBottom: "2rem",
  },
  filterControls: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "0.7rem 1.2rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#666",
    transition: "all 0.2s",
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
      color: "#fff",
      borderColor: "#3F72AF",
      boxShadow: "0 4px 12px rgba(63,114,175,0.2)",
    }
  },
  viewControls: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  sortSelect: {
    padding: "0.7rem 1.2rem",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    fontSize: "0.95rem",
    minWidth: 200,
    "@media (max-width: 600px)": {
      width: "100%",
      minWidth: "unset",
    }
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.8rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&.expanded": {
      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1rem",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
      gap: "1rem",
    }
  },
  graphicCard: {
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
      "& $graphicImageBox img": {
        transform: "scale(1.05)",
      },
      "& $graphicActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  graphicImageBox: {
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
  graphicActionBar: {
    display: "flex",
    gap: "0.5rem",
    position: "absolute",
    top: "1rem",
    right: "1rem",
    zIndex: 3,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    padding: "0.5rem",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    "$graphicImageBox:hover &": {
      opacity: 1,
      transform: "translateY(0)",
    }
  },
  graphicActionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.4rem",
    height: "2.4rem",
    border: "none",
    borderRadius: "8px",
    background: "none",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      background: "#f0f5ff",
      color: "#3F72AF",
      transform: "translateY(-2px)",
    },
    "&.active": {
      background: "#f0f5ff",
      color: "#3F72AF",
    }
  },
  graphicCardBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (max-width: 600px)": {
      padding: "1rem",
      gap: "0.8rem",
    }
  },
  graphicCardTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.4,
    "@media (max-width: 600px)": {
      fontSize: "1.1rem",
    },
    fontFamily: "'Sarabun', 'Inter', sans-serif",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden"
  },
  graphicCardMeta: {
    fontSize: "0.95rem",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
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
  graphicTagBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem"
  },
  graphicTag: {
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
  shimmer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f6f7f8",
    "&::after": {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transform: "translateX(-100%)",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      animation: "$shimmer 1.5s infinite",
      content: '""',
    }
  },
  previewModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "16px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    width: "1200px",
    overflow: "hidden",
    position: "relative",
    animation: "$fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    borderBottom: "1px solid #eee",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#333",
  },
  closeButton: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      border: "none",
      background: "none",
      cursor: "pointer",
      color: "#666",
      borderRadius: "50%",
      "&:hover": {
        background: "#f5f5f5",
      }
    }
  },
  modalBody: {
    padding: "24px",
    "@media (max-width: 600px)": {
      padding: "16px",
    },
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    maxHeight: "calc(90vh - 80px)",
    overflow: "auto",
  },
  previewImage: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  previewInfo: {
    "& h3": {
      margin: "0 0 1rem 0",
      fontSize: "1.2rem",
      color: "#333",
    }
  },
  previewMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#666",
      "& svg": {
        color: "#3F72AF",
      }
    }
  },
  previewActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  previewActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.8rem 1.5rem",
    background: "#3F72AF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
    transition: "all 0.2s",
    "&:hover": {
      background: "#2D5A88",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(63,114,175,0.2)",
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
  pageEllipsisText: {
    padding: "0.5rem 1rem",
    color: "#666",
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#3F72AF",
    fontSize: "2rem",
    animation: "$spin 1s linear infinite",
  },
  graphicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  graphicListView: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  graphicListCard: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.05)",
    "&:hover": {
      transform: "translateX(5px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
    },
  },
  graphicListImageContainer: {
    width: "240px",
    height: "180px",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    background: "#f5f5f5",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&:hover img": {
      transform: "scale(1.05)",
    }
  },
  graphicListContent: {
    padding: "1.5rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  graphicListTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#1a1a1a",
    fontFamily: "'Sarabun', 'Inter', sans-serif",
  },
  graphicListDescription: {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "0.5rem",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    transition: "all 0.3s ease",
  },
  graphicListDescriptionExpanded: {
    "-webkit-line-clamp": "unset",
  },
  graphicListMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.95rem",
    color: "#666",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
  },
  expandButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    color: "#3F72AF",
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  emptyStateMessage: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
    gridColumn: "1 / -1",
  },
  main: {
    flex: 1,
    minWidth: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  filterActions: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "flex",
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "1rem",
      background: "#fff",
      borderTop: "1px solid #eee",
      gap: "1rem",
      "& button": {
        flex: 1,
        padding: "0.8rem",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        "&.clear": {
          background: "#f5f5f5",
          color: "#666",
          "&:hover": {
            background: "#eee",
          }
        },
        "&.apply": {
          background: "#3F72AF",
          color: "#fff",
          "&:hover": {
            background: "#2D5A88",
          }
        }
      }
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
  }
});

const categories = [
  { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
  { label: "การแพทย์", value: "medical", icon: <FaHeart />,},
  { label: "การเรียนการสอน", value: "education", icon: <FaBook />,},
  { label: "รอบรั้วมหาลัย", value: "campus", icon: <FaUniversity /> }
];

const GraphicsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addDownload } = useDownloadHistory();
  const { user } = useAuth();

  const [viewType, setViewType] = useState<ViewType>('grid');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<GraphicItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const itemsPerPage = 12;
  const graphics = resourcesData.resources.filter((item) => item.type === "graphic") as GraphicItem[];

  const filteredItems = useMemo(() => {
    return category === "all"
      ? graphics
      : graphics.filter((item) => item.category === category);
  }, [category, graphics]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return ((b.downloadCount || 0) - (a.downloadCount || 0));
        case "az":
          return a.title.localeCompare(b.title, "th");
        case "za":
          return b.title.localeCompare(a.title, "th");
        default:
          return 0;
      }
    });
  }, [filteredItems, sortBy]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleExpand = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  }, []);

  const handlePreview = (e: React.MouseEvent, item: GraphicItem) => {
    e.stopPropagation();
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleDownload = async (e: React.MouseEvent, item: GraphicItem) => {
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

  const handleBookmark = (e: React.MouseEvent, item: GraphicItem) => {
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

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [category, sortBy]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFilterModalOpen(false);
  };

  const handleTypeChange = (type: string) => {
    if (type === "all") {
      setCategory("all");
    } else {
      setCategory(type);
    }
    setPage(1);
  };

  const renderGridView = () => (
    <div className={`${classes.gridContainer} ${sidebarCollapsed ? 'expanded' : ''}`}>
      {loading ? (
        Array.from({ length: itemsPerPage }).map((_, index) => (
          <div key={`skeleton-${index}`} className={`${classes.graphicCard} ${classes.shimmer}`} style={{ height: "300px" }} />
        ))
      ) : paginatedItems.length === 0 ? (
        <div className={classes.emptyStateMessage}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
      ) : (
        paginatedItems.map((item) => (
          <div
            key={item.id}
            className={classes.graphicCard}
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <div className={classes.graphicImageBox}>
              {!loadedImages.has(item.id) && (
                <FaSpinner className={classes.imageLoader} />
              )}
              <img
                src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                alt={item.title}
                title={item.title}
                className={classes.graphicImage}
                onLoad={() => handleImageLoad(item.id)}
                style={{ opacity: loadedImages.has(item.id) ? 1 : 0 }}
              />
              <div className={classes.graphicActionBar}>
                <button 
                  className={classes.graphicActionBtn} 
                  title="ดูตัวอย่าง"
                  aria-label="ดูตัวอย่าง"
                  onClick={(e) => handlePreview(e, item)}
                >
                  <FaEye />
                </button>
                <button 
                  className={`${classes.graphicActionBtn} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
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
                  className={classes.graphicActionBtn} 
                  title="ดาวน์โหลด"
                  aria-label="ดาวน์โหลด"
                  onClick={(e) => handleDownload(e, item)}
                >
                  <FaDownload />
                </button>
              </div>
            </div>
            <div className={classes.graphicCardBody}>
              <h3 className={classes.graphicCardTitle}>{item.title}</h3>
              <div className={classes.graphicCardMeta}>
                <span>
                  {item.category === "medical"
                    ? <><FaHeart /> การแพทย์</>
                    : item.category === "education"
                    ? <><FaBook /> การศึกษา</>
                    : <><FaUniversity /> รอบรั้วมหาวิทยาลัย</>}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                <span>ดาวน์โหลด: {item.downloadCount ?? 0} ครั้ง</span>
              </div>
              <div className={classes.graphicTagBar}>
                {item.tags?.slice(0,3).map(tag => (
                  <span className={classes.graphicTag} key={tag}>{tag}</span>
                ))}
                {item.tags?.length > 3 && (
                  <span className={classes.graphicTag}>+{item.tags.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderListView = () => (
    <div className={classes.graphicListView}>
      {paginatedItems.map((item) => (
        <div
          key={item.id}
          className={classes.graphicListCard}
          onClick={() => navigate(`/resource/${item.id}`)}
        >
          <div className={classes.graphicListImageContainer}>
            <img
              src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
              alt={item.title}
              title={item.title}
              className={classes.graphicImage}
            />
          </div>
          <div className={classes.graphicListContent}>
            <div>
              <h3 className={classes.graphicListTitle}>{item.title}</h3>
              <p className={`${classes.graphicListDescription} ${
                expandedItems.has(item.id) ? classes.graphicListDescriptionExpanded : ""
              }`}>
                {item.description || "ไม่มีคำอธิบายเพิ่มเติม"}
              </p>
              {item.description && item.description.length > 100 && (
                <button 
                  className={classes.expandButton}
                  onClick={(e) => toggleExpand(item.id, e)}
                >
                  {expandedItems.has(item.id) ? (
                    <>
                      <span>ย่อเนื้อหา</span>
                      <FaChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      <span>อ่านเพิ่มเติม</span>
                      <FaChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
            <div className={classes.graphicListMeta}>
              <span>
                {item.category === "medical"
                  ? <><FaHeart /> การแพทย์</>
                  : item.category === "education"
                  ? <><FaBook /> การศึกษา</>
                  : <><FaUniversity /> รอบรั้วมหาวิทยาลัย</>}
              </span>
              <span>อัพโหลดเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
              <span>ดาวน์โหลด: {item.downloadCount ?? 0} ครั้ง</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={classes.pageWrap}>
      <div className={classes.topBar}>
        {isMobile ? (
          <button 
            className={classes.toggleFiltersBtn}
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FaFilter />
            ตัวกรอง
          </button>
        ) : (
          <button 
            className={classes.toggleFiltersBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <FaFilter />
            {sidebarCollapsed ? 'แสดงตัวกรอง' : 'ซ่อนตัวกรอง'}
          </button>
        )}

        <select 
          className={classes.sortSelect}
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="popular">เรียงตาม: ยอดนิยม</option>
          <option value="latest">เรียงตาม: ล่าสุด</option>
          <option value="oldest">เรียงตาม: เก่าสุด</option>
        </select>
      </div>

      <div className={classes.contentWrap}>
        {!isMobile && (
          <>
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
                <button 
                  className="clear"
                  onClick={() => {
                    setCategory("all");
                    setSidebarCollapsed(true);
                  }}
                >
                  ล้างตัวกรอง
                </button>
                <button 
                  className="apply"
                  onClick={() => setSidebarCollapsed(true)}
                >
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
          </>
        )}

        <main className={`${classes.main}`}>
          <div className={`${classes.gridContainer} ${sidebarCollapsed ? 'expanded' : ''}`}>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={`skeleton-${index}`} className={`${classes.graphicCard} ${classes.shimmer}`} style={{ height: "300px" }} />
              ))
            ) : paginatedItems.length === 0 ? (
              <div className={classes.emptyStateMessage}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
            ) : (
              paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={classes.graphicCard}
                  onClick={() => navigate(`/resource/${item.id}`)}
                >
                  <div className={classes.graphicImageBox}>
                    {!loadedImages.has(item.id) && (
                      <FaSpinner className={classes.imageLoader} />
                    )}
                    <img
                      src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                      alt={item.title}
                      title={item.title}
                      className={classes.graphicImage}
                      onLoad={() => handleImageLoad(item.id)}
                      style={{ opacity: loadedImages.has(item.id) ? 1 : 0 }}
                    />
                    <div className={classes.graphicActionBar}>
                      <button 
                        className={classes.graphicActionBtn} 
                        title="ดูตัวอย่าง"
                        aria-label="ดูตัวอย่าง"
                        onClick={(e) => handlePreview(e, item)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`${classes.graphicActionBtn} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
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
                        className={classes.graphicActionBtn} 
                        title="ดาวน์โหลด"
                        aria-label="ดาวน์โหลด"
                        onClick={(e) => handleDownload(e, item)}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                  <div className={classes.graphicCardBody}>
                    <h3 className={classes.graphicCardTitle}>{item.title}</h3>
                    <div className={classes.graphicCardMeta}>
                      <span>
                        {item.category === "medical"
                          ? <><FaHeart /> การแพทย์</>
                          : item.category === "education"
                          ? <><FaBook /> การศึกษา</>
                          : <><FaUniversity /> รอบรั้วมหาวิทยาลัย</>}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                      <span>ดาวน์โหลด: {item.downloadCount ?? 0} ครั้ง</span>
                    </div>
                    <div className={classes.graphicTagBar}>
                      {item.tags?.slice(0,3).map(tag => (
                        <span className={classes.graphicTag} key={tag}>{tag}</span>
                      ))}
                      {item.tags?.length > 3 && (
                        <span className={classes.graphicTag}>+{item.tags.length - 3}</span>
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

      {/* Filter Modal for Mobile */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        keyword=""
        setKeyword={() => {}}
        searchBy=""
        setSearchBy={() => {}}
        sort={sortBy}
        setSort={setSortBy}
        types={[category]}
        handleTypeChange={handleTypeChange}
        selectedYears={[]}
        setSelectedYears={() => {}}
        yearCounts={{}}
        uniqueYears={[]}
        handleSubmit={handleFilterModalSubmit}
        resourceTypes={["medical", "education", "campus"]}
        showOnlyTypes={true}
      />

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
                  <div className={classes.graphicTagBar}>
                    {previewItem.tags.map((tag: string) => (
                      <span key={tag} className={classes.graphicTag}>{tag}</span>
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

export default GraphicsPage;
