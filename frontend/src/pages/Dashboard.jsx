import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, LogOut, Settings, Target, Trophy, Star, Sparkles, ArrowUpRight, ChevronRight, Activity, Flame, BarChart3, Cpu, Layers, Grid3x3, CheckCircle2, XCircle, AlertTriangle, X, Check, FileText, Shield, ShieldAlert, ShieldCheck, Medal, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses } from '../data/courseData';
import axios from 'axios';

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
  
  useEffect(() => {
    const fetchProfile = async () => {
      const savedLocal = localStorage.getItem('userProfile');
      if (savedLocal) {
        setProfile(JSON.parse(savedLocal));
        setLoading(false);
      }

      try {
        const sessionData = localStorage.getItem('active_session');
        const session = sessionData ? JSON.parse(sessionData) : null;

        if (session && session.id) {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${session.id}`);
          if (response.data && response.data.profileData) {
            setProfile(response.data.profileData);
            localStorage.setItem('userProfile', JSON.stringify(response.data.profileData));
          }
        }
      } catch (error) {
        console.error("Fetch Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const stats = useMemo(() => {
    if (!profile) return { totalCredits: 0, earnedCredits: 0, activeCoursesList: [], calculatedGPAX: 0, graphData: [], progressPercent: 0, coopStats: { isFullyEligible: false, courseDetails: [] } };
    
    let totalStructureCredits = 0; 
    let earnedCredits = 0;          
    let activeCoursesList = [];    
    let totalPoints = 0;            
    let totalGradedCredits = 0;    
    let graphData = [];
    let passedCourseCodes = new Set();
    let uniqueCourseTracker = new Set(); // 🛡️ ตัวป้องกันวิชาซ้ำ (De-duplication)

    const currentYearNum = parseInt(profile.basicInfo?.currentYear || profile.currentYear) || 1;
    const currentTermNum = parseInt(profile.basicInfo?.currentTerm || profile.currentTerm) || 1;
    const customElectives = profile.customElectives || {};
    const peAssignments = profile.peAssignments || {};

    const parseCredits = (val) => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'string') {
        const num = parseInt(val, 10);
        if (!isNaN(num)) return num;
      }
      return 3;
    };

    const peSlotCourseMap = {};
    Object.entries(peAssignments).forEach(([slotId, courseCode]) => {
      let trackCourse = null;
      if (Array.isArray(allTrackCourses)) {
        trackCourse = allTrackCourses.find(c => c.id === courseCode || c.code === courseCode);
      } else if (allTrackCourses) {
        trackCourse = allTrackCourses[courseCode];
        if (!trackCourse) {
          for (const key in allTrackCourses) {
            if (Array.isArray(allTrackCourses[key])) {
              const found = allTrackCourses[key].find(c => c.id === courseCode || c.code === courseCode);
              if (found) { trackCourse = found; break; }
            }
          }
        }
      }

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

    if (roadmapData) {
        roadmapData.forEach((yearGroup, yIdx) => {
            const yearNum = yIdx + 1;
            yearGroup.semesters.forEach((sem, sIdx) => {
                const termNum = sIdx + 1;
                const termKey = `${yearNum}-${termNum}`;
                const gpaKey = `Y${yearNum}/${termNum}`;

                let termCourses = [];
                
                // 1. ดึงวิชาจาก Roadmap ปกติ
                sem.courses.forEach(c => {
                  let finalCourse = c;
                  if (c.isProfessionalElective && peSlotCourseMap[c.id]) {
                    finalCourse = peSlotCourseMap[c.id];
                  }
                  
                  // 🛡️ เช็คซ้ำก่อนเอาเข้า List
                  if (!uniqueCourseTracker.has(finalCourse.id)) {
                    termCourses.push(finalCourse);
                    uniqueCourseTracker.add(finalCourse.id);
                  }
                });

                // 2. ดึงวิชาจาก Custom Electives
                if (customElectives[termKey]) {
                    customElectives[termKey].forEach(elecId => {
                        const elecInfo = electiveCourses.find(c => c.id === elecId);
                        // 🛡️ เช็คซ้ำก่อนเอาเข้า List
                        if (elecInfo && !uniqueCourseTracker.has(elecInfo.id)) {
                          termCourses.push({ ...elecInfo, isElective: true });
                          uniqueCourseTracker.add(elecInfo.id);
                        }
                    });
                }

                let termPassedCredits = 0;
                termCourses.forEach(c => {
                    const status = profile.courseStates?.[c.id] || (c._peSlot ? profile.courseStates?.[c._peSlot] : undefined);
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

                const isPastTerm = (yearNum < currentYearNum) || (yearNum === currentYearNum && termNum < currentTermNum);
                if (isPastTerm) {
                    const historyGradeStr = profile.gpaHistory?.[gpaKey];
                    if (historyGradeStr && !isNaN(parseFloat(historyGradeStr))) {
                        const termGPA = parseFloat(historyGradeStr);
                        const weight = termPassedCredits > 0 ? termPassedCredits : sem.courses.reduce((a,b)=>a+b.credits,0);
                        totalPoints += (termGPA * weight);
                        totalGradedCredits += weight;
                        graphData.push({ term: gpaKey, year: yearNum, semester: termNum, gpa: parseFloat(termGPA.toFixed(2)), fullTerm: sem.term, credits: weight });
                    }
                }
            });
        });
    }

    let calculatedGPAX = totalGradedCredits > 0 ? (Math.floor((totalPoints / totalGradedCredits) * 100) / 100) : 0;
    const progressPercent = totalStructureCredits > 0 ? Math.round((earnedCredits / totalStructureCredits) * 100) : 0;
    
    const coopCourseDetails = COOP_REQUIREMENTS.targetCourses.map(code => {
        let courseName = "Unknown Course";
        roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => { if(c.code === code) courseName = c.name; })));
        const isPassed = passedCourseCodes.has(code);
        const grade = coopGrades[code];
        return { code, name: courseName, isPassed, grade: grade !== null && grade !== undefined ? grade : null };
    });

    const coopCoursesPassedCount = coopCourseDetails.filter(c => c.isPassed).length;
    const coopCoursesTotal = COOP_REQUIREMENTS.targetCourses.length;
    let gpa10Sum = 0, gpa10Count = 0;
    coopCourseDetails.forEach(c => { if (c.isPassed && c.grade !== null && c.grade !== undefined) { gpa10Sum += c.grade; gpa10Count++; } });
    const gpa10 = gpa10Count > 0 ? gpa10Sum / gpa10Count : null;

    return { totalCredits: totalStructureCredits, earnedCredits, activeCoursesList, calculatedGPAX, graphData, progressPercent,
      coopStats: { isCreditReady: earnedCredits >= 90, isGPAReady: calculatedGPAX >= 2.75, isCoursesReady: coopCoursesPassedCount === coopCoursesTotal && gpa10 !== null && gpa10 >= 2.5, passedCount: coopCoursesPassedCount, totalCount: coopCoursesTotal, courseDetails: coopCourseDetails, gpa10, gpa10Count, isFullyEligible: earnedCredits >= 90 && calculatedGPAX >= 2.75 && coopCoursesPassedCount === coopCoursesTotal && gpa10 >= 2.5 }
    };
  }, [profile]);

  const academicStatus = useMemo(() => {
    const sortedHistory = [...stats.graphData].sort((a, b) => (a.year !== b.year) ? a.year - b.year : a.semester - b.semester);
    let statusState = { status: 'NORMAL', message: 'สถานะปกติ', detail: 'รอผลการเรียน', color: 'emerald', riskLevel: 0, prediction: null };
    if (sortedHistory.length === 0) return statusState;
    let accumulatedPoints = 0, accumulatedCredits = 0, lowProCount = 0, highProCount = 0;

    for (let termData of sortedHistory) {
        const { year, semester, gpa, credits } = termData;
        accumulatedPoints += (gpa * credits);
        accumulatedCredits += credits;
        if (accumulatedCredits === 0) continue;
        const currentGPAX = accumulatedPoints / accumulatedCredits;

        if (year === 1) {
            if (semester === 1 && currentGPAX < 1.25) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'GPAX ปี 1 เทอม 1 ต่ำกว่า 1.25', color: 'red', riskLevel: 100 };
            if (semester === 2 && currentGPAX < 1.50) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'GPAX ปี 1 เทอม 2 ต่ำกว่า 1.50', color: 'red', riskLevel: 100 };
        } else if (year >= 2) {
            if (gpa < 1.75) { lowProCount++; highProCount = 0; }
            else if (gpa < 2.00) { highProCount++; lowProCount = 0; }
            else { lowProCount = 0; highProCount = 0; }
            if (lowProCount >= 2) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'โปรต่ำ 2 ครั้งติดกัน', color: 'red', riskLevel: 100 };
            if (highProCount >= 4) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'โปรสูง 4 ครั้งติดกัน', color: 'red', riskLevel: 100 };
        }
    }

    const latestGPAX = accumulatedCredits > 0 ? (accumulatedPoints / accumulatedCredits) : 0;
    const avgCreditsPerSem = sortedHistory.length > 0 ? accumulatedCredits / sortedHistory.length : 19;
    const nextTermCredits = Math.round(avgCreditsPerSem);
    const targetGPAX = 2.00;
    const missingPoints = (targetGPAX * (accumulatedCredits + nextTermCredits)) - accumulatedPoints;
    let neededGPA = missingPoints / nextTermCredits;
    let predictionText = (neededGPA > 4.00) ? "ยากมาก (>4.00)" : (neededGPA <= 0) ? "รอดแน่นอน" : neededGPA.toFixed(2);

    if (lowProCount === 1) statusState = { status: 'CRITICAL', message: 'ภาวะวิกฤต (โปรต่ำ)', detail: `GPA ต่ำกว่า 1.75 อีกครั้งจะพ้นสภาพ`, color: 'red', riskLevel: 90, prediction: { label: 'เป้าหมายเทอมหน้า (เพื่อหลุดโปร)', value: predictionText, credits: nextTermCredits } };
    else if (highProCount > 0) statusState = { status: 'PROBATION', message: `ติดวิทยาทัณฑ์ (ครั้งที่ ${highProCount})`, detail: `GPA ต่ำกว่า 2.00 (ครั้งที่ ${highProCount}/4)`, color: 'orange', riskLevel: 40 + (highProCount * 15), prediction: { label: 'เกรดที่ต้องทำเพื่อหลุดโปร', value: predictionText, credits: nextTermCredits } };
    else if (latestGPAX < 2.00) statusState = { status: 'WARNING', message: 'เฝ้าระวัง', detail: `GPAX ${latestGPAX.toFixed(2)} ยังไม่ถึง 2.00`, color: 'yellow', riskLevel: 30, prediction: { label: 'ทำเกรดให้ถึง 2.00', value: predictionText, credits: nextTermCredits } };
    else statusState = { status: 'NORMAL', message: 'สถานะปกติ', detail: `GPAX ${latestGPAX.toFixed(2)} ปลอดภัย`, color: 'emerald', riskLevel: 10, prediction: null };

    return statusState;
  }, [stats.graphData]);

  useEffect(() => {
    if (!profile) return;
    const duration = 2000, steps = 60;
    const gpaIncrement = stats.calculatedGPAX / steps;
    const creditsIncrement = stats.earnedCredits / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedGPA(prev => Math.min(prev + gpaIncrement, stats.calculatedGPAX));
      setAnimatedCredits(prev => Math.min(prev + creditsIncrement, stats.earnedCredits));
      if (currentStep >= steps) { clearInterval(timer); setAnimatedGPA(stats.calculatedGPAX); setAnimatedCredits(stats.earnedCredits); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [profile, stats.calculatedGPAX, stats.earnedCredits]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tech-card p-5 rounded-xl border border-cyan-500/30">
          <p className="text-white text-sm font-bold mb-2 font-mono">{data.term}</p>
          <div className="text-cyan-400 font-black text-3xl mb-1">{data.gpa.toFixed(2)}</div>
          <p className="text-xs text-slate-400 font-medium">{data.credits} หน่วยกิต</p>
        </div>
      );
    }
    return null;
  };

  const handleLogout = () => {
  if (window.confirm('ต้องการออกจากระบบหรือไม่?')) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};
  const handleEditSetup = () => navigate('/setup');

  const getGradeInfo = (gpa) => {
    if (gpa >= 3.6) return { gradient: 'from-emerald-400 via-teal-400 to-cyan-400', bg: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/10', label: 'EXCELLENT', icon: '🏆' };
    if (gpa >= 3.0) return { gradient: 'from-blue-400 via-cyan-400 to-sky-400', bg: 'from-blue-500/20 via-cyan-500/15 to-sky-500/10', label: 'VERY GOOD', icon: '⭐' };
    if (gpa >= 2.5) return { gradient: 'from-amber-400 via-yellow-400 to-orange-400', bg: 'from-amber-500/20 via-yellow-500/15 to-orange-500/10', label: 'GOOD', icon: '👍' };
    return { gradient: 'from-rose-400 via-pink-400 to-fuchsia-400', bg: 'from-rose-500/20 via-pink-500/15 to-fuchsia-500/10', label: 'KEEP GOING', icon: '📈' };
  };
  const gradeInfo = getGradeInfo(stats.calculatedGPAX);

  const getHonorsInfo = (gpax, earnedCredits, totalCredits, checks) => {
    const hasEnoughCredits = totalCredits > 0 && earnedCredits >= totalCredits;
    const allConditionsMet = checks.noFGrade && checks.noRegrade && hasEnoughCredits;
    if (gpax >= 3.60) return { tier: allConditionsMet ? 1 : 'pending', label: 'เกียรตินิยมอันดับ 1', labelEn: '1st Class Honors', gradient: 'from-yellow-400 via-amber-400 to-orange-400', bg: 'from-yellow-500/20 via-amber-500/15 to-orange-500/10', border: allConditionsMet ? 'border-yellow-500/50' : 'border-yellow-500/20', glow: 'shadow-yellow-500/20', icon: '🥇', gpaxOk: true, allConditionsMet, hasEnoughCredits, needed: null };
    if (gpax >= 3.25) return { tier: allConditionsMet ? 2 : 'pending', label: 'เกียรตินิยมอันดับ 2', labelEn: '2nd Class Honors', gradient: 'from-slate-300 via-slate-200 to-white', bg: 'from-slate-400/15 via-slate-300/10 to-slate-200/5', border: allConditionsMet ? 'border-slate-400/50' : 'border-slate-500/20', glow: 'shadow-slate-400/10', icon: '🥈', gpaxOk: true, allConditionsMet, hasEnoughCredits, needed: null };
    return { tier: 0, label: 'ยังไม่ถึงเกณฑ์ GPA', labelEn: 'No Honors', gradient: 'from-slate-500 via-slate-400 to-slate-300', bg: 'from-slate-500/10 via-slate-400/5 to-slate-300/5', border: 'border-slate-600/30', glow: 'shadow-slate-500/10', icon: '📚', gpaxOk: false, allConditionsMet: false, hasEnoughCredits, needed: (3.25 - gpax).toFixed(2) };
  };
  const honorsInfo = getHonorsInfo(stats.calculatedGPAX, stats.earnedCredits, stats.totalCredits, honorsChecks);

  const CoopStatusItem = ({ label, value, passed, subtext }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
        <div><p className="text-slate-400 text-xs font-mono uppercase">{label}</p><p className="text-white font-bold">{value}</p>{subtext && <p className="text-[10px] text-slate-500">{subtext}</p>}</div>
        <div className={`p-2 rounded-full ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</div>
    </div>
  );

  const getStatusIcon = (color) => {
      switch(color) {
          case 'emerald': return <ShieldCheck size={24} className="text-emerald-400" />;
          case 'orange': return <AlertTriangle size={24} className="text-orange-400" />;
          case 'red': return <ShieldAlert size={24} className="text-red-400" />;
          default: return <Shield size={24} className="text-slate-400" />;
      }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-mono animate-pulse">INITIALIZING SYSTEM...</div>;
  if (!profile) return <ErrorScreen onRetry={() => navigate('/setup')} />;

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
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">HOME</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></div>
                    <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">System Online • <span className="text-white font-bold">{profile.basicInfo?.name || profile.name || 'User'}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/academic-criteria')} className="tech-button px-6 py-3 rounded-xl text-emerald-400 font-semibold flex items-center gap-2 text-sm border-emerald-500/20"><FileText size={18}/> <span className="hidden md:inline">Academic Criteria</span></button>
              <button onClick={handleEditSetup} className="tech-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 text-sm"><Settings size={18}/> <span className="hidden md:inline">Settings</span></button>
              <button onClick={handleLogout} className="tech-button px-6 py-3 rounded-xl text-red-400 font-semibold flex items-center gap-2 text-sm border-red-500/20"><LogOut size={18}/> <span className="hidden md:inline">Logout</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCardUI label="GPAX" value={animatedGPA.toFixed(2)} icon={<Cpu size={20}/>} color="from-cyan-500 to-blue-500" />
            <StatCardUI label="หน่วยกิต" value={`${Math.round(animatedCredits)}/${stats.totalCredits}`} icon={<Target size={20}/>} color="from-purple-500 to-pink-500" />
            <StatCardUI label="กำลังศึกษา" value={stats.activeCoursesList.length} icon={<Flame size={20}/>} color="from-orange-500 to-red-500" />
            <StatCardUI label="Progress" value={`${stats.progressPercent}%`} icon={<Trophy size={20}/>} color="from-green-500 to-emerald-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="tech-card p-6 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative"><div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-purple-500/50 rounded-xl blur-lg"></div><img src={profile.basicInfo?.image || 'https://via.placeholder.com/150'} alt="Profile" className="relative w-16 h-16 rounded-xl object-cover border-2 border-white/20"/></div>
                <div className="flex-1 min-w-0"><h2 className="text-xl font-black text-white mb-1 truncate">{profile.basicInfo?.name || profile.name}</h2><p className="text-xs text-slate-500 font-mono mb-2">ID: {profile.basicInfo?.studentId || '-'}</p><div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg tech-card"><Layers size={11} className="text-cyan-400"/><span className="text-[10px] font-bold text-cyan-400 uppercase">CS</span></div></div>
              </div>
              <div className="space-y-3"><div className="tech-card p-3 rounded-lg"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Calendar size={14} className="text-purple-400"/><span className="text-xs text-slate-400 font-mono">TERM</span></div><span className="text-sm font-black text-white">Y{profile.basicInfo?.currentYear}/{profile.basicInfo?.currentTerm}</span></div></div></div>
            </div>

            <div className={`tech-card rounded-2xl relative overflow-hidden border ${honorsInfo.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradeInfo.bg} opacity-30`}></div>
              <div className="relative flex">
                <div className="flex-shrink-0 w-44 p-5 flex flex-col items-center justify-center border-r border-white/5">
                  <div className="flex items-center gap-1.5 mb-3 self-start"><div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradeInfo.gradient} flex items-center justify-center`}><BarChart3 size={12} className="text-white"/></div><p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">GPAX</p></div>
                  <div className={`text-6xl font-black bg-gradient-to-r ${gradeInfo.gradient} bg-clip-text text-transparent mb-1`}>{animatedGPA.toFixed(2)}</div>
                  <p className="text-[10px] text-slate-500 font-mono mb-3">OUT OF 4.00</p>
                  <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${gradeInfo.gradient}`}><span className="text-[10px] font-black text-white tracking-wider">{gradeInfo.label}</span></div>
                </div>
                <div className="flex-1 p-5 min-w-0">
                  <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-1.5"><GraduationCap size={14} className={honorsInfo.gpaxOk ? 'text-yellow-400' : 'text-slate-400'} /><span className="text-xs font-bold text-white uppercase tracking-wide">เกียรตินิยม</span></div><span className="text-lg">{honorsInfo.icon}</span></div>
                  <div className={`mb-3 px-3 py-2 rounded-xl bg-gradient-to-r ${honorsInfo.gradient}`}><p className={`text-xs font-black leading-tight ${honorsInfo.tier === 0 ? 'text-slate-300' : 'text-black/80'}`}>{honorsInfo.label}</p><p className={`text-[9px] font-mono ${honorsInfo.tier === 0 ? 'text-slate-500' : 'text-black/60'}`}>{honorsInfo.labelEn}</p></div>
                  <div className="space-y-2 mb-3">
                    <HonorProgress label="🥇 3.60" value={stats.calculatedGPAX} target={3.60} active={stats.calculatedGPAX >= 3.60} color="from-yellow-400 to-orange-400" />
                    <HonorProgress label="🥈 3.25" value={stats.calculatedGPAX} target={3.25} active={stats.calculatedGPAX >= 3.25} color="from-slate-300 to-slate-400" />
                  </div>
                  <div className="space-y-1.5">
                    <CheckToggle label="ไม่เคยได้ F / U" checked={honorsChecks.noFGrade} onClick={() => toggleHonorsCheck('noFGrade')} />
                    <CheckToggle label="ไม่เคย Regrade" checked={honorsChecks.noRegrade} onClick={() => toggleHonorsCheck('noRegrade')} />
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${honorsInfo.hasEnoughCredits ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/50'}`}><Check size={10} className={honorsInfo.hasEnoughCredits ? "text-emerald-400" : "text-slate-600"}/><span className="text-[10px] font-bold text-slate-400">หน่วยกิตครบ</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div onClick={() => navigate('/coop')} className={`tech-card p-6 rounded-2xl border-l-4 ${stats.coopStats.isFullyEligible ? 'border-emerald-500' : 'border-orange-500'} cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden`}>
                <div className="flex items-center gap-2 mb-4"><Award size={20} className={stats.coopStats.isFullyEligible ? "text-emerald-400" : "text-orange-400"} /><h3 className="text-white font-bold text-sm uppercase tracking-wide">Co-op Status (คุณสมบัติ)</h3></div>
                <div className="space-y-3">
                  <CoopStatusItem label="หน่วยกิต" value={`${Math.round(stats.earnedCredits)} / 90`} passed={stats.coopStats.isCreditReady} />
                  <CoopStatusItem label="GPAX" value={`${stats.calculatedGPAX.toFixed(2)} / 2.75`} passed={stats.coopStats.isGPAReady} />
                  <CoopStatusItem label="GPA_10" value={stats.coopStats.gpa10 !== null ? `${stats.coopStats.gpa10.toFixed(2)} / 2.50` : '— / 2.50'} passed={stats.coopStats.isCoursesReady} subtext={`${stats.coopStats.passedCount}/10 passed`} />
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-center"><p className="text-[10px] text-slate-400 group-hover:text-cyan-400 flex items-center justify-center gap-1">Click for Details <ChevronRight size={12} /></p></div>
            </div>
          </div>

          <div className="lg:col-span-5">
  <div className="tech-card p-4 rounded-2xl h-fit max-h-[500px] flex flex-col">
    
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Flame size={20} className="text-orange-400"/> 
          รายวิชาที่กำลังศึกษา
        </h3>
      </div>
      <div className="px-3 py-1 rounded-lg tech-card border-orange-500/20">
        <span className="text-md font-black text-orange-400">{stats.activeCoursesList.length}</span>
      </div>
    </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.activeCoursesList.map((course, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(`/course/${course.id}`)} 
              className="tech-card-hover p-3 rounded-xl group text-left relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${course.isElective ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {course.code}
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-all"/>
                </div>

                <h4 className="font-bold text-xs text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {course.name}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Grid3x3 size={10} className="text-slate-500"/>
                    <span className="text-[10px] text-slate-400">{course.credits} Cr.</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">
                    {course.termLabel}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="tech-card p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-4">{getStatusIcon(academicStatus.color)}<h3 className="text-white font-bold text-sm uppercase tracking-wide">Academic Status</h3></div>
                <p className={`text-xl font-black text-${academicStatus.color}-400 mb-1`}>{academicStatus.message}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{academicStatus.detail}</p>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 transition-all duration-1000`} style={{ width: `${Math.max(5, academicStatus.riskLevel)}%` }}></div></div>
            </div>

            <div className="tech-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6"><div><h3 className="text-lg font-black text-white flex items-center gap-2 mb-1"><Activity size={18} className="text-cyan-400"/> GPA Graph</h3></div></div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.graphData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                    <defs><linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6}/><stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/><XAxis dataKey="term" hide /><YAxis domain={[0, 4]} hide />
                    <Tooltip content={<CustomTooltip />}/>
                    <ReferenceLine y={2.0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3}/>
                    <Area type="monotone" dataKey="gpa" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorGpa)" activeDot={{ r: 6, fill: '#06b6d4' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="tech-card p-6 rounded-2xl space-y-3">
              <QuickActionBtn label="Roadmap" sub="View All" icon={<BookOpen size={18}/>} color="from-cyan-500 to-blue-500" onClick={() => navigate('/roadmap')} />
              <QuickActionBtn label="Settings" sub="Edit Profile" icon={<Settings size={18}/>} color="from-purple-500 to-pink-500" onClick={() => navigate('/setup')} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }
        .tech-card { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .tech-card-hover:hover { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(6, 182, 212, 0.3); transform: translateY(-2px); }
        .tech-button { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.3s; }
        .tech-button:hover { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(6, 182, 212, 0.3); transform: scale(1.02); }
        .tech-gradient { background: linear-gradient(90deg, #fff 0%, #06b6d4 50%, #8b5cf6 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

const StatCardUI = ({ label, value, icon, color }) => (
  <div className="tech-card p-4 rounded-xl group hover:scale-105 transition-transform flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>{icon}</div>
    <div><p className="text-xs text-slate-500 font-mono uppercase">{label}</p><p className="text-2xl font-black text-white">{value}</p></div>
  </div>
);

const HonorProgress = ({ label, value, target, active, color }) => (
  <div>
    <div className="flex items-center justify-between text-[10px] mb-1"><span className="text-slate-400 font-mono">{label}</span><span className={`font-bold ${active ? 'text-yellow-400' : 'text-slate-500'}`}>{value.toFixed(2)}</span></div>
    <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{ width: `${Math.min(100, (value / target) * 100)}%` }} /></div>
  </div>
);

const CheckToggle = ({ label, checked, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-left ${checked ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/50'}`}>
    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>{checked && <Check size={10} className="text-white" />}</div>
    <span className={`text-[10px] font-bold ${checked ? 'text-emerald-300' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const QuickActionBtn = ({ label, sub, icon, color, onClick }) => (
  <button onClick={onClick} className="w-full tech-button p-4 rounded-xl flex items-center justify-between group">
    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white`}>{icon}</div><div><p className="text-sm font-bold text-white">{label}</p><p className="text-[10px] text-slate-500">{sub}</p></div></div>
    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all"/>
  </button>
);

const ErrorScreen = ({ onRetry }) => (<div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6 text-white"><AlertCircle size={64} className="text-red-500"/><h2 className="text-3xl font-black uppercase">Data Link Broken</h2><button onClick={onRetry} className="tech-button px-8 py-3 rounded-xl font-bold">RETRY CONNECTION</button></div>);

export default Dashboard;