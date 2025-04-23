import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage';
import Navigation from './components/Navigation';
import NotFoundPage from './pages/NotFoundPage';
import ClassManagementPage from './pages/ClassManagementPage';
import TAsPage from './pages/TAsPage';
import ClassReportsPage from './pages/ClassReportsPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/class-management" element={<ClassManagementPage />} />
          {/* <Route path="/offering/:courseId" element={<OfferingManagementPage />} /> */}
          <Route path="/class-reports" element={<ClassReportsPage />} />
          <Route path="/tas" element={<TAsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
