import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calculator, RefreshCw, Target, BookOpen, GraduationCap,
  ChevronDown, AlertCircle, ArrowRight, TrendingUp, TrendingDown,
  Minus, Zap, Award, AlertTriangle, CheckCircle, Info, X,
} from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';

// ─── constants (module-level, not inside component) ───────────────────────────
const GRADE_VALUES = {
  A: 4.0, 'B+': 3.5, B: 3.0, 'C+': 2.5,
  C: 2.0, 'D+': 1.5, D: 1.0,  F: 0.0, W: null,
};
const GRADE_KEYS = Object.keys(GRADE_VALUES);

// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp      = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const safeFixed  = (n, d = 2)  =>
  n == null || !isFinite(n) ? '-.--' : clamp(n, 0, 4).toFixed(d);
const isValidGPA = (s) => { const n = parseFloat(s); return !isNaN(n) && n >= 0 && n <= 4; };

const getGradeColor = (grade) => {
  if (!grade) return 'text-slate-500 border-white/10 bg-white/5';
  return ({
    A  : 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
    'B+': 'text-cyan-400   border-cyan-500/50    bg-cyan-500/10    shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    B  : 'text-cyan-400   border-cyan-500/50    bg-cyan-500/10    shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    'C+': 'text-orange-400 border-orange-500/50  bg-orange-500/10  shadow-[0_0_10px_rgba(251,146,60,0.2)]',
    C  : 'text-orange-400 border-orange-500/50  bg-orange-500/10  shadow-[0_0_10px_rgba(251,146,60,0.2)]',
    'D+': 'text-yellow-400 border-yellow-500/50  bg-yellow-500/10',
    D  : 'text-yellow-400 border-yellow-500/50  bg-yellow-500/10',
    F  : 'text-red-400    border-red-500/50     bg-red-500/10',
    W  : 'text-slate-400  border-white/10       bg-white/5',
  }[grade] ?? 'text-slate-400 border-white/10 bg-white/5');
};

