import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Badge } from "primereact/badge";
import { createUseStyles } from "react-jss";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/unnamed1.png";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const isActive = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(path + "/");

const THEME = {
  colors: {
    primary: "#112D4E",
    primaryLight: "rgba(17,45,78,0.9)",
    primaryDark: "#0c1c2e",
    secondary: "#3F72AF",
    secondaryLight: "rgba(63,114,175,0.9)",
    secondaryDark: "#2c5a8f",
    text: {
      primary: "#112D4E",
      secondary: "#666666",
      light: "#DBE2EF"
    },
    background: {
      main: "#ffffff",
      light: "#F9F7F7",
      gradient: "linear-gradient(120deg, #F9F7F7 70%, #DBE2EF 100%)"
    },
    border: "#DBE2EF"
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
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-15px)" },
    to: { opacity: 1, transform: "none" }
  },
  mainLayout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: THEME.colors.background.light,
    fontFamily: "var(--bs-font-primary, 'Sarabun', 'Prompt', Arial, sans-serif)",
    position: "relative",
    zIndex: 0,
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1000,
    background: "linear-gradient(to top, rgba(17,45,78,0.35) 30%, rgba(249,247,247,0.31) 80%)",
    color: THEME.colors.text.light,
    minHeight: 62,
    display: "flex",
    alignItems: "center",
    boxShadow: "0 8px 32px 0 rgba(17,45,78,0.10)",
    borderBottom: "1.5px solid rgba(63,114,175,0.10)",
    backdropFilter: "blur(8px)",
    transition: "all 0.35s cubic-bezier(.4,.8,.4,1)",
    padding: 0,
    margin: 0,
  },
  headerScrolled: {
    background: THEME.colors.primary,
    boxShadow: "0 4px 16px 0 rgba(17,45,78,0.2)",
    minHeight: 68,
  },
  headerContent: {
    width: "100%",
    position: "relative",
    maxWidth: "100%",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: "0 2rem",
    minHeight: 52,
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 7,
      padding: "6px 1rem",
      minHeight: "auto",
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: THEME.colors.text.light,
    fontWeight: 700,
    fontSize: 21,
    letterSpacing: 1.05,
    "& img": {
      marginRight: 9,
      height: 45,
      marginBottom: 10,
      filter: "drop-shadow(0 2px 7px rgba(63,114,175,0.3))",
      transition: "transform 0.3s ease",
    },
    "&:hover img": {
      transform: "scale(1.05)",
    }
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 30,
    flex: 1,
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  navLink: {
    color: THEME.colors.text.light,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: "none",
    borderRadius: THEME.borderRadius.md,
    padding: "7px 14px",
    letterSpacing: 0.04,
    opacity: 0.93,
    background: "none",
    transition: "all 0.22s cubic-bezier(.4,2,.6,1)",
    position: "relative",
    "&:hover, &.active": {
      background: THEME.colors.secondary,
      color: THEME.colors.text.light,
      opacity: 1,
      boxShadow: "0 2px 8px rgba(63,114,175,0.2)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: 2,
      background: THEME.colors.text.light,
      borderRadius: THEME.borderRadius.sm,
      transition: "width 0.2s cubic-bezier(.4,2,.6,1)",
    },
    "&:hover::after, &.active::after": {
      width: "70%",
    }
  },
  rightIcons: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    '@media (max-width: 900px)': {
      marginTop: 5,
      gap: 8,
      justifyContent: "center",
    },
  },
  icon: {
    color: THEME.colors.secondary,
    fontSize: 27,
    cursor: "pointer",
    opacity: 0.94,
    margin: "0 1px",
    transition: "all 0.2s ease",
    background: "none",
    borderRadius: THEME.borderRadius.sm,
    "&:hover": {
      opacity: 1,
      transform: "scale(1.1)",
      color: THEME.colors.text.light,
    }
  },
  userAvatar: {
    borderRadius: THEME.borderRadius.md,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(63,114,175,0.2)",
    transition: "all 0.2s ease",
    border: "2px solid rgba(63,114,175,0.3)",
    "&:hover": {
      transform: "scale(1.05)",
      borderColor: THEME.colors.text.light,
      boxShadow: "0 4px 12px rgba(63,114,175,0.3)",
    }
  },
  headerSearchBox: {
    display: "flex",
    alignItems: "center",
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.md,
    padding: "0.2rem 1.2rem",
    minWidth: 320,
    maxWidth: 460,
    marginLeft: 18,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    position: "relative",
    zIndex: 11,
    border: "1px solid rgba(63,114,175,0.1)",
    transition: "all 0.2s ease",
    "&:focus-within": {
      boxShadow: "0 4px 15px rgba(63,114,175,0.15)",
      borderColor: THEME.colors.secondary,
      transform: "translateY(-1px)",
    },
    "@media (max-width: 700px)": {
      minWidth: 120,
      maxWidth: 180,
      fontSize: 15,
      padding: '0.1rem 0.5rem',
    },
  },
  headerSearchInput: {
    border: "none",
    background: "transparent",
    color: THEME.colors.text.primary,
    fontSize: 15,
    outline: "none",
    width: 220,
    fontFamily: "inherit",
    marginRight: 10,
    "&::placeholder": {
      color: "#bbb",
      opacity: 1,
    },
    "@media (max-width: 700px)": {
      width: 90,
      fontSize: 13,
    },
  },
  headerSearchIcon: {
    fontSize: 20,
    color: THEME.colors.text.primary,
    marginRight: 8,
    opacity: 0.92,
  },
  closeSearch: {
    color: "#bbb",
    marginLeft: 10,
    fontSize: 22,
    cursor: "pointer",
    opacity: 0.74,
    transition: "all 0.2s ease",
    "&:hover": { 
      opacity: 1, 
      color: THEME.colors.text.primary,
      transform: "scale(1.1)",
    }
  },
  userMenuPopper: {
    position: "absolute",
    top: 60,
    right: 5,
    minWidth: 200,
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    boxShadow: THEME.shadows.card,
    padding: "8px 0",
    zIndex: 1200,
    fontSize: 16,
    fontFamily: "inherit",
    color: THEME.colors.text.primary,
    transition: "all 0.2s ease",
    transform: "translateY(-5px)",
    animation: "$fadeIn 0.2s",
    border: "1px solid rgba(63,114,175,0.1)",
    "&.show": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: -9,
      right: 22,
      width: 18,
      height: 18,
      background: THEME.colors.background.main,
      transform: "rotate(45deg)",
      zIndex: 0,
      borderLeft: "1px solid rgba(63,114,175,0.1)",
      borderTop: "1px solid rgba(63,114,175,0.1)",
    },
  },
  userMenuItem: {
    padding: "10px 24px 10px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "none",
    width: "100%",
    fontSize: 15.5,
    color: THEME.colors.text.primary,
    transition: "all 0.2s ease",
    "& i": { color: THEME.colors.text.primary },
    "&:hover, &:focus": {
      background: THEME.colors.background.light,
      color: THEME.colors.secondary,
      "& i": { color: THEME.colors.secondary },
      paddingLeft: "24px",
    },
    "&[disabled], &[aria-disabled='true']": {
      color: "#bbb !important",
      cursor: "not-allowed",
      "& i": { color: "#bbb !important" },
    }
  },
  userMenuDivider: {
    height: 1,
    background: "rgba(63,114,175,0.1)",
    margin: "5px 0"
  },
  mainContent: {
    flex: 1,
    width: "100%",
    "@media (max-width: 900px)": { 
      padding: "105px 0 0 0" 
    }
  },
  footerRow: {
    width: "100%",
    background: THEME.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3.2rem 4vw 2.4rem 4vw",
    minHeight: 200,
    position: "relative",
    fontFamily: "inherit",
    boxShadow: "0 4px 32px rgba(17,45,78,0.13)",
    "@media (max-width: 900px)": {
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2.4rem 1vw 1.6rem 1vw',
      minHeight: 220,
      gap: 18,
    },
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    minWidth: 170,
    "& img": { 
      width: 200, 
      borderRadius: THEME.borderRadius.lg, 
      marginBottom: 5,
      filter: "drop-shadow(0 2px 8px rgba(63,114,175,0.2))",
    },
    "@media (max-width: 900px)": {
      alignItems: 'center',
      minWidth: 0,
    },
  },
  footerTagline: {
    color: THEME.colors.text.light,
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
    "@media (max-width: 900px)": {
      margin: '18px 0',
      gap: '1.4rem',
      flexDirection: 'column',
      alignItems: 'center',
    },
    "& a": {
      color: THEME.colors.text.light,
      textDecoration: "none",
      transition: "all 0.2s ease",
      padding: "4px 16px",
      borderRadius: THEME.borderRadius.sm,
      fontSize: 18,
      fontWeight: 500,
      "&:hover": {
        color: THEME.colors.primary,
        background: THEME.colors.text.light,
        transform: "translateY(-2px)",
      }
    }
  },
  footerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 180,
    gap: 8,
    "@media (max-width: 900px)": {
      alignItems: 'center',
      minWidth: 0,
    },
  },
  footerSocial: {
    display: "flex",
    gap: "1.2rem",
    marginBottom: 4,
    "& a": {
      color: THEME.colors.primary,
      background: THEME.colors.text.light,
      borderRadius: "50%",
      width: 44,
      height: 44,
      fontSize: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(63,114,175,0.2)",
      "&:hover": {
        color: THEME.colors.text.light,
        background: THEME.colors.secondary,
        transform: "scale(1.12) rotate(5deg)",
        boxShadow: "0 4px 12px rgba(63,114,175,0.3)",
      }
    }
  },
  footerCopyright: {
    color: THEME.colors.text.light,
    fontSize: 14,
    opacity: 0.92,
    marginTop: 5,
    textAlign: "right",
    "@media (max-width: 900px)": { textAlign: "center" }
  },
  hamburger: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'inline-flex',
    },
  },
  desktopOnly: {
    display: 'flex',
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  mobileOnly: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'flex',
    },
  },
});

const MainLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLSpanElement>(null);

  const isLoggedIn = !!user;
  const [scrolled, setScrolled] = useState(false);

  const isMainPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 70);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen && !userMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && e.target instanceof Node && !avatarRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

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

  const menuItems = [
    { label: "หน้าหลัก", icon: "pi pi-home", url: "/" },
    { label: "รูปภาพ", icon: "pi pi-image", url: "/images" },
    { label: "วิดีโอ", icon: "pi pi-video", url: "/videos" },
    {
      label: "กราฟฟิก",
      icon: "pi pi-palette",
      url: "/graphics",
      template: (item: any, options: any) => (
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
      <header className={`${classes.header} ${(!isMainPage || scrolled) ? classes.headerScrolled : ""}`}>
        <div className={classes.headerContent}>
          <Link to="/" className={classes.logo}>
            <img src={logo} alt="KKU Logo" />
          </Link>
          <nav className={`${classes.nav} ${classes.desktopOnly}`}>
            <Link to="/" className={`${classes.navLink}${isActive(location.pathname, "/") ? " active" : ""}`}>หน้าหลัก</Link>
            <Link to="/images" className={`${classes.navLink}${isActive(location.pathname, "/images") ? " active" : ""}`}>รูปภาพ</Link>
            <Link to="/videos" className={`${classes.navLink}${isActive(location.pathname, "/videos") ? " active" : ""}`}>วิดีโอ</Link>
            <Link to="/graphics" className={`${classes.navLink}${isActive(location.pathname, "/graphics") ? " active" : ""}`}>กราฟฟิก</Link>
            <Link to="/about" className={`${classes.navLink}${isActive(location.pathname, "/about") ? " active" : ""}`}>เกี่ยวกับเรา</Link>
          </nav>
          <div className={classes.rightIcons}>
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
                        <i className={`pi ${item.icon}`} style={{ marginRight: 10, color: "#222" }} />
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </span>
            <span
              className={`${classes.icon} ${classes.hamburger}`}
              onClick={() => setSidebarVisible(true)}
              title="เมนู"
            >
              <i className="pi pi-bars" />
            </span>
          </div>
        </div>
      </header>

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        blockScroll
        position="right"
        style={{ width: '85vw', maxWidth: 340 }}
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <img alt="KKU Logo" src={logo} style={{ width: 55, borderRadius: 12, marginBottom: 8 }} />
          <div className="text-xl font-bold mb-2">KKU Resource</div>
          <span className="p-input-icon-left w-full mb-3">
            <i className="pi pi-search" />
            <InputText
              placeholder="ค้นหา..."
              className="w-full"
              style={{ fontSize: 16, padding: '7px 10px', borderRadius: 8 }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setSidebarVisible(false);
                  // @ts-ignore
                  navigate(`/search?q=${encodeURIComponent(e.target.value?.trim?.() || '')}`);
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
          <Link to="/about">เกี่ยวกับเรา</Link>
          <Link to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
          <Link to="/terms">เงื่อนไขการใช้งาน</Link>
          <Link to="/contact">ติดต่อเรา</Link>
        </div>
        <div className={classes.footerRight}>
          <div className={classes.footerSocial}>
            <a href="https://www.facebook.com/LTICKKU" target="_blank" rel="noopener noreferrer"><i className="pi pi-facebook" /></a>
            <a href="https://www.youtube.com/@kku_channel/videos" target="_blank" rel="noopener noreferrer"><i className="pi pi-youtube" /></a>
            <a href="https://www.instagram.com/khonkaenuniversity/channel/" target="_blank" rel="noopener noreferrer"><i className="pi pi-instagram" /></a>
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