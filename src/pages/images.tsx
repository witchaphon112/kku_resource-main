import React, { useState, useMemo, useEffect, useCallback, JSX, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaRegBookmark, FaDownload, FaEye, FaFilter, FaSpinner, FaTimes, FaUser, FaFileAlt, FaImage, FaSort, FaCheck, FaList, FaTrophy, FaFolder, FaCode, FaGlobe, FaUndo, FaChevronDown, FaChevronLeft, FaChevronRight, FaTags, FaRegHeart, FaPalette, FaClock } from "react-icons/fa";
import { BiFilterAlt } from 'react-icons/bi';
import { MdFilterList, MdFilterAlt } from 'react-icons/md';
import { IoEye, IoHeart, IoList, IoFilterOutline, IoTimeSharp } from "react-icons/io5";
import resourcesData from "../mock/resources.json";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import FilterModal from '../components/FilterModal';

const useStyles = createUseStyles({
  "@keyframes fadeIn": {
    from: { 
      opacity: 0,
      transform: "translateY(20px)"
    },
    to: { 
      opacity: 1,
      transform: "translateY(0)"
    }
  },
  "@keyframes shimmerAnimation": {
    "0%": {
      backgroundPosition: "-1000px 0"
    },
    "100%": {
      backgroundPosition: "1000px 0"
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "1rem 0",
    marginBottom: "1rem",
    marginTop: "1rem",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "0.8rem",
    }
  },
  topControls: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  toggleFiltersBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "100px",
    color: "#333",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    "&:hover": {
      borderColor: "#3F72AF",
      color: "#3F72AF",
      background: "#f8faff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(63,114,175,0.08)",
    },
    "& i": {
      fontSize: "0.9rem",
      color: "inherit",
    }
  },
  contentWrap: {
    display: "flex",
    gap: "2rem",
    position: "relative",
  },
  sidebar: {
    width: "280px",
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 20,
  },
  sidebarTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#2C3E50",
    marginBottom: "16px",
  },
  filterList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  filterItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#f0f7ff",
    },
    "&.active": {
      background: "#3F72AF",
      color: "white",
    },
    "& svg": {
      marginRight: "12px",
      fontSize: "1.1rem",
    }
  },
  main: {
    flex: 1,
    minWidth: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    padding: "24px",
    "@media (max-width: 1400px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 767px)": {
      gridTemplateColumns: "1fr",
      gap: "16px",
      padding: "16px",
    }
  },
  card: {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      "& $cardImageBox": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      },
      "& $cardTitle": {
        opacity: 1,
        transform: "translateY(0)",
      },
      "& $cardActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  cardImageBox: {
    width: "100%",
    aspectRatio: "1/0.9",
    position: "relative",
    overflow: "hidden",
    background: "#f8f9fa",
    borderRadius: "20px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },
  cardInfo: {
    padding: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    "& .avatar": {
      width: "24px",  
      height: "24px", 
      borderRadius: "50%",
      overflow: "hidden",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    },
    "& .name": {
      fontSize: "0.8rem",  // ลดขนาดตัวอักษรลงด้วย
      color: "#334155",
      fontWeight: "500",
    }
  },
  stats: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#64748b",
      fontSize: "0.875rem",
      "& svg": {
        fontSize: "0.9rem",
      }
    }
  },
  teamBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(255,255,255,0.9)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    color: "#1e293b",
    backdropFilter: "blur(4px)",
    fontWeight: "500",
  },
  cardTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "32px 16px 16px",
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.3s ease",
    zIndex: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.4,
  },
  cardStats: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fff",
    justifyContent: "space-between",
    borderTop: "1px solid #f0f0f0",
    "& .stats-left": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "0.9rem",
      color: "#666",
      "& svg": {
        fontSize: "1rem",
        color: "#3F72AF",
      }
    },
    "& .stats-right": {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      "& span": {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.9rem",
        color: "#666",
        "& svg": {
          fontSize: "1rem",
          color: "#3F72AF",
        }
      }
    }
  },
  cardActionBar: {
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    gap: "8px",
    opacity: 0,
    transform: "translateY(-8px)",
    transition: "all 0.3s ease",
    zIndex: 3,
  },
  cardActionBtn: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    border: "none",
    borderRadius: "48px",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "white",
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      color: "#3F72AF",
    },
    "& svg": {
      fontSize: "1.2rem",
    }
  },
  emptyState: {
    textAlign: "center",
    padding: "48px",
    color: "#3F72AF",
    fontSize: "1.25rem",
    fontWeight: 600,
    gridColumn: "1 / -1",
    background: "white",
    borderRadius: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    animation: "$fadeIn 0.5s ease forwards",
    "& svg": {
      fontSize: "3rem",
      marginBottom: "16px",
      color: "#DBE2EF",
    }
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
    backgroundImage: "linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1000px 100%",
    animation: "$shimmerAnimation 1s linear infinite forwards",
    borderRadius: "24px",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "inherit",
      animation: "$shimmerAnimation 1s linear infinite",
    }
  },
  sortSelect: {
    appearance: "none",
    padding: "8px 16px",
    paddingRight: "32px",
    borderRadius: "12px",
    border: "1px solid #e8e8e8",
    background: "white",
    backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23666\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    color: "#666",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#3F72AF",
      color: "#3F72AF",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#3F72AF",
      boxShadow: "0 0 0 3px rgba(63,114,175,0.1)",
    }
  },
  previewModal: {
    position: 'fixed',
    top: '50px', 
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch', // เปลี่ยนเป็น stretch เพื่อให้ content ยืดเต็มความสูง
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    height: '100%',
    position: 'relative',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
  filterBar: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    animation: '$slideDown 0.3s ease',
  },
  filterContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  filterSection: {
    '& h3': {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#666',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '& svg': {
        color: '#3F72AF',
      },
    },
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagButton: {
    padding: '6px 12px',
    borderRadius: '100px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#3F72AF',
      color: '#3F72AF',
      background: '#f8faff',
    },
    '&.active': {
      background: '#3F72AF',
      color: '#fff',
      borderColor: '#3F72AF',
    },
  },
  colorsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  colorButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&.active': {
      '& svg': {
        color: '#fff',
        fontSize: '0.9rem',
      },
    },
  },
  timeframeSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: '0.9rem',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
    },
  },
  activeFilters: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activeFiltersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1,
  },
  activeFilterTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px 4px 12px',
    borderRadius: '100px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    color: '#666',
    fontSize: '0.9rem',
    '& button': {
      background: 'none',
      border: 'none',
      padding: '2px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      color: '#999',
      '&:hover': {
        color: '#ff4757',
      },
    },
  },
  colorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  clearFiltersBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #ff7e67',
    background: '#fff5f3',
    color: '#ff7e67',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ffe8e4',
    },
    '& svg': {
      fontSize: '0.9rem',
    },
  },
  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  categoriesBar: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  categoriesList: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    flex: 1,
    "&::-webkit-scrollbar": {
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "2px",
    },
  },
  categoryButton: {
    padding: "8px 16px",
    border: "1px solid #e0e0e0",
    background: "#fff",
    borderRadius: "100px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#666",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#3F72AF",
      color: "#3F72AF",
      background: "#f8faff",
    },
    "&.active": {
      background: "#3F72AF",
      color: "#fff",
      borderColor: "#3F72AF",
    },
  },
  filterTitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#666",
    marginBottom: "0.75rem",
    "& svg": {
      fontSize: "1rem",
      color: "#3F72AF",
    }
  },
  filterOption: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#333",
    "&:hover": {
      background: "#f5f7fa",
    },
    "& input[type='checkbox']": {
      width: "18px",
      height: "18px",
      borderRadius: "4px",
      border: "2px solid #ddd",
      appearance: "none",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.2s ease",
      "&:checked": {
        background: "#3F72AF",
        borderColor: "#3F72AF",
        "&::after": {
          content: '""',
          position: "absolute",
          top: "3px",
          left: "6px",
          width: "4px",
          height: "8px",
          border: "solid white",
          borderWidth: "0 2px 2px 0",
          transform: "rotate(45deg)",
        }
      },
      "&:hover": {
        borderColor: "#3F72AF",
      }
    }
  },
  activeFiltersTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginTop: "1rem",
    marginBottom: "1.5rem",
    padding: "0.5rem",
  },
  activeFilter: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "#f5f7fa",
    borderRadius: "100px",
    fontSize: "0.9rem",
    color: "#333",
    "& svg": {
      fontSize: "0.9rem",
      color: "#3F72AF",
    },
    "& button": {
      background: "none",
      border: "none",
      padding: "0.25rem",
      cursor: "pointer",
      color: "#666",
      display: "flex",
      alignItems: "center",
      borderRadius: "50%",
      transition: "all 0.2s ease",
      "&:hover": {
        color: "#ff4757",
        background: "#fff",
      }
    }
  },
  resetButtonMain: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.6rem 1rem",
    background: "linear-gradient(to bottom, #fff5f3, #ffe8e4)",
    border: "1px solid rgba(255,126,103,0.2)",
    borderRadius: "10px",
    color: "#ff7e67",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(255,126,103,0.1)",
    "&:hover": {
      background: "#fff5f3",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(255,126,103,0.15)",
    },
    "& svg": {
      fontSize: "0.9rem",
      transition: "transform 0.3s ease",
    },
    "&:hover svg": {
      transform: "rotate(-180deg)",
    },
  },
  dropdownIcon: {
    fontSize: "0.85rem",
    transition: "transform 0.3s ease",
    opacity: 0.7,
    "&.open": {
      transform: "rotate(180deg)",
    },
  },
  subCategories: {
    marginLeft: "2rem",
    marginTop: "0.5rem",
  },
  tagFilters: {
    maxHeight: "200px",
    overflowY: "auto",
    padding: "0.5rem",
    border: "1px solid #eee",
    borderRadius: "8px",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#ccc",
      borderRadius: "3px",
      "&:hover": {
        background: "#999",
      }
    }
  },
  dateFilters: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dateInput: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    "& label": {
      fontSize: "0.9rem",
      color: "#666",
    },
    "& input": {
      padding: "0.5rem",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "0.95rem",
      color: "#333",
      "&:focus": {
        outline: "none",
        borderColor: "#3F72AF",
      }
    }
  },
  galleryTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.8rem",
  },
  galleryTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.8rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "100px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    color: "#fff",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)",
    },
    "& i": {
      fontSize: "0.75rem",
    }
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    "@media (max-width: 767px)": {
      padding: "24px",
    }
  },
  listItem: {
    display: "flex",
    gap: "24px",
    background: "white",
    borderRadius: "24px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      "& $listItemImage img": {
        transform: "scale(1.08)",
      }
    },
    "@media (max-width: 767px)": {
      flexDirection: "column",
      gap: "0",
    }
  },
  listItemImage: {
    width: "280px",
    height: "210px",
    position: "relative",
    overflow: "hidden",
    background: "#f8f8f8",
    flexShrink: 0,
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "@media (max-width: 767px)": {
      width: "100%",
      height: "240px",
    }
  },
  listItemContent: {
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  listItemTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#112D4E",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    lineHeight: 1.4,
  },
  listItemMeta: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    color: "#666",
    fontSize: "0.9rem",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      "& svg": {
        fontSize: "1rem",
        color: "#3F72AF",
      }
    }
  },
  listItemActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "auto",
  },
  listItemBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid #e8e8e8",
    background: "white",
    color: "#666",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#f8f9fa",
      borderColor: "#3F72AF",
      color: "#3F72AF",
      transform: "translateY(-2px)",
    },
    "& svg": {
      fontSize: "1rem",
    }
  },
  pageContent: {
    padding: "24px",
  },
  mainContent: {
    flex: 1,
    marginLeft: "24px",
  },
  viewToggle: {
    display: "flex",
    gap: "0.5rem",
    marginLeft: "auto",
    background: "#fff",
    padding: "0.25rem",
    border: "1px solid #e0e0e0",
    borderRadius: "100px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  viewButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    borderRadius: "100px",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#3F72AF",
    },
    "&.active": {
      background: "#3F72AF",
      color: "#fff",
    }
  },
  sortDropdown: {
    position: "relative",
    "& select": {
      appearance: "none",
      padding: "0.75rem 2.5rem 0.75rem 1.25rem",
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "#333",
      background: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "100px",
      cursor: "pointer",
      minWidth: "160px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1rem",
      "&:hover": {
        borderColor: "#3F72AF",
        color: "#3F72AF",
        background: "#fff",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(63,114,175,0.08)",
      },
      "&:focus": {
        outline: "none",
        borderColor: "#3F72AF",
        boxShadow: "0 0 0 3px rgba(63,114,175,0.1)",
      },
    }
  },
  spinnerIcon: {
    animation: "spin 1s linear infinite",
    fontSize: "24px",
    color: "#3F72AF"
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px",
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    color: "white",
    transition: "opacity 0.3s ease"
  },
  statsLeft: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#666"
  },
  statsRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#666"
  },
  statIcon: {
    fontSize: "0.9rem"
  },
  previewImageContainer: {
    position: "relative",
    width: "100%",
    height: "auto",
    maxHeight: "70vh",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
  galleryNav: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.5)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.75)",
    },
  },
  prevBtn: {
    left: "10px",
  },
  nextBtn: {
    right: "10px",
  },
  previewDescription: {
    marginBottom: "16px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#666",
    "& svg": {
      fontSize: "1rem"
    }
  },
  galleryThumbnails: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  thumbnail: {
    width: "80px",
    height: "80px",
    overflow: "hidden",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.75,
    },
  },
  active: {
    opacity: 0.75,
  },
  cardTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.8rem",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.8rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "100px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    color: "#fff",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)",
    },
    "& i": {
      fontSize: "0.75rem",
    }
  },
  previewTags: {
    marginTop: "20px",
  },
  previewTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.8rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "100px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    color: "#fff",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)",
    },
    "& i": {
      fontSize: "0.75rem",
    }
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  filterCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    height: "20px",
    padding: "0 6px",
    background: "#3F72AF",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: "10px",
    marginLeft: "0.5rem",
  },
  searchInput: {
    width: "100%",
  },
  colorInput: {
    width: "100%",
  },
  filterContainer: {
    position: 'relative',
  },
  filterDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '600px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    padding: '20px',
    zIndex: 100,
    animation: '$slideDown 0.2s ease-out',
    '@media (max-width: 768px)': {
      width: '90vw',
      right: '-45vw',
    },
  },
  dropdownActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  dropdownResetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #ff7e67',
    background: '#fff5f3',
    color: '#ff7e67',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ffe8e4',
      transform: 'translateY(-1px)',
    },
    '& svg': {
      fontSize: '0.9rem',
    },
  },
});

