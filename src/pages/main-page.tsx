import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { createUseStyles } from "react-jss";
import { useRef } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#212121",
    textAlign: "center",
    marginBottom: "0.5rem",
    position: "relative",
    fontFamily: "var(--bs-font-primary)",
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
    fontFamily: "var(--bs-font-primary)",
    fontWeight: 500,
    fontSize: "1rem",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  arrow: {
    marginLeft: "0.3rem",
  },
  scrollWrapper: {
    position: "relative",
    margin: "0 auto",
  },
  scrollButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    zIndex: 2,
    fontSize: "1.5rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
  leftButton: { left: "-50px" },
  rightButton: { right: "-50px" },
  scrollContainer: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "2rem",
    padding: "1rem 0",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    justifyContent: "flex-start",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "200px",
  },
  overlayText: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    textAlign: "left",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    fontFamily: "var(--bs-font-primary)",
  },  
  resourceCard: {
    flex: "0 0 auto",
    width: "300px",
    borderRadius: "0.5rem",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    scrollSnapAlign: "start",
    transition: "transform 0.2s",
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  resourceCardthree: {
    flex: "0 0 calc(33.333% - 2rem)", 
    maxWidth: "calc(33.333% - 2rem)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    scrollSnapAlign: "start",
    transition: "transform 0.2s",
    cursor: "pointer",
    position: "relative",
  },
  imagetitle:{
    width: "100%",
    height: "280px",
    objectFit: "cover",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  content: { padding: "1rem" },
  categoryText: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#e9004b",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    fontFamily: "var(--bs-font-primary)",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontFamily: "var(--bs-font-primary)",
  },
  description: {
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "0.5rem",
    fontFamily: "var(--bs-font-primary)",
  },
  date: {
    fontSize: "0.8rem",
    color: "#777",
  },
  fullWidthHero: {
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "calc(100vh - 80px)",
    objectFit: "cover",
  },
  captionMain: {
    position: "absolute",
    bottom: "2rem",
    left: "2rem",
    color: "#fff",
    background: "rgba(0,0,0,0.6)",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    maxWidth: "700px",
    "@media (max-width: 768px)": {
      maxWidth: "90%",
      fontSize: "0.9rem",
    },
  },
  
  caption: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: "0.8rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "var(--bs-font-primary)",
    textAlign: "center", 
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "@media (max-width: 768px)": {
      fontSize: "0.9rem",
    },
  },

  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontFamily: "var(--bs-font-primary)",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontFamily: "var(--bs-font-primary)",
  },
  recommendedSection: {
    padding: "2rem",
    textAlign: "center",
  },
  recommendedGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  recommendedCard: {
    width: "200px",
    textAlign: "center",
  },
  recommendedImage: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  recommendedTitle: {
    marginTop: "0.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    fontFamily: "var(--bs-font-primary)",
  },
  viewCount: {
    fontSize: "0.8rem",
    color: "#555",
    marginTop: "0.3rem", 
    fontFamily: "var(--bs-font-primary)",
  },
  videoCard: {
    flex: "0 0 300px",
    maxWidth: "300px",
    borderRadius: "0.75rem",
    backgroundColor: "#fff",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
    },
  },
  
  videoImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  
  videoTitle: {
    backgroundColor: "#616161",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "1rem",
    textAlign: "center",
    fontFamily: "var(--bs-font-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  videoPlayer: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    background: "#000",
    border: 0,
  },
  iframePlayer: {
    composes: "$videoPlayer",
  },
  
});

