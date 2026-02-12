import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera } from 'lucide-react';
import { roadmapData } from '../data/courses';

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- 1. State ---
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    studentId: '',
    // advisor: '', // ลบ advisor ออกตาม request
    currentYear: 1,
    currentTerm: 1,
    // เปลี่ยนรูป default เป็น Avatar
    image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' 
  });

  const [gpaHistory, setGpaHistory] = useState({});
  const [courseStates, setCourseStates] = useState({}); 
  const [totalCredits, setTotalCredits] = useState(0);

  // --- 2. Logic: Auto-Select ---
  useEffect(() => {
    let newStates = {};
    roadmapData.forEach((yearGroup, yearIdx) => {
        const thisYear = yearIdx + 1;
        yearGroup.semesters.forEach((sem, semIdx) => {
            const thisTerm = semIdx + 1;
            const isPast = (thisYear < basicInfo.currentYear) || 
                           (thisYear === basicInfo.currentYear && thisTerm < basicInfo.currentTerm);
            const isCurrent = (thisYear === basicInfo.currentYear && thisTerm === basicInfo.currentTerm);

            sem.courses.forEach(course => {
                const prereqId = course.prereq;
                const isPrereqMet = !prereqId || (prereqId && newStates[prereqId] === 'passed');

                if (isPrereqMet) {
                    if (isPast) {
                        newStates[course.id] = 'passed';
                    } else if (isCurrent) {
                        newStates[course.id] = 'learning';
                    }
                }
            });
        });
    });
    setCourseStates(newStates);
  }, [basicInfo.currentYear, basicInfo.currentTerm]); 

  // Calculate Credits
  useEffect(() => {
    let credits = 0;
    roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
        if (courseStates[c.id] === 'passed') credits += c.credits;
    })));
    setTotalCredits(credits);
  }, [courseStates]);


  // --- 3. Helper Functions ---
  const getDependentCourses = (parentId) => {
      let dependents = [];
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
          if (c.prereq === parentId) {
              dependents.push(c.id);
              dependents = [...dependents, ...getDependentCourses(c.id)];
          }
      })));
      return dependents;
  };

  const findCourseById = (id) => {
      let found = null;
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
          if (c.id === id) found = c;
      })));
      return found;
  };

  // --- Core Logic: Cycle Status ---
  const handleCourseClick = (courseId) => {
      const currentState = courseStates[courseId];
      const courseObj = findCourseById(courseId);

      if (!currentState || currentState === 'learning') {
        let nextState = '';
        if (!currentState) nextState = 'passed';
        else if (currentState === 'passed') nextState = 'learning';
        else if (currentState === 'learning') nextState = undefined; 

        if (nextState === 'passed' || nextState === 'learning') {
            if (courseObj.prereq) {
                const prereqState = courseStates[courseObj.prereq];
                if (prereqState !== 'passed') {
                    // เปลี่ยน Alert เป็นภาษาอังกฤษ
                    alert(`Cannot select this course! You must pass ${findCourseById(courseObj.prereq)?.name || courseObj.prereq} first.`);
                    return;
                }
            }
        }

        setCourseStates(prev => {
            const updated = { ...prev };
            if (nextState) updated[courseId] = nextState;
            else {
                delete updated[courseId];
                const children = getDependentCourses(courseId);
                children.forEach(childId => delete updated[childId]);
            }
            return updated;
        });
      } else if (currentState === 'passed') {
          setCourseStates(prev => ({ ...prev, [courseId]: 'learning' }));
      }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size too large! Please use image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicInfo(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!basicInfo.name || !basicInfo.studentId) return alert("Please enter your Name and Student ID.");
    
    const passedCourses = Object.keys(courseStates).filter(id => courseStates[id] === 'passed');
    
    const userPayload = { 
        ...basicInfo, 
        gpaHistory,
        passedCourses, 
        learningCourses: Object.keys(courseStates).filter(id => courseStates[id] === 'learning'),
        courseStates, 
        totalCredits, 
        lastUpdated: new Date().toISOString() 
    };
    
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
            <p className="text-slate-500">Tap course to change status (Passed -> Learning -> Not Started)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
                
                {/* 1. Identity & Photo Upload */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400"><User size={20}/> Personal Info</h2>
                    
                    <div className="flex flex-col items-center mb-6">
                        <div 
                            className="relative w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer group hover:border-cyan-500 transition-all bg-white/5"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <img src={basicInfo.image} alt="Profile" className="w-full h-full object-cover p-1 rounded-full" />
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Camera size={24} className="text-white mb-1"/>
                                <span className="text-[10px] text-white font-bold">Change</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg"
                        />
                        <p className="text-xs text-slate-500 mt-2">Click image to upload (Max 1MB)</p>
                    </div>

                    <div className="space-y-3">
                        <input name="name" onChange={handleInfoChange} placeholder="Full Name (English)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                        <input name="studentId" onChange={handleInfoChange} placeholder="Student ID (e.g. 660xxxx)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-cyan-500 outline-none transition-colors" />
                        {/* Advisor input removed */}
                    </div>
                </div>

                {/* 2. Current Status Selector */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><Calendar size={20}/> Current Study Year?</h2>
                    
                    <div className="space-y-4">
                         {/* Year */}
                         <div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1,2,3,4].map(y => (
                                    <button key={y} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentYear: y, currentTerm: 1}))}
                                        className={`py-2 rounded-lg font-bold transition-all border ${
                                            basicInfo.currentYear === y 
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                        }`}>
                                        Y{y}
                                    </button>
                                ))}
                            </div>
                         </div>
                         
                         {/* Term */}
                         <div>
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
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> GPA History (Finished Terms)</h2>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {roadmapData.map((yearGroup, yearIdx) => 
                            yearGroup.semesters.map((sem, semIdx) => {
                                const isPast = (yearIdx + 1 < basicInfo.currentYear) || 
                                               (yearIdx + 1 === basicInfo.currentYear && semIdx + 1 < basicInfo.currentTerm);
                                
                                // Key Format: Y1/1
                                const uniqueTermKey = `Y${yearIdx + 1}/${semIdx + 1}`;

                                if (isPast) {
                                     return (
                                       <div key={uniqueTermKey} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 animate-fade-in-up">
                                            <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
                                                {uniqueTermKey} GPA
                                            </span>
                                            <input 
                                                type="number" step="0.01" min="0" max="4" placeholder="0.00"
                                                value={gpaHistory[uniqueTermKey] || ''} 
                                                
                                                // ✅ FIX: Lock GPA between 0 - 4
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    // Allow empty string for backspace
                                                    if (val === '') {
                                                        setGpaHistory(prev => ({ ...prev, [uniqueTermKey]: '' }));
                                                        return;
                                                    }
                                                    
                                                    // Convert to number for checking
                                                    const numVal = parseFloat(val);
                                                    if (numVal > 4) val = 4;
                                                    if (numVal < 0) val = 0;

                                                    setGpaHistory(prev => ({
                                                        ...prev, 
                                                        [uniqueTermKey]: val
                                                    }));
                                                }}
                                                className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors" 
                                            />
                                       </div>
                                     )
                                }
                                return null;
                            })
                        )}
                        {basicInfo.currentYear === 1 && basicInfo.currentTerm === 1 && (
                            <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-white/10 rounded-xl">No grades to enter yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT CONTENT (Checklist) --- */}
            <div className="lg:col-span-8 space-y-8">
                {/* Banner Status Guide */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0a0a0a] to-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-xl gap-4 sticky top-8 z-40 backdrop-blur-xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="text-pink-500"/> Courses</h2>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20"><CheckCircle2 size={12}/> Passed</span>
                            <span className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20"><PlayCircle size={12}/> Learning</span>
                            <span className="flex items-center gap-1 text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10"><XCircle size={12}/> Not Started</span>
                        </div>
                    </div>
                    <div className="text-right bg-white/5 p-3 rounded-xl border border-white/5 min-w-[120px]">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Credits Passed</span>
                        <span className="text-3xl font-mono font-black text-cyan-400">{totalCredits}</span>
                    </div>
                </div>

                {/* --- Main Loop (Courses) --- */}
                {roadmapData.map((yearGroup, yearIdx) => {
                    const isYearCurrent = basicInfo.currentYear === yearGroup.year;
                    
                    return (
                        <div key={yearIdx} className="relative">
                            
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg transition-all ${
                                    isYearCurrent 
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/20' 
                                    : 'bg-white/10 backdrop-blur text-slate-300 border-white/10'
                                }`}>
                                    Year {yearGroup.year}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearGroup.semesters.map((sem, semIdx) => {
                                    const isTermCurrent = isYearCurrent && basicInfo.currentTerm === (semIdx + 1);

                                    return (
                                        <div key={semIdx} className={`
                                            rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 border
                                            ${isTermCurrent 
                                                ? 'bg-white/[0.07] border-white/20 ring-1 ring-white/10' 
                                                : 'bg-white/5 border-white/5'
                                            }
                                        `}>
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold uppercase tracking-widest ${isTermCurrent ? 'text-white' : 'text-slate-400'}`}>
                                                        {sem.term}
                                                    </span>
                                                    {isTermCurrent && <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded-full">Current</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                {sem.courses.map(course => {
                                                    const status = courseStates[course.id];
                                                    const prereqState = course.prereq ? courseStates[course.prereq] : 'passed';
                                                    const isLocked = course.prereq && prereqState !== 'passed'; 

                                                    return (
                                                        <div 
                                                            key={course.id}
                                                            onClick={() => handleCourseClick(course.id)}
                                                            className={`
                                                                relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group select-none
                                                                ${isLocked
                                                                    ? 'opacity-60 cursor-not-allowed border-orange-500/20 bg-orange-500/5' 
                                                                    : status === 'passed'
                                                                        ? 'cursor-pointer bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                                        : status === 'learning'
                                                                            ? 'cursor-pointer bg-blue-500/10 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                                                                            : 'cursor-pointer bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${
                                                                        isLocked ? 'border-orange-500/30 text-orange-400' :
                                                                        status === 'passed' ? 'border-emerald-500/30 text-emerald-400' :
                                                                        status === 'learning' ? 'border-blue-500/30 text-blue-400' :
                                                                        'border-slate-600 text-slate-500'
                                                                    }`}>
                                                                        {course.code}
                                                                    </span>
                                                                    <h4 className={`text-sm font-medium truncate ${
                                                                        isLocked ? 'text-orange-200/50' :
                                                                        status === 'passed' ? 'text-emerald-100' :
                                                                        status === 'learning' ? 'text-blue-100' :
                                                                        'text-slate-400'
                                                                    }`}>
                                                                        {course.name}
                                                                    </h4>
                                                                </div>
                                                                {isLocked && (
                                                                    <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                                                                        <AlertCircle size={10}/> Prerequisite: {course.prereq}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="shrink-0 transition-transform active:scale-90">
                                                                {isLocked ? (
                                                                    <Lock size={16} className="text-orange-500/50"/>
                                                                ) : status === 'passed' ? (
                                                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                                                        <CheckCircle2 size={14} className="text-white"/>
                                                                    </div>
                                                                ) : status === 'learning' ? (
                                                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                                                                        <PlayCircle size={14} className="text-white"/>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-slate-600 hover:border-slate-400 hover:text-slate-400">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
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