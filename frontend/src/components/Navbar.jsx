// src/components/Navbar.jsx
import { Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // 1. เพิ่ม useLocation

const Navbar = () => {
  const location = useLocation(); // 2. ดึงข้อมูลว่าตอนนี้อยู่หน้าไหน

  // ฟังก์ชันเช็คว่า ถ้าเป็นหน้านี้ ให้เอาสไตล์ปุ่มสีขาวไปใส่
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-white/20 px-6 py-1 rounded-full backdrop-blur-md text-white font-bold shadow-lg shadow-white/10" // สไตล์ตอน Active (อยู่หน้านั้น)
      : "text-gray-300 hover:text-white transition-colors px-6 py-1"; // สไตล์ตอนปกติ
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white">
      {/* Search Bar */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 w-64 border border-white/20">
        <Search size={20} className="text-gray-300 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-white w-full placeholder-gray-300"
        />
      </div>

      {/* Menu Links (แก้ตรงนี้) */}
      <div className="flex items-center gap-4 text-lg font-medium">
        
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          Home
        </Link>
        
        <Link to="/roadmap" className={getLinkClass('/roadmap')}>
          Roadmap
        </Link>
        
        <a href="#" className="text-gray-300 hover:text-white px-6 py-1">คำนวณเกรด</a>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
        <div className="bg-gray-400 rounded-full p-1">
          <User size={20} className="text-white" />
        </div>
        <span>Mr.X</span>
      </div>
    </nav>
  );
};

export default Navbar;