import { createUseStyles } from "react-jss";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useState } from "react";

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
  contactPage: {
    padding: "4rem 2rem",
    maxWidth: 1100,
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
    },
    "& p": {
      fontSize: "1.1rem",
      color: THEME.colors.text.secondary,
      maxWidth: 600,
      margin: "0 auto",
      lineHeight: 1.6,
      "@media (max-width: 768px)": {
        fontSize: "1rem",
      }
    }
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "2rem",
    }
  },
  contactForm: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    padding: "2.5rem",
    boxShadow: THEME.shadows.card,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: THEME.shadows.cardHover,
    },
    "@media (max-width: 768px)": {
      padding: "1.5rem",
    }
  },
  formGroup: {
    marginBottom: "1.5rem",
    "& label": {
      display: "block",
      marginBottom: "0.5rem",
      color: THEME.colors.text.secondary,
      fontWeight: 500,
    },
    "& .p-inputtext, & .p-inputtextarea": {
      width: "100%",
      padding: "0.75rem",
      borderRadius: THEME.borderRadius.sm,
      border: `1px solid ${THEME.colors.text.light}`,
      "&:focus": {
        borderColor: THEME.colors.secondary,
        boxShadow: `0 0 0 2px ${THEME.colors.text.light}`,
      }
    }
  },
  contactInfo: {
    "& h2": {
      fontSize: "1.8rem",
      color: THEME.colors.primary,
      marginBottom: "1.8rem",
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
        fontSize: "1.5rem",
        marginBottom: "1.5rem",
      }
    }
  },
  infoCard: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    padding: "1.8rem",
    marginBottom: "1.5rem",
    boxShadow: THEME.shadows.card,
    display: "flex",
    alignItems: "flex-start",
    gap: "1.2rem",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: THEME.shadows.cardHover,
      transform: "translateY(-2px)",
    },
    "& i": {
      fontSize: "1.5rem",
      color: THEME.colors.secondary,
    },
    "@media (max-width: 768px)": {
      padding: "1.2rem",
      gap: "1rem",
    }
  },
  infoContent: {
    "& h3": {
      fontSize: "1.2rem",
      color: THEME.colors.primary,
      marginBottom: "0.5rem",
      fontWeight: 600,
    },
    "& p": {
      color: THEME.colors.text.secondary,
      margin: "0 0 0.3rem 0",
      lineHeight: 1.6,
    }
  },
  socialLinks: {
    display: "flex",
    gap: "1.2rem",
    marginTop: "2.5rem",
    "& a": {
      color: THEME.colors.secondary,
      fontSize: "1.5rem",
      transition: "all 0.3s ease",
      padding: "0.5rem",
      borderRadius: "50%",
      background: THEME.colors.background.light,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        transform: "translateY(-3px)",
        color: THEME.colors.primary,
        background: THEME.colors.text.light,
      }
    }
  },
  submitButton: {
    background: THEME.colors.secondary,
    border: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: `${THEME.colors.primary} !important`,
      transform: "translateY(-2px)",
    },
    "&:focus": {
      boxShadow: `0 0 0 2px ${THEME.colors.text.light}`,
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
              className={`p-button-rounded ${classes.submitButton}`}
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