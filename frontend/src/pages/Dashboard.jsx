import { useState, useRef, useEffect } from 'react';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, Edit2, Save, X, Camera } from 'lucide-react';
import { roadmapData } from '../data/courses';

const Dashboard = () => {
  // --- 1. State สำหรับข้อมูล User (แก้ไขได้) ---
  const [isEditing, setIsEditing] = useState(false);
  
  // โหลดข้อมูลจาก LocalStorage ถ้ามี ถ้าไม่มีใช้ค่า Default
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Mr. X',
      studentId: '660406xxxx',
      major: 'Computer Science',
      advisor: 'Dr. Somsak',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60'
    };
  });

  // Ref สำหรับปุ่มอัปโหลดรูป
  const fileInputRef = useRef(null);

  // --- Logic การจัดการ Form ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile)); // บันทึกลงเครื่อง
    setIsEditing(false);
  };

  // --- Logic คำนวณข้อมูลจาก roadmapData (เหมือนเดิม) ---
  let totalCredits = 0;
  let earnedCredits = 0;
  let activeCourses = [];

  roadmapData.forEach(year => {
    year.semesters.forEach(sem => {
      sem.courses.forEach(course => {
        totalCredits += course.credits;
        if (course.status === 'passed') earnedCredits += course.credits;
        if (course.status === 'active') activeCourses.push({ ...course, term: sem.term });
      });
    });
  });

  const progressPercent = Math.round((earnedCredits / totalCredits) * 100);

  // --- Mock Data ---
  const gpaHistory = [
    { term: 'Y1/1', gpa: 3.50, height: '70%' },
    { term: 'Y1/2', gpa: 3.25, height: '65%' },
    { term: 'Y2/1', gpa: 3.80, height: '85%' },
    { term: 'Y2/2', gpa: 3.42, height: '75%' },
  ];
  const currentGPA = 3.42;

  // Helper Input Component (เพื่อให้โค้ดสะอาด)
  const EditableInput = ({ name, value, className, placeholder }) => {
    if (!isEditing) return <span className={className}>{value}</span>;
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`bg-white/10 border-b border-white/50 text-white outline-none px-1 w-full ${className}`}
      />
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-full text-white">
      
      {/* --- COLUMN ซ้าย: Profile & Status --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Card: Profile */}
        <div className="relative rounded-3xl overflow-hidden h-[450px] border border-white/20 shadow-2xl group transition-all duration-300">
            
            {/* Background Image */}
            <img 
                src={profile.image} 
                alt="Profile" 
                className={`w-full h-full object-cover transition duration-500 ${isEditing ? 'opacity-50 blur-sm' : 'grayscale group-hover:grayscale-0'}`}
            />
            
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Edit Button (Top Right) */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {isEditing ? (
                    <>
                        <button onClick={saveProfile} className="bg-emerald-500 p-2 rounded-full hover:bg-emerald-400 shadow-lg transition transform hover:scale-110">
                            <Save size={18} />
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 border border-white/20 transition transform hover:scale-110">
                        <Edit2 size={18} />
                    </button>
                )}
            </div>

            {/* Change Image Button (Show only when editing) */}
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="flex flex-col items-center gap-2 bg-black/50 p-4 rounded-xl border border-white/20 hover:bg-black/70 transition cursor-pointer backdrop-blur-md"
                    >
                        <Camera size={32} />
                        <span className="text-sm font-bold">Change Photo</span>
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
            )}
          
          <div className="absolute bottom-0 w-full p-6 flex flex-col gap-2 z-20">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold w-max mb-2 backdrop-blur-md">
                ● Active Student
            </div>
            
            {/* Editable Name */}
            <div className="mb-1">
                <EditableInput 
                    name="name" 
                    value={profile.name} 
                    className="text-3xl font-black block" 
                    placeholder="Your Name"
                />
            </div>

            {/* Editable ID */}
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">ID:</span>
                <EditableInput 
                    name="studentId" 
                    value={profile.studentId} 
                    className="text-gray-300 text-sm" 
                    placeholder="Student ID"
                />
            </div>

            {/* Editable Major */}
            <EditableInput 
                name="major" 
                value={profile.major} 
                className="text-blue-300 font-medium mt-1 block" 
                placeholder="Major"
            />
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
              <span>Class of 2026</span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400"/> Year 2</span>
            </div>
          </div>
        </div>

        {/* Card: Advisor (อาจารย์ที่ปรึกษา - แก้ไขได้ด้วย) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-500/30 shrink-0">
            <Award size={24} />
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400">Advisor</p>
            <EditableInput 
                name="advisor" 
                value={profile.advisor} 
                className="font-bold block w-full bg-transparent" 
                placeholder="Advisor Name"
            />
          </div>
        </div>
      </div>

      {/* --- COLUMN ขวา (คงเดิม ไม่เปลี่ยนแปลง) --- */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Row 1: Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GPA Card */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition"></div>
                <div>
                    <p className="text-emerald-400 font-medium flex items-center gap-2 mb-1"><TrendingUp size={18}/> GPAX</p>
                    <h3 className="text-5xl font-black text-white">{currentGPA}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-4">Top 15% of Class</p>
            </div>

            {/* Credits Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>
                <div>
                    <p className="text-blue-400 font-medium flex items-center gap-2 mb-1"><BookOpen size={18}/> Credits Earned</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-white">{earnedCredits}</h3>
                        <span className="text-gray-500">/ {totalCredits}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>

            {/* Hours/Activity Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition"></div>
                <div>
                    <p className="text-purple-400 font-medium flex items-center gap-2 mb-1"><Clock size={18}/> Internship</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-white">0</h3>
                        <span className="text-gray-500">/ 240 Hrs</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Start in Year 3 Summer</p>
            </div>
        </div>

        {/* Row 2: Graph & Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2"><BarChartIcon /> Academic Performance</h3>
                    <select className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 outline-none">
                        <option>All Semesters</option>
                    </select>
                </div>
                <div className="flex-1 flex items-end justify-between gap-4 px-4 h-48 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                        <div className="border-t border-white w-full"></div>
                    </div>
                    {gpaHistory.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                            <div className="w-full md:w-16 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-xl relative transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom" style={{ height: item.height }}>
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                    {item.gpa}
                                </span>
                            </div>
                            <span className="text-sm text-gray-400 font-mono">{item.term}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Calendar className="text-orange-400"/> Now Learning
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {activeCourses.length > 0 ? (
                        activeCourses.map((course) => (
                            <div key={course.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{course.code}</span>
                                    <PlayCircle size={16} className="text-gray-500 group-hover:text-white transition"/>
                                </div>
                                <h4 className="font-bold text-sm text-gray-200 line-clamp-1">{course.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{course.credits} Credits</p>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle size={32} className="mb-2 opacity-50"/>
                            <p>No active courses</p>
                        </div>
                    )}
                </div>
                <button className="mt-4 w-full py-3 rounded-xl border border-white/10 hover:bg-white/10 transition text-sm font-bold">
                    View Full Schedule
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