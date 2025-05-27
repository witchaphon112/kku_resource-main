import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  termsPage: {
    padding: "2rem 0",
    maxWidth: 900,
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
    }
  },
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#a13d23",
    marginBottom: "1rem",
    fontWeight: 600,
  },
  sectionContent: {
    color: "#666",
    lineHeight: 1.8,
    "& p": {
      marginBottom: "1rem",
    },
    "& ul": {
      marginBottom: "1rem",
      paddingLeft: "1.5rem",
    },
    "& li": {
      marginBottom: "0.5rem",
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