import { useState, useEffect, useMemo, useCallback, Component } from 'react';
import {
  Calculator, RefreshCw, Target, BookOpen,
  ChevronDown, AlertCircle, TrendingUp, TrendingDown,
  Minus, Award, AlertTriangle, CheckCircle, Info, X,
} from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses } from '../data/courseData';

// ─── constants ────────────────────────────────────────────────────────────────
const GRADE_VALUES = {
  A: 4.0, 'B+': 3.5, B: 3.0, 'C+': 2.5,
  C: 2.0, 'D+': 1.5, D: 1.0, F: 0.0, W: null,
};
const GRADE_KEYS = Object.keys(GRADE_VALUES);

// เกรดที่ "นับ" จริง (ไม่รวม W)
const SCORED_GRADES = GRADE_KEYS.filter(k => GRADE_VALUES[k] !== null);

// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp     = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const safeFixed = (n, d = 2)  =>
  n == null || !isFinite(n) ? '-.--' : clamp(n, 0, 4).toFixed(d);

/**
 * ตรวจ string ว่าเป็น GPA ที่ valid หรือเปล่า
 * ดัก edge cases: '', '.', '4.001', '-0', '00.5', 'NaN', 'Infinity'
 */
const isValidGPA = (s) => {
  if (s == null || String(s).trim() === '') return false;
  const trimmed = String(s).trim();
  // ต้องเป็นตัวเลข decimal ปกติเท่านั้น (ไม่รับ exp notation, ไม่รับ leading zeros)
  if (!/^\d+(\.\d*)?$/.test(trimmed)) return false;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) && n >= 0 && n <= 4;
};

/**
 * ตรวจ error message ของ target GPA input อย่างละเอียด
 * return string ถ้า error, '' ถ้า ok
 */
const validateTargetInput = (raw) => {
  if (!raw || raw.trim() === '') return '';
  const trimmed = raw.trim();

  // รับแค่ pattern: ตัวเลข optionally ตามด้วย .digits
  if (!/^\d*\.?\d*$/.test(trimmed)) return 'ใส่ได้เฉพาะตัวเลข (เช่น 3.25)';
  if (trimmed === '.' || trimmed === '') return 'ใส่ค่าให้ครบ เช่น 3.5';

  const n = parseFloat(trimmed);
  if (Number.isNaN(n) || !Number.isFinite(n)) return 'ค่าไม่ถูกต้อง';
  if (n < 0) return 'GPA ต้องไม่ต่ำกว่า 0.00';
  if (n > 4) return 'GPA สูงสุดคือ 4.00';

  // ดักค่าที่ดูเหมือนผ่านแต่ overflow จริงๆ (เช่น 4.001)
  if (Math.round(n * 1000) > 4000) return 'GPA สูงสุดคือ 4.00';

  return '';
};

/**
 * safe divide — return null แทน Infinity/NaN
 */
const safeDivide = (numerator, denominator) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : null;
};

/**
 * normalize credits จาก course object — return 0 ถ้าพัง
 */
const normalizeCredits = (c) => {
  if (!c) return 0;
  const cr = Number(c.credits);
  return Number.isFinite(cr) && cr > 0 ? cr : 0;
};

const getGradeColor = (grade) => {
  if (!grade) return 'text-slate-500 border-white/10 bg-white/5';
  return ({
    A   : 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
    'B+': 'text-cyan-400   border-cyan-500/50    bg-cyan-500/10    shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    B   : 'text-cyan-400   border-cyan-500/50    bg-cyan-500/10    shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    'C+': 'text-orange-400 border-orange-500/50  bg-orange-500/10  shadow-[0_0_10px_rgba(251,146,60,0.2)]',
    C   : 'text-orange-400 border-orange-500/50  bg-orange-500/10  shadow-[0_0_10px_rgba(251,146,60,0.2)]',
    'D+': 'text-yellow-400 border-yellow-500/50  bg-yellow-500/10',
    D   : 'text-yellow-400 border-yellow-500/50  bg-yellow-500/10',
    F   : 'text-red-400    border-red-500/50     bg-red-500/10',
    W   : 'text-slate-400  border-white/10       bg-white/5',
  }[grade] ?? 'text-slate-400 border-white/10 bg-white/5');
};



// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_CLS = {
  error:   'bg-red-950/90   border-red-500/40   text-red-200',
  warn:    'bg-amber-950/90 border-amber-500/40 text-amber-200',
  info:    'bg-cyan-950/90  border-cyan-500/40  text-cyan-200',
  success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
};
const TOAST_ICON = {
  error:   <AlertCircle size={14}/>,
  warn:    <AlertTriangle size={14}/>,
  info:    <Info size={14}/>,
  success: <CheckCircle size={14}/>,
};
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
  if (Math.abs(d) < 0.005)
    return <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]"><Minus size={10}/>No change</span>;
  return d > 0
    ? <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px]"><TrendingUp size={10}/>+{d.toFixed(2)}</span>
    : <span className="inline-flex items-center gap-1 text-red-400 text-[10px]"><TrendingDown size={10}/>{d.toFixed(2)}</span>;
};

// ─── Error Boundary ───────────────────────────────────────────────────────────
// กัน crash ทั้ง component ถ้า render error เกิดขึ้น

class GradeCalcErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[GradeCalc] Uncaught render error:', error, info.componentStack);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center p-8 rounded-2xl border border-red-500/30 bg-red-950/20">
          <AlertCircle className="mx-auto text-red-400 mb-4" size={40}/>
          <h2 className="text-xl font-bold text-red-300 mb-2">เกิดข้อผิดพลาดร้ายแรง</h2>
          <p className="text-slate-400 text-sm mb-4">GradeCalculator พัง กรุณา reload หน้า</p>
          <p className="text-red-400/60 text-xs font-mono break-all">{String(this.state.error)}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/30 transition-all">
            Reload
          </button>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
