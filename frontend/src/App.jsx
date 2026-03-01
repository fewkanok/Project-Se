import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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

// ✅ 1. Import AdminDashboard เข้ามา
import AdminDashboard from './pages/AdminDashboard';

// const ProtectedRoute = () => {
//   const user = localStorage.getItem('userProfile');
//   return user ? <Outlet /> : <Navigate to="/login" replace />;
// };
const ProtectedRoute = () => {
  // เปลี่ยนมาใช้ 'active_session' ให้ตรงกับที่เก็บใน Login.jsx
  const user = localStorage.getItem('active_session'); 
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const navigateRef = useRef(null);

  // ฟังก์ชันล้างข้อมูลเมื่อหมดเวลา
  const handleAutoLogout = () => {
    localStorage.removeItem('active_session');
    localStorage.removeItem('token');
    alert("เซสชันหมดอายุเนื่องจากไม่มีการใช้งานนานเกิน 30 นาที");
    window.location.href = "/login"; // ใช้ window.location เพื่อรีเฟรชสถานะทั้งหมด
  };

  useEffect(() => {
    let timeout;
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 นาที

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(handleAutoLogout, TIMEOUT_MS);
    };

    // ตรวจสอบการขยับเมาส์หรือพิมพ์
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // เริ่มนับถอยหลังครั้งแรก

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeout) clearTimeout(timeout);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ✅ 2. เพิ่ม Route สำหรับ Admin (วางไว้นอก MainLayout เพราะมีดีไซน์ของตัวเอง) */}
        <Route path="/admin"    element={<AdminDashboard />} />
        <Route path="/setup"    element={<SetupProfile />} />
  
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/roadmap"           element={<Roadmap />} />
            <Route path="/grade-calculator"  element={<GradeCalculator />} />
            <Route path="/course/:id"        element={<CourseDetail />} />
            <Route path="/coop"              element={<CoopEligibilityModal />} />
            <Route path="/academic-criteria" element={<AcademicCriteriaPage />} />
            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;