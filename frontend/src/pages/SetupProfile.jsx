import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera, Terminal, Pencil, Plus, Minus, Trash2, Search, Save, Layers } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
// ✅ นำเข้า nodeTypeMap มาใช้งาน
import { courses as allTrackCourses, tracks, nodeTypeMap } from '../data/courseData';
import axios from 'axios';

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('active_session'));
        if (!session?.id) return;
        const localData = JSON.parse(localStorage.getItem('userProfile'));
        if (localData) {
            setBasicInfo(localData.basicInfo || basicInfo);
            setCourseStates(localData.courseStates || {});
            setCustomElectives(localData.customElectives || {});
            setPeAssignments(localData.peAssignments || {});
            setGpaHistory(localData.gpaHistory || {});
            setMaxYear(localData.maxYear || 4);
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`);
        if (res.data?.profileData) {
          const d = res.data.profileData;
          setBasicInfo(d.basicInfo);
          setCourseStates(d.courseStates);
          setCustomElectives(d.customElectives);
          setPeAssignments(d.peAssignments);
          setGpaHistory(d.gpaHistory);
          setMaxYear(d.maxYear || 4);
        }
      } catch (e) { console.log("Render might be sleeping, using local data."); }
    };
    fetchData();
  }, []);

  const applyTimelineLogic = (targetYear, targetTerm) => {
    const nextStates = { ...courseStates };
    roadmapData.forEach((yearGroup, yIdx) => {
      const y = yIdx + 1;
      yearGroup.semesters.forEach((sem, sIdx) => {
        const t = sIdx + 1;
        sem.courses.forEach(course => {
          if (y < targetYear || (y === targetYear && t < targetTerm)) nextStates[course.id] = 'passed';
          else if (y === targetYear && t === targetTerm) nextStates[course.id] = 'learning';
          else delete nextStates[course.id];
        });
      });
    });
    setCourseStates(nextStates);
  };

  const handleAddElective = (id) => {
    const allSelectedElectives = Object.values(customElectives).flat();
    if (allSelectedElectives.includes(id)) {
      alert("คุณเลือกวิชาเสริมนี้ไปแล้วในเทอมอื่นครับ!");
      return;
    }
    setCustomElectives(prev => ({ ...prev, [activeTermKey]: [...(prev[activeTermKey] || []), id] }));
    setShowElectiveModal(false);
  };

  const handleRemoveElective = (termKey, id) => {
    setCustomElectives(prev => ({ ...prev, [termKey]: prev[termKey].filter(i => i !== id) }));
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

  const currentYearData = useMemo(() => {
    if (activeYearTab <= 4) return roadmapData.filter(y => (roadmapData.indexOf(y)+1) === activeYearTab);
    return [{ year: `Year ${activeYearTab}`, semesters: [{ term: 'Semester 1', courses: [{ id: `PE-Y${activeYearTab}-S1`, isProfessionalElective: true }] }, { term: 'Semester 2', courses: [{ id: `PE-Y${activeYearTab}-S2`, isProfessionalElective: true }] }] }];
  }, [activeYearTab]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const session = JSON.parse(localStorage.getItem('active_session'));

      // 🛠️ 1. สร้าง State จำลองเพื่อเตรียมประทับตราสถานะก่อน Save
      const finalCourseStates = { ...courseStates };
      const curY = basicInfo.currentYear;
      const curT = basicInfo.currentTerm;

      // 🛠️ 2. จัดการสถานะให้ "วิชาเลือกเสรี (Electives)"
      Object.entries(customElectives).forEach(([termKey, courseIds]) => {
        const [yStr, tStr] = termKey.split('-');
        const y = parseInt(yStr);
        const t = parseInt(tStr);
        
        courseIds.forEach(id => {
          if (curY > y || (curY === y && curT > t)) finalCourseStates[id] = 'passed';
          else if (curY === y && curT === t) finalCourseStates[id] = 'learning';
          else delete finalCourseStates[id]; // อนาคต = ยังไม่เรียน
        });
      });

      // 🛠️ 3. จัดการสถานะให้ "วิชาเลือกเอก (Track Courses / PE)"
      roadmapData.forEach((yearGroup, yIdx) => {
        const y = yIdx + 1;
        yearGroup.semesters.forEach((sem, sIdx) => {
          const t = sIdx + 1;
          sem.courses.forEach(c => {
            if (c.isProfessionalElective && peAssignments[c.id]) {
              const trackCourseId = peAssignments[c.id];
              // เทียบปี/เทอม ของ Slot วิชานั้นๆ กับ ปี/เทอม ปัจจุบันของนักศึกษา
              if (curY > y || (curY === y && curT > t)) finalCourseStates[trackCourseId] = 'passed';
              else if (curY === y && curT === t) finalCourseStates[trackCourseId] = 'learning';
              else delete finalCourseStates[trackCourseId];
            }
          });
        });
      });

      const payload = { 
        basicInfo, 
        courseStates: finalCourseStates, // ✅ ใช้ข้อมูลที่คลีนแล้วส่งไปเซฟ!
        customElectives, 
        peAssignments, 
        gpaHistory, 
        maxYear,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(payload));
      await axios.patch(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`, payload);
      navigate('/dashboard');
    } catch (e) { 
        console.error(e);
        alert("Backend connection error, but progress saved locally!");
        navigate('/dashboard'); 
    } finally { setLoading(false); }
  };

  const getTrackCourseName = (code) => {
    if (!code) return 'Select Track Course...';
    if (!allTrackCourses) return code; 

    try {
      if (Array.isArray(allTrackCourses)) {
        const found = allTrackCourses.find(c => c && (c.id === code || c.code === code));
        if (found) return found.name || found.nameEn;
      } else {
        if (allTrackCourses[code] && allTrackCourses[code].name) {
          return allTrackCourses[code].name || allTrackCourses[code].nameEn;
        }
        for (const key in allTrackCourses) {
          const group = allTrackCourses[key];
          if (!group || typeof group !== 'object') continue; 

          const coursesInGroup = Array.isArray(group) ? group : Object.values(group);
          const found = coursesInGroup.find(c => c && (c.id === code || c.code === code));
          if (found) return found.name || found.nameEn;
        }
      }
    } catch (err) {
      console.error("Error finding track name:", err);
    }
    return code; 
  };

  const handleSelectPE = (courseCode, courseData) => {
    if (Object.values(peAssignments).includes(courseCode)) {
      alert("คุณเลือกวิชา Track นี้ไปแล้วครับ!");
      return;
    }
    
    if (courseData.prereq && courseStates[courseData.prereq] !== 'passed') {
      alert(`ไม่สามารถลงได้! ต้องเรียนผ่านวิชา ${courseData.prereq} ก่อนครับ`);
      return;
    }

    setPeAssignments(p => ({...p, [activePeSlotId]: courseCode}));
    setShowPeModal(false);
  };

  const handleRemovePE = (slotId, e) => {
    e.stopPropagation(); 
    setPeAssignments(prev => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
  };

  // ✅ ระบบกรองวิชาโดยใช้ nodeTypeMap ที่ส่งมาให้
  const displayedTrackCourses = useMemo(() => {
    if (!selectedTrack || !allTrackCourses || !nodeTypeMap) return [];

    let trackKey = selectedTrack;
    // ปรับชื่อ key เล็กน้อยให้ตรงกับใน nodeTypeMap
    if (trackKey === 'Outside') trackKey = 'Outside'; 
    else trackKey = trackKey.toLowerCase();

    const trackNodes = nodeTypeMap[trackKey];
    if (!trackNodes) return [];

    const result = [];
    
    // วนลูปดูวิชาทั้งหมดใน courseData.js
    for (const [code, c] of Object.entries(allTrackCourses)) {
      if (c && typeof c === 'object') {
        // ถ้าวิชานี้มีรหัสอยู่ใน trackNodes ถือว่าเป็นวิชาของสายนี้
        if (trackNodes[code]) {
          // กรองวิชาประเภท 'base' ออกไป (เพราะเราจะให้เลือกแค่วิชาเลือก ไม่ใช่วิชาหลัก)
          if (trackNodes[code] !== 'base') {
            result.push({ code, id: code, ...c });
          }
        }
      }
    }
    return result;
  }, [selectedTrack]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans selection:bg-orange-500/30">
      
      {showElectiveModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-orange-400">เลือกวิชาเสริม</h3>
              <button onClick={() => setShowElectiveModal(false)}><XCircle size={32}/></button>
            </div>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500" placeholder="ค้นหาชื่อวิชา..." onChange={e => setElectiveSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {(electiveCourses || []).filter(e => e.name.toLowerCase().includes(electiveSearchTerm.toLowerCase())).map(e => (
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
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
              <h3 className="text-2xl font-black text-purple-400">เลือกวิชาเลือกเอก (PE)</h3>
              <button onClick={() => setShowPeModal(false)}><XCircle size={32}/></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
                {!selectedTrack ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tracks || []).map(t => (
                      <button key={t.id} onClick={() => setSelectedTrack(t.id)} className="p-6 rounded-3xl border-2 border-white/5 bg-white/5 hover:border-purple-500/50 transition-all text-left group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">{t.icon}</div>
                        <div className="font-black" style={{color: t.color}}>{t.label}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={()=>setSelectedTrack(null)} className="col-span-full w-fit px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 mb-4 flex items-center gap-2 transition-all">← ย้อนกลับ</button>
                    
                    {displayedTrackCourses.length === 0 ? (
                      <div className="col-span-full text-center text-slate-500 py-10">ไม่พบวิชาในสายนี้</div>
                    ) : (
                      displayedTrackCourses.map((c) => {
                        const courseCode = c.id || c.code;
                        return (
                          <div key={courseCode} onClick={() => handleSelectPE(courseCode, c)} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400">{courseCode}</span>
                              {c.prereq && <span className="text-[9px] text-slate-500 font-mono">Prereq: {c.prereq}</span>}
                            </div>
                            <p className="font-bold text-sm text-white">{c.name || c.nameEn}</p>
                            <p className="text-[10px] text-slate-400 mt-2">{c.credits || 3} หน่วยกิต</p>
                          </div>
                        )
                      })
                    )}
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
          <aside className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
            <div className="tech-card p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-xs font-black text-orange-400 tracking-[0.2em] mb-8 flex items-center gap-2 uppercase"><User size={16}/> Identity</h2>
              <div className="flex flex-col items-center mb-8">
                 <div className="w-24 h-24 rounded-full border-4 border-white/10 p-1 relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <img src={basicInfo.image} className="w-full h-full rounded-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Camera size={20}/></div>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                    const reader = new FileReader();
                    reader.onload = () => setBasicInfo(p => ({...p, image: reader.result}));
                    reader.readAsDataURL(e.target.files[0]);
                 }} />
              </div>
              <div className="space-y-4">
                <InputGroup 
                  label="Survivor Name" 
                  value={basicInfo.name} 
                  maxLength={25}
                  onChange={e => {
                    if (e.target.value.length <= 25) {
                      setBasicInfo(p => ({...p, name: e.target.value}))
                    }
                  }} 
                />
                <InputGroup 
                  label="Student ID" 
                  value={basicInfo.studentId} 
                  maxLength={13} 
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length <= 13) {
                      setBasicInfo(p => ({...p, studentId: val}))
                    }
                  }}
                />
              </div>
            </div>

            <div className="tech-card p-6 rounded-[2.5rem] bg-white/5 border border-white/10">
              <h2 className="text-xs font-black text-purple-400 tracking-[0.2em] mb-8 flex items-center gap-2 uppercase"><Calendar size={16}/> Timeline Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Years Control</p>
                    <div className="flex gap-2">
                        <button onClick={() => setMaxYear(m => Math.max(4, m - 1))} className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"><Minus size={14}/></button>
                        <button onClick={() => setMaxYear(m => m + 1)} className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-all"><Plus size={14}/></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({length: maxYear}, (_, i) => i + 1).map(y => (
                      <button key={y} onClick={() => { setBasicInfo(p => ({...p, currentYear: y})); applyTimelineLogic(y, basicInfo.currentTerm); }} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${basicInfo.currentYear === y ? 'bg-purple-600 scale-110 shadow-lg shadow-purple-500/30' : 'bg-white/5 text-slate-600'}`}>{y}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1,2].map(t => (
                    <button key={t} onClick={() => { setBasicInfo(p => ({...p, currentTerm: t})); applyTimelineLogic(basicInfo.currentYear, t); }} className={`py-3 rounded-xl font-black text-xs transition-all ${basicInfo.currentTerm === t ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white/5 text-slate-600'}`}>TERM {t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="tech-card p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <h2 className="text-xs font-black text-emerald-400 mb-4 uppercase flex items-center gap-2"><GraduationCap size={16}/> GPA History</h2>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({length: basicInfo.currentYear}, (_, yi) => yi + 1).flatMap(y => 
                  [1,2].map(t => {
                    const isPast = (y < basicInfo.currentYear) || (y === basicInfo.currentYear && t < basicInfo.currentTerm);
                    if (!isPast) return null;
                    const key = `Y${y}/${t}`;
                    return (
                      <div key={key} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-400">{key}</span>
                        <input 
                          type="number" 
                          min="0" max="4" step="0.01" 
                          value={gpaHistory[key] || ''} 
                          onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                          onChange={e => {
                            let v = e.target.value;
                            if (v > 4) v = 4;
                            setGpaHistory(p => ({...p, [key]: v}));
                          }} 
                          className={`w-14 bg-transparent text-right font-bold outline-none border-b 
                            ${!gpaHistory[key] ? 'border-red-500' : 'border-white/10 text-emerald-400'}`} 
                          placeholder="0.00" 
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex flex-wrap gap-1 sticky top-6 z-40 backdrop-blur-xl shadow-2xl">
               {Array.from({length: maxYear}, (_, i) => i + 1).map(y => (
                 <button key={y} onClick={() => setActiveYearTab(y)} className={`flex-1 min-w-[70px] py-2.5 rounded-xl font-black text-[10px] uppercase transition-all ${activeYearTab === y ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:bg-white/5'}`}>Year {y}</button>
               ))}
            </div>

            {currentYearData.map((yearGroup, yearIdx) => (
              <div key={yearIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yearGroup.semesters.map((sem, semIdx) => {
                  const termKey = `${activeYearTab}-${semIdx + 1}`;
                  const isLocked = activeYearTab > basicInfo.currentYear || (activeYearTab === basicInfo.currentYear && (semIdx+1) > basicInfo.currentTerm);
                  return (
                    <div key={semIdx} className={`p-8 rounded-[2.5rem] border transition-all ${isLocked ? 'bg-black/40 border-white/5 opacity-40 grayscale pointer-events-none' : 'bg-white/5 border-white/10 shadow-xl'}`}>
                      <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest flex items-center justify-between">{sem.term} {activeYearTab === basicInfo.currentYear && (semIdx+1) === basicInfo.currentTerm && <span className="text-orange-500 text-[9px] animate-pulse font-black uppercase">Active Now</span>}</h3>
                      <div className="space-y-2">
                        {(sem.courses || []).map(course => {
                          const status = courseStates[course.id];
                          if (course.isProfessionalElective) {
                            const assignedCode = peAssignments[course.id];
                            return (
                              <div key={course.id} onClick={() => { setActivePeSlotId(course.id); setShowPeModal(true); }} className={`p-4 rounded-xl border border-dashed flex justify-between items-center cursor-pointer transition-all ${assignedCode ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/5 border-white/10 hover:bg-purple-500/10'}`}>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">Track Course</p>
                                  <p className="font-bold text-xs truncate">
                                    {assignedCode ? getTrackCourseName(assignedCode) : 'Select Track Course...'}
                                  </p>
                                </div>
                                {assignedCode ? (
                                  <button onClick={(e) => handleRemovePE(course.id, e)} className="p-1.5 rounded-md hover:bg-red-500/20 group">
                                    <Trash2 size={16} className="text-red-500/60 group-hover:text-red-400 transition-colors"/>
                                  </button>
                                ) : (
                                  <Plus size={16} className="text-purple-500"/>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div key={course.id} onClick={() => handleCourseClick(course.id)} className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all hover:scale-[1.02] ${status === 'passed' ? 'bg-emerald-500/10 border-emerald-500/30' : status === 'learning' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
                              <div className="min-w-0"><p className="text-[9px] font-mono text-slate-500">{course.code}</p><p className="text-xs font-bold truncate">{course.name}</p></div>
                              {status === 'passed' ? <CheckCircle2 className="text-emerald-500" size={16}/> : status === 'learning' ? <PlayCircle className="text-blue-500" size={16}/> : <div className="w-4 h-4 rounded-full border border-white/10"/>}
                            </div>
                          );
                        })}
                        
                        {(customElectives[termKey] || []).map(id => {
                          const elecName = electiveCourses?.find(i => i.id === id)?.name || id;
                          return (
                            <div key={id} className="p-3 rounded-xl border border-orange-500/30 bg-orange-500/5 flex justify-between items-center group animate-in fade-in">
                              <div className="min-w-0"><p className="text-[9px] font-mono text-orange-400">ELECTIVE</p><p className="text-xs font-bold truncate">{elecName}</p></div>
                              <button onClick={() => handleRemoveElective(termKey, id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                            </div>
                          );
                        })}
                        <button onClick={() => { setActiveTermKey(termKey); setShowElectiveModal(true); }} className="w-full py-2.5 border-2 border-dashed border-white/5 rounded-xl text-[9px] font-black text-slate-600 hover:text-orange-400 hover:border-orange-500/40 transition-all flex items-center justify-center gap-2 mt-4"><Plus size={12}/> ADD ELECTIVE</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </main>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl p-6 flex justify-center z-[100] border-t border-white/10">
           <button 
              onClick={handleSubmit} 
              disabled={loading || Object.values(gpaHistory).some(v => !v) || Object.keys(gpaHistory).length === 0}
              title={
                loading 
                  ? "กำลังบันทึกข้อมูล..." 
                  : (Object.values(gpaHistory).some(v => !v) || Object.keys(gpaHistory).length === 0)
                    ? "กรุณากรอก GPA ให้ครบทุกช่องก่อนไปต่อ" 
                    : ""
              }
              
              className={`bg-white text-black font-black py-4 px-20 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] 
                transition-all flex items-center gap-3
                ${(loading || Object.values(gpaHistory).some(v => !v) || Object.keys(gpaHistory).length === 0)
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 active:scale-95 cursor-pointer'
                }`}
            >
              {loading ? 'SYNCING DATA...' : 'GENERATE DASHBOARD'} 
              <ChevronRight size={20}/>
            </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-bold text-slate-500 ml-1 uppercase">{label}</p>
    <input className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl focus:border-orange-500 outline-none text-sm font-bold transition-all" value={value} onChange={onChange} />
  </div>
);

export default SetupProfile;