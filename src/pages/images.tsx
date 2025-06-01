import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaRegBookmark, FaDownload, FaEye, FaFilter } from "react-icons/fa";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  pageWrap: {
    display: "flex",
    minHeight: "100vh",
    background: "#F9F7F7",
    padding: "2.5rem 0",
    maxWidth: 1600,
    margin: "0 auto",
    gap: "2.5rem"
  },
  sidebar: {
    minWidth: 270,
    maxWidth: 300,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 16px 0 #0001",
    height: "fit-content",
    alignSelf: "flex-start",
    position: "sticky",
    top: 30,
    padding: "2rem 1.5rem",
    marginTop: 10,
  },
  sidebarTitle: {
    fontWeight: 800,
    fontSize: "1.1rem",
    color: "#222",
    marginBottom: 18,
    letterSpacing: 0.05,
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 500,
    fontSize: "1rem",
    color: "#222",
    marginBottom: 10,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderRadius: 10,
    padding: "0.5rem 0.7rem",
    transition: "all .15s",
    position: "relative",
    "&::before": {
      content: '""',
      display: "inline-block",
      width: 22,
      height: 22,
      border: "1.5px solid #bbb",
      borderRadius: 6,
      marginRight: 10,
      background: "#fff",
      verticalAlign: "middle",
      transition: "all .15s",
    },
    "& svg": {
      fontSize: "1.1rem",
      marginRight: 7,
      color: "#bbb",
      transition: "color .15s",
    },
    "&.active": {
      fontWeight: 700,
      color: "#3F72AF",
      "&::before": {
        background: "#3F72AF",
        borderColor: "#3F72AF",
      },
      "& svg": {
        color: "#fff",
      },
    },
    "&:hover:not(.active)": {
      "&::before": {
        borderColor: "#3F72AF",
      },
    },
    "@media (max-width: 700px)": {
      fontSize: "0.97rem",
      padding: "0.4rem 0.5rem",
      gap: 8,
      marginBottom: 7,
      "&::before": { width: 18, height: 18, marginRight: 7 },
      "& svg": { fontSize: "1rem", marginRight: 5 },
    },
  },
  sidebarDivider: {
    background: "#eee",
    height: 1,
    border: "none",
    margin: "18px 0",
  },
  main: { flex: 1, minWidth: 0 },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2.2rem",
    flexWrap: "wrap",
    gap: "1.2rem"
  },
  pageTitle: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#112D4E",
    fontFamily: "'Sarabun', 'Inter', sans-serif",
    letterSpacing: 0.1,
    margin: 0
  },
  sortBox: {
    display: "flex",
    gap: "1.2rem",
    alignItems: "center"
  },
  sortSelect: {
    padding: "0.7rem 1.3rem",
    borderRadius: "14px",
    border: "1.5px solid #3F72AF",
    fontSize: "1rem",
    background: "#F9F7F7",
    fontWeight: 600,
    color: "#112D4E",
    minWidth: 170,
    outline: "none",
    transition: "all .16s",
    "&:focus": { borderColor: "#3F72AF" }
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.3rem",
  },
  card: {
    background: "#fff",
    borderRadius: 22,
    boxShadow: "0 4px 32px 0 #3F72AF22",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all .23s cubic-bezier(.4,2,.6,1)",
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      transform: "translateY(-7px) scale(1.035)",
      boxShadow: "0 16px 40px 0 #3F72AF33",
    }
  },
  cardImageBox: {
    width: "100%",
    aspectRatio: "4/3",
    overflow: "hidden",
    position: "relative",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform .48s cubic-bezier(.4,2,.6,1), filter .3s"
    },
    "&:hover img": {
      transform: "scale(1.065)",
      filter: "brightness(0.92)"
    }
  },
  cardActionBar: {
    display: "flex",
    gap: 18,
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 3,
    background: "rgba(63, 113, 175, 0.38)",
    borderRadius: 14,
    boxShadow: "0 2px 8px #3F72AF33",
    padding: "0.3rem 0.7rem",
  },
  cardActionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    opacity: 0.85,
    transition: "color .15s",
    "&:hover": { color: "#F9F7F7" }
  },
  cardBody: {
    padding: "0.8rem 0.8rem 0.7rem 0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: ".7rem",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1.18rem",
    fontWeight: 800,
    color: "#112D4E",
    marginBottom: 3,
    lineHeight: 1.33,
    fontFamily: "'Sarabun', 'Inter', sans-serif",
    minHeight: 38
  },
  cardMeta: {
    fontSize: ".95rem",
    color: "#3F72AF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    margin: "5px 0 0 0"
  },
  tagBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: ".4rem",
    marginTop: ".6rem"
  },
  tag: {
    background: "#3F72AF",
    color: "#fff",
    borderRadius: 14,
    padding: "0.23rem 0.93rem",
    fontSize: ".9rem",
    fontWeight: 500,
    letterSpacing: 0.1
  },
  categoryTag: {
    background: "#DBE2EF",
    color: "#112D4E",
    borderRadius: 14,
    padding: "0.22rem 0.83rem",
    fontSize: ".9rem",
    fontWeight: 700,
    marginRight: 7
  },
  emptyState: {
    textAlign: "center",
    padding: "2.5rem",
    color: "#3F72AF",
    fontSize: "1.18rem",
    fontWeight: 500,
    gridColumn: "1 / -1"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "0.9rem",
    margin: "3rem 0 0 0"
  },
  pageBtn: {
    minWidth: 38,
    height: 38,
    borderRadius: 11,
    border: "1.5px solid #3F72AF",
    background: "#F9F7F7",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "#3F72AF",
    transition: "all .16s",
    "&:hover": { background: "#3F72AF", color: "#fff" },
    "&.active": { background: "#3F72AF", color: "#fff", borderColor: "#3F72AF" }
  },
  subCategoryItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 400,
    fontSize: "0.97rem",
    color: "#666",
    marginBottom: 7,
    marginLeft: 32,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderRadius: 8,
    padding: "0.35rem 0.7rem",
    transition: "all .15s",
    position: "relative",
    "&.active": {
      color: "#3F72AF",
      fontWeight: 600,
      background: "#F3F7FB",
    },
    "&:hover": {
      color: "#3F72AF",
      background: "#F3F7FB",
    },
    "@media (max-width: 700px)": {
      fontSize: "0.93rem",
      marginLeft: 18,
      padding: "0.28rem 0.5rem",
    },
  },
});

