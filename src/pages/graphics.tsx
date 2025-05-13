import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import resourcesData from "../mock/resources.json";

const useStyles = createUseStyles({
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    borderLeft: "6px solid #e9004b",
    paddingLeft: "0.75rem",
    color: "#212121",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    overflow: "hidden",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
    },
    "& img": {
      width: "100%",
      height: "180px",
      objectFit: "cover",
    },
  },
  content: {
    padding: "1rem",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  description: {
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "0.5rem",
  },
  footer: {
    textAlign: "right",
  },
});

const GraphicsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const graphicResources = resourcesData.resources.filter(
    (item) => item.type === "graphic"
  );

  return (
    <div className="p-4">
      <h2 className={classes.pageTitle}>ทรัพยากรกราฟฟิก</h2>
      <div className={classes.grid}>
        {graphicResources.map((item) => (
          <Card key={item.id} className={classes.card}>
            <img src={item.thumbnailUrl} alt={item.title} />
            <div className={classes.content}>
              <div className={classes.title}>{item.title}</div>
              <div className={classes.description}>{item.description}</div>
              <div className={classes.footer}>
                <Button
                  label="ดูรายละเอียด"
                  icon="pi pi-search"
                  className="p-button-sm p-button-outlined"
                  onClick={() => navigate(`/resource/${item.id}`)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GraphicsPage;
