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
    primary: {
      main: "#112D4E",
      light: "rgba(17,45,78,0.9)",
      dark: "#0c1c2e",
      gradient: "linear-gradient(120deg, #112D4E 0%, #1a3f6f 100%)"
    },
    secondary: {
      main: "#3F72AF",
      light: "rgba(63,114,175,0.9)",
      dark: "#2c5a8f",
      gradient: "linear-gradient(120deg, #3F72AF 0%, #5b8ac5 100%)"
    },
    text: {
      primary: "#112D4E",
      secondary: "#666666",
      light: "#DBE2EF",
      muted: "#999999"
    },
    background: {
      main: "#ffffff",
      light: "#F9F7F7",
      paper: "#f8f9fa",
      gradient: "linear-gradient(120deg, #F9F7F7 70%, #DBE2EF 100%)"
    },
    border: {
      main: "#DBE2EF",
      light: "rgba(219,226,239,0.5)",
      dark: "rgba(17,45,78,0.1)"
    }
  },
  spacing: {
    xs: "0.5rem",    // 8px
    sm: "0.75rem",   // 12px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    xxl: "3rem"      // 48px
  },
  breakpoints: {
    xs: "320px",
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px"
  },
  borderRadius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px"
  },
  shadows: {
    sm: "0 2px 8px rgba(17,45,78,0.07)",
    md: "0 4px 16px rgba(17,45,78,0.1)",
    lg: "0 8px 32px rgba(17,45,78,0.12)",
    xl: "0 12px 48px rgba(17,45,78,0.15)"
  },
  typography: {
    fontFamily: "var(--bs-font-primary, 'Sarabun', 'Prompt', sans-serif)",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      "@media (max-width: 768px)": {
        fontSize: "2rem"
      }
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      "@media (max-width: 768px)": {
        fontSize: "1.75rem"
      }
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      "@media (max-width: 768px)": {
        fontSize: "1.25rem"
      }
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4
    }
  },
  transitions: {
    quick: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "0.35s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  zIndex: {
    header: 1000,
    modal: 1300,
    dropdown: 1200,
    tooltip: 1500
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
    overflowX: "hidden",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1000,
    background: "transparent",
    color: THEME.colors.text.light,
    minHeight: 62,
    display: "flex",
    alignItems: "center",
    boxShadow: "none",
    borderBottom: "1px solid rgba(63,114,175,0.10)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.35s cubic-bezier(.4,.8,.4,1)",
    padding: 0,
    margin: 0,
    "@media (max-width: 768px)": {
      minHeight: 56,
      background: THEME.colors.primary.main,
      boxShadow: "0 2px 12px rgba(17,45,78,0.15)",
    },
    "@media (max-width: 480px)": {
      minHeight: 52,
      boxShadow: "0 2px 8px rgba(17,45,78,0.12)",
    }
  },
  headerScrolled: {
    background: THEME.colors.primary.main,
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
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: "0.5rem 1rem",
      minHeight: 48,
    },
    "@media (max-width: 480px)": {
      padding: "0.5rem 0.75rem",
      gap: 8,
      minHeight: 44,
    }
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
      "@media (max-width: 768px)": {
        height: 36,
        marginBottom: 6,
        marginRight: 8
      },
      "@media (max-width: 480px)": {
        height: 32,
        marginRight: 6,
        marginBottom: 4
      }
    },
    "&:hover img": {
      transform: "scale(1.05)",
    },
    "@media (max-width: 768px)": {
      fontSize: 18,
    },
    "@media (max-width: 480px)": {
      fontSize: 16,
    }
  },
  nav: {
    display: "none",
    '@media (min-width: 901px)': {
      display: "flex",
      alignItems: "center",
      gap: 30,
      flex: 1,
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
      background: THEME.colors.secondary.main,
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
      gap: 8,
      marginLeft: "auto",
    },
    '@media (max-width: 480px)': {
      gap: 4,
    }
  },
  icon: {
    color: THEME.colors.secondary.main,
    fontSize: 27,
    cursor: "pointer",
    opacity: 0.94,
    margin: "0 1px",
    transition: "all 0.2s ease",
    background: "none",
    borderRadius: THEME.borderRadius.sm,
    padding: "8px",
    "@media (max-width: 768px)": {
      fontSize: 22,
      padding: "6px",
    },
    "@media (max-width: 480px)": {
      fontSize: 20,
      padding: "4px",
    },
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
    "@media (max-width: 768px)": {
      width: 34,
      height: 34,
    },
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
      borderColor: THEME.colors.secondary.main,
      transform: "translateY(-1px)",
    },
    "@media (max-width: 900px)": {
      display: "none",
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
    boxShadow: THEME.shadows.lg,
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
      color: THEME.colors.secondary.main,
      "& i": { color: THEME.colors.secondary.main },
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
      padding: "72px 0 0 0"
    },
    "@media (max-width: 480px)": {
      padding: "60px 0 0 0"
    }
  },
  footerRow: {
    width: "100%",
    background: THEME.colors.primary.main,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "3.2rem 4vw 2.4rem 4vw",
    minHeight: 200,
    position: "relative",
    fontFamily: "inherit",
    boxShadow: "0 4px 32px rgba(17,45,78,0.13)",
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "center",
      padding: "2.5rem 1.5rem",
      gap: 32,
      textAlign: "center"
    },
    "@media (max-width: 480px)": {
      padding: "2rem 1rem",
      gap: 24
    }
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    minWidth: 170,
    "& img": { 
      width: 180,
      borderRadius: THEME.borderRadius.lg,
      marginBottom: 5,
      filter: "drop-shadow(0 2px 8px rgba(63,114,175,0.2))",
      "@media (max-width: 768px)": {
        width: 150,
      },
      "@media (max-width: 480px)": {
        width: 120,
      }
    },
    "@media (max-width: 900px)": {
      alignItems: "center",
      minWidth: 0,
      textAlign: "center",
      marginBottom: 8
    }
  },
  footerTagline: {
    color: THEME.colors.text.light,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.5,
    opacity: 0.94,
    marginBottom: 6,
    textAlign: "left",
    "@media (max-width: 900px)": {
      textAlign: "center",
      fontSize: 15
    },
    "@media (max-width: 480px)": {
      fontSize: 14,
      lineHeight: 1.4
    }
  },
  footerCenter: {
    display: "flex",
    gap: "2.5rem",
    fontSize: 16,
    fontWeight: 600,
    marginTop: "2rem",
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      marginBottom: 32
    },
    "@media (max-width: 480px)": {
      gap: 16,
      marginBottom: 24
    },
    "& a": {
      color: THEME.colors.text.light,
      textDecoration: "none",
      padding: "8px 16px",
      borderRadius: 8,
      transition: "all 0.2s ease",
      opacity: 0.9,
      "@media (max-width: 768px)": {
        padding: "10px 20px",
        fontSize: 15,
        width: "100%",
        textAlign: "center",
        background: "rgba(255,255,255,0.1)",
        borderRadius: 12
      },
      "@media (max-width: 480px)": {
        fontSize: 14,
        padding: "8px 16px"
      },
      "&:hover": {
        opacity: 1,
        background: "rgba(255,255,255,0.1)",
        transform: "translateY(-2px)"
      }
    }
  },
  footerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 180,
    gap: 16,
    "@media (max-width: 900px)": {
      alignItems: "center",
      minWidth: 0,
      width: "100%",
      gap: 20
    },
    "@media (max-width: 480px)": {
      gap: 16
    }
  },
  footerSocial: {
    display: "flex",
    gap: "1.2rem",
    marginBottom: 4,
    "@media (max-width: 900px)": {
      gap: "1.5rem",
      marginBottom: 8
    },
    "@media (max-width: 480px)": {
      gap: "1rem"
    },
    "& a": {
      color: THEME.colors.primary.main,
      background: THEME.colors.text.light,
      borderRadius: "50%",
      width: 44,
      height: 44,
      fontSize: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(63,114,175,0.2)",
      "@media (max-width: 768px)": {
        width: 48,
        height: 48,
        fontSize: 24
      },
      "@media (max-width: 480px)": {
        width: 40,
        height: 40,
        fontSize: 20
      },
      "&:hover": {
        color: THEME.colors.text.light,
        background: THEME.colors.secondary.main,
        transform: "scale(1.12) rotate(5deg)",
        boxShadow: "0 4px 12px rgba(63,114,175,0.3)"
      }
    }
  },
  footerCopyright: {
    color: THEME.colors.text.light,
    fontSize: 14,
    opacity: 0.92,
    marginTop: 5,
    textAlign: "right",
    "@media (max-width: 900px)": {
      textAlign: "center",
      fontSize: 13,
      opacity: 0.85
    },
    "@media (max-width: 480px)": {
      fontSize: 12
    }
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
  mobileMenu: {
    display: "none",
    "@media (max-width: 900px)": {
      display: "flex",
      position: "fixed",
      top: 56,
      left: 0,
      right: 0,
      background: "rgba(255,255,255,0.98)",
      padding: "1rem",
      flexDirection: "column",
      gap: "0.5rem",
      boxShadow: "0 8px 24px rgba(17,45,78,0.12)",
      zIndex: 999,
      transform: "translateY(-100%)",
      transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(63,114,175,0.1)",
      "&.open": {
        transform: "translateY(0)",
      },
      "@media (max-width: 480px)": {
        top: 52,
        padding: "0.75rem",
        gap: "0.4rem",
      }
    }
  },
  mobileMenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.85rem 1.2rem",
    margin: "0.2rem 0.8rem",
    borderRadius: "12px",
    color: THEME.colors.text.primary,
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    background: "transparent",
    border: "none",
    width: "auto",
    textAlign: "left",
    position: "relative",
    "&:hover, &.active": {
      background: "rgba(63,114,175,0.08)",
      color: THEME.colors.secondary.main,
      "& i": {
        color: THEME.colors.secondary.main,
        transform: "scale(1.1)",
      }
    },
    "& i": {
      marginRight: "0.9rem",
      fontSize: "1.2rem",
      color: "#666",
      transition: "all 0.2s ease",
    },
    "@media (max-width: 480px)": {
      padding: "0.75rem 1rem",
      margin: "0.15rem 0.6rem",
      fontSize: "0.9rem",
      "& i": {
        fontSize: "1.1rem",
        marginRight: "0.8rem",
      }
    }
  },
  menuSection: {
    marginBottom: "1rem",
    "&:not(:first-child)": {
      marginTop: "1rem",
    }
  },
  menuSectionTitle: {
    color: "#666",
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "0 1.2rem",
    marginBottom: "0.5rem",
    "@media (max-width: 480px)": {
      padding: "0 1rem",
      fontSize: "0.75rem",
    }
  },
  searchContainer: {
    padding: "1rem 1.2rem",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    marginBottom: "0.5rem",
    "@media (max-width: 480px)": {
      padding: "0.8rem 1rem",
    }
  },
  searchInput: {
    width: "100%",
    padding: "0.7rem 1rem 0.7rem 2.8rem",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "#f8f9fa",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    position: "relative",
    "&:focus": {
      outline: "none",
      background: "#fff",
      borderColor: THEME.colors.secondary.main,
      boxShadow: "0 2px 8px rgba(63,114,175,0.12)",
    },
    "&::placeholder": {
      color: "#999",
    }
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    fontSize: "1.1rem",
    pointerEvents: "none",
    zIndex: 1,
  },
  menuDivider: {
    height: "1px",
    background: "rgba(0,0,0,0.08)",
    margin: "0.5rem 1.2rem",
    "@media (max-width: 480px)": {
      margin: "0.4rem 1rem",
    }
  },
  mobileMenuButton: {
    display: "none",
    '@media (max-width: 900px)': {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      border: "none",
      color: THEME.colors.text.light,
      fontSize: 24,
      padding: 8,
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "scale(1.1)",
      },
      "&.open": {
        transform: "rotate(90deg)",
      }
    }
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
          
          <nav className={classes.nav}>
            <Link to="/" className={`${classes.navLink}${isActive(location.pathname, "/") ? " active" : ""}`}>หน้าหลัก</Link>
            <Link to="/images" className={`${classes.navLink}${isActive(location.pathname, "/images") ? " active" : ""}`}>รูปภาพ</Link>
            <Link to="/videos" className={`${classes.navLink}${isActive(location.pathname, "/videos") ? " active" : ""}`}>วิดีโอ</Link>
            <Link to="/graphics" className={`${classes.navLink}${isActive(location.pathname, "/graphics") ? " active" : ""}`}>กราฟฟิก</Link>
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

            <button
              className={`${classes.mobileMenuButton} ${sidebarVisible ? 'open' : ''}`}
              onClick={() => setSidebarVisible(!sidebarVisible)}
              aria-label="Toggle menu"
            >
              <i className="pi pi-bars" />
            </button>
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
        <div className={classes.searchContainer}>
          <div style={{ position: "relative" }}>
            <i className={`pi pi-search ${classes.searchIcon}`} />
            <input
              type="text"
              className={classes.searchInput}
              placeholder="ค้นหา..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch();
                  setSidebarVisible(false);
                }
              }}
            />
          </div>
        </div>

        <div className={classes.menuSection}>
          <div className={classes.menuSectionTitle}>เมนูหลัก</div>
          <Link to="/" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
            <i className="pi pi-home" />
            หน้าหลัก
          </Link>
          <Link to="/images" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/images") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
            <i className="pi pi-image" />
            รูปภาพ
          </Link>
          <Link to="/videos" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/videos") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
            <i className="pi pi-video" />
            วิดีโอ
          </Link>
          <Link to="/graphics" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/graphics") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
            <i className="pi pi-images" />
            กราฟฟิก
          </Link>
        </div>

        <div className={classes.menuDivider} />

        <div className={classes.menuSection}>
          <div className={classes.menuSectionTitle}>บัญชีผู้ใช้</div>
          {!isLoggedIn && (
            <Link to="/login" className={classes.mobileMenuItem} onClick={() => setSidebarVisible(false)}>
              <i className="pi pi-sign-in" />
              เข้าสู่ระบบ
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/profile") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
                <i className="pi pi-user" />
                โปรไฟล์
              </Link>
              <Link to="/downloads-history" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/downloads-history") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
                <i className="pi pi-download" />
                ประวัติการดาวน์โหลด
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className={`${classes.mobileMenuItem}${isActive(location.pathname, "/admin") ? " active" : ""}`} onClick={() => setSidebarVisible(false)}>
                  <i className="pi pi-upload" />
                  อัปโหลด (แอดมิน)
                </Link>
              )}
              <button
                className={classes.mobileMenuItem}
                onClick={() => {
                  logout();
                  navigate("/");
                  setSidebarVisible(false);
                }}
              >
                <i className="pi pi-sign-out" />
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      </Sidebar>

      <main className={classes.mainContent}>
        <Outlet />
      </main>

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
            <a href="https://www.facebook.com/LTICKKU" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="pi pi-facebook" />
            </a>
            <a href="https://www.youtube.com/@kku_channel/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="pi pi-youtube" />
            </a>
            <a href="https://www.instagram.com/khonkaenuniversity/channel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="pi pi-instagram" />
            </a>
          </div>
          <div className={classes.footerCopyright}>
            © {new Date().getFullYear()} Khon Kaen University.<br />All rights reserved.
          </div>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;