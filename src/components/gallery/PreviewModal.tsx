import React from 'react';
import { createUseStyles } from 'react-jss';
import { FaTimes, FaDownload, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const useStyles = createUseStyles({
  previewModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    animation: '$fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #DBE2EF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
    fontFamily: "'Sarabun', 'Inter', sans-serif",
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      color: '#112D4E',
      transform: 'scale(1.1)',
    },
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    maxHeight: 'calc(90vh - 140px)',
  },
  previewImageContainer: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    maxHeight: '70vh',
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
  galleryNav: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.75)',
    },
    '&.prev': {
      left: '10px',
    },
    '&.next': {
      right: '10px',
    },
  },
  previewInfo: {
    marginTop: '20px',
    '& h3': {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#112D4E',
      marginBottom: '12px',
      fontFamily: "'Sarabun', 'Inter', sans-serif",
    },
  },
  previewActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#3F72AF',
    color: '#fff',
    '&:hover': {
      background: '#112D4E',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(63,114,175,0.2)',
    },
    '& svg': {
      fontSize: '1.1rem',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  galleryThumbnails: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    overflowX: 'auto',
    padding: '4px',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
      '&:hover': {
        background: '#555',
      },
    },
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    '&.active': {
      borderColor: '#3F72AF',
      transform: 'scale(1.05)',
    },
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
});

interface PreviewModalProps {
  item: {
    id: string;
    title: string;
    thumbnailUrl: string;
    gallery?: string[];
    description?: string;
  };
  isBookmarked: boolean;
  onClose: () => void;
  onDownload: (e: React.MouseEvent) => void;
  onBookmark: (e: React.MouseEvent) => void;
  getImageUrl: (path: string) => string;
  currentGalleryIndex: number;
  onGalleryNav: (direction: 'prev' | 'next') => void;
  onThumbnailClick: (index: number) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  isBookmarked,
  onClose,
  onDownload,
  onBookmark,
  getImageUrl,
  currentGalleryIndex,
  onGalleryNav,
  onThumbnailClick,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.previewModal} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2 className={classes.modalTitle}>{item.title}</h2>
          <button className={classes.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={classes.modalBody}>
          <div className={classes.previewImageContainer}>
            <img
              src={getImageUrl(item.gallery?.[currentGalleryIndex] || item.thumbnailUrl)}
              alt={item.title}
              className={classes.previewImage}
            />
            {item.gallery && item.gallery.length > 1 && (
              <>
                <button
                  className={`${classes.galleryNav} prev`}
                  onClick={() => onGalleryNav('prev')}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className={`${classes.galleryNav} next`}
                  onClick={() => onGalleryNav('next')}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {item.gallery && item.gallery.length > 1 && (
            <div className={classes.galleryThumbnails}>
              {item.gallery.map((image, index) => (
                <div
                  key={index}
                  className={`${classes.thumbnail} ${
                    index === currentGalleryIndex ? 'active' : ''
                  }`}
                  onClick={() => onThumbnailClick(index)}
                >
                  <img src={getImageUrl(image)} alt={`${item.title} - ${index + 1}`} />
                </div>
              ))}
            </div>
          )}

          <div className={classes.previewInfo}>
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </div>

          <div className={classes.previewActions}>
            <button className={classes.actionButton} onClick={onDownload}>
              <FaDownload />
              ดาวน์โหลด
            </button>
            <button className={classes.actionButton} onClick={onBookmark}>
              {isBookmarked ? <FaHeart /> : <FaRegHeart />}
              {isBookmarked ? 'เลิกบุ๊กมาร์ก' : 'บุ๊กมาร์ก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal; 