import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LessonDetail from './pages/LessonDetail';
import TestList from './pages/TestList';
import TestAttempt from './pages/TestAttempt';
import TestSummary from './pages/TestSummary';
import './App.css';
import { BASE_URL } from './services/utils';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Container className="py-4">
        <Routes>
          <Route path={`${BASE_URL}/`} element={<Home />} />
          <Route path={`${BASE_URL}/lesson/:section/:chapterId/:topicId`} element={<LessonDetail />} />
          <Route path={`${BASE_URL}/tests/:section`} element={<TestList />} />
          <Route path={`${BASE_URL}/tests/:section/:chapterId/:difficulty/:testId`} element={<TestAttempt />} />
          <Route path={`${BASE_URL}/test-summary/:section/:chapterId/:difficulty/:testId`} element={<TestSummary />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;