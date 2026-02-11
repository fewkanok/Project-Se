import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register'; // (ถ้ามี)
import SetupProfile from './pages/SetupProfile'; // 1. อย่าลืม Import หน้านี้!
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import CourseDetail from './pages/CourseDetail';

// --- ฟังก์ชันเช็คว่า Login หรือยัง ---
// ถ้าไม่มีข้อมูลใน LocalStorage ให้เตะกลับไปหน้า Login
const ProtectedRoute = () => {
  const user = localStorage.getItem('userProfile');
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (เข้าได้ไม่ต้อง Login) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- Setup Route (กึ่งกลาง) --- */}
        {/* ควรเช็คว่า Login แล้วหรือยัง แต่ในที่นี้ปล่อยให้เข้ามากรอกได้ก่อน */}
        <Route path="/setup" element={<SetupProfile />} />

        {/* --- Protected Routes (ต้อง Login เท่านั้น) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/course/:id" element={<CourseDetail />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;