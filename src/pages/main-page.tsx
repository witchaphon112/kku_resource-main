import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Modal from "../components/Modal";
import { Dropdown } from 'primereact/dropdown';
import { IoEye, IoHeart, IoBookmarkOutline, IoBookmark, IoShareSocialSharp, IoEllipsisVerticalCircle, IoCopy, IoOpenOutline } from "react-icons/io5";
import { FaDownload, FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { IoHeartOutline, IoHeartSharp} from "react-icons/io5";


import resourcesData from "../mock/resources.json";
import "react-photo-view/dist/react-photo-view.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const THEME = {
  colors: {
    primary: "#112D4E",
    primaryLight: "rgba(17,45,78,0.9)",
    primaryDark: "#0c1c2e",
    secondary: "#3F72AF",
    secondaryLight: "rgba(63,114,175,0.9)",
    secondaryDark: "#2c5a8f",
    accent: "#b71c1c",
    text: {
      primary: "#112D4E",
      secondary: "#666666",
      light: "#DBE2EF"
    },
    background: {
      main: "#ffffff",
      light: "#F9F7F7",
      heroGradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
    },
    border: "#DBE2EF"
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem"
  },
  borderRadius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  shadows: {
    card: "0 4px 20px rgba(17,45,78,0.08)",
    cardHover: "0 8px 30px rgba(17,45,78,0.12)",
    button: "0 2px 8px rgba(17,45,78,0.15)"
  },
  typography: {
    fontFamily: "var(--bs-font-primary)",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: "var(--bs-font-primary)",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      fontFamily: "var(--bs-font-primary)",
    },
    h3: {
      fontSize: "1.1rem",
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: "var(--bs-font-primary)",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      fontFamily: "var(--bs-font-primary)",
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.5,
      fontFamily: "var(--bs-font-primary)",
    },
    caption: {
      fontSize: "0.85rem",
      lineHeight: 1.4
    }
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.25s ease",
    slow: "0.35s ease"
  },
  layout: {
    maxWidth: "1400px",
    containerPadding: "2rem",
    sectionSpacing: "5rem",
    cardMinWidth: "320px",
  },
  aspectRatios: {
    hero: "56.25%", 
    card: "66%",    
    thumbnail: "75%" 
  }
};

const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
};

const HERO_DATA = [
  {
    id: "h1",
    imageUrl: `${import.meta.env.BASE_URL}mock/hero-1.jpg`,
  }
];

const TRENDING_KEYWORDS = [
  { text: "โรงพยาบาล", bgColor: "#fff" },
  { text: "ยา", bgColor: "#fff" },
  { text: "มลพิษ", bgColor: "#fff" },
  { text: "คลินิก", bgColor: "#fff" },
  { text: "การทำหัตถการหัวใจ", bgColor: "#fff" },
  { text: "ศูนย์นวัตกรรมการเรียนการสอน", bgColor: "#fff" },
  { text: "นศ.มข. คว้ารางวัลชนะเลิศระดับชาติ", bgColor: "#fff" },
  { text: "คณะเทคโนโลยี มหาวิทยาลัยขอนแก่น", bgColor: "#fff" },
];

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  downloadCount: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  gallery?: string[];
  videoUrl?: string;
  likeCount?: number;
}

interface Photo {
  id: string;
  src: string;
  key: string;
  title: string;
  width: number;
  height: number;
  category?: string;
  tags?: string[];
  videoUrl?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}

