import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useDownloadHistory } from "../contexts/DownloadHistoryContext";
import { Divider } from "primereact/divider";
import { DataView } from 'primereact/dataview';
import { createUseStyles } from "react-jss";

const PRIMARY_COLOR = "#2d3436";
const SECONDARY_COLOR = "#ffffff";
const BORDER_COLOR = "#e0e0e0";
const DANGER_COLOR = "#dc3545";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "6rem 1rem 2rem",
    background: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Sarabun', sans-serif",
    "@media (max-width: 768px)": {
      padding: "4rem 1rem 1rem"
    }
  },
  sidebar: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto 2rem",
    background: SECONDARY_COLOR,
    borderRadius: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "1.5rem",
    border: `1px solid ${BORDER_COLOR}`,
    "@media (max-width: 768px)": {
      padding: "1rem",
      marginBottom: "1rem"
    }
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      textAlign: "center",
      gap: "1rem"
    }
  },
  avatarContainer: {
    flexShrink: 0,
    width: 120,
    height: 120,
    position: "relative",
    "@media (max-width: 768px)": {
      width: 100,
      height: 100
    }
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: `3px solid ${PRIMARY_COLOR}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  adminBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: PRIMARY_COLOR,
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: PRIMARY_COLOR,
    "@media (max-width: 768px)": {
      fontSize: "1.3rem"
    }
  },
  userDepartment: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  },
  divider: {
    borderTop: `1px solid ${BORDER_COLOR}`
  },
  quickActionsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "0.75rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr"
    }
  },
  actionButton: {
    '&.p-button-outlined': {
      width: "100%",
      justifyContent: "flex-start",
      color: `${PRIMARY_COLOR} !important`,
      borderColor: `${BORDER_COLOR} !important`,
      transition: "all 0.2s ease",
      fontWeight: 600,
      padding: "0.75rem 1rem",
      "@media (max-width: 768px)": {
        justifyContent: "center"
      }
    }
  },
  mainContent: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
    background: SECONDARY_COLOR,
    borderRadius: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "1.5rem",
    border: `1px solid ${BORDER_COLOR}`,
    "@media (max-width: 768px)": {
      padding: "1rem"
    }
  },
  mainTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: PRIMARY_COLOR
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr"
    }
  },
  statsCard: {
    background: SECONDARY_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "0.75rem",
    padding: "1rem",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
    }
  },
  statsCardContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  statsIcon: {
    fontSize: "1.5rem",
    color: PRIMARY_COLOR,
    "@media (max-width: 768px)": {
      fontSize: "1.25rem"
    }
  },
  statsInfo: {
    flex: 1
  },
  statsValue: {
    margin: "0 0 0.25rem",
    color: PRIMARY_COLOR,
    fontSize: "1.5rem",
    fontWeight: 700,
    "@media (max-width: 768px)": {
      fontSize: "1.25rem"
    }
  },
  statsLabel: {
    margin: 0,
    color: "#666",
    fontSize: "0.85rem"
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: PRIMARY_COLOR,
    fontWeight: 600,
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    "@media (max-width: 768px)": {
      fontSize: "1.1rem"
    }
  },
  accountDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "1rem"
    }
  },
  detailItem: {
    background: "#f8f9fa",
    padding: "1rem",
    borderRadius: "0.75rem",
    border: `1px solid ${BORDER_COLOR}`
  },
  detailLabel: {
    color: "#666",
    fontSize: "0.85rem",
    marginBottom: "0.5rem"
  },
  detailValue: {
    color: PRIMARY_COLOR,
    fontWeight: 600,
    fontSize: "0.95rem"
  },
  savedItemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr"
    }
  },
  savedItemCard: {
    background: SECONDARY_COLOR,
    borderRadius: "0.75rem",
    border: `1px solid ${BORDER_COLOR}`,
    overflow: "hidden",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
    }
  },
  cardImage: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    "@media (max-width: 768px)": {
      height: 140
    }
  },
  cardContent: {
    padding: "1rem"
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: PRIMARY_COLOR,
    marginBottom: "0.5rem",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  cardDescription: {
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderTop: `1px solid ${BORDER_COLOR}`,
    background: "#f8f9fa"
  },
  cardDate: {
    fontSize: "0.8rem",
    color: "#666"
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem"
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#666",
    "@media (max-width: 768px)": {
      padding: "2rem 1rem"
    }
  },
  emptyIcon: {
    fontSize: "2.5rem",
    color: PRIMARY_COLOR,
    marginBottom: "1rem",
    opacity: 0.5,
    "@media (max-width: 768px)": {
      fontSize: "2rem"
    }
  }
});

interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
  color: string;
}

const Profile = () => {
  const classes = useStyles();
  const { user, logout } = useAuth();
  const { bookmarks, removeBookmark } = useBookmarks();
  const { downloads } = useDownloadHistory();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const quickActions: QuickAction[] = [
    { 
      label: 'ออกจากระบบ', 
      icon: 'pi pi-sign-out', 
      action: logout,
      color: PRIMARY_COLOR
    }
  ];

  const itemTemplate = (item: any) => {
    return (
      <Card className="saved-item-card" style={{ margin: '0.5rem', backgroundColor: SECONDARY_COLOR, border: `1px solid ${BORDER_COLOR}` }}>
        <div className="flex align-items-center">
          <img 
            src={item.imageUrl || '/placeholder-image.png'} 
            alt={item.title} 
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              marginRight: '1rem'
            }} 
          />
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: PRIMARY_COLOR }}>{item.title}</h4>
            <p style={{ margin: '0', color: '#666' }}>{item.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button 
                icon="pi pi-eye" 
                label="ดูรายละเอียด"
                className="p-button-text"
                style={{ color: PRIMARY_COLOR, padding: '0' }}
                onClick={() => navigate(`/resource/${item.id}`)}
              />
              <Button 
                icon="pi pi-download" 
                label="ดาวน์โหลด"
                className="p-button-text"
                style={{ color: PRIMARY_COLOR, padding: '0' }}
                onClick={() => window.open(item.fileUrl, '_blank')}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div className={classes.profileSection}>
          <div className={classes.avatarContainer}>
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className={classes.avatar}
            />
            {user.role === 'admin' && (
              <div className={classes.adminBadge}>
                Admin
              </div>
            )}
          </div>
          
          <div className={classes.userInfo}>
            <h2 className={classes.userName}>
              {user.fullName}
            </h2>
            
            <div className={classes.userDepartment}>
              {user.department}
            </div>
            <div className={classes.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  icon={action.icon}
                  onClick={action.action}
                  className={`p-button-outlined ${classes.actionButton}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.mainContent}>
        <h2 className={classes.mainTitle}>
          ข้อมูลผู้ใช้
        </h2>

        <div className={classes.statsGrid}>
          <div className={classes.statsCard}>
            <div className={classes.statsCardContent}>
              <i className={`pi pi-download ${classes.statsIcon}`} />
              <div className={classes.statsInfo}>
                <h3 className={classes.statsValue}>
                  {downloads.length}
                </h3>
                <p className={classes.statsLabel}>
                  การดาวน์โหลด
                </p>
              </div>
            </div>
          </div>

          <div className={classes.statsCard}>
            <div className={classes.statsCardContent}>
              <i className={`pi pi-bookmark ${classes.statsIcon}`} />
              <div className={classes.statsInfo}>
                <h3 className={classes.statsValue}>
                  {bookmarks.length}
                </h3>
                <p className={classes.statsLabel}>
                  รายการที่บันทึก
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className={classes.sectionTitle}>
          <i className="pi pi-user" />
          รายละเอียดบัญชี
        </h3>

        <div className={classes.accountDetails}>
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>Username</div>
            <div className={classes.detailValue}>{user.username}</div>
          </div>
          
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>รหัสผู้ใช้</div>
            <div className={classes.detailValue}>{user.id}</div>
          </div>
          
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>วันที่สร้างบัญชี</div>
            <div className={classes.detailValue}>
              {new Date(user.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
        </div>

        <h3 className={classes.sectionTitle}>
          <i className="pi pi-bookmark" />
          รายการที่บันทึกไว้
        </h3>

        {bookmarks.length === 0 ? (
          <div className={classes.emptyState}>
            <i className="pi pi-bookmark classes.emptyIcon" />
            <p>ยังไม่มีรายการที่บันทึกไว้</p>
          </div>
        ) : (
          <div className={classes.savedItemsGrid}>
            {bookmarks.map((item) => (
              <div key={item.id} className={classes.savedItemCard}>
                <img
                  src={item.imageUrl || '/placeholder-image.png'}
                  alt={item.title}
                  className={classes.cardImage}
                />
                <div className={classes.cardContent}>
                  <h4 className={classes.cardTitle}>{item.title}</h4>
                  {item.description && (
                    <p className={classes.cardDescription}>{item.description}</p>
                  )}
                </div>
                <div className={classes.cardFooter}>
                  <div className={classes.cardDate}>
                    {new Date(item.createdAt).toLocaleDateString('th-TH')}
                  </div>
                  <div className={classes.cardActions}>
                    <Button
                      icon="pi pi-eye"
                      className="p-button-text"
                      onClick={() => navigate(`/resource/${item.id}`)}
                      tooltip="ดูรายละเอียด"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() => removeBookmark(item.id)}
                      tooltip="เลิกบันทึก"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;