import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { MenuItem } from "primereact/menuitem";
import { createUseStyles } from "react-jss";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";

const useStyles = createUseStyles({
  mainLayout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    background: "linear-gradient(to right, #892d05, #d1410c)",
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(137, 45, 5, 1)",
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#ffffff",
    "& img": {
      marginRight: "0.5rem",
      height: "80px",
    },
  },
  searchBar: {
    flex: 1,
    maxWidth: "500px",
    margin: "0 1rem",
    display: "flex",
    alignItems: "center",
    "& .p-input-icon-left": {
      width: "100%",
    },
    "& .p-inputtext": {
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "#ffffff",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      fontSize: "1rem",
      "&::placeholder": {
        color: "#ffffff",
        opacity: 0.7,
      },
    },
  },
  userControls: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  navigationContainer: {
    backgroundColor: "#f8f9fa",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  navigation: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  userMenu: {
    "& .p-menu": {
      minWidth: "200px",
    },
  },
  mainContent: {
    flex: 1,
    padding: "2rem 1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  footer: {
    background: "linear-gradient(to right, #892d05, #d1410c)",
    color: "#e0e0e0",
    padding: "1rem 1rem",
    width: "100%",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footerLogo: {
    marginBottom: "1rem",
    "& img": {
      height: "64px",
    },
  },
  footerLinks: {
    display: "flex",
    gap: "2rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  footerLink: {
    color: "#e0e0e0",
    textDecoration: "none",
    transition: "color 0.2s",
    "&:hover": {
      color: "#ffffff",
    },
  },
  footerCopyright: {
    opacity: 0.7,
    fontSize: "0.875rem",
  },
  sidebarHeader: {
    padding: "1rem",
    backgroundColor: "#892d05",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    "& img": {
      marginRight: "0.5rem",
      height: "56px",
    },
  },
});

const MainLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<Menu | null>(null);
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const isLoggedIn = !!user;

  useEffect(() => {
    // optional active menu logic
  }, [location]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "หน้าหลัก", icon: "pi pi-home", url: "/" },
    {
      label: "รูปภาพ",
      icon: "pi pi-image",
      items: [
        { label: "การแพทย์", url: "/images/medical" },
        { label: "การเรียนการสอน", url: "/images/education" },
        { label: "รอบรั้วมหาวิทยาลัย", url: "/images/campus" },
      ],
    },
    {
      label: "วิดีโอ",
      icon: "pi pi-video",
      items: [
        { label: "การแพทย์", url: "/videos/medical" },
        { label: "การเรียนการสอน", url: "/videos/education" },
        { label: "รอบรั้วมหาวิทยาลัย", url: "/videos/campus" },
      ],
    },
    {
      label: "กราฟฟิก",
      icon: "pi pi-palette",
      url: "/graphics",
      template: (item, options) => (
        <a className={options.className} href={item.url} onClick={options.onClick}>
          <span className={options.iconClassName}></span>
          <span className={options.labelClassName}>{item.label}</span>
          <Badge value="ใหม่" severity="danger" className="ml-2" />
        </a>
      ),
    },
  ];

  const generateUserMenu = (): MenuItem[] => {
    const items: MenuItem[] = [];

    if (isLoggedIn) {
      items.push(
        { label: "โปรไฟล์", icon: "pi pi-user", command: () => navigate("/profile") },
        { label: "ประวัติการดาวน์โหลด", icon: "pi pi-download", command: () => navigate("/downloads") },
        ...(user?.role === "admin"
          ? [{ label: "อัปโหลด (แอดมิน)", icon: "pi pi-upload", command: () => navigate("/admin") }]
          : []),
        { separator: true }
      );
    }

    items.push({
      label: isLoggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ SSO",
      icon: isLoggedIn ? "pi pi-sign-out" : "pi pi-sign-in",
      command: () => {
        if (isLoggedIn) {
          logout();
          navigate("/");
        } else {
          navigate("/login");
        }
      },
    });

    return items;
  };

  const userMenu = generateUserMenu();

  return (
    <div className={classes.mainLayout}>
      <header className={classes.header}>
        <div className={classes.headerContent}>
          <Link to="/" className={classes.logo}>
            <img alt="KKU Logo" src={logo} />
          </Link>

          <div className={classes.searchBar}>
            <span className="p-input-icon-left w-full mb-3">
              <i className="pi pi-search" />
              <InputText
                placeholder="ค้นหารูปภาพ วิดีโอ กราฟฟิก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </span>
          </div>

          <div className={classes.userControls}>
            <Menu model={userMenu} popup ref={menuRef} className={classes.userMenu} />
            <Button
              className="p-button-rounded p-button-text p-button-plain"
              icon={<Avatar icon="pi pi-user" shape="circle" style={{ backgroundColor: "#e9ecef", color: "#892d05" }} />}
              onClick={(e) => menuRef.current?.toggle(e)}
              aria-haspopup
              tooltip={isLoggedIn ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}
              tooltipOptions={{ position: "bottom" }}
            />
            <Button
              icon="pi pi-bars"
              className="p-button-rounded p-button-text p-button-plain md:hidden"
              onClick={() => setSidebarVisible(true)}
            />
          </div>
        </div>
      </header>

      <div className={`${classes.navigationContainer} hidden md:block`}>
        <div className={classes.navigation}>
          <Menubar model={menuItems} />
        </div>
      </div>

      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} blockScroll position="right">
        <div className={classes.sidebarHeader}>
          <img alt="KKU Logo" src={logo} />
          <span className="text-xl font-bold">KKU resource</span>
        </div>
        <div className="p-fluid p-3">
          <span className="p-input-icon-left w-full mb-3">
            <i className="pi pi-search" />
            <InputText placeholder="ค้นหา..." className="w-full" />
          </span>
        </div>
        <Menu model={menuItems} className="w-full" />
      </Sidebar>

      <main className={classes.mainContent}>
        <Outlet />
      </main>

      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerLogo}>
            <img alt="KKU Logo Footer" src={logo} />
          </div>
          <div className={classes.footerLinks}>
            <a href="#" className={classes.footerLink}>เกี่ยวกับเรา</a>
            <a href="#" className={classes.footerLink}>นโยบายความเป็นส่วนตัว</a>
            <a href="#" className={classes.footerLink}>เงื่อนไขการใช้งาน</a>
            <a href="#" className={classes.footerLink}>ติดต่อเรา</a>
          </div>
          <Divider className="w-full mb-3" style={{ backgroundColor: "#2c365d" }} />
          <div className={classes.footerCopyright}>
            <p>© {new Date().getFullYear()} ระบบคลังทรัพยากร มหาวิทยาลัยขอนแก่น</p>
            <p className="mt-2">พัฒนาโดยทีมพัฒนาระบบ</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
