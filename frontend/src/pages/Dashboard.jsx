import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, LogOut, Settings } from 'lucide-react';
import { roadmapData } from '../data/courses'; // เช็คว่า path นี้ถูกต้องนะครับ

const Dashboard = () => {
  const navigate = useNavigate();

  // --- 1. Load Data ---
  const [profile] = useState(() => {
    try {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : null; // ถ้าไม่มีข้อมูล ให้เป็น null ไปก่อน
    } catch (e) {
        return null;
    }
  });

  // ถ้าไม่มี Profile (เช่น โหลดหน้ามาแล้วว่างเปล่า) ให้เด้งไป Setup หรือ Login
  if (!profile) {
      // return null หรือ Redirect อัตโนมัติก็ได้ แต่ในที่นี้จะแสดงหน้า error เบาๆ
      return (
          <div className="h-screen flex flex-col items-center justify-center text-white gap-4">
              <h2 className="text-2xl font-bold">ไม่พบข้อมูลผู้ใช้</h2>
              <button 
                onClick={() => navigate('/setup')} 
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                ไปหน้า Setup Profile
              </button>
          </div>
      );
  }

  // --- 2. Calculation Logic ---
  const stats = useMemo(() => {
    let totalCredits = 0;
    let earnedCredits = 0;
    let activeCoursesList = [];
    let calculatedGPAX = 0;
    let totalGPASum = 0;
    let gpaCount = 0;
    let graphData = [];

    // เช็คว่ามี roadmapData ไหม เพื่อกัน error จอดำ
    if (roadmapData) {
        roadmapData.forEach((yearGroup, yIdx) => {
            const yearNum = yIdx + 1;
            yearGroup.semesters.forEach((sem, sIdx) => {
                const termNum = sIdx + 1;
                
                // Active Courses
                if (profile.currentYear === yearNum && profile.currentTerm === termNum) {
                    activeCoursesList = sem.courses.map(c => ({...c, termLabel: sem.term}));
                }

                // Credits
                sem.courses.forEach(course => {
                    totalCredits += course.credits;
                    if (profile.passedCourses?.includes(course.id)) {
                        earnedCredits += course.credits;
                    }
                });

                // Graph Data
                if (profile.gpaHistory && profile.gpaHistory[sem.term]) {
                    const gpaVal = parseFloat(profile.gpaHistory[sem.term]);
                    if (!isNaN(gpaVal)) {
                        totalGPASum += gpaVal;
                        gpaCount++;
                        graphData.push({
                            term: `Y${yearNum}/${termNum}`,
                            gpa: gpaVal.toFixed(2),
                            height: `${(gpaVal / 4) * 100}%`
                        });
                    }
                }
            });
        });
    }

    if (gpaCount > 0) calculatedGPAX = (totalGPASum / gpaCount).toFixed(2);
    const progressPercent = totalCredits > 0 ? Math.round((earnedCredits / totalCredits) * 100) : 0;

    return { totalCredits, earnedCredits, activeCoursesList, calculatedGPAX, graphData, progressPercent };
  }, [profile]);

  // --- 3. Handlers (แก้ Link ให้ตรง App.js) ---
  
  const handleLogout = () => {
      if(window.confirm('ต้องการออกจากระบบหรือไม่?')) {
          localStorage.removeItem('userProfile'); 
          // ★★★ สั่งไปหน้า Login โดยตรง ★★★
          navigate('/login'); 
      }
  };

  const handleEditSetup = () => {
      // ★★★ สั่งไปหน้า Setup โดยตรง ★★★
      navigate('/setup'); 
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-full text-white pb-24">
      
      {/* --- COLUMN LEFT --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="relative rounded-3xl overflow-hidden h-[450px] border border-white/20 shadow-2xl group transition-all duration-300">
            <img 
                src={profile.image || 'https://via.placeholder.com/500'} 
                alt="Profile" 
                className="w-full h-full object-cover transition duration-500 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
            <div className="absolute bottom-0 w-full p-6 flex flex-col gap-2 z-20">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold w-max mb-2 backdrop-blur-md animate-pulse">
                    ● Active Student
                </div>
                
                <div className="mb-1">
                    <h2 className="text-3xl font-black block truncate" title={profile.name}>
                        {profile.name || 'Your Name'}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">ID:</span>
                    <span className="text-gray-300 text-sm font-mono">
                        {profile.studentId || '-'}
                    </span>
                </div>

                <span className="text-blue-300 font-medium mt-1 block">
                    {profile.major || 'Computer Science'}
                </span>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                  <span>CS Dept.</span>
                  <span className="flex items-center gap-1 text-white font-bold">
                      <Zap size={14} className="text-yellow-400 fill-yellow-400"/> 
                      Year {profile.currentYear} / {profile.currentTerm}
                  </span>
                </div>
            </div>
        </div>

        {/* Advisor Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-500/30 shrink-0">
            <Award size={24} />
          </div>
          <div className="w-full overflow-hidden">
            <p className="text-xs text-gray-400 mb-1">Advisor</p>
            {/* ★★★ สีจางลง (Blended) ตามที่ขอ ★★★ */}
            <p className="font-medium text-sm text-white/50 truncate">
                {profile.advisor || 'Pending Assignment'}
            </p>
          </div>
        </div>

        {/* Logout Button (อยู่ล่างสุดของ Sidebar) */}
        <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-3xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all flex items-center justify-center gap-2 font-bold group cursor-pointer"
        >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/>
            Reset & Logout
        </button>

      </div>

      {/* --- COLUMN RIGHT --- */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition"></div>
                <div>
                    <p className="text-emerald-400 font-medium flex items-center gap-2 mb-1"><TrendingUp size={18}/> GPAX</p>
                    <h3 className="text-5xl font-black text-white">{stats.calculatedGPAX}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-4">Calculated from history</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>
                <div>
                    <p className="text-blue-400 font-medium flex items-center gap-2 mb-1"><BookOpen size={18}/> Credits Earned</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-white">{stats.earnedCredits}</h3>
                        <span className="text-gray-500">/ {stats.totalCredits}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.progressPercent}%` }}></div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition"></div>
                <div>
                    <p className="text-purple-400 font-medium flex items-center gap-2 mb-1"><Clock size={18}/> Internship</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-white">{profile.passedCourses.includes('INTERNSHIP') ? '240' : '0'}</h3>
                        <span className="text-gray-500">/ 240 Hrs</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Required for Year 4</p>
            </div>
        </div>

        {/* Graph & Active Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Graph */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2"><BarChartIcon /> Academic Performance</h3>
                </div>
                
                <div className="flex-1 flex items-end justify-between gap-4 px-4 h-48 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 z-0">
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                    </div>
                    
                    {stats.graphData.length > 0 ? (
                        stats.graphData.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group w-full z-10">
                                <div className="w-full md:w-16 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-xl relative transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom shadow-[0_0_15px_rgba(34,211,238,0.3)]" style={{ height: item.height }}>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                        {item.gpa}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-400 font-mono font-bold">{item.term}</span>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 italic">
                            No GPA data available
                        </div>
                    )}
                </div>
            </div>

            {/* Now Learning */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Calendar className="text-orange-400"/> Now Learning
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[300px]">
                    {stats.activeCoursesList.length > 0 ? (
                        stats.activeCoursesList.map((course) => (
                            <div key={course.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition cursor-pointer group hover:bg-white/10">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{course.code}</span>
                                    <PlayCircle size={16} className="text-gray-500 group-hover:text-cyan-400 transition"/>
                                </div>
                                <h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-cyan-200 transition">{course.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{course.credits} Credits</p>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle size={32} className="mb-2 opacity-50"/>
                            <p className="text-sm">No active courses for Year {profile.currentYear}/{profile.currentTerm}</p>
                        </div>
                    )}
                </div>
                
                {/* ปุ่ม Edit / Setup */}
                <button 
                    onClick={handleEditSetup} 
                    className="mt-4 w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white uppercase tracking-wider"
                >
                    <Settings size={14} />
                    Back to Setup / Edit
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon
const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
);

export default Dashboard;