import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, XCircle, AlertCircle, BookOpen, Calendar, FileText, TrendingUp, GraduationCap, Briefcase, ClipboardCheck, ChevronDown, Calculator } from 'lucide-react';

// ─── COURSES DATA (ข้อมูลครบในไฟล์เดียว) ───────────────────────────────────
const COURSES_DATA = [
  { code: '001101', name: 'Thai for Communication', credit: 3, semester: 1, type: 'gen-ed' },
  { code: '001102', name: 'Foundation English 1', credit: 3, semester: 1, type: 'gen-ed' },
  { code: '040613101', name: 'Introduction to Computer Science', credit: 3, semester: 1, type: 'major' },
  { code: '040623172', name: 'Calculus for Computer Science', credit: 3, semester: 1, type: 'basic' },
  { code: '040643141', name: 'General Physics', credit: 3, semester: 1, type: 'basic' },
  { code: '040643143', name: 'General Physics Laboratory', credit: 1, semester: 1, type: 'basic' },
  { code: '001103', name: 'Foundation English 2', credit: 3, semester: 2, type: 'gen-ed' },
  { code: '040613102', name: 'Principles of Information Technology', credit: 3, semester: 2, type: 'major' },
  { code: '040613203', name: 'Structured Programming', credit: 3, semester: 2, type: 'major' },
  { code: '040623272', name: 'Discrete Mathematics', credit: 3, semester: 2, type: 'basic' },
  { code: '040643241', name: 'Basic Statistics', credit: 3, semester: 2, type: 'basic' },
  { code: '001201', name: 'Purposeful Living', credit: 3, semester: 3, type: 'gen-ed' },
  { code: '001204', name: 'Aesthetics', credit: 3, semester: 3, type: 'gen-ed' },
  { code: '040613204', name: 'Object-oriented Programming', credit: 3, semester: 3, type: 'major' },
  { code: '040613205', name: 'Data Structure', credit: 3, semester: 3, type: 'major' },
  { code: '040623371', name: 'Probability and Statistics for Computer Science', credit: 3, semester: 3, type: 'basic' },
  { code: '001202', name: 'Self Development', credit: 3, semester: 4, type: 'gen-ed' },
  { code: '040613301', name: 'Database System', credit: 3, semester: 4, type: 'major' },
  { code: '040613302', name: 'System Analysis and Design', credit: 3, semester: 4, type: 'major' },
  { code: '040613501', name: 'Computer Organization and Operating System', credit: 3, semester: 4, type: 'major' },
  { code: '040623471', name: 'Linear Algebra for Computer Science', credit: 3, semester: 4, type: 'basic' },
  { code: '001203', name: 'Community Development', credit: 3, semester: 5, type: 'gen-ed' },
  { code: '040613306', name: 'Software Engineering', credit: 3, semester: 5, type: 'major' },
  { code: '040613502', name: 'Computer Network', credit: 3, semester: 5, type: 'major' },
  { code: '040613601', name: 'Computer System Security', credit: 3, semester: 5, type: 'major' },
  { code: '040613701', name: 'Intelligent System', credit: 3, semester: 5, type: 'major' },
];

// ─── Grade options ──────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
  { label: 'ยังไม่เรียน', value: null },
  { label: 'A  (4.0)', value: 4.0 },
  { label: 'B+ (3.5)', value: 3.5 },
  { label: 'B  (3.0)', value: 3.0 },
  { label: 'C+ (2.5)', value: 2.5 },
  { label: 'C  (2.0)', value: 2.0 },
  { label: 'D+ (1.5)', value: 1.5 },
  { label: 'D  (1.0)', value: 1.0 },
  { label: 'F  (0.0)', value: 0.0 },
];

