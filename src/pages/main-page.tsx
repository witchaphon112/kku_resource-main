import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Modal from "react-modal";

import resourcesData from "../mock/resources.json";
import "react-photo-view/dist/react-photo-view.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import hero1 from '../assets/hero-1.jpg';

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
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3
    },
    h3: {
      fontSize: "1.1rem",
      fontWeight: 600,
      lineHeight: 1.4
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.5
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
    hero: "56.25%", // 16:9
    card: "66%",    // 3:2
    thumbnail: "75%" // 4:3
  }
};

const HERO_DATA = [
  {
    id: "h1",
    titlemain: "ภูมิอากาศและสิ่งแวดล้อมที่ มข.",
    subtitle: "มุ่งมั่นลดการปล่อยก๊าซเรือนกระจก และสร้างความยั่งยืน...",
    imageUrl: `${import.meta.env.BASE_URL}mock/hero-1.jpg`,
  },
  {
    id: "h2",
    titlemain: "งานวิจัยเปลี่ยนโลก",
    subtitle: "สำรวจงานวิจัยสุดล้ำจากมหาวิทยาลัยขอนแก่น",
    imageUrl: `${import.meta.env.BASE_URL}mock/hero-2.jpg`,
  },
];

const CATEGORY_OPTIONS = [
  { label: "รูปภาพ", value: "image" },
  { label: "วิดีโอ", value: "video" },
  { label: "กราฟิก", value: "graphic" },
];

const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
};