const heroData = [
  {
    id: "h1",
    titlemain: "CLIMATE AND THE ENVIRONMENT AT KHONKAEN",
    subtitle: "Working to reduce emissions, remove greenhouse gases...",
    imageUrl: "/mock/hero-1.jpg",
  },
  {
    id: "h2",
    titlemain: "RESEARCH THAT CHANGES THE WORLD",
    subtitle: "Explore groundbreaking research at the university",
    imageUrl: "/mock/hero-2.jpg",
  },
];

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const scrollRefPopular = useRef(null);
  const scrollrefRecommended = useRef(null);
  const scrollRefVideo = useRef(null);
  const scrollRefImage = useRef(null);

  const videoResources = resourcesData.resources.filter((r) => r.type === "video").slice(0, 12);
  const imageResources = resourcesData.resources.filter((r) => r.type === "image" || r.type === "graphic").slice(0, 12);
  const recommended = resourcesData.resources.slice(0, 12);

  const autoScroll = (ref, speed) => {
    const el = ref.current;
    if (!el) return;
    const scrollStep = 320;
    const resetScroll = () => {
      el.scrollTo({ left: 0, behavior: "smooth" });
    };
    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - scrollStep) {
        resetScroll();
      } else {
        el.scrollLeft += scrollStep;
      }
    }, speed);
    return () => clearInterval(interval);
  };
  useEffect(() => autoScroll(scrollRefImage, 6000), []);
  useEffect(() => autoScroll(scrollrefRecommended, 10000), []);
  useEffect(() => autoScroll(scrollRefPopular, 9500), []);

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollLeft -= 320;
  };
  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollLeft += 320;
  };


  const heroTemplate = (item) => (
    <div style={{ position: "relative" }}>
      <img src={item.imageUrl} alt={item.title} className={classes.heroImage} />
      <div className={classes.captionMain}>
        <div className={classes.heroTitle}>{item.titlemain}</div>
        <div className={classes.subtitle}>{item.subtitle}</div>
      </div>
    </div>
  );
  

  return (
    <>
      <div className={classes.fullWidthHero}>
        <Carousel
          value={heroData}
          itemTemplate={heroTemplate}
          circular
          autoplayInterval={5000}
          showIndicators
          showNavigators
        />
      </div>

      <div className={classes.recommendedSection}>
        <h2 className={classes.sectionTitle}>รายการแนะนำ</h2>
        <div className={classes.scrollWrapper}>
          <button
            className={`${classes.scrollButton} ${classes.leftButton}`}
            onClick={() => scrollLeft(scrollrefRecommended)}
            >
            ‹
          </button>
          <div className={classes.scrollContainer} ref={scrollrefRecommended}>
            {recommended.map((item) => (
              <div className={classes.resourceCard} key={item.id}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className={classes.recommendedImage}
                  onClick={() => navigate(`/resource/${item.id}`)}
                />
                <div className={classes.recommendedTitle}>{item.title}</div>
              </div>
            ))}
          </div>
            <button
            className={`${classes.scrollButton} ${classes.rightButton}`}
            onClick={() => scrollRight(scrollrefRecommended)}
            >
            ›
          </button>
        </div>
      </div>


      <div className="p-4">
        <h2 className={classes.sectionTitle}>รายการใหม่</h2>
        <div className={classes.scrollWrapper}>
          <button
            className={`${classes.scrollButton} ${classes.leftButton}`}
            onClick={() => scrollLeft(scrollRefPopular)}
          >
            ‹
          </button>
          <div className={classes.scrollContainer} ref={scrollRefPopular}>
            {imageResources.map((item) => (
              <div
                key={item.id}
                className={classes.resourceCard}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className={classes.image} />
                <div className={classes.content}>
                  <div className={classes.categoryText}>
                    {item.category.toUpperCase()} • {item.type.toUpperCase()}
                  </div>
                  <div className={classes.title}>{item.title}</div>
                  <div className={classes.date}>
                    {new Date(item.createdAt).toLocaleDateString("th-TH")}
                  </div>
                  <div className={classes.viewCount}>
                    <i className="pi pi-eye" style={{ marginRight: "0.5rem" }}></i>
                    {item.viewCount || 0} ครั้ง
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className={`${classes.scrollButton} ${classes.rightButton}`}
            onClick={() => scrollRight(scrollRefPopular)}
          >
            ›
          </button>
        </div>

        <div className={classes.sectionHeader}>
        <h2 className={classes.sectionTitle}>คลังภาพแนะนำ</h2>
        <Link to="/images" className={classes.sectionLink}>
        ทั้งหมด <span className={classes.arrow}>→</span>
        </Link>
        </div>
        <div className={classes.scrollWrapper}>
          <button
            className={`${classes.scrollButton} ${classes.leftButton}`}
            onClick={() => scrollLeft(scrollRefImage)}
          >
            ‹
          </button>
          <div className={classes.scrollContainer} ref={scrollRefImage}>
            {imageResources.map((item) => (
              <div
                key={item.id}
                className={classes.resourceCardthree}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className={classes.imagetitle} />
                <div className={classes.caption}>{item.title}</div>
              </div>
            ))}
          </div>
          <button
            className={`${classes.scrollButton} ${classes.rightButton}`}
            onClick={() => scrollRight(scrollRefImage)}
          >
            ›
          </button>
        </div>

        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>วิดีโอแนะนำ</h2>
          <Link to="/videos" className={classes.sectionLink}>
            ทั้งหมด <span className={classes.arrow}>→</span>
          </Link>
        </div>

        <div className={classes.scrollWrapper}>
          <button
            className={`${classes.scrollButton} ${classes.leftButton}`}
            onClick={() => scrollLeft(scrollRefVideo)}
          >
            ‹
          </button>

          <div className={classes.scrollContainer} ref={scrollRefVideo}>
            {videoResources.map((item) => {
              /* ===== helper ===== */
              const embedYouTube = (url: string) => {
                /* รองรับ youtu.be | youtube.com/watch?v= */
                const id = url.match(/(?:youtu\.be\/|v=)([^?&]+)/)?.[1];
                return id ? `https://www.youtube.com/embed/${id}` : url;
              };

              const hasVideoUrl   = !!item.videoUrl;              // youtube / vimeo
              const isMp4         = !hasVideoUrl && item.fileUrl?.endsWith(".mp4");

              return (
                <div
                  key={item.id}
                  className={classes.resourceCardthree}
                  onClick={() => navigate(`/resource/${item.id}`)}
                >
                  {/* 1) YouTube / Vimeo */}
                  {hasVideoUrl && (
                    <iframe
                      className={classes.iframePlayer}
                      src={embedYouTube(item.videoUrl)}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={item.title}
                    />
                  )}

                  {/* 2) MP4 ใน server */}
                  {isMp4 && (
                    <video
                      className={classes.videoPlayer}
                      src={item.fileUrl}
                      poster={item.thumbnailUrl}
                      controls
                      preload="metadata"
                    />
                  )}

                  {/* 3) fallback เป็นรูปภาพ */}
                  {!hasVideoUrl && !isMp4 && (
                    <img
                      src={item.thumbnailUrl || "/fallback-thumbnail.jpg"}
                      alt={item.title}
                      className={classes.videoImage}
                    />
                  )}

                  <div className={classes.videoTitle}>{item.title}</div>
                </div>
              );
            })}
          </div>

          <button
            className={`${classes.scrollButton} ${classes.rightButton}`}
            onClick={() => scrollRight(scrollRefVideo)}
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
