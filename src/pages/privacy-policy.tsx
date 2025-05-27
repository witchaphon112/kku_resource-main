import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  privacyPage: {
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