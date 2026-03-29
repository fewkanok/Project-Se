// src/components/Navbar.jsx
import { User, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'; 
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
    };

    const syncFromDatabase = async () => {
      const session = JSON.parse(localStorage.getItem('active_session'));
      if (session?.id) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`);
          if (res.data?.profileData) {
            const freshData = res.data.profileData;
            setProfile(freshData);
            localStorage.setItem('userProfile', JSON.stringify(freshData));
          }
        } catch (e) {
          console.log("Sync failed");
        }
      }
    };

    loadProfile();
    syncFromDatabase();
  }, [location.pathname]);

  // 🛡️ รวบรวมข้อมูลที่จะแสดง
  const userData = {
    name: profile?.basicInfo?.name || profile?.name || 'New Survivor',
    studentId: profile?.basicInfo?.studentId || 'ID: -',
    image: profile?.basicInfo?.image || null,
    role: profile?.role || 'Student'
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white relative z-[100]">
      
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center gap-3 group select-none">
        <div className="bg-gradient-to-tr from-orange-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
            <Terminal size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-black tracking-tight hidden md:block">
            CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">ต้องรอด</span>
        </h1>
      </Link>

      {/* Menu Links */}
      <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
        {[
          { path: '/dashboard', label: 'Home' },
          { path: '/roadmap', label: 'Roadmap' },
          { path: '/grade-calculator', label: 'Grade' }, 
          { path: '/setup', label: 'Setup' }, 
        ].map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all ${
              location.pathname === link.path ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {location.pathname === link.path && (
              <motion.span layoutId="active-pill" className="absolute inset-0 bg-white/20 rounded-full border border-white/10 -z-10" />
            )}
            {link.label}
          </Link>
        ))}
      </div>

      {/* ✅ Profile Section: ชื่อ | Student ID | Role */}
      <div 
        className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl pl-2 pr-4 py-1.5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer shadow-xl"
        onClick={() => window.location.href='/setup'}
      >
        {/* รูปโปรไฟล์ */}
        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0">
          {userData.image ? (
            <img src={userData.image} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <User size={18} className="text-slate-400" />
          )}
        </div>

        {/* ข้อมูล 3 บรรทัดตามสั่ง */}
        <div className="flex flex-col justify-center hidden sm:flex min-w-[80px]">
          <span className="font-black text-[11px] leading-tight text-white uppercase truncate">
            {userData.name}
          </span>
          <span className="text-[9px] leading-tight text-slate-400 font-mono font-bold">
            {userData.studentId}
          </span>
          <span className="text-[8px] leading-tight text-orange-400 font-black uppercase tracking-tighter mt-0.5">
            {userData.role}
          </span>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;