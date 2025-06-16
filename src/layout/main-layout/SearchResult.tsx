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
  FaImage,
  FaHeart,
  FaBookmark
} from "react-icons/fa";
import { IoHeart, IoHeartOutline, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import FilterModal from './FilterModal';
import { useBookmarks } from "../../contexts/BookmarkContext";
import { useAuth } from "../../contexts/AuthContext";

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

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
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
      right: '24px',
      zIndex: 90,
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(45deg, #3F72AF, #112D4E)',
      color: '#fff',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '100px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 6px 16px rgba(17,45,78,0.15)',
      '&:active': {
        transform: 'scale(0.96)',
        boxShadow: '0 4px 12px rgba(17,45,78,0.12)',
      },
      '@supports (padding-bottom: env(safe-area-inset-bottom))': {
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
      }
    }
  },

  viewToggle: {
    display: 'flex',
    gap: 8,
    marginLeft: 'auto',
    background: '#fff',
    borderRadius: '12px',
    padding: '6px',
    border: '1px solid rgba(219,226,239,0.6)',
    boxShadow: '0 2px 8px rgba(17,45,78,0.05)',
    '@media (max-width: 768px)': {
      gap: 4,
      padding: '4px',
    },
    '@media (max-width: 480px)': {
      width: '100%',
      marginLeft: 0,
      marginTop: '12px',
    }
  },

  viewToggleButton: {
    background: 'transparent',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '@media (max-width: 768px)': {
      padding: '8px 12px',
      fontSize: 14,
      gap: 6,
    },
    '@media (max-width: 480px)': {
      flex: 1,
      justifyContent: 'center',
      padding: '10px 8px',
      fontSize: 13,
    }
  },

  viewToggleButtonActive: {
    color: '#fff',
    backgroundColor: '#3F72AF',
    boxShadow: '0 2px 8px rgba(63,114,175,0.2)',
    '&:hover': {
      backgroundColor: '#112D4E',
    }
  },

  viewToggleButtonInactive: {
    color: '#3F72AF',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(63,114,175,0.08)',
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
    fontWeight: 800,
    fontSize: 24,
    marginBottom: 24,
    color: "#112D4E",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "20px 24px",
    background: "linear-gradient(to right, #F9F7F7, #F8F9FA)",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(17,45,78,0.05)",
    border: "1px solid rgba(219,226,239,0.6)",
    '@media (max-width: 1024px)': {
      fontSize: 22,
      padding: "18px 20px",
    },
    '@media (max-width: 768px)': {
      fontSize: 20,
      padding: "16px 18px",
      flexDirection: "column",
      gap: 14,
      alignItems: "flex-start",
    },
    '@media (max-width: 480px)': {
      fontSize: 18,
      padding: "14px 16px",
      marginBottom: 16,
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
    gap: 24,
    borderRadius: 16,
    marginBottom: 24,
    background: "#fff",
    boxShadow: "0 4px 20px rgba(17,45,78,0.05)",
    padding: "1.5rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(219,226,239,0.6)",
    '@media (max-width: 1024px)': {
      padding: "1.2rem",
      gap: 20,
    },
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: 16,
      padding: "1rem",
      marginBottom: 16,
      borderRadius: 12,
    },
    '@media (max-width: 480px)': {
      padding: "0.9rem",
      gap: 12,
      borderRadius: 10,
    },
    "&:hover": {
      background: "#F9F7F7",
      boxShadow: "0 12px 24px rgba(17,45,78,0.08)",
      transform: "translateY(-4px)",
      '@media (max-width: 768px)': {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(17,45,78,0.06)",
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
    width: 180,
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    background: "linear-gradient(45deg, #f8f9fa, #e9ecef)",
    border: "1px solid rgba(219,226,239,0.6)",
    boxShadow: "0 4px 12px rgba(17,45,78,0.05)",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    '@media (max-width: 1024px)': {
      width: 150,
      height: 150,
    },
    '@media (max-width: 768px)': {
      width: "100%",
      height: 220,
      borderRadius: 10,
    },
    '@media (max-width: 480px)': {
      height: 200,
      borderRadius: 8,
    }
  },

  info: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    '@media (max-width: 768px)': {
      width: "100%",
      gap: 10,
    }
  },

  title: {
    fontWeight: 800,
    fontSize: "1.2rem",
    color: "#112D4E",
    marginBottom: 12,
    cursor: "pointer",
    lineHeight: 1.5,
    letterSpacing: "-0.01em",
    "&:hover": { 
      color: "#3F72AF",
      textDecoration: "none",
    },
    '@media (max-width: 1024px)': {
      fontSize: "1.1rem",
      marginBottom: 10,
    },
    '@media (max-width: 768px)': {
      fontSize: "1.05rem",
      marginBottom: 8,
    },
    '@media (max-width: 480px)': {
      fontSize: "1rem",
    }
  },

  gridView: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.2rem",
    margin: "20px 0",
    '@media (max-width: 1200px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "1.1rem",
    },
    '@media (max-width: 1024px)': {
      gridTemplateColumns: "repeat(2, 1fr)", 
      gap: "1rem",
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0.8rem",
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
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(17,45,78,0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(219,226,239,0.6)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    '&:hover': {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 24px rgba(17,45,78,0.08)",
      '& img': {
        transform: "scale(1.08)",
      }
    },
    '@media (max-width: 768px)': {
      borderRadius: "12px",
      '&:hover': {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(17,45,78,0.06)",
      }
    }
  },

  gridThumb: {
    position: "relative",
    width: "100%",
    paddingTop: "66.67%", // 3:2 aspect ratio
    background: "linear-gradient(45deg, #f8f9fa, #e9ecef)",
    overflow: "hidden",
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },

  cardActionBar: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    display: "flex",
    gap: "8px",
    zIndex: 3,
    '@media (max-width: 768px)': {
      position: "static",
      justifyContent: "center",
      padding: "12px 0 4px 0",
      marginTop: "auto",
      background: "transparent",
      gap: "10px",
    }
  },

  cardActionBtn: {
    background: "rgba(255,255,255,0.98)",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    color: "#3F72AF",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    '@media (max-width: 768px)': {
      flex: 1,
      justifyContent: "center",
      padding: "10px 14px",
      fontSize: "0.9rem",
      background: "#fff",
      borderRadius: "10px",
      border: "1px solid #e0e0e0",
    },
    "&:hover": {
      background: "#3F72AF",
      color: "#fff",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(63,114,175,0.2)",
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
    flex: 1
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
    marginBottom: "4px"
  },

  gridMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#666",
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px solid #f0f0f0"
  },

  gridStats: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "4px"
    }
  },

  gridCategory: {
    background: "rgba(63,114,175,0.08)",
    color: "#3F72AF",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
    alignSelf: "flex-start"
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
      gap: '12px',
      padding: '12px 0',
      borderTop: '1px solid rgba(219,226,239,0.4)',
      marginTop: '12px',
    }
  },

  mobileMetaRow: {
    '@media (max-width: 768px)': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#666',
      '& > span': {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }
    }
  },

  typeIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      alignSelf: 'flex-start',
      marginBottom: '8px',
      fontSize: '0.7rem',
    }
  },

  loadingCard: {
    background: 'linear-gradient(110deg, #f5f6f7 8%, #fff 18%, #f5f6f7 33%)',
    borderRadius: '12px',
    padding: '20px',
    animation: '$shimmer 1.5s linear infinite',
    backgroundSize: '200% 100%',
    boxShadow: '0 4px 20px rgba(17,45,78,0.05)',
    border: '1px solid rgba(219,226,239,0.6)',
  },

  '@keyframes shimmer': {
    to: {
      backgroundPosition: '-200% 0',
    }
  },

  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#666',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(17,45,78,0.05)',
    border: '1px solid rgba(219,226,239,0.6)',
    '@media (max-width: 768px)': {
      padding: '36px 20px',
    },
    '& svg': {
      fontSize: '3.5rem',
      marginBottom: '20px',
      color: '#3F72AF',
      opacity: 0.2,
    },
    '& h3': {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#112D4E',
      margin: '0 0 12px 0',
      '@media (max-width: 768px)': {
        fontSize: '1.2rem',
      }
    },
    '& p': {
      fontSize: '1rem',
      margin: 0,
      color: '#666',
      lineHeight: 1.6,
      '@media (max-width: 768px)': {
        fontSize: '0.95rem',
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
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    animation: '$fadeIn 0.3s ease'
  },

  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(63,114,175,0.1)',
    borderTop: '3px solid #3F72AF',
    borderRadius: '50%',
    animation: '$spin 1s linear infinite',
    boxShadow: '0 4px 12px rgba(63,114,175,0.1)'
  },

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },

  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },

  errorContainer: {
    padding: '24px',
    margin: '24px 0',
    background: '#fff',
    border: '1px solid rgba(231,76,60,0.2)',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#e74c3c',
    boxShadow: '0 4px 20px rgba(231,76,60,0.05)',
    animation: '$fadeIn 0.3s ease'
  },

  errorButton: {
    marginTop: '16px',
    padding: '10px 20px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(231,76,60,0.2)',
    '&:hover': {
      background: '#c0392b',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(231,76,60,0.3)',
    }
  },

  categoryLabel: {
    backgroundColor: "rgba(63,114,175,0.08)",
    padding: "6px 14px",
    borderRadius: "20px",
    color: "#3F72AF",
    fontSize: "0.9rem",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    border: "1px solid rgba(63,114,175,0.12)",
    "&:hover": {
      backgroundColor: "rgba(63,114,175,0.12)",
    }
  },

  metaInfo: {
    color: "#666",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#3F72AF"
    }
  },

  actionButtons: {
    position: 'absolute',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 3,
  },

  topActions: {
    top: '12px',
  },

  bottomActions: {
    bottom: '12px',
  },

  actionButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: 'none',
    borderRadius: '50%',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      background: '#fff',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
    '&.active': {
      color: '#0066cc',
    },
    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }
    }
  },

  downloadButton: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: 'none',
    borderRadius: '20px',
    color: '#666',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    zIndex: 3,
    '&:hover': {
      background: '#fff',
      transform: 'scale(1.02)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }
    }
  },

  card: {
    position: 'relative',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    }
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
    backgroundColor: '#f5f5f5',
  },

  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  cardContent: {
    padding: '16px',
  },

  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(63,114,175,0.06)',
    color: '#3F72AF',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginRight: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(63,114,175,0.1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(63,114,175,0.1)',
      transform: 'translateY(-1px)',
    }
  },

  stats: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    color: '#666',
    fontSize: '0.875rem',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(219,226,239,0.4)',
    '@media (max-width: 768px)': {
      gap: '12px',
      marginTop: '12px',
      paddingTop: '12px',
    }
  },

  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      color: '#3F72AF'
    }
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

  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { user } = useAuth();

  useEffect(() => {
    const savedLikes = localStorage.getItem('likes');
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
  }, [likes]);

  const handleLike = (e: React.MouseEvent, item: Resource) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setLikes(prev => ({
      ...prev,
      [item.id]: !prev[item.id]
    }));

    setLikeCounts(prev => ({
      ...prev,
      [item.id]: prev[item.id] ? (prev[item.id] || 0) - 1 : (prev[item.id] || 0) + 1
    }));
  };

  const handleBookmark = (e: React.MouseEvent, item: Resource) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (bookmarks.some(bookmark => bookmark.id === item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.thumbnailUrl,
        fileUrl: item.fileUrl,
        type: item.type,
        category: item.category,
        createdAt: item.createdAt,
        tags: item.tags
      });
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

        return (
          <div 
            className={classes.card} 
            key={item.id} 
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <div className={classes.imageContainer}>
              <img
                src={item.thumbnailUrl || "/no-image.png"}
                alt={item.title}
                className={classes.thumbnail}
              />
              
              <button 
                className={classes.downloadButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(e, item);
                }}
                title="ดาวน์โหลด"
              >
                <FaDownload size={16} />
                ดาวน์โหลด
              </button>

              <div className={`${classes.actionButtons} ${classes.bottomActions}`}>
                <button
                  className={`${classes.actionButton} ${!user ? 'disabled' : ''} ${likes[item.id] ? 'active' : ''}`}
                  onClick={(e) => handleLike(e, item)}
                  title={user ? (likes[item.id] ? "เลิกถูกใจ" : "ถูกใจ") : "กรุณาเข้าสู่ระบบเพื่อถูกใจ"}
                >
                  {likes[item.id] ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
                </button>
                <button
                  className={`${classes.actionButton} ${!user ? 'disabled' : ''} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
                  onClick={(e) => handleBookmark(e, item)}
                  title={user ? "บุ๊คมาร์ค" : "กรุณาเข้าสู่ระบบเพื่อบุ๊คมาร์ค"}
                >
                  {bookmarks.some(bookmark => bookmark.id === item.id) ? 
                    <IoBookmark size={18} /> : 
                    <IoBookmarkOutline size={18} />
                  }
                </button>
              </div>
            </div>

            <div className={classes.cardContent}>
              <h3 className={classes.title}>{item.title}</h3>
              <div style={{ marginBottom: '12px' }}>
                {item.tags?.map((tag, index) => (
                  <span key={index} className={classes.tag}>{tag}</span>
                ))}
              </div>
              <div className={classes.metadata}>
                <span className={classes.categoryLabel}>
                  <FaFileAlt size={12} />
                  {categoryMap[item.category] || item.category}
                </span>
                <span className={classes.metaInfo}>
                  <FaUser size={12} />
                  {item.createdAt && new Date(item.createdAt).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    calendar: 'buddhist'
                  })}
                </span>
                <span className={classes.metaInfo}>
                  <FaDownload size={12} />
                  {item.downloadCount || 0} ครั้ง
                </span>
              </div>
              <div className={classes.stats}>
                <div className={classes.statItem}>
                  <FaEye size={14} />
                  <span>{formatNumber(item.viewCount || 0)}</span>
                </div>
                <div className={classes.statItem}>
                  <IoHeartOutline size={14} />
                  <span>{formatNumber(likeCounts[item.id] || 0)}</span>
                </div>
              </div>
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
            <span className={classes.metaInfo}>
              <IoHeart size={12} style={{ color: likes[item.id] ? '#e74c3c' : '#666' }} />
              {likeCounts[item.id] || 0} ถูกใจ
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
            <button
              className={`${classes.cardActionBtn} ${!user ? 'disabled' : ''}`}
              onClick={(e) => handleLike(e, item)}
              title={user ? (likes[item.id] ? "เลิกถูกใจ" : "ถูกใจ") : "กรุณาเข้าสู่ระบบเพื่อถูกใจ"}
            >
              {likes[item.id] ? <IoHeart size={14} /> : <IoHeartOutline size={14} />}
              {likes[item.id] ? "เลิกถูกใจ" : "ถูกใจ"}
            </button>
            <button
              className={`${classes.cardActionBtn} ${!user ? 'disabled' : ''}`}
              onClick={(e) => handleBookmark(e, item)}
              title={user ? "บุ๊คมาร์ค" : "กรุณาเข้าสู่ระบบเพื่อบุ๊คมาร์ค"}
            >
              {bookmarks.some(bookmark => bookmark.id === item.id) ? 
                <IoBookmark size={14} /> : 
                <IoBookmarkOutline size={14} />
              }
              บุ๊คมาร์ค
            </button>
          </div>
        </div>
      </li>
    );
  }, [classes, navigate, handlePreview, handleDownload, handleLike, handleBookmark, likes, likeCounts, bookmarks, user]);

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
                    {previewItem.downloadCount || 0} ครั้ง
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