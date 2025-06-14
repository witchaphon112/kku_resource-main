
import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { useAuth } from "../contexts/AuthContext";
import resourcesData from "../mock/resources.json";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { FaDownload, FaEye, FaHeart, FaBookmark, FaShare, FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoHeartOutline, IoHeartSharp, IoBookmark, IoBookmarkOutline, IoShareSocialSharp, IoEllipsisVerticalCircle, IoEye, IoHeart } from "react-icons/io5";
import { useBookmarks } from "../contexts/BookmarkContext";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

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
  heroSection: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(180deg, rgba(63,114,175,0.05) 0%, rgba(255,255,255,0) 100%)",
    '@media (max-width: 768px)': {
      padding: "0.5rem",
    }
  },
  heroContent: {
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: "24px",
    padding: "2rem",
    '@media (max-width: 1024px)': {
      gap: "1.5rem",
      padding: "1rem",
    },
    '@media (max-width: 768px)': {
      padding: "0.5rem",
      gap: "1rem",
      borderRadius: "12px",
    }
  },
  heroMain: {
    display: "flex",
    gap: "3rem",
    padding: "3rem",
    alignItems: "flex-start",
    '@media (max-width: 1024px)': {
      flexDirection: "column",
      gap: "1.5rem",
      padding: "1rem",
    },
    '@media (max-width: 768px)': {
      padding: "0.5rem",
      gap: "1rem",
    }
  },
  heroImageWrap: {
    flex: "1 1 55%",
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(63,114,175,0.12)",
    background: "#fff",
    aspectRatio: "16/9",
    '@media (max-width: 1024px)': {
      width: "100%",
    },
    '@media (max-width: 768px)': {
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(63,114,175,0.1)",
      aspectRatio: "4/3",
    }
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 80,
    height: 80,
    background: "rgba(63,114,175,0.95)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(63,114,175,0.25)",
    border: "none",
    color: "#fff",
    fontSize: "1.8rem",
    '@media (max-width: 768px)': {
      width: 60,
      height: 60,
      fontSize: "1.4rem",
    },
    '&:hover': {
      background: "rgba(63,114,175,1)",
      transform: "translate(-50%, -50%) scale(1.1)",
    }
  },
  infoSection: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    '@media (max-width: 1024px)': {
      width: "100%",
    },
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#112D4E",
    lineHeight: 1.2,
    marginBottom: "1rem",
    fontFamily: "'Sarabun', sans-serif",
    '@media (max-width: 768px)': {
      fontSize: "1.5rem",
      marginBottom: "0.75rem",
      lineHeight: 1.3,
    }
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
    padding: "1rem",
    borderRadius: "12px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#3F72AF",
    fontSize: "1rem",
    '& svg': {
      fontSize: "1.2rem",
    },
  },
  tagRow: {
    display: "flex",
    gap: "0.8rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
    '@media (max-width: 768px)': {
      gap: "0.5rem",
      marginBottom: "1rem",
    }
  },
  tag: {
    background: "rgba(63,114,175,0.1)",
    color: "#3F72AF",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: 600,
    transition: "all 0.2s",
    '@media (max-width: 768px)': {
      padding: "0.375rem 0.75rem",
      fontSize: "0.85rem",
      borderRadius: "8px",
    }
  },
  actionRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      gap: "0.5rem",
      flexDirection: "column",
      marginTop: "0.5rem",
    }
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    padding: "1rem 2rem",
    background: "#3F72AF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 20px rgba(63,114,175,0.2)",
    '@media (max-width: 768px)': {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      width: "100%",
      gap: "0.5rem",
      borderRadius: "8px",
    }
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    padding: "1rem 2rem",
    background: "#fff",
    color: "#3F72AF",
    border: "2px solid #3F72AF",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    '@media (max-width: 768px)': {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      width: "100%",
      gap: "0.5rem",
      borderRadius: "8px",
    }
  },
  contentSection: {
    maxWidth: 1200,
    margin: "0 auto",
    '@media (max-width: 768px)': {
      padding: "1.5rem 1rem",
    },
    '@media (max-width: 480px)': {
      padding: "1rem 0.75rem",
    }
  },
  contentSectionGray: {
    width: "100%",
    background: "#f8faff",
    '@media (max-width: 768px)': {
      padding: "2rem 0",
    },
  },
  contentWrapper: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    '@media (max-width: 768px)': {
      padding: "0 1rem",
    },
  },
  mainContent: {
    borderRadius: 24,
    '@media (max-width: 768px)': {
      padding: "1.5rem",
      borderRadius: 16,
    },
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#112D4E",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    '&::before': {
      content: '""',
      width: 4,
      height: 24,
      background: "#3F72AF",
      borderRadius: 2,
    },
    '@media (max-width: 768px)': {
      fontSize: "1.25rem",
      marginBottom: "1rem",
      '&::before': {
        height: 20,
      }
    }
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: 1.7,
    color: "#666",
    '@media (max-width: 768px)': {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    }
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
    padding: "1.5rem",
    borderRadius: 16,
    '@media (max-width: 768px)': {
      gridTemplateColumns: "1fr",
      gap: "1rem",
      padding: "0.75rem",
      marginTop: "1rem",
    }
  },
  detailItem: {
    background: "#fff",
    padding: "1.2rem",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(63,114,175,0.06)",
    transition: "all 0.2s",
    '@media (max-width: 768px)': {
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
    }
  },
  detailLabel: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.5rem",
    '@media (max-width: 768px)': {
      marginBottom: 0,
      fontSize: "0.85rem",
    }
  },
  detailValue: {
    fontSize: "1.1rem",
    color: "#112D4E",
    fontWeight: 600,
    '@media (max-width: 768px)': {
      fontSize: "0.95rem",
      textAlign: "right",
    }
  },
  sidebar: {
    position: "sticky",
    top: "2rem",
    background: "#fff",
    borderRadius: 24,
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(63,114,175,0.08)",
    height: "fit-content",
  },
  relatedSection: {
    background: "#fff",
    padding: "3rem 0",
    width: "100%",
    '@media (max-width: 768px)': {
      padding: "1.5rem 0",
    },
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
    padding: "0 3rem",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "1rem",
      padding: "0 1rem",
      marginTop: "1rem",
    }
  },
  relatedHeader: {
    padding: "0 3rem",
    '@media (max-width: 768px)': {
      padding: "0 1.5rem",
    },
  },
  relatedCard: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(63,114,175,0.08)",
    transition: "all 0.3s",
    cursor: "pointer",
    '@media (max-width: 768px)': {
      display: "flex",
      borderRadius: 12,
      height: "120px",
    },
    '&:hover': {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 32px rgba(63,114,175,0.12)",
      '& $relatedImage': {
        transform: "scale(1.05)",
      },
    }
  },
  relatedImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    '@media (max-width: 768px)': {
      width: "120px",
      height: "120px",
      flexShrink: 0,
    }
  },
  relatedInfo: {
    padding: "1.2rem",
    '@media (max-width: 768px)': {
      padding: "0.75rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }
  },
  relatedTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#112D4E",
    marginBottom: "0.8rem",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      fontSize: "0.95rem",
      marginBottom: "0.4rem",
      "-webkit-line-clamp": 1,
    }
  },
  relatedMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#666",
    fontSize: "0.9rem",
    '@media (max-width: 768px)': {
      fontSize: "0.8rem",
    }
  },
  videoModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
    '@media (max-width: 768px)': {
      padding: "0.5rem",
    }
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 1200,
    aspectRatio: "16/9",
    background: "#000",
    borderRadius: 16,
    overflow: "hidden",
    '@media (max-width: 768px)': {
      borderRadius: 8,
      aspectRatio: "16/9",
    }
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    '@media (max-width: 768px)': {
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      fontSize: "1.2rem",
    },
    '&:hover': {
      background: "rgba(255,255,255,0.2)",
      transform: "scale(1.1)",
    }
  },
  "@keyframes slideUp": {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 }
  },
  animatedEntry: {
    animation: "$slideUp 0.5s ease-out forwards",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
    marginBottom: "2rem",
    '& a': {
      color: THEME.colors.text.secondary,
      textDecoration: "none",
      '&:hover': {
        color: THEME.colors.secondary,
      }
    },
  },
  mainImage: {
    width: "100%",
    maxHeight: "600px",
    objectFit: "contain",
    borderRadius: THEME.borderRadius.lg,
    marginBottom: "2rem",
    background: THEME.colors.background.light,
  },
  attributesSection: {
    background: THEME.colors.background.main,
    borderRadius: THEME.borderRadius.lg,
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: THEME.shadows.card,
  },
  attributeTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: THEME.colors.text.primary,
    marginBottom: "1.5rem",
  },
  attributeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  attributeItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  attributeLabel: {
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
  },
  attributeValue: {
    fontSize: "1rem",
    color: THEME.colors.text.primary,
    fontWeight: 500,
  },
  addToCollectionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "1rem",
    background: THEME.colors.background.main,
    border: `2px solid ${THEME.colors.border}`,
    borderRadius: THEME.borderRadius.md,
    color: THEME.colors.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "1rem",
    '&:hover': {
      background: THEME.colors.background.light,
      borderColor: THEME.colors.secondary,
    }
  },
  signInLink: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: THEME.colors.text.secondary,
    marginBottom: "2rem",
    '& a': {
      color: THEME.colors.secondary,
      textDecoration: "none",
      fontWeight: 500,
      '&:hover': {
        textDecoration: "underline",
      }
    }
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  gallerySection: {
    width: "100%",
    position: "relative",
    padding: "1rem",
    background: "rgba(63,114,175,0.02)",
    borderRadius: "16px",
    '@media (max-width: 768px)': {
      padding: "0.75rem",
      marginTop: "1rem"
    }
  },
  galleryGrid: {
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    scrollBehavior: "smooth",
    padding: "0.5rem",
    marginLeft: "-0.5rem",
    marginRight: "-0.5rem",
    '@media (max-width: 768px)': {
      gap: "0.75rem",
      padding: "0.25rem",
      scrollSnapType: "x mandatory",
    }
  },
  galleryItem: {
    flex: "0 0 280px",
    position: "relative",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(63,114,175,0.08)",
    transition: "all 0.3s",
    '@media (max-width: 768px)': {
      flex: "0 0 220px",
      scrollSnapAlign: "start",
    }
  },
  carouselButton: {
    position: "absolute",
    top: "62%",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    boxShadow: "0 8px 24px rgba(63,114,175,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    transition: "all 0.3s",
    color: "#3F72AF",
    '&:hover': {
      background: "#3F72AF",
      color: "#fff",
      transform: "translateY(-50%) scale(1.1)",
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: "not-allowed",
      '&:hover': {
        background: "#fff",
        color: "#3F72AF",
        transform: "translateY(-50%)",
      },
    },
    '& svg': {
      fontSize: "1.2rem",
    },
  },
  prevButton: {
    left: "-22px",
  },
  nextButton: {
    right: "-28px",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  imageModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: 8,
  },
  // New styles from MainPage
  previewModal: {
    position: 'fixed',
    top: '50px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    height: '100%',
    position: 'relative',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  actionButtonsFixed: {
    position: 'fixed',
    right: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  buttonContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  circleButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    color: '#666',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '& svg': {
      width: '24px',
      height: '24px',
    },
  },
  buttonLabel: {
    fontSize: '14px',
    color: '#666',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    fontWeight: '500',
    '&.visible': {
      opacity: 1,
    },
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #DBE2EF',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    background: '#fff',
    gap: '16px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
    fontFamily: "'Sarabun', 'Inter', sans-serif",
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  headerActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  headerActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#f8f9fa',
    color: '#666',
    '&:hover': {
      transform: 'scale(1.05)',
      background: '#f1f5f9',
    },
    '&.liked': {
      background: '#fce7f3',
      color: '#ec4899',
      '&:hover': {
        background: '#fbcfe8',
      },
    },
    '&.bookmarked': {
      background: '#fce7f3',
      color: '#ec4899',
      '&:hover': {
        background: '#fbcfe8',
      },
    },
    '&.download': {
      background: 'rgba(255, 0, 0, 0.8)',
      color: '#fff',
      fontSize: '1.2rem',
      padding: '12px 24px',
      width: 'auto',
      borderRadius: '24px',
      fontWeight: 600,
      display: 'flex',
      gap: '8px',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
  },
  actionCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#3F72AF',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 600,
  },
  closeButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 7rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  mainContent: {
    display: "block",
    gridTemplateColumns: '65% 35%',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    }
  },
  contentMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    '& img': {
      width: '100%',
      height: 'auto',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: '8px'
    },
    '& iframe, & video': {
      width: '100%',
      height: '80vh',
      borderRadius: '8px'
    }
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '20px',
    '& h3': {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#112D4E',
      fontFamily: "'Sarabun', 'Inter', sans-serif",
    },
  },
  previewDescription: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: '#444',
    margin: '0rem 6rem',
    padding: '1rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadowbottom: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  relatedSection: {
    padding: '1.5rem',
    borderRadius: '16px',
    marginTop: '2rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    '& h4': {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: '1.25rem',
    }
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
    "&:hover": {
      "& $relatedImage": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
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
  relatedImageBox: {
    width: "100%",
    aspectRatio: "1/0.6", // กำหนดสัดส่วน 1:0.9
    position: "relative",
    overflow: "hidden",
    background: "#f8f9fa",
    borderRadius: "20px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
  },
  relatedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // หรือ "contain" แล้วแต่ต้องการ
    objectPosition: "center", // จัดตำแหน่งรูปให้อยู่กลาง
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
  relatedActionBtn: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    border: "none",
    borderRadius: "48px",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "white",
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      color: "#3F72AF",
    },
    "& svg": {
      fontSize: "1.2rem",
    }
  },
  relatedInfo: {
    padding: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "12px",
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
  readMoreButton: {
    background: 'none',
    border: 'none',
    color: '#3F72AF',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 16px',
    margin: '8px auto',
    display: 'block',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      textDecoration: 'underline',
      transform: 'translateY(-2px)'
    }
},
detailsPopup: {
position: 'fixed',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
backgroundColor: '#fff',
borderRadius: '12px',
boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
width: '90%',
maxWidth: '500px',
zIndex: 10001,
},
popupHeader: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '16px 24px',
borderBottom: '1px solid #eee',
'& h2': {
  margin: 0,
  fontSize: '20px',
  fontWeight: '600',
},
},
popupContent: {
padding: '24px',
},
statsRow: {
display: 'flex',
gap: '32px',
marginBottom: '24px',
},
statItem: {
display: 'flex',
flexDirection: 'column',
gap: '4px',
'& .label': {
  fontSize: '14px',
  color: '#666',
},
'& .value': {
  fontSize: '24px',
  fontWeight: '600',
},
},
dateInfo: {
fontSize: '14px',
color: '#666',
marginBottom: '24px',
},
tagsSection: {
'& h3': {
  fontSize: '16px',
  fontWeight: '500',
  marginBottom: '12px',
},
},
detailsTagsList: {
display: 'flex',
flexWrap: 'wrap',
gap: '8px',
},
detailsTag: {
padding: '6px 12px',
backgroundColor: '#f5f5f5',
borderRadius: '100px',
fontSize: '14px',
color: '#666',
},
modalBackdrop: {
position: 'fixed',
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: 'rgba(0, 0, 0, 0.5)',
zIndex: 10000,
},
popupCloseButton: {
background: 'none',
border: 'none',
cursor: 'pointer',
padding: '8px',
color: '#666',
'&:hover': {
  color: '#000',
},
'& svg': {
  width: '20px',
  height: '20px',
},
},
});

