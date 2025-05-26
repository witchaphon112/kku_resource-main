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
    fontSize: "2rem",
    fontWeight: 700,
    color: "#212121",
    textAlign: "center",
    marginBottom: "0.5rem",
    position: "relative",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)", 
    "&::after": {
      content: '""',
      display: "block",
      width: "55px",
      height: "6px",
      backgroundColor: "#b71c1c",
      margin: "0.5rem auto 0",
      borderRadius: "4px",
    },
  },
  
  sectionHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "1.5rem",
    position: "relative",
  },
  
  sectionLink: {
    display: "inline-block",
    marginTop: "0.25rem",
    color: "#b71c1c",
    textDecoration: "none",
    fontStyle: "italic",
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    fontWeight: 500,
    fontSize: "1rem",
    transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
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
    marginBottom: "3rem",
    minHeight: 420,
    background: "#eee",
    marginTop: "-80px",
  },
  
  heroImage: {
    width: "100%",
    height: "calc(100vh - 80px)",
    maxHeight: "540px",
    minHeight: "700px",
    objectFit: "cover",
    objectPosition: "center center",
    filter: "brightness(0.97) saturate(1.08)",
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
    extend: "baseCard",
    flex: "0 0 auto",
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
    background: "#f0f0f0", 
    color: "#555", 
    fontSize: "0.7rem",
    borderRadius: "12px",
    padding: "3px 10px",
    fontWeight: 500,
    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
    letterSpacing: 0.2,
    lineHeight: 1.5,
    display: "inline-flex",
    alignItems: "center",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      background: "#b71c1c",
      color: "#fff",
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
    maxWidth: 1000,
    width: "calc(100% - 40px)",
    height: "auto",
    margin: "auto",
    padding: 0, 
    position: "relative", 
    outline: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  
  videoModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
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
});

const getFeaturedCategories = (resources, count = 3) => {
  const categoryMap = {};
  
  resources.forEach((resource) => {
    if (!categoryMap[resource.category]) {
      categoryMap[resource.category] = { 
        count: 0, 
        image: resource.thumbnailUrl 
      };
    }
    categoryMap[resource.category].count++;
  });
  
  return Object.entries(categoryMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, count)
    .map(([category, data]) => ({
      category,
      count: data.count,
      image: data.image, 
      link: `/gallery?category=${encodeURIComponent(category)}`
    }));
};

