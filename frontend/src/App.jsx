import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar ตัวอย่าง (สามารถแยกไปอยู่ใน layouts/ ได้) */}
        <nav className="bg-white shadow-md p-4 mb-6">
          <div className="container mx-auto flex gap-4">
            <Link to="/" className="text-blue-600 font-bold">CS-System</Link>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
            <Link to="/register" className="hover:text-blue-500">Register</Link>
          </div>
        </nav>

        {/* ส่วนแสดงผลแต่ละหน้า */}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<h1 className="text-2xl font-bold">ยินดีต้อนรับสู่ระบบจัดการเกรด</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;