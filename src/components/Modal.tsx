import React, { useEffect, useCallback } from 'react';
import { createUseStyles } from 'react-jss';

interface PreviewItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  fileUrl: string;
  viewCount?: number;
  downloadCount?: number;
  tags?: string[];
  category?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  selectedItem?: PreviewItem;
  onLike?: (item: PreviewItem) => void;
  onBookmark?: (item: PreviewItem) => void;
  onDownload?: (item: PreviewItem) => void;
  onRelatedItemClick?: (item: PreviewItem) => void;
  relatedItems?: PreviewItem[];
  likes?: { [key: string]: boolean };
  likeCounts?: { [key: string]: number };
  bookmarks?: PreviewItem[];
}

const useStyles = createUseStyles({
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    '@media (max-width: 768px)': {
      padding: '1rem'
    }
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    animation: '$modalFadeIn 0.3s ease',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      maxWidth: '100%',
      borderRadius: '12px'
    }
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#333',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: '2rem'
  },
  modalBody: {
    flex: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
        background: '#666'
      }
    }
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.1)',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.2)',
      transform: 'rotate(90deg)',
    },
    '& i': {
      fontSize: '1.2rem'
    }
  },

  // Preview Content Styles
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  mainContent: {
    display: 'grid',
    gridTemplateColumns: '65% 35%',
    gap: '2rem',
    padding: '2rem 4rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      padding: '1.5rem',
    }
  },

  contentMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  contentSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      paddingTop: '1.5rem'
    }
  },

  previewImage: {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    '& img': {
      width: '100%',
      height: 'auto',
      display: 'block',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      }
    }
  },

  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '16px',
  },

  previewMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    fontSize: '0.95rem',
    color: '#666',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: '#fff',
      borderRadius: '100px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      '& i': {
        color: '#3F72AF',
        fontSize: '1.1rem',
      }
    }
  },

  previewDescription: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: '#444',
    margin: 0,
    padding: '1rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },

  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },

  previewTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#fff',
    color: '#3F72AF',
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
  },

  previewActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },

  actionButton: {
    flex: 1,
    minWidth: '120px',
    padding: '0.75rem 1.25rem',
    borderRadius: '100px',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    background: '#fff',
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      borderColor: '#3F72AF',
      color: '#3F72AF',
    },
    '&.active': {
      background: '#3F72AF',
      borderColor: '#3F72AF',
      color: '#fff',
    },
    '& i': {
      fontSize: '1.1rem',
    }
  },

  relatedSection: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '16px',
    marginTop: '2rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    '& h4': {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: '1.25rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
    }
  },

  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },

  relatedCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#fff',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
  },

  relatedImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },

  relatedContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  relatedTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1a1a1a',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  relatedMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#666',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      '& i': {
        fontSize: '0.9rem',
        color: '#3F72AF',
      }
    }
  },

  '@keyframes modalFadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
});

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  selectedItem,
  onLike,
  onBookmark,
  onDownload,
  onRelatedItemClick,
  relatedItems,
  likes,
  likeCounts,
  bookmarks
}) => {
  const classes = useStyles();

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          {title && <h2 className={classes.modalTitle}>{title}</h2>}
          <button className={classes.closeButton} onClick={onClose} aria-label="Close modal">
            <i className="pi pi-times" />
          </button>
        </div>
        <div className={classes.modalBody}>
          {selectedItem ? (
            <div className={classes.previewContent}>
              <div className={classes.mainContent}>
                <div className={classes.contentMain}>
                  <div className={classes.previewImage}>
                    <img
                      src={selectedItem.thumbnailUrl ? `${import.meta.env.BASE_URL}${selectedItem.thumbnailUrl.replace(/^\//, '')}` : selectedItem.fileUrl}
                      alt={selectedItem.title}
                    />
                  </div>
                  <div className={classes.previewInfo}>
                    <div className={classes.previewMeta}>
                      <span>
                        <i className="pi pi-eye" /> {selectedItem.viewCount || 0} ครั้ง
                      </span>
                      <span>
                        <i className="pi pi-download" /> {selectedItem.downloadCount || 0} ดาวน์โหลด
                      </span>
                      <span>
                        <i className="pi pi-heart" /> {likeCounts?.[selectedItem.id] || 0} ถูกใจ
                      </span>
                    </div>
                    {selectedItem.description && (
                      <p className={classes.previewDescription}>{selectedItem.description}</p>
                    )}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div className={classes.previewTags}>
                        {selectedItem.tags.map((tag, idx) => (
                          <span key={idx} className={classes.previewTag}>
                            <i className="pi pi-tag" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={classes.contentSide}>
                  <div className={classes.previewActions}>
                    <button
                      className={`${classes.actionButton} ${likes?.[selectedItem.id] ? 'active' : ''}`}
                      onClick={() => onLike?.(selectedItem)}
                    >
                      <i className={`pi ${likes?.[selectedItem.id] ? 'pi-heart-fill' : 'pi-heart'}`} />
                      {likeCounts?.[selectedItem.id] || 0}
                    </button>
                    <button
                      className={`${classes.actionButton} ${bookmarks?.some(b => b.id === selectedItem.id) ? 'active' : ''}`}
                      onClick={() => onBookmark?.(selectedItem)}
                    >
                      <i className="pi pi-bookmark" />
                      {bookmarks?.some(b => b.id === selectedItem.id) ? 'ลบบุ๊คมาร์ค' : 'บุ๊คมาร์ค'}
                    </button>
                    <button
                      className={classes.actionButton}
                      onClick={() => onDownload?.(selectedItem)}
                    >
                      <i className="pi pi-download" /> ดาวน์โหลด
                    </button>
                  </div>
                </div>
              </div>
              {relatedItems && relatedItems.length > 0 && (
                <div className={classes.relatedSection}>
                  <h4>รายการที่เกี่ยวข้อง</h4>
                  <div className={classes.relatedGrid}>
                    {relatedItems
                      .filter(item => 
                        item.id !== selectedItem.id && 
                        (item.category === selectedItem.category || 
                         (Array.isArray(item.tags) && Array.isArray(selectedItem.tags) &&
                          item.tags.some(tag => selectedItem.tags?.includes(tag))))
                      )
                      .slice(0, 8)
                      .map(item => (
                        <div
                          key={item.id}
                          className={classes.relatedCard}
                          onClick={() => onRelatedItemClick?.(item)}
                        >
                          <img
                            src={item.thumbnailUrl ? `${import.meta.env.BASE_URL}${item.thumbnailUrl.replace(/^\//, '')}` : item.fileUrl}
                            alt={item.title}
                            className={classes.relatedImage}
                          />
                          <div className={classes.relatedContent}>
                            <h3 className={classes.relatedTitle}>{item.title}</h3>
                            <div className={classes.relatedMeta}>
                              <span>
                                <i className="pi pi-eye" /> {item.viewCount || 0}
                              </span>
                              <span>
                                <i className="pi pi-download" /> {item.downloadCount || 0}
                              </span>
                              <span>
                                <i className="pi pi-heart" /> {likeCounts?.[item.id] || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal; 