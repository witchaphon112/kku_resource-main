import { createUseStyles } from "react-jss";

const THEME = {
  colors: {
    primary: "#112D4E",
    secondary: "#3F72AF",
    text: {
      primary: "#112D4E",
      secondary: "#666666",
      light: "#DBE2EF"
    },
    background: {
      main: "#ffffff",
      light: "#F9F7F7"
    }
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px"
  },
  shadows: {
    card: "0 4px 20px rgba(17,45,78,0.08)",
    cardHover: "0 8px 30px rgba(17,45,78,0.12)",
  }
};

const useStyles = createUseStyles({
  privacyPage: {
    padding: "4rem 2rem",
    maxWidth: 900,
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "3rem 1rem",
    }
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    "& h1": {
      fontSize: "2.5rem",
      color: THEME.colors.primary,
      marginBottom: "1.2rem",
      fontWeight: 700,
      "@media (max-width: 768px)": {
        fontSize: "2rem",
        marginBottom: "1rem",
      }
    }
  },
  section: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    padding: "2.5rem",
    marginBottom: "2rem",
    boxShadow: THEME.shadows.card,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: THEME.shadows.cardHover,
      transform: "translateY(-2px)",
    },
    "@media (max-width: 768px)": {
      padding: "1.5rem",
      marginBottom: "1.5rem",
      borderRadius: THEME.borderRadius.md,
      "&:hover": {
        transform: "none",
      }
    }
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: THEME.colors.secondary,
    marginBottom: "1.2rem",
    fontWeight: 600,
    position: "relative",
    paddingBottom: "0.8rem",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "40px",
      height: "3px",
      background: THEME.colors.secondary,
      borderRadius: "2px",
    },
    "@media (max-width: 768px)": {
      fontSize: "1.3rem",
      marginBottom: "1rem",
    }
  },
  sectionContent: {
    color: THEME.colors.text.secondary,
    lineHeight: 1.8,
    fontSize: "1.05rem",
    "& p": {
      marginBottom: "1.2rem",
      "@media (max-width: 768px)": {
        fontSize: "0.95rem",
        marginBottom: "1rem",
        lineHeight: 1.6,
      }
    },
    "& ul": {
      marginBottom: "1.2rem",
      paddingLeft: "1.5rem",
      "@media (max-width: 768px)": {
        paddingLeft: "1.2rem",
        marginBottom: "1rem",
      }
    },
    "& li": {
      marginBottom: "0.8rem",
      position: "relative",
      paddingLeft: "0.5rem",
      "&::marker": {
        color: THEME.colors.secondary,
      },
      "@media (max-width: 768px)": {
        fontSize: "0.95rem",
        marginBottom: "0.6rem",
        lineHeight: 1.6,
      }
    }
  }
});

const PrivacyPolicyPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.privacyPage}>
      <div className={classes.header}>
        <h1>นโยบายความเป็นส่วนตัว</h1>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การเก็บข้อมูลส่วนบุคคล</h2>
        <div className={classes.sectionContent}>
          <p>
            KKU Resource ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ 
            เราจะเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณเฉพาะเท่าที่จำเป็น 
            และภายใต้ขอบเขตของวัตถุประสงค์ที่ได้แจ้งให้คุณทราบ
          </p>
          <p>ข้อมูลส่วนบุคคลที่เราอาจเก็บรวบรวม ได้แก่:</p>
          <ul>
            <li>ข้อมูลบัญชีผู้ใช้ (ชื่อผู้ใช้, อีเมล, รหัสผ่าน)</li>
            <li>ข้อมูลการใช้งาน (ประวัติการดาวน์โหลด, การค้นหา)</li>
            <li>ข้อมูลการติดต่อ (อีเมล, เบอร์โทรศัพท์)</li>
          </ul>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การใช้งานข้อมูล</h2>
        <div className={classes.sectionContent}>
          <p>เราจะใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:</p>
          <ul>
            <li>ให้บริการและจัดการบัญชีผู้ใช้ของคุณ</li>
            <li>ปรับปรุงและพัฒนาบริการของเรา</li>
            <li>ส่งข้อมูลและข่าวสารที่เกี่ยวข้อง</li>
            <li>ป้องกันและตรวจสอบการใช้งานที่ไม่เหมาะสม</li>
          </ul>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การคุ้มครองข้อมูล</h2>
        <div className={classes.sectionContent}>
          <p>
            เรามีมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง 
            การใช้ หรือการเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต 
            รวมถึงการเข้ารหัสข้อมูลและการควบคุมการเข้าถึง
          </p>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>สิทธิ์ของคุณ</h2>
        <div className={classes.sectionContent}>
          <p>คุณมีสิทธิ์ในการ:</p>
          <ul>
            <li>เข้าถึงและขอสำเนาข้อมูลส่วนบุคคลของคุณ</li>
            <li>ขอแก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้อง</li>
            <li>ขอลบข้อมูลส่วนบุคคลของคุณ</li>
            <li>คัดค้านการประมวลผลข้อมูลส่วนบุคคลของคุณ</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 