const GRADE_DISPLAY = {
  4.0: { letter: 'A',   color: 'text-emerald-400',  bg: 'bg-emerald-500/20',  border: 'border-emerald-500/40' },
  3.5: { letter: 'B+',  color: 'text-cyan-400',     bg: 'bg-cyan-500/20',     border: 'border-cyan-500/40'    },
  3.0: { letter: 'B',   color: 'text-blue-400',     bg: 'bg-blue-500/20',     border: 'border-blue-500/40'    },
  2.5: { letter: 'C+',  color: 'text-yellow-400',   bg: 'bg-yellow-500/20',   border: 'border-yellow-500/40'  },
  2.0: { letter: 'C',   color: 'text-amber-400',    bg: 'bg-amber-500/20',    border: 'border-amber-500/40'   },
  1.5: { letter: 'D+',  color: 'text-orange-400',   bg: 'bg-orange-500/20',   border: 'border-orange-500/40'  },
  1.0: { letter: 'D',   color: 'text-red-400',      bg: 'bg-red-500/20',      border: 'border-red-500/40'     },
  0.0: { letter: 'F',   color: 'text-rose-500',     bg: 'bg-rose-500/20',     border: 'border-rose-500/40'    },
};

// ─── Required courses ────────────────────────────────────────────────────────
const REQUIRED_COURSES = [
  { code: '040613203', name: 'Structured Programming' },
  { code: '040613205', name: 'Data Structure' },
  { code: '040613204', name: 'Object-oriented Programming' },
  { code: '040613302', name: 'System Analysis and Design' },
  { code: '040613501', name: 'Computer Organization and Operating System' },
  { code: '040613306', name: 'Software Engineering' },
  { code: '040613502', name: 'Computer Network' },
  { code: '040613301', name: 'Database System' },
  { code: '040613601', name: 'Computer System Security' },
  { code: '040613701', name: 'Intelligent System' },
];

// ─── localStorage helpers ────────────────────────────────────────────────────
const LS_KEY_COOP = 'coopGradeStates';
const LS_KEY_PROFILE = 'userProfile'; // จาก SetupProfile

const loadCoopGrades = () => {
  try {
    const raw = localStorage.getItem(LS_KEY_COOP);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const clean = {};
    Object.entries(parsed).forEach(([code, val]) => {
      clean[code] = (val === null || (typeof val === 'number' && !isNaN(val))) ? val : null;
    });
    return clean;
  } catch {
    return {};
  }
};

const saveCoopGrades = (grades) => {
  try {
    localStorage.setItem(LS_KEY_COOP, JSON.stringify(grades));
  } catch (e) {
    console.error('Failed to save coop grades:', e);
  }
};