// ─── tiny Toast component ─────────────────────────────────────────────────────
const TOAST_CLS = {
  error:   'bg-red-950/90   border-red-500/40   text-red-200',
  warn:    'bg-amber-950/90 border-amber-500/40 text-amber-200',
  info:    'bg-cyan-950/90  border-cyan-500/40  text-cyan-200',
  success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
};
const TOAST_ICON = { error: <AlertCircle size={14}/>, warn: <AlertTriangle size={14}/>, info: <Info size={14}/>, success: <CheckCircle size={14}/> };
const Toast = ({ toasts, dismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto text-xs font-medium ${TOAST_CLS[t.type]}`}>
        {TOAST_ICON[t.type]}
        <span>{t.msg}</span>
        <button onClick={() => dismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100"><X size={12}/></button>
      </div>
    ))}
  </div>
);

// ─── Trend badge ──────────────────────────────────────────────────────────────
const TrendBadge = ({ prev, cur }) => {
  if (!prev || cur == null || !isFinite(cur)) return null;
  const d = cur - prev;
  if (Math.abs(d) < 0.005) return <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]"><Minus size={10}/>No change</span>;
  return d > 0
    ? <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px]"><TrendingUp size={10}/>+{d.toFixed(2)}</span>
    : <span className="inline-flex items-center gap-1 text-red-400 text-[10px]"><TrendingDown size={10}/>{d.toFixed(2)}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
const GradeCalculator = () => {
  const [learningCourses, setLearningCourses] = useState([]);
  const [predictedGrades, setPredictedGrades] = useState({});
  const [targetGPAX,      setTargetGPAX]      = useState('');
  const [targetErr,       setTargetErr]        = useState('');

  const [prevCredits, setPrevCredits] = useState(0);
  const [prevPoints,  setPrevPoints]  = useState(0);
  const [prevGPAX,    setPrevGPAX]    = useState(0);

  const [loadErr, setLoadErr] = useState(null);   // banner ด้านบน
  const [toasts,  setToasts]  = useState([]);

  // ── toast helpers ──────────────────────────────────────────────────────────
  const pushToast = useCallback((msg, type = 'info', ms = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p.slice(-4), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms);
  }, []);
  const dismissToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  // ── useEffect — โครงสร้างเดิม เพิ่ม guard ──────────────────────────────────
  useEffect(() => {
    // ── อ่าน localStorage ────────────────────────────────────────────────────
    let saved = null;
    try { saved = localStorage.getItem('userProfile'); }
    catch (e) { setLoadErr(`อ่าน localStorage ไม่ได้: ${e.message}`); return; }

    if (!saved) { setLoadErr('ไม่พบข้อมูลโปรไฟล์ใน localStorage'); return; }

    let parsed = null;
    try { parsed = JSON.parse(saved); }
    catch  { setLoadErr('ข้อมูลโปรไฟล์เสียหาย (JSON ไม่ถูกต้อง)'); return; }

    if (!parsed || typeof parsed !== 'object') {
      setLoadErr('รูปแบบ userProfile ไม่ถูกต้อง'); return;
    }

    // ── 1. หา Learning Courses (โครงสร้างเดิม + dedup + guard) ───────────────
    const currentIds = Array.isArray(parsed.learningCourses) ? parsed.learningCourses : [];
    const seen        = new Set();
    const coursesDetails = [];

    const tryPush = (c) => {
      if (!c?.id || !currentIds.includes(c.id) || seen.has(c.id)) return;
      seen.add(c.id);
      const credits = typeof c.credits === 'number' && c.credits > 0 ? c.credits : 0;
      if (credits === 0) console.warn(`[GradeCalc] credits ผิดปกติ: ${c.id}`, c.credits);
      coursesDetails.push({ ...c, credits });
    };

    // วนแบบเดิม
    roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(tryPush)));
    electiveCourses.forEach(tryPush);

    // แจ้ง id ที่หาไม่เจอ
    const foundIds = new Set(coursesDetails.map(c => c.id));
    const missing  = currentIds.filter(id => !foundIds.has(id));
    if (missing.length > 0) {
      console.warn('[GradeCalc] หา id ไม่เจอใน data:', missing);
      pushToast(`หาวิชาไม่พบ ${missing.length} รายการ — ดู Console`, 'warn', 7000);
    }

    setLearningCourses(coursesDetails);
    setLoadErr(null);

    // ── 2. คำนวณ Previous GPA (โครงสร้างเดิม + guard) ───────────────────────
    let totalPrevPoints  = 0;
    let totalPrevCredits = 0;
    const courseStates   = parsed.courseStates && typeof parsed.courseStates === 'object' ? parsed.courseStates : {};

    if (parsed.gpaHistory && typeof parsed.gpaHistory === 'object') {
      Object.entries(parsed.gpaHistory).forEach(([termKey, gpa]) => {
        try {
          // รองรับ "Y1/1" และ "1/1" และ "Y1-1"
          const m = String(termKey).match(/Y?(\d+)[\/\-](\d+)/);
          if (!m) { console.warn('[GradeCalc] termKey รูปแบบไม่รู้จัก:', termKey); return; }
          const y      = parseInt(m[1], 10);
          const t      = parseInt(m[2], 10);
          const gpaVal = parseFloat(gpa);

          if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4) {
            console.warn(`[GradeCalc] GPA ไม่ถูกต้อง term ${termKey}:`, gpa); return;
          }

          let termCredits = 0;

          const roadmapTerm = roadmapData.find(r => r.year === y)?.semesters?.find(s => s.term === t);
          if (roadmapTerm) {
            roadmapTerm.courses.forEach(c => {
              if (courseStates[c.id] === 'passed' && typeof c.credits === 'number')
                termCredits += c.credits;
            });
          }

          const electiveKey = `${y}-${t}`;
          if (parsed.customElectives && Array.isArray(parsed.customElectives[electiveKey])) {
            parsed.customElectives[electiveKey].forEach(elecId => {
              const elec = electiveCourses.find(e => e.id === elecId);
              if (elec && courseStates[elecId] === 'passed' && typeof elec.credits === 'number')
                termCredits += elec.credits;
            });
          }

          if (termCredits > 0) {
            totalPrevPoints  += gpaVal * termCredits;
            totalPrevCredits += termCredits;
          }
        } catch (err) {
          console.error(`[GradeCalc] ประมวลผล term ${termKey} ล้มเหลว:`, err);
        }
      });
    }

    setPrevCredits(totalPrevCredits);
    setPrevPoints(totalPrevPoints);
    setPrevGPAX(totalPrevCredits > 0 ? totalPrevPoints / totalPrevCredits : 0);
  }, []);  // dependency เดิม

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleGradeChange = useCallback((courseId, grade) => {
    if (grade && !GRADE_KEYS.includes(grade)) { pushToast(`เกรด "${grade}" ไม่ถูกต้อง`, 'error'); return; }
    setPredictedGrades(prev => ({ ...prev, [courseId]: grade }));
  }, [pushToast]);

  const handleTargetChange = (raw) => {
    setTargetGPAX(raw);
    if (!raw) { setTargetErr(''); return; }
    const n = parseFloat(raw);
    if (isNaN(n))  { setTargetErr('ต้องเป็นตัวเลขเท่านั้น'); return; }
    if (n < 0)     { setTargetErr('ต้องไม่ต่ำกว่า 0.00');    return; }
    if (n > 4)     { setTargetErr('สูงสุดคือ 4.00');          return; }
    setTargetErr('');
  };

  // ── calculateResults (โครงสร้างเดิม แต่ memoised) ─────────────────────────
  const { termGPA, cumulativeGPA, currentTermCredits, totalCredits, simulatedTermCredits } = useMemo(() => {
    try {
      let currentTermPoints  = 0;
      let currentTermCredits = 0;

      learningCourses.forEach(course => {
        currentTermCredits += course.credits;
        const grade = predictedGrades[course.id];
        if (grade && grade !== 'W' && GRADE_VALUES[grade] != null)
          currentTermPoints += GRADE_VALUES[grade] * course.credits;
      });

      const termGPA = currentTermCredits > 0 ? currentTermPoints / currentTermCredits : 0;

      let simulatedTermCredits = 0;
      let simulatedTermPoints  = 0;
      learningCourses.forEach(course => {
        const grade = predictedGrades[course.id];
        if (grade && grade !== 'W' && GRADE_VALUES[grade] != null) {
          simulatedTermCredits += course.credits;
          simulatedTermPoints  += GRADE_VALUES[grade] * course.credits;
        }
      });

      const totalPoints    = prevPoints  + simulatedTermPoints;
      const totalCredits   = prevCredits + simulatedTermCredits;
      const cumulativeGPA  = totalCredits > 0 ? totalPoints / totalCredits : 0;

      return { termGPA, cumulativeGPA, currentTermCredits, totalCredits, simulatedTermCredits };
    } catch (e) {
      console.error('[GradeCalc] calculateResults error:', e);
      return { termGPA: 0, cumulativeGPA: 0, currentTermCredits: 0, totalCredits: 0, simulatedTermCredits: 0 };
    }
  }, [learningCourses, predictedGrades, prevPoints, prevCredits]);

  // ── calculateRequiredGPA (โครงสร้างเดิม) ─────────────────────────────────
  const calculateRequiredGPA = (target, credits) => {
    if (!target || targetErr || credits === 0 || !isValidGPA(target)) return null;
    try {
      const targetVal           = parseFloat(target);
      const totalCreditsFuture  = prevCredits + credits;
      const requiredTotalPoints = targetVal * totalCreditsFuture;
      const neededTermPoints    = requiredTotalPoints - prevPoints;
      const neededTermGPA       = neededTermPoints / credits;
      return {
        neededTermGPA,
        isPossible:   neededTermGPA <= 4 && neededTermGPA >= 0,
        neededPoints: neededTermPoints,
        alreadyDone:  prevCredits > 0 && (prevPoints / prevCredits) >= targetVal,
      };
    } catch (e) {
      console.error('[GradeCalc] calculateRequiredGPA error:', e);
      return null;
    }
  };

  const targetResult = calculateRequiredGPA(targetGPAX, currentTermCredits);

  // ── smart helpers ──────────────────────────────────────────────────────────
  const completionPct = currentTermCredits > 0
    ? Math.round((simulatedTermCredits / currentTermCredits) * 100) : 0;

  // หาเกรดขั้นต่ำ uniform ที่ทำให้ถึงเป้า
  const minGradeSuggestion = useMemo(() => {
    if (!targetGPAX || targetErr || !isValidGPA(targetGPAX) || currentTermCredits === 0) return null;
    const tv       = parseFloat(targetGPAX);
    const futCr    = prevCredits + currentTermCredits;
    const neededPts = tv * futCr - prevPoints;
    for (const key of [...GRADE_KEYS].reverse()) {
      const gv = GRADE_VALUES[key];
      if (gv == null) continue;
      if (learningCourses.reduce((s, c) => s + gv * c.credits, 0) >= neededPts) return key;
    }
    return null;
  }, [targetGPAX, targetErr, currentTermCredits, prevCredits, prevPoints, learningCourses]);

  const fillAll = useCallback((grade) => {
    const next = {};
    learningCourses.forEach(c => { next[c.id] = grade; });
    setPredictedGrades(next);
    pushToast(`ตั้งเกรด ${grade} ให้ทุกวิชาแล้ว`, 'info');
  }, [learningCourses, pushToast]);

  const applyMinGrade = useCallback(() => {
    if (!minGradeSuggestion) return;
    fillAll(minGradeSuggestion);
    pushToast(`ใส่เกรดขั้นต่ำแนะนำ (${minGradeSuggestion}) ทุกวิชาแล้ว`, 'success');
  }, [minGradeSuggestion, fillAll, pushToast]);

  const resetAll = () => {
    setPredictedGrades({});
    setTargetGPAX('');
    setTargetErr('');
    pushToast('รีเซ็ตแล้ว', 'info');
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent text-white font-sans pb-20 pt-10 px-6">
      <Toast toasts={toasts} dismiss={dismissToast} />

      {/* ── Header (โครงสร้างเดิม) ── */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
            Grade Calculator
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Simulation &amp; Target Prediction</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick fill buttons (ใหม่) */}
          {learningCourses.length > 0 && (
            <>
              {[['A','border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400'],
                ['B','border-cyan-500/30   hover:bg-cyan-500/10   text-cyan-400'],
                ['C','border-orange-500/30 hover:bg-orange-500/10 text-orange-400']].map(([g, cls]) => (
                <button key={g} onClick={() => fillAll(g)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${cls}`}>
                  Fill {g}
                </button>
              ))}
            </>
          )}
          {learningCourses.length > 0 && (
            <button onClick={resetAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
              <RefreshCw size={14}/> Reset Data
            </button>
          )}
        </div>
      </div>

      {/* ── Load Error Banner (ใหม่) ── */}
      {loadErr && (
        <div className="max-w-7xl mx-auto mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5"/>
          <div>
            <p className="font-bold mb-0.5">โหลดข้อมูลไม่ได้</p>
            <p className="text-red-400/70">{loadErr}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ══ LEFT: Course Inputs (โครงสร้างเดิม) ══ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-cyan-400" size={20}/>
            <h2 className="text-xl font-bold text-white">Current Term Courses</h2>
            <span className="bg-white/10 text-xs px-2 py-0.5 rounded text-slate-300 font-mono">
              {currentTermCredits} Credits
            </span>
            {/* completion badge (ใหม่) */}
            {completionPct > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                completionPct === 100
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>{completionPct}% filled</span>
            )}
          </div>

          {learningCourses.length > 0 ? (
            <div className="space-y-2">
              {learningCourses.map(course => (
                <div key={course.id}
                  className="group relative flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">

                  {/* Course Info (โครงสร้างเดิม) */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-black/20 border border-white/5 font-mono text-xs text-slate-500">
                      <span className="font-bold text-slate-300 text-sm">{course.credits}</span>
                      <span className="text-[9px]">Cr.</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-500/80 font-bold">{course.code}</span>
                      </div>
                      <h3 className="font-bold text-slate-200 text-sm md:text-base leading-tight pr-2">{course.name}</h3>
                    </div>
                  </div>

                  {/* Grade Selector (โครงสร้างเดิม) */}
                  <div className="relative w-24 md:w-32 shrink-0">
                    <select
                      className={`w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-bold border outline-none cursor-pointer transition-all text-center
                        ${getGradeColor(predictedGrades[course.id])}
                      `}
                      value={predictedGrades[course.id] || ''}
                      onChange={e => handleGradeChange(course.id, e.target.value)}
                    >
                      <option value="" disabled className="bg-zinc-900 text-slate-500">Grade</option>
                      {GRADE_KEYS.map(g => (
                        <option key={g} value={g} className="bg-[#1a1a1a] text-slate-200">{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/20" size={14} strokeWidth={3}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loadErr && (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <AlertCircle className="mx-auto text-slate-600 mb-3" size={40}/>
                <p className="text-slate-400 mb-1">No courses marked as "Learning"</p>
                <p className="text-slate-600 text-xs">ไปที่ Roadmap แล้วเปลี่ยนสถานะวิชาเป็น Learning</p>
              </div>
            )
          )}
        </div>

        {/* ══ RIGHT: Calculator & Stats (โครงสร้างเดิม) ══ */}
        <div className="lg:col-span-5 space-y-8">

          {/* 1. TARGET CALCULATOR */}
          <div className="relative p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-transparent backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"/>

            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={16}/> Set Your Goal
            </h3>

            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1.5 ml-1">Desired GPAX (Overall)</label>
                <input
                  type="number" step="0.01" min="0" max="4"
                  placeholder="e.g. 3.00"
                  value={targetGPAX}
                  onChange={e => handleTargetChange(e.target.value)}
                  className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white font-mono font-bold
                    focus:outline-none focus:bg-black/40 transition-all placeholder:text-slate-700
                    ${targetErr ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'}`}
                />
                {/* inline validation (ใหม่) */}
                {targetErr && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={10}/>{targetErr}
                  </p>
                )}
              </div>

              {targetGPAX && !targetErr && <ArrowRight className="text-slate-600 mt-9 shrink-0"/>}

              {targetGPAX && !targetErr && (
                <div className="flex-1 text-right">
                  <label className="text-xs text-slate-400 block mb-1">Required This Term</label>
                  {targetResult ? (
                    <>
                      {targetResult.alreadyDone ? (
                        <div className="flex items-center justify-end gap-1 text-emerald-400 text-xs mt-2">
                          <CheckCircle size={14}/> Already achieved!
                        </div>
                      ) : (
                        <div className={`text-3xl font-black font-mono tracking-tighter ${
                          !targetResult.isPossible        ? 'text-red-500'
                          : targetResult.neededTermGPA > 3.5 ? 'text-orange-400'
                          : targetResult.neededTermGPA > 2.5 ? 'text-cyan-400'
                          : 'text-emerald-400'
                        }`}>
                          {targetResult.isPossible
                            ? safeFixed(targetResult.neededTermGPA)
                            : '4.00+'}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-600">...</span>
                  )}
                </div>
              )}
            </div>

            {/* Analysis message (โครงสร้างเดิม + ปรับ) */}
            {targetGPAX && !targetErr && targetResult && !targetResult.alreadyDone && (
              <div className={`text-xs p-3 rounded-lg border mb-3 ${
                !targetResult.isPossible
                  ? 'bg-red-500/10 border-red-500/20 text-red-300'
                  : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-200'
              }`}>
                {!targetResult.isPossible ? (
                  <span className="flex items-center gap-2">
                    <AlertCircle size={14}/>
                    <span><b>Mission Impossible:</b> ต้องการเกิน 4.00 ในเทอมนี้ ({targetResult.neededTermGPA.toFixed(2)})</span>
                  </span>
                ) : (
                  <span className="flex items-start gap-2">
                    <Zap size={14} className="shrink-0 mt-0.5 text-cyan-400"/>
                    <span>
                      เพื่อให้ GPAX ถึง <b>{parseFloat(targetGPAX).toFixed(2)}</b> ต้องได้เฉลี่ย <b>{safeFixed(targetResult.neededTermGPA)}</b> จาก {currentTermCredits} หน่วยกิตเทอมนี้
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* min-grade suggestion button (ใหม่) */}
            {targetGPAX && !targetErr && targetResult?.isPossible && minGradeSuggestion && (
              <button onClick={applyMinGrade}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-xs font-bold transition-all">
                <Award size={13}/>
                ใส่เกรดขั้นต่ำแนะนำ ({minGradeSuggestion}) ให้ทุกวิชา
              </button>
            )}

            {targetGPAX && !targetErr && currentTermCredits === 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-400/70 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <AlertTriangle size={12}/> ยังไม่มีรายวิชา — ไม่สามารถคำนวณได้
              </div>
            )}
          </div>

          {/* 2. CURRENT SIMULATION (โครงสร้างเดิม + ปรับเล็กน้อย) */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calculator size={16}/> Current Simulation
              {completionPct > 0 && completionPct < 100 && (
                <span className="ml-auto text-[10px] text-amber-400/60 italic normal-case">partial ({completionPct}%)</span>
              )}
            </h3>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div className="text-slate-400 text-xs mb-1">Term GPA</div>
                <div className={`text-4xl font-black font-mono ${
                  simulatedTermCredits === 0 ? 'text-slate-600' : 'text-white'
                }`}>
                  {simulatedTermCredits > 0 ? safeFixed(termGPA) : '-.--'}
                </div>
                <div className="text-[10px] text-slate-600 mt-1">{simulatedTermCredits}/{currentTermCredits} Cr.</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs mb-1">New GPAX</div>
                <div className={`text-4xl font-black font-mono ${cumulativeGPA > 0 ? 'text-white' : 'text-slate-600'}`}>
                  {safeFixed(simulatedTermCredits > 0 ? cumulativeGPA : null)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Total Credits: {totalCredits}</div>
                {/* trend (ใหม่) */}
                <div className="flex justify-end mt-1">
                  <TrendBadge prev={prevGPAX} cur={simulatedTermCredits > 0 ? cumulativeGPA : null}/>
                </div>
              </div>
            </div>

            {/* Progress bar (โครงสร้างเดิม) */}
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  cumulativeGPA >= 3.0 ? 'bg-emerald-500' :
                  cumulativeGPA >= 2.0 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${simulatedTermCredits > 0 ? (cumulativeGPA / 4) * 100 : 0}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-600 italic">
              {completionPct === 0 ? 'ลองปรับเกรดทางซ้ายเพื่อดูผลลัพธ์'
                : completionPct < 100 ? 'วิชาที่ยังไม่เลือกเกรดจะไม่ถูกนับ'
                : '✓ เลือกเกรดครบทุกวิชาแล้ว'}
            </p>
          </div>

          {/* Tips + prev record */}
          <div className="text-[10px] text-slate-500 p-4 border border-dashed border-white/5 rounded-xl text-center">
            Try adjusting the grades on the left to see if you can hit your target.
          </div>

          {prevCredits > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Previous Records</p>
              <div className="flex justify-between">
                <span className="text-slate-500">GPAX ก่อนเทอมนี้</span>
                <span className="font-bold text-slate-300">{safeFixed(prevGPAX)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">หน่วยกิตสะสม</span>
                <span className="font-bold text-slate-300">{prevCredits} Cr.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;