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

const THEME = {
  colors: {
    primary: "#b71c1c",
    primaryLight: "rgba(183,28,28,0.9)",
    primaryDark: "#8f1616",
    secondary: "#1a237e",
    text: {
      primary: "#212121",
      secondary: "#666666",
      light: "#ffffff"
    },
    background: {
      main: "#ffffff",
      light: "#f8f9fa",
      gradient: "linear-gradient(120deg,#f6fafd 70%,#fbeee6 100%)"
    },
    border: "#eeeeee"
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
    card: "0 4px 20px rgba(0,0,0,0.08)",
    cardHover: "0 8px 30px rgba(0,0,0,0.12)",
    button: "0 2px 8px rgba(0,0,0,0.15)"
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
    imageUrl: "/mock/hero-1.jpg",
  },
  {
    id: "h2",
    titlemain: "งานวิจัยเปลี่ยนโลก",
    subtitle: "สำรวจงานวิจัยสุดล้ำจากมหาวิทยาลัยขอนแก่น",
    imageUrl: "/mock/hero-2.jpg",
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
      backgroundColor: THEME.colors.primary,
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
    color: "#b71c1c",
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    letterSpacing: "0.5px",
  },
  
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    color: "#333",
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
    borderRadius: 24,
    overflow: "hidden",
    minWidth: 290,
    width: 340,
    maxWidth: "90vw",
    aspectRatio: "1 / 1.1",
    boxShadow: "0 8px 36px rgba(137,45,5,0.10), 0 2px 8px rgba(34,34,34,0.1)",
    cursor: "pointer",
    background: "#fff",
    transition: `transform ${ANIMATION_DURATION.NORMAL}ms ease, box-shadow ${ANIMATION_DURATION.NORMAL}ms ease`,
    "&:hover": {
      transform: "translateY(-6px) scale(1.04)",
      boxShadow: "0 16px 42px rgba(183,28,28,0.13), 0 4px 12px rgba(51,51,51,0.2)"
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
    backgroundColor: "rgba(0,0,0,0.9)",
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
    boxShadow: '0 3px 18px rgba(51,51,51,0.2)',
    width: 50,
    height: 50,
    fontSize: 26,
    color: '#b71c1c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${ANIMATION_DURATION.NORMAL}ms ease`,
    '&:hover': {
      background: '#b71c1c',
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
    background: '#4057ef',
  },

  photoGalleryContainer: {
    maxWidth: 1100,
    margin: "0 auto 60px auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 8px 30px rgba(137, 45, 5, 0.08)",
    padding: "24px",
    "@media (max-width: 768px)": {
      padding: "16px",
      borderRadius: 12,
    }
  },

  scrollToTopButton: {
    position: "fixed",
    bottom: 34,
    right: 34,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#6e7682",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 16px rgba(51,51,51,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    zIndex: 12345,
    cursor: "pointer",
    transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
    "&:hover": {
      background: "#b71c1c",
      transform: "scale(1.1)",
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
      background: THEME.colors.primaryLight,
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
    padding: '2.5rem 0 2rem 0',
    marginTop: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '1.2rem',
    letterSpacing: 0.5,
    fontFamily: 'Sarabun, sans-serif',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1.2rem',
    width: '100%',
    maxWidth: 540,
  },
  statsCard: {
    borderRadius: 20,
    minWidth: 0,
    padding: '1.2rem 0.5rem 1.1rem 0.5rem',
    textAlign: 'center',
    fontFamily: 'Sarabun, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(51,51,51,0.07)',
    transition: 'box-shadow 0.18s cubic-bezier(.4,2,.6,1), transform 0.18s cubic-bezier(.4,2,.6,1)',
    cursor: 'default',
    border: '1px solid #f0f0f0',
  },
  statsIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    opacity: 0.85,
  },
  statsNumber: {
    fontSize: '1.7rem',
    fontWeight: 800,
    marginBottom: '0.2rem',
    letterSpacing: 1,
  },
  statsLabel: {
    fontSize: '1.05rem',
    fontWeight: 600,
    letterSpacing: 0.2,
    color: '#333',
  },
  recommendedCard: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
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
    minHeight: 460,
    maxHeight: 460,
    '@media (max-width: 600px)': {
      minWidth: 220,
      maxWidth: '90vw',
      width: '90vw',
      height: 'auto',
      minHeight: 180,
      maxHeight: 'none',
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
    padding: "0.9rem 1.2rem 0.9rem 1.2rem",
    border: "none",
    borderRadius: "1.7rem 0 0 1.7rem",
    outline: "none",
    background: "#fafbfc",
    color: "#444",
    fontFamily: "inherit",
    boxShadow: "none",
    transition: "box-shadow 0.18s, border 0.18s",
    height: 52,
    fontWeight: 500,
    '@media (max-width: 600px)': {
      fontSize: 15,
      padding: '0.7rem 0.8rem 0.7rem 0.8rem',
      height: 40,
    }
  },
  searchButton: {
    fontSize: 22,
    padding: "0 2.1rem",
    border: "none",
    borderRadius: "0 1.7rem 1.7rem 0",
    background: "#b71c1c",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    height: 52,
    transition: "background 0.2s, box-shadow 0.18s",
    marginLeft: -2,
    boxShadow: "0 2px 10px rgba(183,28,28,0.10)",
    outline: "none",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
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
        {/* --- Horizontal Scrollable Card Row --- */}
        <div style={{ position: "relative", width: "100%", overflow: "hidden", margin: "0 auto 2rem auto" }}>
          {/* Arrow Left */}
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
                      src={photo.src}
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
                  {/* Overlay info */}
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
        <div style={{ fontSize: '1.1rem', fontWeight: 400 }}>{item.subtitle}</div>
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
        border: selectedCategory === category.value ? "2px solid #b71c1c" : "2px solid #ddd",
        background: selectedCategory === category.value ? "#b71c1c" : "#fff",
        color: selectedCategory === category.value ? "#fff" : "#333",
        fontWeight: 600,
        fontSize: "1rem",
        boxShadow: selectedCategory === category.value 
          ? "0 3px 10px rgba(183,28,28,0.25)" 
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
            boxShadow: "0 4px 18px rgba(44,62,80,0.09)",
            borderRadius: 28,
            background: "#fafbfc",
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
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #ffd6d6"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"}
            />
            <button
              onClick={handleSearch}
              className={classes.searchButton}
              aria-label="ค้นหา"
              onMouseOver={e => e.currentTarget.style.background = "#a31515"}
              onMouseOut={e => e.currentTarget.style.background = "#b71c1c"}
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
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          borderBottom: "1px solid #eee" 
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 className={classes.sectionTitle}>รายการแนะนำ</h2>
              <p style={{
                fontSize: "1.1rem",
                color: "#666",
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
                        src={item.thumbnailUrl}
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
          background: "linear-gradient(135deg, #ffffff 0%, #f6f8fa 100%)", 
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
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className={classes.image}
                  loading="lazy"
                />
                <div className={classes.content}>
                  <div className={classes.categoryText}>
  {Array.isArray(item.category)
    ? item.category.join(", ")
    : (item.category?.toUpperCase?.() || "ทั่วไป")
  }
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
                    <div style={{ color: "#777", fontSize: "0.8rem", fontWeight: 500 }}>
                      <i className="pi pi-calendar" style={{ marginRight: "0.4rem", fontSize: "0.9em", color: "#888" }} />
                      {new Date(item.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div style={{ color: "#777", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <i className="pi pi-eye" style={{ fontSize: "0.9em", color: "#888" }} />
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
          background: "#fff",
          padding: "4rem 0",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#111",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Sarabun', sans-serif"
              }}>
                วิดีโอแนะนำ
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
                        src={item.thumbnailUrl}
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
                background: "rgba(20,20,20,0.8)",
                color: "#fff",
                fontSize: 24,
                lineHeight: '36px',
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
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

      <section className={classes.statsSection}>
        <h3 className={classes.statsTitle}>
          สถิติแยกตามหมวดหมู่
        </h3>
        <div className={classes.statsGrid}>
          {[
            {
              key: 'medical',
              label: 'การแพทย์',
              icon: 'pi pi-heart',
              bg: 'rgba(25, 118, 210, 0.08)',
              color: '#1976d2',
            },
            {
              key: 'education',
              label: 'การศึกษา',
              icon: 'pi pi-book',
              bg: 'rgba(255, 193, 7, 0.10)',
              color: '#b85c38',
            },
            {
              key: 'campus',
              label: 'รอบรั้ว',
              icon: 'pi pi-building',
              bg: 'rgba(156, 39, 176, 0.08)',
              color: '#7c4dff',
            },
          ].map(cat => {
            const count = resourcesData.resources.filter(r => {
              if (Array.isArray(r.category)) {
                return r.category.includes(cat.key);
              }
              return r.category === cat.key;
            }).length;
            return (
              <div
                key={cat.key}
                className={classes.statsCard}
                style={{ background: cat.bg, borderColor: cat.bg }}
              >
                <i className={`${cat.icon} ${classes.statsIcon}`} style={{ color: cat.color }} />
                <div className={classes.statsNumber} style={{ color: cat.color }}>{count}</div>
                <div className={classes.statsLabel}>{cat.label}</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MainPage;