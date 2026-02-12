// src/components/Navbar.jsx
import { User, Terminal } from 'lucide-react'; // ✅ เปลี่ยน Settings เป็น Terminal เพื่อใช้ทำ Logo
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  // ดึงชื่อจาก LocalStorage มาแสดง (ถ้ามี) ถ้าไม่มีใช้ 'Guest'
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Guest' };

  const navLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/grade-calculator', label: 'คำนวณเกรด' }, 
    // ✅ ย้าย: Setup มาอยู่ตรงนี้ (หลังคำนวณเกรด)
    { path: '/setup', label: 'Setup' }, 
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white">
      
      {/* ✅ แก้ไข: เปลี่ยนปุ่ม Setup เดิม เป็น Logo "CS ต้องรอด" */}
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

      {/* Profile */}
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full pl-2 pr-4 py-1.5 border border-white/20 cursor-default hover:bg-white/20 transition-all duration-300">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5 shadow-inner">
          <User size={18} className="text-white" />
        </div>
        <span className="font-medium text-sm truncate max-w-[100px] hidden md:block">
            {userProfile.name}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;