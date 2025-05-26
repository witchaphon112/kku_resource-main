import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import resourcesData from "../../mock/resources.json";
import { createUseStyles } from "react-jss";
import {
  FaSearch,
  FaFileAlt,
  FaUser,
  FaList,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    gap: 32,
    margin: "32px auto",
    maxWidth: 1240,
    alignItems: "flex-start",
    '@media (max-width: 900px)': { flexDirection: "column", gap: 20 },
  },
  sidebar: {
    width: 320,
    background: "#fff",
    borderRadius: 18,
    padding: "2.2rem 1.5rem 2rem 1.5rem",
    boxShadow: "0 6px 32px #00000015",
    fontFamily: "var(--bs-font-primary)",
    fontSize: "1.07rem",
    minHeight: 540,
    position: "sticky",
    border: "none",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontWeight: 800,
    fontSize: 18,
    color: "#3c2210",
    marginBottom: 8,
    marginTop: 5,
  },
  searchBox: {
    width: "100%",
    padding: "0.7rem 1.1rem",
    borderRadius: 10,
    border: "1.6px solid #eee",
    fontSize: 17,
    marginBottom: 14,
    outline: "none",
    transition: "border 0.18s",
    "&:focus": { border: "1.6px solid #d1410c" }
  },
  radioGroup: {
    display: "flex",
    gap: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    gap: 7,
    cursor: "pointer",
    fontSize: 16
  },
  radioInput: {
    accentColor: "#d1410c",
    width: 19, height: 19, marginRight: 6
  },
  select: {
    width: "100%",
    padding: "0.6rem 0.7rem",
    borderRadius: 8,
    border: "1.4px solid #eee",
    fontSize: 16,
    background: "#fff7f0",
    outline: "none",
    marginBottom: 10,
    color: "#892d05",
    fontWeight: 700
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    marginBottom: 10,
  },
  checkboxLabel: {
    display: "flex", alignItems: "center", gap: 7,
    fontWeight: 600, cursor: "pointer",
    borderRadius: 7, padding: "3px 0 3px 3px",
    "&:hover": { background: "#fff2e3" },
    fontSize: 15,
  },
  checkboxInput: {
    accentColor: "#d1410c",
    width: 19, height: 19, marginRight: 7
  },
  button: {
    background: "#d1410c",
    color: "#fff",
    borderRadius: 24,
    fontSize: 20,
    fontWeight: 800,
    padding: "14px 0",
    marginTop: 10,
    width: "100%",
    border: "none",
    boxShadow: "0 2px 18px #892d0533",
    cursor: "pointer",
    letterSpacing: 0.6,
    "&:hover": { background: "#a93605" }
  },
  main: {
    flex: 1,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 16px #892d0511",
    padding: "2.1rem 1.7rem",
    minHeight: 400,
    fontFamily: "var(--bs-font-primary)",
    '@media (max-width: 900px)': { padding: "1.2rem 0.6rem" }
  },
  resultHeader: {
    fontWeight: 900,
    fontSize: 22,
    marginBottom: 18,
    color: "#892d05",
    letterSpacing: 0.2,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  listItem: {
  display: "flex",
  alignItems: "flex-start",
  gap: 24,
  borderRadius: 16,
  marginBottom: 18,
  background: "#fff",
  boxShadow: "0 2px 12px #0001",
  padding: "1.5rem 1rem",
  transition: "box-shadow 0.18s, background 0.18s, transform 0.15s",
  cursor: "pointer",
  border: "none",
  "&:hover": {
    background: "#fff7f0",
    boxShadow: "0 6px 24px #b71c1c22",
    transform: "scale(1.015)"
  }
  },
  index: {
    minWidth: 32,
    color: "#d1410c",
    fontWeight: 800,
    fontSize: "1.18rem",
    textAlign: "right",
    marginTop: 6,
  },
  thumb: {
    width: 80,
    height: 100,
    marginBottom: 8,
    objectFit: "cover",
    borderRadius: 12,
    background: "#f8f8f8",
    border: "1.2px solid #f5c6a5",
    boxShadow: "0 2px 8px #0001"
  },
  info: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  title: {
    fontWeight: 900,
    fontSize: "1.15rem",
    color: "#d1410c",
    marginBottom: 5,
    cursor: "pointer",
    "&:hover": { textDecoration: "underline", color: "#892d05" },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 450,
    letterSpacing: 0.2
  },
  author: {
    fontSize: "1.01rem",
    color: "#892d05",
    marginBottom: 1,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 7
  },
  desc: {
    fontSize: "0.99rem",
    color: "#666",
    marginBottom: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 440
  },
  meta: {
    fontSize: "0.97rem",
    color: "#b85c38",
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  typeTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#ffe0e0",
    color: "#b71c1c",
    borderRadius: 8,
    padding: "3px 12px",
    fontWeight: 700,
    marginRight: 8,
    fontSize: 14,
  },
  catTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#e3f2fd",
    color: "#1976d2",
    borderRadius: 8,
    padding: "3px 12px",
    fontWeight: 700,
    fontSize: 14,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 34,
    gap: 6
  },
  pageBtn: {
    padding: "8px 15px",
    borderRadius: 20,
    border: "1.6px solid #f5c6a5",
    background: "#fff",
    color: "#892d05",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.19s, color 0.19s, box-shadow 0.12s",
    boxShadow: "0 1.5px 10px #892d0509",
    "&:hover": { background: "#d1410c", color: "#fff" }
  },
  pageBtnActive: {
    background: "#d1410c",
    color: "#fff",
    border: "1.6px solid #d1410c",
    boxShadow: "0 3px 14px #d1410c33"
  }


});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const resourceTypes = [
  "ทั้งหมด",
  "หนังสือ",
  "นิตยสารศิลปากร",
  "วารสารศิลปากร",
  "มัลติมีเดีย",
  "เอกสารภายใน"
];

