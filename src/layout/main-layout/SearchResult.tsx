import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import resourcesData from "../../mock/resources.json";
import { createUseStyles } from "react-jss";
import {
  FaSearch,
  FaFileAlt,
  FaUser,
  FaList,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    gap: 36,
    margin: "40px auto",
    maxWidth: 1280,
    alignItems: "flex-start",
    '@media (max-width: 900px)': { flexDirection: "column" },
  },
  sidebar: {
    width: 320,
    background: "#fffdfa",
    borderRadius: 18,
    padding: "2.3rem 1.5rem 2rem 1.5rem",
    boxShadow: "0 6px 24px #b71c1c18",
    fontFamily: "var(--bs-font-primary)",
    fontSize: "1.08rem",
    minHeight: 540,
    position: "sticky",
    top: 32,
    border: "1.5px solid #f5c6a5",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    transition: "box-shadow 0.2s, background 0.2s",
  },
  label: {
    fontWeight: 800,
    fontSize: 18,
    color: "#b71c1c",
    marginBottom: 10,
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: 0.01,
  },
  searchBox: {
    width: "100%",
    padding: "1rem 1.2rem",
    borderRadius: 12,
    border: "1.7px solid #e0cfc0",
    fontSize: 16,
    marginBottom: 16,
    outline: "none",
    background: "#fff",
    boxShadow: "0 1.5px 8px #e0cfc033",
    transition: "border 0.18s, box-shadow 0.18s",
    fontWeight: 600,
    color: "#b71c1c",
    "&:focus": { border: "1.7px solid #b71c1c", boxShadow: "0 2px 12px #b71c1c22" }
  },
  radioGroup: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 10,
    background: "#fff7f0",
    padding: "10px 14px",
    borderRadius: 12,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    gap: 7,
    cursor: "pointer",
    fontSize: 15,
    borderRadius: 9,
    padding: "4px 12px 4px 4px",
    transition: "background 0.15s, color 0.15s",
    color: "#b85c38",
    "&:hover": { background: "#fbeee6", color: "#b71c1c" },
  },
  radioInput: {
    accentColor: "#b71c1c",
    width: 20, height: 20, marginRight: 7,
    boxShadow: "0 1px 4px #b71c1c22",
    borderRadius: 10,
    background: "#fff",
    border: "1.2px solid #b85c38",
    transition: "box-shadow 0.15s",
  },
  select: {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: 10,
    border: "1.2px solid #e0cfc0",
    fontSize: 15,
    background: "#fff",
    outline: "none",
    marginBottom: 12,
    color: "#b85c38",
    fontWeight: 600,
    boxShadow: "0 1.5px 8px #e0cfc033",
    transition: "border 0.18s, box-shadow 0.18s",
    "&:focus": { border: "1.2px solid #b71c1c", boxShadow: "0 2px 12px #b71c1c22" },
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
    background: "#fff7f0",
    padding: "14px 12px 10px 12px",
    borderRadius: 12,
    boxShadow: "0 1.5px 8px #b71c1c11",
  },
  checkboxLabel: {
    display: "flex", alignItems: "center", gap: 8,
    fontWeight: 700, cursor: "pointer",
    borderRadius: 8, padding: "6px 0 6px 6px",
    fontSize: 15,
    transition: "background 0.15s, color 0.15s",
    color: "#b85c38",
    "&:hover": { background: "#fbeee6", color: "#b71c1c" },
  },
  checkboxInput: {
    accentColor: "#b71c1c",
    width: 18, height: 18, marginRight: 8,
    boxShadow: "0 1px 4px #b71c1c22",
    borderRadius: 7,
    background: "#fff",
    border: "1.2px solid #b85c38",
    transition: "box-shadow 0.15s",
  },
  button: {
    background: "linear-gradient(90deg, #b71c1c 60%, #b85c38 100%)",
    color: "#fff",
    borderRadius: 18,
    fontSize: 17,
    fontWeight: 800,
    padding: "12px 0",
    marginTop: 16,
    width: "100%",
    border: "none",
    boxShadow: "0 2px 12px #b71c1c22",
    cursor: "pointer",
    letterSpacing: 0.5,
    transition: "background 0.18s, box-shadow 0.18s",
    "&:hover": { background: "#892d05", boxShadow: "0 4px 14px #b85c3844" }
  },
  main: {
    flex: 1,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 14px #b71c1c11",
    padding: "2.2rem 1.7rem",
    minHeight: 400,
    fontFamily: "var(--bs-font-primary)",
    '@media (max-width: 900px)': { padding: "1.2rem 0.6rem" }
  },
  resultHeader: {
    fontWeight: 900,
    fontSize: 21,
    marginBottom: 18,
    color: "#b71c1c",
    letterSpacing: 0.1,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 16px",
    background: "#fff7f0",
    borderRadius: 12,
    boxShadow: "0 1.5px 8px #b71c1c11",
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    borderRadius: 13,
    marginBottom: 18,
    background: "#fffdfa",
    boxShadow: "0 2px 12px #b85c3811",
    padding: "1.3rem 1.1rem",
    transition: "box-shadow 0.18s, background 0.18s, transform 0.15s",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      background: "#fbeee6",
      boxShadow: "0 6px 18px #b71c1c22",
      transform: "scale(1.012)"
    }
  },
  index: {
    minWidth: 32,
    color: "#b71c1c",
    fontWeight: 800,
    fontSize: "1.08rem",
    textAlign: "right",
    marginTop: 6,
  },
  thumb: {
    width: 80,
    height: 100,
    marginBottom: 8,
    objectFit: "cover",
    borderRadius: 10,
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
    fontSize: "1.09rem",
    color: "#b71c1c",
    marginBottom: 5,
    cursor: "pointer",
    "&:hover": { textDecoration: "underline", color: "#b85c38" },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 450,
    letterSpacing: 0.1
  },
  author: {
    fontSize: "0.98rem",
    color: "#b85c38",
    marginBottom: 1,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 7
  },
  desc: {
    fontSize: "0.97rem",
    color: "#555",
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
    gap: 10
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
    fontSize: 13,
  },
  catTag: {
    display: "inline-flex",
    alignItems: "center",
    background: "#e3f2fd",
    color: "#1976d2",
    borderRadius: 8,
    padding: "3px 12px",
    fontWeight: 700,
    fontSize: 13,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 28,
    gap: 7
  },
  pageBtn: {
    padding: "8px 15px",
    borderRadius: 14,
    border: "1.2px solid #f5c6a5",
    background: "#fff",
    color: "#b85c38",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.19s, color 0.19s, box-shadow 0.12s",
    boxShadow: "0 1.5px 8px #b85c3809",
    "&:hover": { background: "#b85c38", color: "#fff" }
  },
  pageBtnActive: {
    background: "#b71c1c",
    color: "#fff",
    border: "1.2px solid #b71c1c",
    boxShadow: "0 3px 10px #b71c1c33"
  }
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const resourceTypes = [
  "ทั้งหมด",
  "image",
  "video",
  "graphic"
];

