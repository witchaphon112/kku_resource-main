import React from 'react';
import { FaHeart, FaRegHeart, FaEye, FaDownload, FaUser, FaSpinner } from 'react-icons/fa';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  card: {
    position: "relative",
    cursor: "pointer",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    padding: "8px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      "& $cardImageBox img": {
        transform: "scale(1.05)",
      },
      "& $cardTitle": {
        opacity: 1,
        transform: "translateY(0)",
      },
      "& $cardActionBar": {
        opacity: 1,
        transform: "translateY(0)",
      }
    }
  },
  cardImageBox: {
    width: "100%",
    aspectRatio: "16/9",
    position: "relative",
    overflow: "hidden",
    background: "#f8f9fa",
    borderRadius: "20px",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      borderRadius: "20px",
    }
  },
  cardTitle: {
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
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    lineHeight: 1.4,
    borderRadius: "0 0 20px 20px",
  },
  cardActionBar: {
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
  cardActionBtn: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    border: "none",
    borderRadius: "12px",
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
  cardInfo: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& .avatar": {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      "& svg": {
        fontSize: "0.9rem",
      }
    },
    "& .name": {
      fontSize: "0.875rem",
      color: "#334155",
      fontWeight: "500",
    }
  },
  stats: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& .stat": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#64748b",
      fontSize: "0.875rem",
      "& svg": {
        fontSize: "0.9rem",
      }
    }
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#3F72AF",
    animation: "$spin 1s linear infinite",
  },
  spinnerIcon: {
    animation: "$spin 1s linear infinite",
  }
});

interface ImageCardProps {
  item: {
    id: string;
    title: string;
    thumbnailUrl: string;
    uploadedBy?: string;
    downloadCount?: number;
    viewCount?: number;
  };
  isBookmarked: boolean;
  onPreview: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onBookmark: (e: React.MouseEvent) => void;
  onClick: () => void;
  isLoaded: boolean;
  onLoad: () => void;
  getImageUrl: (path: string) => string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  item,
  isBookmarked,
  onPreview,
  onDownload,
  onBookmark,
  onClick,
  isLoaded,
  onLoad,
  getImageUrl
}) => {
  const classes = useStyles();

  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.cardImageBox}>
        {!isLoaded && (
          <div className={classes.imageLoader}>
            <FaSpinner className={classes.spinnerIcon} />
          </div>
        )}
        <img
          src={getImageUrl(item.thumbnailUrl)}
          alt={item.title}
          loading="lazy"
          onLoad={onLoad}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
        <div className={classes.cardTitle}>{item.title}</div>
        <div className={classes.cardActionBar}>
          <button 
            className={classes.cardActionBtn}
            onClick={onPreview}
            title="Preview"
          >
            <FaEye />
          </button>
          <button 
            className={classes.cardActionBtn}
            onClick={onDownload}
            title="Download"
          >
            <FaDownload />
          </button>
          <button 
            className={classes.cardActionBtn}
            onClick={onBookmark}
            title="Bookmark"
          >
            {isBookmarked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      <div className={classes.cardInfo}>
        <div className={classes.userInfo}>
          <div className="avatar">
            <FaUser />
          </div>
          <span className="name">{item.uploadedBy || "admin"}</span>
        </div>
        <div className={classes.stats}>
          <span className="stat">
            <FaHeart />
            {item.downloadCount || 0}
          </span>
          <span className="stat">
            <FaEye />
            {item.viewCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard; 