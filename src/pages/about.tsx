import { createUseStyles } from "react-jss";
import { Card } from "primereact/card";

const useStyles = createUseStyles({
  aboutPage: {
    padding: "7rem 2rem",
    maxWidth: 1200,
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "4rem 1rem",
    }
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    "& h1": {
      fontSize: "2.5rem",
      color: "#3F72AF",
      marginBottom: "1rem",
      fontWeight: 600,
      "@media (max-width: 768px)": {
        fontSize: "2rem",
      }
    },
    "& p": {
      fontSize: "1.1rem",
      color: "#666",
      maxWidth: 800,
      margin: "0 auto",
      lineHeight: 1.6,
      "@media (max-width: 768px)": {
        fontSize: "1rem",
        lineHeight: 1.5,
      }
    }
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "1.5rem",
    }
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(63,114,175,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(63,114,175,0.12)",
    },
    "@media (max-width: 768px)": {
      borderRadius: 12,
    }
  },
  cardContent: {
    padding: "1.5rem",
    "@media (max-width: 768px)": {
      padding: "1.2rem",
    }
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#3F72AF",
    marginBottom: "1rem",
    fontWeight: 600,
    "@media (max-width: 768px)": {
      fontSize: "1.3rem",
    }
  },
  cardText: {
    color: "#666",
    lineHeight: 1.6,
    marginBottom: "1rem",
    "@media (max-width: 768px)": {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    }
  },
  icon: {
    fontSize: "2rem",
    color: "#3F72AF",
    marginBottom: "1rem",
    "@media (max-width: 768px)": {
      fontSize: "1.8rem",
    }
  },
  contactSection: {
    background: "#f8faff",
    padding: "3rem",
    borderRadius: 16,
    textAlign: "center",
    marginTop: "3rem",
    boxShadow: "0 4px 20px rgba(63,114,175,0.08)",
    "@media (max-width: 768px)": {
      padding: "2rem 1rem",
      borderRadius: 12,
    }
  },
  contactTitle: {
    fontSize: "1.8rem",
    color: "#3F72AF",
    marginBottom: "1.5rem",
    fontWeight: 600,
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
      marginBottom: "1.2rem",
    }
  },
  contactText: {
    color: "#666",
    marginBottom: "2rem",
    fontSize: "1.1rem",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
      marginBottom: "1.5rem",
    }
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginTop: "2rem",
    "@media (max-width: 768px)": {
      gap: "1.2rem",
    },
    "& a": {
      color: "#3F72AF",
      fontSize: "1.5rem",
      transition: "transform 0.2s ease",
      padding: "0.5rem",
      "&:hover": {
        transform: "scale(1.1)",
      },
      "@media (max-width: 768px)": {
        fontSize: "1.3rem",
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
