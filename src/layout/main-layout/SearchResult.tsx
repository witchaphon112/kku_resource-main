import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import resourcesData from "../../mock/resources.json";
import { createUseStyles } from "react-jss";
import {
  FaSearch,
  FaFileAlt,
  FaUser,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTimes,
  FaThLarge,
  FaEye,
  FaDownload,
  FaCheck,
  FaPlay,
  FaPalette,
  FaImage
} from "react-icons/fa";
import FilterModal from './FilterModal';

type ViewMode = 'list' | 'grid';

interface StyleProps {
  isCollapsed: boolean;
  viewMode: ViewMode;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  category: string;
  thumbnailUrl?: string;
  fileUrl: string;
  createdAt: string;
  downloadCount?: number;
  tags?: string[];
  uploader?: string;
  description?: string;
  gallery?: string[];
  uploadedBy?: string;
  viewCount?: number;
  updatedAt?: string;
  videoUrl?: string;
}

const ITEMS_PER_PAGE = 20;

const resourceTypes = [
  "ทั้งหมด",
  "รูปภาพ", 
  "วิดีโอ",
  "กราฟิก"
];

const getYearCounts = (resources: Resource[]) => {
  const counts: Record<string, number> = {};
  resources.forEach(item => {
    const year = (new Date(item.createdAt).getFullYear() + 543).toString();
    counts[year] = (counts[year] || 0) + 1;
  });
  return counts;
};

const getUniqueYears = (resources: Resource[]) => {
  const years = resources.map(item => (new Date(item.createdAt).getFullYear() + 543).toString());
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
};

