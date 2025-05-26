import { useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Divider } from "primereact/divider";
import { User } from "../types/user";

interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
  color: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
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
      label: 'อัพโหลดรูปภาพ', 
      icon: 'pi pi-upload', 
      action: () => navigate('/upload'),
      color: '#4CAF50'
    },
    { 
      label: 'จัดการรูปภาพ', 
      icon: 'pi pi-images', 
      action: () => navigate('/images'),
      color: '#2196F3'
    },
    { 
      label: 'ออกจากระบบ', 
      icon: 'pi pi-sign-out', 
      action: logout,
      color: '#f44336'
    }
  ];

  return (
    <div className="profile-container" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "3rem 1rem",
      background: "linear-gradient(135deg, #f6f7fb 0%, #f0f4f8 100%)",
      minHeight: "calc(100vh - 64px)",
      fontFamily: "'Sarabun', sans-serif"
    }}>
      <div style={{
        width: 320,
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem 1.5rem",
        marginRight: "2rem"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 140,
            height: 140,
            margin: "0 auto 1rem auto",
            position: "relative"
          }}>
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #fff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
              }}
            />
            {user.role === 'admin' && (
              <div style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#ff5722",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(255,87,34,0.3)"
              }}>
                Admin
              </div>
            )}
          </div>
          
          <h2 style={{ 
            margin: "0 0 0.5rem 0",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1a237e"
          }}>
            {user.fullName}
          </h2>
          
          <div style={{
            color: "#666",
            fontSize: "0.9rem",
            marginBottom: "1rem"
          }}>
            {user.department}
          </div>
        </div>

        <Divider />

        {/* Quick Actions */}
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{
            fontSize: "0.9rem",
            color: "#666",
            fontWeight: 600,
            marginBottom: "1rem",
            textTransform: "uppercase"
          }}>
            Quick Actions
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                label={action.label}
                icon={action.icon}
                onClick={action.action}
                className="p-button-outlined"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  color: action.color,
                  borderColor: action.color,
                  transition: "all 0.2s ease"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Details & Stats */}
      <div style={{
        flex: 1,
        maxWidth: 800,
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem"
      }}>
        <h2 style={{
          margin: "0 0 1.5rem 0",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#1a237e"
        }}>
          ข้อมูลผู้ใช้
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <Card className="stats-card">
            <div style={{ textAlign: "center" }}>
              <i className="pi pi-images" style={{ 
                fontSize: "2rem",
                color: "#2196F3",
                marginBottom: "0.5rem"
              }}></i>
              <h3 style={{ 
                margin: "0.5rem 0",
                color: "#333",
                fontSize: "1.75rem"
              }}>
                {user.stats?.uploadCount || 0}
              </h3>
              <p style={{ 
                margin: 0,
                color: "#666",
                fontSize: "0.9rem"
              }}>
                รูปภาพที่อัพโหลด
              </p>
            </div>
          </Card>

          <Card className="stats-card">
            <div style={{ textAlign: "center" }}>
              <i className="pi pi-download" style={{ 
                fontSize: "2rem",
                color: "#4CAF50",
                marginBottom: "0.5rem"
              }}></i>
              <h3 style={{ 
                margin: "0.5rem 0",
                color: "#333",
                fontSize: "1.75rem"
              }}>
                {user.stats?.downloadCount || 0}
              </h3>
              <p style={{ 
                margin: 0,
                color: "#666",
                fontSize: "0.9rem"
              }}>
                การดาวน์โหลด
              </p>
            </div>
          </Card>
        </div>

        <Divider />

        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{
            fontSize: "1rem",
            color: "#666",
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
      </div>
    </div>
  );
};

export default Profile;