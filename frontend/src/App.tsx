import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage';
import Navigation from './components/Navigation';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          {/* <Route path="/offering/:courseId" element={<OfferingManagementPage />} /> */}
          {/* <Route path="/tas" element={<TAsPage />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
