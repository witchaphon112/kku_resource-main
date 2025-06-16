import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Component, ReactNode } from "react";
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
import { BookmarkProvider } from "./contexts/BookmarkContext";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import DownloadHistoryPage from "./pages/download-history";
import { DownloadHistoryProvider } from "./contexts/DownloadHistoryContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { ResourceProvider } from './contexts/ResourceContext';
import { ViewProvider } from './contexts/ViewContext';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#666'
        }}>
          <h2>Something went wrong.</h2>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '0.5rem 1rem',
              background: '#3F72AF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/kku_resource-main">    
      <ErrorBoundary>
        <AuthProvider>
          <ResourceProvider>
            <BookmarkProvider>
              <DownloadHistoryProvider>
                <ViewProvider>
                  <ScrollToTopButton />
                  <ScrollToTop />
                  <AppContent />
                </ViewProvider>
              </DownloadHistoryProvider>
            </BookmarkProvider>
          </ResourceProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