const loadUserProfile = () => {
  try {
    const raw = localStorage.getItem(LS_KEY_PROFILE);
    if (!raw) return { courseStates: {}, gpaHistory: {} };
    const parsed = JSON.parse(raw);
    return {
      courseStates: parsed.courseStates || {},
      gpaHistory: parsed.gpaHistory || {},
      basicInfo: parsed.basicInfo || {}
    };
  } catch {
    return { courseStates: {}, gpaHistory: {} };
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const RequirementCard = ({ icon: Icon, title, current, required, isPassed, unit, description, highlight }) => (
  <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
    isPassed
      ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-800/60'
      : 'border-red-500/60 bg-gradient-to-br from-red-500/20 via-red-500/10 to-slate-800/60'
  }`}>
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isPassed ? '#10b981' : '#ef4444'} 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}></div>
    </div>

    <div className="relative p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isPassed ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
            <Icon size={24} className={isPassed ? 'text-emerald-300' : 'text-red-300'} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">{title}</h4>
            {description && <p className="text-xs text-slate-300 mt-1">{description}</p>}
          </div>
        </div>
        <div className={`p-2 rounded-full ${isPassed ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
          {isPassed ? (
            <CheckCircle2 size={20} className="text-emerald-300" />
          ) : (
            <XCircle size={20} className="text-red-300" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl font-black transition-colors duration-300 ${highlight ? (isPassed ? 'text-emerald-200' : 'text-red-200') : 'text-white'}`}>
            {current}
          </span>
          <span className="text-lg text-slate-300">/ {required} {unit}</span>
        </div>

        <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isPassed
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${Math.min(100, (parseFloat(current) / required) * 100)}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
        </div>

        <div className="flex justify-between text-xs font-mono">
          <span className={isPassed ? 'text-emerald-300' : 'text-red-300'}>
            {Math.round((parseFloat(current) / required) * 100)}% Complete
          </span>
          <span className="text-slate-400">Required: {required} {unit}</span>
        </div>
      </div>
    </div>
  </div>
);

const GradeDropdown = ({ value, onChange }) => {
  const gradeInfo = value !== null ? GRADE_DISPLAY[value] : null;
  return (
    <div className="relative">
      <select
        value={value === null ? '' : String(value)}
        onChange={e => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
        className={`
          appearance-none w-[130px] text-xs font-bold px-3 py-2 pr-7 rounded-xl border
          bg-slate-900/80 cursor-pointer outline-none transition-all duration-200
          focus:ring-2 focus:ring-cyan-500/50
          ${gradeInfo
            ? `${gradeInfo.color} ${gradeInfo.border}`
            : 'text-slate-400 border-slate-700/60'}
        `}
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        {GRADE_OPTIONS.map(opt => (
          <option
            key={String(opt.value)}
            value={opt.value === null ? '' : String(opt.value)}
            className="bg-slate-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
};

const CourseListItem = ({ number, code, name, grade, onGradeChange, isCoursePassed }) => {
  const gradeInfo = grade !== null ? GRADE_DISPLAY[grade] : null;
  return (
    <div className={`
      flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
      ${isCoursePassed
        ? 'bg-gradient-to-r from-emerald-500/20 to-slate-800/60 border-emerald-500/50'
        : 'bg-slate-800/60 border-slate-700/50'}
    `}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
          ${isCoursePassed ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}
        `}>
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-300">{code}</span>
            {isCoursePassed && <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />}
          </div>
          <p className="text-sm text-white font-medium truncate">{name}</p>
        </div>
      </div>
      <div className="ml-3 shrink-0">
        {isCoursePassed ? (
          <GradeDropdown value={grade} onChange={onGradeChange} />
        ) : (
          <div className="w-[130px] px-3 py-2 text-xs font-mono text-slate-400 bg-slate-700/60 border border-slate-600/50 rounded-xl text-center">
            ยังไม่ผ่าน
          </div>
        )}
      </div>
    </div>
  );
};

const GPA10Meter = ({ gpa10, gradedCount, totalPassedCourses }) => {
  const isReady = gpa10 !== null && gpa10 >= 2.5;
  const percentage = gpa10 !== null ? Math.min(100, (gpa10 / 4.0) * 100) : 0;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border-2 transition-all duration-500
      ${isReady
        ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-800/60'
        : 'border-yellow-500/60 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-slate-800/60'}
    `}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isReady ? '#10b981' : '#eab308'} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isReady ? 'bg-emerald-500/30' : 'bg-yellow-500/30'}`}>
              <Calculator size={24} className={isReady ? 'text-emerald-300' : 'text-yellow-300'} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">GPA_10 Calculator (Live)</h4>
              <p className="text-xs text-slate-300 mt-1">
                คำนวณแบบ real-time จากเกรดที่เลือก • ต้องการ ≥ 2.50
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700/60 rounded-xl p-4 border border-slate-600/40">
            <div className="text-xs text-slate-300 mb-1">วิชาที่ผ่าน</div>
            <div className="text-2xl font-black text-cyan-300">
              {totalPassedCourses}<span className="text-sm text-slate-400">/10</span>
            </div>
          </div>
          <div className="bg-slate-700/60 rounded-xl p-4 border border-slate-600/40">
            <div className="text-xs text-slate-300 mb-1">ใส่เกรดแล้ว</div>
            <div className="text-2xl font-black text-purple-300">
              {gradedCount}<span className="text-sm text-slate-400">/10</span>
            </div>
          </div>
          <div className={`rounded-xl p-4 border-2 ${
            gpa10 === null
              ? 'bg-slate-700/60 border-slate-600/40'
              : isReady
                ? 'bg-emerald-500/20 border-emerald-500/50'
                : 'bg-yellow-500/20 border-yellow-500/50'
          }`}>
            <div className="text-xs text-slate-300 mb-1">GPA_10</div>
            <div className={`text-2xl font-black ${
              gpa10 === null ? 'text-slate-300'
                : isReady ? 'text-emerald-300' : 'text-yellow-300'
            }`}>
              {gpa10 === null ? '—' : gpa10.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="relative h-4 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              gpa10 === null
                ? 'bg-gradient-to-r from-slate-600 to-slate-700'
                : isReady
                  ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500'
                  : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500'
            }`}
            style={{ width: `${percentage}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
        </div>

        <div className="flex justify-between text-xs font-mono mt-2">
          <span className={gpa10 === null ? 'text-slate-400' : isReady ? 'text-emerald-300' : 'text-yellow-300'}>
            {gpa10 === null ? 'รอใส่เกรด' : isReady ? '✓ ผ่านเกณฑ์' : '⚠ ยังไม่ถึงเกณฑ์'}
          </span>
          <span className="text-slate-400">เกณฑ์: 2.50</span>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ number, title, detail, isActive }) => (
  <div className={`flex gap-4 pb-6 last:pb-0 ${!isActive && 'opacity-50'}`}>
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
        isActive ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white' : 'bg-slate-700 text-slate-400'
      }`}>
        {number}
      </div>
      <div className="w-0.5 flex-1 bg-slate-700 mt-2 last:hidden"></div>
    </div>
    <div className="flex-1 pb-2">
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{detail}</p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const CoopEligibilityPage = () => {
  const navigate = useNavigate();
  
  // โหลดข้อมูลจาก localStorage เมื่อ component mount
  const [courseStates, setCourseStates] = useState({});
  const [courseGrades, setCourseGrades] = useState({});
  const [userProfile, setUserProfile] = useState({ gpaHistory: {}, basicInfo: {} });

  useEffect(() => {
    // โหลดข้อมูลจาก SetupProfile
    const profile = loadUserProfile();
    setUserProfile(profile);
    setCourseStates(profile.courseStates);

    // โหลดเกรดที่เคยเลือกไว้ใน Coop modal
    const savedGrades = loadCoopGrades();
    setCourseGrades(savedGrades);
  }, []);

  // คำนวณสถิติต่างๆ
  const stats = useMemo(() => {
    let earnedCredits = 0;
    let totalGradePoints = 0;
    let totalCredits = 0;

    COURSES_DATA.forEach(course => {
      const state = courseStates[course.code];
      if (state === 'passed') {
        earnedCredits += course.credit;
        
        // ถ้ามีเกรดจาก courseGrades (ที่ user เลือกใน Coop modal) ให้นำมาคำนวณ GPAX
        const grade = courseGrades[course.code];
        if (grade !== null && grade !== undefined) {
          totalGradePoints += grade * course.credit;
          totalCredits += course.credit;
        }
      }
    });

    // ถ้ายังไม่มีเกรดจาก Coop modal ให้ใช้ gpaHistory จาก SetupProfile
    let calculatedGPAX = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    // ถ้ายังคำนวณไม่ได้ ให้ดึงจาก gpaHistory ล่าสุด
    if (calculatedGPAX === 0 && userProfile.gpaHistory) {
      const latestGPA = Object.values(userProfile.gpaHistory).pop();
      calculatedGPAX = latestGPA || 0;
    }

    return {
      earnedCredits,
      calculatedGPAX,
      coopStats: {
        isCreditReady: earnedCredits >= 90,
        isGPAReady: calculatedGPAX >= 2.75,
      }
    };
  }, [courseStates, courseGrades, userProfile]);

  // ฟังก์ชันเช็คว่าวิชานั้นผ่านหรือยัง
  const isCoursePassedByCode = (code) => {
    return courseStates[code] === 'passed';
  };

  // คำนวณ GPA_10
  const { gpa10, gradedCount, totalPassedCourses } = useMemo(() => {
    let sum = 0;
    let count = 0;
    let passedCount = 0;

    REQUIRED_COURSES.forEach(course => {
      if (isCoursePassedByCode(course.code)) {
        passedCount++;
        const g = courseGrades[course.code];
        if (g !== null && g !== undefined) {
          sum += g;
          count++;
        }
      }
    });

    return {
      gpa10: count > 0 ? sum / count : null,
      gradedCount: count,
      totalPassedCourses: passedCount
    };
  }, [courseStates, courseGrades]);

  const isCoursesReady = gpa10 !== null && gpa10 >= 2.5;

  // สถานะ Coop overall
  const allCriteriaMet = stats.coopStats.isCreditReady && stats.coopStats.isGPAReady && isCoursesReady;

  const handleGradeChange = (code, value) => {
    const updated = { ...courseGrades, [code]: value };
    setCourseGrades(updated);
    saveCoopGrades(updated);
  };

  // ฟังก์ชันกลับไปหน้า dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section with Back Button */}
          <div className="relative">
            {/* Back Button - อยู่ข้างๆ */}
            <button
              onClick={handleBack}
              className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border-2 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-cyan-500/40 transition-all duration-200 group z-10"
            >
              <ArrowLeft size={24} className="group-hover:translate-x-[-2px] transition-transform duration-200" />
            </button>

            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <Award size={48} className="text-cyan-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                คุณสมบัติสหกิจศึกษา
              </h1>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                ตรวจสอบคุณสมบัติการสมัครโครงการสหกิจศึกษา (Cooperative Education) 
                ให้ครบ 3 เงื่อนไขหลัก พร้อม GPA_10 Calculator แบบ real-time
              </p>
            </div>
          </div>

          {/* Overall Status Banner */}
          <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
            allCriteriaMet
              ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/25 via-emerald-500/15 to-slate-800/50'
              : 'border-yellow-500/60 bg-gradient-to-br from-yellow-500/25 via-yellow-500/15 to-slate-800/50'
          }`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${allCriteriaMet ? '#10b981' : '#eab308'} 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            <div className="relative p-8">
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl ${allCriteriaMet ? 'bg-emerald-500/30' : 'bg-yellow-500/30'}`}>
                  {allCriteriaMet ? (
                    <CheckCircle2 size={32} className="text-emerald-300" />
                  ) : (
                    <AlertCircle size={32} className="text-yellow-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-black mb-2 ${allCriteriaMet ? 'text-emerald-300' : 'text-yellow-300'}`}>
                    {allCriteriaMet ? 'ยินดีด้วย! คุณมีคุณสมบัติครบถ้วน' : 'ตรวจสอบคุณสมบัติของคุณ'}
                  </h2>
                  <p className="text-slate-200 leading-relaxed">
                    {allCriteriaMet 
                      ? 'คุณผ่านเกณฑ์คุณสมบัติทั้ง 3 ข้อ สามารถสมัครเข้าโครงการสหกิจศึกษาได้ในปี 3 เทอม 2'
                      : 'ตรวจสอบรายละเอียดด้านล่างเพื่อดูว่าคุณสมบัติข้อไหนที่ยังไม่ผ่านเกณฑ์'}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      { label: 'หน่วยกิต ≥ 90', ok: stats.coopStats.isCreditReady },
                      { label: 'GPA ≥ 2.75', ok: stats.coopStats.isGPAReady },
                      { label: 'GPA_10 ≥ 2.50', ok: isCoursesReady }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${
                        item.ok ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50' : 'bg-red-500/25 text-red-300 border-red-500/50'
                      }`}>
                        {item.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Requirements Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ClipboardCheck size={24} className="text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">คุณสมบัติหลัก (3 ข้อ)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RequirementCard
                icon={BookOpen}
                title="หน่วยกิตสะสม"
                description="ลงทะเบียนเรียนครบตามตารางที่ภาควิชากำหนด"
                current={Math.round(stats.earnedCredits)}
                required={90}
                isPassed={stats.coopStats.isCreditReady}
                unit="หน่วยกิต"
              />
              <RequirementCard
                icon={TrendingUp}
                title="เกรดเฉลี่ยรวม (GPA)"
                description="ผลการเรียน 5 ภาคการศึกษา"
                current={stats.calculatedGPAX.toFixed(2)}
                required={2.75}
                isPassed={stats.coopStats.isGPAReady}
                unit=""
              />
              <RequirementCard
                icon={GraduationCap}
                title="เกรดเฉลี่ยวิชาเอก (GPA_10)"
                description="คำนวณแบบ real-time จากเกรดที่เลือก"
                current={gpa10 !== null ? gpa10.toFixed(2) : '—'}
                required={2.5}
                isPassed={isCoursesReady}
                unit=""
                highlight={true}
              />
            </div>
          </div>

          {/* GPA_10 Live Meter */}
          <GPA10Meter gpa10={gpa10} gradedCount={gradedCount} totalPassedCourses={totalPassedCourses} />

          {/* Required Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                  10 รายวิชาบังคับ (GPA_10 ≥ 2.50)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {/* Live GPA pill */}
                <div className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  gpa10 === null
                    ? 'bg-slate-800/60 border-slate-700/60'
                    : gpa10 >= 2.5
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'bg-red-500/20 border-red-500/50'
                }`}>
                  <span className="text-sm font-mono">
                    <span className={`font-black ${
                      gpa10 === null ? 'text-slate-400'
                        : gpa10 >= 2.5 ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {gpa10 === null ? '—' : gpa10.toFixed(2)}
                    </span>
                    <span className="text-slate-400"> GPA_10</span>
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-800/60 border-2 border-slate-700/60">
                  <span className="text-sm font-mono text-white">
                    <span className="text-cyan-300 font-bold">{totalPassedCourses}</span>
                    <span className="text-slate-400"> / 10 ติกผ่าน</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REQUIRED_COURSES.map((course, idx) => (
                <CourseListItem
                  key={course.code}
                  number={idx + 1}
                  code={course.code}
                  name={course.name}
                  grade={courseGrades[course.code]}
                  onGradeChange={(val) => handleGradeChange(course.code, val)}
                  isCoursePassed={isCoursePassedByCode(course.code)}
                />
              ))}
            </div>

            <div className="mt-6 p-5 bg-blue-500/20 border-2 border-blue-500/40 rounded-2xl">
              <div className="flex gap-4">
                <AlertCircle size={20} className="text-blue-300 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-blue-100 font-semibold">⚠️ ข้อกำหนดสำคัญ</p>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    นอกจากต้องเรียนผ่านครบทั้ง 10 วิชาแล้ว นักศึกษาต้องมี{' '}
                    <strong className="text-white">เกรดเฉลี่ยเฉพาะกลุ่มวิชานี้ (GPA_10) ไม่ต่ำกว่า 2.50</strong>{' '}
                    โดยคำนวณจากผลการเรียนใน 10 รายวิชาข้างต้นเท่านั้น เลือกเกรดด้านขวาเพื่อดูผลแบบ real-time
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={24} className="text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">ขั้นตอนการสมัคร</h3>
            </div>
            <div className="bg-slate-800/60 border-2 border-slate-700/60 rounded-2xl p-6">
              <TimelineStep number={1} title="ตรวจสอบคุณสมบัติ" detail="ตรวจสอบว่าตนเองมีคุณสมบัติครบถ้วนตามเงื่อนไข 3 ข้อข้างต้น (หน่วยกิต, GPA, และ GPA_10)" isActive={true} />
              <TimelineStep number={2} title="ช่วงเวลาสมัคร" detail="สมัครเข้าร่วมโครงการในช่วงปี 3 เทอม 2 (ภาคการศึกษาที่ 2 ของชั้นปีที่ 3)" isActive={true} />
              <TimelineStep number={3} title="ลงทะเบียนเรียน Pre-coop" detail="ลงทะเบียนเรียนรายวิชา 040613400 Pre-coop ไปพร้อมกับการสมัครเข้าร่วมโครงการ" isActive={true} />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-pink-500/20 border-2 border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30">
                <Briefcase size={24} className="text-cyan-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-2">เกี่ยวกับโครงการสหกิจศึกษา</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  โครงการสหกิจศึกษา (Cooperative Education) เป็นโครงการที่ช่วยให้นักศึกษาได้รับประสบการณ์การทำงานจริง
                  ในสถานประกอบการ เพื่อเป็นการพัฒนาทักษะและความรู้ที่สอดคล้องกับการเรียนในมหาวิทยาลัย
                  และเตรียมความพร้อมสำหรับการทำงานในอนาคต
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
};

export default CoopEligibilityPage;