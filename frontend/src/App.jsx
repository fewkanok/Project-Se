import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- โซน 1: หน้า Public (ไม่มี Navbar) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- โซน 2: หน้า App หลัก (มี Navbar + พื้นหลัง) --- */}
        {/* รวมทุกหน้าที่มี Navbar ไว้ในก้อนนี้ก้อนเดียวครับ */}
        <Route element={<MainLayout />}>
          
          {/* ถ้าเข้า / เฉยๆ ให้เด้งไป Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* หน้า Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* หน้า Roadmap (เพิ่มตรงนี้บรรทัดเดียว จบเลย) */}
          <Route path="/roadmap" element={<Roadmap />} />
          
        </Route>

      </Routes>
    </Router>
  );
}

export default App;