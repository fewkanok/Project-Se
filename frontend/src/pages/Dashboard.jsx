import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, LogOut, Settings, Target, Trophy, Star, Sparkles, ArrowUpRight, ChevronRight, Activity, Flame, BarChart3, Cpu, Layers, Grid3x3, CheckCircle2, XCircle, AlertTriangle, X, Check, FileText, Shield, ShieldAlert, ShieldCheck, Medal, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses } from '../data/courseData';
import axios from 'axios';

// --- Configuration: Co-op Requirements ---
const COOP_REQUIREMENTS = {
  minCredits: 90,
  minGPA: 2.75,
  targetCourses: [
    "040613203", "040613205", "040613204", "040613302", "040613501",
    "040613306", "040613502", "040613301", "040613601", "040613701"
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [animatedGPA, setAnimatedGPA] = useState(0);
  const [animatedCredits, setAnimatedCredits] = useState(0);

  // --- 1. State Management ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [honorsChecks, setHonorsChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('honorsChecks');
      return saved ? JSON.parse(saved) : { noFGrade: false, noRegrade: false };
    } catch { return { noFGrade: false, noRegrade: false }; }
  });

  const toggleHonorsCheck = (key) => {
    setHonorsChecks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem('honorsChecks', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // --- 2. Data Fetching (useEffect แรก) ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionData = localStorage.getItem('active_session');
        const session = sessionData ? JSON.parse(sessionData) : null;

        if (session && session.id) {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`);
          if (response.data && response.data.profileData) {
            setProfile(response.data.profileData);
            localStorage.setItem('userProfile', JSON.stringify(response.data.profileData));
          } else {
            const saved = localStorage.getItem('userProfile');
            setProfile(saved ? JSON.parse(saved) : null);
          }
        }
      } catch (error) {
        console.error("Fetch Profile Error:", error);
        const saved = localStorage.getItem('userProfile');
        setProfile(saved ? JSON.parse(saved) : null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- 3. Calculation Logic (useMemo) ---
  const stats = useMemo(() => {
    // 🛡️ Guard Clause: ป้องกันโค้ดพังถ้า profile ยังไม่มา
    if (!profile) return { totalCredits: 0, earnedCredits: 0, activeCoursesList: [], calculatedGPAX: 0, graphData: [], progressPercent: 0, coopStats: { isFullyEligible: false, courseDetails: [] } };

    let totalStructureCredits = 0;
    let earnedCredits = 0;
    let activeCoursesList = [];
    let totalPoints = 0;
    let totalGradedCredits = 0;
    let graphData = [];
    let passedCourseCodes = new Set();

    const currentYearNum = parseInt(profile.basicInfo?.currentYear || profile.currentYear) || 1;
    const currentTermNum = parseInt(profile.basicInfo?.currentTerm || profile.currentTerm) || 1;
    const customElectives = profile.customElectives || {};
    const peAssignments = profile.peAssignments || {};

    const parseCredits = (val) => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      const num = parseInt(val, 10);
      return !isNaN(num) ? num : 3;
    };

    const peSlotCourseMap = {};
    Object.entries(peAssignments).forEach(([slotId, courseCode]) => {
      const trackCourse = allTrackCourses?.[courseCode];
      if (trackCourse) {
        peSlotCourseMap[slotId] = {
          ...trackCourse,
          id: courseCode,
          code: courseCode,
          name: trackCourse.nameEn || trackCourse.name,
          credits: parseCredits(trackCourse.credits),
          _peSlot: slotId,
        };
      }
    });

    let coopGrades = {};
    try {
      const saved = localStorage.getItem('coopGradeStates');
      if (saved) coopGrades = JSON.parse(saved);
    } catch (e) {}

    roadmapData.forEach((yearGroup, yIdx) => {
      const yearNum = yIdx + 1;
      yearGroup.semesters.forEach((sem, sIdx) => {
        const termNum = sIdx + 1;
        const termKey = `${yearNum}-${termNum}`;
        const gpaKey = `Y${yearNum}/${termNum}`;

        let displayCourses = sem.courses.reduce((acc, c) => {
          if (c.isProfessionalElective) {
            if (peSlotCourseMap[c.id]) acc.push(peSlotCourseMap[c.id]);
            return acc;
          }
          acc.push(c);
          return acc;
        }, []);

        if (customElectives[termKey]) {
          customElectives[termKey].forEach(elecId => {
            const elecInfo = electiveCourses.find(c => c.id === elecId);
            if (elecInfo) displayCourses.push({ ...elecInfo, isElective: true });
          });
        }

        let termPassedCredits = 0;
        displayCourses.forEach(c => {
          const status = profile.courseStates?.[c.id];
          const safeCredits = parseCredits(c.credits);
          if (!c.isElective) totalStructureCredits += safeCredits;
          if (status === 'learning') {
            activeCoursesList.push({
              ...c,
              credits: safeCredits,
              termLabel: c.isElective ? `Free Elective (Y${yearNum}/${termNum})` : c._peSlot ? `Prof. Elective (Y${yearNum}/${termNum})` : sem.term
            });
          }
          if (status === 'passed') {
            earnedCredits += safeCredits;
            termPassedCredits += safeCredits;
            passedCourseCodes.add(c.code);
            passedCourseCodes.add(c.id);
          }
        });

        if ((yearNum < currentYearNum) || (yearNum === currentYearNum && termNum < currentTermNum)) {
          const historyGradeStr = profile.gpaHistory?.[gpaKey];
          if (historyGradeStr && !isNaN(parseFloat(historyGradeStr))) {
            const termGPA = parseFloat(historyGradeStr);
            const weight = termPassedCredits > 0 ? termPassedCredits : sem.courses.reduce((a, b) => a + parseCredits(b.credits), 0);
            totalPoints += (termGPA * weight);
            totalGradedCredits += weight;
            graphData.push({ term: gpaKey, year: yearNum, semester: termNum, gpa: parseFloat(termGPA.toFixed(2)), fullTerm: sem.term, credits: weight });
          }
        }
      });
    });

    let calculatedGPAX = totalGradedCredits > 0 ? Math.floor((totalPoints / totalGradedCredits) * 100) / 100 : 0;
    const progressPercent = totalStructureCredits > 0 ? Math.round((earnedCredits / totalStructureCredits) * 100) : 0;

    const coopCourseDetails = COOP_REQUIREMENTS.targetCourses.map(code => {
      let courseName = "Unknown Course";
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => { if(c.code === code) courseName = c.name; })));
      return { code, name: courseName, isPassed: passedCourseCodes.has(code), grade: coopGrades[code] || null };
    });

    let gpa10Sum = 0, gpa10Count = 0;
    coopCourseDetails.forEach(c => { if (c.isPassed && c.grade !== null) { gpa10Sum += c.grade; gpa10Count++; } });
    const gpa10 = gpa10Count > 0 ? gpa10Sum / gpa10Count : null;

    return { totalCredits: totalStructureCredits, earnedCredits, activeCoursesList, calculatedGPAX, graphData, progressPercent,
      coopStats: { isCreditReady: earnedCredits >= 90, isGPAReady: calculatedGPAX >= 2.75, isCoursesReady: (coopCourseDetails.filter(c => c.isPassed).length === COOP_REQUIREMENTS.targetCourses.length) && (gpa10 >= 2.5), passedCount: coopCourseDetails.filter(c => c.isPassed).length, totalCount: COOP_REQUIREMENTS.targetCourses.length, courseDetails: coopCourseDetails, gpa10, gpa10Count, isFullyEligible: earnedCredits >= 90 && calculatedGPAX >= 2.75 && gpa10 >= 2.5 }
    };
  }, [profile]);

  // --- 4. Academic Analysis (useMemo) ---
  const academicStatus = useMemo(() => {
    if (!profile || stats.graphData.length === 0) return { status: 'NORMAL', message: 'สถานะปกติ', detail: 'รอผลการเรียน', color: 'emerald', riskLevel: 10, prediction: null };
    
    const sortedHistory = [...stats.graphData].sort((a, b) => a.year !== b.year ? a.year - b.year : a.semester - b.semester);
    let lowProCount = 0, highProCount = 0, accumulatedPoints = 0, accumulatedCredits = 0;

    for (let termData of sortedHistory) {
      accumulatedPoints += (termData.gpa * termData.credits);
      accumulatedCredits += termData.credits;
      if (termData.year >= 2) {
        if (termData.gpa < 1.75) { lowProCount++; highProCount = 0; }
        else if (termData.gpa < 2.00) { highProCount++; lowProCount = 0; }
        else { lowProCount = 0; highProCount = 0; }
      }
    }

    const latestGPAX = accumulatedCredits > 0 ? (accumulatedPoints / accumulatedCredits) : 0;
    const avgCredits = accumulatedCredits / sortedHistory.length;
    const neededGPA = ((2.0 * (accumulatedCredits + avgCredits)) - accumulatedPoints) / avgCredits;

    if (lowProCount === 1) return { status: 'CRITICAL', message: 'ภาวะวิกฤต (โปรต่ำ)', detail: `GPA ต่ำกว่า 1.75 อีกครั้งจะพ้นสภาพ`, color: 'red', riskLevel: 90, prediction: { label: 'เป้าหมายเทอมหน้า', value: neededGPA > 4 ? "ยากมาก" : neededGPA.toFixed(2), credits: Math.round(avgCredits) } };
    return { status: 'NORMAL', message: 'สถานะปกติ', detail: `GPAX ${latestGPAX.toFixed(2)} ปลอดภัย`, color: 'emerald', riskLevel: 10, prediction: null };
  }, [profile, stats]);

  // --- 5. Animation (useEffect) ---
  useEffect(() => {
    if (!profile) return;
    const duration = 2000, steps = 60;
    const gpaInc = stats.calculatedGPAX / steps, credInc = stats.earnedCredits / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur++;
      setAnimatedGPA(p => Math.min(p + gpaInc, stats.calculatedGPAX));
      setAnimatedCredits(p => Math.min(p + credInc, stats.earnedCredits));
      if (cur >= steps) { clearInterval(timer); setAnimatedGPA(stats.calculatedGPAX); setAnimatedCredits(stats.earnedCredits); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [profile, stats.calculatedGPAX, stats.earnedCredits]);

  // --- 6. Helper Functions ---
  const handleLogout = () => { if(window.confirm('ต้องการออกจากระบบหรือไม่?')){ localStorage.removeItem('active_session'); localStorage.removeItem('token'); navigate('/login'); } };
  const handleEditSetup = () => navigate('/setup');
  const getGradeInfo = (gpa) => {
    if (gpa >= 3.5) return { gradient: 'from-emerald-400 to-cyan-400', bg: 'from-emerald-500/20 to-cyan-500/10', label: 'EXCELLENT', icon: '🏆' };
    return { gradient: 'from-blue-400 to-sky-400', bg: 'from-blue-500/20 to-sky-500/10', label: 'GOOD', icon: '⭐' };
  };
  const gradeInfo = getGradeInfo(stats.calculatedGPAX);

  const getHonorsInfo = (gpax, earned, total, checks) => {
    const hasEnough = total > 0 && earned >= total;
    const allMet = checks.noFGrade && checks.noRegrade && hasEnough;
    if (gpax >= 3.50) return { tier: allMet ? 1 : 'pending', label: 'เกียรตินิยมอันดับ 1', labelEn: '1st Class Honors', gradient: 'from-yellow-400 to-orange-400', bg: 'from-yellow-500/20 to-orange-500/10', border: allMet ? 'border-yellow-500/50' : 'border-yellow-500/20', icon: '🥇', gpaxOk: true, allConditionsMet: allMet, hasEnoughCredits: hasEnough };
    return { tier: 0, label: 'ยังไม่ถึงเกณฑ์ GPA', labelEn: 'No Honors', gradient: 'from-slate-500 to-slate-300', bg: 'from-slate-500/10 to-slate-300/5', border: 'border-slate-600/30', icon: '📚', gpaxOk: false, allConditionsMet: false, hasEnoughCredits: hasEnough, needed: (3.25 - gpax).toFixed(2) };
  };
  const honorsInfo = getHonorsInfo(stats.calculatedGPAX, stats.earnedCredits, stats.totalCredits, honorsChecks);

  // ─────────── ✅ ย้ายเงื่อนไขการแสดงผลมาไว้ตรงนี้ (หลัง Hook ทั้งหมด) ───────────
  if (loading) return <div className="h-screen flex items-center justify-center text-cyan-400 font-mono animate-pulse text-2xl">INITIALIZING SYSTEM...</div>;
  if (!profile) return <div className="h-screen flex flex-col items-center justify-center text-white gap-10">
    <AlertCircle size={64} className="text-cyan-400"/><h2 className="text-4xl font-black tech-gradient">ไม่พบข้อมูลโปรไฟล์</h2>
    <button onClick={() => navigate('/setup')} className="tech-button px-8 py-4 rounded-xl">Initialize Profile</button>
  </div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px', animation: 'grid-move 20s linear infinite' }}></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                <div><h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">HOME</h1>
                <div className="flex items-center gap-3 mt-2"><div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></div>
                <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">System Online • <span className="text-white font-bold">{profile.basicInfo?.name || 'Survivor'}</span></p></div></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/academic-criteria')} className="tech-button px-6 py-3 rounded-xl text-emerald-400 font-semibold flex items-center gap-2 text-sm border-emerald-500/20"><FileText size={18}/> Criteria</button>
              <button onClick={handleEditSetup} className="tech-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 text-sm"><Settings size={18}/> Settings</button>
              <button onClick={handleLogout} className="tech-button px-6 py-3 rounded-xl text-red-400 font-semibold flex items-center gap-2 text-sm border-red-500/20"><LogOut size={18}/> Logout</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="tech-card p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-mono">GPAX</p>
              <p className="text-2xl font-black text-white">{stats.calculatedGPAX.toFixed(2)}</p>
            </div>
            <div className="tech-card p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-mono">CREDITS</p>
              <p className="text-2xl font-black text-white">{Math.round(animatedCredits)}/{stats.totalCredits}</p>
            </div>
            <div className="tech-card p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-mono">LEARNING</p>
              <p className="text-2xl font-black text-white">{stats.activeCoursesList.length}</p>
            </div>
            <div className="tech-card p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-mono">PROGRESS</p>
              <p className="text-2xl font-black text-white">{stats.progressPercent}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="tech-card p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <img src={profile.basicInfo?.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-xl border-2 border-white/10" />
                    <div>
                        <h2 className="text-xl font-black text-white">{profile.basicInfo?.name || 'User'}</h2>
                        <p className="text-xs text-slate-500 font-mono">ID: {profile.basicInfo?.studentId || '-'}</p>
                    </div>
                </div>
                <div className="p-3 rounded-lg tech-card flex justify-between">
                    <span className="text-xs text-slate-400 font-mono">CURRENT TERM</span>
                    <span className="text-sm font-black text-white">Y{profile.basicInfo?.currentYear}/{profile.basicInfo?.currentTerm}</span>
                </div>
            </div>

            <div className={`tech-card p-6 rounded-2xl border-t-4 ${honorsInfo.gpaxOk ? 'border-yellow-500' : 'border-slate-700'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-sm uppercase">Honors Status</h3>
                    <span>{honorsInfo.icon}</span>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${honorsInfo.gradient} text-black font-black text-center mb-4`}>
                    {honorsInfo.label}
                </div>
                <div className="space-y-2">
                    <button onClick={() => toggleHonorsCheck('noFGrade')} className="w-full flex items-center justify-between p-2 rounded bg-white/5 text-[10px]">
                        <span>ไม่เคยได้ F/U</span>
                        {honorsChecks.noFGrade ? <CheckCircle2 size={14} className="text-emerald-400"/> : <XCircle size={14} className="text-slate-600"/>}
                    </button>
                    <button onClick={() => toggleHonorsCheck('noRegrade')} className="w-full flex items-center justify-between p-2 rounded bg-white/5 text-[10px]">
                        <span>ไม่เคย REGRADE</span>
                        {honorsChecks.noRegrade ? <CheckCircle2 size={14} className="text-emerald-400"/> : <XCircle size={14} className="text-slate-600"/>}
                    </button>
                </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="tech-card p-6 rounded-2xl h-full">
              <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-6"><Flame className="text-orange-400"/> กำลังศึกษาอยู่</h3>
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {stats.activeCoursesList.map((course, idx) => (
                  <div key={idx} className="tech-card-hover p-4 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] font-mono text-cyan-400 mb-1">{course.code}</div>
                        <div className="text-sm font-bold text-white">{course.name}</div>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-600"/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="tech-card p-6 rounded-2xl border-l-4 border-emerald-500">
                <h3 className="text-white font-bold text-sm mb-4 uppercase">Academic Risk</h3>
                <div className={`text-2xl font-black text-${academicStatus.color}-400 mb-1`}>{academicStatus.message}</div>
                <p className="text-xs text-slate-400">{academicStatus.detail}</p>
                <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${academicStatus.color}-500`} style={{width: `${academicStatus.riskLevel}%`}}></div>
                </div>
            </div>

            <div className="tech-card p-6 rounded-2xl h-[300px]">
              <h3 className="text-white font-bold text-sm mb-4 uppercase">GPA Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.graphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="term" hide />
                  <YAxis domain={[0, 4]} hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="gpa" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }
        .tech-card { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .tech-card-hover:hover { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(6, 182, 212, 0.3); transform: translateY(-2px); }
        .tech-button { background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.3s; }
        .tech-button:hover { background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); }
        .tech-gradient { background: linear-gradient(90deg, #fff, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;