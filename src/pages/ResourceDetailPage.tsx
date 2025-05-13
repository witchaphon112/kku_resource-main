import { useParams } from "react-router-dom";
import resourcesData from "../mock/resources.json";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    padding: "2rem 1rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1rem",
    lineHeight: 1.4,
  },
  meta: {
    fontSize: "0.95rem",
    color: "#888",
    marginBottom: "1rem",
  },
  image: {
    width: "100%",
    maxHeight: "450px",
    objectFit: "cover",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.05rem",
    lineHeight: 1.6,
    color: "#333",
    marginBottom: "1.5rem",
  },
  detailList: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
    "& li": {
      marginBottom: "0.5rem",
    },
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginTop: "2rem",
    marginBottom: "0.5rem",
    color: "#d1410c",
  },
});

const ResourceDetailPage = () => {
  const { id } = useParams();
  const classes = useStyles();
  const resource = resourcesData.resources.find((r) => r.id === id);

  if (!resource) return <p style={{ textAlign: "center" }}>ไม่พบข้อมูลทรัพยากร</p>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{resource.title}</h1>
      <p className={classes.meta}>
        ประเภท: <strong>{resource.type}</strong> | หมวดหมู่: <strong>{resource.category}</strong>
      </p>
      <img src={resource.thumbnailUrl} alt={resource.title} className={classes.image} />
      <p className={classes.description}>{resource.description}</p>

      <div>
        <h3 className={classes.sectionTitle}>ข้อมูลเพิ่มเติม</h3>
        <ul className={classes.detailList}>
          <li>อัปโหลดโดย: {resource.uploadedBy}</li>
          <li>จำนวนดาวน์โหลด: {resource.downloadCount}</li>
          <li>วันที่สร้าง: {new Date(resource.createdAt).toLocaleDateString("th-TH")}</li>
          <li>อัปเดตล่าสุด: {new Date(resource.updatedAt).toLocaleDateString("th-TH")}</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