const useStyles = createUseStyles<string, StyleProps>({
  container: {
    display: "flex",
    margin: "0",
    padding: "40px 48px",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 120px)",
    '@media (max-width: 1024px)': {
      padding: "30px 24px",
    },
    '@media (max-width: 768px)': { 
      flexDirection: "column",
      padding: "16px",
      gap: "0",
    },
    '@media (max-width: 480px)': {
      padding: "12px 8px",
    }
  },

  mobileHeader: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      background: '#fff',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: '0',
      zIndex: 50,
    }
  },

  mobileHeaderTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#112D4E',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },

  sidebar: {
    width: "100%",
    height: "100%",
    background: "#fffdfa",
    borderRadius: 14,
    padding: "1.2rem",
    boxShadow: "0 6px 24px rgba(63,114,175,0.1)",
    fontFamily: "var(--bs-font-primary)",
    fontSize: "0.95rem",
    border: "1.5px solid #DBE2EF",
    overflow: "auto",
    marginTop: "3rem",
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },

  main: {
    flex: 1,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 14px rgba(63,114,175,0.08)",
    padding: "2.2rem 1.7rem",
    minHeight: 400,
    fontFamily: "var(--bs-font-primary)",
    marginTop: "3rem",
    '@media (max-width: 1024px)': {
      padding: "1.8rem 1.4rem",
      marginTop: "2rem",
    },
    '@media (max-width: 768px)': { 
      padding: "1rem",
      marginTop: "0",
      borderRadius: 12,
      boxShadow: "0 1px 8px rgba(63,114,175,0.06)",
    },
    '@media (max-width: 480px)': {
      padding: "0.75rem",
      borderRadius: 8,
    }
  },

  mobileFilterButton: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      position: 'fixed',
      bottom: '24px',
      right: '20px',
      zIndex: 90,
      alignItems: 'center',
      gap: '8px',
      background: '#3F72AF',
      color: '#fff',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '100px',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(63,114,175,0.3)',
      '&:active': {
        transform: 'scale(0.96)',
        boxShadow: '0 2px 8px rgba(63,114,175,0.2)',
      },
      '@supports (padding-bottom: env(safe-area-inset-bottom))': {
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
      }
    }
  },

  viewToggle: {
    display: 'flex',
    gap: 6,
    marginLeft: 'auto',
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '4px',
    '@media (max-width: 768px)': {
      gap: 2,
      padding: '3px',
    },
    '@media (max-width: 480px)': {
      width: '100%',
      marginLeft: 0,
      marginTop: '8px',
    }
  },

  viewToggleButton: {
    background: 'transparent',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      padding: '6px 10px',
      fontSize: 13,
      gap: 4,
    },
    '@media (max-width: 480px)': {
      flex: 1,
      justifyContent: 'center',
      padding: '8px 6px',
      fontSize: 12,
    }
  },

  viewToggleButtonActive: {
    color: '#fff',
    backgroundColor: '#3F72AF',
    boxShadow: '0 2px 4px rgba(63,114,175,0.2)',
    '&:hover': {
      backgroundColor: '#112D4E',
    }
  },

  viewToggleButtonInactive: {
    color: '#3F72AF',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '#e9ecef',
    }
  },

  sidebarContainer: {
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: 280,
    marginRight: 36,
    zIndex: 100,
    '@media (max-width: 1024px)': {
      width: 260,
      marginRight: 24,
    },
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },

  resultHeader: {
    fontWeight: 900,
    fontSize: 21,
    marginBottom: 18,
    color: "#112D4E",
    letterSpacing: 0.1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "16px 20px",
    background: "#F9F7F7",
    borderRadius: 12,
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
    '@media (max-width: 1024px)': {
      fontSize: 19,
      padding: "14px 18px",
    },
    '@media (max-width: 768px)': {
      fontSize: 16,
      padding: "12px 14px",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
    },
    '@media (max-width: 480px)': {
      fontSize: 15,
      padding: "10px 12px",
      marginBottom: 12,
    }
  },

  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    '@media (max-width: 768px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    borderRadius: 13,
    marginBottom: 18,
    background: "#fffdfa",
    boxShadow: "0 2px 12px rgba(63,114,175,0.08)",
    padding: "1.3rem 1.1rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
    '@media (max-width: 1024px)': {
      padding: "1.1rem 1rem",
      gap: 14,
    },
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: 12,
      padding: "1rem",
      marginBottom: 0,
      borderRadius: 10,
    },
    '@media (max-width: 480px)': {
      padding: "0.8rem",
      gap: 8,
      borderRadius: 8,
    },
    "&:hover": {
      background: "#F9F7F7",
      boxShadow: "0 4px 16px rgba(63,114,175,0.12)",
      transform: "translateY(-2px)",
      '@media (max-width: 768px)': {
        transform: "none",
        background: "#f8f9fa",
      }
    }
  },

  mobileThumb: {
    '@media (max-width: 768px)': {
      width: "100%",
      height: 200,
      objectFit: "cover",
      borderRadius: 8,
      background: "#f8f8f8",
      border: "1px solid #e0e0e0",
    },
    '@media (max-width: 480px)': {
      height: 180,
      borderRadius: 6,
    }
  },

  thumb: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 10,
    background: "#f8f8f8",
    border: "1.2px solid #DBE2EF",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    '@media (max-width: 1024px)': {
      width: 130,
      height: 130,
    },
    '@media (max-width: 768px)': {
      width: "100%",
      height: 200,
    },
    '@media (max-width: 480px)': {
      height: 180,
    }
  },

  info: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    '@media (max-width: 768px)': {
      width: "100%",
      gap: 6,
    }
  },

  title: {
    fontWeight: 900,
    fontSize: "1.09rem",
    color: "#112D4E",
    marginBottom: 8,
    cursor: "pointer",
    lineHeight: 1.4,
    "&:hover": { 
      textDecoration: "underline", 
      color: "#3F72AF" 
    },
    '@media (max-width: 1024px)': {
      fontSize: "1.05rem",
    },
    '@media (max-width: 768px)': {
      fontSize: "1rem",
      marginBottom: 6,
      whiteSpace: "normal",
      overflow: "visible",
      textOverflow: "initial",
    },
    '@media (max-width: 480px)': {
      fontSize: "0.95rem",
    }
  },

  gridView: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    margin: "20px 0",
    '@media (max-width: 1200px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.3rem",
    },
    '@media (max-width: 1024px)': {
      gridTemplateColumns: "repeat(2, 1fr)", 
      gap: "1.2rem",
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
      margin: "16px 0",
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: "1fr",
      gap: "0.8rem",
      margin: "12px 0",
    }
  },

  gridItem: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
    border: "1px solid #f0f0f0",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    '@media (max-width: 768px)': {
      borderRadius: "10px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
    },
    '@media (max-width: 480px)': {
      borderRadius: "8px",
    },
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
      '@media (max-width: 768px)': {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }
    }
  },

  gridThumb: {
    position: "relative",
    width: "100%",
    paddingTop: "60%",
    background: "#f5f5f5",
    overflow: "hidden",
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    "&:hover img": {
      transform: "scale(1.05)",
      '@media (max-width: 768px)': {
        transform: "none",
      }
    }
  },

  cardActionBar: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    display: "flex",
    gap: "6px",
    zIndex: 3,
    '@media (max-width: 768px)': {
      position: "static",
      justifyContent: "center",
      padding: "8px 0 0 0",
      marginTop: "auto",
      background: "transparent",
      gap: "8px",
    }
  },

  cardActionBtn: {
    background: "rgba(255,255,255,0.95)",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "#3F72AF",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    '@media (max-width: 768px)': {
      flex: 1,
      justifyContent: "center",
      padding: "8px 12px",
      fontSize: "0.85rem",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    },
    "&:hover": {
      background: "#3F72AF",
      color: "#fff",
      transform: "translateY(-1px)",
      '@media (max-width: 768px)': {
        transform: "none",
        background: "#3F72AF",
      }
    },
    "&:active": {
      transform: "translateY(0)",
    }
  },

  gridContent: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
    '@media (max-width: 768px)': {
      padding: "12px",
      gap: "8px"
    },
    '@media (max-width: 480px)': {
      padding: "10px",
    }
  },

  gridTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#112D4E",
    lineHeight: 1.4,
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    marginBottom: "4px",
    '@media (max-width: 768px)': {
      fontSize: "0.95rem",
      "-webkit-line-clamp": 3,
    },
    '@media (max-width: 480px)': {
      fontSize: "0.9rem",
    }
  },

  
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    gap: 6,
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      marginTop: 20,
      gap: 4,
      padding: "0 8px",
    },
    '@media (max-width: 480px)': {
      marginTop: 16,
      gap: 3,
    }
  },

  pageBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    background: "#fff",
    color: "#3F72AF",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "40px",
    '@media (max-width: 768px)': {
      padding: "6px 10px",
      fontSize: 13,
      minWidth: "36px",
    },
    '@media (max-width: 480px)': {
      padding: "5px 8px",
      fontSize: 12,
      minWidth: "32px",
    },
    "&:hover": { 
      background: "#3F72AF", 
      color: "#fff",
      transform: "translateY(-1px)",
      '@media (max-width: 768px)': {
        transform: "none",
      }
    }
  },

  pageBtnActive: {
    background: "#112D4E",
    color: "#fff",
    border: "1px solid #112D4E",
    boxShadow: "0 2px 4px rgba(17,45,78,0.2)"
  },

  mobileMeta: {
    '@media (max-width: 768px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '8px 0',
      borderTop: '1px solid #f0f0f0',
      marginTop: '8px',
    }
  },

  mobileMetaRow: {
    '@media (max-width: 768px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
    }
  },

  typeIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 2,
    '@media (max-width: 768px)': {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      alignSelf: 'flex-start',
      marginBottom: '4px',
    }
  },

  loadingCard: {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    animation: '$pulse 1.5s ease-in-out infinite',
  },

  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },

  mobileActionContainer: {
    '@media (max-width: 768px)': {
      position: 'sticky',
      bottom: '16px',
      background: '#fff',
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
      margin: '16px -16px -16px -16px',
      display: 'flex',
      gap: '8px',
    }
  },

  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    '@media (max-width: 768px)': {
      padding: '30px 16px',
    },
    '& svg': {
      fontSize: '3rem',
      marginBottom: '16px',
      color: '#ccc',
    },
    '& h3': {
      fontSize: '1.2rem',
      fontWeight: 600,
      margin: '0 0 8px 0',
      '@media (max-width: 768px)': {
        fontSize: '1.1rem',
      }
    },
    '& p': {
      fontSize: '0.95rem',
      margin: 0,
      '@media (max-width: 768px)': {
        fontSize: '0.9rem',
      }
    }
  },

  hideOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none !important',
    }
  },

  showOnMobile: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    }
  },

  label: {
    fontWeight: 800,
    fontSize: 15,
    color: "#112D4E",
    marginBottom: 6,
    marginTop: 0,
    display: "flex",
    alignItems: "center",
    gap: 6,
    letterSpacing: 0.01,
  },
  searchBox: {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: 10,
    border: "1.7px solid #DBE2EF",
    fontSize: 14,
    marginBottom: 12,
    outline: "none",
    background: "#fff",
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
    transition: "border 0.18s, box-shadow 0.18s",
    fontWeight: 600,
    color: "#112D4E",
    "&:focus": { 
      border: "1.7px solid #3F72AF", 
      boxShadow: "0 2px 12px rgba(63,114,175,0.12)" 
    }
  },

  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3F72AF',
    borderRadius: '50%',
    animation: '$spin 1s linear infinite'
  },

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },

  errorContainer: {
    padding: '20px',
    margin: '20px 0',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#e74c3c'
  },

  errorButton: {
    marginTop: '10px',
    padding: '8px 16px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      background: '#c0392b'
    }
  },

  categoryLabel: {
    backgroundColor: '#f0f7ff',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#3F72AF',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },

  metaInfo: {
    color: '#666',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
});