const ITEMS_PER_PAGE = 20;

const getYearCounts = (resources: { createdAt: string }[]) => {
  const counts: Record<string, number> = {};
  resources.forEach(item => {
    const year = (new Date(item.createdAt).getFullYear() + 543).toString();
    counts[year] = (counts[year] || 0) + 1;
  });
  return counts;
};

const getUniqueYears = (resources: { createdAt: string }[]) => {
  const years = resources.map(item => (new Date(item.createdAt).getFullYear() + 543).toString());
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
};

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
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  const yearCounts = getYearCounts(resourcesData.resources);
  const uniqueYears = getUniqueYears(resourcesData.resources);

  const results = useMemo(() => {
    let filtered = resourcesData.resources || [];
    if (keyword.trim()) {
      filtered = filtered.filter(item => {
        const target = searchBy === "title"
          ? item.title
          : item.uploadedBy || "";
        return logic === "AND"
          ? target.toLowerCase().includes(keyword.toLowerCase())
          : target.toLowerCase().includes(keyword.toLowerCase());
      });
    }
    if (!types.includes("ทั้งหมด")) {
      filtered = filtered.filter(item => types.includes(item.type));
    }
    if (selectedYears.length > 0) {
      filtered = filtered.filter(item => selectedYears.includes((new Date(item.createdAt).getFullYear() + 543).toString()));
    }
    if (sort === "newest") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
    } else if (sort === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
    }
    return filtered;
  }, [keyword, logic, searchBy, sort, types, selectedYears]);

  const totalPages = Math.ceil(Number(results.length) / Number(ITEMS_PER_PAGE));
  const pagedResults = results.slice(
    (Number(page) - 1) * Number(ITEMS_PER_PAGE),
    Number(page) * Number(ITEMS_PER_PAGE)
  );

  useEffect(() => { setPage(1); }, [keyword, logic, searchBy, sort, types, selectedYears]);

  const handleTypeChange = (type: string) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={classes.container}>
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

          <div className={classes.label}>ปีพิมพ์</div>
          <div className={classes.checkboxGroup} style={{ maxHeight: 260, overflowY: 'auto' }}>
            {uniqueYears.map(year => (
              <label key={year} className={classes.checkboxLabel} style={{ justifyContent: 'space-between' }}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={() => setSelectedYears(selectedYears.includes(year)
                      ? selectedYears.filter(y => y !== year)
                      : [...selectedYears, year])}
                    className={classes.checkboxInput}
                  />
                  {year}
                </span>
                <span style={{ color: '#222', fontWeight: 500, fontSize: 15, marginLeft: 8 }}>
                  ({yearCounts[year] || 0})
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className={classes.button}>
            Advanced Search
          </button>
        </form>
      </aside>
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
        {item.uploadedBy || "ไม่ระบุผู้สร้าง"}
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
