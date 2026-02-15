// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // 1. นำเข้า Footer

const MainLayout = () => {
  return (
    // Wrapper หลัก ใส่ Background Image
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80')] bg-cover bg-center bg-fixed font-sans">
      
      {/* Overlay สีดำจางๆ + จัด Layout แบบ Flex Column */}
      <div className="min-h-screen bg-black/30 backdrop-blur-sm flex flex-col">
        
        <Navbar />

        {/* 2. ส่วน Main Content 
            เพิ่ม className="flex-grow" เพื่อดัน Footer ลงไปล่างสุดถ้าเนื้อหาน้อย
        */}
        <main className="container mx-auto pb-8 flex-grow px-4 md:px-0">
          <Outlet />
        </main>

        {/* 3. วาง Footer ไว้ตรงนี้ (อยู่นอก container เพื่อให้เต็มความกว้าง) */}
        <Footer />
        
      </div>
    </div>
  );
};

export default MainLayout;