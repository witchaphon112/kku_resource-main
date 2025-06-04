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
    hero: "56.25%", 
    card: "66%",    
    thumbnail: "75%" 
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
    transition: `transform ${ANIMATION_DURATION.SLOW}ms ease`,
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
  gallerySection: {
    padding: "5rem 0",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23f0f4f8\" opacity=\"0.3\"/></svg>') repeat",
      backgroundSize: "50px 50px",
      opacity: 0.5,
      pointerEvents: "none"
    }
  },
  galleryContainer: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 2rem",
    position: "relative",
    zIndex: 1,
    "@media (max-width: 768px)": {
      padding: "0 1rem"
    }
  },
  galleryHeader: {
    textAlign: "center",
    marginBottom: "4rem",
    position: "relative",
  },
  galleryTitle: {
    fontSize: "3rem",
    fontWeight: 800,
    background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, ${THEME.colors.secondary} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 1rem 0",
    fontFamily: THEME.typography.fontFamily,
    lineHeight: 1.2,
    position: "relative",
    "@media (max-width: 768px)": {
      fontSize: "2.2rem"
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-15px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "5px",
      background: `linear-gradient(90deg, ${THEME.colors.secondary}, ${THEME.colors.primary})`,
      borderRadius: "10px",
      boxShadow: `0 2px 10px ${THEME.colors.secondary}33`,
    }
  },
  gallerySubtitle: {
    fontSize: "1.2rem",
    color: THEME.colors.text.secondary,
    maxWidth: "700px",
    margin: "2rem auto 0 auto",
    lineHeight: 1.7,
    fontWeight: 400,
    "@media (max-width: 768px)": {
      fontSize: "1rem"
    }
  },
  galleryFilters: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "3rem",
    flexWrap: "wrap",
    padding: "2rem",
    background: "rgba(255,255,255,0.7)",
    borderRadius: "25px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    "@media (max-width: 768px)": {
      padding: "1.5rem 1rem",
      gap: "1rem"
    }
  },
  filterButton: {
    padding: "1rem 2rem",
    borderRadius: "20px",
    border: "2px solid transparent",
    background: THEME.colors.background.main,
    color: THEME.colors.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
      transition: "left 0.5s",
    },
    "&:hover": {
      background: `linear-gradient(135deg, ${THEME.colors.secondary} 0%, ${THEME.colors.secondaryDark} 100%)`,
      color: "#fff",
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 8px 25px rgba(63,114,175,0.3)",
      borderColor: THEME.colors.secondary,
      "&::before": {
        left: "100%"
      }
    },
    "&.active": {
      background: `linear-gradient(135deg, ${THEME.colors.secondary} 0%, ${THEME.colors.secondaryDark} 100%)`,
      color: "#fff",
      borderColor: THEME.colors.secondary,
      boxShadow: "0 6px 20px rgba(63,114,175,0.25)",
      transform: "translateY(-2px)",
    },
    "@media (max-width: 768px)": {
      padding: "0.8rem 1.5rem",
      fontSize: "0.9rem"
    }
  },
  sortSelect: {
    padding: "1rem 1.5rem",
    borderRadius: "20px",
    border: "2px solid rgba(0,0,0,0.1)",
    fontSize: "1rem",
    background: THEME.colors.background.main,
    color: THEME.colors.text.primary,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    fontWeight: 500,
    minWidth: "180px",
    "&:hover": {
      borderColor: THEME.colors.secondary,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    },
    "&:focus": {
      outline: "none",
      borderColor: THEME.colors.secondary,
      boxShadow: `0 0 0 3px ${THEME.colors.secondary}33`,
    },
    "@media (max-width: 768px)": {
      minWidth: "150px",
      padding: "0.8rem 1.2rem"
    }
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "2.5rem",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem"
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem"
    }
  },
  galleryItem: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    aspectRatio: "4/3",
    cursor: "pointer",
    background: THEME.colors.background.main,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(45deg, rgba(63,114,175,0.1) 0%, rgba(17,45,78,0.1) 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
      zIndex: 1,
    },
    "&:hover": {
      transform: "translateY(-12px) scale(1.02)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      "&::before": {
        opacity: 1,
      },
      "& $galleryImage": {
        transform: "scale(1.15) rotate(2deg)",
      },
      "& $galleryOverlay": {
        opacity: 1,
        transform: "translateY(0)",
      },
      "& $galleryPlayButton": {
        transform: "translate(-50%, -50%) scale(1.2)",
        boxShadow: "0 8px 30px rgba(183,28,28,0.4)",
      }
    },
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: "brightness(0.95) contrast(1.05)",
  },
  galleryOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)",
    opacity: 0,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    color: "#fff",
    zIndex: 2,
    transform: "translateY(20px)",
  },
  galleryItemTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "0.8rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  galleryItemMeta: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    fontSize: "1rem",
    opacity: 0.95,
    marginBottom: "1rem",
    "& span": {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "rgba(255,255,255,0.15)",
      padding: "0.4rem 0.8rem",
      borderRadius: "12px",
      backdropFilter: "blur(4px)",
      fontWeight: 500,
    },
    "& i": {
      fontSize: "1.1rem",
    },
  },
  galleryTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.6rem",
    marginTop: "0.5rem",
  },
  galleryTag: {
    background: "rgba(255,255,255,0.2)",
    padding: "0.4rem 1rem",
    borderRadius: "15px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontWeight: 500,
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.3)",
      transform: "translateY(-2px)",
    },
    "& i": {
      fontSize: "0.8rem",
    },
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
    marginTop: "4rem",
  },
  loadMoreButton: {
    padding: "1.2rem 3rem",
    borderRadius: "25px",
    border: "none",
    background: `linear-gradient(135deg, ${THEME.colors.secondary} 0%, ${THEME.colors.secondaryDark} 100%)`,
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `0 8px 25px ${THEME.colors.secondary}33`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      transition: "left 0.5s",
    },
    "&:hover": {
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: `0 12px 35px ${THEME.colors.secondary}40`,
      "&::before": {
        left: "100%"
      }
    },
    "&:active": {
      transform: "translateY(-1px) scale(1.02)",
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

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, navigate }) => {
  const classes = useStyles();
  const displayPhotos = photos.slice(0, 8);

  return (
    <section className={classes.gallerySection}>
      <div className={classes.galleryContainer}>
        <div className={classes.galleryHeader}>
          <h2 className={classes.galleryTitle}>คลังภาพแนะนำ</h2>
          <p className={classes.gallerySubtitle}>
            รวบรวมภาพและวิดีโอคุณภาพสูง จากมหาวิทยาลัยขอนแก่น เพื่อการเรียนรู้และแรงบันดาลใจ
          </p>
        </div>

        <div className={classes.galleryFilters}>
          <button className={`${classes.filterButton} active`}>
            <i className="pi pi-images" style={{ marginRight: "0.5rem" }} />
            ทั้งหมด
          </button>
          <button className={classes.filterButton}>
            <i className="pi pi-image" style={{ marginRight: "0.5rem" }} />
            รูปภาพ
          </button>
          <button className={classes.filterButton}>
            <i className="pi pi-video" style={{ marginRight: "0.5rem" }} />
            วิดีโอ
          </button>
          <select className={classes.sortSelect}>
            <option value="latest">🕒 ล่าสุด</option>
            <option value="popular">🔥 ยอดนิยม</option>
            <option value="downloads">📥 ดาวน์โหลดมาก</option>
          </select>
        </div>

        <div className={classes.galleryGrid}>
          <PhotoProvider
            maskOpacity={0.8}
            maskClassName="custom-photo-mask"
            photoClosable={true}
            bannerVisible={false}
          >
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className={classes.galleryItem}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.6s ease forwards",
                }}
              >
                <PhotoView src={photo.src}>
                  <img
                    src={photo.thumbnailUrl ? `${import.meta.env.BASE_URL}${photo.thumbnailUrl.replace(/^\//, '')}` : photo.src}
                    alt={photo.title}
                    className={classes.galleryImage}
                    loading="lazy"
                  />
                </PhotoView>

                {photo.videoUrl && (
                  <div className={classes.galleryPlayButton}>
                    <i className="pi pi-play" />
                  </div>
                )}

                {photo.category && (
                  <div className={classes.categoryBadge}>
                    {Array.isArray(photo.category) ? photo.category[0] : photo.category}
                  </div>
                )}

                <div className={classes.galleryOverlay}>
                  <div className={classes.galleryItemTitle}>{photo.title}</div>
                  <div className={classes.galleryItemMeta}>
                    <span>
                      <i className="pi pi-eye" /> {Math.floor(Math.random() * 1000) + 100}
                    </span>
                    <span>
                      <i className="pi pi-download" /> {Math.floor(Math.random() * 100) + 20}
                    </span>
                  </div>
                  {photo.tags && photo.tags.length > 0 && (
                    <div className={classes.galleryTags}>
                      {photo.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={classes.galleryTag}>
                          <i className="pi pi-tag" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  onClick={() => navigate(`/resource/${photo.id}`)}
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

        <div className={classes.galleryLoadMore}>
          <button
            className={classes.loadMoreButton}
            onClick={() => navigate('/gallery')}
          >
            <i className="pi pi-arrow-right" style={{ marginRight: "0.8rem" }} />
            ดูทั้งหมด
            <i className="pi pi-external-link" style={{ marginLeft: "0.8rem", fontSize: "0.9rem" }} />
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
  const [selectedCategory, setSelectedCategory] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [gallerySortBy, setGallerySortBy] = useState("latest");

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

  const filteredGalleryItems = useMemo(() => {
    let items = resourcesData.resources.filter(item => 
      item.type === "image" || item.type === "video"
    );

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
    }).slice(0, 12);
  }, [galleryFilter, gallerySortBy]);

  const handleHeroNavigation = useCallback((direction: number) => {
    setHeroIndex((prevIndex) =>
      direction === 1
        ? (prevIndex + 1) % HERO_DATA.length
        : (prevIndex - 1 + HERO_DATA.length) % HERO_DATA.length
    );
  }, []);

  const handleSearch = useCallback(() => {
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }, [searchTerm, navigate]);

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

  const clampStyle = (lines: number) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden"
  });

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
            {filteredNewItems.map((item, index) => (
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
                    {index === 0 && (
                      <span style={{
                        background: "linear-gradient(45deg, #f44336, #d32f2f)",
                        color: "#fff",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "1rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        boxShadow: "0 2px 8px rgba(244,67,54,0.3)",
                        marginRight: "0.8rem",
                      }}>
                        <i className="pi pi-clock" style={{ fontSize: "0.9rem" }} />
                        ใหม่
                      </span>
                    )}
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

      <section className={classes.gallerySection}>
        <div className={classes.galleryContainer}>
          <div className={classes.galleryHeader}>
            <h2 className={classes.galleryTitle}>คลังสื่อแนะนำ</h2>
            <div className={classes.gallerySubtitle}>
              รวบรวมรูปภาพและวิดีโอที่น่าสนใจ เพื่อการเรียนรู้ที่หลากหลาย
            </div>
          </div>

          <div className={classes.galleryFilters}>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "image" ? "active" : ""}`}
              onClick={() => setGalleryFilter("image")}
            >
              รูปภาพ
            </button>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "video" ? "active" : ""}`}
              onClick={() => setGalleryFilter("video")}
            >
              วิดีโอ
            </button>
            <button 
              className={`${classes.filterButton} ${galleryFilter === "graphic" ? "active" : ""}`}
              onClick={() => setGalleryFilter("graphic")}
            >
              กราฟฟิก
            </button>
            <select
              className={classes.sortSelect}
              value={gallerySortBy}
              onChange={(e) => setGallerySortBy(e.target.value)}
              style={{ minWidth: 150 }}
            >
              <option value="latest">ล่าสุด</option>
              <option value="popular">ยอดนิยม</option>
              <option value="downloads">ดาวน์โหลดมาก</option>
            </select>
          </div>

          <div className={classes.galleryGrid}>
            {filteredGalleryItems.map((item) => (
              <div 
                key={item.id}
                className={classes.galleryItem}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                  alt={item.title}
                  className={classes.galleryImage}
                  loading="lazy"
                />
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
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </>
  );
};

export default MainPage;