const embedYouTube = (url: string) => {
if (!url) return "";
const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
return idMatch?.[1]
? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0&modestbranding=1`
: url;
};

// Add type definition for Resource
interface Resource {
id: string;
title: string;
description: string;
type: string;
category: string;
tags: string[];
fileUrl: string;
thumbnailUrl: string;
gallery?: string[];
uploadedBy: string;
downloadCount: number;
viewCount: number;
createdAt: string;
updatedAt: string;
videoUrl?: string;
}

const VideoPlayer = ({ src, title }) => {
const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

if (isYouTube) {
const videoId = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/)?.[1];
const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : src;
return (
  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
    <iframe
      width="100%"
      height="600"
      src={embedUrl}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ maxWidth: '100%', maxHeight: '70vh' }}
    />
  </div>
);
}

return (
<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
  <video
    src={src}
    controls
    autoPlay
    style={{ maxWidth: '100%', maxHeight: '70vh' }}
  />
</div>
);
};

const ResourceDetailPage = () => {
const { id } = useParams();
const navigate = useNavigate();
const { addDownload } = useDownloadHistory();
const classes = useStyles();
const { user } = useAuth();
const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
const [showFullDesc, setShowFullDesc] = useState(false);
const descRef = useRef<HTMLDivElement>(null);
const [descOverflow, setDescOverflow] = useState(false);
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const galleryRef = useRef<HTMLDivElement>(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);
const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
const [bookmarkStatus, setBookmarkStatus] = useState(false);
const [isPreviewOpen, setIsPreviewOpen] = useState(false);
const [showDetailsPopup, setShowDetailsPopup] = useState(false);
const [showFullDescription, setShowFullDescription] = useState(false);
const [likes, setLikes] = useState<{ [key: string]: boolean }>(() => {
const savedLikes = localStorage.getItem('likes');
return savedLikes ? JSON.parse(savedLikes) : {};
});
const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});

const resource = resourcesData.resources.find((r) => r.id === id) as Resource;


if (!resource) {
return (
  <div style={{ 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    flexDirection: "column",
    gap: "1rem",
    background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
  }}>
    <h2 style={{ fontSize: "2rem", color: "#112D4E" }}>ไม่พบข้อมูลทรัพยากร</h2>
    <button 
      className={classes.secondaryButton}
      onClick={() => navigate(-1)}
    >
      กลับไปหน้าก่อนหน้า
    </button>
  </div>
);
}

// Gallery images
const images = useMemo(() => {
return resource?.gallery || [resource?.thumbnailUrl];
}, [resource]);

useEffect(() => {
if (descRef.current) {
  setDescOverflow(descRef.current.scrollHeight > 300);
}
}, [resource.description]);

useEffect(() => {
if (resource) {
  setBookmarkStatus(isBookmarked(resource.id));
  setLikeCounts(prev => ({
    ...prev,
    [resource.id]: resource.viewCount || 0
  }));
}
}, [resource, isBookmarked]);

const handleOpenVideoModal = useCallback(() => {
setIsVideoModalOpen(true);
document.body.style.overflow = "hidden";
}, []);

const handleCloseVideoModal = useCallback(() => {
setIsVideoModalOpen(false);
document.body.style.overflow = "auto";
}, []);

const relatedByCategory = useMemo(() => {
return resourcesData.resources
  .filter((item) =>
    item.category === resource.category &&
    item.id !== resource.id
  ).slice(0, 6);
}, [resource]);

const handleLoginRedirect = () => {
navigate(`/login?redirect=/resource/${id}`);
};

const handleDownload = () => {
if (!user) {
  handleLoginRedirect();
  return;
}

addDownload(user.id, {
  id: resource.id,
  title: resource.title,
  description: resource.description,
  type: resource.type,
  fileUrl: resource.fileUrl,
  downloadedAt: new Date().toISOString()
});

const link = document.createElement("a");
link.href = resource.fileUrl;
link.download = resource.title || "download";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};

const isVideo = resource.type === "video";
const isYouTube = resource.videoUrl?.includes("youtube.com") || resource.videoUrl?.includes("youtu.be");

const checkScrollButtons = useCallback(() => {
if (galleryRef.current) {
  const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
  setCanScrollLeft(scrollLeft > 0);
  setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
}
}, []);

const scroll = useCallback((direction: 'left' | 'right') => {
if (galleryRef.current) {
  const scrollAmount = 300;
  const newScrollLeft = galleryRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
  galleryRef.current.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  });
}
}, []);

useEffect(() => {
const gallery = galleryRef.current;
if (gallery) {
  gallery.addEventListener('scroll', checkScrollButtons);
  checkScrollButtons();
  return () => gallery.removeEventListener('scroll', checkScrollButtons);
}
}, [checkScrollButtons]);

const handleShare = async () => {
try {
  if (navigator.share) {
    await navigator.share({
      title: resource.title,
      text: resource.description,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
  }
} catch (error) {
  console.error('Error sharing:', error);
}
};

const handleBookmark = () => {
if (!user) {
  handleLoginRedirect();
  return;
}

if (bookmarkStatus) {
  removeBookmark(resource.id);
  setBookmarkStatus(false);
} else {
  addBookmark({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    imageUrl: resource.thumbnailUrl,
    type: resource.type,
    category: resource.category,
    createdAt: resource.createdAt
  });
  setBookmarkStatus(true);
}
};

const handleLike = () => {
if (!user) {
  handleLoginRedirect();
  return;
}

const newLikes = { ...likes };
const newLikeCounts = { ...likeCounts };

if (newLikes[resource.id]) {
  delete newLikes[resource.id];
  newLikeCounts[resource.id] = (newLikeCounts[resource.id] || 0) - 1;
} else {
  newLikes[resource.id] = true;
  newLikeCounts[resource.id] = (newLikeCounts[resource.id] || 0) + 1;
}

setLikes(newLikes);
setLikeCounts(newLikeCounts);
localStorage.setItem('likes', JSON.stringify(newLikes));
};

return (
<div className={classes.container}>
  <div className={classes.heroSection}>
    <div className={classes.heroContent}>
      <div className={classes.heroMain}>
        <div className={classes.heroImageWrap}>
          <img 
            src={`${import.meta.env.BASE_URL}${resource.thumbnailUrl.replace(/^\//, '')}`}
            alt={resource.title}
            className={classes.heroImage}
          />
          {isVideo && (
            <button
              className={classes.playButton}
              onClick={handleOpenVideoModal}
              aria-label="เล่นวิดีโอ"
            >
              <FaPlay />
            </button>
          )}
        </div>
        
        <div className={classes.infoSection}>
          <h1 className={classes.title}>{resource.title}</h1>
          
          <div className={classes.headerActions} style={{ marginBottom: '2rem' }}>
            <button
              className={`${classes.headerActionBtn} ${likes[resource.id] ? 'liked' : ''}`}
              onClick={handleLike}
              title={likes[resource.id] ? 'เลิกถูกใจ' : 'ถูกใจ'}
            >
              {likes[resource.id] ? <IoHeartSharp /> : <IoHeartOutline />}
              {likeCounts[resource.id] > 0 && (
                <span className={classes.actionCount}>{likeCounts[resource.id]}</span>
              )}
            </button>
            <button
              className={`${classes.headerActionBtn} ${bookmarkStatus ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
              title={bookmarkStatus ? 'นำออกจากบุ๊กมาร์ก' : 'เพิ่มในบุ๊กมาร์ก'}
            >
              {bookmarkStatus ? <IoBookmark /> : <IoBookmarkOutline />}
            </button>
            <button 
              className={`${classes.headerActionBtn} download`}
              onClick={handleDownload}
            >
              <FaDownload />
              <span>ดาวน์โหลด</span>
            </button>
          </div>
          
        

          <div className={classes.actionButtonsFixed}>
            <div 
              className={classes.buttonContainer}
              onMouseEnter={(e) => {
                const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                if (label) {
                  label.classList.add('visible');
                }
              }}
              onMouseLeave={(e) => {
                const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                if (label) {
                  label.classList.remove('visible');
                }
              }}
            >
              <button 
                className={classes.circleButton}
                onClick={handleShare}
              >
                <IoShareSocialSharp />
              </button>
              <div className={classes.buttonLabel}>Share</div>
            </div>
            <div 
              className={classes.buttonContainer}
              onMouseEnter={(e) => {
                const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                if (label) {
                  label.classList.add('visible');
                }
              }}
              onMouseLeave={(e) => {
                const label = e.currentTarget.querySelector(`.${classes.buttonLabel}`);
                if (label) {
                  label.classList.remove('visible');
                }
              }}
            >
              <button 
                className={classes.circleButton}
                onClick={() => setShowDetailsPopup(true)}
              >
                <IoEllipsisVerticalCircle />
              </button>
              <div className={classes.buttonLabel}>More</div>
            </div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className={classes.gallerySection}>
          <h2 className={classes.sectionTitle}>รูปภาพทั้งหมด</h2>
          <button 
            className={`${classes.carouselButton} ${classes.prevButton}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous images"
          >
            <FaChevronLeft />
          </button>
          <button 
            className={`${classes.carouselButton} ${classes.nextButton}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next images"
          >
            <FaChevronRight />
          </button>
          <PhotoProvider
            maskOpacity={0.8}
            maskClassName="custom-photo-mask"
            photoClosable={true}
            bannerVisible={false}
          >
            <div className={classes.galleryGrid} ref={galleryRef}>
              {images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={classes.galleryItem}
                >
                  <PhotoView 
                    src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`}
                      alt={`รูปภาพที่ ${index + 1}`}
                      className={classes.galleryImage}
                      loading="lazy"
                    />
                  </PhotoView>
                </div>
              ))}
            </div>
          </PhotoProvider>
        </div>
      )}
    </div>
  </div>

  <div className={classes.contentSection}>
    <div className={classes.mainContent}>
      {resource.description && (
        <div style={{ marginTop: "2rem" }}>
          <h2 className={classes.sectionTitle}>เนื้อหา</h2>
          <div
            ref={descRef}
            className={classes.previewDescription}
            style={{
              maxHeight: showFullDesc ? 'none' : 300,
              overflow: showFullDesc ? 'visible' : 'hidden',
              position: 'relative',
            }}
          >
            {resource.description}
            {!showFullDesc && descOverflow && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 100,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff)',
              }} />
            )}
          </div>
          {descOverflow && (
            <button
              onClick={() => setShowFullDesc(v => !v)}
              className={classes.readMoreButton}
            >
              {showFullDesc ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
            </button>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: "3rem",
        borderRadius: "16px",
      }}>
        <h2 className={classes.sectionTitle}>รายละเอียด</h2>
        <div className={classes.detailsGrid}>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>หมวดหมู่</div>
            <div className={classes.detailValue}>{resource.category}</div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>ประเภทไฟล์</div>
            <div className={classes.detailValue}>{resource.type}</div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>เผยแพร่เมื่อ</div>
            <div className={classes.detailValue}>
              {new Date(resource.createdAt).toLocaleDateString("th-TH")}
            </div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>อัปเดตล่าสุด</div>
            <div className={classes.detailValue}>
              {new Date(resource.updatedAt).toLocaleDateString("th-TH")}
            </div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>จำนวนการดู</div>
            <div className={classes.detailValue}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaEye />
                {resource.viewCount || 0} ครั้ง
              </div>
            </div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>จำนวนดาวน์โหลด</div>
            <div className={classes.detailValue}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaDownload />
                {resource.downloadCount || 0} ครั้ง
              </div>
            </div>
          </div>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>ผู้เผยแพร่</div>
            <div className={classes.detailValue}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaHeart />
                {resource.uploadedBy}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className={classes.contentSectionGray}>
    <div className={classes.relatedSection}>
      <div className={classes.relatedHeader}>
        <h2 className={classes.sectionTitle}>รายการที่เกี่ยวข้อง</h2>
      </div>
      <div className={classes.relatedGrid}>
        {relatedByCategory.map((item) => (
          <div
            key={item.id}
            className={classes.relatedCard}
            onClick={() => navigate(`/resource/${item.id}`)}
          >
            <div className={classes.relatedImageBox}>
              <img
                src={item.thumbnailUrl ? `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}` : item.fileUrl}
                alt={item.title}
                className={classes.relatedImage}
              />
              <div className={classes.relatedTitle}>{item.title}</div>
            </div>
            <div className={classes.relatedInfo}>
              <span style={{fontSize: '0.92rem', color: '#64748b', fontWeight: 400}}>
                {item.category}
              </span>
              <div className={classes.relatedStats}>
                <span className="stat">
                  <IoHeart />
                  {likeCounts[item.id] || 0}
                </span>
                <span className="stat">
                  <IoEye />
                  {item.viewCount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {isVideoModalOpen && (
    <div className={classes.videoModal} onClick={handleCloseVideoModal}>
      <div className={classes.videoContainer} onClick={e => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={handleCloseVideoModal}>
          <FaTimes />
        </button>
        {isYouTube ? (
          <iframe
            src={embedYouTube(resource.videoUrl || "")}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={resource.title}
          />
        ) : (
          <video
            src={resource.fileUrl || resource.videoUrl}
            style={{
              width: "100%",
              height: "100%",
              background: "#000",
            }}
            controls
            autoPlay
            poster={resource.thumbnailUrl}
          />
        )}
      </div>
    </div>
  )}

  {showDetailsPopup && (
    <>
      <div className={classes.modalBackdrop} onClick={() => setShowDetailsPopup(false)} />
      <div className={classes.detailsPopup}>
        <div className={classes.popupHeader}>
          <h2>รายละเอียดเพิ่มเติม</h2>
          <button className={classes.popupCloseButton} onClick={() => setShowDetailsPopup(false)}>
            <FaTimes />
          </button>
        </div>
        <div className={classes.popupContent}>
          <div className={classes.statsRow}>
            <div className={classes.statItem}>
              <span className="label">ยอดดู</span>
              <span className="value">{resource.viewCount || 0}</span>
            </div>
            <div className={classes.statItem}>
              <span className="label">ยอดดาวน์โหลด</span>
              <span className="value">{resource.downloadCount || 0}</span>
            </div>
            <div className={classes.statItem}>
              <span className="label">ยอดถูกใจ</span>
              <span className="value">{likeCounts[resource.id] || 0}</span>
            </div>                
          </div>
          <div className={classes.dateInfo}>
            โพสต์เมื่อ: {new Date(resource.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {resource.tags && resource.tags.length > 0 && (
            <div className={classes.tagsSection}>
              <h3>แท็ก</h3>
              <div className={classes.detailsTagsList}>
                {resource.tags.map((tag, index) => (
                  <span key={index} className={classes.detailsTag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
);
};

export default ResourceDetailPage;