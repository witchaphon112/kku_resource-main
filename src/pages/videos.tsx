import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaHeart, FaUniversity, FaBook, FaThLarge, FaList, FaChevronDown, FaChevronUp } from "react-icons/fa";
import resourcesData from "../mock/resources.json";

type ViewType = 'grid' | 'list';
type SortEvent = React.ChangeEvent<HTMLSelectElement>;

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
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  gridLarge: {
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  },
  gridMedium: {
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  },
  gridSmall: {
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  },
  viewControls: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  imageContainer: {
    height: "160px",
    overflow: "hidden",
    position: "relative",
    "&:hover": {
      "& $imageOverlay": {
        opacity: 1,
      },
      "& $image": {
        transform: "scale(1.1)",
      },
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to top, rgba(183, 28, 28, 0.8), rgba(183, 28, 28, 0))",
    opacity: 0,
    transition: "opacity 0.3s ease",
    display: "flex",
    alignItems: "flex-end",
    padding: "1rem",
  },
  overlayText: {
    color: "white",
    fontSize: "0.8rem",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
  },
  cardBody: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.8rem",
    color: "#333",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    lineHeight: 1.4,
  },
  cardMeta: {
    fontSize: "0.8rem",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.8rem",
  },
  tagSection: {
    borderTop: "1px solid #f0f0f0",
    marginTop: "auto",
    padding: "0.8rem 1rem 0",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginBottom: "0.8rem",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    backgroundColor: "#f5f5f5",
    color: "#666",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e8e8e8",
    },
  },
  categoryTag: {
    backgroundColor: "#f8f8f8",
    border: "1px solid #eee",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    color: "#555",
    fontWeight: 500,
  },
  tagIcon: {
    fontSize: "0.85rem",
    marginRight: "0.3rem",
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
  gridView: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  listCard: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateX(5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  listImageContainer: {
    width: "240px",
    height: "180px",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    "&:hover": {
      "& $imageOverlay": {
        opacity: 1,
      },
      "& $image": {
        transform: "scale(1.1)",
      },
    },
  },
  listContent: {
    padding: "1rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#333",
  },
  listDescription: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.5rem",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    transition: "all 0.3s ease",
  },
  listDescriptionExpanded: {
    "-webkit-line-clamp": "unset",
  },
  listMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.8rem",
    color: "#666",
  },
  learnMore: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    color: "#b71c1c",
    fontSize: "0.8rem",
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  
});

const VideosPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const itemsPerPage = 12;
  const videos = resourcesData.resources.filter((item) => item.type === "video");

  const filteredItems = useMemo(() => {
    return category === "all"
      ? videos
      : videos.filter((item) => item.category === category);
  }, [category, videos]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return (b.viewCount || 0) - (a.viewCount || 0);
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

  const handleSortChange = (e: SortEvent) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const categories = [
    { label: "ทั้งหมด", value: "all", icon: <FaThLarge /> },
    { label: "การแพทย์", value: "medical", icon: <FaHeart /> },
    { label: "การศึกษา", value: "education", icon: <FaBook /> },
    { label: "รอบรั้ว", value: "campus", icon: <FaUniversity /> },
  ];

  const toggleExpand = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const embedYT = (url: string) => {
    const id = url.match(/(?:youtu\.be\/|v=)([^?&]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  const renderGridView = () => (
    <div className={classes.gridView}>
      {paginatedItems.map((item) => (
        <div
          key={item.id}
          className={classes.card}
          onClick={() => navigate(`/resource/${item.id}`)}
        >
          <div className={classes.imageContainer}>
            {item.videoUrl ? (
              <iframe
                src={embedYT(item.videoUrl)}
                className={classes.image}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                alt={item.title}
                title={item.title}
                className={classes.image}
              />
            )}
            <div className={classes.imageOverlay}>
              <span className={classes.overlayText}>คลิกเพื่อดูรายละเอียด</span>
            </div>
          </div>
          <div className={classes.cardBody}>
            <h3 className={classes.cardTitle}>{item.title}</h3>
            <div className={classes.cardMeta}>
              <span>ดู: {item.viewCount ?? 0} ครั้ง</span>
              <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
            </div>
          </div>
          <div className={classes.tagSection}>
            <div className={classes.tagContainer}>
              <span className={classes.categoryTag}>
                {item.category === "medical" && <FaHeart className={classes.tagIcon} />}
                {item.category === "education" && <FaBook className={classes.tagIcon} />}
                {item.category === "campus" && <FaUniversity className={classes.tagIcon} />}
                {item.category === "medical"
                  ? "การแพทย์"
                  : item.category === "education"
                  ? "การศึกษา"
                  : "รอบรั้วมหาวิทยาลัย"}
              </span>
              {item.tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} className={classes.tag}>
                  {tag}
                </span>
              ))}
              {item.tags?.length > 3 && (
                <span className={classes.tag}>+{item.tags.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className={classes.listView}>
      {paginatedItems.map((item) => (
        <div
          key={item.id}
          className={classes.listCard}
          onClick={() => navigate(`/resource/${item.id}`)}
        >
          <div className={classes.listImageContainer}>
            {item.videoUrl ? (
              <iframe
                src={embedYT(item.videoUrl)}
                className={classes.image}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}`}
                alt={item.title}
                title={item.title}
                className={classes.image}
              />
            )}
            <div className={classes.imageOverlay}>
              <span className={classes.overlayText}>คลิกเพื่อดูรายละเอียด</span>
            </div>
          </div>
          <div className={classes.listContent}>
            <div>
              <h3 className={classes.listTitle}>{item.title}</h3>
              <p className={`${classes.listDescription} ${
                expandedItems.has(item.id) ? classes.listDescriptionExpanded : ""
              }`}>
                {item.description || "ไม่มีคำอธิบายเพิ่มเติม"}
              </p>
              {item.description && item.description.length > 100 && (
                <button 
                  className={classes.learnMore}
                  onClick={(e) => toggleExpand(item.id, e)}
                >
                  {expandedItems.has(item.id) ? (
                    <>
                      <span>ย่อเนื้อหา</span>
                      <FaChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      <span>อ่านเพิ่มเติม</span>
                      <FaChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
            <div className={classes.listMeta}>
              <span>
                {item.category === "medical"
                  ? "การแพทย์"
                  : item.category === "education"
                  ? "การศึกษา"
                  : "รอบรั้วมหาวิทยาลัย"}
              </span>
              <span>อัพโหลดเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
              <span>ดู: {item.viewCount ?? 0} ครั้ง</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>คลังวิดีโอ</h1>

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

        <div className={classes.viewControls}>
          <button
            className={`${classes.iconButton} ${
              viewType === "grid" ? classes.activeIconButton : ""
            }`}
            onClick={() => setViewType("grid")}
            title="มุมมองกริด"
          >
            <FaThLarge />
          </button>
          <button
            className={`${classes.iconButton} ${
              viewType === "list" ? classes.activeIconButton : ""
            }`}
            onClick={() => setViewType("list")}
            title="มุมมองรายการ"
          >
            <FaList />
          </button>

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
      </div>

      {paginatedItems.length === 0 ? (
        <div className={classes.emptyState}>
          ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
        </div>
      ) : (
        <>
          {viewType === 'grid' ? renderGridView() : renderListView()}
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

export default VideosPage;
