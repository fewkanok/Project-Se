import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, LogOut, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { roadmapData } from '../data/courses';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- 1. Load Data ---
  const [profile] = useState(() => {
    try {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
  });

  if (!profile) {
      return (
          <div className="h-screen flex flex-col items-center justify-center text-white gap-4 bg-gray-900">
              <h2 className="text-2xl font-bold">ไม่พบข้อมูลผู้ใช้</h2>
              <button onClick={() => navigate('/setup')} className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                ไปหน้า Setup Profile
              </button>
          </div>
      );
  }

  // --- 2. Calculation Logic (สูตรใหม่: Weighted Average & Fixed Key Access) ---
  const stats = useMemo(() => {
    let totalStructureCredits = 0; // หน่วยกิตทั้งหมดตามหลักสูตร
    let earnedCredits = 0;         // หน่วยกิตที่เก็บได้แล้ว (Passed)
    let activeCoursesList = [];
    
    // ตัวแปรสำหรับคำนวณ GPAX
    let totalPoints = 0;           // ผลรวมของ (เกรด x หน่วยกิต)
    let totalGradedCredits = 0;    // ผลรวมหน่วยกิตที่นำมาคิดเกรด
    let graphData = [];

    const currentYearNum = parseInt(profile.currentYear) || 1;
    const currentTermNum = parseInt(profile.currentTerm) || 1;

    if (roadmapData) {
        roadmapData.forEach((yearGroup, yIdx) => {
            const yearNum = yIdx + 1;
            
            yearGroup.semesters.forEach((sem, sIdx) => {
                const termNum = sIdx + 1;
                
                // 1. หา Active Courses (วิชาที่เรียนอยู่ปัจจุบัน)
                if (yearNum === currentYearNum && termNum === currentTermNum) {
                    activeCoursesList = sem.courses.map(c => ({...c, termLabel: sem.term}));
                }

                // 2. คำนวณหน่วยกิตรวมและหน่วยกิตที่ได้
                let semesterCredits = 0; // หน่วยกิตรวมเฉพาะเทอมนี้ (ใช้คำนวณ Weight)
                
                sem.courses.forEach(course => {
                    totalStructureCredits += course.credits;
                    semesterCredits += course.credits; // นับหน่วยกิตเทอมนี้

                    if (profile.passedCourses?.includes(course.id)) {
                        earnedCredits += course.credits;
                    }
                });

                // 3. Logic กราฟ & GPAX (แก้ไขส่วนนี้)
                // เช็คว่าเป็นเทอมในอดีตหรือไม่ (ปีน้อยกว่า หรือ ปีเท่ากันแต่เทอมน้อยกว่า)
                const isPastTerm = (yearNum < currentYearNum) || (yearNum === currentYearNum && termNum < currentTermNum);

                if (isPastTerm) {
                    // ✅ แก้ไข: สร้าง Key ให้ตรงกับ format ที่เก็บใน localStorage (เช่น "Y1/1")
                    const termKey = `Y${yearNum}/${termNum}`;
                    const historyGradeStr = profile.gpaHistory?.[termKey];
                    
                    // ต้องมีเกรด และ เกรดต้องไม่เป็นค่าว่าง
                    if (historyGradeStr && !isNaN(parseFloat(historyGradeStr))) {
                        const termGPA = parseFloat(historyGradeStr);
                        
                        // คำนวณสะสม GPAX (Grade * Credits)
                        totalPoints += (termGPA * semesterCredits);
                        totalGradedCredits += semesterCredits;

                        // Push ลงกราฟ
                        graphData.push({
                            term: termKey, // ใช้ Key สั้นๆ เช่น Y1/1
                            gpa: parseFloat(termGPA.toFixed(2)),
                            fullTerm: sem.term
                        });
                    }
                }
            });
        });
    }

    // คำนวณ GPAX สุดท้าย (Weighted Average)
    const calculatedGPAX = totalGradedCredits > 0 
        ? (totalPoints / totalGradedCredits).toFixed(2) 
        : "0.00";

    const progressPercent = totalStructureCredits > 0 
        ? Math.round((earnedCredits / totalStructureCredits) * 100) 
        : 0;

    return { totalCredits: totalStructureCredits, earnedCredits, activeCoursesList, calculatedGPAX, graphData, progressPercent };
  }, [profile]);

  // --- 3. Custom Tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <p className="text-gray-300 text-xs mb-1">{payload[0].payload.fullTerm}</p>
          <p className="text-cyan-400 font-bold text-lg shadow-cyan-500/50">
            GPA: {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleLogout = () => {
      if(window.confirm('ต้องการออกจากระบบหรือไม่?')) {
          localStorage.removeItem('userProfile'); 
          navigate('/login'); 
      }
  };

  const handleEditSetup = () => navigate('/setup'); 

  // --- UI START ---
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-full text-white pb-24">
      
      {/* --- COLUMN LEFT (Profile) --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="relative rounded-3xl overflow-hidden h-[450px] border border-white/20 shadow-2xl group transition-all duration-300">
            <img 
                src={profile.image || 'https://via.placeholder.com/500'} 
                alt="Profile" 
                className="w-full h-full object-cover transition duration-500 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-emerald-500/50 shadow-lg">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
            </div>
            <div className="absolute bottom-0 w-full p-6 flex flex-col gap-1 z-20">
                <h2 className="text-3xl font-black block truncate leading-tight">{profile.name || 'Your Name'}</h2>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-tighter opacity-70">Student ID</span>
                    <span className="text-gray-200 text-sm font-mono tracking-wider">{profile.studentId || '-'}</span>
                </div>
                <span className="text-blue-400 font-semibold mt-1 text-sm">{profile.major || 'Computer Science'}</span>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">CS Dept.</span>
                  <span className="flex items-center gap-1.5 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse"/> 
                      <span className="text-gray-400 font-normal">Year</span> {profile.currentYear} / {profile.currentTerm}
                  </span>
                </div>
            </div>
        </div>
        
        {/* Advisor & Logout */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-500/30 shrink-0">
            <Award size={24} />
          </div>
          <div className="w-full overflow-hidden">
            <p className="text-xs text-gray-400 mb-1">Advisor</p>
            <p className="font-medium text-sm text-white/50 truncate">{profile.advisor || 'Pending Assignment'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full py-4 rounded-3xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all flex items-center justify-center gap-2 font-bold group cursor-pointer">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/> Reset & Logout
        </button>
      </div>

      {/* --- COLUMN RIGHT (Stats & Graph) --- */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition"></div>
                <div>
                    <p className="text-emerald-400 font-medium flex items-center gap-2 mb-1"><TrendingUp size={18}/> GPAX</p>
                    <h3 className="text-5xl font-black text-white">{stats.calculatedGPAX}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-4">Calculated from history (Weighted)</p>
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
                        <h3 className="text-4xl font-black text-white">{profile.passedCourses?.includes('INTERNSHIP') ? '240' : '0'}</h3>
                        <span className="text-gray-500">/ 240 Hrs</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Required for Year 4</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Graph Area */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white"><BarChartIcon /> Academic Performance</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span> Term GPA
                    </div>
                </div>
                
                <div className="flex-1 w-full h-full min-h-[250px]">
                    {stats.graphData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis 
                                    dataKey="term" 
                                    stroke="#666" 
                                    tick={{ fill: '#888', fontSize: 12 }} 
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    domain={[0, 4]} 
                                    stroke="#666" 
                                    tick={{ fill: '#888', fontSize: 12 }} 
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 1.0, 2.0, 3.0, 4.0]}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                <ReferenceLine y={2.0} stroke="red" strokeDasharray="3 3" opacity={0.3} />
                                
                                <Area 
                                    type="linear" 
                                    dataKey="gpa" 
                                    stroke="#22d3ee" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorGpa)" 
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                            <BarChartIcon />
                            <p className="mt-2 text-sm italic">No GPA data available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Now Learning */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Calendar className="text-orange-400"/> Now Learning
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[300px]">
                    {stats.activeCoursesList.length > 0 ? (
                        stats.activeCoursesList.map((course) => (
                            <div key={course.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition cursor-pointer group hover:bg-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">{course.code}</span>
                                        <PlayCircle size={16} className="text-gray-500 group-hover:text-cyan-400 transition"/>
                                    </div>
                                    <h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-white transition">{course.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{course.credits} Credits</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle size={32} className="mb-2 opacity-50"/>
                            <p className="text-sm">No active courses</p>
                        </div>
                    )}
                </div>
                
                <button onClick={handleEditSetup} className="mt-4 w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white uppercase tracking-wider">
                    <Settings size={14} /> Back to Setup / Edit
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
); 

export default Dashboard;