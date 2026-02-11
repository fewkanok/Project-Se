// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // เช็คด้วยว่ามีไฟล์ Navbar หรือยัง

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80')] bg-cover bg-center bg-fixed font-sans">
      <div className="min-h-screen bg-black/30 backdrop-blur-sm">
        <Navbar />
        <main className="container mx-auto pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;