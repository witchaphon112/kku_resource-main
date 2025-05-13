// src/pages/Profile.tsx
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Divider } from "primereact/divider";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '80vh',
      backgroundColor: '#f4f6fb'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          padding: '2rem',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <img
          src={user.profileImage || "/default-avatar.png"}
          alt="Profile"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1.5rem',
            border: '4px solid #6366F1'
          }}
        />
        <h2 style={{ margin: '0 0 0.5rem', color: '#333' }}>{user.fullName}</h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          {user.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป'}
        </p>

        <Divider />

        <div style={{ textAlign: 'left', marginBottom: '2rem', lineHeight: '2' }}>
          <p><i className="pi pi-user" style={{ marginRight: '0.5rem' }}></i><strong>Username:</strong> {user.username}</p>
          <p><i className="pi pi-id-card" style={{ marginRight: '0.5rem' }}></i><strong>Full Name:</strong> {user.fullName}</p>
          <p><i className="pi pi-building" style={{ marginRight: '0.5rem' }}></i><strong>Department:</strong> {user.department}</p>
          <p><i className="pi pi-calendar" style={{ marginRight: '0.5rem' }}></i><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <Button
          label="ออกจากระบบ"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={() => {
            logout();
            navigate("/");
          }}
        />
      </Card>
    </div>
  );
};

export default Profile;
