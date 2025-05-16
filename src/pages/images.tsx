import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  container: {
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  filterGroup: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  dropdown: {
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  viewToggle: {
    display: "flex",
    gap: "0.5rem",
  },
  icon: {
    width: "28px",
    height: "28px",
    cursor: "pointer",
    opacity: 0.5,
    "&.active": {
      opacity: 1,
    },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "2rem",
  },
  card: {
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  title: {
    marginTop: "0.75rem",
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.3,
  },
  pagination: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  pageButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: "#ccc",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    "&.active": {
      background: "#b71c1c",
    },
  },
});

const PageGallery = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const itemsPerPage = 12;
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const images = resourcesData.resources.filter((item) => item.type === "image");

  const filteredItems =
    category === "all"
      ? images
      : images.filter((item) => item.category === category);

      const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "popular") {
          return (b.viewCount || 0) - (a.viewCount || 0);
        } else if (sortBy === "az") {
          return a.title.localeCompare(b.title, "th"); // รองรับภาษาไทย
        } else if (sortBy === "za") {
          return b.title.localeCompare(a.title, "th");
        }
        return 0;
      });      

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className={classes.container}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700 }}>คลังภาพ</h2>

      <div className={classes.header}>
        <div className={classes.filterGroup}>
          <select className={classes.dropdown} onChange={handleCategoryChange} value={category}>
            <option value="all">หมวดหมู่ทั้งหมด</option>
            <option value="medical">การแพทย์</option>
            <option value="campus">รอบรั้วมหาวิทยาลัย</option>
            <option value="education">การศึกษา</option>
          </select>

          <select className={classes.dropdown} onChange={handleSortChange} value={sortBy}>
            <option value="latest">วันที่ใหม่สุด</option>
            <option value="oldest">วันที่เก่าสุด</option>
            <option value="popular">ยอดนิยม</option>
            <option value="az">ชื่อ A - Z</option>
            <option value="za">ชื่อ Z - A</option>
          </select>
        </div>
      </div>

      <div className={classes.grid}>
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className={classes.card}
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <img src={item.thumbnailUrl} alt={item.title} className={classes.image} />
            <div className={classes.title}>{item.title}</div>
          </div>
        ))}
      </div>

      <div className={classes.pagination}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`${classes.pageButton} ${page === index + 1 ? "active" : ""}`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageGallery;
