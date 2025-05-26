import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Badge } from "primereact/badge";
import { createUseStyles } from "react-jss";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import ScrollToTopButton from "../../components/ScrollToTopButton";
const isActive = (pathname, path) =>
  pathname === path || pathname.startsWith(path + "/");


const useStyles = createUseStyles({
  mainLayout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#f8f9fb",
    fontFamily: "var(--bs-font-primary, 'Sarabun', 'Prompt', Arial, sans-serif)",
    position: "relative",
    zIndex: 0,
  },
  // --- Header ---
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    zIndex: 1000,
    background: "rgba(106,106,106,0.55)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    minHeight: 56,
    display: "flex",
    alignItems: "center",
    boxShadow: "0 1.5px 12px 0 #2222",
    transition: "background 0.35s cubic-bezier(.4,.8,.4,1), box-shadow 0.27s cubic-bezier(.4,.8,.4,1), backdrop-filter 0.45s cubic-bezier(.4,.8,.4,1)",
  },
  headerScrolled: {
    background: "rgba(35, 35, 42, 0.98)",
    boxShadow: "0 3px 22px 0 #23232a70",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    width: "100%",
    maxWidth: 1300,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: "0 1vw",
    minHeight: 52,
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 7,
      padding: "6px 2vw",
      minHeight: "auto",
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 21,
    letterSpacing: 1.05,
    "& img": {
      marginRight: 9,
      height: 44,
      filter: "drop-shadow(0 2px 7px #ffba5950)",
    },
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 30,
    flex: 1,
    "@media (max-width: 900px)": {
      gap: 13,
      fontSize: 17,
    },
  },
  navLink: {
    color: "#fff",
    fontWeight: 400,
    fontSize: 17,
    textDecoration: "none",
    borderRadius: 12,
    padding: "5px 17px",
    letterSpacing: 0.01,
    opacity: 0.93,
    background: "none",
    transition: "background 0.14s, color 0.12s, box-shadow 0.14s",
    "&:hover, &.active": {
      background: "rgba(167, 167, 167, 0.23)",
      color: "#fff",
      opacity: 1,
      boxShadow: "0 1px 7px 0 #9993",
    }
  },
  // --- Right (Search + User) ---
  rightIcons: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    "@media (max-width: 900px)": {
      marginTop: 5,
      gap: 8,
      justifyContent: "center"
    }
  },
  icon: {
    color: "#fff",
    fontSize: 27,
    cursor: "pointer",
    opacity: 0.94,
    margin: "0 1px",
    transition: "color 0.13s, opacity 0.12s",
    background: "none",
    borderRadius: 8,
  },
  userAvatar: {
    borderRadius: 8,
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    cursor: "pointer",
    boxShadow: "0 1px 5px #fff1",
    transition: "border 0.16s, background 0.14s",
  },
  // --- Search Box ---
  headerSearchBox: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(90deg,#232526,#191b1f 90%)",
    borderRadius: 3,
    padding: "0.1rem 1rem 0.1rem 1.1rem",
    minWidth: 320,
    maxWidth: 460,
    marginLeft: 18,
    boxShadow: "0 2px 10px #10101040",
    position: "relative",
    zIndex: 11,
    "@media (max-width: 700px)": {
      minWidth: 150,
      maxWidth: 210,
      fontSize: 17,
      padding: "0.1rem 0.6rem 0.1rem 0.8rem",
    },
  },
  headerSearchInput: {
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 20,
    outline: "none",
    width: 220,
    fontFamily: "inherit",
    marginRight: 10,
    "&::placeholder": {
      color: "#bbb",
      opacity: 0.88,
    },
  },
  headerSearchIcon: {
    fontSize: 27,
    color: "#fff",
    marginRight: 8,
    opacity: 0.92,
  },
  closeSearch: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 22,
    cursor: "pointer",
    opacity: 0.74,
    "&:hover": { opacity: 1, color: "#e66" }
  },
  // --- User Menu Popper ---
  userMenuPopper: {
    position: "absolute",
    top: 46,
    right: 0,
    minWidth: 185,
    background: "#23232a",
    borderRadius: 11,
    boxShadow: "0 6px 32px 0 #23232a31",
    padding: "7px 0",
    zIndex: 1200,
    fontSize: 16,
    fontFamily: "inherit",
    color: "#fff",
    animation: "$fadeIn 0.13s",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: -9,
      right: 22,
      width: 18,
      height: 18,
      background: "#23232a",
      transform: "rotate(45deg)",
      zIndex: 0,
    },
  },
  userMenuItem: {
    padding: "9px 22px 9px 19px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "none",
    width: "100%",
    fontSize: 15.5,
    color: "#fff",
    "&:hover": {
      background: "#2d2d37",
      color: "#f4975a"
    }
  },
  userMenuDivider: {
    height: 1,
    background: "#484850",
    margin: "5px 0"
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-15px)" },
    to: { opacity: 1, transform: "none" },
  },
  // --- Main Content ---
  mainContent: {
    flex: 1,
    maxWidth: 1300,
    margin: "0 auto",
    width: "100%",
    padding: "90px 0 0 0",
    "@media (max-width: 900px)": { padding: "105px 0 0 0" }
  },
  // --- Footer ---
  footerRow: {
    width: "100%",
    background: 'url("/mock/background1.jpg") center/cover no-repeat, #a13d23',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3.2rem 4vw 2.4rem 4vw",
    minHeight: 200,
    position: "relative",
    fontFamily: "inherit",
    boxShadow: "0 4px 32px 0 #a13d2322",
    marginTop: 60,
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "center",
      padding: "2.4rem 1vw 1.6rem 1vw",
      minHeight: 220,
    }
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    minWidth: 170,
    "& img": { width: 60, borderRadius: 16, marginBottom: 5 }
  },
  footerTagline: {
    color: "#ffd9b3",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.4,
    opacity: 0.94,
    marginBottom: 6,
    textAlign: "left"
  },
  footerCenter: {
    display: "flex",
    gap: "2.5rem",
    fontSize: 20,
    fontWeight: 600,
    "@media (max-width: 900px)": { margin: "18px 0", gap: "1.4rem" },
    "& a": {
      color: "#fff",
      textDecoration: "none",
      transition: "color 0.17s, text-decoration 0.17s",
      padding: "4px 16px",
      borderRadius: 7,
      fontSize: 18,
      fontWeight: 500,
    }
  },
  footerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 180,
    gap: 8,
    "@media (max-width: 900px)": { alignItems: "center" }
  },
  footerSocial: {
    display: "flex",
    gap: "1.2rem",
    marginBottom: 4,
    "& a": {
      color: "#fff",
      background: "#ffffff20",
      borderRadius: "50%",
      width: 44,
      height: 44,
      fontSize: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.18s",
      boxShadow: "0 2px 8px #411a0340",
      "&:hover": {
        color: "#a13d23",
        transform: "scale(1.12)"
      }
    }
  },
  footerCopyright: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.92,
    marginTop: 5,
    textAlign: "right",
    "@media (max-width: 900px)": { textAlign: "center" }
  },
});

const MainLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  const isLoggedIn = !!user;
  const [scrolled, setScrolled] = useState(false);

  // --- Effect: header scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Effect: focus search input
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 70);
  }, [searchOpen]);

  // --- Effect: esc to close search/menu
  useEffect(() => {
    if (!searchOpen && !userMenuOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, userMenuOpen]);

  // --- Effect: close userMenu on click outside
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  // --- Search handler
  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  // --- User menu model
  const userMenu = [
    ...(isLoggedIn
      ? [
          { label: "โปรไฟล์", icon: "pi pi-user", command: () => navigate("/profile") },
          { label: "ประวัติการดาวน์โหลด", icon: "pi pi-download", command: () => navigate("/downloads-history") },
          ...(user?.role === "admin"
            ? [{ label: "อัปโหลด (แอดมิน)", icon: "pi pi-upload", command: () => navigate("/admin") }]
            : []),
          { separator: true },
        ]
      : []),
    {
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
    },
  ];

  // --- Menu bar items
  const menuItems = [
    { label: "หน้าหลัก", icon: "pi pi-home", url: "/" },
    { label: "รูปภาพ", icon: "pi pi-image", url: "/images" },
    { label: "วิดีโอ", icon: "pi pi-video", url: "/videos" },
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

  return (
    <div className={classes.mainLayout}>
      {/* ---------- HEADER ---------- */}
      <header className={`${classes.header} ${scrolled ? classes.headerScrolled : ""}`}>
        <div className={classes.headerContent}>
          <Link to="/" className={classes.logo}>
            <img src={logo} alt="KKU Logo" />
          </Link>
          <nav className={classes.nav}>
            <Link to="/" className={`${classes.navLink}${isActive(location.pathname, "/") ? " active" : ""}`}>หน้าหลัก</Link>
            <Link to="/images" className={`${classes.navLink}${isActive(location.pathname, "/images") ? " active" : ""}`}>รูปภาพ</Link>
            <Link to="/videos" className={`${classes.navLink}${isActive(location.pathname, "/videos") ? " active" : ""}`}>วิดีโอ</Link>
            <Link to="/graphics" className={`${classes.navLink}${isActive(location.pathname, "/graphics") ? " active" : ""}`}>กราฟฟิก</Link>
            <Link to="/about" className={`${classes.navLink}${isActive(location.pathname, "/about") ? " active" : ""}`}>เกี่ยวกับเรา</Link>
          </nav>
          <div className={classes.rightIcons}>
            {/* --- Search Button & Box --- */}
            {searchOpen ? (
              <div className={classes.headerSearchBox}>
                <i className={"pi pi-search " + classes.headerSearchIcon} />
                <input
                  ref={searchInputRef}
                  className={classes.headerSearchInput}
                  placeholder="ค้นหารูปภาพ วิดีโอ กราฟฟิก..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <span
                  className={classes.closeSearch}
                  onClick={() => setSearchOpen(false)}
                >
                  <i className="pi pi-times" />
                </span>
              </div>
            ) : (
              <span
                className={classes.icon}
                onClick={() => setSearchOpen(true)}
                title="ค้นหา"
              >
                <i className="pi pi-search" />
              </span>
            )}
            {/* --- User avatar --- */}
            <span ref={avatarRef}>
              <span
                className={classes.userAvatar}
                onClick={() => setUserMenuOpen(open => !open)}
                title={isLoggedIn ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}
              >
                <Avatar
                  icon="pi pi-user"
                  shape="circle"
                  style={{ backgroundColor: "#e9ecef", color: "#892d05" }}
                />
              </span>
              {userMenuOpen && (
                <div className={classes.userMenuPopper}>
                  {userMenu.map((item, i) =>
                    item.separator ? (
                      <div key={i} className={classes.userMenuDivider} />
                    ) : (
                      <button
                        key={item.label}
                        className={classes.userMenuItem}
                        onClick={() => {
                          item.command && item.command();
                          setUserMenuOpen(false);
                        }}
                        type="button"
                      >
                        <i className={`pi ${item.icon}`} style={{ marginRight: 10 }} />
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </span>
            {/* --- Hamburger Sidebar --- */}
            <span
              className={`${classes.icon} md:hidden`}
              onClick={() => setSidebarVisible(true)}
              title="เมนู"
            >
              <i className="pi pi-bars" />
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar (Mobile) */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        blockScroll
        position="right"
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <img alt="KKU Logo" src={logo} style={{ width: 55, borderRadius: 12, marginBottom: 8 }} />
          <div className="text-xl font-bold mb-2">KKU Resource</div>
          <span className="p-input-icon-left w-full mb-3">
            <i className="pi pi-search" />
            <InputText
              placeholder="ค้นหา..."
              className="w-full"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setSidebarVisible(false);
                  navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </span>
        </div>
        <Menu model={menuItems} className="w-full" />
      </Sidebar>

      {/* Main Content */}
      <main className={classes.mainContent}>
        <Outlet />
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className={classes.footerRow}>
        <div className={classes.footerLeft}>
          <img src={logo} alt="KKU Resource" />
          <div className={classes.footerTagline}>
            คลังทรัพยากรดิจิทัลเพื่อการศึกษา<br />มหาวิทยาลัยขอนแก่น
          </div>
        </div>
        <div className={classes.footerCenter}>
          <a href="#">เกี่ยวกับเรา</a>
          <a href="#">นโยบายความเป็นส่วนตัว</a>
          <a href="#">เงื่อนไขการใช้งาน</a>
          <a href="#">ติดต่อเรา</a>
        </div>
        <div className={classes.footerRight}>
          <div className={classes.footerSocial}>
            <a href="#"><i className="pi pi-facebook" /></a>
            <a href="#"><i className="pi pi-youtube" /></a>
            <a href="#"><i className="pi pi-instagram" /></a>
          </div>
          <div className={classes.footerCopyright}>
            © {new Date().getFullYear()} Khon Kaen University. All rights reserved.
          </div>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;