const SearchResult: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles({ isCollapsed, viewMode });
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState(query.get("q") || "");
  const [logic, setLogic] = useState("AND");
  const [searchBy, setSearchBy] = useState("title");
  const [sort, setSort] = useState("newest");
  const [types, setTypes] = useState(resourceTypes);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<Resource | null>(null);

  const yearCounts = useMemo(() => getYearCounts(resourcesData.resources as Resource[]), []);
  const uniqueYears = useMemo(() => getUniqueYears(resourcesData.resources as Resource[]), []);

  const results = useMemo(() => {
    let filtered = resourcesData.resources || [];
    if (keyword.trim()) {
      filtered = filtered.filter(item => {
        const target = searchBy === "title"
          ? item.title
          : item.category || "";
        return logic === "AND"
          ? target.toLowerCase().includes(keyword.toLowerCase())
          : target.toLowerCase().includes(keyword.toLowerCase());
      });
    }
    if (!types.includes("ทั้งหมด")) {
      filtered = filtered.filter(item => {
        const typeMap: Record<string, string> = {
          "รูปภาพ": "image",
          "วิดีโอ": "video", 
          "กราฟิก": "graphic"
        };
        return types.some(type => typeMap[type] === item.type);
      });
    }
    if (selectedYears.length > 0) {
      filtered = filtered.filter(item => selectedYears.includes((new Date(item.createdAt).getFullYear() + 543).toString()));
    }
    if (sort === "newest") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
    } else if (sort === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
    }
    return filtered;
  }, [keyword, logic, searchBy, sort, types, selectedYears]);

  const totalPages = Math.ceil(Number(results.length) / Number(ITEMS_PER_PAGE));
  const pagedResults = results.slice(
    (Number(page) - 1) * Number(ITEMS_PER_PAGE),
    Number(page) * Number(ITEMS_PER_PAGE)
  );

  useEffect(() => { setPage(1); }, [keyword, logic, searchBy, sort, types, selectedYears]);

  const handleTypeChange = (type: string) => {
    if (type === "ทั้งหมด") {
      setTypes(types.includes("ทั้งหมด") ? [] : [...resourceTypes]);
    } else {
      let updated = types.includes(type)
        ? types.filter(t => t !== type && t !== "ทั้งหมด")
        : [...types.filter(t => t !== "ทั้งหมด"), type];
      if (updated.length === resourceTypes.length - 1) {
        updated = [...resourceTypes];
      }
      setTypes(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handlePreview = useCallback((e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = resourcesData.resources.find(r => r.id === itemId) as Resource;
    setPreviewItem(item);
  }, []);

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleDownload = useCallback(async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const response = await fetch(item.fileUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      setError('เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'video':
        return { icon: FaPlay, color: '#e74c3c', label: 'วิดีโอ' };
      case 'graphic':
        return { icon: FaPalette, color: '#9b59b6', label: 'กราฟิก' };
      case 'image':
      default:
        return { icon: FaImage, color: '#3498db', label: 'รูปภาพ' };
    }
  };

  const renderGridView = () => (
    <div className={classes.gridView}>
      {pagedResults.map((item) => {
        const categoryMap: Record<string, string> = {
          medical: "การแพทย์",
          education: "การศึกษา", 
          clinic: "คลินิก",
          campus: "รอบรั้วมหาวิทยาลัย"
        };

        const formattedDate = item.createdAt && new Date(item.createdAt).toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          calendar: 'buddhist'
        });

        const typeInfo = getTypeInfo(item.type);
        const TypeIcon = typeInfo.icon;

        return (
          <div 
            className={classes.gridItem} 
            key={item.id} 
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <div className={classes.gridThumb}>
              <img
                src={item.thumbnailUrl || "/no-image.png"}
                alt={item.title}
                loading="lazy"
              />
              
              <div 
                className={classes.typeIndicator}
                style={{ 
                  background: typeInfo.color,
                  color: '#fff'
                }}
              >
                <TypeIcon size={10} />
                {typeInfo.label}
              </div>

              <div className={classes.cardActionBar}>
                <button 
                  className={classes.cardActionBtn} 
                  title="ดูตัวอย่าง"
                  onClick={(e) => handlePreview(e, item.id)}
                >
                  <FaEye size={12} />
                  <span className={classes.hideOnMobile}>ดูตัวอย่าง</span>
                  <span className={classes.showOnMobile}>ดู</span>
                </button>
                <button 
                  className={classes.cardActionBtn} 
                  title="ดาวน์โหลด"
                  onClick={(e) => handleDownload(e, item)}
                >
                  <FaDownload size={12} />
                  <span className={classes.hideOnMobile}>ดาวน์โหลด</span>
                  <span className={classes.showOnMobile}>โหลด</span>
                </button>
              </div>
            </div>

            <div className={classes.gridContent}>
              <div className={classes.gridTitle}>{item.title}</div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{
                  background: '#f0f7ff',
                  color: '#3F72AF',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {categoryMap[item.category] || item.category}
                </span>
              </div>

              <div className={classes.mobileMeta}>
                <div className={classes.mobileMetaRow}>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    {formattedDate}
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: '#666',
                    fontSize: '0.85rem'
                  }}>
                    <FaDownload size={10} />
                    {item.downloadCount || 0}
                  </span>
                </div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginTop: '8px'
                }}>
                  {item.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag}
                      style={{
                        background: 'rgba(63,114,175,0.08)',
                        color: '#3F72AF',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span style={{
                      background: 'rgba(63,114,175,0.08)',
                      color: '#3F72AF',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListItem = useCallback((item: Resource) => {
    const categoryMap: Record<string, string> = {
      medical: "การแพทย์",
      education: "การศึกษา",
      clinic: "คลินิก",
      campus: "รอบรั้วมหาวิทยาลัย"
    };

    const formattedDate = item.createdAt && new Date(item.createdAt).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      calendar: 'buddhist'
    });

    const typeInfo = getTypeInfo(item.type);
    const TypeIcon = typeInfo.icon;

    return (
      <li 
        key={item.id}
        className={classes.listItem}
        onClick={() => navigate(`/resource/${item.id}`)}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={item.thumbnailUrl || "/no-image.png"}
            alt={item.title}
            className={classes.thumb}
          />
          <div 
            className={`${classes.typeIndicator} ${classes.hideOnMobile}`}
            style={{ 
              background: typeInfo.color,
              color: '#fff'
            }}
          >
            <TypeIcon size={10} />
            {typeInfo.label}
          </div>
        </div>

        <div className={classes.info}>
          <div 
            className={`${classes.typeIndicator} ${classes.showOnMobile}`}
            style={{ 
              background: typeInfo.color,
              color: '#fff'
            }}
          >
            <TypeIcon size={10} />
            {typeInfo.label}
          </div>

          <div className={classes.title} title={item.title}>
            {item.title}
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            marginTop: 12,
            flexWrap: 'wrap'
          }}>
            <span className={classes.categoryLabel}>
              <FaFileAlt size={12} />
              {categoryMap[item.category] || item.category}
            </span>
            <span className={classes.metaInfo}>
              <FaUser size={12} />
              {formattedDate}
            </span>
            <span className={classes.metaInfo}>
              <FaDownload size={12} />
              {item.downloadCount || 0} ครั้ง
            </span>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              flexWrap: 'wrap', 
              marginTop: 12 
            }}>
              {item.tags.slice(0, 3).map((tag: string) => (
                <span 
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(63,114,175,0.06)',
                    border: '1px solid rgba(63,114,175,0.1)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    color: '#3F72AF'
                  }}
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span style={{
                  backgroundColor: 'rgba(63,114,175,0.06)',
                  border: '1px solid rgba(63,114,175,0.1)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  color: '#3F72AF'
                }}>
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className={classes.mobileActionContainer}>
            <button 
              className={classes.cardActionBtn}
              title="ดูตัวอย่าง"
              onClick={(e) => handlePreview(e, item.id)}
            >
              <FaEye size={14} /> ดูตัวอย่าง
            </button>
            <button 
              className={classes.cardActionBtn}
              title="ดาวน์โหลด"
              onClick={(e) => handleDownload(e, item)}
            >
              <FaDownload size={14} /> ดาวน์โหลด
            </button>
          </div>
        </div>
      </li>
    );
  }, [classes, navigate, handlePreview, handleDownload]);

  const renderListView = () => (
    <ul className={classes.list}>
      {pagedResults.length === 0 ? (
        <li className={classes.emptyState}>
          <FaSearch />
          <h3>ไม่พบรายการที่เกี่ยวข้อง</h3>
          <p>ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรอง</p>
        </li>
      ) : (
        pagedResults.map(renderListItem)
      )}
    </ul>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = window.innerWidth < 480 ? 3 : window.innerWidth < 768 ? 5 : 7;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className={classes.pagination}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={classes.pageBtn}
          style={page === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <FaChevronLeft style={{ marginRight: 4 }} />
          <span className={classes.hideOnMobile}>ก่อนหน้า</span>
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              className={classes.pageBtn}
            >
              1
            </button>
            {startPage > 2 && <span style={{ padding: '0 4px', color: '#666' }}>...</span>}
          </>
        )}
        
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={
              classes.pageBtn + (page === pageNum ? " " + classes.pageBtnActive : "")
            }
          >
            {pageNum}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ padding: '0 4px', color: '#666' }}>...</span>}
            <button
              onClick={() => setPage(totalPages)}
              className={classes.pageBtn}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={classes.pageBtn}
          style={page === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <span className={classes.hideOnMobile}>ถัดไป</span>
          <FaChevronRight style={{ marginLeft: 4 }} />
        </button>
      </div>
    );
  };

  const previewModalStyles = previewItem ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: window.innerWidth < 768 ? '0' : '20px',
  } : {};

  const modalContentStyles = {
    backgroundColor: '#fff',
    borderRadius: window.innerWidth < 768 ? '16px 16px 0 0' : '16px',
    width: '100%',
    maxWidth: window.innerWidth < 768 ? '100%' : '900px',
    maxHeight: window.innerWidth < 768 ? '85vh' : '90vh',
    overflow: 'hidden',
    position: 'relative' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    margin: window.innerWidth < 768 ? '0' : '20px',
    animation: window.innerWidth < 768 ? 'slideUp 0.3s ease-out' : 'none',
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @media (max-width: 768px) {
        .mobile-action-buttons {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          padding: 12px 16px;
          border-top: 1px solid #e0e0e0;
          z-index: 1001;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (previewItem && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [previewItem]);

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.loadingOverlay}>
          <div className={classes.loadingSpinner} />
        </div>
      )}

      {error && (
        <div className={classes.errorContainer}>
          <p>{error}</p>
          <button 
            className={classes.errorButton}
            onClick={() => setError(null)}
          >
            ลองใหม่
          </button>
        </div>
      )}

      <div className={classes.mobileHeader}>
        <div className={classes.mobileHeaderTitle}>
          <FaSearch />
          ผลการค้นหา ({results.length})
        </div>
      </div>

      {/* Filter Modal for mobile */}
      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        keyword={keyword}
        setKeyword={setKeyword}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        sort={sort}
        setSort={setSort}
        types={types}
        handleTypeChange={handleTypeChange}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        yearCounts={yearCounts}
        uniqueYears={uniqueYears}
        handleSubmit={handleSubmit}
        resourceTypes={resourceTypes}
      />

      {/* Desktop sidebar*/}
      <div className={classes.sidebarContainer}>
        <div className={classes.sidebar}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <div className={classes.label}>
                <FaSearch />
                คำสำคัญ
              </div>
              <input
                className={classes.searchBox}
                placeholder="หนังสือ, หัวข้อ, ผู้แต่ง ฯลฯ"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className={classes.label}>ค้นหาจาก</div>
              <select
                className={classes.searchBox}
                value={searchBy}
                onChange={e => setSearchBy(e.target.value)}
                style={{ marginBottom: 0 }}
              >
                <option value="title">ชื่อเรื่อง</option>
                <option value="category">หมวดหมู่</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className={classes.label}>เรียงลำดับจาก</div>
              <select
                className={classes.searchBox}
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ marginBottom: 0 }}
              >
                <option value="newest">เรียงตาม: ล่าสุด</option>
                <option value="oldest">เรียงตาม: เก่าสุด</option>
                <option value="az">เรียงตาม: ก-ฮ</option>
                <option value="za">เรียงตาม: ฮ-ก</option>
                <option value="popular">เรียงตาม: ยอดนิยม</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className={classes.label}>ประเภททรัพยากร</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {resourceTypes.map(type => (
                  <label
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: types.includes(type) ? 'rgba(63,114,175,0.1)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={types.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      style={{ accentColor: '#3F72AF' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {type === "image" ? "รูปภาพ" : 
                       type === "video" ? "วิดีโอ" : 
                       type === "graphic" ? "กราฟิก" : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className={classes.label}>ปีที่เผยแพร่</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {uniqueYears.slice(0, 6).map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYears(
                      selectedYears.includes(year)
                        ? selectedYears.filter(y => y !== year)
                        : [...selectedYears, year]
                    )}
                    style={{
                      background: selectedYears.includes(year) ? '#3F72AF' : '#f8f9fa',
                      color: selectedYears.includes(year) ? '#fff' : '#666',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {year} ({yearCounts[year] || 0})
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => {
                setKeyword("");
                setSearchBy("title");
                setSort("newest");
                setTypes(["ทั้งหมด"]);
                setSelectedYears([]);
              }}
              style={{
                background: '#112D4E',
                color: '#fff',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '100%',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              รีเซ็ตตัวกรอง
            </button>
          </form>
        </div>
      </div>

      <main className={classes.main}>
        <div className={classes.resultHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <FaSearch style={{ color: "#3F72AF", flexShrink: 0 }} />
            <span style={{ 
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
              lineHeight: 1.4
            }}>
              {results.length === 0
                ? "ไม่พบรายการที่เกี่ยวข้อง"
                : <>
                    พบข้อมูล <strong>{results.length}</strong> รายการ 
                    {keyword && (
                      <>
                        <br className={classes.showOnMobile} />
                        <span className={classes.hideOnMobile}> | </span>
                        คำค้น: <strong>"{keyword}"</strong>
                      </>
                    )}
                  </>
              }
            </span>
          </div>
          <div className={classes.viewToggle}>
            <button 
              className={`${classes.viewToggleButton} ${
                viewMode === 'list' ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive
              }`}
              onClick={() => setViewMode('list')}
              type="button"
            >
              <FaList size={window.innerWidth < 480 ? 12 : 14} />
              <span>รายการ</span>
            </button>
            <button 
              className={`${classes.viewToggleButton} ${
                viewMode === 'grid' ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive
              }`}
              onClick={() => setViewMode('grid')}
              type="button"
            >
              <FaThLarge size={window.innerWidth < 480 ? 12 : 14} />
              <span>ตาราง</span>
            </button>
          </div>
        </div>

        {viewMode === 'list' ? renderListView() : renderGridView()}
        {renderPagination()}
      </main>

      <button 
        className={classes.mobileFilterButton}
        onClick={() => setIsFilterOpen(true)}
      >
        <FaFilter size={16} />
        ตัวกรอง
      </button>

      {previewItem && (
        <div style={previewModalStyles} onClick={closePreview}>
          <div style={modalContentStyles} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: window.innerWidth < 768 ? '16px' : '20px 24px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 2
            }}>
              <h2 style={{
                fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem',
                fontWeight: 700,
                color: '#112D4E',
                margin: 0,
                paddingRight: '40px',
                lineHeight: 1.4
              }}>
                {previewItem.title}
              </h2>
              <button 
                onClick={closePreview}
                style={{
                  position: 'absolute',
                  top: window.innerWidth < 768 ? '12px' : '16px',
                  right: window.innerWidth < 768 ? '12px' : '16px',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#f8f9fa',
                  border: 'none',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div style={{
              padding: window.innerWidth < 768 ? '16px' : '24px',
              overflowY: 'auto',
              maxHeight: window.innerWidth < 768 ? 'calc(85vh - 140px)' : 'calc(90vh - 140px)'
            }}>
              <img 
                src={previewItem.thumbnailUrl || "/no-image.png"} 
                alt={previewItem.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: window.innerWidth < 768 ? '40vh' : '60vh',
                  objectFit: 'contain',
                  borderRadius: window.innerWidth < 768 ? '6px' : '8px',
                  background: '#f8f9fa'
                }}
              />
              
              <div style={{ marginTop: '20px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#112D4E',
                  marginBottom: '12px'
                }}>
                  รายละเอียด
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 480 ? 'column' : 'row',
                  flexWrap: 'wrap',
                  gap: window.innerWidth < 480 ? '12px' : '16px',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    <FaFileAlt size={14} />
                    หมวดหมู่: {
                      previewItem.category === "medical" ? "การแพทย์" :
                      previewItem.category === "education" ? "การศึกษา" :
                      previewItem.category === "clinic" ? "คลินิก" :
                      previewItem.category === "campus" ? "รอบรั้วมหาวิทยาลัย" :
                      previewItem.category
                    }
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    <FaUser size={14} />
                    ผู้อัพโหลด: {previewItem.uploader || "ไม่ระบุ"}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    <FaDownload size={14} />
                    ดาวน์โหลด: {previewItem.downloadCount || 0} ครั้ง
                  </span>
                </div>

                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: window.innerWidth < 768 ? '60px' : '20px'
                  }}>
                    {previewItem.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        style={{
                          background: 'rgba(63,114,175,0.08)',
                          color: '#3F72AF',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {window.innerWidth < 768 && (
              <div className="mobile-action-buttons">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => navigate(`/resource/${previewItem.id}`)}
                    style={{
                      flex: 1,
                      background: '#3F72AF',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ดูรายละเอียด
                  </button>
                  <button 
                    onClick={(e) => handleDownload(e, previewItem)}
                    style={{
                      flex: 1,
                      background: '#112D4E',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;