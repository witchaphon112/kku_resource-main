import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { createUseStyles } from "react-jss";
import { useRef } from "react";
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
  leftButton: { left: "-20px" },
  rightButton: { right: "-20px" },
  scrollContainer: {
    display: "flex",
    overflowX: "auto",
    gap: "1.5rem",
    padding: "1rem 0",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
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
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: "0.8rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "var(--bs-font-primary)",
    borderRadius: "0.5rem",
    textAlign: "center", 
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
  const scrollRefVideo = useRef(null);
  const scrollRefImage = useRef(null);
  const recommendedRef = useRef(null);

  const videoResources = resourcesData.resources.filter((r) => r.type === "video");
  const imageResources = resourcesData.resources.filter(
    (r) => r.type === "image" || r.type === "graphic"
  );
  const recommended = resourcesData.resources.slice(0, 3);

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
          <button className={`${classes.scrollButton} ${classes.leftButton}`} onClick={scrollLeft}>
            ‹
          </button>
          <div className={classes.scrollContainer} ref={recommendedRef}>
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
          <button className={`${classes.scrollButton} ${classes.rightButton}`} onClick={scrollRight}>
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
                  <div className={classes.description}>{item.description}</div>
                  <div className={classes.date}>
                    {new Date(item.createdAt).toLocaleDateString("th-TH")}
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
        <Link to="/news" className={classes.sectionLink}>
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
                className={classes.resourceCard}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className={classes.image} />
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
        <Link to="/news" className={classes.sectionLink}>
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
            {videoResources.map((item) => (
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
                  <div className={classes.description}>{item.description}</div>
                  <div className={classes.date}>
                    {new Date(item.createdAt).toLocaleDateString("th-TH")}
                  </div>
                </div>
              </div>
            ))}
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
