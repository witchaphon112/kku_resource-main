import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge } from "react-icons/fa";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "2rem",
    gap: "1rem",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#b71c1c",
    marginBottom: "2rem",
  },
  filterGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#555",
    transition: "all 0.2s",
    "&:hover": {
      background: "#f2f2f2",
    },
  },
  activeIconButton: {
    background: "#b71c1c",
    color: "#fff",
    borderColor: "#b71c1c",
  },
  dropdown: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    minWidth: "180px",
    backgroundColor: "#fff",
    "&:focus": {
      outline: "none",
      borderColor: "#b71c1c",
    },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  },
  imageContainer: {
    height: "160px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  cardBody: {
    padding: "1rem",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#333",
  },
  cardMeta: {
    fontSize: "0.8rem",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  },
  pageButton: {
    minWidth: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.active": {
      backgroundColor: "#b71c1c",
      color: "#fff",
      borderColor: "#b71c1c",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
    gridColumn: "1 / -1",
  },
});

const ImagesPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const itemsPerPage = 12;
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const images = resourcesData.resources.filter((item) => item.type === "image");

  const filteredItems = useMemo(() => {
    return category === "all"
      ? images
      : images.filter((item) => item.category === category);
  }, [category, images]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "az":
          return a.title.localeCompare(b.title, "th");
        case "za":
          return b.title.localeCompare(a.title, "th");
        default:
          return 0;
      }
    });
  }, [filteredItems, sortBy]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // กลับไปหน้าแรกหลังจากจัดเรียง
  };

  const categories = [
    { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
    { label: "การแพทย์", value: "medical", icon: <FaHeart /> },
    { label: "การศึกษา", value: "education", icon: <FaBook /> },
    { label: "รอบรั้ว", value: "campus", icon: <FaUniversity /> },
  ];

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>คลังภาพทรัพยากร</h1>

      <div className={classes.header}>
        <div className={classes.filterGroup}>
          {categories.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCategory(item.value);
                setPage(1);
              }}
              className={`${classes.iconButton} ${
                category === item.value ? classes.activeIconButton : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <select
          className={classes.dropdown}
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="latest">วันที่ใหม่สุด</option>
          <option value="oldest">วันที่เก่าสุด</option>
          <option value="popular">ยอดนิยม</option>
          <option value="az">ชื่อ A - Z</option>
          <option value="za">ชื่อ Z - A</option>
        </select>
      </div>

      {paginatedItems.length === 0 ? (
        <div className={classes.emptyState}>
          ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
        </div>
      ) : (
        <>
          <div className={classes.grid}>
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className={classes.card}
                onClick={() => navigate(`/resource/${item.id}`)}
              >
                <div className={classes.imageContainer}>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    title={item.title}
                    className={classes.image}
                  />
                </div>
                <div className={classes.cardBody}>
                  <h3 className={classes.cardTitle}>{item.title}</h3>
                  <div className={classes.cardMeta}>
                    <span>
                      {item.category === "medical"
                        ? "การแพทย์"
                        : item.category === "education"
                        ? "การศึกษา"
                        : "รอบรั้วมหาวิทยาลัย"}
                    </span>
                    <span>ดาวน์โหลด: {item.downloadCount ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={classes.pagination}>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`${classes.pageButton} ${
                    page === index + 1 ? "active" : ""
                  }`}
                  onClick={() => {
                    setPage(index + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-current={page === index + 1 ? "page" : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImagesPage;