interface Category {
  label: string;
  value: string;
  icon: React.ReactNode;
  children?: SubCategory[];
  description: string;
}

interface SubCategory {
  label: string;
  value: string;
}

const categories: Category[] = [
  { 
    label: "ทั้งหมด", 
    value: "all", 
    icon: <FaThLarge />,
    description: "แสดงทุกหมวดหมู่"
  },
  { 
    label: "การแพทย์", 
    value: "medical", 
    icon: <FaHeart />,
    description: "คลินิก ศูนย์การแพทย์ และการรักษาโรค"
  },
  { 
    label: "การศึกษา", 
    value: "education", 
    icon: <FaBook />,
    description: "การเรียนการสอน อบรม และสัมมนา"
  },
  { 
    label: "รอบรั้วมหาลัย", 
    value: "campus", 
    icon: <FaUniversity />,
    description: "กิจกรรมและข่าวสารในมหาวิทยาลัย"
  }
];

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  thumbnailUrl: string;
  fileUrl: string;
  createdAt: string;
  viewCount?: number;
  downloadCount?: number;
  uploadedBy?: string;
  userAvatar?: string;  // เพิ่ม property userAvatar
  gallery?: string[];
  tags?: string[];
  awards?: string[];
  country?: 'Thailand' | 'International';
  collaboration?: 'domestic' | 'international';
}

