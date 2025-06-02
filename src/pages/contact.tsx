import { createUseStyles } from "react-jss";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useState } from "react";

const useStyles = createUseStyles({
  contactPage: {
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
    },
    "& p": {
      fontSize: "1.1rem",
      color: "#666",
      maxWidth: 600,
      margin: "0 auto",
      lineHeight: 1.6,
    }
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    }
  },
  contactForm: {
    background: "#fff",
    borderRadius: 16,
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  formGroup: {
    marginBottom: "1.5rem",
    "& label": {
      display: "block",
      marginBottom: "0.5rem",
      color: "#666",
      fontWeight: 500,
    },
    "& .p-inputtext, & .p-inputtextarea": {
      width: "100%",
      padding: "0.75rem",
      borderRadius: 8,
      border: "1px solid #ddd",
      "&:focus": {
        borderColor: "#a13d23",
        boxShadow: "0 0 0 2px rgba(161, 61, 35, 0.1)",
      }
    }
  },
  contactInfo: {
    "& h2": {
      fontSize: "1.5rem",
      color: "#a13d23",
      marginBottom: "1.5rem",
      fontWeight: 600,
    }
  },
  infoCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    "& i": {
      fontSize: "1.5rem",
      color: "#a13d23",
    }
  },
  infoContent: {
    "& h3": {
      fontSize: "1.1rem",
      color: "#333",
      marginBottom: "0.25rem",
      fontWeight: 600,
    },
    "& p": {
      color: "#666",
      margin: 0,
    }
  },
  socialLinks: {
    display: "flex",
    gap: "1rem",
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

const ContactPage = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={classes.contactPage}>
      <div className={classes.header}>
        <h1>ติดต่อเรา</h1>
        <p>
          หากคุณมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม 
          กรุณาติดต่อเราได้ผ่านช่องทางด้านล่างนี้
        </p>
      </div>

      <div className={classes.content}>
        <div className={classes.contactForm}>
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="name">ชื่อ-นามสกุล</label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="email">อีเมล</label>
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="subject">หัวข้อ</label>
              <InputText
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="message">ข้อความ</label>
              <InputTextarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>

            <Button
              type="submit"
              label="ส่งข้อความ"
              icon="pi pi-send"
              className="p-button-rounded"
              style={{ width: "100%" }}
            />
          </form>
        </div>

        <div className={classes.contactInfo}>
          <h2>ข้อมูลการติดต่อ</h2>
          
          <div className={classes.infoCard}>
            <i className="pi pi-map-marker" />
            <div className={classes.infoContent}>
              <h3>ที่อยู่</h3>
              <p>มหาวิทยาลัยขอนแก่น</p>
              <p>123 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40002</p>
            </div>
          </div>

          <div className={classes.infoCard}>
            <i className="pi pi-phone" />
            <div className={classes.infoContent}>
              <h3>โทรศัพท์</h3>
              <p>043-009700 ต่อ 42100</p>
            </div>
          </div>

          <div className={classes.infoCard}>
            <i className="pi pi-envelope" />
            <div className={classes.infoContent}>
              <h3>อีเมล</h3>
              <p>resource@kku.ac.th</p>
            </div>
          </div>

          <div className={classes.socialLinks}>
            <a href="https://www.facebook.com/LTICKKU" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-facebook" />
            </a>
            <a href="https://www.youtube.com/@kku_channel/videos" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-youtube" />
            </a>
            <a href="https://www.instagram.com/khonkaenuniversity/channel/" target="_blank" rel="noopener noreferrer">
              <i className="pi pi-instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 