const useStyles = createUseStyles({
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
      marginTop: "-56px",
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
      maxHeight: "600px",
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
      bottom: "1.5rem",
      left: "1rem",
      right: "1rem",
      padding: "1.25rem",
      textAlign: "center",
    }
  },
  
  heroTitle: {
    fontSize: "2.2rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    lineHeight: 1.2,
    "@media (max-width: 768px)": {
      fontSize: "1.6rem",
      marginBottom: "0.5rem",
    }
  },

  scrollWrapper: {
    position: "relative",
    margin: "0 auto",
    padding: "0 50px",
    boxSizing: "content-box",
    "@media (max-width: 768px)": {
      padding: "0 35px",
    }
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
    "@media (max-width: 768px)": {
      width: "36px",
      height: "36px",
      fontSize: "1.5rem",
    },
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
  
  leftButton: { 
    left: "0px",
    "@media (max-width: 768px)": {
      left: "5px",
    }
  },
  rightButton: { 
    right: "0px",
    "@media (max-width: 768px)": {
      right: "5px",
    }
  },
  
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
    "@media (max-width: 768px)": {
      gap: "1rem",
      padding: "0.75rem 0.25rem",
    }
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
    "@media (max-width: 768px)": {
      borderRadius: "0.5rem",
    }
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
    },
    "@media (max-width: 768px)": {
      borderRadius: THEME.borderRadius.md,
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
      minWidth: "250px",
      scrollSnapAlign: 'center',
    },
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderBottom: "1px solid #eee",
    transition: `transform ${ANIMATION_DURATION.SLOW}ms ease`,
    "@media (max-width: 768px)": {
      height: "180px",
    }
  },
  
  recommendedImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    "@media (max-width: 768px)": {
      height: "160px",
    }
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
    "@media (max-width: 768px)": {
      gap: "0.3rem",
      paddingTop: "0.4rem",
    }
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
    "@media (max-width: 768px)": {
      padding: "6px 14px",
      fontSize: "0.8rem",
    },
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
    "@media (max-width: 768px)": {
      padding: "0.75rem",
    }
  },
  
  categoryText: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: THEME.colors.secondary,
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    fontFamily: THEME.typography.fontFamily,
    letterSpacing: "0.5px",
    "@media (max-width: 768px)": {
      fontSize: "0.65rem",
      marginBottom: "0.25rem",
    }
  },
  
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontFamily: THEME.typography.fontFamily,
    color: THEME.colors.text.primary,
    lineHeight: 1.3,
    "@media (max-width: 768px)": {
      fontSize: "1rem",
      marginBottom: "0.4rem",
    }
  },

  featuredCardRow: {
    display: "flex",
    gap: 36,
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    margin: "0 auto 1.8rem auto",
    '@media (max-width: 900px)': { 
      gap: 18,
      margin: "0 auto 1.4rem auto",
    }
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
    "@media (max-width: 768px)": {
      minWidth: 260,
      width: "calc(100% - 2rem)",
      aspectRatio: "1 / 1",
      borderRadius: THEME.borderRadius.md,
    },
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
      width: "95%",
      margin: "1rem auto",
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
    padding: THEME.spacing.md,
    "@media (max-width: 768px)": {
      padding: THEME.spacing.sm,
    }
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
    "@media (max-width: 768px)": {
      width: 40,
      height: 40,
      fontSize: 22,
    },
    '&:hover': {
      background: THEME.colors.secondary,
      color: '#fff',
      transform: 'translateY(-50%) scale(1.12)',
    }
  },
  
  carouselArrowLeft: { 
    left: 36,
    "@media (max-width: 768px)": {
      left: 16,
    }
  },
  carouselArrowRight: { 
    right: 36,
    "@media (max-width: 768px)": {
      right: 16,
    }
  },
  
  carouselIndicators: {
    position: 'absolute',
    bottom: 170,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 14,
    zIndex: 2,
    "@media (max-width: 768px)": {
      bottom: 120,
      gap: 10,
    }
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
    "@media (max-width: 768px)": {
      width: 12,
      height: 12,
    },
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
      margin: "0 auto 40px auto",
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
    "@media (max-width: 768px)": {
      bottom: 24,
      right: 24,
      width: 48,
      height: 48,
      fontSize: 24,
    },
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
      transition: "transform 0.5s ease"
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
  searchInput: {
    width: "100%",
    maxWidth: 560,
    minWidth: 140,
    fontSize: 20,
    padding: "0.9rem 1.2rem",
    border: "none",
    borderRadius: "1.7rem 0 0 1.7rem",
    outline: "none",
    background: "#fafbfc",
    color: THEME.colors.text.primary,
    fontFamily: "inherit",
    boxShadow: "none",
    transition: "box-shadow 0.18s, border 0.18s",
    height: 52,
    fontWeight: 500,
    '&:focus': {
      boxShadow: `0 0 0 2px ${THEME.colors.secondary}33`,
    },
    '@media (max-width: 600px)': {
      fontSize: 15,
      padding: '0.7rem 0.8rem',
      height: 40,
    }
  },
  searchButton: {
    fontSize: 22,
    padding: "0 2.1rem",
    border: "none",
    borderRadius: "0 1.7rem 1.7rem 0",
    background: THEME.colors.secondary,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    height: 52,
    transition: "background 0.2s, box-shadow 0.18s",
    marginLeft: -2,
    boxShadow: `0 2px 10px ${THEME.colors.secondary}33`,
    outline: "none",
    '&:hover': {
      background: THEME.colors.secondaryDark,
      boxShadow: `0 4px 15px ${THEME.colors.secondary}40`,
    },
    '@media (max-width: 600px)': {
      fontSize: 16,
      padding: '0 1.1rem',
      height: 40,
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

interface PhotoGalleryProps {
  photos: Photo[];
  navigate: (path: string) => void;
}

const renderPhotoGallery = ({ photos, navigate }: Omit<PhotoGalleryProps, 'classes'>) => {
  const displayPhotos = photos.slice(0, 6);
  return (
    <section style={{ background: "#fff", padding: "4rem 0", borderTop: "1px solid #eee" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#111",
            margin: "0 0 0.5rem 0",
            fontFamily: "'Sarabun', sans-serif"
          }}>
            คลังภาพแนะนำ
          </h2>
          <div style={{
            width: "40px",
            height: "4px",
            background: "#b71c1c",
            margin: "0 auto 1rem auto",
            borderRadius: "2px"
          }} />
        </div>
        <div style={{ position: "relative", width: "100%", overflow: "hidden", margin: "0 auto 2rem auto" }}>
          <button
            onClick={() => {
              const el = document.getElementById("photo-scroll");
              if (el) el.scrollBy({ left: -380, behavior: "smooth" });
            }}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #ddd",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 22,
              color: "#b71c1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              transition: "all 0.18s",
              opacity: 0.85
            }}
            aria-label="เลื่อนไปก่อนหน้า"
          >
            <i className="pi pi-chevron-left" />
          </button>
          <PhotoProvider>
            <div
              id="photo-scroll"
              style={{
                display: "flex",
                gap: 28,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                padding: "0.5rem 2.5rem",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                const el = e.currentTarget;
                if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                  el.scrollLeft += e.deltaY;
                  e.preventDefault();
                }
              }}
            >
              {displayPhotos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: "relative",
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    minWidth: 320,
                    maxWidth: 360,
                    width: 320,
                    flex: "0 0 320px",
                    scrollSnapAlign: "center",
                    aspectRatio: "4/3",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                    cursor: "pointer",
                    background: "#f8f9fa",
                    transition: "transform 0.25s, box-shadow 0.25s"
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.16)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
                  }}
                >
                  <div
                    onClick={() => navigate(`/resource/${photo.id}`)}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      zIndex: 2,
                      cursor: "pointer",
                      background: "rgba(0,0,0,0)",
                    }}
                  />
                  <PhotoView src={photo.src}>
                    <img
                      src={photo.thumbnailUrl ? `${import.meta.env.BASE_URL}${photo.thumbnailUrl.replace(/^\//, '')}` : photo.src}
                      alt={photo.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s"
                      }}
                    />
                  </PhotoView>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "1.2rem",
                      background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 100%)",
                      color: "#fff",
                      transition: "opacity 0.3s",
                      zIndex: 3,
                      pointerEvents: "none"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                      {photo.title}
                    </div>
                    {photo.category && (
                      <div style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: 4 }}>
                        <i className="pi pi-folder" style={{ marginRight: 6, fontSize: "0.9em" }} />
                        {photo.category}
                      </div>
                    )}
                    {photo.tags && photo.tags.length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: 4 }}>
                        {photo.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} style={{
                            background: "rgba(255,255,255,0.13)",
                            borderRadius: 12,
                            padding: "2px 10px",
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 500
                          }}>
                            <i className="pi pi-tag" style={{ fontSize: "0.8em" }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </PhotoProvider>
          <button
            onClick={() => {
              const el = document.getElementById("photo-scroll");
              if (el) el.scrollBy({ left: 380, behavior: "smooth" });
            }}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #ddd",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 22,
              color: "#b71c1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              transition: "all 0.18s",
              opacity: 0.85
            }}
            aria-label="เลื่อนไปถัดไป"
          >
            <i className="pi pi-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [heroIndex, setHeroIndex] = useState(0);
  const [imageResources, setImageResources] = useState<Photo[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Photo | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");

  const recommended = useMemo(
    () => [...resourcesData.resources]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10),
    []
  );

  const filteredNewItems = useMemo(() => {
    return resourcesData.resources
      .filter(resource =>
        resource && resource.type &&
        resource.type.toLowerCase() === selectedCategory.toLowerCase()
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [selectedCategory, resourcesData.resources]);

  const videoResources = useMemo(
    () => resourcesData.resources
      .filter((resource) => resource.type === "video")
      .slice(0, 12),
    []
  );

  const handleHeroNavigation = useCallback((direction: number) => {
    setHeroIndex((prevIndex) =>
      direction === 1
        ? (prevIndex + 1) % HERO_DATA.length
        : (prevIndex - 1 + HERO_DATA.length) % HERO_DATA.length
    );
  }, []);

  const handleOpenModal = useCallback((item: any, index: number) => {
    setModalOpen(true);
    setCurrentVideo(item);
    setCurrentVideoIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentVideo(null);
    document.body.style.overflow = "auto";
  }, []);

  const handleNavigateModalVideo = useCallback((direction: number) => {
    const newIndex = currentVideoIndex + direction;
    if (newIndex >= 0 && newIndex < videoResources.length) {
      const resource = videoResources[newIndex];
      setCurrentVideo({
        id: resource.id,
        src: resource.thumbnailUrl || '',
        key: resource.id,
        title: resource.title,
        width: 1280,
        height: 720,
        category: Array.isArray(resource.category) ? resource.category.join(', ') : resource.category,
        tags: resource.tags,
      });
      setCurrentVideoIndex(newIndex);
    }
  }, [currentVideoIndex, videoResources]);

  useEffect(() => {
    const images = resourcesData.resources
      .filter((resource) => resource.type === "image" || resource.type === "graphic")
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

  const renderHeroTemplate = (item: { imageUrl: string; titlemain: string; subtitle?: string }) => (
    <div style={{ position: "relative", minHeight: 420 }}>
      <img
        src={item.imageUrl}
        alt={item.titlemain}
        className={classes.heroImage}
      />
      <div className={classes.captionMain}>
        <div className={classes.heroTitle}>{item.titlemain}</div>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 400,
          color: THEME.colors.text.light,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {item.subtitle}
        </div>
      </div>
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

  const handleSearch = useCallback(() => {
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }, [searchTerm, navigate]);

  const clampStyle = (lines: number) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden"
  });

  return (
    <>
      <div className={classes.fullWidthHero}>
        {renderHeroTemplate(HERO_DATA[heroIndex])}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 32,
          marginBottom: 16,
          width: "100%",
          flexDirection: "column"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 560,
            boxShadow: `0 4px 18px ${THEME.colors.secondary}15`,
            borderRadius: 28,
            background: THEME.colors.background.light,
            position: "relative"
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="ค้นหารูปภาพ วิดีโอ กราฟฟิก..."
              className={classes.searchInput}
              aria-label="ค้นหา"
            />
            <button
              onClick={handleSearch}
              className={classes.searchButton}
              aria-label="ค้นหา"
            >
              Search
            </button>
          </div>
        </div>
        
        <button
          className={`${classes.carouselArrowCustom} ${classes.carouselArrowLeft}`}
          onClick={() => handleHeroNavigation(-1)}
          aria-label="เลื่อนไปก่อนหน้า"
        >
          <i className="pi pi-chevron-left" />
        </button>
        
        <button
          className={`${classes.carouselArrowCustom} ${classes.carouselArrowRight}`}
          onClick={() => handleHeroNavigation(1)}
          aria-label="เลื่อนไปถัดไป"
        >
          <i className="pi pi-chevron-right" />
        </button>
        
        <div className={classes.carouselIndicators}>
          {HERO_DATA.map((_, index) => (
            <button
              key={index}
              className={`${classes.carouselDot} ${index === heroIndex ? classes.carouselDotActive : ""}`}
              onClick={() => setHeroIndex(index)}
              aria-label={`ไปยังสไลด์ ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {recommended.length > 0 && (
        <section style={{ 
          padding: "4rem 0", 
          background: THEME.colors.background.gradient,
          borderBottom: `1px solid ${THEME.colors.border}` 
        }}>
          <div style={{maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 className={classes.sectionTitle}>รายการแนะนำ</h2>
              <p style={{
                fontSize: "1.1rem",
                color: THEME.colors.text.secondary,
                maxWidth: "600px",
                margin: "1rem auto",
                lineHeight: 1.6
              }}>
                รวบรวมเนื้อหาที่น่าสนใจและเป็นที่นิยม เพื่อการเรียนรู้ที่หลากหลาย
              </p>
            </div>

            <div style={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              margin: "0 auto 2rem auto"
            }}>
              <button
                onClick={() => {
                  const el = document.getElementById("recommended-scroll");
                  if (el) el.scrollBy({ left: -380, behavior: "smooth" });
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  fontSize: 22,
                  color: "#b71c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "all 0.18s",
                  opacity: 0.85
                }}
                aria-label="เลื่อนไปก่อนหน้า"
              >
                <i className="pi pi-chevron-left" />
              </button>
              <div
                id="recommended-scroll"
                className={classes.recommendedScroll}
              >
                {recommended.slice(0, 10).map((item) => (
                  <article
                    key={item.id}
                    className={classes.recommendedCard}
                    onClick={() => navigate(`/resource/${item.id}`)}
                  >
                    <div style={{
                      position: "relative",
                      paddingTop: "66%",
                      overflow: "hidden"
                    }}>
                      <img
                        src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                        alt={item.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                      />
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)",
                      }} />
                      {item.type && (
                        <div style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          background: "rgba(183,28,28,0.9)",
                          color: "#fff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          backdropFilter: "blur(4px)",
                          textTransform: "capitalize"
                        }}>
                          {CATEGORY_OPTIONS.find(c => c.value === item.type)?.label || item.type}
                        </div>
                      )}
                    </div>

                    <div style={{
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      flexGrow: 1,
                    }}>
                      <h3 style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4,
                        color: "#1a237e",
                        ...clampStyle(2),
                      }}>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          margin: 0,
                          ...clampStyle(3),
                          lineHeight: 1.5
                        }}>
                          {item.description}
                        </p>
                      )}

                      <div style={{
                        marginTop: "auto",
                        paddingTop: "1rem",
                        borderTop: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}>
                          <i className="pi pi-eye" style={{ fontSize: "0.9rem" }} />
                          {item.viewCount || 0} ครั้ง
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}>
                          <i className="pi pi-download" style={{ fontSize: "0.9rem" }} />
                          {item.downloadCount || 0} ดาวน์โหลด
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById("recommended-scroll");
                  if (el) el.scrollBy({ left: 380, behavior: "smooth" });
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  fontSize: 22,
                  color: "#b71c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "all 0.18s",
                  opacity: 0.85
                }}
                aria-label="เลื่อนไปถัดไป"
              >
                <i className="pi pi-chevron-right" />
              </button>
            </div>
          </div>
        </section>
      )}

      {filteredNewItems.length > 0 && (
        <section style={{ 
          background: THEME.colors.background.gradient,
          padding: "2rem 1rem 3rem 1rem", 
          marginBottom: "2rem" 
        }}>
          <h2 className={classes.sectionTitle}>
            รายการใหม่ ({CATEGORY_OPTIONS.find((c) => c.value === selectedCategory)?.label})
          </h2>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "1rem", 
            marginBottom: "2.5rem", 
            flexWrap: "wrap" 
          }}>
            {CATEGORY_OPTIONS.map(renderCategoryButton)}
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}>
            {filteredNewItems.map((item) => (
              <article
                key={item.id}
                className={classes.resourceCard}
                onClick={() => navigate(`/resource/${item.id}`)}
                style={{ width: "100%" }}
                title={item.title}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                  alt={item.title}
                  className={classes.image}
                  loading="lazy"
                />
                <div className={classes.content}>
                  <div className={classes.categoryText}>
                    {Array.isArray(item.category)
                      ? item.category.join(", ")
                      : (item.category?.toUpperCase?.() || "ทั่วไป")}
                    {" • "}
                    {CATEGORY_OPTIONS.find((c) => c.value === item.type)?.label || item.type?.toUpperCase()}
                  </div>
                  <h3 className={classes.title}>{item.title}</h3>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    marginBottom: "0.75rem" 
                  }}>
                    <div style={{ 
                      color: THEME.colors.text.secondary, 
                      fontSize: "0.8rem", 
                      fontWeight: 500 
                    }}>
                      <i className="pi pi-calendar" style={{ 
                        marginRight: "0.4rem", 
                        fontSize: "0.9em", 
                        color: THEME.colors.secondary 
                      }} />
                      {new Date(item.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div style={{ 
                      color: THEME.colors.text.secondary, 
                      fontSize: "0.8rem", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.3rem" 
                    }}>
                      <i className="pi pi-eye" style={{ 
                        fontSize: "0.9em", 
                        color: THEME.colors.secondary 
                      }} />
                      {item.viewCount || 0} ครั้ง
                    </div>
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className={classes.tagList}>
                      {item.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className={classes.tagItem}>
                          <i
                            className="pi pi-tag"
                            style={{
                              marginRight: 4,
                              fontSize: "0.8em",
                              verticalAlign: "middle",
                              color: THEME.colors.secondary
                            }}
                          />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {imageResources.length > 0 && renderPhotoGallery({ photos: imageResources.slice(0, 6), navigate })}

      {videoResources.length > 0 && (
        <section style={{
          background: THEME.colors.background.main,
          padding: "4rem 0",
          borderTop: `1px solid ${THEME.colors.border}`,
          borderBottom: `1px solid ${THEME.colors.border}`,
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: THEME.colors.text.primary,
                margin: "0 0 0.5rem 0",
                fontFamily: THEME.typography.fontFamily
              }}>
                วิดีโอแนะนำ
              </h2>
              <div style={{
                width: "40px",
                height: "4px",
                background: THEME.colors.secondary,
                margin: "0 auto 1rem auto",
                borderRadius: "2px"
              }} />
            </div>
            <div style={{ position: "relative", width: "100%", overflow: "hidden", margin: "0 auto 2rem auto" }}>
              <button
                onClick={() => {
                  const el = document.getElementById("video-scroll");
                  if (el) el.scrollBy({ left: -380, behavior: "smooth" });
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  fontSize: 22,
                  color: "#b71c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "all 0.18s",
                  opacity: 0.85
                }}
                aria-label="เลื่อนไปก่อนหน้า"
              >
                <i className="pi pi-chevron-left" />
              </button>
              <div
                id="video-scroll"
                style={{
                  display: "flex",
                  gap: 28,
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  padding: "0.5rem 2.5rem",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                  const el = e.currentTarget;
                  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                    el.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }
                }}
              >
                {videoResources.slice(0, 10).map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      position: "relative",
                      borderRadius: "1.2rem",
                      overflow: "hidden",
                      minWidth: 340,
                      maxWidth: 360,
                      width: 340,
                      flex: "0 0 340px",
                      scrollSnapAlign: "center",
                      aspectRatio: "4/3",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                      cursor: "pointer",
                      background: "#f8f9fa",
                      transition: "transform 0.25s, box-shadow 0.25s"
                    }}
                    onClick={() => handleOpenModal(item, index)}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.16)";
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
                    }}
                    title={item.title}
                  >
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <img
                        src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s"
                        }}
                        loading="lazy"
                      />
                      <div style={{
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
                      }}>
                        <i className="pi pi-play" style={{ fontSize: "1.7rem", color: "#fff", marginLeft: 4 }} />
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "1.2rem",
                        background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0) 100%)",
                        color: "#fff",
                        transition: "opacity 0.3s",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                        {item.title}
                      </div>
                      {item.category && (
                        <div style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: 4 }}>
                          <i className="pi pi-folder" style={{ marginRight: 6, fontSize: "0.9em" }} />
                          {Array.isArray(item.category) ? item.category.join(', ') : item.category}
                        </div>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: 4 }}>
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} style={{
                              background: "rgba(255,255,255,0.13)",
                              borderRadius: 12,
                              padding: "2px 10px",
                              fontSize: "0.85rem",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontWeight: 500
                            }}>
                              <i className="pi pi-tag" style={{ fontSize: "0.8em" }} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById("video-scroll");
                  if (el) el.scrollBy({ left: 380, behavior: "smooth" });
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  fontSize: 22,
                  color: "#b71c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "all 0.18s",
                  opacity: 0.85
                }}
                aria-label="เลื่อนไปถัดไป"
              >
                <i className="pi pi-chevron-right" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className={classes.statsSection}>
        <h3 className={classes.statsTitle}>
          สถิติแยกตามหมวดหมู่
        </h3>
        <div className={classes.statsGrid}>
          {[
            {
              key: 'image',
              label: 'รูปภาพ',
              icon: 'pi pi-image',
              bg: '#F8FAFC',
              color: '#475569',
            },
            {
              key: 'video',
              label: 'วิดีโอ',
              icon: 'pi pi-video',
              bg: '#F9FAFB',
              color: '#4B5563',
            },
            {
              key: 'graphic',
              label: 'กราฟฟิก',
              icon: 'pi pi-images',
              bg: '#F8FAFC',
              color: '#475569',
            },
            {
              key: 'medical',
              label: 'การแพทย์',
              icon: 'pi pi-heart',
              bg: '#F9FAFB',
              color: '#4B5563',
            },
            {
              key: 'education',
              label: 'การศึกษา',
              icon: 'pi pi-book',
              bg: '#F8FAFC',
              color: '#475569',
            },
            {
              key: 'campus',
              label: 'รอบรั้ว',
              icon: 'pi pi-building',
              bg: '#F9FAFB',
              color: '#4B5563',
            },
          ].map(cat => {
            const count = resourcesData.resources.filter(r => {
              if (cat.key === 'image' || cat.key === 'video' || cat.key === 'graphic') {
                return r.type === cat.key;
              }
              if (Array.isArray(r.category)) {
                return r.category.includes(cat.key);
              }
              return r.category === cat.key;
            }).length;
            return (
              <div
                key={cat.key}
                className={classes.statsCard}
                style={{ 
                  background: cat.bg, 
                  borderColor: '#E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <i 
                  className={`${cat.icon} ${classes.statsIcon}`} 
                  style={{ 
                    color: cat.color,
                    background: '#F1F5F9',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    fontSize: '1.5rem'
                  }} 
                />
                <div 
                  className={classes.statsNumber} 
                  style={{ 
                    color: cat.color,
                    fontSize: '2rem',
                    fontWeight: 700,
                    lineHeight: 1.2
                  }}
                >
                  {count}
                </div>
                <div 
                  className={classes.statsLabel}
                  style={{
                    color: '#64748B',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    marginTop: '0.4rem'
                  }}
                >
                  {cat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Video Player Modal"
        className={classes.videoModal}
        overlayClassName={classes.videoModalOverlay}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        {currentVideo && (
          <>
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: -15,
                right: -15,
                zIndex: 10020,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: "50%",
                background: `${THEME.colors.primary}cc`,
                color: THEME.colors.text.light,
                fontSize: 24,
                lineHeight: '36px',
                cursor: "pointer",
                boxShadow: THEME.shadows.button,
                transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
              }}
              aria-label="ปิด"
            >
              ×
            </button>
            
            <div style={{
              width: "100%",
              aspectRatio: "16/9",
              background: "#000",
              borderRadius: "10px",
              overflow: "hidden",
            }}>
              {currentVideo.videoUrl && currentVideo.videoUrl.includes("youtu") ? (
                <iframe
                  key={currentVideo.id}
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    background: "#000",
                    border: 0,
                    display: "block",
                  }}
                  src={embedYouTube(currentVideo.videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentVideo.title}
                />
              ) : (
                <video
                  key={currentVideo.id}
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    background: "#000",
                    border: 0,
                    display: "block",
                  }}
                  src={currentVideo.fileUrl || currentVideo.videoUrl}
                  poster={currentVideo.thumbnailUrl}
                  controls
                  preload="metadata"
                  autoPlay
                />
              )}
            </div>
            
            <div style={{
              position: "absolute",
              bottom: -50,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(20,20,20,0.85)",
              borderRadius: 25,
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              zIndex: 10015,
              fontSize: 15,
              color: "#eee",
              fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
              fontWeight: 500,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
              <button
                onClick={() => handleNavigateModalVideo(-1)}
                disabled={currentVideoIndex === 0}
                style={{
                  background: "none",
                  border: "none",
                  color: currentVideoIndex === 0 ? "#777" : "#fff",
                  fontSize: 26,
                  cursor: currentVideoIndex === 0 ? "default" : "pointer",
                  padding: "0 10px",
                  transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
                }}
                aria-label="วิดีโอก่อนหน้า"
              >
                &#8249;
              </button>
              
              <span style={{
                margin: "0 15px",
                minWidth: "50px",
                textAlign: "center",
              }}>
                {currentVideoIndex + 1} / {videoResources.length}
              </span>
              
              <button
                onClick={() => handleNavigateModalVideo(1)}
                disabled={currentVideoIndex === videoResources.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  color: currentVideoIndex === videoResources.length - 1 ? "#777" : "#fff",
                  fontSize: 26,
                  cursor: currentVideoIndex === videoResources.length - 1 ? "default" : "pointer",
                  padding: "0 10px",
                  transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
                }}
                aria-label="วิดีโอถัดไป"
              >
                &#8250;
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default MainPage;