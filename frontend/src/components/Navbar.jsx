// src/components/Navbar.jsx
import { Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  // ดึงชื่อจาก LocalStorage มาแสดง (ถ้ามี) ถ้าไม่มีใช้ 'Guest'
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Guest' };

  const navLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/roadmap', label: 'Roadmap' },
    // ✅ แก้ไข 1: ใส่ Path จริงสำหรับหน้าคำนวณเกรด (ต้องตรงกับ App.jsx)
    { path: '/grade-calculator', label: 'คำนวณเกรด' }, 
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white">
      
      {/* Settings Button */}
      <Link 
        to="/setup" // ✅ แก้ไข 2: เปลี่ยนลิงก์ไปหน้า Setup Profile
        className="flex items-center gap-2 group cursor-pointer"
        title="Go to Setup Profile"
      >
        <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300">
             <Settings size={20} className="text-gray-300 group-hover:text-white group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <span className="text-sm text-gray-400 group-hover:text-white font-medium transition-colors hidden md:block">
            Setup
        </span>
      </Link>

      {/* Menu Links (Smooth Pill) */}
      <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
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
        <span className="font-medium text-sm truncate max-w-[100px]">
            {userProfile.name}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;