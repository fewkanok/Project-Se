// src/components/Navbar.jsx
import { Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // 1. import motion

const Navbar = () => {
  const location = useLocation();

  // สร้างรายการเมนูไว้ใน Array เพื่อให้จัดการง่ายและวนลูปแสดงผล
  const navLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '#', label: 'คำนวณเกรด' }, // ถ้าเป็นลิงก์หลอกๆ ใส่ path เป็น # ไปก่อน
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white">
      {/* Search Bar */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 w-64 border border-white/20 transition-all focus-within:bg-white/20 focus-within:w-72 duration-300">
        <Search size={20} className="text-gray-300 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-white w-full placeholder-gray-300"
        />
      </div>

      {/* Menu Links (ส่วนที่แก้ให้ Smooth) */}
      <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {/* พื้นหลังสีขาวที่จะวิ่งไปมา (Sliding Pill) */}
              {isActive && (
                <motion.span
                  layoutId="active-pill" // สำคัญมาก! ชื่อต้องเหมือนกัน
                  className="absolute inset-0 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} // ตั้งค่าความเด้งดึ๋ง
                />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300">
        <div className="bg-gray-400 rounded-full p-1">
          <User size={20} className="text-white" />
        </div>
        <span className="font-medium">Mr.X</span>
      </div>
    </nav>
  );
};

export default Navbar;