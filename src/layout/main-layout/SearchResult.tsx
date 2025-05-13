// pages/SearchResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import resourcesData from "../mock/resources.json";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "0.5rem",
    background: "#fff",
    cursor: "pointer",
    "& img": {
      width: "100%",
      height: "160px",
      objectFit: "cover",
      borderRadius: "0.5rem",
    },
  },
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResult = () => {
  const classes = useStyles();
  const query = useQuery();
  const navigate = useNavigate();
  const q = query.get("q")?.toLowerCase() || "";

  const results = useMemo(() => {
    return resourcesData.resources.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(q))
    );
  }, [q]);

  return (
    <div>
      <div className={classes.title}>ผลการค้นหา: "{q}"</div>
      {results.length === 0 ? (
        <p>ไม่พบรายการที่เกี่ยวข้อง</p>
      ) : (
        <div className={classes.grid}>
          {results.map((item) => (
            <div
              key={item.id}
              className={classes.card}
              onClick={() => navigate(`/resource/${item.id}`)}
            >
              <img src={item.thumbnailUrl} alt={item.title} />
              <h4>{item.title}</h4>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
