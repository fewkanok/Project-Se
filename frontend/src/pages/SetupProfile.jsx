import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, AlertCircle, PlayCircle, Camera, Terminal, Plus, Minus, Trash2, Search } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import axios from 'axios';

const parseCredits = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = parseInt(val.charAt(0), 10);
    return isNaN(num) ? 3 : num;
  }
  return 3;
};

const getTrackCoursesArray = () => {
  const trackYearData = roadmapData?.find(y => y?.year === "Track Courses");
  return trackYearData?.semesters?.[0]?.courses || [];
};
const allTrackCoursesArray = getTrackCoursesArray();

const trackOptions = [
  { id: "SmartTech", label: "Smart Technology", color: "#059669", icon: "🤖" },
  { id: "AI", label: "Artificial Intelligence", color: "#7c3aed", icon: "🧠" },
  { id: "Games", label: "Games & Graphic", color: "#d97706", icon: "🎮" },
  { id: "Network", label: "Security & Network", color: "#0891b2", icon: "🔐" },
  { id: "FullStack", label: "Full-Stack Developer", color: "#db2777", icon: "🌐" }
];

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [showPeModal, setShowPeModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false); 
  
  const [activePeSlotId, setActivePeSlotId] = useState(null);
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [activeYearTab, setActiveYearTab] = useState(1);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  
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
      } catch (e) {}
    };
    fetchData();
  }, []);

  const findCourseById = useCallback((id) => {
    if (!id) return null;
    for (const yg of roadmapData) {
      if (yg?.year === 'Track Courses') continue;
      for (const sem of (yg?.semesters || [])) {
        const c = (sem?.courses || []).find(c => c?.id === id || c?.code === id);
        if (c) return { ...c, type: 'core' };
      }
    }
    const tCourse = allTrackCoursesArray.find(c => c?.id === id || c?.code === id);
    if (tCourse) return { ...tCourse, type: 'track' };
    const eCourse = (electiveCourses || []).find(e => e?.id === id || e?.code === id);
    if (eCourse) return { ...eCourse, type: 'elective', id: eCourse.id || eCourse.code };
    return null;
  }, []);

  const calculateTotalPassedCredits = useCallback(() => {
    let sum = 0;
    Object.entries(courseStates).forEach(([id, state]) => {
      if (state === 'passed') {
        const c = findCourseById(id);
        if (c) sum += parseCredits(c.credits);
      }
    });
    return sum;
  }, [courseStates, findCourseById]);

  const checkPrerequisites = useCallback((courseId, prereqStr) => {
    if (courseId === '040613141' || String(prereqStr).includes('102')) {
      const totalPassed = calculateTotalPassedCredits();
      if (totalPassed < 102) return `ต้องมีหน่วยกิตสะสมอย่างน้อย 102 หน่วยกิต (ปัจจุบันมี ${totalPassed})`;
      return true;
    }
    if (courseId === '040613142') {
      if (!courseStates['040613141']) return `ต้องลงทะเบียนเรียน Special Project I (040613141) ให้เรียบร้อยก่อนครับ`;
      return true;
    }
    if (!prereqStr || prereqStr === 'null' || prereqStr === 'none' || String(prereqStr).trim() === '') return true;
    const prereqs = String(prereqStr).split(',').map(p => p.trim().split(' ')[0]);
    const missing = prereqs.filter(p => !courseStates[p]);
    if (missing.length > 0) return `ติดเงื่อนไข Prerequisite: ต้องลงวิชา ${missing.join(', ')} ก่อนครับ`;
    return true;
  }, [courseStates, calculateTotalPassedCredits]);

  const applyTimelineLogic = (targetYear, targetTerm) => {
    const nextStates = { ...courseStates };
    roadmapData.forEach((yearGroup, yIdx) => {
      if (yearGroup?.year === 'Track Courses') return; 
      const yMatch = String(yearGroup?.year || '').match(/\d+/);
      const y = yMatch ? parseInt(yMatch[0], 10) : (yIdx + 1);
      (yearGroup?.semesters || []).forEach((sem, sIdx) => {
        const t = sIdx + 1;
        (sem?.courses || []).forEach(course => {
          if (!course) return;
          if (course.isProfessionalElective) {
            delete nextStates[course.id]; 
            const assignedCode = peAssignments[course.id];
            if (assignedCode) {
              if (targetYear > y || (targetYear === y && targetTerm > t)) nextStates[assignedCode] = 'passed';
              else if (targetYear === y && targetTerm === t) nextStates[assignedCode] = 'learning';
              else delete nextStates[assignedCode];
            }
          } else {
            if (targetYear > y || (targetYear === y && targetTerm > t)) nextStates[course.id] = 'passed';
            else if (targetYear === y && targetTerm === t) nextStates[course.id] = 'learning';
            else delete nextStates[course.id];
          }
        });
      });
    });
    Object.entries(customElectives).forEach(([termKey, courseIds]) => {
      const [yStr, tStr] = String(termKey).split('-');
      const y = parseInt(yStr, 10), t = parseInt(tStr, 10);
      (courseIds || []).forEach(id => {
        if (targetYear > y || (targetYear === y && targetTerm > t)) nextStates[id] = 'passed';
        else if (targetYear === y && targetTerm === t) nextStates[id] = 'learning';
        else delete nextStates[id];
      });
    });
    setCourseStates(nextStates);
  };

  const calculateTermCredits = useCallback((y, t) => {
    let sum = 0;
    const termKey = `${y}-${t}`;
    const termData = roadmapData.find(yg => yg?.year === `Year ${y}` || String(yg?.year || '').includes(y.toString()))?.semesters?.[t - 1];
    if (termData) {
      (termData.courses || []).forEach(c => {
        if (!c) return;
        if (c.isProfessionalElective) {
          const assignedCode = peAssignments[c.id];
          if (assignedCode) {
            const courseObj = findCourseById(assignedCode);
            if (courseObj) sum += parseCredits(courseObj.credits);
          }
        } else {
          if (courseStates[c.id]) {
            sum += parseCredits(c.credits);
          }
        }
      });
    }
    (customElectives[termKey] || []).forEach(courseId => {
      const courseObj = findCourseById(courseId);
      if (courseObj) sum += parseCredits(courseObj.credits);
    });
    return sum;
  }, [peAssignments, courseStates, customElectives, findCourseById]);

  const handleCourseClick = (id) => {
    const courseObj = findCourseById(id);
    if (courseObj && courseObj.prereq && !courseStates[id]) {
      const prereqCheck = checkPrerequisites(id, courseObj.prereq);
      if (prereqCheck !== true) {
        alert(prereqCheck);
        return;
      }
    }
    setCourseStates(prev => {
        const current = prev[id];
        let next = !current ? 'passed' : current === 'passed' ? 'learning' : undefined;
        const updated = { ...prev };
        if (next) updated[id] = next; else delete updated[id];
        return updated;
    });
  };

  const currentYearData = useMemo(() => {
    if (activeYearTab <= 4) {
      return roadmapData.filter(y => y?.year === `Year ${activeYearTab}` || String(y?.year || '').includes(activeYearTab.toString()));
    }
    return [{
      year: `Year ${activeYearTab}`,
      semesters: [
        { term: 'Semester 1', courses: [] },
        { term: 'Semester 2', courses: [] }
      ]
    }];
  }, [activeYearTab]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const session = JSON.parse(localStorage.getItem('active_session'));

      // 🛡️ Logic ลบวิชาซ้ำก่อนส่ง Generate
      const usedIdsInPlan = new Set();
      roadmapData.forEach(yg => {
        if (yg.year === "Track Courses") return;
        yg.semesters.forEach(sem => {
          sem.courses.forEach(c => {
            if (!c.isProfessionalElective) usedIdsInPlan.add(c.id);
          });
        });
      });
      Object.values(peAssignments).forEach(id => usedIdsInPlan.add(id));

      const cleanCustomElectives = {};
      Object.entries(customElectives).forEach(([key, ids]) => {
        const uniqueIds = (ids || []).filter(id => {
          if (usedIdsInPlan.has(id)) return false;
          usedIdsInPlan.add(id);
          return true;
        });
        if (uniqueIds.length > 0) cleanCustomElectives[key] = uniqueIds;
      });

      const payload = { 
        basicInfo, 
        courseStates, 
        customElectives: cleanCustomElectives, 
        peAssignments, 
        gpaHistory, 
        maxYear,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(payload));
      await axios.patch(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`, payload);
      navigate('/dashboard');
    } catch (e) { 
        alert("บันทึกข้อมูลแบบ Offline สำเร็จ! (ไม่สามารถเชื่อมต่อ Server ได้ในขณะนี้)");
        navigate('/dashboard'); 
    } finally { setLoading(false); }
  };

  const handleSelectPE = (courseCode, courseData) => {
    const prereqCheck = checkPrerequisites(courseCode, courseData.prereq);
    if (prereqCheck !== true) {
      alert(prereqCheck);
      return;
    }
    setPeAssignments(p => ({...p, [activePeSlotId]: courseCode}));
    const [yStr, tStr] = String(activeTermKey).split('-');
    const y = parseInt(yStr, 10), t = parseInt(tStr, 10);
    let newState = undefined;
    if (basicInfo.currentYear > y || (basicInfo.currentYear === y && basicInfo.currentTerm > t)) newState = 'passed';
    else if (basicInfo.currentYear === y && basicInfo.currentTerm === t) newState = 'learning';
    if (newState) {
      setCourseStates(p => ({...p, [courseCode]: newState}));
    }
    setShowPeModal(false);
  };

  const handleRemovePE = (slotId, code, e) => {
    e.stopPropagation(); 
    setPeAssignments(prev => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    setCourseStates(p => { const next = {...p}; delete next[code]; return next; });
  };

  const handleAddCustomCourse = (courseId) => {
    const courseObj = findCourseById(courseId);
    if (courseObj && courseObj.prereq) {
      const prereqCheck = checkPrerequisites(courseId, courseObj.prereq);
      if (prereqCheck !== true) {
        alert(prereqCheck);
        return;
      }
    }
    setCustomElectives(prev => ({
      ...prev,
      [activeTermKey]: [...(prev[activeTermKey] || []), courseId]
    }));
    const [yStr, tStr] = String(activeTermKey).split('-');
    const y = parseInt(yStr, 10), t = parseInt(tStr, 10);
    let newState = undefined;
    if (basicInfo.currentYear > y || (basicInfo.currentYear === y && basicInfo.currentTerm > t)) newState = 'passed';
    else if (basicInfo.currentYear === y && basicInfo.currentTerm === t) newState = 'learning';
    if (newState) {
      setCourseStates(p => ({...p, [courseId]: newState}));
    }
    setShowAddCourseModal(false);
  };

  const handleRemoveCustomCourse = (termKey, id) => {
    setCustomElectives(prev => ({
      ...prev,
      [termKey]: prev[termKey].filter(i => i !== id)
    }));
    setCourseStates(p => { const next = {...p}; delete next[id]; return next; });
  };

  const displayedTrackCourses = useMemo(() => {
    if (!selectedTrack || allTrackCoursesArray.length === 0) return [];
    const [targetYStr, targetT] = activeTermKey ? String(activeTermKey).split('-') : [null, null]; 
    const targetY = parseInt(targetYStr, 10);
    const allAssignedPE = Object.values(peAssignments);
    const allSelectedCustom = Object.values(customElectives).flat();
    return allTrackCoursesArray.filter(c => {
      if (!c) return false;
      const cId = c.id || c.code;
      if (c.track !== selectedTrack && c.track !== 'Common') return false;
      if (cId === '040613141' || cId === '040613142') return false; 
      if (allAssignedPE.includes(cId) || allSelectedCustom.includes(cId)) return false;
      if (courseStates[cId]) return false;
      if (c.availableTerms && targetT && targetY) {
         const matchesTerm = c.availableTerms.some(tStr => {
           const [availY, availT] = String(tStr).split('/');
           return parseInt(availY, 10) <= targetY && availT === targetT;
         });
         if (!matchesTerm) return false;
      }
      return true;
    });
  }, [selectedTrack, activeTermKey, courseStates, peAssignments, customElectives]);

  const matchSearch = (c, term) => {
    if (!term || !c) return true;
    const name = (c.name || '').toLowerCase();
    const nameEn = (c.nameEn || '').toLowerCase();
    const code = (c.code || c.id || '').toLowerCase();
    return name.includes(term) || nameEn.includes(term) || code.includes(term);
  };

  const availableCoursesToAdd = useMemo(() => {
    if (!activeTermKey) return [];
    const [targetYStr, targetT] = String(activeTermKey).split('-'); 
    const targetY = parseInt(targetYStr, 10);
    const term = (courseSearchTerm || '').toLowerCase();
    const allSelectedCustom = Object.values(customElectives).flat();
    const allAssignedPE = Object.values(peAssignments);
    const results = [];
    roadmapData.forEach(yg => {
      if (yg?.year === 'Track Courses') return;
      const match = String(yg?.year || '').match(/\d+/);
      const courseYear = match ? parseInt(match[0], 10) : 1;
      if (courseYear > targetY) return; 
      (yg?.semesters || []).forEach((sem, sIdx) => {
        const semTermNum = (sIdx + 1).toString();
        (sem?.courses || []).forEach(c => {
          if (!c) return;
          const upperName = (c.name || '').toUpperCase();
          if (c.isProfessionalElective || upperName.includes('PROFESSIONAL') || upperName.includes('ELECTIVE')) return; 
          if (semTermNum !== targetT) return; 
          if (courseStates[c.id] || allSelectedCustom.includes(c.id)) return;
          if (!matchSearch(c, term)) return;
          results.push({...c, type: 'core'});
        });
      });
    });
    allTrackCoursesArray.forEach(c => {
      if (!c) return;
      const cId = c.id || c.code;
      if (courseStates[cId] || allAssignedPE.includes(cId) || allSelectedCustom.includes(cId)) return;
      if (c.availableTerms && c.availableTerms.length > 0) {
        const canTake = c.availableTerms.some(termStr => {
          const [y, t] = String(termStr).split('/');
          return parseInt(y, 10) <= targetY && t === targetT;
        });
        if (!canTake) return;
      } else {
        if (targetY < 2) return; 
      }
      if (!matchSearch(c, term)) return;
      results.push({...c, type: 'track', id: cId});
    });
    (electiveCourses || []).forEach(e => {
      if (!e) return;
      const eId = e.id || e.code;
      if (courseStates[eId] || allAssignedPE.includes(eId) || allSelectedCustom.includes(eId)) return;
      if (!matchSearch(e, term)) return;
      results.push({...e, type: 'elective', id: eId});
    });
    return results;
  }, [activeTermKey, courseSearchTerm, courseStates, customElectives, peAssignments]);

  const currentTermCredits = calculateTermCredits(basicInfo.currentYear, basicInfo.currentTerm);
  const isExtensionYear = parseInt(basicInfo.currentYear, 10) >= 5;
  const isCreditInvalid = currentTermCredits > 0 && (isExtensionYear ? (currentTermCredits > 21) : (currentTermCredits < 12 || currentTermCredits > 21));
  const isGpaEmpty = Object.values(gpaHistory).some(v => !v) || Object.keys(gpaHistory).length === 0;
  const isSubmitDisabled = loading || isGpaEmpty || isCreditInvalid;
  const activeYearGroupInfo = roadmapData.find(y => y?.year === `Year ${basicInfo.currentYear}` || String(y?.year || '').includes(basicInfo.currentYear.toString()));
  const currentTermCount = activeYearGroupInfo?.semesters?.length || 2;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans selection:bg-orange-500/30">
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] max-w-3xl w-full p-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-cyan-400">เพิ่มรายวิชา (Add Course)</h3>
                <p className="text-slate-400 text-sm mt-1">เทอม {activeTermKey?.replace('-', '/')}</p>
              </div>
              <button onClick={() => setShowAddCourseModal(false)}><XCircle size={32}/></button>
            </div>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-cyan-500 text-lg" placeholder="ค้นหา รหัสวิชา หรือ ชื่อวิชา (รวมวิชาเสรี)..." onChange={e => setCourseSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {availableCoursesToAdd.length === 0 ? (
                <div className="text-center text-slate-500 py-10 flex flex-col items-center gap-3">
                  <BookOpen size={40} className="text-slate-700"/>
                  <p>ไม่มีวิชาที่ตรงเงื่อนไข (คุณอาจเรียนผ่านไปหมดแล้ว)</p>
                </div>
              ) : (
                availableCoursesToAdd.map(c => {
                  if (!c) return null;
                  const typeColors = {
                    core: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'วิชาหลัก' },
                    track: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'วิชาเลือก/เฉพาะ' },
                    elective: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'วิชาเสรี' },
                  };
                  const colors = typeColors[c.type] || typeColors.core;
                  return (
                    <div key={c.id || c.code} onClick={() => handleAddCustomCourse(c.id || c.code)} className={`p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/50 cursor-pointer transition-all flex justify-between items-center group`}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>{c.code || c.id}</span>
                          <span className={`text-[9px] font-mono border px-1.5 rounded-full ${colors.border} ${colors.text}`}>{colors.label}</span>
                        </div>
                        <p className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{c.nameEn || c.name}</p>
                        {c.nameEn && <p className="text-[10px] text-slate-400">{c.name}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-500">{parseCredits(c.credits)} หน่วยกิต</span>
                          {c.prereq && <span className="text-[9px] text-amber-500 font-mono">Prereq: {c.prereq}</span>}
                        </div>
                      </div>
                      <Plus size={24} className="text-slate-600 group-hover:text-cyan-400 transition-colors"/>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      {showPeModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
              <h3 className="text-2xl font-black text-purple-400">เลือกวิชาเฉพาะสาขา (PE) - เทอม {activeTermKey?.replace('-', '/')}</h3>
              <button onClick={() => setShowPeModal(false)}><XCircle size={32}/></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
                {!selectedTrack ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackOptions.map(t => (
                      <button key={t.id} onClick={() => setSelectedTrack(t.id)} className="p-6 rounded-3xl border-2 border-white/5 bg-white/5 hover:border-purple-500/50 transition-all text-left group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">{t.icon}</div>
                        <div className="font-black" style={{color: t.color}}>{t.label}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={()=>setSelectedTrack(null)} className="col-span-full w-fit px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 mb-4 flex items-center gap-2 transition-all">← ย้อนกลับหมวดหมู่</button>
                    {displayedTrackCourses.length === 0 ? (
                      <div className="col-span-full text-center text-slate-500 py-10 flex flex-col items-center gap-3">
                        <AlertCircle size={40} className="text-slate-600"/>
                        <p>ไม่มีวิชาที่เลือกได้ในสายนี้ (คุณอาจเรียนผ่านไปแล้ว เปิดไม่ตรงเทอม หรือเลือกวิชาครบแล้ว)</p>
                      </div>
                    ) : (
                      displayedTrackCourses.map((c) => {
                        if (!c) return null;
                        const courseCode = c.id || c.code;
                        return (
                          <div key={courseCode} onClick={() => handleSelectPE(courseCode, c)} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400">{courseCode}</span>
                              {c.prereq && <span className="text-[9px] text-slate-500 font-mono">Prereq: {c.prereq}</span>}
                            </div>
                            <p className="font-bold text-sm text-white group-hover:text-cyan-300">{c.name || c.nameEn}</p>
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
                <div className={`grid grid-cols-${currentTermCount > 2 ? '3' : '2'} gap-3`}>
                  {Array.from({length: currentTermCount}, (_, i) => i + 1).map(t => {
                    let termLabel = `TERM ${t}`;
                    if (basicInfo.currentYear === 4) {
                      termLabel = t === 1 ? 'SUMMER' : t === 2 ? 'TERM 1' : 'TERM 2';
                    }
                    return (
                      <button key={t} onClick={() => { setBasicInfo(p => ({...p, currentTerm: t})); applyTimelineLogic(basicInfo.currentYear, t); }} className={`py-3 rounded-xl font-black text-[10px] transition-all ${basicInfo.currentTerm === t ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white/5 text-slate-600'}`}>
                        {termLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="tech-card p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <h2 className="text-xs font-black text-emerald-400 mb-4 uppercase flex items-center gap-2"><GraduationCap size={16}/> GPA History</h2>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({length: basicInfo.currentYear}, (_, yi) => yi + 1).flatMap(y => {
                  const yg = roadmapData.find(ry => ry?.year === `Year ${y}` || String(ry?.year || '').includes(y.toString()));
                  const tCount = yg?.semesters?.length || 2;
                  return Array.from({length: tCount}, (_, ti) => ti + 1).map(t => {
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
                })}
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
              <div key={yearIdx} className={`grid grid-cols-1 ${yearGroup?.semesters?.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {(yearGroup?.semesters || []).map((sem, semIdx) => {
                  if (!sem) return null;
                  const termKey = `${activeYearTab}-${semIdx + 1}`;
                  const isLocked = activeYearTab > basicInfo.currentYear || (activeYearTab === basicInfo.currentYear && (semIdx+1) > basicInfo.currentTerm);
                  const isActiveNow = activeYearTab === basicInfo.currentYear && (semIdx+1) === basicInfo.currentTerm;
                  
                  const termCredits = calculateTermCredits(activeYearTab, semIdx + 1);
                  const isCreditOk = termCredits === 0 || (isExtensionYear ? termCredits <= 21 : (termCredits >= 12 && termCredits <= 21));

                  let termHeaderLabel = sem.term;
                  if (activeYearTab === 4) {
                    termHeaderLabel = semIdx === 0 ? 'Summer Internship' : semIdx === 1 ? 'Special Project I' : 'Special Project II';
                  }

                  return (
                    <div key={semIdx} className={`p-8 rounded-[2.5rem] border transition-all ${isLocked ? 'bg-black/40 border-white/5 opacity-40 grayscale pointer-events-none' : 'bg-white/5 border-white/10 shadow-xl'}`}>
                      <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {termHeaderLabel}
                          {!isLocked && (
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${isCreditOk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                              {termCredits} / 21 Cr.
                            </span>
                          )}
                        </div>
                        {isActiveNow && <span className="text-orange-500 text-[9px] animate-pulse font-black uppercase">Active Now</span>}
                      </h3>
                      <div className="space-y-2">
                        {(sem.courses || []).map(course => {
                          if (!course) return null;
                          const isPeSlot = course.isProfessionalElective;
                          const status = courseStates[course.id];
                          if (isPeSlot) {
                            const assignedCode = peAssignments[course.id];
                            const courseObj = assignedCode ? findCourseById(assignedCode) : null;
                            const assignedStatus = courseStates[assignedCode];
                            
                            return (
                              <div 
                                key={course.id} 
                                onClick={() => { 
                                  if (assignedCode) {
                                    handleCourseClick(assignedCode); 
                                  } else {
                                    setActivePeSlotId(course.id); 
                                    setActiveTermKey(termKey); 
                                    setShowPeModal(true); 
                                  }
                                }} 
                                className={`p-4 rounded-xl border border-dashed flex justify-between items-center cursor-pointer transition-all ${assignedCode ? 'bg-purple-500/10 border-purple-500/40 hover:scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-purple-500/10'}`}
                              >
                                <div className="min-w-0">
                                  <p className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">Track Course</p>
                                  <p className="font-bold text-xs truncate">
                                    {courseObj ? (courseObj.nameEn || courseObj.name) : 'เลือกวิชาเฉพาะสาขา...'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {assignedStatus === 'passed' && <CheckCircle2 className="text-emerald-500" size={16}/>}
                                  {assignedStatus === 'learning' && <PlayCircle className="text-blue-500" size={16}/>}
                                  {assignedCode ? (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleRemovePE(course.id, assignedCode, e);
                                      }} 
                                      className="p-1.5 rounded-md hover:bg-red-500/20 group z-10"
                                    >
                                      <Trash2 size={16} className="text-red-500/60 group-hover:text-red-400 transition-colors"/>
                                    </button>
                                  ) : (
                                    <Plus size={16} className="text-purple-500"/>
                                  )}
                                </div>
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
                          const courseObj = findCourseById(id);
                          if (!courseObj) return null;
                          const isCore = courseObj.type === 'core';
                          const isTrack = courseObj.type === 'track';
                          const colorTheme = isCore ? 'blue' : isTrack ? 'purple' : 'orange';
                          const label = isCore ? 'CORE COURSE' : isTrack ? 'TRACK COURSE' : 'ELECTIVE';
                          const status = courseStates[id];
                          return (
                            <div key={id} onClick={() => handleCourseClick(id)} className={`p-3 rounded-xl border border-${colorTheme}-500/30 bg-${colorTheme}-500/5 flex justify-between items-center group animate-in fade-in cursor-pointer`}>
                              <div className="min-w-0">
                                <p className={`text-[9px] font-mono text-${colorTheme}-400`}>{label} • {courseObj.code || id}</p>
                                <p className="text-xs font-bold truncate">{courseObj.nameEn || courseObj.name}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {status === 'passed' && <CheckCircle2 className="text-emerald-500" size={16}/>}
                                {status === 'learning' && <PlayCircle className="text-blue-500" size={16}/>}
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveCustomCourse(termKey, id); }} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                              </div>
                            </div>
                          );
                        })}
                        <button onClick={() => { setActiveTermKey(termKey); setShowAddCourseModal(true); }} className={`w-full py-2.5 border-2 border-dashed border-white/5 rounded-xl text-[9px] font-black text-slate-600 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 mt-4`}>
                          <Plus size={12}/> เพิ่มรายวิชา / วิชาเสรี
                        </button>
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
              disabled={isSubmitDisabled}
              title={
                loading 
                  ? "กำลังบันทึกข้อมูล..." 
                  : isGpaEmpty 
                    ? "กรุณากรอก GPA ให้ครบทุกช่องก่อนไปต่อ" 
                    : isCreditInvalid
                      ? `เทอมปัจจุบันต้องมี 12-21 หน่วยกิต (ตอนนี้ ${currentTermCredits} Cr.)`
                      : ""
              }
              className={`bg-white text-black font-black py-4 px-20 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] 
                transition-all flex items-center gap-3
                ${isSubmitDisabled
                  ? 'opacity-50 cursor-not-allowed bg-slate-300' 
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