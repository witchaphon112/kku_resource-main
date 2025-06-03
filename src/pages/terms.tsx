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
  termsPage: {
    padding: "4rem 2rem",
    maxWidth: 900,
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "2rem 1rem",
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
        fontSize: "1rem",
        marginBottom: "1rem",
      }
    },
    "& ul": {
      marginBottom: "1.2rem",
      paddingLeft: "1.5rem",
      "@media (max-width: 768px)": {
        paddingLeft: "1.2rem",
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
        fontSize: "1rem",
        marginBottom: "0.6rem",
      }
    }
  }
});

const TermsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.termsPage}>
      <div className={classes.header}>
        <h1>เงื่อนไขการใช้งาน</h1>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การยอมรับเงื่อนไข</h2>
        <div className={classes.sectionContent}>
          <p>
            การเข้าใช้งาน KKU Resource ถือว่าคุณได้ยอมรับและตกลงที่จะปฏิบัติตามเงื่อนไขการใช้งานทั้งหมด 
            หากคุณไม่ยอมรับเงื่อนไขเหล่านี้ กรุณาอย่าเข้าใช้งานเว็บไซต์
          </p>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>สิทธิ์การใช้งาน</h2>
        <div className={classes.sectionContent}>
          <p>ผู้ใช้สามารถ:</p>
          <ul>
            <li>เข้าถึงและดาวน์โหลดสื่อการเรียนรู้สำหรับการใช้งานส่วนตัว</li>
            <li>ใช้สื่อในการเรียนการสอนและการทำงาน</li>
            <li>แชร์ลิงก์ของสื่อให้ผู้อื่น</li>
          </ul>
          <p>ข้อจำกัดการใช้งาน:</p>
          <ul>
            <li>ห้ามนำสื่อไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต</li>
            <li>ห้ามแก้ไขหรือดัดแปลงสื่อโดยไม่ได้รับอนุญาต</li>
            <li>ห้ามแจกจ่ายหรือเผยแพร่สื่อในรูปแบบอื่นๆ</li>
          </ul>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>บัญชีผู้ใช้</h2>
        <div className={classes.sectionContent}>
          <p>ผู้ใช้ต้อง:</p>
          <ul>
            <li>ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
            <li>รักษาความลับของบัญชีและรหัสผ่าน</li>
            <li>แจ้งทันทีหากพบการใช้งานที่ไม่ได้รับอนุญาต</li>
          </ul>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การละเมิดลิขสิทธิ์</h2>
        <div className={classes.sectionContent}>
          <p>
            KKU Resource ให้ความสำคัญกับการคุ้มครองทรัพย์สินทางปัญญา 
            หากพบการละเมิดลิขสิทธิ์ เราจะดำเนินการตามกฎหมายอย่างเคร่งครัด
          </p>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>การเปลี่ยนแปลงเงื่อนไข</h2>
        <div className={classes.sectionContent}>
          <p>
            เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงเงื่อนไขการใช้งานได้ทุกเมื่อ 
            โดยจะแจ้งให้ผู้ใช้ทราบล่วงหน้าผ่านเว็บไซต์หรืออีเมล
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 