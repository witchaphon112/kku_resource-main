import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { createUseStyles } from "react-jss";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    borderLeft: "6px solid #e9004b",
    paddingLeft: "0.75rem",
    margin: "2rem 0 1rem 0",
    color: "#212121",
  },
  scrollContainer: {
    display: "flex",
    overflowX: "auto",
    paddingBottom: "1rem",
    gap: "1.5rem",
    scrollSnapType: "x mandatory",
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#ccc",
      borderRadius: "4px",
    },
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
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  content: {
    padding: "1rem",
  },
  categoryText: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#e9004b",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  description: {
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "0.5rem",
  },
  date: {
    fontSize: "0.8rem",
    color: "#777",
  },
  heroImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    position: "relative",
  },
  caption: {
    position: "absolute",
    bottom: "3rem",
    left: "3rem",
    color: "#fff",
    background: "rgba(0,0,0,0.5)",
    padding: "1rem",
    borderRadius: "0.5rem",
    maxWidth: "600px",
  },
  heroTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
  },
  fullWidthHero: {
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
  },
});

const heroData = [
  {
    id: "h1",
    title: "CLIMATE AND THE ENVIRONMENT AT KHONKAEN",
    subtitle: "Working to reduce emissions, remove greenhouse gases...",
    imageUrl: "/mock/hero-1.jpg",
  },
  {
    id: "h2",
    title: "RESEARCH THAT CHANGES THE WORLD",
    subtitle: "Explore groundbreaking research at the university",
    imageUrl: "/mock/hero-2.jpg",
  },
];

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const videoResources = resourcesData.resources.filter((r) => r.type === "video");
  const imageResources = resourcesData.resources.filter(
    (r) => r.type === "image" || r.type === "graphic"
  );

  const heroTemplate = (item: any) => (
    <div style={{ position: "relative" }}>
      <img src={item.imageUrl} alt={item.title} className={classes.heroImage} />
      <div className={classes.caption}>
        <div className={classes.heroTitle}>{item.title}</div>
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

      <div className="p-4">
        <h2 className={classes.sectionTitle}>หมวดหมู่ยอดนิยม</h2>
        <div className={classes.scrollContainer}>
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

        <h2 className={classes.sectionTitle}>วิดีโอแนะนำ</h2>
        <div className={classes.scrollContainer}>
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
      </div>
    </>
  );
};

export default MainPage;
