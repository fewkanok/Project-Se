import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle } from 'lucide-react';
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

  // --- 2. Logic: Auto-Select & Auto-Clear ---
  useEffect(() => {
    let autoSelectedCourses = [];
    
    // เรียงลำดับการ Auto-select ตาม Flow วิชา (เพื่อให้มั่นใจว่า Prereq ถูก Check ก่อน)
    roadmapData.forEach((yearGroup, yearIdx) => {
        const thisYear = yearIdx + 1;
        yearGroup.semesters.forEach((sem, semIdx) => {
            const thisTerm = semIdx + 1;
            const isFuture = (thisYear > basicInfo.currentYear) || 
                             (thisYear === basicInfo.currentYear && thisTerm > basicInfo.currentTerm);

            if (!isFuture) {
                sem.courses.forEach(course => {
                    // check logic: ถ้าไม่มี prereq หรือ prereq ถูกเลือกไปแล้ว ถึงจะ auto-select ได้
                    if (!course.prereq || autoSelectedCourses.includes(course.prereq)) {
                         autoSelectedCourses.push(course.id);
                    }
                });
            }
        });
    });

    setPassedCourses(autoSelectedCourses);
    
  }, [basicInfo.currentYear, basicInfo.currentTerm]); 

  // คำนวณหน่วยกิต
  useEffect(() => {
    let credits = 0;
    roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
        if (passedCourses.includes(c.id)) credits += c.credits;
    })));
    setTotalCredits(credits);
  }, [passedCourses]);


  // --- 3. Helper Functions (CORE LOGIC) ---

  // ฟังก์ชันหา "ลูกหลาน" ทั้งหมดของวิชานี้ (Recursive)
  // เช่น ถอน Math I -> ต้องรู้ว่า Math For Com และ Numerical ต้องหลุดด้วย
  const getDependentCourses = (parentId) => {
      let dependents = [];
      
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
          if (c.prereq === parentId) {
              dependents.push(c.id);
              // หาลูกของลูกต่อ (Recursion)
              const grandChildren = getDependentCourses(c.id);
              dependents = [...dependents, ...grandChildren];
          }
      })));
      
      return dependents;
  };
  
  const isFutureCheck = (yearIdx, semIdx) => {
    const targetYear = yearIdx + 1;
    const targetTerm = semIdx + 1;
    if (targetYear > basicInfo.currentYear) return true;
    if (targetYear === basicInfo.currentYear && targetTerm > basicInfo.currentTerm) return true;
    return false;
  };

  const isPastCheck = (yearIdx, semIdx) => {
    const targetYear = yearIdx + 1;
    const targetTerm = semIdx + 1;
    if (targetYear < basicInfo.currentYear) return true;
    if (targetYear === basicInfo.currentYear && targetTerm < basicInfo.currentTerm) return true;
    return false;
  };

  // --- Toggle Function (แก้ใหม่) ---
  const toggleCourse = (courseId) => {
    if (passedCourses.includes(courseId)) {
      // CASE 1: เอาออก (Drop/Fail)
      // ต้องเอา "ตัวลูก" ออกด้วยทั้งหมด!
      const childrenToRemove = getDependentCourses(courseId);
      const allToRemove = [courseId, ...childrenToRemove];
      
      setPassedCourses(prev => prev.filter(id => !allToRemove.includes(id)));

    } else {
      // CASE 2: ใส่เพิ่ม (Pass)
      // เช็คก่อนว่า "ตัวแม่" (Prereq) ผ่านหรือยัง? (กันเหนียว)
      const courseObj = findCourseById(courseId);
      if (courseObj && courseObj.prereq && !passedCourses.includes(courseObj.prereq)) {
          alert(`ไม่สามารถเลือกวิชานี้ได้! ต้องผ่านวิชา ${findCourseById(courseObj.prereq)?.name || courseObj.prereq} ก่อน`);
          return;
      }
      setPassedCourses(prev => [...prev, courseId]);
    }
  };

  const findCourseById = (id) => {
      let found = null;
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
          if (c.id === id) found = c;
      })));
      return found;
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
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
            <p className="text-slate-500">ตรวจสอบรายวิชาที่ผ่าน (ระบบจะเช็ควิชาต่อเนื่องให้อัตโนมัติ)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
                
                {/* 1. Identity */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400"><User size={20}/> ข้อมูลส่วนตัว</h2>
                    <div className="space-y-3">
                        <input name="name" onChange={handleInfoChange} placeholder="ชื่อ-นามสกุล (อังกฤษ)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                        <input name="studentId" onChange={handleInfoChange} placeholder="รหัสนักศึกษา (เช่น 660xxxx)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                </div>

                {/* 2. Current Status */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><Calendar size={20}/> ตอนนี้เรียนอยู่ไหน?</h2>
                    
                    <div className="space-y-4">
                         {/* Year */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Year</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1,2,3,4].map(y => (
                                    <button key={y} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentYear: y, currentTerm: 1}))}
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
                         
                         {/* Term */}
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

                {/* 3. GPA */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> เกรดเฉลี่ยรายเทอม</h2>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {roadmapData.map((yearGroup, yearIdx) => 
                            yearGroup.semesters.map((sem, semIdx) => {
                                if (isPastCheck(yearIdx, semIdx)) {
                                     return (
                                         <div key={sem.term} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 animate-fade-in-up">
                                             <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">{sem.term} GPA</span>
                                             <input type="number" step="0.01" min="0" max="4.00" placeholder="0.00"
                                                onChange={(e) => setGpaHistory(prev => ({...prev, [sem.term]: e.target.value}))}
                                                className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors" />
                                         </div>
                                     )
                                }
                                return null;
                            })
                        )}
                        {basicInfo.currentYear === 1 && basicInfo.currentTerm === 1 && (
                            <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-white/10 rounded-xl">ยังไม่มีเกรดที่ต้องกรอก</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT CONTENT: Checklist --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0a0a0a] to-slate-900 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="text-pink-500"/> Checklist รายวิชา</h2>
                        <div className="flex gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12}/> ผ่าน (Passed)</span>
                            <span className="flex items-center gap-1 text-red-400"><XCircle size={12}/> ตก/ถอน (Drop/F)</span>
                            <span className="flex items-center gap-1 text-orange-400"><AlertCircle size={12}/> ติด Prerequisite</span>
                        </div>
                    </div>
                    <div className="text-right bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Total Credits</span>
                        <span className="text-3xl font-mono font-black text-cyan-400">{totalCredits}</span>
                    </div>
                </div>

                {/* --- Main Loop --- */}
                {roadmapData.map((yearGroup, yearIdx) => {
                    const isYearFuture = (yearIdx + 1) > basicInfo.currentYear;

                    return (
                        <div key={yearIdx} className={`relative transition-all duration-500 ${isYearFuture ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white/10 backdrop-blur text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/10 shadow-lg">
                                    {yearGroup.year}
                                </span>
                                {isYearFuture && <span className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-1"><Lock size={12}/> Locked</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearGroup.semesters.map((sem, semIdx) => {
                                    
                                    const isTermFuture = isFutureCheck(yearIdx, semIdx);

                                    return (
                                        <div key={semIdx} className={`bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 ${isTermFuture ? 'bg-black/40 border-white/5' : ''}`}>
                                            
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                                                <span className={`text-xs font-bold uppercase tracking-widest ${isTermFuture ? 'text-slate-600' : 'text-slate-300'}`}>
                                                    {sem.term}
                                                </span>
                                                {isTermFuture && (
                                                    <span className="text-[10px] bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1"><Lock size={10}/> Upcoming</span>
                                                )}
                                            </div>

                                            <div className="space-y-2.5">
                                                {sem.courses.map(course => {
                                                    const isSelected = passedCourses.includes(course.id);
                                                    // Check Prereq Logic
                                                    const prereqMet = !course.prereq || passedCourses.includes(course.prereq);
                                                    
                                                    // ถ้าเทอมไม่ใช่อนาคต แต่ Prereq ไม่ผ่าน -> ต้อง Lock
                                                    const isLockedByPrereq = !isTermFuture && !prereqMet;

                                                    return (
                                                        <div 
                                                            key={course.id}
                                                            onClick={() => {
                                                                if (!isTermFuture && !isYearFuture && !isLockedByPrereq) toggleCourse(course.id);
                                                            }}
                                                            className={`
                                                                relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group
                                                                ${isTermFuture 
                                                                    ? 'opacity-40 cursor-not-allowed border-transparent bg-transparent' 
                                                                    : isLockedByPrereq
                                                                        ? 'opacity-60 cursor-not-allowed border-orange-500/20 bg-orange-500/5' // Style สำหรับติด Prereq
                                                                        : isSelected 
                                                                            ? 'cursor-pointer bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                                                            : 'cursor-pointer bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${
                                                                        isLockedByPrereq ? 'border-orange-500/30 text-orange-400' :
                                                                        isSelected ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
                                                                    } ${isTermFuture ? 'border-slate-700 text-slate-600' : ''}`}>
                                                                        {course.code}
                                                                    </span>
                                                                    <h4 className={`text-sm font-medium truncate ${
                                                                        isLockedByPrereq ? 'text-orange-200/70' :
                                                                        isSelected ? 'text-emerald-100' : 'text-red-300/70 line-through decoration-red-500/50'
                                                                    } ${isTermFuture ? 'text-slate-600 no-underline' : ''}`}>
                                                                        {course.name}
                                                                    </h4>
                                                                </div>
                                                                {/* Show Prereq Warning */}
                                                                {isLockedByPrereq && (
                                                                    <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                                                                        <AlertCircle size={10}/> Prereq: {course.prereq}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {!isTermFuture && !isLockedByPrereq && (
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                                                                    isSelected 
                                                                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/40' 
                                                                    : 'bg-transparent border-red-500/30 text-red-500'
                                                                }`}>
                                                                    {isSelected ? <CheckCircle2 size={14} className="text-white"/> : <XCircle size={14}/>}
                                                                </div>
                                                            )}
                                                            
                                                            {(isTermFuture || isLockedByPrereq) && <Lock size={14} className={`${isLockedByPrereq ? 'text-orange-500' : 'text-slate-700'} shrink-0`}/>}

                                                        </div>
                                                    )
                                                })}
                                            </div>
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

        {/* Footer */}
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