const cardStyles = {
  card: {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      "& $cardImageBox img": {
        transform: "scale(1.1)",
      },
      "& $cardOverlay": {
        opacity: 1,
      },
      "& $cardActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  cardImageBox: {
    position: "relative",
    width: "100%",
    paddingBottom: "75%", // 4:3 aspect ratio
    overflow: "hidden",
    background: "#f0f4f8",
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
    opacity: 0,
    transition: "opacity 0.4s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "24px",
  },
  cardTitle: {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "12px",
    lineHeight: 1.4,
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  },
  cardInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCategory: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    "& svg": {
      fontSize: "1rem",
      color: "#3F72AF",
    }
  },
  cardStats: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "#94a3b8",
      fontSize: "0.85rem",
      fontWeight: 500,
      "& svg": {
        fontSize: "1rem",
      }
    }
  },
  cardActionBar: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "12px",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  actionButton: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "12px",
    color: "#1e293b",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#fff",
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      color: "#3F72AF",
    },
    "& svg": {
      fontSize: "1.2rem",
    }
  },
  cardTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  tag: {
    padding: "6px 12px",
    background: "#f1f5f9",
    borderRadius: "100px",
    color: "#475569",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#e2e8f0",
      transform: "translateY(-1px)",
    }
  },
};

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
  pageWrap: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f8faff, #fff)",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "2rem",
    gap: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "32px",
    padding: "24px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "24px",
      padding: "16px",
    }
  },
  ...cardStyles,
  sectionTitle: {
    ...THEME.typography.h2,
    color: THEME.colors.text.primary,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "55px",
      height: "6px",
      backgroundColor: THEME.colors.secondary,
      margin: "0.5rem auto 0",
      borderRadius: "4px",
    },
  },
  
  sectionHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: THEME.spacing.xl,
    position: "relative",
  },
  
  sectionLink: {
    display: "inline-block",
    marginTop: THEME.spacing.xs,
    color: THEME.colors.primary,
    textDecoration: "none",
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: THEME.typography.body1.fontSize,
    transition: THEME.transitions.fast,
    "&:hover": {
      textDecoration: "underline",
      transform: "translateX(4px)",
    },
  },

  fullWidthHero: {
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
    position: "relative",
    overflow: "hidden",
    minHeight: "calc(100vh - 80px)",
    background: THEME.colors.background.light,
    marginTop: "-80px",
    "@media (max-width: 768px)": {
      minHeight: "60vh",
    }
  },
  
  heroImage: {
    width: "100%",
    height: "calc(100vh - 80px)",
    maxHeight: "800px",
    minHeight: "600px",
    objectFit: "cover",
    objectPosition: "center center",
    filter: "brightness(0.85)",
    "@media (max-width: 768px)": {
      height: "60vh",
      minHeight: "400px",
    }
  },
  
  captionMain: {
    position: "absolute",
    bottom: "3rem",
    left: "3rem",
    color: "#fff",
    background: "rgba(0,0,0,0.65)",
    padding: "1.5rem 2rem",
    borderRadius: "0.75rem",
    maxWidth: "650px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    "@media (max-width: 992px)": {
      maxWidth: "80%",
      left: "2rem",
      bottom: "2rem",
    },
    "@media (max-width: 768px)": {
      maxWidth: "calc(100% - 2rem)",
      fontSize: "0.9rem",
      bottom: "1rem",
      left: "1rem",
      right: "1rem",
      padding: "1rem 1.25rem",
      textAlign: "center",
    },
  },
  
  heroTitle: {
    fontSize: "2.2rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    lineHeight: 1.2,
    "@media (max-width: 768px)": {
      fontSize: "1.8rem",
    }
  },

  scrollWrapper: {
    position: "relative",
    margin: "0 auto",
    padding: "0 50px",
    boxSizing: "content-box",
  },
  
  scrollButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #ddd",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    zIndex: 2,
    fontSize: "1.8rem",
    cursor: "pointer",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `all ${ANIMATION_DURATION.NORMAL}ms ease`,
    "&:hover:not(:disabled)": {
      backgroundColor: "#b71c1c",
      color: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-50%) scale(1.1)",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      backgroundColor: "#f0f0f0",
      color: "#888",
    }
  },
  
  leftButton: { left: "0px" },
  rightButton: { right: "0px" },
  
  scrollContainer: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "2rem",
    padding: "1rem 0.5rem",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    justifyContent: "flex-start",
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
  },

  baseCard: {
    borderRadius: "0.75rem",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    scrollSnapAlign: "start",
    transition: `transform ${ANIMATION_DURATION.NORMAL}ms ease-out, box-shadow ${ANIMATION_DURATION.NORMAL}ms ease-out`,
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
    },
  },
  
  resourceCard: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    overflow: "hidden",
    boxShadow: THEME.shadows.card,
    transition: THEME.transitions.normal,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    cursor: "pointer",
    transform: "translateY(0)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
      "& $cardImage img": {
        transform: "scale(1.05)",
      }
    }
  },
  
  resourceCardThree: {
    extend: "baseCard",
    flex: "0 0 calc(33.333% - (2rem * 2 / 3))",
    maxWidth: "calc(33.333% - (2rem * 2 / 3))",
    minWidth: "280px",
    '@media (max-width: 1024px)': {
      flex: '0 0 calc(50% - 1rem)',
      maxWidth: 'calc(50% - 1rem)',
    },
    '@media (max-width: 767px)': {
      flex: '0 0 calc(100% - 1rem)',
      maxWidth: 'calc(100% - 1rem)',
      scrollSnapAlign: 'center',
    },
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderBottom: "1px solid #eee",
    transition: `transform ${ANIMATION_DURATION.SLOW}ms ease`
  },
  
  recommendedImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  tagList: {
    marginTop: "auto",
    paddingTop: "0.5rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    justifyContent: "flex-start",
    maxHeight: "4.5em",
    overflow: "hidden",
  },
  tag: {
    background: THEME.colors.background.light,
    color: THEME.colors.text.secondary,
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: THEME.typography.caption.fontSize,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    transition: THEME.transitions.fast,
    "&:hover": {
      background: THEME.colors.primaryLight,
      color: THEME.colors.text.light,
    }
  },
  content: { 
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  
  categoryText: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: THEME.colors.secondary,
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    fontFamily: THEME.typography.fontFamily,
    letterSpacing: "0.5px",
  },
  
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontFamily: THEME.typography.fontFamily,
    color: THEME.colors.text.primary,
    lineHeight: 1.3,
  },

  featuredCardRow: {
    display: "flex",
    gap: 36,
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    margin: "0 auto 1.8rem auto",
    '@media (max-width: 900px)': { gap: 18 },
  },
  
  featuredCard: {
    position: "relative",
    borderRadius: THEME.borderRadius.lg,
    overflow: "hidden",
    minWidth: 290,
    width: 340,
    maxWidth: "90vw",
    aspectRatio: "1 / 1.1",
    boxShadow: THEME.shadows.card,
    cursor: "pointer",
    background: THEME.colors.background.main,
    transition: `transform ${ANIMATION_DURATION.NORMAL}ms ease, box-shadow ${ANIMATION_DURATION.NORMAL}ms ease`,
    "&:hover": {
      transform: "translateY(-6px) scale(1.04)",
      boxShadow: THEME.shadows.cardHover
    }
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
    backgroundColor: "rgba(17,45,78,0.9)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: THEME.spacing.md
  },

  carouselArrowCustom: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: 'rgba(255,255,255,0.92)',
    border: 'none',
    borderRadius: 30,
    boxShadow: '0 3px 18px rgba(17,45,78,0.2)',
    width: 50,
    height: 50,
    fontSize: 26,
    color: THEME.colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${ANIMATION_DURATION.NORMAL}ms ease`,
    '&:hover': {
      background: THEME.colors.secondary,
      color: '#fff',
      transform: 'translateY(-50%) scale(1.12)',
    }
  },
  
  carouselArrowLeft: { left: 36 },
  carouselArrowRight: { right: 36 },
  
  carouselIndicators: {
    position: 'absolute',
    bottom: 170,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 14,
    zIndex: 2,
  },
  
  carouselDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#c7cad7',
    transition: `background ${ANIMATION_DURATION.NORMAL}ms ease`,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(255,255,255,0.5)',
    border: 'none',
    "&:hover": {
      background: '#9ca0ab',
    }
  },
  
  carouselDotActive: {
    background: THEME.colors.secondary,
  },

  photoGalleryContainer: {
    maxWidth: 1100,
    margin: "0 auto 60px auto",
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    boxShadow: THEME.shadows.card,
    padding: "24px",
    "@media (max-width: 768px)": {
      padding: "16px",
      borderRadius: THEME.borderRadius.md,
    }
  },

  scrollToTopButton: {
    position: "fixed",
    bottom: 34,
    right: 34,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: THEME.colors.secondary,
    color: THEME.colors.text.light,
    border: "none",
    boxShadow: THEME.shadows.button,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    zIndex: 12345,
    cursor: "pointer",
    transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
    "&:hover": {
      background: THEME.colors.secondaryDark,
      transform: "scale(1.1)",
      boxShadow: THEME.shadows.cardHover,
    }
  },

  cardImage: {
    position: "relative",
    paddingTop: THEME.aspectRatios.card,
    overflow: "hidden",
    background: THEME.colors.background.light,
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: `transform ${ANIMATION_DURATION.SLOW}ms ease`
    }
  },

  cardContent: {
    padding: THEME.spacing.lg,
    display: "flex",
    flexDirection: "column",
    gap: THEME.spacing.md,
    flexGrow: 1,
    "@media (max-width: 768px)": {
      padding: THEME.spacing.md
    }
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: THEME.colors.text.primary,
    margin: 0,
    lineHeight: 1.4,
    "@media (max-width: 768px)": {
      fontSize: "1.1rem"
    }
  },

  cardDescription: {
    fontSize: "0.95rem",
    color: THEME.colors.text.secondary,
    margin: 0,
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

  cardFooter: {
    marginTop: "auto",
    paddingTop: THEME.spacing.sm,
    borderTop: `1px solid ${THEME.colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionContainer: {
    maxWidth: THEME.layout.maxWidth,
    margin: "0 auto",
    padding: `0 ${THEME.layout.containerPadding}`,
    "@media (max-width: 768px)": {
      padding: "0 1rem"
    }
  },

  gridContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${THEME.layout.cardMinWidth}, 1fr))`,
    gap: THEME.spacing.xl,
    alignItems: "stretch",
    "@media (max-width: 768px)": {
      gap: THEME.spacing.md
    }
  },

  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "auto",
    paddingTop: THEME.spacing.md
  },

  tagItem: {
    background: THEME.colors.background.light,
    color: THEME.colors.text.secondary,
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    transition: THEME.transitions.fast,
    fontWeight: 500,
    "&:hover": {
      background: THEME.colors.secondaryLight,
      color: THEME.colors.text.light,
      transform: "translateY(-2px)"
    }
  },

  // Stats
  statsContainer: {
    display: "flex",
    alignItems: "center",
    gap: THEME.spacing.sm,
    color: THEME.colors.text.secondary,
    fontSize: "0.9rem",
    "& i": {
      color: THEME.colors.primary,
      fontSize: "1rem"
    }
  },

  statsSection: {
    width: '100%',
    background: 'transparent',
    padding: '3rem 0',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: THEME.colors.primary,
    marginBottom: '2.5rem',
    letterSpacing: 0.5,
    fontFamily: THEME.typography.fontFamily,
    textAlign: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50px',
      height: '3px',
      background: THEME.colors.secondary,
      borderRadius: '2px',
    }
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '1.5rem',
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      maxWidth: 900,
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      padding: '0 1rem',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      maxWidth: 280,
    }
  },
  statsCard: {
    borderRadius: '12px',
    padding: '1.5rem 1rem',
    textAlign: 'center',
    fontFamily: THEME.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: THEME.shadows.card,
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    cursor: 'default',
    border: `1px solid ${THEME.colors.border}`,
    background: THEME.colors.background.main,
    minHeight: '160px',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: THEME.shadows.cardHover,
    }
  },
  statsIcon: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    opacity: 0.85,
  },
  statsNumber: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    letterSpacing: 1,
  },
  statsLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: 0.2,
    color: '#333',
  },
  recommendedCard: {
    background: "#fff",
    borderRadius: THEME.borderRadius.lg,
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: THEME.shadows.card,
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    minWidth: 340,
    maxWidth: 360,
    width: 340,
    flex: "0 0 340px",
    scrollSnapAlign: "center",
    height: 460,
    '&:hover': {
      transform: "translateY(-8px)",
      boxShadow: THEME.shadows.cardHover,
    },
    '@media (max-width: 600px)': {
      minWidth: 220,
      maxWidth: '90vw',
      width: '90vw',
      height: 'auto',
      minHeight: 180,
    }
  },
  recommendedScroll: {
    display: "flex",
    gap: 28,
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    padding: "0.5rem 2.5rem",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    '@media (max-width: 600px)': {
      gap: 12,
      padding: '0.5rem 0.5rem',
    }
  },
  searchContainer: {
    width: "100%",
    maxWidth: "1200px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    zIndex: 1,
    marginTop: "10rem",
  },

  searchBox: {
    width: "100%",
    maxWidth: "800px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  searchInput: {
    width: "100%",
    padding: "1.2rem 1rem 1.2rem 3.5rem",
    fontSize: "1.1rem",
    fontFamily: "var(--bs-font-primary)",
    border: "none",
    borderRadius: "100px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    "&:focus": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    "&::placeholder": {
      color: "rgba(0, 0, 0, 0.5)",
      fontFamily: "var(--bs-font-primary)",
    },
  },

  trendingTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.8rem",
    justifyContent: "center",
    marginTop: "1rem",
    width: "100%",
    maxWidth: "800px",
  },

  trendingTag: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "#fff",
    border: "none",
    borderRadius: "100px",
    color: "#666",
    fontFamily: "var(--bs-font-primary)",
    fontSize: "0.85rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      background: "#f8f9fa",
    },
    "& i": {
      fontSize: "1rem",
      color: "#4a90e2",
      transition: "color 0.2s ease",
    },
  },

  searchIcon: {
    position: "absolute",
    left: "1.2rem",
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: "1.3rem",
    pointerEvents: "none",
    transition: "all 0.2s ease",
  },

  heroWrapper: {
    position: "relative",
    width: "100vw",
    height: "600px",
    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-80px",
  },

  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
  },

  gallerySection: {
    position: "relative",
    overflow: "hidden",
    background: THEME.colors.background.light,
  },

  galleryContainer: {
    maxWidth: THEME.layout.maxWidth,
    margin: "0 auto",
    padding: "0 2rem",
    position: "relative",
    zIndex: 1,
    "@media (max-width: 768px)": {
      padding: "0 1rem"
    }
  },

  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
      "& > div:nth-child(8n+1), & > div:nth-child(8n+4)": {
        gridRow: "span 2",
      }
    },
    "@media (max-width: 1023px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
    }
  },

  galleryItem: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: THEME.colors.background.main,
    boxShadow: THEME.shadows.card,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: THEME.shadows.cardHover,
      "& $galleryImage": {
        transform: "scale(1.05)",
      },
      "& $galleryOverlay": {
        opacity: 1,
      }
    },
    "&::before": {
      content: '""',
      display: "block",
      paddingTop: "100%",
      "@media (min-width: 1024px)": {
        "&:nth-child(8n+1), &:nth-child(8n+4)": {
          paddingTop: "150%", 
        }
      }
    }
  },

  galleryImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: `transform ${ANIMATION_DURATION.SLOW}ms ease`
  },

  galleryOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "1.5rem",
    opacity: 0,
    transition: "opacity 0.3s ease",
    color: THEME.colors.text.light,
  },

  galleryItemTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    lineHeight: 1.3,
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },

  galleryItemMeta: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontSize: "0.9rem",
    opacity: 0.9,
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },
    "& i": {
      fontSize: "0.85rem",
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
    padding: "0.2rem 0.6rem",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    "& i": {
      fontSize: "0.75rem",
    }
  },
  galleryPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, rgba(183,28,28,0.95) 0%, rgba(150,20,20,0.95) 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 25px rgba(183,28,28,0.3)",
    zIndex: 3,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "3px solid rgba(255,255,255,0.3)",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
    },
    "& i": {
      fontSize: "2.2rem",
      color: "#fff",
      marginLeft: "4px",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
    }
  },
  galleryLoadMore: {
    display: "flex",
    justifyContent: "center",
    marginTop: "3rem",
    marginBottom: "2rem",
  },
  loadMoreButton: {
    marginTop: "5rem",
    padding: "1rem 2rem",
    borderRadius: "30px",
    border: "none",
    background: `linear-gradient(135deg, ${THEME.colors.secondary} 0%, ${THEME.colors.secondaryDark} 100%)`,
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "& i": {
      fontSize: "1.1rem",
    }
  },
  newBadge: {
    background: "linear-gradient(45deg, #f44336, #d32f2f)",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: "1rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    boxShadow: "0 2px 8px rgba(244,67,54,0.3)",
  },
  categoryWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  categoryBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "#dc3545",
    color: "#fff",
    padding: "0.4rem 1.2rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: 600,
    zIndex: 3,
    boxShadow: "0 2px 8px rgba(220,53,69,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    textTransform: "lowercase"
  },
  videoPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 60,
    height: 60,
    background: "rgba(183,28,28,0.92)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(183,28,28,0.18)",
    zIndex: 2,
  },
  playIcon: {
    fontSize: "1.7rem",
    color: "#fff",
    marginLeft: 4
  },
  galleryHeader: {
    textAlign: "center",
    marginBottom: "4rem",
    position: "relative",
  },

  galleryTitle: {
    fontSize: "2.5rem",
    fontWeight: 800,
    fontFamily: "var(--bs-font-primary)",
    background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, ${THEME.colors.secondary} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 1rem 0",
    lineHeight: 1.2,
    position: "relative",
    "@media (max-width: 768px)": {
      fontSize: "2rem"
    }
  },

  gallerySubtitle: {
    fontSize: "1.2rem",
    color: THEME.colors.text.secondary,
    maxWidth: "700px",
    margin: "2rem auto 0 auto",
    lineHeight: 1.7,
    fontWeight: 400,
    fontFamily: "var(--bs-font-primary)",
    "@media (max-width: 768px)": {
      fontSize: "1rem"
    }
  },

  galleryFilters: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "0.5rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    "@media (max-width: 768px)": {
      padding: "1rem",
      gap: "0.8rem"
    }
  },

  filterButton: {
    padding: "0.8rem 1.5rem",
    borderRadius: "100px",
    border: "none",
    background: "transparent",
    color: "rgba(255, 255, 255, 0.79)",
    fontSize: "0.95rem",
    fontFamily: "var(--bs-font-primary)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: THEME.shadows.button,
    "&:hover": {
      background: "rgba(255,255,255,0.1)",
      transform: "translateY(-2px)",
    },
    "&.active": {
      background: "rgba(255, 255, 255, 0.94)",
      color: "#000",
    }
  },

  sortButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.8rem 1.5rem",
    background: "transparent",
    border: "none",
    borderRadius: "100px",
    color: "rgba(255, 255, 255, 0.79)",
    fontSize: "0.95rem",
    fontFamily: "var(--bs-font-primary)",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    }
  },

  sortSelect: {
    appearance: "none",
    background: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.79)",
    fontSize: "0.95rem",
    fontFamily: "var(--bs-font-primary)",
    fontWeight: 500,
    cursor: "pointer",
    padding: "0.8rem 1.5rem",
    paddingRight: "2.5rem",
    borderRadius: "100px",
    transition: "all 0.2s ease",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.79)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.79)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
    },
    "& option": {
      background: "#fff",
      color: "#333",
    }
  },

  cardActionBar: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    display: "flex",
    gap: "0.5rem",
    zIndex: 5,
  },

  cardActionBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      color: '#ec4899',
      background: '#fbcfe8',

    },
    "& i": {
      fontSize: "1rem"
    },
    "&.active": {
      background: '#fbcfe8',
      color: '#ec4899',
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
  actionButtonsFixed: {
    position: 'fixed',
    right: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  shareButton: {
    position: 'relative',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '12px 24px 12px 28px',
    borderRadius: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '-6px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: '6px solid #000',
    },
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
  circleButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    color: '#666',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '& svg': {
      width: '24px',
      height: '24px',
    },
  },
  tooltip: {
    position: 'absolute',
    right: 'calc(100% + 8px)',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
    zIndex: 1001,
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '-4px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderTop: '4px solid transparent',
      borderBottom: '4px solid transparent',
      borderLeft: '4px solid rgba(0, 0, 0, 0.75)',
    },
  },
  buttonWithTooltip: {
    position: 'relative',
    '&:hover .tooltip': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #DBE2EF',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    background: '#fff',
    gap: '16px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
    fontFamily: "'Sarabun', 'Inter', sans-serif",
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  headerActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  headerActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#f8f9fa',
    color: '#666',
    '&:hover': {
      transform: 'scale(1.05)',
      background: '#f1f5f9',
    },
    '&.liked': {
      background: '#fce7f3',
      color: '#ec4899',
      '&:hover': {
        background: '#fbcfe8',
      },
    },
    '&.bookmarked': {
      background: '#fce7f3',
      color: '#ec4899',
      '&:hover': {
        background: '#fbcfe8',
      },
    },
    '&.download': {
      background: 'rgba(255, 0, 0, 0.8)',
      color: '#fff',
      fontSize: '1.2rem',
      padding: '12px 24px',
      width: 'auto',
      borderRadius: '24px',
      fontWeight: 600,
      display: 'flex',
      gap: '8px',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
  actionCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#3F72AF',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 600,
  },
  closeButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    flex: 1, 
    overflowY: 'auto',
    padding: '1rem 7rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '60vh',
    objectFit: 'contain',
    borderRadius: '16px',
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '20px',
    '& h3': {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#112D4E',
      fontFamily: "'Sarabun', 'Inter', sans-serif",
    },
  },
  previewMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#64748b',
      fontSize: '0.95rem',
      '& svg': {
        color: '#3F72AF',
        fontSize: '1.1rem',
      },
    },
  },

  mainContent: {
    display: "block",
    gridTemplateColumns: '65% 35%',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    }
  },

  contentMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    '& img': {
      width: '100%',
      height: 'auto',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: '8px'
    },
    '& iframe, & video': {
      width: '100%',
      height: '80vh',
      borderRadius: '8px'
    }
  },

  sideContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      paddingTop: '1.5rem'
    }
  },

  previewDescription: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: '#444',
    margin: '0rem 6rem',
    padding: '1rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadowbottom: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },

  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },

  previewTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#fff',
    color: THEME.colors.secondary,
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
  },

  relatedSection: {
    padding: '1.5rem',
    borderRadius: '16px',
    marginTop: '2rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    '& h4': {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: '1.25rem',
    }
  },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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
  relatedCard: {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      "& $relatedImage": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      },
      "& $relatedTitle": {
        opacity: 1,
        transform: "translateY(0)",
      },
      "& $relatedActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  relatedImageBox: {
    width: "100%",
    aspectRatio: "1/0.6", // กำหนดสัดส่วน 1:0.9
    position: "relative",
    overflow: "hidden",
    background: "#f8f9fa",
    borderRadius: "20px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
  },
  relatedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // หรือ "contain" แล้วแต่ต้องการ
    objectPosition: "center", // จัดตำแหน่งรูปให้อยู่กลาง
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  relatedTitle: {
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
  relatedActionBar: {
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
  relatedActionBtn: {
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
  relatedInfo: {
    padding: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "12px",
  },
  relatedStats: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#94a3b8",
      fontSize: "0.92rem",
      fontWeight: 400,
      "& svg": {
        color: "#94a3b8",
        fontSize: "1.05rem",
      }
    }
  },

  '@keyframes modalFadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },

  filterGroup: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    background: "rgba(215, 210, 210, 0.24)",
    borderRadius: "120px",
    backdropFilter: "blur(10px)",
    justifyContent: "flex-end",
    width: "fit-content",      
    marginLeft: "auto"          
  },  

  filterTab: {
    padding: "0.8rem 1.8rem",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "100px",
    color: "rgba(111, 111, 111, 0.69)",
    fontSize: "0.95rem",
    fontFamily: "var(--bs-font-primary)",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "100px",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      color: "rgba(0, 0, 0, 0.98)",
      "&:before": {
        opacity: 1,
      }
    },
    "&.active": {
      background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
      color: "#000",
      fontWeight: 600,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      transform: "translateY(-1px)",
    }
  },

  categoryShowcase: {
    padding: "4rem 0",
    background: "#fff",
    borderTop: "1px solid rgba(0,0,0,0.1)",
  },
  
  categoryShowcaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    width: "100%",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      padding: "0 1rem",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    }
  },
  
  categoryCard: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    aspectRatio: "1",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      "& $categoryImage": {
        transform: "scale(1.1)",
      },
      "& $categoryOverlay": {
        background: "rgba(0,0,0,0.7)",
      },
      "& $categoryTitle": {
        transform: "translateY(-10px)",
      },
      "& $categoryDescription": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  
  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  
  categoryOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1.5rem",
    textAlign: "center",
    transition: "background 0.3s ease",
  },
  
  categoryTitle: {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 600,
    margin: 0,
    transition: "transform 0.3s ease",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  
  categoryDescription: {
    color: "#fff",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.3s ease",
    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
  },

  showcaseTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "3rem",
    color: "#112D4E",
    "& span": {
      display: "block",
      fontSize: "1.1rem",
      fontWeight: 400,
      color: "#666666",
      marginTop: "0.5rem",
    }
  },

  buttonContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    
  },

  categoryCount: {
    fontSize: '0.85rem',
    color: '#666',
    marginLeft: '0.5rem',
  },
  buttonLabel: {
    fontSize: '14px',
    color: '#666',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    fontWeight: '500',
    '&.visible': {
      opacity: 1,
    },
  },
  shareMenu: {
    position: 'absolute',
    right: 'calc(100% + 16px)',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
    minWidth: '200px',
    zIndex: 1001,
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },
  shareMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#666',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
     detailsPopup: {
     position: 'fixed',
     top: '50%',
     left: '50%',
     transform: 'translate(-50%, -50%)',
     backgroundColor: '#fff',
     borderRadius: '12px',
     boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
     width: '90%',
     maxWidth: '500px',
     zIndex: 10001,
   },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
    '& h2': {
      margin: 0,
      fontSize: '20px',
      fontWeight: '600',
    },
  },
  popupContent: {
    padding: '24px',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
    marginBottom: '24px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .label': {
      fontSize: '14px',
      color: '#666',
    },
    '& .value': {
      fontSize: '24px',
      fontWeight: '600',
    },
  },
  dateInfo: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
  },
  tagsSection: {
    '& h3': {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '12px',
    },
  },
  detailsTagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  detailsTag: {
    padding: '6px 12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '100px',
    fontSize: '14px',
    color: '#666',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000,
  },
  popupCloseButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#666',
    '&:hover': {
      color: '#000',
    },
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
  readMoreButton: {
    background: 'none',
    border: 'none',
    color: '#3F72AF',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 16px',
    margin: '8px auto',
    display: 'block',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      textDecoration: 'underline',
      transform: 'translateY(-2px)'
    }
  },
});

const embedYouTube = (url: string): string => {
  if (!url) return "";
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
  return idMatch?.[1]
    ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0&modestbranding=1`
    : url;
};

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  
  if (isYouTube) {
    const videoId = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/)?.[1];
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : src;
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
        <iframe
          width="100%"
          height="600"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ maxWidth: '100%', maxHeight: '70vh' }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
      <video
        src={src}
        controls
        autoPlay
        style={{ maxWidth: '100%', maxHeight: '70vh' }}
      />
    </div>
  );
};

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [heroIndex, setHeroIndex] = useState(0);
  const [imageResources, setImageResources] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [gallerySortBy, setGallerySortBy] = useState("latest");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState(13);
  const itemsPerLoad = 13;
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(null);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>(() => {
    const savedLikes = localStorage.getItem('likes');
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const filteredGalleryItems = useMemo(() => {
    let items = resourcesData.resources;

    if (galleryFilter !== "all") {
      items = items.filter(item => {
        if (["image", "video", "graphic"].includes(galleryFilter)) {
          return item.type === galleryFilter;
        } else {
          return Array.isArray(item.category) 
            ? item.category.includes(galleryFilter)
            : item.category === galleryFilter;
        }
      });
    }

    return items.sort((a, b) => {
      switch (gallerySortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popular":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "downloads":
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        default:
          return 0;
      }
    });
  }, [galleryFilter, gallerySortBy]);

  const handleSearch = useCallback(() => {
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }, [searchTerm, navigate]);

  const handlePreview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const handleBookmark = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const isBookmarked = prev.some(b => b.id === item.id);
      if (isBookmarked) {
        return prev.filter(b => b.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleDownload = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const url = item.fileUrl ? `${import.meta.env.BASE_URL}${item.fileUrl.replace(/^\//, '')}` : item.thumbnailUrl;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${item.title}.${blob.type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + itemsPerLoad);
  };

  const handleLike = (item: any) => {
    const newLikes = { ...likes };
    const newLikeCounts = { ...likeCounts };

    if (newLikes[item.id]) {
      delete newLikes[item.id];
      newLikeCounts[item.id] = (newLikeCounts[item.id] || 0) - 1;
    } else {
      newLikes[item.id] = true;
      newLikeCounts[item.id] = (newLikeCounts[item.id] || 0) + 1;
    }

    setLikes(newLikes);
    setLikeCounts(newLikeCounts);
    localStorage.setItem('likes', JSON.stringify(newLikes));
  };

  const renderHeroTemplate = (item: { imageUrl: string;}) => (
    <div style={{ position: "relative", minHeight: 420 }}>
      <img
        src={item.imageUrl}
        className={classes.heroImage}
      />
    </div>
  );

  const renderCategoryButton = (category: { label: string; value: string }) => (
    <button
      key={category.value}
      onClick={() => setSelectedCategory(category.value)}
      style={{
        padding: "0.6rem 1.75rem",
        borderRadius: 24,
        border: selectedCategory === category.value ? `2px solid ${THEME.colors.secondary}` : `2px solid ${THEME.colors.border}`,
        background: selectedCategory === category.value ? THEME.colors.secondary : THEME.colors.background.main,
        color: selectedCategory === category.value ? THEME.colors.text.light : THEME.colors.text.primary,
        fontWeight: 600,
        fontSize: "1rem",
        boxShadow: selectedCategory === category.value 
          ? `0 3px 10px ${THEME.colors.secondary}33` 
          : "0 2px 5px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: `all ${ANIMATION_DURATION.NORMAL}ms ease`,
      }}
    >
      {category.label}
    </button>
  );

  const clampStyle = (lines: number) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden"
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && visibleItems < filteredGalleryItems.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleItems(prev => prev + itemsPerLoad);
            setIsLoading(false);
          }, 500); // Add a small delay to prevent rapid loading
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [visibleItems, filteredGalleryItems.length, isLoading]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .custom-photo-mask {
        backdrop-filter: blur(8px);
      }

      /* Smooth scrolling for gallery */
      .gallery-scroll-container {
        scroll-behavior: smooth;
      }

      /* Custom scrollbar for gallery filters */
      .gallery-filters::-webkit-scrollbar {
        height: 6px;
      }

      .gallery-filters::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
        border-radius: 10px;
      }

      .gallery-filters::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #3F72AF, #112D4E);
        border-radius: 10px;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const images = resourcesData.resources
      .filter((resource) => resource.type === "image" || resource.type === "graphic" || resource.type === "video")
      .slice(0, 15);

    const loadImages = async () => {
      const loadedImages = await Promise.all(
        images.map((img) =>
          new Promise((resolve) => {
            const image = new window.Image();
            image.src = img.thumbnailUrl;
            
            const handleLoad = () => resolve({
              ...img,
              src: img.thumbnailUrl,
              width: image.naturalWidth || 400,
              height: image.naturalHeight || 300,
              key: img.id,
              title: img.title,
            });
            
            const handleError = () => resolve({
              ...img,
              src: img.thumbnailUrl,
              width: 800,
              height: 600,
              key: img.id,
              title: img.title,
            });
            
            image.onload = handleLoad;
            image.onerror = handleError;
          })
        )
      );
      
      setImageResources(loadedImages as Photo[]);
    };

    loadImages();
  }, []);

  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || '',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show notification that link was copied
    }
  };

  return (
    <>
      <div className={classes.heroWrapper}>
        <img 
          src={HERO_DATA[heroIndex].imageUrl}
          alt="hero background"
          className={classes.heroBackground}
        />
        <div className={classes.searchContainer}>
        <div className={classes.galleryFilters}>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "all" ? "active" : ""}`}
              onClick={() => setGalleryFilter("all")}
            >
              <i className="pi pi-images" style={{ marginRight: "0.5rem" }} />
              ทั้งหมด
            </button>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "image" ? "active" : ""}`}
              onClick={() => setGalleryFilter("image")}
            >
              <i className="pi pi-image" style={{ marginRight: "0.5rem" }} />
              รูปภาพ
            </button>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "video" ? "active" : ""}`}
              onClick={() => setGalleryFilter("video")}
            >
              <i className="pi pi-video" style={{ marginRight: "0.5rem" }} />
              วิดีโอ
            </button>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "graphic" ? "active" : ""}`}
              onClick={() => setGalleryFilter("graphic")}
            >
              <i className="pi pi-palette" style={{ marginRight: "0.5rem" }} />
              กราฟฟิก
            </button>
            
          </div>
          <div className={classes.searchBox}>
            <i className={`pi pi-search ${classes.searchIcon}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="ค้นหารูปภาพ วิดีโอ เพลง และอื่นๆ..."
              className={classes.searchInput}
              aria-label="ค้นหา"
            />
          </div>
            <div className={classes.trendingTags}>
              {TRENDING_KEYWORDS.map((keyword, index) => (
                <button
                  key={index}
                  className={classes.trendingTag}
                  onClick={() => {
                    setSearchTerm(keyword.text);
                    handleSearch();
                  }}
                >
                  {keyword.text}
                </button>
              ))}
            </div>
          </div>
        </div>

      <section className={classes.gallerySection}>
        <div className={classes.galleryContainer}>
          <div className={classes.galleryHeader}>
            <div className={classes.gallerySubtitle}>
            </div>
          </div>
          
          <div className={classes.filterGroup}>
          
            <button 
              className={`${classes.filterTab} ${gallerySortBy === "latest" ? "active" : ""}`}
              onClick={() => setGallerySortBy("latest")}
            >
              ล่าสุด
            </button>
            <button 
              className={`${classes.filterTab} ${gallerySortBy === "popular" ? "active" : ""}`}
              onClick={() => setGallerySortBy("popular")}
            >
              ยอดนิยม
            </button>
            <button 
              className={`${classes.filterTab} ${gallerySortBy === "downloads" ? "active" : ""}`}
              onClick={() => setGallerySortBy("downloads")}
            >
              ยอดดาวน์โหลดมาก
            </button>
      </div>

          <div className={classes.galleryGrid}>
            <PhotoProvider
              maskOpacity={0.8}
              maskClassName="custom-photo-mask"
              photoClosable={true}
              bannerVisible={false}
            >
              {filteredGalleryItems.slice(0, visibleItems).map((item, index) => (
                <div
                  key={item.id}
                  className={classes.galleryItem}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease forwards",
                  }}
                >
                  <PhotoView src={item.thumbnailUrl ? `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}` : item.fileUrl}>
                    <img
                      src={item.thumbnailUrl ? `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}` : item.fileUrl}
                      alt={item.title}
                      className={classes.galleryImage}
                      loading="lazy"
                    />
                  </PhotoView>

                  <div className={classes.cardActionBar} onClick={e => e.stopPropagation()}>
                    <button 
                      className={`${classes.cardActionBtn} ${likes[item.id] ? 'active' : ''}`}
                      title={likes[item.id] ? "ยกเลิกถูกใจ" : "ถูกใจ"}
                      aria-label={likes[item.id] ? "ยกเลิกถูกใจ" : "ถูกใจ"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item);
                      }}
                    >
                      <i className={`pi ${likes[item.id] ? 'pi-heart-fill' : 'pi-heart'}`} />
                    </button>
                    <button 
                      className={`${classes.cardActionBtn} ${bookmarks.some(b => b.id === item.id) ? 'active' : ''}`}
                      title={bookmarks.some(b => b.id === item.id) ? "ลบบุ๊คมาร์ค" : "บุ๊คมาร์ค"}
                      aria-label={bookmarks.some(b => b.id === item.id) ? "ลบบุ๊คมาร์ค" : "บุ๊คมาร์ค"}
                      onClick={(e) => handleBookmark(e, item)}
                    >
                      <i className={`pi ${bookmarks.some(b => b.id === item.id) ? 'pi-bookmark-fill' : 'pi-bookmark'}`} />
                      </button>
                    <button 
                      className={classes.cardActionBtn}
                      title="ดาวน์โหลด"
                      aria-label="ดาวน์โหลด"
                      onClick={(e) => handleDownload(e, item)}
                    >
                      <i className="pi pi-download" />
                    </button>
                  </div>
                  <div 
                    className={`likeButton ${likes[item.id] ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item);
                    }}
                  >
                    {likeCounts[item.id] !== undefined ? likeCounts[item.id] : 0} ครั้ง
                    <i className={`pi ${likes[item.id] ? 'pi-heart-fill' : 'pi-heart'}`} style={{ color: likes[item.id] ? '#dc3545' : 'inherit' }} />
                  </div>

                  {item.type === "video" && (
                    <div className={classes.videoPlayButton}>
                      <i className={`pi pi-play ${classes.playIcon}`} />
                    </div>
                  )}

                  {(Array.isArray(item.category) ? item.category[0] : item.category) && (
                    <div className={classes.categoryBadge}>
                      {Array.isArray(item.category) ? item.category[0] : item.category}
                    </div>
                  )}

                  <div className={classes.galleryOverlay}>
                    <div className={classes.galleryItemTitle}>{item.title}</div>
                    <div className={classes.galleryItemMeta}>
                      <span>
                        <i className="pi pi-eye" /> {item.viewCount || 0}
                      </span>
                      <span>
                        <i className="pi pi-download" /> {item.downloadCount || 0}
                      </span>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className={classes.galleryTags}>
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className={classes.galleryTag}>
                            <i className="pi pi-tag" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => {
                      setSelectedItem(item);
                      setIsPreviewOpen(true);
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 4,
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                </div>
              ))}
            </PhotoProvider>
          </div>
        </div>
      </section>

      {visibleItems < filteredGalleryItems.length && (
        <div className={classes.buttonContainer}>
          <button 
            className={classes.loadMoreButton}
            onClick={() => setVisibleItems(prev => Math.min(prev + itemsPerLoad, filteredGalleryItems.length))}
          >
            โหลดเพิ่มเติม
          </button>
        </div>
      )}

      {isPreviewOpen && selectedItem && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={selectedItem?.title || ""}
        >
          {selectedItem && (
            <div className={classes.previewModal} onClick={() => setIsPreviewOpen(false)}>
              <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
                <div className={classes.modalHeader}>
                  <h2 className={classes.modalTitle}>{selectedItem.title}</h2>
                  <div className={classes.modalActions}>
                    <div className={classes.headerActions}>
                      <button
                        className={`${classes.headerActionBtn} ${likes[selectedItem.id] ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(selectedItem);
                        }}
                        title={likes[selectedItem.id] ? 'เลิกถูกใจ' : 'ถูกใจ'}
                      >
                        {likes[selectedItem.id] ? <IoHeartSharp /> : <IoHeartOutline />}
                        {likeCounts[selectedItem.id] > 0 && (
                          <span className={classes.actionCount}>{likeCounts[selectedItem.id]}</span>
                        )}
                      </button>
                      <button
                        className={`${classes.headerActionBtn} ${bookmarks.some(bookmark => bookmark.id === selectedItem.id) ? 'bookmarked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(e, selectedItem);
                        }}
                        title={bookmarks.some(bookmark => bookmark.id === selectedItem.id) ? 'นำออกจากบุ๊กมาร์ก' : 'เพิ่มในบุ๊กมาร์ก'}
                      >
                        {bookmarks.some(bookmark => bookmark.id === selectedItem.id) ? <IoBookmark /> : <IoBookmarkOutline />}
                      </button>
                      <button 
                        className={`${classes.headerActionBtn} download`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(e, selectedItem);
                        }}
                      >
                        <FaDownload />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  </div>
                  <div className={classes.closeButtonContainer}>
                    <button className={classes.closeButton} onClick={() => setIsPreviewOpen(false)}>
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className={classes.modalBody}>
                  <div className={classes.mainContent}>
                    <div className={classes.contentMain}>
                      {selectedItem.type === 'video' && selectedItem.videoUrl ? (
                        <VideoPlayer
                          src={selectedItem.videoUrl}
                          title={selectedItem.title}
                        />
                      ) : (
                        <img
                          src={selectedItem.thumbnailUrl ? `${import.meta.env.BASE_URL}${selectedItem.thumbnailUrl.replace(/^\//, '')}` : selectedItem.fileUrl}
                          alt={selectedItem.title}
                          style={{ maxWidth: '100%', maxHeight: '70vh' }}
                        />
                      )}
                    </div>
                    <div className={classes.previewInfo}>
                      <div className={classes.actionButtonsFixed}>
                        <div 
                          className={classes.buttonContainer}
                          onMouseEnter={(e) => {
                            const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                            if (label) {
                              label.classList.add('visible');
                            }
                          }}
                          onMouseLeave={(e) => {
                            const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                            if (label) {
                              label.classList.remove('visible');
                            }
                          }}
                        >
                          <button 
                            className={classes.circleButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(selectedItem);
                            }}
                          >
                            <IoShareSocialSharp />
                          </button>
                          <div className={classes.buttonLabel}>Share</div>
                        </div>
                        <div 
                          className={classes.buttonContainer}
                          onMouseEnter={(e) => {
                            const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                            if (label) {
                              label.classList.add('visible');
                            }
                          }}
                          onMouseLeave={(e) => {
                            const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                            if (label) {
                              label.classList.remove('visible');
                            }
                          }}
                        >
                          <button 
                            className={classes.circleButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDetailsPopup(true);
                            }}
                          >
                            <IoEllipsisVerticalCircle />
                          </button>
                          <div className={classes.buttonLabel}>More</div>
                        </div>
                      </div>
                      <p className={classes.previewDescription}>
                        {selectedItem.description && selectedItem.description.length > 200 
                          ? (showFullDescription 
                              ? selectedItem.description 
                              : selectedItem.description.substring(0, 200) + '...')
                          : selectedItem.description}
                      </p>
                      {selectedItem.description && selectedItem.description.length > 200 && (
                        <button 
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className={classes.readMoreButton}
                        >
                          {showFullDescription ? 'แสดงน้อยลง' : 'อ่านเพิ่มเติม'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={classes.relatedSection}>
                    <h4>รายการที่เกี่ยวข้อง</h4>
                    <div className={classes.relatedGrid}>
                      {filteredGalleryItems
                        .filter(item => 
                          item.id !== selectedItem.id && 
                          (item.category === selectedItem.category || 
                           (Array.isArray(item.tags) && Array.isArray(selectedItem.tags) &&
                            item.tags.some(tag => selectedItem.tags.includes(tag))))
                        )
                        .slice(0, 6)
                        .map(item => (
                          <div
                            key={item.id}
                            className={classes.relatedCard}
                            onClick={() => {
                              setSelectedItem(item);
                            }}
                          >
                            <div className={classes.relatedImageBox}>
                              <img
                                src={item.thumbnailUrl ? `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}` : item.fileUrl}
                                alt={item.title}
                                className={classes.relatedImage}
                              />
                              <div className={classes.relatedTitle}>{item.title}</div>
                              
                            </div>
                            <div className={classes.relatedInfo}>
                              <span style={{fontSize: '0.92rem', color: '#64748b', fontWeight: 400}}>
                                {item.category}
                              </span>
                              <div className={classes.relatedStats}>
                                <span className="stat">
                                  <IoHeart />
                                  {likeCounts[item.id] || 0}
                                </span>
                                <span className="stat">
                                  <IoEye />
                                  {item.viewCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      <section className={classes.categoryShowcase}>
        <h2 className={classes.showcaseTitle}>
          หมวดหมู่ทรัพยากร
          <span>ค้นพบทรัพยากรที่หลากหลายในแต่ละหมวดหมู่</span>
        </h2>
        <div className={classes.categoryShowcaseGrid}>
          {Object.entries(
            resourcesData.resources.reduce((acc, item) => {
              const categories = Array.isArray(item.category) ? item.category : [item.category];
              categories.forEach(cat => {
                if (!cat) return;
                if (!acc[cat]) {
                  acc[cat] = {
                    count: 1,
                    image: item.thumbnailUrl || item.fileUrl,
                    description: `ทรัพยากรในหมวดหมู่ ${cat}`
                  };
                } else {
                  acc[cat].count++;
                }
              });
              return acc;
            }, {} as Record<string, { count: number; image: string; description: string }>)
          ).map(([category, data]) => (
            <div 
              key={category} 
              className={classes.categoryCard}
              onClick={() => {
                setGalleryFilter(category.toLowerCase());
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={data.image} 
                alt={category} 
                className={classes.categoryImage}
                loading="lazy"
              />
              <div className={classes.categoryOverlay}>
                <h3 className={classes.categoryTitle}>{category}</h3>
                <p className={classes.categoryDescription}>
                  {data.description}
                  <br />
                  <span className={classes.categoryCount}>{data.count} รายการ</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div 
        className={classes.buttonContainer}
        style={{ position: 'relative' }}
        onMouseEnter={(e) => {
          const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
          if (label) {
            label.classList.add('visible');
          }
        }}
        onMouseLeave={(e) => {
          const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
          if (label) {
            label.classList.remove('visible');
          }
        }}
      >
      </div>

      {showDetailsPopup && (
        <>
          <div className={classes.modalBackdrop} onClick={() => setShowDetailsPopup(false)} />
           <div className={classes.detailsPopup}>
              <div className={classes.popupHeader}>
                <h2>Shot details</h2>
                <button className={classes.popupCloseButton} onClick={() => setShowDetailsPopup(false)}>
                  <FaTimes />
                </button>
              </div>
            <div className={classes.popupContent}>
              <div className={classes.statsRow}>
                <div className={classes.statItem}>
                  <span className="label">ยอดดู</span>
                  <span className="value">{selectedItem?.viewCount || 0}</span>
                </div>
                <div className={classes.statItem}>
                  <span className="label">ยอดดาวน์โหลด</span>
                  <span className="value">{selectedItem?.downloadCount || 0}</span>
                </div>
                <div className={classes.statItem}>
                  <span className="label">ยอดถูกใจ</span>
                  <span className="value">{likeCounts[selectedItem?.id] || 0}</span>
                </div>                
              </div>
              <div className={classes.dateInfo}>
                โพสต์เมื่อ: {new Date(selectedItem?.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className={classes.tagsSection}>
                <h3>Tags</h3>
                <div className={classes.detailsTagsList}>
                  {selectedItem?.tags?.map((tag: string, index: number) => (
                    <span key={index} className={classes.detailsTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainPage;
