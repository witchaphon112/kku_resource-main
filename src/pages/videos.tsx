import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import resourcesData from "../mock/resources.json";

/* ----------------------- style ----------------------- */
const useStyles = createUseStyles({
  container: { padding: "2rem" },

  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  filterGroup: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  dropdown: {
    padding: ".5rem 1rem", borderRadius: 10,
    border: "1px solid #ccc", fontSize: "1rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: "2rem",
  },
  card: {
    textAlign: "center", cursor: "pointer",
    transition: "transform .2s",
    "&:hover": { transform: "translateY(-4px)" },
  },

  /* ---------------- thumbnail / player ---------------- */
  thumb: {
    width: "100%", height: 160, objectFit: "cover",
    borderRadius: 6, boxShadow: "0 2px 6px rgba(0,0,0,.1)",
    background: "#000", border: 0,
  },
  iframe: { composes: "$thumb" },      // ใช้ style เดียวกับ thumb
  video : { composes: "$thumb" },

  title: {
    marginTop: ".75rem", fontWeight: 600,
    fontSize: "1rem", lineHeight: 1.3,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },

  /* ---------------- pagination ---------------- */
  pagination: {
    marginTop: "2rem",
    display: "flex", justifyContent: "center", gap: "1rem",
  },
  pageButton: {
    width: 32, height: 32, borderRadius: "50%", border: "none",
    background: "#ccc", color: "#fff", fontWeight: 700, cursor: "pointer",
    "&.active": { background: "#b71c1c" },
  },
});

/* ===================================================== */
const PageGallery = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const perPage = 12;
  const [page,     setPage]     = useState(1);
  const [category, setCategory] = useState<"all" | "medical" | "campus" | "education">("all");
  const [sortBy,   setSortBy]   = useState<"latest"|"oldest"|"popular"|"az"|"za">("latest");

  /* ---------------- data ---------------- */
  const videos = resourcesData.resources.filter((r)=>r.type==="video");

  /* filter → sort → paginate */
  const filtered = category==="all" ? videos : videos.filter((v)=>v.category===category);

  const sorted = [...filtered].sort((a,b)=>{
    if (sortBy==="latest")  return +new Date(b.createdAt) - +new Date(a.createdAt);
    if (sortBy==="oldest")  return +new Date(a.createdAt) - +new Date(b.createdAt);
    if (sortBy==="popular") return (b.viewCount||0) - (a.viewCount||0);
    if (sortBy==="az")      return a.title.localeCompare(b.title,"th");
    if (sortBy==="za")      return b.title.localeCompare(a.title,"th");
    return 0;
  });

  const pages = Math.ceil(sorted.length/perPage);
  const list  = sorted.slice((page-1)*perPage, page*perPage);

  /* ---------------- handlers ---------------- */
  const handleCategory = (e:React.ChangeEvent<HTMLSelectElement>)=>{
    setCategory(e.target.value as typeof category); setPage(1);
  };
  const handleSort = (e:React.ChangeEvent<HTMLSelectElement>)=>{
    setSortBy(e.target.value as typeof sortBy); setPage(1);
  };

  /* ---------------- helper : youtube embed ---------------- */
  const embedYT = (url:string)=>{
    const id = url.match(/(?:youtu\.be\/|v=)([^?&]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  /* =================================================== */
  return (
    <div className={classes.container}>
      <h2 style={{textAlign:"center",fontSize:"2rem",fontWeight:700}}>คลังวิดีโอ</h2>

      {/* ------------ filter / sort ------------ */}
      <div className={classes.header}>
        <div className={classes.filterGroup}>
          <select className={classes.dropdown} value={category} onChange={handleCategory}>
            <option value="all">หมวดหมู่ทั้งหมด</option>
            <option value="medical">การแพทย์</option>
            <option value="campus">รอบรั้วมหาวิทยาลัย</option>
            <option value="education">การศึกษา</option>
          </select>

          <select className={classes.dropdown} value={sortBy} onChange={handleSort}>
            <option value="latest">วันที่ใหม่สุด</option>
            <option value="oldest">วันที่เก่าสุด</option>
            <option value="popular">ยอดนิยม</option>
            <option value="az">ชื่อ&nbsp;A→Z</option>
            <option value="za">ชื่อ&nbsp;Z→A</option>
          </select>
        </div>
      </div>

      {/* ------------ grid ------------ */}
      <div className={classes.grid}>
        {list.map((v)=>{

          const hasVideoUrl = !!v.videoUrl;
          const isMp4       = !hasVideoUrl && v.fileUrl?.endsWith(".mp4");

          return (
            <div key={v.id} className={classes.card} onClick={()=>navigate(`/resource/${v.id}`)}>
              {/* YouTube / Vimeo */}
              {hasVideoUrl && (
                <iframe
                  src={embedYT(v.videoUrl)}
                  className={classes.iframe}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={v.title}
                />
              )}

              {/* MP4 จาก server */}
              {isMp4 && (
                <video
                  src={v.fileUrl}
                  poster={v.thumbnailUrl}
                  className={classes.video}
                  controls preload="metadata"
                />
              )}

              {/* fallback รูปภาพ */}
              {!hasVideoUrl && !isMp4 && (
                <img
                  src={v.thumbnailUrl || "/fallback-thumbnail.jpg"}
                  alt={v.title}
                  className={classes.thumb}
                />
              )}

              <div className={classes.title}>{v.title}</div>
            </div>
          );
        })}
      </div>

      {/* ------------ pagination ------------ */}
      <div className={classes.pagination}>
        {Array.from({length:pages},(_,i)=>i+1).map(n=>(
          <button
            key={n}
            className={`${classes.pageButton} ${page===n?"active":""}`}
            onClick={()=>setPage(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageGallery;