const GradeCalculator = () => {
  const [learningCourses, setLearningCourses] = useState([]);
  const [predictedGrades, setPredictedGrades] = useState({});

  // เป้าหมาย GPA เทอมนี้ (0–4) — ไม่บังคับกรอก
  const [targetTermGPA, setTargetTermGPA] = useState('');
  const [targetErr,     setTargetErr]     = useState('');

  const [prevCredits, setPrevCredits] = useState(0);
  const [prevPoints,  setPrevPoints]  = useState(0);
  const [prevGPAX,    setPrevGPAX]    = useState(0);

  const [loadErr, setLoadErr] = useState(null);
  const [toasts,  setToasts]  = useState([]);

  // ── toasts (with dedup — ไม่ spam ข้อความซ้ำ) ─────────────────────────────
  const pushToast = useCallback((msg, type = 'info', ms = 3500) => {
    setToasts(prev => {
      // ถ้ามี toast ข้อความเดียวกัน type เดียวกันอยู่แล้ว → ไม่เพิ่ม
      if (prev.some(t => t.msg === msg && t.type === type)) return prev;
      const id = Date.now() + Math.random();
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms);
      return [...prev.slice(-4), { id, msg, type }];
    });
  }, []);
  const dismissToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  // ── load profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('userProfile'); }
    catch (e) { setLoadErr(`อ่าน localStorage ไม่ได้: ${e.message}`); return; }
    if (!saved) { setLoadErr('ไม่พบข้อมูลโปรไฟล์ใน localStorage'); return; }

    let parsed = null;
    try { parsed = JSON.parse(saved); }
    catch { setLoadErr('ข้อมูลโปรไฟล์เสียหาย (JSON ไม่ถูกต้อง)'); return; }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setLoadErr('รูปแบบ userProfile ไม่ถูกต้อง (ต้องเป็น object)'); return;
    }

    // 1. learning courses — ใช้ logic เดียวกับ Dashboard
    //    ต้องเช็ค peAssignments เพื่อแปลง PE slot → course จริง
    const courseStatesRaw = (parsed.courseStates && typeof parsed.courseStates === 'object')
      ? parsed.courseStates : {};
    const peAssignments = (parsed.peAssignments && typeof parsed.peAssignments === 'object')
      ? parsed.peAssignments : {};
    const customElectivesRaw = (parsed.customElectives && typeof parsed.customElectives === 'object')
      ? parsed.customElectives : {};

    // สร้าง set ของ PE slot ids ทั้งหมดใน roadmap
    const peSlotIds = new Set(
      roadmapData.flatMap(y => y.semesters?.flatMap(s =>
        s.courses?.filter(c => c.isProfessionalElective).map(c => c.id) ?? []
      ) ?? [])
    );

    // สร้าง map: peSlotId → course object จริงจาก allTrackCourses
    const peSlotCourseMap = {};
    Object.entries(peAssignments).forEach(([slotId, courseCode]) => {
      const trackCourse = allTrackCourses?.[courseCode];
      if (trackCourse) {
        const cr = parseInt(trackCourse.credits, 10) || 3;
        peSlotCourseMap[slotId] = {
          ...trackCourse,
          id: courseCode,
          code: courseCode,
          name: trackCourse.nameEn || trackCourse.name,
          credits: cr,
        };
      }
    });

    const seen = new Set();
    const details = [];
    const badCredits = [];

    const tryPushCourse = (c) => {
      if (!c || typeof c.id !== 'string') return;
      if (seen.has(c.id)) return;
      // ถ้าเป็น PE slot ที่ไม่ได้ assign → ข้าม
      if (peSlotIds.has(c.id) && !peSlotCourseMap[c.id]) return;
      // ถ้าเป็น PE slot ที่ assign แล้ว → ใช้ course จริงแทน
      const actualCourse = peSlotIds.has(c.id) ? peSlotCourseMap[c.id] : c;
      if (!actualCourse) return;
      // เช็คสถานะ: ต้องเป็น 'learning'
      if (courseStatesRaw[actualCourse.id] !== 'learning') return;
      seen.add(actualCourse.id);
      const credits = normalizeCredits(actualCourse);
      if (credits === 0) {
        badCredits.push(actualCourse.id);
        console.warn(`[GradeCalc] credits ผิดปกติ — วิชา: ${actualCourse.id}`);
      }
      details.push({ ...actualCourse, credits });
    };

    try {
      roadmapData.forEach(y => y.semesters?.forEach(s => s.courses?.forEach(tryPushCourse)));
    } catch (e) { console.error('[GradeCalc] roadmapData error:', e); }

    // เพิ่ม free electives ที่ learning
    try {
      Object.values(customElectivesRaw).forEach(arr => {
        if (!Array.isArray(arr)) return;
        arr.forEach(elecId => {
          if (typeof elecId !== 'string') return;
          if (seen.has(elecId)) return;
          if (courseStatesRaw[elecId] !== 'learning') return;
          const elec = electiveCourses.find(e => e.id === elecId);
          if (!elec) return;
          seen.add(elecId);
          const credits = normalizeCredits(elec);
          details.push({ ...elec, credits });
        });
      });
    } catch (e) { console.error('[GradeCalc] electiveCourses error:', e); }

    if (badCredits.length > 0) {
      pushToast(`${badCredits.length} วิชามี credits ผิดปกติ — จะนับเป็น 0`, 'warn', 5000);
    }
    setLearningCourses(details);
    setLoadErr(null);

    // 2. previous GPA — validate courseStates และ gpaHistory ก่อนใช้
    const courseStates = courseStatesRaw;

    const parsedTerms = [];
    if (parsed.gpaHistory && typeof parsed.gpaHistory === 'object' && !Array.isArray(parsed.gpaHistory)) {
      Object.entries(parsed.gpaHistory).forEach(([termKey, gpa]) => {
        try {
          const m = String(termKey).match(/Y?(\d+)[\/\-](\d+)/);
          if (!m) return;
          const y = parseInt(m[1], 10), t = parseInt(m[2], 10);
          if (!Number.isFinite(y) || !Number.isFinite(t)) return;
          const gpaVal = parseFloat(gpa);
          if (!Number.isFinite(gpaVal) || gpaVal < 0 || gpaVal > 4) {
            console.warn(`[GradeCalc] GPA ผิดปกติ term ${termKey}: ${gpa}`);
            return;
          }
          parsedTerms.push({ termKey, y, t, gpaVal, sortKey: y * 10 + t });
        } catch (e) { console.error('[GradeCalc] parse term error:', e); }
      });
    } else if (parsed.gpaHistory != null) {
      console.warn('[GradeCalc] gpaHistory ไม่ใช่ object — ข้ามการคำนวณ prev GPA');
    }

    parsedTerms.sort((a, b) => a.sortKey - b.sortKey);
    const prevTerms = parsedTerms.slice(0, -1); // ตัดเทอมล่าสุดออก

    let pts = 0, crs = 0;
    prevTerms.forEach(({ termKey, y, t, gpaVal }) => {
      try {
        let termCr = 0;
        roadmapData.find(r => r.year === y)?.semesters?.find(s => s.term === t)
          ?.courses?.forEach(c => {
            if (courseStates[c.id] === 'passed') {
              const cr = normalizeCredits(c);
              termCr += cr;
            }
          });
        const eKey = `${y}-${t}`;
        if (Array.isArray(parsed.customElectives?.[eKey])) {
          parsed.customElectives[eKey].forEach(eid => {
            if (typeof eid !== 'string') return;
            const e = electiveCourses.find(x => x.id === eid);
            if (e && courseStates[eid] === 'passed') termCr += normalizeCredits(e);
          });
        }
        if (termCr > 0 && Number.isFinite(gpaVal)) {
          pts += gpaVal * termCr;
          crs += termCr;
        }
      } catch (e) { console.error(`[GradeCalc] term ${termKey}:`, e); }
    });

    // ป้องกัน NaN สุดท้าย
    const safeCrs = Number.isFinite(crs) && crs >= 0 ? crs : 0;
    const safePts = Number.isFinite(pts) && pts >= 0 ? pts : 0;
    setPrevCredits(safeCrs);
    setPrevPoints(safePts);
    setPrevGPAX(safeCrs > 0 ? safePts / safeCrs : 0);
  }, []);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleGradeChange = useCallback((id, val) => {
    if (!val) { setPredictedGrades(p => ({ ...p, [id]: '' })); return; }
    const trimmed = String(val).trim();
    if (!GRADE_KEYS.includes(trimmed)) {
      pushToast(`เกรด "${trimmed}" ไม่ถูกต้อง — ต้องเป็น ${GRADE_KEYS.join(', ')}`, 'error');
      return;
    }
    setPredictedGrades(p => ({ ...p, [id]: trimmed }));
  }, [pushToast]);

  const handleTargetChange = (raw) => {
    // รับแค่ pattern ตัวเลข+จุด — block ตัวอักษรและอักขระพิเศษทันที
    if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return;

    // ป้องกัน leading zeros ผิดปกติ เช่น "00.5" → แก้เป็น "0.5"
    const normalized = raw.replace(/^0+(\d)/, '0$1').replace(/^0+\./, '0.');
    setTargetTermGPA(normalized);

    const err = validateTargetInput(normalized);
    setTargetErr(err);
  };

  // ── core calculation ───────────────────────────────────────────────────────
  const {
    termGPA, cumulativeGPA,
    currentTermCredits, totalCredits, simulatedTermCredits,
  } = useMemo(() => {
    const fallback = { termGPA: null, cumulativeGPA: null, currentTermCredits: 0, totalCredits: 0, simulatedTermCredits: 0 };
    try {
      let allCr = 0, simCr = 0, simPts = 0;
      for (const c of learningCourses) {
        const credits = normalizeCredits(c);
        if (credits <= 0) continue; // ข้ามวิชาที่ credits พัง
        allCr += credits;
        const gv = GRADE_VALUES[predictedGrades[c.id]];
        if (gv != null && Number.isFinite(gv)) {
          simCr  += credits;
          simPts += gv * credits;
        }
      }
      if (!Number.isFinite(allCr) || !Number.isFinite(simCr) || !Number.isFinite(simPts)) {
        console.error('[GradeCalc] NaN/Infinity ในการคำนวณ credits/points');
        return fallback;
      }
      const termGPA    = safeDivide(simPts, simCr);
      const totCr      = (Number.isFinite(prevCredits) ? prevCredits : 0) + simCr;
      const totPts     = (Number.isFinite(prevPoints)  ? prevPoints  : 0) + simPts;
      const cumGPA     = safeDivide(totPts, totCr);
      return {
        termGPA,
        cumulativeGPA: cumGPA,
        currentTermCredits: allCr,
        totalCredits: totCr,
        simulatedTermCredits: simCr,
      };
    } catch (e) {
      console.error('[GradeCalc] calc error:', e);
      return fallback;
    }
  }, [learningCourses, predictedGrades, prevPoints, prevCredits]);

  const completionPct = currentTermCredits > 0
    ? Math.round((simulatedTermCredits / currentTermCredits) * 100) : 0;

  // ── target analysis (pure calculation, ไม่ยุ่งกับ predictedGrades) ─────────
  const targetAnalysis = useMemo(() => {
    if (!targetTermGPA || targetErr || !isValidGPA(targetTermGPA)) return null;
    if (currentTermCredits === 0 || learningCourses.length === 0) return null;

    const tv = parseFloat(targetTermGPA);
    if (!Number.isFinite(tv)) return null; // double-check หลัง isValidGPA

    const totalNeededPts = tv * currentTermCredits;
    const totalMaxPts    = learningCourses.reduce((s, c) => s + 4.0 * normalizeCredits(c), 0);

    if (!Number.isFinite(totalNeededPts) || !Number.isFinite(totalMaxPts)) return null;

    if (totalMaxPts < totalNeededPts - 0.001) {
      return { tv, isGlobalImpossible: true, courseSuggestions: [], anyBelowMin: false, isAchieved: false, allFilled: false };
    }

    // ── คำนวณ per-วิชา: greedy จาก F ขึ้นมา (round-robin) ──────────────────────
    // เริ่มทุกวิชาที่ F แล้ว upgrade ทีละ 1 step วน round-robin (credits มากก่อน)
    // จนกว่า totalPts >= totalNeededPts
    // ตัวอย่าง: target 2.75, 6x3cr -> B,B,B,C+,C+,C+ (GPA=2.75)
    const FIdx = SCORED_GRADES.length - 1; // index ของ F
    let assignments = learningCourses.map(c => ({
      ...c, credits: normalizeCredits(c), gradeIdx: FIdx,
    }));
    let currentPts = 0; // F = 0 pts ทุกวิชา

    const sortedIdx = assignments
      .map((_, i) => i)
      .sort((i, j) => assignments[j].credits - assignments[i].credits);

    let safety = 0;
    while (currentPts < totalNeededPts - 0.001 && safety++ < 1000) {
      let anyUpgraded = false;
      for (const idx of sortedIdx) {
        if (currentPts >= totalNeededPts - 0.001) break;
        if (assignments[idx].gradeIdx === 0) continue;
        const nextIdx = assignments[idx].gradeIdx - 1;
        const curGV   = GRADE_VALUES[SCORED_GRADES[assignments[idx].gradeIdx]];
        const nextGV  = GRADE_VALUES[SCORED_GRADES[nextIdx]];
        if (!Number.isFinite(curGV) || !Number.isFinite(nextGV)) continue;
        const gain = (nextGV - curGV) * assignments[idx].credits;
        assignments[idx].gradeIdx = nextIdx;
        currentPts += gain;
        anyUpgraded = true;
        // ไม่ break เพื่อให้ round-robin กระจายสม่ำเสมอ
      }
      if (!anyUpgraded) break;
    }

    const courseSuggestions = assignments.map(a => {
      const suggestedGrade = SCORED_GRADES[a.gradeIdx];
      if (!suggestedGrade) return null; // guard
      const assignedGV   = GRADE_VALUES[suggestedGrade] ?? 0;
      const currentGrade = predictedGrades[a.id];
      const currentGV    = (GRADE_VALUES[currentGrade] !== undefined ? GRADE_VALUES[currentGrade] : null);
      const isBelowMin   = currentGV !== null && Number.isFinite(currentGV) && currentGV < assignedGV - 0.001;
      return {
        courseId: a.id,
        minGrade: suggestedGrade,
        assignedGV,
        currentGrade,
        isBelowMin,
        hasGrade: currentGV !== null,
      };
    }).filter(Boolean); // กรอง null ออก

    // check สถานะปัจจุบัน
    let fixedPts = 0, fixedCr = 0;
    for (const c of learningCourses) {
      const gv = GRADE_VALUES[predictedGrades[c.id]];
      if (gv != null && Number.isFinite(gv)) {
        const cr = normalizeCredits(c);
        fixedPts += gv * cr;
        fixedCr  += cr;
      }
    }
    const allFilled  = fixedCr === currentTermCredits;
    const isAchieved = allFilled && Number.isFinite(fixedPts) && fixedPts >= totalNeededPts - 0.001;

    return {
      tv,
      courseSuggestions,
      isGlobalImpossible: false,
      isImpossible: false,
      anyBelowMin: courseSuggestions.some(s => s.isBelowMin),
      isAchieved, allFilled, fixedCr,
    };
  }, [targetTermGPA, targetErr, learningCourses, currentTermCredits, predictedGrades]);

  // ── fill helpers ───────────────────────────────────────────────────────────
  const fillAll = useCallback((grade) => {
    const next = {};
    learningCourses.forEach(c => { next[c.id] = grade; });
    setPredictedGrades(next);
    pushToast(`ตั้งเกรด ${grade} ให้ทุกวิชาแล้ว`, 'info');
  }, [learningCourses, pushToast]);

  // ── ปุ่มคำนวณ: apply เกรดแนะนำ per-วิชา ให้ทุกวิชา (ไม่สนว่ากรอกไว้หรือเปล่า) ──
  const handleCalculate = useCallback(() => {
    if (!targetTermGPA || targetErr || !isValidGPA(targetTermGPA)) {
      pushToast('กรุณาใส่ GPA เป้าหมายให้ถูกต้องก่อน', 'warn'); return;
    }
    if (currentTermCredits === 0) { pushToast('ไม่มีรายวิชา', 'warn'); return; }
    if (!targetAnalysis || targetAnalysis.isGlobalImpossible) {
      pushToast('เป้าหมายนี้ทำไม่ได้', 'error'); return;
    }
    const next = {};
    targetAnalysis.courseSuggestions.forEach(s => { next[s.courseId] = s.minGrade; });
    setPredictedGrades(next);
    pushToast('คำนวณแล้ว — เกรดต่ำสุดที่แนะนำใส่ให้ทุกวิชาแล้ว', 'success');
  }, [targetTermGPA, targetErr, targetAnalysis, currentTermCredits, pushToast]);

  // (ไม่ใช้แล้ว แต่คง stub ไว้กันพัง)
  const applyTargetSuggestion = handleCalculate;

  const resetAll = () => {
    setPredictedGrades({});
    // ไม่ clear targetTermGPA — user ไม่ต้องพิมพ์ใหม่
    setTargetErr('');
    pushToast('รีเซ็ตเกรดแล้ว — เป้าหมายยังคงอยู่', 'info');
  };

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent text-white font-sans pb-20 pt-10 px-6">
      <Toast toasts={toasts} dismiss={dismissToast} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
            Grade Calculator
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Simulation &amp; Target Prediction</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {learningCourses.length > 0 && (
            <>
              {[
                ['A', 'border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400'],
                ['B', 'border-cyan-500/30   hover:bg-cyan-500/10   text-cyan-400'],
                ['C', 'border-orange-500/30 hover:bg-orange-500/10 text-orange-400'],
              ].map(([g, cls]) => (
                <button key={g} onClick={() => fillAll(g)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${cls}`}>
                  Fill {g}
                </button>
              ))}
              <button onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                <RefreshCw size={14}/> Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Load error banner */}
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

        {/* ══ LEFT: Course list ══ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <BookOpen className="text-cyan-400" size={20}/>
            <h2 className="text-xl font-bold text-white">Current Term Courses</h2>
            <span className="bg-white/10 text-xs px-2 py-0.5 rounded text-slate-300 font-mono">
              {currentTermCredits} Credits
            </span>
            {completionPct > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                completionPct === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>{completionPct}% filled</span>
            )}
          </div>

          {learningCourses.length > 0 ? (
            <div className="space-y-2">
              {learningCourses.map(course => {
                // หา suggestion สำหรับวิชานี้ (ถ้ามี target)
                const sugg = targetAnalysis?.courseSuggestions?.find(s => s.courseId === course.id);

                return (
                  <div key={course.id}
                    className="group relative flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">

                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-black/20 border border-white/5 font-mono text-xs shrink-0">
                        <span className="font-bold text-slate-300 text-sm">{course.credits}</span>
                        <span className="text-[9px] text-slate-500">Cr.</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-mono text-cyan-500/80 font-bold">{course.code}</span>
                        <h3 className="font-bold text-slate-200 text-sm md:text-base leading-tight truncate pr-2">{course.name}</h3>
                        {/* per-course min grade badge */}
                        {sugg && !targetAnalysis?.isGlobalImpossible && (
                          sugg.isBelowMin ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-400/80 mt-0.5">
                              <AlertTriangle size={9}/> ต้องได้อย่างน้อย <strong>{sugg.minGrade}</strong> — ปรับขึ้น
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                              <Target size={9}/> ขั้นต่ำ <strong className="text-slate-400">{sugg.minGrade}</strong>
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="relative w-24 md:w-32 shrink-0">
                      <select
                        className={`w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-bold border outline-none cursor-pointer transition-all text-center
                          ${getGradeColor(predictedGrades[course.id])}`}
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
                );
              })}
            </div>
          ) : !loadErr && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <AlertCircle className="mx-auto text-slate-600 mb-3" size={40}/>
              <p className="text-slate-400 mb-1">No courses marked as "Learning"</p>
              <p className="text-slate-600 text-xs">ไปที่ Roadmap แล้วเปลี่ยนสถานะวิชาเป็น Learning</p>
            </div>
          )}
        </div>

        {/* ══ RIGHT ══ */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── TARGET SECTION ── */}
          <div className="relative p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-transparent backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"/>

            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              <Target size={14}/> เป้าหมายเทอมนี้
            </h3>
            <p className="text-slate-500 text-xs mb-4">ใส่ GPA ที่อยากได้เทอมนี้ เราจะบอกว่าแต่ละวิชาต้องได้เกรดอะไร</p>

            {/* Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="GPA เป้าหมายเทอมนี้  (0 – 4)"
                  value={targetTermGPA}
                  onChange={e => handleTargetChange(e.target.value)}
                  className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white font-mono text-xl font-bold
                    focus:outline-none focus:bg-black/50 transition-all placeholder:text-slate-700 pr-10
                    ${targetErr
                      ? 'border-red-500/60 focus:border-red-500'
                      : targetTermGPA && !targetErr
                        ? 'border-cyan-500/40 focus:border-cyan-400/60'
                        : 'border-white/10 focus:border-cyan-500/40'}`}
                />
                {targetTermGPA && (
                  <button
                    onClick={() => { setTargetTermGPA(''); setTargetErr(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                    <X size={16}/>
                  </button>
                )}
              </div>
              {/* error message */}
              {targetErr && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                  <AlertCircle size={11}/><span>{targetErr}</span>
                </div>
              )}
            </div>

            {/* ── Result area ── */}
            {targetTermGPA && !targetErr && (
              <>
                {currentTermCredits === 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300 text-xs">
                    <AlertTriangle size={13}/> ยังไม่มีรายวิชาที่กำลังเรียน
                  </div>
                )}

                {currentTermCredits > 0 && targetAnalysis?.isGlobalImpossible && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    <AlertCircle size={13} className="shrink-0 mt-0.5"/>
                    <span>ไม่สามารถทำได้ — แม้ได้ A ทุกวิชาก็ยังไม่ถึง {parseFloat(targetTermGPA).toFixed(2)}</span>
                  </div>
                )}

                {currentTermCredits > 0 && targetAnalysis && !targetAnalysis.isGlobalImpossible && (
                  <div className="space-y-3">

                    {/* ── ปุ่มคำนวณหลัก ── */}
                    <button
                      onClick={handleCalculate}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-bold transition-all active:scale-[0.98]">
                      <Calculator size={15}/>
                      คำนวณเกรดขั้นต่ำทุกวิชา
                    </button>

                    {/* สรุปสถานะ */}
                    {targetAnalysis.isAchieved && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-bold">
                        <CheckCircle size={15}/> GPA ปัจจุบันถึงเป้าแล้ว 🎉
                      </div>
                    )}
                    {targetAnalysis.anyBelowMin && !targetAnalysis.isAchieved && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                        <AlertTriangle size={13}/> บางวิชาต่ำกว่าเกรดขั้นต่ำที่แนะนำ — กดคำนวณเพื่ออัปเดต
                      </div>
                    )}

                    {/* ตารางเกรดต่อวิชา */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest px-1">เกรดต่ำสุดที่แนะนำต่อวิชา</p>
                      {targetAnalysis.courseSuggestions.map(s => {
                        const course = learningCourses.find(c => c.id === s.courseId);
                        if (!course) return null;
                        return (
                          <div key={s.courseId}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                              s.isBelowMin
                                ? 'border-red-500/20 bg-red-500/5'
                                : 'border-white/5 bg-white/[0.02]'
                            }`}>
                            <span className="text-slate-400 truncate flex-1 mr-2">{course.name}</span>
                            <span className={`font-black font-mono shrink-0 ${
                              s.assignedGV >= 3.5 ? 'text-orange-400'
                              : s.assignedGV >= 3.0 ? 'text-cyan-400'
                              : s.assignedGV >= 2.0 ? 'text-emerald-400'
                              : 'text-yellow-400'
                            }`}>
                              {s.minGrade}
                              {s.isBelowMin && <span className="text-red-400 ml-1 font-normal">(ต่ำไป)</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}
              </>
            )}
          </div>

          {/* ── SIMULATION ── */}
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
                <div className={`text-4xl font-black font-mono ${simulatedTermCredits === 0 ? 'text-slate-600' : 'text-white'}`}>
                  {simulatedTermCredits > 0 ? safeFixed(termGPA) : '-.--'}
                </div>
                <div className="text-[10px] text-slate-600 mt-1">{simulatedTermCredits}/{currentTermCredits} Cr.</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs mb-1">New GPAX</div>
                <div className={`text-4xl font-black font-mono ${cumulativeGPA != null ? 'text-white' : 'text-slate-600'}`}>
                  {simulatedTermCredits > 0 ? safeFixed(cumulativeGPA) : '-.--'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Total: {totalCredits} Cr.</div>
                <div className="flex justify-end mt-1">
                  <TrendBadge prev={prevGPAX} cur={simulatedTermCredits > 0 ? cumulativeGPA : null}/>
                </div>
              </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (cumulativeGPA ?? 0) >= 3.0 ? 'bg-emerald-500' :
                  (cumulativeGPA ?? 0) >= 2.0 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${simulatedTermCredits > 0 ? ((cumulativeGPA ?? 0) / 4) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Previous record */}
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
export { GradeCalcErrorBoundary };