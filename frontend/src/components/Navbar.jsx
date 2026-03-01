// src/components/Navbar.jsx
import { User, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  // ✅ แก้ไข: ดึงข้อมูลจาก active_session (ชื่อที่ได้ตอน Login) หรือ userProfile (ชื่อที่กรอกใน Setup)
  const getDisplayName = () => {
    try {
      const session = JSON.parse(localStorage.getItem('active_session'));
      const profile = JSON.parse(localStorage.getItem('userProfile'));
      
      // ลำดับการเลือกชื่อ: 1. จาก Login Session -> 2. จาก Profile Setup -> 3. ค่าเริ่มต้น
      return session?.name || profile?.basicInfo?.name || profile?.name || 'Survivor';
    } catch (e) {
      return 'Survivor';
    }
  };

  const displayName = getDisplayName();

  const navLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/grade-calculator', label: 'คำนวณเกรด' }, 
    { path: '/setup', label: 'Setup' }, 
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white">
      
      {/* Logo Section */}
      <Link 
        to="/dashboard" 
        className="flex items-center gap-3 group select-none hover:opacity-90 transition-opacity"
      >
        <div className="bg-gradient-to-tr from-orange-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-white hidden md:block">
            CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">ต้องรอด</span>
        </h1>
      </Link>

      {/* Menu Links (Smooth Pill) */}
      <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`relative px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] -z-10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full pl-2 pr-4 py-1.5 border border-white/20 cursor-default hover:bg-white/20 transition-all duration-300">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5 shadow-inner">
          <User size={18} className="text-white" />
        </div>
        <span className="font-medium text-sm truncate max-w-[120px] hidden md:block">
            {/* ✅ แสดงชื่อที่ดึงมาได้ */}
            {displayName}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;