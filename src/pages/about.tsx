import { createUseStyles } from "react-jss";
import { Card } from "primereact/card";

const useStyles = createUseStyles({
  aboutPage: {
    padding: "2rem 0",
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    "& h1": {
      fontSize: "2.5rem",
      color: "#a13d23",
      marginBottom: "1rem",
      fontWeight: 600,
    },
    "& p": {
      fontSize: "1.1rem",
      color: "#666",
      maxWidth: 800,
      margin: "0 auto",
      lineHeight: 1.6,
    }
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    }
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#a13d23",
    marginBottom: "1rem",
    fontWeight: 600,
  },
  cardText: {
    color: "#666",
    lineHeight: 1.6,
    marginBottom: "1rem",
  },
  icon: {
    fontSize: "2rem",
    color: "#a13d23",
    marginBottom: "1rem",
  },
  contactSection: {
    background: "#f8f9fb",
    padding: "3rem",
    borderRadius: 16,
    textAlign: "center",
    marginTop: "3rem",
  },
  contactTitle: {
    fontSize: "1.8rem",
    color: "#a13d23",
    marginBottom: "1.5rem",
    fontWeight: 600,
  },
  contactText: {
    color: "#666",
    marginBottom: "2rem",
    fontSize: "1.1rem",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginTop: "2rem",
    "& a": {
      color: "#a13d23",
      fontSize: "1.5rem",
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "scale(1.1)",
      }
    }
  }
});

const AboutPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.aboutPage}>
      <div className={classes.header}>
        <h1>เกี่ยวกับ KKU Resource</h1>
        <p>
          คลังทรัพยากรดิจิทัลเพื่อการศึกษาของมหาวิทยาลัยขอนแก่น 
          ที่รวบรวมและจัดเก็บสื่อการเรียนรู้คุณภาพสูงสำหรับนักศึกษาและบุคลากร
        </p>
      </div>

      <div className={classes.content}>
        <Card className={classes.card}>
          <div className={classes.cardContent}>
            <i className={`pi pi-images ${classes.icon}`} />
            <h2 className={classes.cardTitle}>คลังทรัพยากรที่หลากหลาย</h2>
            <p className={classes.cardText}>
              รวบรวมสื่อการเรียนรู้มากมาย ทั้งรูปภาพ วิดีโอ และกราฟิก 
              ที่สามารถนำไปใช้ในการเรียนการสอนและการทำงานได้ทันที
            </p>
          </div>
        </Card>

        <Card className={classes.card}>
          <div className={classes.cardContent}>
            <i className={`pi pi-check-circle ${classes.icon}`} />
            <h2 className={classes.cardTitle}>คุณภาพสูง</h2>
            <p className={classes.cardText}>
              ทุกสื่อการเรียนรู้ผ่านการคัดสรรและตรวจสอบคุณภาพ 
              เพื่อให้มั่นใจว่ามีความเหมาะสมสำหรับการใช้งานจริง
            </p>
          </div>
        </Card>

        <Card className={classes.card}>
          <div className={classes.cardContent}>
            <i className={`pi pi-lock ${classes.icon}`} />
            <h2 className={classes.cardTitle}>ปลอดภัยและน่าเชื่อถือ</h2>
            <p className={classes.cardText}>
              ระบบรักษาความปลอดภัยมาตรฐานสูง 
              พร้อมการจัดการลิขสิทธิ์ที่ถูกต้องตามกฎหมาย
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
