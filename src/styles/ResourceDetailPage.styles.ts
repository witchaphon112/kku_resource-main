import { createUseStyles } from "react-jss";

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

export const useStyles = createUseStyles({
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      paddingTop: "1rem"
    }
  },
  relatedSection: {
    background: "#fff",
    padding: "3rem 0",
    width: "100%",
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    marginTop: '2rem',
    '& h4': {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: '1.25rem',
    },
    '@media (max-width: 768px)': {
      padding: "1.5rem 0",
    },
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    padding: "24px",
    "@media (max-width: 1400px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 767px)": {
      gridTemplateColumns: "1fr",
      gap: "16px",
      padding: "16px",
    }
  },
  relatedCard: {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(63,114,175,0.08)",
    "@media (max-width: 768px)": {
      display: "flex",
      borderRadius: 12,
      height: "120px",
    },
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 32px rgba(63,114,175,0.12)",
      "& $relatedImage": {
        transform: "scale(1.05)",
      },
      "& $relatedTitle": {
        opacity: 1,
        transform: "translateY(0)",
      },
      "& $relatedActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  relatedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    "@media (max-width: 768px)": {
      width: "120px",
      height: "120px",
      flexShrink: 0,
    }
  },
  relatedInfo: {
    padding: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "12px",
    "@media (max-width: 768px)": {
      padding: "0.75rem",
      flexDirection: "column",
      justifyContent: "center",
    }
  },
  relatedTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "32px 16px 16px",
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.3s ease",
    zIndex: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.4,
    "@media (max-width: 768px)": {
      fontSize: "0.95rem",
      marginBottom: "0.4rem",
      "-webkit-line-clamp": 1,
    }
  },
  relatedActionBar: {
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    gap: "8px",
    opacity: 0,
    transform: "translateY(-8px)",
    transition: "all 0.3s ease",
    zIndex: 3,
  },
  relatedStats: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#94a3b8",
      fontSize: "0.92rem",
      fontWeight: 400,
      "& svg": {
        color: "#94a3b8",
        fontSize: "1.05rem",
      }
    }
  },
}); 