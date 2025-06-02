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
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "6rem 1rem",
    background: "#f8f9fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "'Sarabun', sans-serif"
  },
  sidebar: {
    width: 320,
    background: SECONDARY_COLOR,
    borderRadius: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "2rem 1.5rem",
    marginRight: "2rem",
    border: `1px solid ${BORDER_COLOR}`
  },
  profileSection: {
    textAlign: "center",
    marginBottom: "1.5rem"
  },
  avatarContainer: {
    width: 140,
    height: 140,
    margin: "0 auto 1rem auto",
    position: "relative"
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
  userName: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: PRIMARY_COLOR
  },
  userDepartment: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  },
  divider: {
    borderTop: `1px solid ${BORDER_COLOR}`
  },
  quickActionsSection: {
    marginTop: "1.5rem"
  },
  quickActionsTitle: {
    fontSize: "0.9rem",
    color: PRIMARY_COLOR,
    fontWeight: 600,
    marginBottom: "1rem",
    textTransform: "uppercase"
  },
  quickActionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  actionButton: {
    '&.p-button-outlined': {
      width: "100%",
      justifyContent: "flex-start",
      color: `${PRIMARY_COLOR} !important`,
      borderColor: `${BORDER_COLOR} !important`,
      transition: "all 0.2s ease",
      fontWeight: 600
    }
  },
  mainContent: {
    flex: 1,
    maxWidth: 800,
    background: SECONDARY_COLOR,
    borderRadius: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "2rem",
    border: `1px solid ${BORDER_COLOR}`
  },
  mainTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: PRIMARY_COLOR
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem"
  },
  statsCard: {
    background: SECONDARY_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
    }
  },
  statsCardContent: {
    textAlign: "center"
  },
  statsIcon: {
    fontSize: "2rem",
    color: PRIMARY_COLOR,
    marginBottom: "0.5rem"
  },
  statsValue: {
    margin: "0.5rem 0",
    color: PRIMARY_COLOR,
    fontSize: "1.75rem"
  },
  statsLabel: {
    margin: 0,
    color: "#666",
    fontSize: "0.9rem"
  },
  removeButton: {
    '&.p-button.p-button-text.p-button-danger': {
      padding: '0.5rem !important',
      color: `${DANGER_COLOR} !important`,
      transition: 'all 0.2s ease !important',
      border: 'none !important',
      background: 'transparent !important',
      '& .p-button-icon': {
        color: `${DANGER_COLOR} !important`,
        fontSize: '1.2rem !important'
      },
      '&:enabled:hover': {
        background: 'rgba(220, 53, 69, 0.12) !important',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(220, 53, 69, 0.15)',
        '& .p-button-icon': {
          color: `${DANGER_COLOR} !important`,
          transform: 'scale(1.1)'
        }
      },
      '&:enabled:active': {
        background: 'rgba(220, 53, 69, 0.2) !important',
        transform: 'translateY(0)',
        '& .p-button-icon': {
          transform: 'scale(0.95)'
        }
      }
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
          
          <h2 className={classes.userName}>
            {user.fullName}
          </h2>
          
          <div className={classes.userDepartment}>
            {user.department}
          </div>
        </div>

        <Divider className={classes.divider} />

        <div className={classes.quickActionsSection}>
          <h3 className={classes.quickActionsTitle}>
            Quick Actions
          </h3>
          
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

      <div className={classes.mainContent}>
        <h2 className={classes.mainTitle}>
          ข้อมูลผู้ใช้
        </h2>

        <div className={classes.statsGrid}>
          <Card className={`stats-card ${classes.statsCard}`}>
            <div className={classes.statsCardContent}>
              <i className={`pi pi-download ${classes.statsIcon}`} />
              <h3 className={classes.statsValue}>
                {downloads.length}
              </h3>
              <p className={classes.statsLabel}>
                การดาวน์โหลด
              </p>
            </div>
          </Card>

          <Card className={`stats-card ${classes.statsCard}`}>
            <div className={classes.statsCardContent}>
              <i className={`pi pi-bookmark ${classes.statsIcon}`} />
              <h3 className={classes.statsValue}>
                {bookmarks.length}
              </h3>
              <p className={classes.statsLabel}>
                รายการที่บันทึก
              </p>
            </div>
          </Card>
        </div>

        <Divider style={{ borderTop: `1px solid ${BORDER_COLOR}` }} />

        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{
            fontSize: "1rem",
            color: PRIMARY_COLOR,
            fontWeight: 600,
            marginBottom: "1rem"
          }}>
            รายละเอียดบัญชี
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            fontSize: "0.9rem"
          }}>
            <div>
              <div style={{ color: "#666", marginBottom: "0.25rem" }}>Username</div>
              <div style={{ fontWeight: 600 }}>{user.username}</div>
            </div>
            
            <div>
              <div style={{ color: "#666", marginBottom: "0.25rem" }}>รหัสผู้ใช้</div>
              <div style={{ fontWeight: 600 }}>{user.id}</div>
            </div>
            
            <div>
              <div style={{ color: "#666", marginBottom: "0.25rem" }}>วันที่สร้างบัญชี</div>
              <div style={{ fontWeight: 600 }}>
                {new Date(user.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
            </div>
          </div>
        </div>

        <Divider style={{ borderTop: `1px solid ${BORDER_COLOR}`, margin: "2rem 0" }} />

        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{
            fontSize: "1rem",
            color: PRIMARY_COLOR,
            fontWeight: 600,
            marginBottom: "1rem"
          }}>
            รายการที่บันทึกไว้
          </h3>

          {bookmarks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#666',
              backgroundColor: SECONDARY_COLOR,
              borderRadius: '8px',
              border: `1px solid ${BORDER_COLOR}`
            }}>
              <i className="pi pi-bookmark" style={{ fontSize: '2rem', color: PRIMARY_COLOR, marginBottom: '1rem', display: 'block' }}></i>
              <p style={{ margin: 0 }}>ยังไม่มีรายการที่บันทึกไว้</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
            }}>
              {bookmarks.map((item) => (
                <Card 
                  key={item.id}
                  className="saved-item-card" 
                  style={{ 
                    margin: '0.5rem', 
                    backgroundColor: SECONDARY_COLOR, 
                    border: `1px solid ${BORDER_COLOR}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img 
                        src={item.imageUrl || '/placeholder-image.png'} 
                        alt={item.title} 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: PRIMARY_COLOR,
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {item.type}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: PRIMARY_COLOR,
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p style={{ 
                          margin: '0', 
                          color: '#666',
                          fontSize: '0.9rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        {new Date(item.createdAt).toLocaleDateString('th-TH')}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <Button
                          icon="pi pi-eye"
                          className="p-button-text"
                          style={{
                            padding: '0.5rem',
                            color: PRIMARY_COLOR
                          }}
                          onClick={() => navigate(`/resource/${item.id}`)}
                          tooltip="ดูรายละเอียด"
                        />
                        <Button
                          icon="pi pi-trash"
                          severity="danger"
                          text
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            margin: '0.2rem'
                          }}
                          onClick={() => removeBookmark(item.id)}
                          tooltip="เลิกบันทึก"
                          tooltipOptions={{ position: 'top' }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;