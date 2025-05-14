import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/main-page";
import MainLayout from "./layout/main-layout";
import Login from "./pages/Login";
import Profile from "./pages/profile";
import AdminPage from "./pages/Admin";
import Images from "./pages/images";
import Videos from "./pages/videos"
import Graphics from "./pages/graphics";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import ScrollToTop from "./components/ScrollToTop"; // import ที่สร้างเมื่อครู่

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="images" element={<Images />} />
        <Route path="videos" element={<Videos />} />
        <Route path="graphics" element={<Graphics />} />
        <Route path="/resource/:id" element={<ResourceDetailPage />} />
        <Route
          path="admin"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
