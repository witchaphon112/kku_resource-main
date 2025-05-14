import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import resourcesData from "../../mock/resources.json";

const useStyles = createUseStyles({
  wrapper: {
    padding: "2rem 1rem",
    maxWidth: 1440,
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#212121",
    textAlign: "center",
    flex: 1,
  },
  filterGroup: {
    display: "flex",
    gap: "1rem",
  },
  filterBtn: {
    padding: "0.6rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "999px",
    backgroundColor: "white",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "var(--bs-font-primary)",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    '&:hover': {
      backgroundColor: "#f9f9f9",
    },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 10fr))",
    gap: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    backgroundColor: "#eee",
  },
  titleText: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111",
    padding: "0.8rem 1rem",
    backgroundColor: "#f5f5f5",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});

const PageCampus = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const campusImages = resourcesData.resources.filter(
    (r) => r.category === "campus" && r.type === "image"
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.headerRow}>
        <h2 className={classes.title}>คลังภาพ</h2>
        <div className={classes.filterGroup}>
          <button className={classes.filterBtn}>หมวดหมู่ทั้งหมด ▾</button>
          <button className={classes.filterBtn}>จัดเรียงตาม ▾</button>
        </div>
      </div>

      <div className={classes.grid}>
        {campusImages.map((item) => (
          <div
            key={item.id}
            className={classes.card}
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className={classes.image}
            />
            <div className={classes.titleText}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageCampus;
