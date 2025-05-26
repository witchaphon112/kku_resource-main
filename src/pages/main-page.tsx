import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUseStyles } from "react-jss";
import PhotoAlbum from "react-photo-album";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Modal from "react-modal";
import { FaArrowUp } from "react-icons/fa";

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

  // Hero section
  fullWidthHero: {
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
    position: "relative",
    overflow: "hidden",
    marginBottom: THEME.layout.sectionSpacing,
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

  // Scroll components
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

  // Card components
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

  // Image components
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

  // Video components
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
    bottom: 28,
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

  // Section Containers
  sectionContainer: {
    maxWidth: THEME.layout.maxWidth,
    margin: "0 auto",
    padding: `0 ${THEME.layout.containerPadding}`,
    "@media (max-width: 768px)": {
      padding: "0 1rem"
    }
  },

  // Grid Layouts
  gridContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${THEME.layout.cardMinWidth}, 1fr))`,
    gap: THEME.spacing.xl,
    alignItems: "stretch",
    "@media (max-width: 768px)": {
      gap: THEME.spacing.md
    }
  },

  // Tags
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "auto",
    paddingTop: THEME.spacing.md
  },

  tag: {
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
});

const embedYouTube = (url) => {
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
}

interface PhotoGalleryProps {
  photos: Photo[];
  classes: {
    photoGalleryContainer: string;
    sectionHeader: string;
    sectionTitle: string;
    sectionLink: string;
  };
}

const renderPhotoGallery = ({ photos, classes }: PhotoGalleryProps) => (
  <section style={{ 
    background: "#fff",
    padding: "4rem 0",
    borderTop: "1px solid #eee"
  }}>
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 1.5rem"
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: "3rem"
      }}>
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
        <Link 
          to="/gallery" 
          style={{
            color: "#b71c1c",
            fontSize: "1.1rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500
          }}
        >
          ชมภาพทั้งหมด
          <i className="pi pi-arrow-right" style={{ fontSize: "0.9em" }} />
        </Link>
      </div>

      <PhotoProvider>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              style={{
                position: "relative",
                borderRadius: "1rem",
                overflow: "hidden",
                cursor: "pointer",
                aspectRatio: "4/3",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.transform = "translateY(-8px)";
                target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.transform = "translateY(0)";
                target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
              <PhotoView index={index} src={photo.src}>
                <img
                  src={photo.src}
                  alt={photo.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                />
              </PhotoView>
              
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                opacity: 0,
                transition: "opacity 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
              >
                <h3 style={{
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: "0 0 0.5rem 0",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                  {photo.title}
                </h3>
                
                {photo.category && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#fff",
                    fontSize: "0.9rem",
                    opacity: 0.9
                  }}>
                    <i className="pi pi-folder" style={{ fontSize: "0.9rem" }} />
                    {photo.category}
                  </div>
                )}

                {photo.tags && photo.tags.length > 0 && (
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.75rem",
                    flexWrap: "wrap"
                  }}>
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.8rem",
                        color: "#fff",
                        backdropFilter: "blur(4px)"
                      }}>
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
    </div>
  </section>
);

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const scrollRefRecommended = useRef(null);

  const [heroIndex, setHeroIndex] = useState(0);
  const [imageResources, setImageResources] = useState<Photo[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Photo | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("image");

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
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [selectedCategory, resourcesData.resources]);

  const videoResources = useMemo(
    () => resourcesData.resources
      .filter((resource) => resource.type === "video")
      .slice(0, 12),
    []
  );

  // Event handlers
  const handleHeroNavigation = useCallback((direction) => {
    setHeroIndex((prevIndex) =>
      direction === 1
        ? (prevIndex + 1) % HERO_DATA.length
        : (prevIndex - 1 + HERO_DATA.length) % HERO_DATA.length
    );
  }, []);

  const handleScrollHorizontally = useCallback((ref, direction) => {
    if (ref.current) {
      const scrollAmount = (ref.current.children[0]?.offsetWidth || 300) + 32;
      ref.current.scrollLeft += direction * scrollAmount;
    }
  }, []);

  const handleOpenModal = useCallback((item, index) => {
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

  const handleNavigateModalVideo = useCallback((direction) => {
    const newIndex = currentVideoIndex + direction;
    if (newIndex >= 0 && newIndex < videoResources.length) {
      setCurrentVideo(videoResources[newIndex]);
      setCurrentVideoIndex(newIndex);
    }
  }, [currentVideoIndex, videoResources]);
  console.log([...new Set(resourcesData.resources.map(r => r.type))]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const graphicItems = resourcesData.resources.filter(
  r => r.type && r.type.toLowerCase() === "graphic"
);
console.log("กราฟฟิกใน mock", graphicItems);

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
      
      setImageResources(loadedImages);
    };

    loadImages();
  }, []);

  // Render helpers
  const renderHeroTemplate = (item) => (
    <div style={{ position: "relative", minHeight: 420 }}>
      <img
        src={item.imageUrl}
        alt={item.titlemain}
        className={classes.heroImage}
      />
      <div className={classes.captionMain}>
        <div className={classes.heroTitle}>{item.titlemain}</div>
        <div className={classes.subtitle}>{item.subtitle}</div>
      </div>
    </div>
  );

  const renderCategoryButton = (category) => (
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

  return (
    <>
      <div className={classes.fullWidthHero}>
        {renderHeroTemplate(HERO_DATA[heroIndex])}
        
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

      {/* RECOMMENDED SECTION */}
      {recommended.length > 0 && (
        <section style={{ 
          padding: "4rem 0", 
          background: "linear-gradient(to bottom, #fff 0%, #f8f9fa 100%)",
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
              alignItems: "stretch"
            }}>
              {recommended.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  onClick={() => navigate(`/resource/${item.id}`)}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                  }}
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
                    }}>
                      {item.title}
                    </h3>

                    {item.description && (
                      <p style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
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
          </div>
        </section>
      )}

      {filteredNewItems.length > 0 && (
        <section style={{ background: "#fff", padding: "2rem 1rem 3rem 1rem", marginBottom: "2rem" }}>
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
                        <span key={idx} className={classes.tag}>
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

      {imageResources.length > 0 && renderPhotoGallery({ photos: imageResources, classes })}

      {/* VIDEO RECOMMEND SECTION */}
      {videoResources.length > 0 && (
        <section style={{
          background: "linear-gradient(120deg,#f6fafd 70%,#fbeee6 100%)",
          padding: "54px 0 60px 0",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}>
          <div className={classes.photoGalleryContainer}>
            <div className={classes.sectionHeader}>
              <h2 className={classes.sectionTitle}>วิดีโอแนะนำ</h2>
              <p style={{
                fontSize: "1.1rem",
                color: "#666",
                marginTop: "0.5rem",
                marginBottom: "2rem",
                textAlign: "center",
                maxWidth: "600px",
                margin: "0.5rem auto 2rem"
              }}>
                รวมวิดีโอที่น่าสนใจเกี่ยวกับมหาวิทยาลัยขอนแก่น
              </p>
              <Link to="/gallery?category=video" className={classes.sectionLink}>
                ดูวิดีโอทั้งหมด <i className="pi pi-arrow-right" style={{ marginLeft: "0.3rem" }} />
              </Link>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
              justifyContent: "center",
              margin: "0 auto",
              maxWidth: "1400px",
              padding: "1rem",
            }}>
              {videoResources.slice(0, 6).map((item, index) => (
                <article
                  key={item.id}
                  onClick={() => handleOpenModal(item, index)}
                  title={item.title}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 30px rgba(183,28,28,0.15)",
                    }
                  }}
                >
                  <div style={{ 
                    position: "relative",
                    paddingBottom: "56.25%",
                    background: "#000",
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
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "60px",
                      height: "60px",
                      background: "rgba(183,28,28,0.9)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(183,28,28,0.3)",
                      "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.1)",
                        background: "rgba(183,28,28,1)",
                      }
                    }}>
                      <i className="pi pi-play" style={{ 
                        fontSize: "1.5rem", 
                        color: "#fff",
                        marginLeft: "4px"
                      }} />
                    </div>
                    {item.duration && (
                      <div style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        background: "rgba(0,0,0,0.8)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}>
                        {item.duration}
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    flexGrow: 1,
                  }}>
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#1a237e",
                      lineHeight: 1.4,
                      margin: 0,
                    }}>
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {item.description}
                      </p>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginTop: "auto",
                      }}>
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            style={{
                              background: "#f5f5f5",
                              color: "#666",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <i className="pi pi-tag" style={{ fontSize: "0.7rem" }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop: "1px solid #eee",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#666",
                        fontSize: "0.85rem",
                      }}>
                        <i className="pi pi-calendar" style={{ fontSize: "0.9rem" }} />
                        {new Date(item.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#666",
                        fontSize: "0.85rem",
                      }}>
                        <i className="pi pi-eye" style={{ fontSize: "0.9rem" }} />
                        {item.viewCount || 0} ครั้ง
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO MODAL */}
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

    </>
  );
};

export default MainPage;