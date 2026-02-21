import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

const ProtectedRoute = () => {
  const user = localStorage.getItem('userProfile');
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
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