const embedYouTube = (url) => {
  if (!url) return "";
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
  return idMatch?.[1]
    ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0&modestbranding=1`
    : url;
};

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const scrollRefRecommended = useRef(null);

  const [heroIndex, setHeroIndex] = useState(0);
  const [imageResources, setImageResources] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("image");

  const featuredCategories = useMemo(
    () => getFeaturedCategories(resourcesData.resources, 3),
    []
  );

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
        <section style={{ padding: "2rem 0", textAlign: "center", background: "#fdfdfd", marginBottom: "2rem" }}>
          <h2 className={classes.sectionTitle}>รายการแนะนำ</h2>
          
          <div className={classes.scrollWrapper} style={{ maxWidth: 1200 }}>
            <button
              className={`${classes.scrollButton} ${classes.leftButton}`}
              onClick={() => handleScrollHorizontally(scrollRefRecommended, -1)}
              aria-label="เลื่อนซ้าย"
            >
              ‹
            </button>
            
            <div className={classes.scrollContainer} ref={scrollRefRecommended}>
              {recommended.map((item) => (
                <div
                  className={classes.resourceCard}
                  key={item.id}
                  style={{ width: "220px" }}
                  onClick={() => navigate(`/resource/${item.id}`)}
                  title={item.title}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className={classes.recommendedImage}
                    loading="lazy"
                  />
                  <div style={{ 
                    marginTop: "0.75rem",
                    padding: "0 0.5rem 0.5rem 0.5rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
                    color: "#444",
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              className={`${classes.scrollButton} ${classes.rightButton}`}
              onClick={() => handleScrollHorizontally(scrollRefRecommended, 1)}
              aria-label="เลื่อนขวา"
            >
              ›
            </button>
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

      {imageResources.length > 0 && (
        <section style={{ 
          background: "linear-gradient(120deg,#f6fafd 70%,#fbeee6 100%)", 
          padding: "56px 0 70px 0" 
        }}>
          <div className={classes.photoGalleryContainer}>
            <div className={classes.sectionHeader}>
              <h2 className={classes.sectionTitle}>คลังภาพแนะนำ</h2>
              <Link to="/gallery" className={classes.sectionLink}>
                ชมภาพทั้งหมด <span style={{ marginLeft: "0.3rem" }}>→</span>
              </Link>
            </div>
            
            <PhotoProvider
              overlayRender={({ index, imagesCount, overlay }) => (
                <div style={{
                  position: "fixed",
                  bottom: "30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  background: "rgba(0,0,0,0.7)",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontSize: "15px",
                  fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
                  zIndex: 10001,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  textAlign: "center",
                }}>
                  {overlay?.title && (
                    <span style={{ display: "block", marginBottom: "3px" }}>
                      {overlay.title}
                    </span>
                  )}
                  ({index + 1} / {imagesCount})
                </div>
              )}
            >
              <PhotoAlbum
  layout="rows"
  photos={imageResources}
  spacing={20}                   // เพิ่ม spacing ระหว่างภาพ
  padding={10}                    // เพิ่ม padding รอบ gallery
  targetRowHeight={260}
  renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    <div
      style={{
        ...wrapperStyle,
        marginBottom: 16,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(0,0,0,0.12)", // เพิ่ม shadow
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.12)";
      }}
      title={photo.title}
    >
      <PhotoView src={photo.src} key={photo.key} overlay={photo}>
        {renderDefaultPhoto({ wrapped: true })}
      </PhotoView>
      <div style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 100%)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "1rem",
        padding: "0.75rem 1rem",
        textShadow: "0 1px 5px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        <span style={{ marginRight: 6 }}>📷</span>{photo.title}
      </div>
    </div>
  )}
/>
            </PhotoProvider>
          </div>
        </section>
      )}

      {/* FEATURED CATEGORIES */}
      <section style={{ 
        background: "linear-gradient(120deg,#f6fafd 70%,#fbeee6 100%)", 
        padding: "54px 0 60px 0" 
      }}>
        <div style={{ background: "transparent", boxShadow: "none", maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>หมวดหมู่ยอดนิยม</h2>
          </div>
          
          <div className={classes.featuredCardRow}>
            {featuredCategories.map((category) => (
              <article
                className={classes.featuredCard}
                key={category.category}
                onClick={() => navigate(category.link)}
                title={category.category}
              >
                <img
                  src={category.image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    filter: "brightness(0.93) saturate(1.06)",
                    transition: `filter ${ANIMATION_DURATION.FAST}ms ease`
                  }}
                  alt={category.category}
                />
                <div style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  padding: "0 0 22px 0",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  background: "linear-gradient(0deg,rgba(0,0,0,0.56) 50%,rgba(0,0,0,0.03) 100%)"
                }}>
                  <div style={{
                    color: "#fff",
                    padding: "20px 0 0 22px",
                    textShadow: "0 1px 10px rgba(0,0,0,0.33)",
                    lineHeight: 1.2,
                    fontWeight: 700,
                    fontSize: "1.28rem"
                  }}>
                    {category.category}
                    <div style={{
                      fontSize: "1rem",
                      color: "#e0ffde",
                      opacity: 0.91,
                      fontWeight: 400,
                      marginTop: "6px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.35)"
                    }}>
                      {category.count.toLocaleString()} รายการ
                    </div>
                  </div>
                  <button style={{
                    background: "linear-gradient(90deg,#71f089 60%,#a2ffd0 100%)",
                    color: "#134a23",
                    fontWeight: 700,
                    border: 0,
                    borderRadius: 18,
                    fontSize: "1.07rem",
                    padding: "9px 32px",
                    marginRight: 22,
                    marginBottom: 14,
                    boxShadow: "0 3px 18px rgba(122,245,145,0.16)",
                    cursor: "pointer",
                    transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
                  }}>
                    Explore
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button 
              onClick={() => navigate("/gallery")}
              style={{
                background: "#fff",
                color: "#1e8148",
                border: "1.5px solid #bbf5ce",
                borderRadius: 22,
                padding: "0.75rem 2.2rem",
                fontSize: "1.14rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 10px rgba(176,244,210,0.16)",
                transition: `all ${ANIMATION_DURATION.FAST}ms ease`,
              }}
            >
              Explore more
            </button>
          </div>
        </div>
      </section>

      {/* VIDEO RECOMMEND SECTION */}
      {videoResources.length > 0 && (
        <section style={{
          background: "linear-gradient(120deg,#f6fafd 70%,#fbeee6 100%)",
          padding: "54px 0 60px 0",
        }}>
          <div className={classes.photoGalleryContainer}>
            <div className={classes.sectionHeader}>
              <h2 className={classes.sectionTitle}>วิดีโอแนะนำ</h2>
              <Link to="/gallery?category=video" className={classes.sectionLink}>
                ดูวิดีโอทั้งหมด <span style={{ marginLeft: "0.3rem" }}>→</span>
              </Link>
            </div>
            
            <div style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
            }}>
              {videoResources.slice(0, 6).map((item, index) => (
                <article
                  className={classes.resourceCardThree}
                  key={item.id}
                  onClick={() => handleOpenModal(item, index)}
                  title={item.title}
                  style={{
                    cursor: "pointer",
                    minWidth: 290,
                    maxWidth: 340,
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 3px 12px rgba(156,39,176,0.05)",
                  }}
                >
                  <div style={{ 
                    position: "relative", 
                    width: "100%", 
                    height: 0, 
                    paddingBottom: "56.25%" 
                  }}>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: 14,
                        borderTopRightRadius: 14,
                      }}
                      loading="lazy"
                    />
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      width: 46,
                      height: 46,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      fontSize: 28,
                      color: "#b71c1c",
                      transition: `transform ${ANIMATION_DURATION.FAST}ms ease`,
                    }}>
                      <i className="pi pi-play" />
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: "#424242",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.75rem 1rem",
                    textAlign: "center",
                    fontFamily: "var(--bs-font-primary, 'Sarabun', sans-serif)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderTop: "3px solid #b71c1c",
                  }}>
                    {item.title}
                  </div>
                  
                  <div style={{ 
                    padding: "0 1.1rem 1.1rem 1.1rem", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}>
                    <span style={{ fontSize: 13, color: "#b71c1c", fontWeight: 500 }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: 13, color: "#666" }}>
                      <i className="pi pi-eye" style={{ fontSize: 13, marginRight: 3 }} />
                      {item.viewCount || 0}
                    </span>
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