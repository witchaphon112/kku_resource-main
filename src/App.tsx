import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/main-page";
import MainLayout from "./layout/main-layout";
import Login from "./pages/Login";
import Profile from "./pages/profile";
import AdminPage from "./pages/Admin";
import Graphics from "./pages/graphics";
import PageMedical from "./pages/pageimages/medical";
import PageCampus from "./pages/pageimages/campus";
import PageEducation from "./pages/pageimages/education";
import VideoMedical from "./pages/pagevideos/medical";
import VideoCampus from "./pages/pagevideos/campus";
import VideoEducation from "./pages/pagevideos/education";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ResourceDetailPage from "./pages/ResourceDetailPage";

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="graphics" element={<Graphics />} />
        <Route path="/images/medical" element={<PageMedical />} />
        <Route path="/images/campus" element={<PageCampus />} />
        <Route path="/images/education" element={<PageEducation />} />
        <Route path="/videos/medical" element={<VideoMedical />} />
        <Route path="/videos/campus" element={<VideoCampus />} />
        <Route path="/videos/education" element={<VideoEducation />} />
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
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