const ITEMS_PER_PAGE = 20;

const SearchResult = () => {
  const classes = useStyles();
  const query = useQuery();
  const navigate = useNavigate();

  // ตัวแปรของ sidebar
  const [keyword, setKeyword] = useState(query.get("q") || "");
  const [logic, setLogic] = useState("AND");
  const [searchBy, setSearchBy] = useState("title");
  const [sort, setSort] = useState("newest");
  const [types, setTypes] = useState(resourceTypes);

  // Pagination state
  const [page, setPage] = useState(1);

  // Filter resource ตาม keyword เงื่อนไขประเภทและอื่นๆ
  const results = useMemo(() => {
    let filtered = resourcesData.resources || [];
    if (keyword.trim()) {
      filtered = filtered.filter(item => {
        const target = searchBy === "title"
          ? item.title
          : item.author || "";
        return logic === "AND"
          ? target.toLowerCase().includes(keyword.toLowerCase())
          : target.toLowerCase().includes(keyword.toLowerCase());
      });
    }
    // ประเภททรัพยากร (ถ้าไม่ได้ติ๊ก "ทั้งหมด" จะใช้ array filter)
    if (!types.includes("ทั้งหมด")) {
      filtered = filtered.filter(item => types.includes(item.type));
    }
    // sort
    if (sort === "newest") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return filtered;
  }, [keyword, logic, searchBy, sort, types]);

  // Pagination logic
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const pagedResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [keyword, logic, searchBy, sort, types]);

  // จัดการ checkbox ประเภททรัพยากร
  const handleTypeChange = (type) => {
    if (type === "ทั้งหมด") {
      setTypes(types.includes("ทั้งหมด") ? [] : [...resourceTypes]);
    } else {
      let updated = types.includes(type)
        ? types.filter(t => t !== type && t !== "ทั้งหมด")
        : [...types.filter(t => t !== "ทั้งหมด"), type];
      if (updated.length === resourceTypes.length - 1) {
        updated = [...resourceTypes];
      }
      setTypes(updated);
    }
  };

  // ฟอร์ม submit (กรณีอยากลิงก์กับ query string)
  const handleSubmit = (e) => {
    e.preventDefault();
    // navigate(`?q=${encodeURIComponent(keyword)}`); // ตัวอย่างถ้าจะลิงก์
  };

  return (
    <div className={classes.container}>
      {/* Sidebar */}
      <aside className={classes.sidebar}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div className={classes.label}>คำสำคัญ</div>
          <input
            className={classes.searchBox}
            placeholder="หนังสือ, หัวข้อ, ผู้แต่ง ฯลฯ"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />

          <div className={classes.label}>เงื่อนไข</div>
          <div className={classes.radioGroup}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="logic"
                value="AND"
                checked={logic === "AND"}
                onChange={() => setLogic("AND")}
                className={classes.radioInput}
              />
              และ
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="logic"
                value="OR"
                checked={logic === "OR"}
                onChange={() => setLogic("OR")}
                className={classes.radioInput}
              />
              หรือ
            </label>
          </div>

          <div className={classes.label}>ค้นหาจาก</div>
          <div className={classes.radioGroup}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="searchBy"
                value="title"
                checked={searchBy === "title"}
                onChange={() => setSearchBy("title")}
                className={classes.radioInput}
              />
              ชื่อหนังสือ
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="searchBy"
                value="author"
                checked={searchBy === "author"}
                onChange={() => setSearchBy("author")}
                className={classes.radioInput}
              />
              ชื่อผู้แต่ง
            </label>
          </div>

          <div className={classes.label}>เรียงลำดับจาก</div>
          <select
            className={classes.select}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">วันที่นำเข้า: ใหม่-เก่า</option>
            <option value="oldest">วันที่นำเข้า: เก่า-ใหม่</option>
          </select>

          <div className={classes.label}>ประเภททรัพยากร</div>
          <div className={classes.checkboxGroup}>
            {resourceTypes.map(type => (
              <label key={type} className={classes.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className={classes.checkboxInput}
                />
                {type}
              </label>
            ))}
          </div>
          <button type="submit" className={classes.button}>
            Advanced Search
          </button>
        </form>
      </aside>
      {/* Main Result */}
      <main className={classes.main}>
        <div className={classes.resultHeader}>
          <FaSearch style={{ color: "#1565c0" }} />
          {results.length === 0
            ? "ไม่พบรายการที่เกี่ยวข้อง"
            : <>พบข้อมูลทั้งหมด {results.length} รายการ {keyword && <>| คำค้น: <b>{keyword}</b></>}</>}
        </div>
        <ul className={classes.list}>
          {pagedResults.length === 0 && (
            <li style={{ fontSize: 18, color: "#b71c1c", margin: 18 }}>
              ไม่พบรายการที่เกี่ยวข้อง
            </li>
          )}
          {pagedResults.map((item, idx) => (
  <li className={classes.listItem} key={item.id} onClick={() => navigate(`/resource/${item.id}`)}>
    <div className={classes.index}>
      {(page - 1) * ITEMS_PER_PAGE + idx + 1}.
    </div>
    <img
      src={item.thumbnailUrl || "/no-image.png"}
      alt={item.title}
      className={classes.thumb}
    />
    <div className={classes.info}>
      <div className={classes.title} title={item.title}>
        {item.title}
      </div>
      <div className={classes.author}>
        <FaUser style={{ fontSize: 15, color: "#90caf9" }} />{" "}
        {item.author || <span style={{ color: "#bbb" }}>ไม่ระบุผู้แต่ง</span>}
      </div>
      <div className={classes.desc}>{item.description}</div>
      <div className={classes.meta}>
        <span className={classes.typeTag}>
          <FaFileAlt style={{ marginRight: 4 }} />
          {item.type}
        </span>
        <span className={classes.catTag}>
          <FaList style={{ marginRight: 4 }} />
          {item.category}
        </span>
        <span style={{ color: "#aaa", fontSize: 13, marginLeft: 8 }}>
          {item.createdAt && new Date(item.createdAt).toLocaleDateString("th-TH")}
        </span>
      </div>
    </div>
  </li>
))}
        </ul>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={classes.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={classes.pageBtn}
              style={page === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <FaChevronLeft style={{ marginRight: 4 }} />
              ก่อนหน้า
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={
                  classes.pageBtn + (page === i + 1 ? " " + classes.pageBtnActive : "")
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={classes.pageBtn}
              style={page === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              ถัดไป
              <FaChevronRight style={{ marginLeft: 4 }} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResult;
