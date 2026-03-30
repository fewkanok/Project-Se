import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80')] bg-cover bg-center bg-fixed font-sans">
      <div className="min-h-screen bg-black/30 backdrop-blur-sm flex flex-col">
    
        <Navbar />
        <main className="container mx-auto pb-8 flex-grow px-4 md:px-0">
          <Outlet />
        </main>
        <Footer />
        
      </div>
    </div>
  );
};

export default MainLayout;