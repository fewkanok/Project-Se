// src/pages/Dashboard.jsx
import { PlayCircle } from 'lucide-react';

// Mock Data สำหรับการ์ดวิชาด้านล่างขวา
const courses = [
  { id: 1, title: 'NUMERICAL', sub: 'studycode : 2412', rank: 'B+', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60' },
  { id: 2, title: 'Data Structures', sub: 'studycode : 2555', rank: 'B+', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&auto=format&fit=crop&q=60' },
  { id: 3, title: 'Algorithm', sub: 'studycode : 2666', rank: 'B+', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60' },
  { id: 4, title: 'Structure Prog', sub: 'studycode : 2777', rank: 'B+', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60' },
];

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      
      {/* --- COLUMN ซ้าย (1 ส่วน) --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Card: Profile รูปคน */}
        <div className="relative rounded-3xl overflow-hidden h-80 border border-white/20 shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-md p-4 border-t border-white/10">
            <p className="text-gray-300 text-xs">จัดทำโดย</p>
            <h3 className="text-white font-bold">Name : Krisada Sangsuk</h3>
            <p className="text-gray-400 text-sm">Role : UX/UI</p>
            <PlayCircle className="absolute right-4 bottom-4 text-white w-8 h-8 cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* Card: Comment */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 flex-1 text-white">
          <h3 className="flex items-center gap-2 text-xl mb-4"><span className="text-2xl">💬</span> comment</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-400/50 shrink-0"></div>
                <div className="text-xs text-gray-300 bg-white/5 p-2 rounded-lg">
                  ฟังก์ชันการคำนวณเกรดยังมีบั๊กนิดหน่อยครับ ฝากเช็คด้วย
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- COLUMN ขวา (3 ส่วน) --- */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Banner: CS - RoadMap */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-64 relative overflow-hidden flex items-center justify-between">
          <div className="z-10 text-white max-w-md">
             {/* ตกแต่งกราฟิกพื้นหลัง */}
             <div className="absolute top-0 right-0 opacity-10 text-9xl font-bold select-none">CS</div>
             
             <h1 className="text-4xl font-bold mb-2">cs - RoadMap</h1>
             <p className="text-gray-300 mb-6">cs ต้องรอด</p>
             <div className="flex gap-4">
               <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">RoadMap</button>
               <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white/10 transition">SINE IN</button>
             </div>
          </div>
          <div className="hidden md:block text-6xl font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-20 tracking-widest">
            ROADMAP
          </div>
        </div>

        {/* Grid: วิชาเรียน (Cards ด้านล่าง) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {courses.map((course) => (
            <div key={course.id} className="relative rounded-3xl overflow-hidden group h-60 border border-white/10 shadow-lg">
              {/* Image BG */}
              <img src={course.img} alt={course.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs w-max mb-2 border border-white/10">
                  {course.title}
                </span>
                <p className="text-xs text-gray-300">{course.sub}</p>
                <p className="text-sm">ความยาก : <span className="text-red-300">ยากแบบปัญญาอ่อน</span></p>
                <p className="text-sm">reke : {course.rank}</p>
                
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs text-gray-400 cursor-pointer hover:text-white">see more..</span>
                  <PlayCircle className="w-8 h-8 text-white cursor-pointer hover:scale-110 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;