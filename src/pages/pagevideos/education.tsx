import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import resourcesData from "../../mock/resources.json";

const useStyles = createUseStyles({
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    borderLeft: "6px solid #e9004b",
    paddingLeft: "0.75rem",
    margin: "2rem 0 1rem 0",
    color: "#212121",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
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
  titleText: {
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
});

const Videoeducation = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const medicalResources = resourcesData.resources.filter(
    (r) => r.category === "education" && r.type === "video"
  );

  return (
    <div className="p-4">
      <h2 className={classes.title}>หมวดหมู่รอบรั้วมหาวิทยาลัย</h2>
      <div className={classes.grid}>
        {medicalResources.map((item) => (
          <div
            key={item.id}
            className={classes.card}
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <img src={item.thumbnailUrl} alt={item.title} className={classes.image} />
            <div className={classes.content}>
              <div className={classes.categoryText}>
                {item.category.toUpperCase()} • {item.type.toUpperCase()}
              </div>
              <div className={classes.titleText}>{item.title}</div>
              <div className={classes.description}>{item.description}</div>
              <div className={classes.date}>
                {new Date(item.createdAt).toLocaleDateString("th-TH")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videoeducation;