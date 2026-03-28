import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera, Terminal, Pencil, Plus, Minus, Trash2, Search, Save, Layers } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses, tracks } from '../data/courseData';
import axios from 'axios';

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  // Modal & Tab States
  const [showPeModal, setShowPeModal] = useState(false);
  const [showElectiveModal, setShowElectiveModal] = useState(false); 
  const [activePeSlotId, setActivePeSlotId] = useState(null);
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [activeYearTab, setActiveYearTab] = useState(1);
  const [electiveSearchTerm, setElectiveSearchTerm] = useState('');

  const [basicInfo, setBasicInfo] = useState({
    name: '', studentId: '', currentYear: 1, currentTerm: 1,
    image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
  });
  const [courseStates, setCourseStates] = useState({});
  const [customElectives, setCustomElectives] = useState({});
  const [peAssignments, setPeAssignments] = useState({}); 
  const [gpaHistory, setGpaHistory] = useState({});
  const [maxYear, setMaxYear] = useState(4);

  // --- 1. Fetch Data from Backend ---
  useEffect(() => {
    const init = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('active_session'));
        if (session?.id) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`);
          if (res.data?.profileData) {
            const d = res.data.profileData;
            setBasicInfo(d.basicInfo || basicInfo);
            setCourseStates(d.courseStates || {});
            setCustomElectives(d.customElectives || {});
            setPeAssignments(d.peAssignments || {});
            setGpaHistory(d.gpaHistory || {});
            if(d.maxYear) setMaxYear(d.maxYear);
          }
        }
      } catch (e) { console.log("Load backup"); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  // --- 2. Logic: Auto-Select (ตันที่ปัจจุบัน) ---
  const applyTimelineLogic = (targetYear, targetTerm) => {
    const nextStates = { ...courseStates };
    roadmapData.forEach((yearGroup, yIdx) => {
      const y = yIdx + 1;
      yearGroup.semesters.forEach((sem, sIdx) => {
        const t = sIdx + 1;
        sem.courses.forEach(course => {
          if (y < targetYear || (y === targetYear && t < targetTerm)) {
            nextStates[course.id] = 'passed'; 
          } else if (y === targetYear && t === targetTerm) {
            nextStates[course.id] = 'learning';
          } else {
            delete nextStates[course.id];
          }
        });
      });
    });
    setCourseStates(nextStates);
  };

  // --- 3. Logic: Electives & PE ---
  const handleAddElective = (id) => {
    setCustomElectives(prev => ({
      ...prev, [activeTermKey]: [...(prev[activeTermKey] || []), id]
    }));
    // เซตสถานะให้วิชาเสริมที่เพิ่มใหม่ตาม Timeline
    const [y, t] = activeTermKey.split('-').map(Number);
    let state = null;
    if (y < basicInfo.currentYear || (y === basicInfo.currentYear && t < basicInfo.currentTerm)) state = 'passed';
    else if (y === basicInfo.currentYear && t === basicInfo.currentTerm) state = 'learning';
    
    if (state) setCourseStates(prev => ({ ...prev, [id]: state }));
    setShowElectiveModal(false);
  };

  const handleRemoveElective = (termKey, id) => {
    setCustomElectives(prev => ({ ...prev, [termKey]: prev[termKey].filter(i => i !== id) }));
    setCourseStates(prev => { const u = {...prev}; delete u[id]; return u; });
  };

  const handleCourseClick = (id) => {
    const current = courseStates[id];
    let next = !current ? 'passed' : current === 'passed' ? 'learning' : undefined;
    setCourseStates(prev => {
        const updated = { ...prev };
        if (next) updated[id] = next; else delete updated[id];
        return updated;
    });
  };

  // --- 4. Filter Year Data (Navbar Logic) ---
  const currentYearData = useMemo(() => {
    if (activeYearTab <= 4) return roadmapData.filter(y => (y.year_num || roadmapData.indexOf(y)+1) === activeYearTab);
    return [{ year: `Year ${activeYearTab}`, semesters: [{ term: 'Semester 1', courses: [{ id: `PE-Y${activeYearTab}-S1`, isProfessionalElective: true }] }, { term: 'Semester 2', courses: [{ id: `PE-Y${activeYearTab}-S2`, isProfessionalElective: true }] }] }];
  }, [activeYearTab]);

  const totalCredits = useMemo(() => {
    let credits = 0;
    Object.entries(courseStates).forEach(([id, state]) => {
      if (state === 'passed') {
        const c = roadmapData.flatMap(y => y.semesters.flatMap(s => s.courses)).find(i => i.id === id) || electiveCourses.find(i => i.id === id) || allTrackCourses[id];
        if (c) credits += (parseInt(c.credits) || 3);
      }
    });
    return credits;
  }, [courseStates, peAssignments, customElectives]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const session = JSON.parse(localStorage.getItem('active_session'));
      const payload = { basicInfo, courseStates, customElectives, peAssignments, gpaHistory, maxYear, totalCredits };
      await axios.patch(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`, payload);
      localStorage.setItem('userProfile', JSON.stringify(payload));
      navigate('/dashboard');
    } catch (e) { alert("Save Error!"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans">
      
      {/* ══════ ELECTIVE MODAL ══════ */}
      {showElectiveModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-orange-400">เลือกวิชาเสริม (Elective)</h3>
              <button onClick={() => setShowElectiveModal(false)} className="text-slate-500 hover:text-white"><XCircle size={32}/></button>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
              <input className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-orange-500" placeholder="ค้นหาชื่อวิชา..." onChange={e => setElectiveSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {electiveCourses.filter(e => e.name.toLowerCase().includes(electiveSearchTerm.toLowerCase())).map(e => (
                <div key={e.id} onClick={() => handleAddElective(e.id)} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-orange-500/10 cursor-pointer transition-all flex justify-between items-center">
                  <div><span className="text-[10px] font-mono text-orange-400">{e.id}</span><p className="font-bold text-sm">{e.name}</p></div>
                  <Plus size={20} className="text-orange-500"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════ PE MODAL ══════ */}
      {showPeModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-black text-purple-400">เลือกวิชาเลือกเอก</h3>
              <button onClick={() => setShowPeModal(false)}><XCircle size={32}/></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
                {!selectedTrack ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tracks.map(t => (
                      <button key={t.id} onClick={() => setSelectedTrack(t.id)} className="p-6 rounded-3xl border-2 border-white/5 bg-white/5 hover:border-purple-500/50 transition-all text-left">
                        <div className="text-3xl mb-2">{t.icon}</div>
                        <div className="font-black text-white">{t.label}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={()=>setSelectedTrack(null)} className="col-span-full text-slate-500 mb-4">← กลับไปเลือกสาย</button>
                    {Object.entries(allTrackCourses).map(([code, c]) => (
                      <div key={code} onClick={() => { setPeAssignments(p => ({...p, [activePeSlotId]: code})); setShowPeModal(false); }} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/50 cursor-pointer">
                        <span className="text-[10px] font-mono text-cyan-400">{code}</span>
                        <p className="font-bold text-sm">{c.name}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <header className="py-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-black rotate-6 shadow-xl shadow-orange-500/20"><Terminal size={28}/></div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Survivor <span className="text-orange-500">Setup</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <div className="tech-card p-6 rounded-[2.5rem] bg-white/5 border border-white/10">
              <div className="space-y-4">
                <InputGroup label="Survivor Name" value={basicInfo.name} onChange={e => setBasicInfo(p => ({...p, name: e.target.value}))} />
                <InputGroup label="Student ID" value={basicInfo.studentId} onChange={e => setBasicInfo(p => ({...p, studentId: e.target.value}))} />
              </div>
            </div>

            <div className="tech-card p-6 rounded-[2.5rem] bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-4"><p className="text-[10px] font-bold text-slate-500 uppercase">Years Control</p>
                <div className="flex gap-2">
                  <button onClick={() => setMaxYear(m => Math.max(4, m - 1))} className="p-1.5 bg-red-500/10 text-red-500 rounded-lg"><Minus size={14}/></button>
                  <button onClick={() => setMaxYear(m => m + 1)} className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg"><Plus size={14}/></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.from({length: maxYear}, (_, i) => i + 1).map(y => (
                  <button key={y} onClick={() => { setBasicInfo(p => ({...p, currentYear: y})); applyTimelineLogic(y, basicInfo.currentTerm); }} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${basicInfo.currentYear === y ? 'bg-purple-600 scale-110' : 'bg-white/5 text-slate-600'}`}>{y}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                  {[1,2].map(t => (
                    <button key={t} onClick={() => { setBasicInfo(p => ({...p, currentTerm: t})); applyTimelineLogic(basicInfo.currentYear, t); }} className={`py-3 rounded-xl font-bold text-xs ${basicInfo.currentTerm === t ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-600'}`}>TERM {t}</button>
                  ))}
              </div>
            </div>

            <div className="tech-card p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <h2 className="text-xs font-black text-emerald-400 mb-4 uppercase">GPA History</h2>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({length: basicInfo.currentYear}, (_, yi) => yi + 1).flatMap(y => 
                  [1,2].map(t => {
                    const isPast = (y < basicInfo.currentYear) || (y === basicInfo.currentYear && t < basicInfo.currentTerm);
                    if (!isPast) return null;
                    const key = `Y${y}/${t}`;
                    return (
                      <div key={key} className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400">{key}</span>
                        <input type="number" step="0.01" value={gpaHistory[key] || ''} onChange={e => setGpaHistory(p => ({...p, [key]: e.target.value}))} className="w-14 bg-transparent text-right text-emerald-400 font-bold outline-none border-b border-white/10" placeholder="0.00" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-8 space-y-6">
            <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex flex-wrap gap-1 sticky top-6 z-40 backdrop-blur-xl shadow-2xl">
               {Array.from({length: maxYear}, (_, i) => i + 1).map(y => (
                 <button key={y} onClick={() => setActiveYearTab(y)} className={`flex-1 min-w-[70px] py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeYearTab === y ? 'bg-white text-black' : 'text-slate-500 hover:bg-white/5'}`}>Year {y}</button>
               ))}
            </div>

            {currentYearData.map((yearGroup, yearIdx) => (
              <div key={yearIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yearGroup.semesters.map((sem, semIdx) => {
                  const termKey = `${activeYearTab}-${semIdx + 1}`;
                  const isLocked = activeYearTab > basicInfo.currentYear || (activeYearTab === basicInfo.currentYear && (semIdx+1) > basicInfo.currentTerm);
                  return (
                    <div key={semIdx} className={`p-8 rounded-[2.5rem] border transition-all ${isLocked ? 'bg-black/40 border-white/5 opacity-40 grayscale' : 'bg-white/5 border-white/10 shadow-xl'}`}>
                      <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">{sem.term}</h3>
                      <div className="space-y-3">
                        {sem.courses.map(course => {
                          const status = courseStates[course.id];
                          if (course.isProfessionalElective) return (
                            <div key={course.id} onClick={() => { if(!isLocked){ setActivePeSlotId(course.id); setShowPeModal(true); } }} className={`p-4 rounded-xl border border-dashed flex justify-between items-center cursor-pointer transition-all ${peAssignments[course.id] ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/5 border-white/10'}`}>
                              <div className="min-w-0"><p className="text-[9px] font-mono text-purple-400 uppercase">Track Course</p><p className="font-bold text-xs truncate">{peAssignments[course.id] ? allTrackCourses[peAssignments[course.id]]?.name : 'Select Track Course...'}</p></div>
                              <Plus size={16}/>
                            </div>
                          );
                          return (
                            <div key={course.id} onClick={() => { if(!isLocked) handleCourseClick(course.id); }} className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${status === 'passed' ? 'bg-emerald-500/10 border-emerald-500/40' : status === 'learning' ? 'bg-blue-500/10 border-blue-500/40' : 'bg-black/20 border-white/5'}`}>
                              <div className="min-w-0"><p className="text-[9px] font-mono text-slate-500">{course.code}</p><p className="text-xs font-bold truncate">{course.name}</p></div>
                              {status === 'passed' ? <CheckCircle2 className="text-emerald-500" size={16}/> : status === 'learning' ? <PlayCircle className="text-blue-500" size={16}/> : <div className="w-4 h-4 rounded-full border border-white/10"/>}
                            </div>
                          );
                        })}
                        
                        {/* Custom Electives */}
                        {(customElectives[termKey] || []).map(id => (
                          <div key={id} className="p-3 rounded-xl border border-orange-500/30 bg-orange-500/5 flex justify-between items-center group animate-in fade-in">
                            <p className="text-xs font-bold truncate text-orange-100">{electiveCourses.find(i=>i.id===id)?.name}</p>
                            <button onClick={() => handleRemoveElective(termKey, id)}><Trash2 size={14} className="text-red-400"/></button>
                          </div>
                        ))}
                        <button onClick={() => { if(!isLocked){ setActiveTermKey(termKey); setShowElectiveModal(true); } }} className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-[9px] font-black text-slate-600 hover:text-orange-400 transition-all flex items-center justify-center gap-2 mt-4"><Plus size={12}/> ADD ELECTIVE</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </main>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl p-6 flex justify-center z-[100] border-t border-white/10">
           <button onClick={handleSubmit} className="bg-white text-black font-black py-4 px-20 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">GENERATE DASHBOARD</button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-bold text-slate-500 ml-1 uppercase">{label}</p>
    <input className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl focus:border-orange-500 outline-none text-sm font-bold" value={value} onChange={onChange} />
  </div>
);

export default SetupProfile;