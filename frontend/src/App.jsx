import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import SetupProfile from './pages/SetupProfile';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import CourseDetail from './pages/CourseDetail';
import GradeCalculator from './pages/GradeCalculator';
import CoopEligibilityModal from './pages/CoopEligibilityModal';
import AcademicCriteriaPage from './pages/Academiccriteriapage';

const ProtectedRoute = () => {
  const user = localStorage.getItem('active_session');
  const lastActive = localStorage.getItem('last_active');
  const EXPIRE_TIME = 30 * 60 * 1000;

  if (user && lastActive) {
    const now = Date.now();
    if (now - parseInt(lastActive) > EXPIRE_TIME) {
      localStorage.clear(); //
      alert("เซสชันหมดอายุเนื่องจากไม่มีการใช้งานนานเกินไป");
      return <Navigate to="/login" replace />;
    }
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {

  useEffect(() => {
    const updateTimestamp = () => {
      if (localStorage.getItem('active_session')) {
        localStorage.setItem('last_active', Date.now().toString());
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateTimestamp));

    updateTimestamp();

    return () => {
      events.forEach(event => window.removeEventListener(event, updateTimestamp));
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🔓 Public Routes: ใครก็เข้าได้ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔒 Protected Routes: ต้อง Login ก่อนเท่านั้น */}
        <Route element={<ProtectedRoute />}>
          
          {/* ✅ Setup ต้อง Login ก่อนถึงจะทำได้ */}
          <Route path="/setup" element={<SetupProfile />} />
          
          {/* 📱 Routes ที่มี Sidebar และ Navbar (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/grade-calculator" element={<GradeCalculator />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/coop" element={<CoopEligibilityModal />} />
            <Route path="/academic-criteria" element={<AcademicCriteriaPage />} />
          </Route>
        </Route>

        {/* 🛸 Fallback: ถ้าเข้า Path มั่ว ให้ส่งกลับไปที่หน้า Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;