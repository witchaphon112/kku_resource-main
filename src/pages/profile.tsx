import { useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Divider } from "primereact/divider";


const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ใช้ useEffect สำหรับ redirect
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "3rem 1rem",
        background: "#f4f6fb",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 320,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "2rem 1.5rem",
          marginRight: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={user.profileImage || "/default-avatar.png"}
          alt="Profile"
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 24,
          }}
        />
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
              {user.fullName}
              <span style={{ background: "rgb(255 212 196)", color: "rgb(145 47 4)", fontSize: 12, borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
            <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
              แผนก: {user.department}
            </div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
              สร้างบัญชีเมื่อ: {new Date(user.createdAt).toLocaleDateString("th-TH")}
            </div>
          </div>
        </div>
      </div>
      
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          minWidth: 340,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: "#222" }}>{user.fullName}</h2>
          <span style={{ color: "#888", fontSize: 16, marginLeft: 12 }}>
            <i className="pi pi-users" style={{ marginRight: 4 }} />
            {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
          </span>
        </div>
        <div style={{fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
          แผนก: {user.department}
        </div>
        <Divider />
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: "#888", fontSize: 13, marginBottom: 8 }}>ข้อมูลบัญชี</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem 3rem", fontSize: 15 }}>
            <div>
              <div style={{ color: "#888", fontWeight: 500 }}>Username:</div>
              <div>{user.username}</div>
            </div>
            <div>
              <div style={{ color: "#888", fontWeight: 500 }}>รหัสผู้ใช้:</div>
              <div>{user.id}</div>
            </div>
            <div>
              <div style={{ color: "#888", fontWeight: 500 }}>วันที่สร้าง:</div>
              <div>{new Date(user.createdAt).toLocaleDateString("th-TH")}</div>
            </div>
          </div>
        </div>
        <Divider />
      </div>
    </div>
  );
};

export default Profile;