interface FilterType {
  label: string;
  icon: JSX.Element;
  options: string[];
}

interface FilterTypes {
  [key: string]: FilterType;
}

const filterTypes: FilterTypes = {
  category: {
    label: "หมวดหมู่",
    icon: <FaFolder />,
    options: ["การแพทย์", "การศึกษา", "รอบรั้วมหาลัย", "วิจัย", "นวัตกรรม"]
  },
  tags: {
    label: "แท็ก",
    icon: <FaTags />,
    options: ["คลินิก", "การแพทย์", "แพทย์", "การเรียนการสอน", "วิจัย", "นวัตกรรม", "เทคโนโลยี", "สุขภาพ", "การศึกษา"]
  },
  technology: {
    label: "เทคโนโลยี",
    icon: <FaCode />,
    options: ["AI", "VR/AR", "IoT", "Blockchain", "Mobile App", "Web Application", "Machine Learning", "Data Analytics"]
  },
  country: {
    label: "ประเทศ",
    icon: <FaGlobe />,
    options: ["ในประเทศ", "ต่างประเทศ", "ความร่วมมือระหว่างประเทศ"]
  },
  year: {
    label: "ปี",
    icon: <FaFileAlt />,
    options: ["2024", "2023", "2022", "2021", "2020"]
  }
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  setKeyword: (value: string) => void;
  searchBy: string;
  setSearchBy: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  types: string[];
  handleTypeChange: (type: string) => void;
  selectedYears: number[];
  setSelectedYears: (years: number[]) => void;
  yearCounts: Record<number, number>;
  uniqueYears: number[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resourceTypes: string[];
  showOnlyTypes: boolean;
}

interface SortOption {
  value: string;
  label: string;
}

interface FilterState {
  category: string[];
  tags: string[];
  technology: string[];
  awards: string[];
  country: string[];
  year: string[];
  timeframe: string | null;
  [key: string]: string[] | string | null;
}

const ImagesPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addDownload } = useDownloadHistory();
  const { user } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentSort, setCurrentSort] = useState("popular");
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: [],
    tags: [],
    technology: [],
    awards: [],
    country: [],
    year: [],
    timeframe: null
  });
  const [isFilterOpen, setIsFilterOpen] = useState<Record<string, boolean>>({});
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('latest');
  
  const itemsPerPage = 12;

  const images = resourcesData.resources.filter((item) => item.type === "image");
  
  const filteredItems = useMemo(() => {
    return images.filter((item: Resource) => {
      if (activeFilters.category?.length > 0) {
        const categoryMatches = activeFilters.category.some(cat => {
          switch(cat) {
            case "การแพทย์": return item.category === "medical";
            case "การศึกษา": return item.category === "education";
            case "รอบรั้วมหาลัย": return item.category === "campus";
            default: return item.category === cat;
          }
        });
        if (!categoryMatches) return false;
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        const descMatch = item.description?.toLowerCase().includes(searchLower);
        const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        if (!titleMatch && !descMatch && !tagsMatch) return false;
      }

      if (activeFilters.tags?.length > 0 && !item.tags?.some(tag => activeFilters.tags.includes(tag))) {
        return false;
      }

      // Technology filter
      if (activeFilters.technology?.length > 0 && !item.tags?.some(tag => activeFilters.technology.includes(tag))) {
        return false;
      }

      // Awards filter
      if (activeFilters.awards?.length > 0 && !item.awards?.some(award => activeFilters.awards.includes(award))) {
        return false;
      }



      if (activeFilters.year?.length > 0) {
        const itemYear = new Date(item.createdAt).getFullYear().toString();
        if (!activeFilters.year.includes(itemYear)) return false;
      }

      return true;
    });
  }, [images, activeFilters, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          const downloadDiff = (b.downloadCount || 0) - (a.downloadCount || 0);
          if (downloadDiff !== 0) return downloadDiff;
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "views":
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
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
    if (!mainCategories.includes(selectedCategories[0])) setSidebarCollapsed(true);
  }, [selectedCategories]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedCategories, sortBy]);

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
  };

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategories(prev => {
      if (value === "all") {
        return ["all"];
      }
      const newCategories = prev.filter(cat => cat !== "all");
      if (prev.includes(value)) {
        return newCategories.filter(cat => cat !== value);
      }
      return [...newCategories, value];
    });
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories(["all"]);
    setSearchQuery("");
    setSortBy("popular");
    setPage(1);
  };

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

  const handleFilterClick = (filterType: string) => {
    setIsFilterOpen(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleFilterOptionClick = (type: keyof FilterState, option: string) => {
    setActiveFilters(prev => {
      const currentFilters = prev[type];
      if (Array.isArray(currentFilters)) {
        const newFilters = currentFilters.includes(option)
          ? currentFilters.filter(f => f !== option)
          : [...currentFilters, option];
        
        return {
          ...prev,
          [type]: newFilters
        };
      }
      return prev;
    });
  };

  const resetFilters = () => {
    setActiveFilters({
      category: [],
      tags: [],
      technology: [],
      awards: [],
      country: [],
      year: [],
      timeframe: null
    });
    setSearchQuery('');
    setSortBy('popular');
    setPage(1);
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  const handleGalleryNav = (direction: 'prev' | 'next') => {
    if (!previewItem?.gallery) return;
    
    setCurrentGalleryIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? previewItem.gallery.length - 1 : prev - 1;
      } else {
        return prev === previewItem.gallery.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const sortOptions: SortOption[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' },
  ];

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((count, filters) => {
      return count + (filters?.length || 0);
    }, 0);
  }, [activeFilters]);

  const mockTags = [
    "การแพทย์", "การศึกษา", "วิจัย", "นวัตกรรม", 
    "เทคโนโลยี", "สุขภาพ", "การเรียนการสอน", 
    "โรงพยาบาล", "คลินิก", "ห้องปฏิบัติการ"
  ];

  return (
    <div className={classes.pageWrap}>
      <div className={classes.pageContent}>
        <div className={classes.topBar}>
          <div className={classes.topControls}>
            <div className={classes.sortDropdown}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={classes.sortSelect}
              >
                <option value="latest">ล่าสุด</option>
                <option value="oldest">เก่าสุด</option>
                <option value="popular">ยอดนิยม</option>
                <option value="views">ดูมากที่สุด</option>
              </select>
            </div>
          </div>
          <div className={classes.rightControls}>
            <button
              className={classes.toggleFiltersBtn}
              onClick={() => setShowFilters(!showFilters)}
            >
              <IoFilterOutline />
              ตัวกรอง
              
            </button>
            <div className={classes.viewToggle}>
              <button
                className={`${classes.viewButton} ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="มุมมองตาราง"
              >
                <FaThLarge />
              </button>
              <button
                className={`${classes.viewButton} ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="มุมมองรายการ"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className={classes.filterBar}>
 

            {/* Filter Content */}
            <div className={classes.filterContent}>
              <div className={classes.filterSection}>
              <h3 className={classes.filterTitle}>
                  <IoList />
                  หมวดหมู่
              </h3>
              <div className={classes.categoriesList}>
                <button
                  className={`${classes.categoryButton} ${!activeFilters.category.length ? 'active' : ''}`}
                  onClick={() => setActiveFilters(prev => ({ ...prev, category: [] }))}
                >
                  ทั้งหมด
                </button>
                <button
                  className={`${classes.categoryButton} ${activeFilters.category.includes('medical') ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      category: prev.category.includes('medical') 
                        ? prev.category.filter(c => c !== 'medical')
                        : [...prev.category, 'medical']
                    }));
                  }}
                >
                  การแพทย์
                </button>
                <button
                  className={`${classes.categoryButton} ${activeFilters.category.includes('education') ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      category: prev.category.includes('education')
                        ? prev.category.filter(c => c !== 'education')
                        : [...prev.category, 'education']
                    }));
                  }}
                >
                  การศึกษา
                </button>
                <button
                  className={`${classes.categoryButton} ${activeFilters.category.includes('campus') ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      category: prev.category.includes('campus')
                        ? prev.category.filter(c => c !== 'campus')
                        : [...prev.category, 'campus']
                    }));
                  }}
                >
                  รอบรั้วมหาลัย
                </button>
              </div>  
            </div>
              <div className={classes.filterSection}>
              <h3 className={classes.filterTitle}>
                  <FaTags />
                  แท็ก
                </h3>
              <div className={classes.tagsList}>
                  {mockTags.map((tag, index) => (
                    <button
                      key={index}
                      className={`${classes.tagButton} ${activeFilters.tags.includes(tag) ? 'active' : ''}`}
                      onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter(t => t !== tag)
                            : [...prev.tags, tag]
                        }));
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={classes.filterSection}>
                <h3 className={classes.filterTitle}>
                  <IoTimeSharp />
                  ช่วงเวลา
                </h3>
                <select 
                  className={classes.timeframeSelect}
                  value={activeFilters.timeframe || ''}
                  onChange={(e) => setActiveFilters(prev => ({
                    ...prev,
                    timeframe: e.target.value
                  }))}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="วันนี้">วันนี้</option>
                  <option value="สัปดาห์นี้">สัปดาห์นี้</option>
                  <option value="เดือนนี้">เดือนนี้</option>
                  <option value="ปีนี้">ปีนี้</option>
                </select>
              </div>
            </div>

            {(activeFilters.category.length > 0 || 
              activeFilters.tags.length > 0 || 
              activeFilters.technology.length > 0 || 
              activeFilters.awards.length > 0 || 
              activeFilters.country.length > 0 || 
              activeFilters.year.length > 0 || 
              activeFilters.timeframe) && (
              <div className={classes.activeFilters}>
                <div className={classes.activeFiltersList}>
                  {activeFilters.category.map((cat, index) => (
                    <span key={`cat-${index}`} className={classes.activeFilterTag}>
                      {cat === 'medical' ? 'การแพทย์' :
                       cat === 'education' ? 'การศึกษา' :
                       cat === 'campus' ? 'รอบรั้วมหาลัย' : cat}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          category: prev.category.filter(c => c !== cat)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.tags.map((tag, index) => (
                    <span key={`tag-${index}`} className={classes.activeFilterTag}>
                      {tag}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          tags: prev.tags.filter(t => t !== tag)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.technology.map((tech, index) => (
                    <span key={`tech-${index}`} className={classes.activeFilterTag}>
                      {tech}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          technology: prev.technology.filter(t => t !== tech)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.awards.map((award, index) => (
                    <span key={`award-${index}`} className={classes.activeFilterTag}>
                      {award}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          awards: prev.awards.filter(a => a !== award)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.country.map((country, index) => (
                    <span key={`country-${index}`} className={classes.activeFilterTag}>
                      {country}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          country: prev.country.filter(c => c !== country)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.year.map((year, index) => (
                    <span key={`year-${index}`} className={classes.activeFilterTag}>
                      {year}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          year: prev.year.filter(y => y !== year)
                        }));
                      }}>
                        <IoTimeSharp />
                      </button>
                    </span>
                  ))}
                  {activeFilters.timeframe && (
                    <span className={classes.activeFilterTag}>
                      {activeFilters.timeframe}
                      <button onClick={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          timeframe: null
                        }));
                      }}>
                        <FaTimes />
                      </button>
                    </span>
                  )}
                </div>
                <button 
                  className={classes.clearFiltersBtn}
                  onClick={() => setActiveFilters({
                    category: [],
                    tags: [],
                    technology: [],
                    awards: [],
                    country: [],
                    year: [],
                    timeframe: null
                  })}
                >
                  <FaUndo />
                  ล้างทั้งหมด
                </button>
              </div>
            )}
          </div>
        )}

        <div className={classes.contentWrap}>
          <main className={`${classes.main}`}>
            <div className={viewMode === 'grid' ? classes.grid : classes.listView}>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div 
                    key={`skeleton-${index}`} 
                    className={`${viewMode === 'grid' ? classes.card : classes.listItem} ${classes.shimmer}`} 
                    style={{ 
                      height: viewMode === 'grid' ? "360px" : "210px",
                      animationDelay: `${index * 0.1}s`
                    }} 
                  />
                ))
              ) : paginatedItems.length === 0 ? (
                <div className={classes.emptyState}>
                  <FaImage />
                  <p>ไม่พบรูปภาพที่ตรงกับเงื่อนไขการค้นหา</p>
                </div>
              ) : (
                paginatedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={classes.card}
                    onClick={() => navigate(`/resource/${item.id}`)}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className={classes.cardImageBox}>
                      {!loadedImages.has(item.id) && (
                        <div className={classes.imageLoader}>
                          <FaSpinner className={classes.spinnerIcon} />
                        </div>
                      )}
                      <img
                        src={getImageUrl(item.thumbnailUrl)}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(item.id)}
                        style={{ 
                          opacity: loadedImages.has(item.id) ? 1 : 0
                        }}
                      />
                      <div className={classes.cardTitle}>{item.title}</div>
                      <div className={classes.cardActionBar}>
                        <button 
                          className={classes.cardActionBtn}
                          onClick={(e) => handlePreview(e, item)}
                          title="Preview"
                        >
                          <IoEye />
                        </button>
                        <button 
                          className={classes.cardActionBtn}
                          onClick={(e) => handleDownload(e, item)}
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className={classes.cardActionBtn}
                          onClick={(e) => handleBookmark(e, item)}
                          title="Bookmark"
                        >
                          {bookmarks.some(bookmark => bookmark.id === item.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                    </div>
                    <div className={classes.cardInfo} style={{borderRadius: '16px', boxShadow: 'none', padding: '5px 9px', margin: '5x 5px 0 8px'}}>
                      <div className={classes.userInfo} style={{gap: '8px'}}>
                        <span className="name" style={{fontSize: '0.92rem', color: '#64748b', fontWeight: 400, letterSpacing: 0}}>
                          {item.category}
                        </span>
                      </div>
                      <div className={classes.stats} style={{gap: '14px'}}>
                        <span className="stat" style={{color: '#94a3b8', fontSize: '0.92rem', fontWeight: 400}}>
                          <IoHeart style={{color: '#94a3b8', fontSize: '1.05rem'}} />
                          {item.downloadCount || 0}
                        </span>
                        <span className="stat" style={{color: '#94a3b8', fontSize: '0.92rem', fontWeight: 400}}>
                          <IoEye style={{color: '#94a3b8', fontSize: '1.05rem'}} />
                          {item.viewCount || 0}
                        </span>
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
              <div className={classes.previewImageContainer}>
                <img
                  src={getImageUrl(previewItem.thumbnailUrl)}
                  alt={previewItem.title}
                  className={classes.previewImage}
                />
              </div>
              <div className={classes.previewInfo}>
                <h3>{previewItem.title}</h3>
                <div className={classes.previewMeta}>
                  {previewItem.tags?.map((tag: string, index: number) => (
                    <span key={index}>
                      <FaTags />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={classes.previewActions}>
                          <button className={classes.previewActionBtn} onClick={(e) => { e.stopPropagation(); handleDownload(e, previewItem); }}>
            <FaDownload />
            ดาวน์โหลด
          </button>
          <button className={classes.previewActionBtn} onClick={(e) => { e.stopPropagation(); handleBookmark(e, previewItem); }}>
            {bookmarks.some(bookmark => bookmark.id === previewItem.id) ? <FaHeart /> : <FaRegHeart />}
            บุ๊กมาร์ก
          </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesPage;