import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import backgroundImage from '../assets/sso-bg.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);
  const [hoverLink1, setHoverLink1] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(username, password);
      alert("เข้าสู่ระบบสำเร็จ");
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#0d1536' }}>
          Khon Kaen University
        </h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2rem' }}>
          One account for all apps.
        </p>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '5px' }}>
              Username
            </label>
            <input
              type="text"
              placeholder="ผู้ใช้ / username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '14px', color: '#555', display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="รหัสผ่าน / password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: hoverBtn ? '#004ecc' : '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1rem',
              transition: 'background-color 0.3s ease',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'Sign in'}
          </button>
        </form>

        <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

        <div style={{ textAlign: 'center', fontSize: '13px' }}>
          <a
            href="https://pdp.kku.ac.th/policy/680656708694016000?lang=th"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoverLink(true)}
            onMouseLeave={() => setHoverLink(false)}
            style={{
              marginRight: '1rem',
              textDecoration: 'none',
              color: hoverLink ? '#004ecc' : '#0066ff',
              transition: 'color 0.3s ease',
            }}
          >
            Privacy Policy
          </a>
          
          <a
            href="https://ssonext.kku.ac.th/support"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoverLink1(true)}
            onMouseLeave={() => setHoverLink1(false)}
            style={{
              marginLeft: '1rem',
              textDecoration: 'none',
              color: hoverLink1 ? '#004ecc' : '#0066ff',
              transition: 'color 0.3s ease',
            }}
          >
            Help
          </a>
        </div>

        <p style={{ 
          textAlign: 'center', 
          fontSize: '11px', 
          color: '#999', 
          marginTop: '1.5rem',
          lineHeight: '1.5'
        }}>
          © {new Date().getFullYear()} Office of Digital Technology, 
          <br />Khon Kaen University
        </p>
      </div>
    </div>
  );
};

export default Login;