const categories = [
  { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
  { label: "การแพทย์", value: "medical", icon: <FaHeart />, children: [
    { label: "โรงพยาบาล", value: "hospital" },
    { label: "คลินิก", value: "clinic" },
  ] },
  { label: "การศึกษา", value: "education", icon: <FaBook />, children: [
    { label: "คณะวิทยาศาสตร์", value: "science" },
    { label: "คณะวิศวกรรมศาสตร์", value: "engineering" },
  ] },
  { label: "รอบรั้ว", value: "campus", icon: <FaUniversity /> }
];

const ImagesPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const itemsPerPage = 12;

  const images = resourcesData.resources.filter((item) => item.type === "image");
  const filteredItems = useMemo(() => (
    category === "all" ? images : images.filter(item => item.category === category)
  ), [category, images]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular": return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "az": return a.title.localeCompare(b.title, "th");
        case "za": return b.title.localeCompare(a.title, "th");
        default: return 0;
      }
    });
  }, [filteredItems, sortBy]);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((page-1)*itemsPerPage, page*itemsPerPage);

  const toggleCat = (val: string) => {
    setOpenCats(open => open.includes(val) ? open.filter(v => v !== val) : [...open, val]);
  };

  const mainCategories = ["all", "medical", "education", "campus"];
  useEffect(() => {
    if (!mainCategories.includes(category)) setSidebarVisible(false);
  }, [category]);

  return (
    <div className={classes.pageWrap}>
      {/* Sidebar */}
      {sidebarVisible && (
        <aside className={classes.sidebar}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 18, background: "#fff", border: "1.5px solid #eee", borderRadius: 10, padding: "7px 16px", fontWeight: 600, fontSize: 15, color: "#3F72AF", boxShadow: "0 2px 8px #0001", cursor: "pointer" 
            }}
            onClick={() => setSidebarVisible(false)}
          >
            <FaFilter style={{ color: "#3F72AF", fontSize: 16 }} /> ซ่อนหมวดหมู่
          </button>
          <div className={classes.sidebarTitle}>Categories</div>
          <hr className={classes.sidebarDivider} />
          {categories.map(c => (
            <div key={c.value}>
              <button
                className={`${classes.categoryItem} ${category === c.value ? "active" : ""}`}
                onClick={() => {
                  if (c.children) toggleCat(c.value);
                  setCategory(c.value); setPage(1);
                }}
                aria-expanded={!!c.children && openCats.includes(c.value)}
                aria-controls={c.children ? `subcat-${c.value}` : undefined}
              >
                {c.icon}
                <span>{c.label}</span>
                {c.children && (
                  <span style={{ marginLeft: "auto", fontSize: 16, color: "#bbb", transform: openCats.includes(c.value) ? "rotate(90deg)" : "none", transition: "transform .18s" }}>&#9654;</span>
                )}
              </button>
              {c.children && openCats.includes(c.value) && (
                <div id={`subcat-${c.value}`}>
                  {c.children.map(sub => (
                    <button
                      key={sub.value}
                      className={`${classes.subCategoryItem} ${category === sub.value ? "active" : ""}`}
                      onClick={() => { setCategory(sub.value); setPage(1); }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>
      )}
      {/* Main */}
      <div className={classes.main} style={!sidebarVisible ? { maxWidth: "100%", width: "100%" } : {}}>
        {/* Show Filters Button */}
        {!sidebarVisible && (
          <button
            style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 24, background: "#fff", border: "1.5px solid #eee", borderRadius: 10, padding: "8px 18px", fontWeight: 600, fontSize: 16, color: "#3F72AF", boxShadow: "0 2px 8px #0001", cursor: "pointer" 
            }}
            onClick={() => setSidebarVisible(true)}
          >
            <FaFilter style={{ color: "#3F72AF", fontSize: 18 }} /> แสดงหมวดหมู่
          </button>
        )}
        {/* Header */}
        <div className={classes.headerRow}>
          <h2 className={classes.pageTitle}>คลังภาพทรัพยากร</h2>
          <div className={classes.sortBox}>
            <span>Sort by</span>
            <select
              className={classes.sortSelect}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              value={sortBy}
            >
              <option value="popular">ยอดนิยม</option>
              <option value="latest">วันที่ใหม่สุด</option>
              <option value="oldest">วันที่เก่าสุด</option>
              <option value="az">ชื่อ A-Z</option>
              <option value="za">ชื่อ Z-A</option>
            </select>
          </div>
        </div>
        {/* Grid */}
        <div className={classes.grid}>
          {paginatedItems.length === 0 ? (
            <div className={classes.emptyState}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
          ) : paginatedItems.map(item => (
            <div
              key={item.id}
              className={classes.card}
              onClick={() => navigate(`/resource/${item.id}`)}
            >
              <div className={classes.cardImageBox}>
                <img
                  src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, "")}`}
                  alt={item.title}
                />
                <div className={classes.cardActionBar} onClick={e => e.stopPropagation()}>
                  <button className={classes.cardActionBtn} title="ดูตัวอย่าง"><FaEye /></button>
                  <button className={classes.cardActionBtn} title="บุ๊คมาร์ค"><FaRegBookmark /></button>
                  <button className={classes.cardActionBtn} title="ดาวน์โหลด"><FaDownload /></button>
                </div>
              </div>
              <div className={classes.cardBody}>
                <div className={classes.cardTitle}>{item.title}</div>
                <div className={classes.cardMeta}>
                  <span>{item.category === "medical"
                    ? <> <FaHeart /> การแพทย์ </>
                    : item.category === "education"
                    ? <> <FaBook /> การศึกษา </>
                    : <> <FaUniversity /> รอบรั้วมหาวิทยาลัย </>}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString("th-TH")}</span>
                  <span>ดาวน์โหลด: {item.downloadCount ?? 0}</span>
                </div>
                <div className={classes.tagBar}>
                  {item.tags?.slice(0,3).map(tag => (
                    <span className={classes.tag} key={tag}>{tag}</span>
                  ))}
                  {item.tags?.length > 3 && (
                    <span className={classes.tag}>+{item.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={classes.pagination}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${classes.pageBtn} ${page === i + 1 ? "active" : ""}`}
                onClick={() => { setPage(i+1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesPage;
