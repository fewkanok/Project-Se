import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Award, CheckCircle2, XCircle, AlertCircle, BookOpen, Calendar, FileText, TrendingUp, GraduationCap, Briefcase, ClipboardCheck, ChevronDown, Calculator } from 'lucide-react';

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

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = 'coopGradeStates';

const loadGradeStates = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // validate: values must be numbers or null
    const clean = {};
    Object.entries(parsed).forEach(([code, val]) => {
      clean[code] = (val === null || (typeof val === 'number' && !isNaN(val))) ? val : null;
    });
    return clean;
  } catch {
    return {};
  }
};

const saveGradeStates = (grades) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(grades));
  } catch (e) {
    console.error('Failed to save coop grades:', e);
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const RequirementCard = ({ icon: Icon, title, current, required, isPassed, unit, description, highlight }) => (
  <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
    isPassed
      ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent'
      : 'border-red-500/50 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent'
  }`}>
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isPassed ? '#10b981' : '#ef4444'} 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}></div>
    </div>

    <div className="relative p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <Icon size={24} className={isPassed ? 'text-emerald-400' : 'text-red-400'} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">{title}</h4>
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
        </div>
        <div className={`p-2 rounded-full ${isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          {isPassed ? (
            <CheckCircle2 size={20} className="text-emerald-400" />
          ) : (
            <XCircle size={20} className="text-red-400" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl font-black transition-colors duration-300 ${highlight ? (isPassed ? 'text-emerald-300' : 'text-red-300') : 'text-white'}`}>
            {current}
          </span>
          <span className="text-lg text-slate-400">/ {required} {unit}</span>
        </div>

        <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
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
          <span className={isPassed ? 'text-emerald-400' : 'text-red-400'}>
            {Math.round((parseFloat(current) / required) * 100)}% Complete
          </span>
          <span className="text-slate-500">Required: {required} {unit}</span>
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

// isCoursePassed = มาจาก courseStates === 'passed' (SetupProfile)
// grade         = grade point ที่ user เลือกใน modal (เฉพาะ passed)
const CourseListItem = ({ number, code, name, grade, onGradeChange, isCoursePassed }) => {
  const gradeInfo = (isCoursePassed && grade !== null && grade !== undefined)
    ? GRADE_DISPLAY[grade]
    : null;

  // สีพื้นหลัง: เขียว = ติกผ่านแล้ว, เทา = ยังไม่ผ่าน
  return (
    <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
      isCoursePassed
        ? 'border-emerald-500/40 bg-emerald-500/8 hover:bg-emerald-500/12'
        : 'border-slate-700/50 bg-slate-800/30 opacity-60'
    }`}>
      <div className="flex items-center gap-3 p-3.5">

        {/* Number badge */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
          isCoursePassed
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-slate-700/50 text-slate-500'
        }`}>
          {number}
        </div>

        {/* Course info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate leading-tight ${isCoursePassed ? 'text-white' : 'text-slate-500'}`}>
            {name}
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{code}</p>
        </div>

        {/* Grade badge — แสดงเฉพาะเมื่อเลือกเกรดแล้ว */}
        {gradeInfo && (
          <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${gradeInfo.bg} ${gradeInfo.border}`}>
            <span className={`text-xs font-black ${gradeInfo.color}`}>{gradeInfo.letter}</span>
          </div>
        )}

        {/* Status icon */}
        <div className="flex-shrink-0">
          {isCoursePassed ? (
            <CheckCircle2 size={16} className="text-emerald-400" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-dashed" />
          )}
        </div>

        {/* Dropdown — แสดงเฉพาะวิชาที่ติกเขียว */}
        {isCoursePassed
          ? <GradeDropdown value={grade} onChange={onGradeChange} />
          : (
            <div className="w-[130px] flex items-center justify-center">
              <span className="text-[11px] text-slate-600 font-mono italic">ยังไม่ผ่าน</span>
            </div>
          )
        }
      </div>
    </div>
  );
};

const TimelineStep = ({ number, title, detail, isActive }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
        isActive
          ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/50'
          : 'bg-slate-800 border-slate-700 text-slate-500'
      }`}>
        {number}
      </div>
      {number < 3 && (
        <div className={`w-0.5 h-16 transition-all duration-300 ${
          isActive ? 'bg-gradient-to-b from-cyan-500 to-slate-700' : 'bg-slate-700'
        }`}></div>
      )}
    </div>
    <div className="flex-1 pb-8">
      <h5 className={`font-bold mb-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>
        {title}
      </h5>
      <p className="text-sm text-slate-500 leading-relaxed">{detail}</p>
    </div>
  </div>
);

// ─── GPA_10 Live Meter ───────────────────────────────────────────────────────
const GPA10Meter = ({ gpa10, gradedCount, totalPassedCourses }) => {
  const isPassed = gpa10 !== null && gpa10 >= 2.5;
  const percentage = gpa10 !== null ? Math.min(100, (gpa10 / 4.0) * 100) : 0;

  // Color zones
  const barColor = gpa10 === null
    ? 'bg-slate-600'
    : gpa10 >= 2.5
      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
      : gpa10 >= 1.5
        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
        : 'bg-gradient-to-r from-red-500 to-rose-600';

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-500 ${
      gpa10 === null
        ? 'border-slate-700/50 bg-slate-800/30'
        : isPassed
          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent'
          : 'border-red-500/50 bg-gradient-to-br from-red-500/10 via-transparent to-transparent'
    }`}>
      {/* bg pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${gpa10 === null ? '#64748b' : isPassed ? '#10b981' : '#ef4444'} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${gpa10 === null ? 'bg-slate-700/50' : isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <Calculator size={24} className={gpa10 === null ? 'text-slate-400' : isPassed ? 'text-emerald-400' : 'text-red-400'} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">GPA_10 แบบ Real-time</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                คำนวณจาก {gradedCount} วิชาที่ติก ✓ และกรอกเกรดแล้ว (จาก {totalPassedCourses} วิชาที่ผ่าน)
              </p>
            </div>
          </div>
          <div className={`p-2 rounded-full ${gpa10 === null ? 'bg-slate-700/50' : isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {gpa10 === null
              ? <AlertCircle size={20} className="text-slate-400" />
              : isPassed
                ? <CheckCircle2 size={20} className="text-emerald-400" />
                : <XCircle size={20} className="text-red-400" />
            }
          </div>
        </div>

        {/* Big GPA number */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`text-5xl font-black tabular-nums transition-all duration-300 ${
            gpa10 === null
              ? 'text-slate-500'
              : isPassed
                ? 'text-emerald-300'
                : 'text-red-300'
          }`}>
            {gpa10 === null ? '—' : gpa10.toFixed(2)}
          </span>
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">/ 4.00</span>
            <span className={`text-xs font-bold mt-0.5 ${
              gpa10 === null ? 'text-slate-500' : isPassed ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {gpa10 === null ? 'ยังไม่ได้เลือก' : isPassed ? '✓ ผ่านเกณฑ์' : '✗ ไม่ผ่านเกณฑ์ (≥ 2.50)'}
            </span>
          </div>
        </div>

        {/* Animated bar */}
        <div className="relative h-4 bg-slate-800/70 rounded-full overflow-hidden mb-3">
          {/* Threshold marker at 2.5/4.0 = 62.5% */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/70 z-10" style={{ left: '62.5%' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percentage}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
        </div>

        {/* Labels under bar */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>0.00</span>
          <span className="text-yellow-400/80">เกณฑ์ 2.50</span>
          <span>4.00</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Modal ──────────────────────────────────────────────────────────────
const CoopEligibilityModal = ({ isOpen, onClose, stats }) => {
  // ── ดึง courseStates จาก localStorage (SetupProfile บันทึกไว้) ─────────────
  const courseStates = useMemo(() => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed?.courseStates || {};
    } catch {
      return {};
    }
  }, []);

  // courseId ของ 10 วิชา Co-op อาจตรงกับ code หรือ id ใน roadmapData
  // ใช้ทั้ง code (040613203) และลองหา key ที่ includes code เพื่อ safety
  const isCoursePassedByCode = (code) => {
    // ตรงตัว
    if (courseStates[code] === 'passed') return true;
    // บางระบบอาจใช้ id ที่มี code อยู่ข้างใน
    return Object.entries(courseStates).some(
      ([id, status]) => id.includes(code) && status === 'passed'
    );
  };

  // Load from localStorage once on mount, fall back to null for each course
  const [courseGrades, setCourseGrades] = useState(() => {
    const saved = loadGradeStates();
    const init = {};
    REQUIRED_COURSES.forEach(c => {
      init[c.code] = saved[c.code] ?? null;
    });
    return init;
  });

  // Auto-save to localStorage whenever grades change (debounced 400ms, skip mount)
  const saveTimerRef = useRef(null);
  const isFirstSave = useRef(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'

  useEffect(() => {
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGradeStates(courseGrades);
      setSaveStatus('saved');
    }, 400);
    return () => clearTimeout(saveTimerRef.current);
  }, [courseGrades]);

  const handleGradeChange = (code, value) => {
    setCourseGrades(prev => ({ ...prev, [code]: value }));
  };

  // ── Derived calculations — นับเฉพาะวิชาที่ติกเขียว AND มีเกรด ─────────────
  const { gpa10, gradedCount, passedCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    let passed = 0;
    REQUIRED_COURSES.forEach(c => {
      if (!isCoursePassedByCode(c.code)) return; // ไม่นับถ้ายังไม่ติกเขียว
      const g = courseGrades[c.code];
      if (g !== null && g !== undefined) {
        total += g;
        count++;
        if (g >= 2.5) passed++;
      }
    });
    return {
      gpa10: count > 0 ? total / count : null,
      gradedCount: count,
      passedCount: passed,
    };
  }, [courseGrades, courseStates]);

  // นับวิชาที่ติกเขียวทั้งหมด (ไม่ขึ้นกับเกรด)
  const totalPassedCourses = useMemo(
    () => REQUIRED_COURSES.filter(c => isCoursePassedByCode(c.code)).length,
    [courseStates]
  );

  // Use real GPA_10 from selections for requirement check
  const isCoursesReady = gpa10 !== null && gpa10 >= 2.5 && passedCount === 10;

  if (!isOpen) return null;

  const allPassed = stats.coopStats.isCreditReady && stats.coopStats.isGPAReady && isCoursesReady;
  const anyPassed = stats.coopStats.isCreditReady || stats.coopStats.isGPAReady || isCoursesReady;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* ── Header ── */}
        <div className="relative border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-xl opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
                    <Award size={32} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Co-op Eligibility Check</h2>
                  <p className="text-slate-400 text-sm">ระเบียบการและคุณสมบัติสำหรับนักศึกษาโครงการสหกิจศึกษา</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-xs font-bold text-cyan-400">CIS • KMUTNB</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Save status pill */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 ${
                  saveStatus === 'saving'
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
                  {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="relative overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
          <div className="p-8 space-y-8">

            {/* Overall Status Banner */}
            <div className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-500 ${
              allPassed
                ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent'
                : 'border-orange-500/50 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${allPassed ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                  {allPassed
                    ? <CheckCircle2 size={36} className="text-emerald-400" />
                    : <AlertCircle size={36} className="text-orange-400" />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-1">
                    {allPassed ? '🎉 ผ่านคุณสมบัติทั้งหมด!' : 'กำลังดำเนินการ'}
                  </h3>
                  <p className={allPassed ? 'text-emerald-300' : 'text-orange-300'}>
                    {allPassed
                      ? 'คุณมีคุณสมบัติครบถ้วนสำหรับโครงการสหกิจศึกษา'
                      : 'คุณกำลังอยู่ในเส้นทางที่ถูกต้อง โปรดตรวจสอบข้อกำหนดด้านล่าง'}
                  </p>
                </div>
                {/* Mini summary pills */}
                <div className="hidden md:flex flex-col gap-2">
                  {[
                    { label: 'หน่วยกิต', ok: stats.coopStats.isCreditReady },
                    { label: 'GPA ≥ 2.75', ok: stats.coopStats.isGPAReady },
                    { label: 'GPA_10 ≥ 2.50', ok: isCoursesReady },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      item.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {item.label}
                    </div>
                  ))}
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
                  <div className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                    gpa10 === null
                      ? 'bg-slate-800/50 border-slate-700/50'
                      : gpa10 >= 2.5
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <span className="text-sm font-mono">
                      <span className={`font-black ${
                        gpa10 === null ? 'text-slate-400'
                          : gpa10 >= 2.5 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {gpa10 === null ? '—' : gpa10.toFixed(2)}
                      </span>
                      <span className="text-slate-500"> GPA_10</span>
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-sm font-mono text-white">
                      <span className="text-cyan-400 font-bold">{totalPassedCourses}</span>
                      <span className="text-slate-500"> / 10 ติกผ่าน</span>
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

              <div className="mt-6 p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-blue-200 font-semibold">⚠️ ข้อกำหนดสำคัญ</p>
                    <p className="text-xs text-blue-300 leading-relaxed">
                      นอกจากต้องเรียนผ่านครบทั้ง 10 วิชาแล้ว นักศึกษาต้องมี{' '}
                      <strong className="text-blue-100">เกรดเฉลี่ยเฉพาะกลุ่มวิชานี้ (GPA_10) ไม่ต่ำกว่า 2.50</strong>{' '}
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
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <TimelineStep number={1} title="ตรวจสอบคุณสมบัติ" detail="ตรวจสอบว่าตนเองมีคุณสมบัติครบถ้วนตามเงื่อนไข 3 ข้อข้างต้น (หน่วยกิต, GPA, และ GPA_10)" isActive={true} />
                <TimelineStep number={2} title="ช่วงเวลาสมัคร" detail="สมัครเข้าร่วมโครงการในช่วงปี 3 เทอม 2 (ภาคการศึกษาที่ 2 ของชั้นปีที่ 3)" isActive={true} />
                <TimelineStep number={3} title="ลงทะเบียนเรียน Pre-coop" detail="ลงทะเบียนเรียนรายวิชา 040613400 Pre-coop ไปพร้อมกับการสมัครเข้าร่วมโครงการ" isActive={true} />
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  <Briefcase size={24} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">เกี่ยวกับโครงการสหกิจศึกษา</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    โครงการสหกิจศึกษา (Cooperative Education) เป็นโครงการที่ช่วยให้นักศึกษาได้รับประสบการณ์การทำงานจริง
                    ในสถานประกอบการ เพื่อเป็นการพัฒนาทักษะและความรู้ที่สอดคล้องกับการเรียนในมหาวิทยาลัย
                    และเตรียมความพร้อมสำหรับการทำงานในอนาคต
                  </p>
                </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.5); }
      `}</style>
    </div>
  );
};

export default CoopEligibilityModal;