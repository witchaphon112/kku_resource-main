import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
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
  FaDownload
} from "react-icons/fa";

type ViewMode = 'list' | 'grid';

interface StyleProps {
  isCollapsed: boolean;
  viewMode: ViewMode;
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    margin: "0",
    padding: "40px 48px",
    alignItems: "flex-start",
    '@media (max-width: 900px)': { 
      flexDirection: "column",
      padding: "24px 16px",
    },
    '@media (max-width: 480px)': {
      padding: "16px 12px",
    }
  },
  sidebar: {
    width: 280,
    background: "#fffdfa",
    borderRadius: 14,
    padding: "1.2rem",
    boxShadow: "0 6px 24px rgba(63,114,175,0.1)",
    fontFamily: "var(--bs-font-primary)",
    fontSize: "0.95rem",
    minHeight: 540,
    position: "sticky",
    top: 32,
    border: "1.5px solid #DBE2EF",
    marginRight: 36,
    '@media (max-width: 900px)': {
      width: "100%",
      marginRight: 0,
      marginBottom: 24,
      position: "relative",
      top: 0,
      minHeight: "auto",
      padding: "1rem",
    },
    '@media (max-width: 480px)': {
      padding: "0.75rem",
      marginBottom: 16,
      fontSize: "0.9rem",
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
    '@media (max-width: 900px)': { 
      padding: "1.2rem 1rem" 
    },
    '@media (max-width: 480px)': {
      padding: "1rem 0.75rem",
      borderRadius: 12,
    }
  },
  viewToggle: {
    display: 'flex',
    gap: 8,
    marginLeft: 'auto',
    '@media (max-width: 480px)': {
      gap: 4,
    }
  },
  viewToggleButton: {
    background: 'transparent',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '@media (max-width: 480px)': {
      padding: '4px 8px',
      fontSize: 12,
      gap: 4,
    }
  },
  viewToggleButtonActive: {
    color: '#fff',
    backgroundColor: '#3F72AF',
    '&:hover': {
      backgroundColor: '#112D4E',
    }
  },
  viewToggleButtonInactive: {
    color: '#3F72AF',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '#DBE2EF',
    }
  },
  sidebarContainer: {
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: 280,
    marginRight: 36,
    zIndex: 100,
    '@media (max-width: 900px)': {
      width: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      padding: "20px",
      transform: "translateX(0)",
      marginRight: 0,
    }
  },
  sidebarCollapsed: {
    width: 0,
    marginRight: 0,
    opacity: 0.6,
    '@media (max-width: 900px)': {
      transform: "translateX(-100%)",
      background: "transparent",
      pointerEvents: "none",
    }
  },
  toggleButton: {
    position: 'absolute',
    right: -42,
    top: 20,
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#3F72AF',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(63,114,175,0.2)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: '#112D4E',
      transform: 'scale(1.1)',
    },
    '@media (max-width: 900px)': {
      right: 20,
      top: 20,
      position: 'fixed',
      background: '#3F72AF',
    }
  },
  sidebarContent: {
    opacity: 1,
    visibility: 'visible',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    transform: 'translateX(0)',
  },
  sidebarContentCollapsed: {
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateX(-20px)',
    pointerEvents: 'none',
  },
  collapsedIcon: {
    padding: '10px',
    color: '#3F72AF',
    fontSize: '20px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: isCollapsed => isCollapsed ? 1 : 0,
    transition: 'opacity 0.2s',
  },
  mobileOverlay: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      opacity: isCollapsed => isCollapsed ? 0 : 1,
      visibility: isCollapsed => isCollapsed ? 'hidden' : 'visible',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 90,
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
  radioGroup: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 8,
    background: "#F9F7F7",
    padding: "8px 10px",
    borderRadius: 10,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    gap: 5,
    cursor: "pointer",
    fontSize: 13,
    borderRadius: 8,
    padding: "3px 10px 3px 3px",
    transition: "background 0.15s, color 0.15s",
    color: "#3F72AF",
    "&:hover": { 
      background: "#DBE2EF", 
      color: "#112D4E" 
    },
  },
  radioInput: {
    accentColor: "#3F72AF",
    width: 16, 
    height: 16, 
    marginRight: 5,
    boxShadow: "0 1px 4px rgba(63,114,175,0.12)",
    borderRadius: 8,
    background: "#fff",
    border: "1.2px solid #3F72AF",
    transition: "box-shadow 0.15s",
  },
  select: {
    width: "100%",
    padding: "0.6rem 0.8rem",
    borderRadius: 8,
    border: "1.2px solid #DBE2EF",
    fontSize: 13,
    background: "#fff",
    outline: "none",
    marginBottom: 10,
    color: "#3F72AF",
    fontWeight: 600,
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
    transition: "border 0.18s, box-shadow 0.18s",
    "&:focus": { 
      border: "1.2px solid #3F72AF", 
      boxShadow: "0 2px 12px rgba(63,114,175,0.12)" 
    },
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 8,
    background: "#F9F7F7",
    padding: "10px 10px 8px 10px",
    borderRadius: 10,
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
  },
  checkboxLabel: {
    display: "flex", 
    alignItems: "center", 
    gap: 6,
    fontWeight: 700, 
    cursor: "pointer",
    borderRadius: 6, 
    padding: "4px 0 4px 4px",
    fontSize: 13,
    transition: "background 0.15s, color 0.15s",
    color: "#3F72AF",
    "&:hover": { 
      background: "#DBE2EF", 
      color: "#112D4E" 
    },
  },
  checkboxInput: {
    accentColor: "#3F72AF",
    width: 15, 
    height: 15, 
    marginRight: 6,
    boxShadow: "0 1px 4px rgba(63,114,175,0.12)",
    borderRadius: 5,
    background: "#fff",
    border: "1.2px solid #3F72AF",
    transition: "box-shadow 0.15s",
  },
  button: {
    background: "#112d4e",
    color: "#fff",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 800,
    padding: "10px 0",
    marginTop: 12,
    width: "100%",
    border: "none",
    boxShadow: "0 2px 12px rgba(63,114,175,0.2)",
    cursor: "pointer",
    letterSpacing: 0.5,
    transition: "background 0.18s, box-shadow 0.18s",
    "&:hover": { 
      background: "#3F72AF", 
      boxShadow: "0 4px 14px rgba(63,114,175,0.3)" 
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
    gap: 10,
    padding: "13px 16px",
    background: "#F9F7F7",
    borderRadius: 12,
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none"
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
    transition: "box-shadow 0.18s, background 0.18s, transform 0.15s",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      background: "#F9F7F7",
      boxShadow: "0 6px 18px rgba(63,114,175,0.15)",
      transform: "scale(1.012)"
    }
  },
  index: {
    minWidth: 32,
    color: "#112D4E",
    fontWeight: 800,
    fontSize: "1.08rem",
    textAlign: "right",
    marginTop: 6,
  },
  thumb: {
    width: 150,
    height: 150,
    marginBottom: 8,
    objectFit: "cover",
    borderRadius: 10,
    background: "#f8f8f8",
    border: "1.2px solid #DBE2EF",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  title: {
    fontWeight: 900,
    fontSize: "1.09rem",
    color: "#112D4E",
    marginBottom: 5,
    cursor: "pointer",
    "&:hover": { 
      textDecoration: "underline", 
      color: "#3F72AF" 
    },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 450,
    letterSpacing: 0.1
  },
  desc: {
    fontSize: "0.97rem",
    color: "#666",
    marginBottom: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 440
  },
  meta: {
    fontSize: "0.97rem",
    color: "#3F72AF",
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  typeTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#DBE2EF",
    color: "#112D4E",
    borderRadius: 8,
    padding: "3px 12px",
    fontWeight: 700,
    marginRight: 8,
    fontSize: 13,
  },
  catTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#F9F7F7",
    color: "#3F72AF",
    borderRadius: 8,
    padding: "3px 12px",
    fontWeight: 700,
    fontSize: 13,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 28,
    gap: 7
  },
  pageBtn: {
    padding: "8px 15px",
    borderRadius: 14,
    border: "1.2px solid #DBE2EF",
    background: "#fff",
    color: "#3F72AF",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.19s, color 0.19s, box-shadow 0.12s",
    boxShadow: "0 1.5px 8px rgba(63,114,175,0.08)",
    "&:hover": { 
      background: "#3F72AF", 
      color: "#fff" 
    }
  },
  pageBtnActive: {
    background: "#112D4E",
    color: "#fff",
    border: "1.2px solid #112D4E",
    boxShadow: "0 3px 10px rgba(63,114,175,0.2)"
  },
  gridView: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.8rem",
    margin: "20px 0",
  },
  gridItem: {
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
      "& $gridThumb img": {
        transform: "scale(1.05)",
      },
      "& $cardActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  gridThumb: {
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
  gridContent: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  gridTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.4,
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  },
  gridMeta: {
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
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #DBE2EF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      color: '#112D4E',
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
  },
  previewInfo: {
    marginTop: '20px',
    '& h3': {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#112D4E',
      marginBottom: '12px',
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
      gap: '6px',
      color: '#666',
      fontSize: '0.95rem',
    },
  },
  searchResults: {
    display: "grid",
    gap: "1.5rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    '@media (max-width: 768px)': {
      gap: "1rem",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    },
    '@media (max-width: 480px)': {
      gap: "0.75rem",
      gridTemplateColumns: "1fr",
    }
  }
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const resourceTypes = [
  "ทั้งหมด",
  "รูปภาพ",
  "วิดีโอ",
  "กราฟิก"
];

