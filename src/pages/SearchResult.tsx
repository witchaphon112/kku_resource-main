import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useResources } from "../contexts/ResourceContext";
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
  isCollapsed?: boolean;
}

const useStyles = createUseStyles<string, StyleProps>({
  container: {
    display: "flex",
    margin: "0",
    padding: "40px 48px",
    alignItems: "flex-start",
    position: "relative",
    '@media (max-width: 900px)': { 
      flexDirection: "column",
      padding: "24px 16px",
    },
    '@media (max-width: 480px)': {
      padding: "16px 12px",
    }
  },
  sidebarContainer: {
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: 280,
    marginRight: 36,
    '@media (max-width: 900px)': {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100vh",
      margin: 0,
      padding: "20px",
      background: "rgba(0,0,0,0.5)",
      opacity: ({ isCollapsed }) => isCollapsed ? 0 : 1,
      visibility: ({ isCollapsed }) => isCollapsed ? "hidden" : "visible",
      transform: ({ isCollapsed }) => isCollapsed ? "translateX(-100%)" : "translateX(0)",
      zIndex: 1000,
      pointerEvents: ({ isCollapsed }) => isCollapsed ? "none" : "auto",
    }
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
    '@media (max-width: 900px)': {
      maxWidth: "90%",
      maxHeight: "calc(100vh - 40px)",
      margin: "20px auto",
      borderRadius: 16,
      position: "relative",
      zIndex: 1001,
    }
  },
  toggleButton: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'flex',
      position: 'fixed',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: '#3F72AF',
      border: 'none',
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 99,
      boxShadow: '0 4px 12px rgba(63,114,175,0.3)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '1.3rem',
      '&:hover': {
        background: '#112D4E',
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      }
    }
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    zIndex: 1002,
    transition: 'all 0.2s',
    '&:hover': {
      background: '#e9ecef',
      color: '#333',
    }
  },
  main: {
    flex: 1,
    width: "100%",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 14px rgba(63,114,175,0.08)",
    padding: "2.2rem 1.7rem",
    minHeight: 400,
    '@media (max-width: 900px)': { 
      padding: "1.2rem 1rem",
    },
    '@media (max-width: 480px)': {
      padding: "1rem 0.75rem",
      borderRadius: 12,
    }
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
    fontSize: "1.2rem",
    color: "#3F72AF"
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
    fontSize: "1.2rem",
    color: "#dc3545",
    textAlign: "center",
    padding: "2rem"
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const classes = useStyles({ isCollapsed });
  const query = useQuery();
  const navigate = useNavigate();
  const { resources, loading, error } = useResources();

  // ตัวแปรของ sidebar
  const [keyword, setKeyword] = useState(query.get("q") || "");
  const [logic, setLogic] = useState("AND");
  const [searchBy, setSearchBy] = useState("title");
  const [sort, setSort] = useState("newest");
  const [types, setTypes] = useState(resourceTypes);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const yearCounts = getYearCounts(resources);
  const uniqueYears = getUniqueYears(resources);

  const results = useMemo(() => {
    let filtered = resources || [];
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
  }, [resources, keyword, logic, searchBy, sort, types, selectedYears]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return <div className={classes.loadingContainer}>กำลังโหลด...</div>;
  }

  if (error) {
    return <div className={classes.errorContainer}>เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className={classes.container}>
      <button 
        className={classes.toggleButton} 
        onClick={toggleSidebar}
        aria-label="ตัวกรอง"
      >
        <FaFilter />
      </button>

      <div className={classes.sidebarContainer} onClick={toggleSidebar}>
        <div className={classes.sidebar} onClick={e => e.stopPropagation()}>
          <button 
            className={classes.closeButton}
            onClick={toggleSidebar}
            aria-label="ปิดตัวกรอง"
          >
            <FaTimes />
          </button>
          {/* Your existing sidebar content */}
        </div>
      </div>

      <main className={classes.main}>
        {/* Your existing main content */}
      </main>
    </div>
  );
};

export default SearchResult; 