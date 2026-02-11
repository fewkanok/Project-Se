import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock } from 'lucide-react';
import { roadmapData } from '../data/courses';

const SetupProfile = () => {
  const navigate = useNavigate();

  // --- 1. State ---
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    studentId: '',
    advisor: '',
    currentYear: 1,
    currentTerm: 1
  });
  const [gpaHistory, setGpaHistory] = useState({});
  const [passedCourses, setPassedCourses] = useState([]); 
  const [totalCredits, setTotalCredits] = useState(0);

  // --- 2. Logic: Auto-Select & Auto-Clear (หัวใจสำคัญ) ---
  useEffect(() => {
    const autoSelectedCourses = [];
    
    // วนลูปทุกปี
    roadmapData.forEach((yearGroup, yearIdx) => {
        const thisYear = yearIdx + 1; // ใช้ Index + 1 แทนการตัด string (ชัวร์กว่า)

        // วนลูปทุกเทอมในปะนั้น
        yearGroup.semesters.forEach((sem, semIdx) => {
            const thisTerm = semIdx + 1; // เทอม 1 หรือ 2 (ดูจากลำดับ Array เลย)

            // เช็คว่าเป็น "อนาคต" หรือไม่?
            // ถ้า ปีเป้าหมาย > ปีปัจจุบัน = อนาคต
            // หรือ ปีเท่ากัน แต่ เทอมเป้าหมาย > เทอมปัจจุบัน = อนาคต
            const isFuture = (thisYear > basicInfo.currentYear) || 
                             (thisYear === basicInfo.currentYear && thisTerm > basicInfo.currentTerm);

            if (!isFuture) {
                // ถ้าเป็นอดีตหรือปัจจุบัน -> ให้ติ๊กวิชาทั้งหมดเป็น "ผ่าน" (สีเขียว) ไว้ก่อน
                sem.courses.forEach(course => autoSelectedCourses.push(course.id));
            }
        });
    });

    // อัปเดต State (วิชาที่เป็นอนาคต จะไม่ถูกใส่เข้ามา = เคลียร์ทิ้งอัตโนมัติ)
    setPassedCourses(autoSelectedCourses);
    
  }, [basicInfo.currentYear, basicInfo.currentTerm]); 


  // คำนวณหน่วยกิตรวม
  useEffect(() => {
    let credits = 0;
    roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
        if (passedCourses.includes(c.id)) credits += c.credits;
    })));
    setTotalCredits(credits);
  }, [passedCourses]);


  // --- Helper Functions ---
  
  // ฟังก์ชันเช็คอนาคต (ใช้สำหรับล็อค UI)
  const isFutureCheck = (yearIdx, semIdx) => {
    const targetYear = yearIdx + 1;
    const targetTerm = semIdx + 1;

    if (targetYear > basicInfo.currentYear) return true;
    if (targetYear === basicInfo.currentYear && targetTerm > basicInfo.currentTerm) return true;
    return false;
  };

  // ฟังก์ชันเช็คอดีต (สำหรับโชว์ช่องกรอกเกรด)
  const isPastCheck = (yearIdx, semIdx) => {
    const targetYear = yearIdx + 1;
    const targetTerm = semIdx + 1;

    if (targetYear < basicInfo.currentYear) return true;
    if (targetYear === basicInfo.currentYear && targetTerm < basicInfo.currentTerm) return true;
    return false;
  };

  const toggleCourse = (courseId) => {
    if (passedCourses.includes(courseId)) {
      setPassedCourses(prev => prev.filter(id => id !== courseId)); // เอาออก (กลายเป็นสีแดง/กากบาท)
    } else {
      setPassedCourses(prev => [...prev, courseId]); // ใส่กลับ (กลายเป็นสีเขียว)
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validation
    if (!basicInfo.name || !basicInfo.studentId) return alert("กรุณากรอกชื่อและรหัสนักศึกษาครับ");
    
    const userPayload = { ...basicInfo, gpaHistory, passedCourses, totalCredits, lastUpdated: new Date().toISOString() };
    localStorage.setItem('userProfile', JSON.stringify(userPayload));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        
        {/* Header */}
        <div className="mt-8 mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                SETUP PROFILE
            </h1>
            <p className="text-slate-500">ตรวจสอบรายวิชาที่ผ่าน เพื่อสร้าง Roadmap ของคุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR (Control Panel) --- */}
            <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
                
                {/* 1. Identity */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400"><User size={20}/> ข้อมูลส่วนตัว</h2>
                    <div className="space-y-3">
                        <input name="name" onChange={handleInfoChange} placeholder="ชื่อ-นามสกุล (อังกฤษ)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                        <input name="studentId" onChange={handleInfoChange} placeholder="รหัสนักศึกษา (เช่น 660xxxx)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                </div>

                {/* 2. Current Status (ตัวคุมเวลา) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><Calendar size={20}/> ตอนนี้เรียนอยู่ไหน?</h2>
                    
                    <div className="space-y-4">
                         {/* Year Selector */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Year</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1,2,3,4].map(y => (
                                    <button key={y} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentYear: y, currentTerm: 1}))} // เปลี่ยนปี รีเซ็ตเทอมเป็น 1
                                        className={`py-2 rounded-lg font-bold transition-all border ${
                                            basicInfo.currentYear === y 
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                        }`}>
                                        Year {y}
                                    </button>
                                ))}
                            </div>
                         </div>
                         
                         {/* Term Selector */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Term</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[1,2].map(t => (
                                    <button key={t} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentTerm: t}))}
                                        className={`py-2 rounded-lg font-bold transition-all border ${
                                            basicInfo.currentTerm === t 
                                            ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                        }`}>
                                        Term {t}
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>

                {/* 3. GPA Input (Dynamic) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> เกรดเฉลี่ยรายเทอม</h2>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        
                        {/* ใช้ loop index เช็คอดีต/อนาคต แทน string parsing */}
                        {roadmapData.map((yearGroup, yearIdx) => 
                            yearGroup.semesters.map((sem, semIdx) => {
                                // เช็คว่าเทอมนี้เป็น "อดีต" หรือไม่
                                if (isPastCheck(yearIdx, semIdx)) {
                                     return (
                                         <div key={sem.term} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 animate-fade-in-up">
                                             <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">{sem.term} GPA</span>
                                             <input 
                                                type="number" step="0.01" min="0" max="4.00" placeholder="0.00"
                                                onChange={(e) => setGpaHistory(prev => ({...prev, [sem.term]: e.target.value}))}
                                                className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors" 
                                             />
                                         </div>
                                     )
                                }
                                return null;
                            })
                        )}

                        {basicInfo.currentYear === 1 && basicInfo.currentTerm === 1 && (
                            <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-white/10 rounded-xl">
                                ยังไม่มีเกรดที่ต้องกรอกในเทอมแรก
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT CONTENT: Course Checklist --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Summary Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0a0a0a] to-slate-900 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="text-pink-500"/> Checklist รายวิชา</h2>
                        <div className="flex gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12}/> ผ่าน (Passed)</span>
                            <span className="flex items-center gap-1 text-red-400"><XCircle size={12}/> ตก/ถอน (Drop/F)</span>
                        </div>
                    </div>
                    <div className="text-right bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Total Credits</span>
                        <span className="text-3xl font-mono font-black text-cyan-400">{totalCredits}</span>
                    </div>
                </div>

                {/* --- Loop Years --- */}
                {roadmapData.map((yearGroup, yearIdx) => {
                    // ใช้ yearIdx+1 เช็คอนาคตระดับปี
                    const isYearFuture = (yearIdx + 1) > basicInfo.currentYear;

                    return (
                        <div key={yearIdx} className={`relative transition-all duration-500 ${isYearFuture ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            
                            {/* Year Label Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white/10 backdrop-blur text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/10 shadow-lg">
                                    {yearGroup.year}
                                </span>
                                {isYearFuture && <span className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-1"><Lock size={12}/> Locked</span>}
                            </div>

                            {/* Grid แบ่ง 2 เทอม */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearGroup.semesters.map((sem, semIdx) => {
                                    
                                    // *** Logic หัวใจสำคัญ *** // ใช้ (yearIdx, semIdx) แทน string parsing เพื่อความแม่นยำ
                                    const isTermFuture = isFutureCheck(yearIdx, semIdx);

                                    return (
                                        <div key={semIdx} className={`bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 ${isTermFuture ? 'bg-black/40 border-white/5' : ''}`}>
                                            
                                            {/* Term Header */}
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                                                <span className={`text-xs font-bold uppercase tracking-widest ${isTermFuture ? 'text-slate-600' : 'text-slate-300'}`}>
                                                    {sem.term} {/* ชื่อโชว์ได้ปกติ แต่ Logic ไม่พึ่งมันแล้ว */}
                                                </span>
                                                {isTermFuture && (
                                                    <span className="text-[10px] bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Lock size={10}/> Upcoming
                                                    </span>
                                                )}
                                            </div>

                                            {/* Course List */}
                                            <div className="space-y-2.5">
                                                {sem.courses.map(course => {
                                                    const isSelected = passedCourses.includes(course.id);
                                                    
                                                    return (
                                                        <div 
                                                            key={course.id}
                                                            onClick={() => {
                                                                // ห้ามกดถ้าเป็นอนาคต
                                                                if (!isTermFuture && !isYearFuture) toggleCourse(course.id);
                                                            }}
                                                            className={`
                                                                cursor-pointer relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group
                                                                ${isTermFuture 
                                                                    ? 'opacity-40 cursor-not-allowed border-transparent bg-transparent' // สไตล์ตอนโดนล็อค
                                                                    : isSelected 
                                                                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' // สไตล์ผ่าน (เขียว)
                                                                        : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' // สไตล์ตก/ดรอป (แดง)
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${
                                                                        isSelected ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
                                                                    } ${isTermFuture ? 'border-slate-700 text-slate-600' : ''}`}>
                                                                        {course.code}
                                                                    </span>
                                                                    <h4 className={`text-sm font-medium truncate ${
                                                                        isSelected ? 'text-emerald-100' : 'text-red-300/70 line-through decoration-red-500/50'
                                                                    } ${isTermFuture ? 'text-slate-600 no-underline' : ''}`}>
                                                                        {course.name}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            {/* Icons Check/Cross */}
                                                            {!isTermFuture && (
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                                                                    isSelected 
                                                                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/40' 
                                                                    : 'bg-transparent border-red-500/30 text-red-500'
                                                                }`}>
                                                                    {isSelected ? <CheckCircle2 size={14} className="text-white"/> : <XCircle size={14}/>}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Lock Icon for Future */}
                                                            {isTermFuture && <Lock size={14} className="text-slate-700 shrink-0"/>}

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Full Overlay for Future (กันเหนียวอีกชั้น) */}
                                            {isTermFuture && <div className="absolute inset-0 z-10 bg-[#050505]/30 backdrop-blur-[1px] rounded-2xl pointer-events-none"></div>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Floating Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 p-4 z-50">
            <div className="max-w-7xl mx-auto flex justify-end">
                <button onClick={handleSubmit}
                    className="bg-white text-black hover:bg-cyan-50 font-bold py-3 px-10 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 transition-transform hover:-translate-y-1 active:scale-95 text-lg">
                    Generate Dashboard <ChevronRight size={24}/>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SetupProfile;