const ITEMS_PER_PAGE = 20;

const getYearCounts = (resources: { createdAt: string }[]) => {
  const counts: Record<string, number> = {};
  resources.forEach(item => {
    const year = (new Date(item.createdAt).getFullYear() + 543).toString();
    counts[year] = (counts[year] || 0) + 1;
  });
  return counts;
};

const getUniqueYears = (resources: { createdAt: string }[]) => {
  const years = resources.map(item => (new Date(item.createdAt).getFullYear() + 543).toString());
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
};

const SearchResult = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const classes = useStyles();
  const query = useQuery();
  const navigate = useNavigate();

  // ตัวแปรของ sidebar
  const [keyword, setKeyword] = useState(query.get("q") || "");
  const [logic, setLogic] = useState("AND");
  const [searchBy, setSearchBy] = useState("title");
  const [sort, setSort] = useState("newest");
  const [types, setTypes] = useState(resourceTypes);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  const yearCounts = getYearCounts(resourcesData.resources);
  const uniqueYears = getUniqueYears(resourcesData.resources);

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
      filtered = filtered.filter(item => types.includes(item.type));
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [previewItem, setPreviewItem] = useState<any>(null);

  const handlePreview = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = resourcesData.resources.find(r => r.id === itemId);
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleDownload = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
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
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const renderGridView = () => (
    <div className={classes.gridView}>
      {pagedResults.map((item) => (
        <div className={classes.gridItem} key={item.id} onClick={() => navigate(`/resource/${item.id}`)}>
          <div className={classes.gridThumb}>
            <img
              src={item.thumbnailUrl || "/no-image.png"}
              alt={item.title}
              loading="lazy"
            />
            <div className={classes.cardActionBar}>
              <button 
                className={classes.cardActionBtn} 
                title="ดูตัวอย่าง"
                onClick={(e) => handlePreview(e, item.id)}
              >
                <FaEye />
              </button>
              <button 
                className={classes.cardActionBtn} 
                title="ดาวน์โหลด"
                onClick={(e) => handleDownload(e, item)}
              >
                <FaDownload />
              </button>
            </div>
          </div>
          <div className={classes.gridContent}>
            <div className={classes.gridTitle}>{item.title}</div>
            <div className={classes.gridMeta}>
              <span>
                {item.category === "medical" && "การแพทย์"}
                {item.category === "education" && "การศึกษา"}
                {item.category === "clinic" && "คลินิก"}
                {item.category === "campus" && "รอบรั้วมหาวิทยาลัย"}
              </span>
              <span>
                {item.createdAt && new Date(item.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  calendar: 'buddhist'
                })}
              </span>
              <span>
                ดาวน์โหลด: {item.downloadCount || 0}
              </span>
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
      ))}
    </div>
  );

  const renderListView = () => (
    <ul className={classes.list}>
      {pagedResults.length === 0 && (
        <li style={{ fontSize: 18, color: "#112D4E", margin: 18 }}>
          ไม่พบรายการที่เกี่ยวข้อง
        </li>
      )}
      {pagedResults.map((item, idx) => (
        <li className={classes.listItem} key={item.id} onClick={() => navigate(`/resource/${item.id}`)}>
          <img
            src={item.thumbnailUrl || "/no-image.png"}
            alt={item.title}
            className={classes.thumb}
          />
          <div className={classes.info}>
            <div className={classes.title} title={item.title}>
              {item.title}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              marginTop: 8,
              color: '#666',
              fontSize: '0.9rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.category === "medical" && "การแพทย์"}
                {item.category === "education" && "การศึกษา"}
                {item.category === "clinic" && "คลินิก"}
                {item.category === "campus" && "รอบรั้วมหาวิทยาลัย"}
              </span>
              <span>
                {item.createdAt && new Date(item.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  calendar: 'buddhist'
                })}
              </span>
              <span>
                ดาวน์โหลด: {item.downloadCount || 0}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {item.tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} className={classes.catTag}>{tag}</span>
              ))}
              {item.tags && item.tags.length > 3 && (
                <span className={classes.catTag}>+{item.tags.length - 3}</span>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              marginTop: 12,
              justifyContent: 'flex-end'
            }}>
              <button 
                className={classes.cardActionBtn} 
                title="ดูตัวอย่าง"
                onClick={(e) => handlePreview(e, item.id)}
              >
                <FaEye /> ดูตัวอย่าง
              </button>
              <button 
                className={classes.cardActionBtn} 
                title="ดาวน์โหลด"
                onClick={(e) => handleDownload(e, item)}
              >
                <FaDownload /> ดาวน์โหลด
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={classes.container}>
      <div className={`${classes.sidebarContainer} ${isCollapsed ? classes.sidebarCollapsed : ''}`}>
        
        <aside className={classes.sidebar}>
          <div className={`${classes.sidebarContent} ${isCollapsed ? classes.sidebarContentCollapsed : ''}`}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className={classes.label}>คำสำคัญ</div>
              <input
                className={classes.searchBox}
                placeholder="หนังสือ, หัวข้อ, ผู้แต่ง ฯลฯ"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />

              <div className={classes.label}>ค้นหาจาก</div>
              <div className={classes.radioGroup}>
                <label className={classes.radioLabel}>
                  <input
                    type="radio"
                    name="searchBy"
                    value="title"
                    checked={searchBy === "title"}
                    onChange={() => setSearchBy("title")}
                    className={classes.radioInput}
                  />
                  ชื่อเรื่อง
                </label>
              </div>

              <div className={classes.label}>เรียงลำดับจาก</div>
              <select
                className={classes.select}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="newest">เรียงตาม: ล่าสุด</option>
                <option value="oldest">เรียงตาม: เก่าสุด</option>
                <option value="az">เรียงตาม: ก-ฮ</option>
                <option value="za">เรียงตาม: ฮ-ก</option>
                <option value="popular">เรียงตาม: ยอดนิยม</option>
              </select>

              <div className={classes.label}>ประเภททรัพยากร</div>
              <div className={classes.checkboxGroup}>
                {resourceTypes.map(type => (
                  <label key={type} className={classes.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={types.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      className={classes.checkboxInput}
                    />
                    {type === "image" ? "รูปภาพ" : 
                     type === "video" ? "วิดีโอ" : 
                     type === "graphic" ? "กราฟิก" : type}
                  </label>
                ))}
              </div>

              <div className={classes.label}>ปีที่เผยแพร่</div>
              <div className={classes.checkboxGroup} style={{ maxHeight: 260, overflowY: 'auto' }}>
                {uniqueYears.map(year => (
                  <label key={year} className={classes.checkboxLabel} style={{ justifyContent: 'space-between' }}>
                    <span>
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={() => setSelectedYears(selectedYears.includes(year)
                          ? selectedYears.filter(y => y !== year)
                          : [...selectedYears, year])}
                        className={classes.checkboxInput}
                      />
                      {year}
                    </span>
                    <span style={{ color: '#222', fontWeight: 500, fontSize: 15, marginLeft: 8 }}>
                      ({yearCounts[year] || 0})
                    </span>
                  </label>
                ))}
              </div>

              <button type="submit" className={classes.button}>
                ค้นหาขั้นสูง
              </button>
            </form>
          </div>
          <div className={classes.collapsedIcon}>
            <FaFilter />
          </div>
        </aside>
      </div>
      <div className={classes.mobileOverlay} onClick={toggleSidebar} />
      <main className={classes.main}>
        <div className={classes.resultHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaSearch style={{ color: "#1565c0" }} />
            {results.length === 0
              ? "ไม่พบรายการที่เกี่ยวข้อง"
              : <>พบข้อมูลทั้งหมด {results.length} รายการ {keyword && <>| คำค้น: <b>{keyword}</b></>}</>}
          </div>
          <div className={classes.viewToggle}>
            <button 
              className={`${classes.viewToggleButton} ${
                viewMode === 'list' ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive
              }`}
              onClick={() => setViewMode('list')}
              type="button"
              aria-label="แสดงแบบรายการ"
            >
              <FaList size={14} /> รายการ
            </button>
            <button 
              className={`${classes.viewToggleButton} ${
                viewMode === 'grid' ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive
              }`}
              onClick={() => setViewMode('grid')}
              type="button"
              aria-label="แสดงแบบตาราง"
            >
              <FaThLarge size={14} /> ตาราง
            </button>
          </div>
        </div>
        {viewMode === 'list' ? renderListView() : renderGridView()}
        {totalPages > 1 && (
          <div className={classes.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={classes.pageBtn}
              style={page === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <FaChevronLeft style={{ marginRight: 4 }} />
              ก่อนหน้า
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={
                  classes.pageBtn + (page === i + 1 ? " " + classes.pageBtnActive : "")
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={classes.pageBtn}
              style={page === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              ถัดไป
              <FaChevronRight style={{ marginLeft: 4 }} />
            </button>
          </div>
        )}
      </main>
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
                src={previewItem.thumbnailUrl || "/no-image.png"} 
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
