import { useState } from "react";
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
  const itemsPerPage = 12;
  const [page, setPage] = useState(1);

  const Graphics = resourcesData.resources.filter(
    (item) => item.type === "Graphics"
  );

  const totalPages = Math.ceil(Graphics.length / itemsPerPage);
  const paginatedItems = Graphics.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className={classes.container}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700 }}>คลังกราฟฟิก</h2>

      <div className={classes.header}>
        <div className={classes.filterGroup}>
          <select className={classes.dropdown}>
            <option>หมวดหมู่ทั้งหมด</option>
            <option>การแพทย์</option>
            <option>รอบรั้วมหาวิทยาลัย</option>
            <option>การศึกษา</option>
          </select>
          <select className={classes.dropdown}>
            <option>จัดเรียงตาม</option>
            <option>วันที่ใหม่สุด</option>
            <option>ยอดนิยม</option>
          </select>
        </div>

        <div className={classes.viewToggle}>
          <img src="/icons/grid-active.svg" className={`${classes.icon} active`} />
          <img src="/icons/list-inactive.svg" className={classes.icon} />
        </div>
      </div>

      <div className={classes.grid}>
        {paginatedItems.map((item) => (
          <div className={classes.card} key={item.id}>
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
