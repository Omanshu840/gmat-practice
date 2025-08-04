import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LessonDetail from './pages/LessonDetail';
import TestList from './pages/TestList';
import TestAttempt from './pages/TestAttempt';
import TestSummary from './pages/TestSummary';
import './App.css';
import { BASE_URL } from './services/utils';
import Bookmarks from './pages/Bookmarks';
import AuthProvider, { useAuth } from './context/AuthProvider';
import Login from './pages/Login';

// Protected Layout
const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`${BASE_URL}/login`} replace />;
  }

  return (
    <div className="App">
      <Navigation />
      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  );
};

// Public Layout
const PublicLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to={`${BASE_URL}/`} replace />;
  }

  return <Outlet />;
};

// App Content with nested routes
const AppContent = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path={`${BASE_URL}/login`} element={<Login />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path={`${BASE_URL}/`} element={<Home />} />
        <Route path={`${BASE_URL}/lesson/:section/:chapterId/:topicId`} element={<LessonDetail />} />
        <Route path={`${BASE_URL}/tests/:section`} element={<TestList />} />
        <Route path={`${BASE_URL}/tests/:section/:chapterId/:difficulty/:testId`} element={<TestAttempt />} />
        <Route path={`${BASE_URL}/test-summary/:section/:chapterId/:difficulty/:testId`} element={<TestSummary />} />
        <Route path={`${BASE_URL}/bookmarks`} element={<Bookmarks />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to={`${BASE_URL}/`} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
