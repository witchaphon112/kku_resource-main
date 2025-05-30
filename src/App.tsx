import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/main-page";
import MainLayout from "./layout/main-layout";
import SearchResult from "./layout/main-layout/SearchResult";
import Login from "./pages/Login";
import AboutPage from "./pages/about";
import TermsPage from "./pages/terms";
import ContactPage from "./pages/contact";
import PrivacyPage from "./pages/privacy-policy";
import Profile from "./pages/profile";
import AdminPage from "./pages/Admin";
import Images from "./pages/images";
import Videos from "./pages/videos"
import Graphics from "./pages/graphics"; 
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import DownloadHistoryPage from "./pages/download-history";
import { DownloadHistoryProvider } from "./contexts/DownloadHistoryContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";


function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="images" element={<Images />} />
        <Route path="videos" element={<Videos />} />
        <Route path="graphics" element={<Graphics />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPage />} /> 
        <Route path="/downloads-history" element={<DownloadHistoryPage />} />
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
  <BrowserRouter basename="/kku_resource-main">    
    <AuthProvider>
      <DownloadHistoryProvider>
        <ScrollToTopButton />
        <ScrollToTop />
        <AppContent />
      </DownloadHistoryProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
