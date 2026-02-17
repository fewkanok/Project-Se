import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, GraduationCap, Info, BookOpen, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';

// ─── TABLE DATA — mirrors the infographic exactly ───────────────────────────
// Each "case row" = one example student trajectory
// status: 'warning' | 'probation-low' | 'probation-high' | 'retired' | 'safe' | 'regrade' | 'graduated' | 'empty' | 'note'
const TABLE_ROWS = [
  {
    id: 'A', icon: null, label: 'A',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : เกรดเฉลี่ยสะสม ต่ำกว่า 1.25 ในภาคการเรียนที่ 1',
    cells: [
      { sem: 1, gpa: '1.24', status: 'probation-low' },
      { sem: 2, status: 'retired' },
    ]
  },
  {
    id: 'B', icon: null, label: 'B',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : เกรดเฉลี่ยสะสม ต่ำกว่า 1.50 ในภาคการเรียนที่ 2',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.49', status: 'probation-low' },
      { sem: 3, status: 'retired' },
    ]
  },
  {
    id: 'C', icon: null, label: 'C',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : โปร เกรดเฉลี่ยสะสม ต่ำกว่า 1.75 ติดกัน 2 ภาค นับแต่ภาคที่ 3 เป็นต้นไป',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '1.74', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 4, gpa: '1.74', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 5, status: 'retired' },
    ]
  },
  {
    id: 'D', icon: null, label: 'D',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : โปร เกรดเฉลี่ยสะสม ต่ำกว่า 2.00 ติดกัน 4 ภาค นับแต่ภาคที่ 3 เป็นต้นไป',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '1.99', status: 'probation-high', note: 'โปร\nสูง' },
      { sem: 4, gpa: '1.99', status: 'probation-high', note: 'โปร\nสูง' },
      { sem: 5, gpa: '1.99', status: 'probation-high', note: 'โปร\nสูง' },
      { sem: 6, gpa: '1.99', status: 'probation-high', note: 'โปร\nสูง' },
      { sem: 7, status: 'retired' },
    ]
  },
  {
    id: 'E', icon: null, label: 'E',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : โปร เกรดเฉลี่ยสะสม ต่ำกว่า 1.75 ติดกัน 2 ภาค นับแต่ภาคที่ 3 เป็นต้นไป',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '1.74', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 4, gpa: '2.00', status: 'safe' },
      { sem: 5, gpa: '1.99', status: 'probation-high', note: 'โปร\nสูง' },
      { sem: 6, gpa: '1.74', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 7, gpa: '1.74', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 8, status: 'retired' },
    ]
  },
  {
    id: 'F', icon: null, label: 'F',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : เรียนครบหน่วยกิต แต่เกรดเฉลี่ยสะสม ต่ำกว่า 1.80',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '2.00', status: 'safe' },
      { sem: 4, gpa: '2.00', status: 'safe' },
      { sem: 5, gpa: '2.00', status: 'safe' },
      { sem: 6, gpa: '1.79', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 7, gpa: '1.79', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 8, gpa: '1.79', status: 'probation-low', note: 'โปร\nต่ำ' },
      { sem: 9, status: 'retired' },
    ]
  },
  {
    id: 'G', icon: null, label: 'G',
    outcome: 'regrade',
    outcomeText: 'กรณี เรียนครบหน่วยกิตตามหลักสูตร และได้เกรดเฉลี่ยสะสมไม่ต่ำกว่า 1.80 จะให้นิสิตให้ลงเรียนวิชาที่อยู่ในหลักสูตรต่อต่อเพื่อดึงเกรดเฉลี่ยสะสมให้ถึง 2.00 ถึงจะสามารถสำเร็จการศึกษาได้',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '1.74', status: 'probation-low', note: 'สภาพ\nนิสิต' },
      { sem: 4, gpa: '1.75', status: 'probation-low', note: 'สภาพ\nนิสิต' },
      { sem: 5, gpa: '1.99', status: 'probation-high', note: 'เรียนครบมท.' },
      { sem: 6, gpa: '2.00', status: 'safe', note: 'อนุมัติ\nจบ/เรียนต่อ' },
      { sem: 7, gpa: '2.00', status: 'safe' },
      { sem: 8, gpa: '1.80', status: 'regrade', note: 'ลง\nรีเกรด' },
      { sem: 9, gpa: '1.95', status: 'regrade', note: 'ลง\nรีเกรด' },
      { sem: 10, gpa: '2.00', status: 'graduated' },
    ]
  },
  {
    id: 'H', icon: null, label: 'H',
    outcome: 'graduated',
    outcomeText: 'สำเร็จการศึกษา',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.50', status: 'warning' },
      { sem: 3, gpa: '1.74', status: 'probation-low', note: 'สภาพ\nนิสิต' },
      { sem: 4, gpa: '2.00', status: 'safe' },
      { sem: 5, gpa: '1.74', status: 'probation-low', note: 'สภาพ\nนิสิต' },
      { sem: 6, gpa: '1.99', status: 'probation-high' },
      { sem: 7, gpa: '1.99', status: 'probation-high' },
      { sem: 8, gpa: '2.00', status: 'graduated' },
    ]
  }
];

// Map semester index (1-based) → { year, term }
const semToYearTerm = (sem) => ({ year: Math.ceil(sem / 2), term: sem % 2 === 1 ? 1 : 2 });

// ─── Cell style config ───────────────────────────────────────────────────────
const CELL_STYLES = {
  'retired':        { bg: '#e53e3e', text: '#fff',    border: '#c53030', label: 'พ้นสภาพ' },
  'probation-low':  { bg: '#dd6b20', text: '#fff',    border: '#c05621', label: 'โปรต่ำ'  },
  'probation-high': { bg: '#d69e2e', text: '#fff',    border: '#b7791f', label: 'โปรสูง'  },
  'warning':        { bg: '#c05621', text: '#fff',    border: '#9c4221', label: 'เสี่ยง'  },
  'safe':           { bg: '#276749', text: '#fff',    border: '#22543d', label: 'ปกติ'    },
  'regrade':        { bg: '#2b6cb0', text: '#fff',    border: '#2c5282', label: 'รีเกรด'  },
  'graduated':      { bg: '#553c9a', text: '#fff',    border: '#44337a', label: 'สำเร็จ'  },
  'empty':          { bg: 'transparent', text: '#4a5568', border: '#2d3748', label: '-'   },
};

// ─── Outcome badge config ─────────────────────────────────────────────────────
const OUTCOME_STYLES = {
  'retired':   { bg: '#e53e3e22', border: '#e53e3e', text: '#fc8181', icon: XCircle },
  'graduated': { bg: '#55309422', border: '#553c9a', text: '#b794f4', icon: GraduationCap },
  'regrade':   { bg: '#2b6cb022', border: '#2b6cb0', text: '#90cdf4', icon: CheckCircle2 },
};

// ─── Main Component ─────────────────────────────────────────────────────────
const AcademicCriteriaPage = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [showCoreCourses, setShowCoreCourses] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userSemData, setUserSemData] = useState({}); // { 1: gpax, 2: gpax, ... } keyed by sem index

  // ── Load SetupProfile data from localStorage ─────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setUserProfile(parsed);

      // Build sem-keyed GPAX map
      const gpaH = parsed.gpaHistory || {};
      const semMap = {};
      // gpaHistory keys look like "Y1/1", "Y1/2", "Y2/1", etc.
      Object.entries(gpaH).forEach(([key, val]) => {
        const match = key.match(/Y(\d+)\/(\d+)/);
        if (match) {
          const y = parseInt(match[1]);
          const t = parseInt(match[2]);
          const semIdx = (y - 1) * 2 + t; // 1-based
          semMap[semIdx] = parseFloat(val) || null;
        }
      });
      setUserSemData(semMap);
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  }, []);

  const currentYear = parseInt(userProfile?.basicInfo?.currentYear || userProfile?.currentYear) || null;
  const currentTerm = parseInt(userProfile?.basicInfo?.currentTerm || userProfile?.currentTerm) || null;
  const currentSem  = currentYear && currentTerm ? (currentYear - 1) * 2 + currentTerm : null;
  const userName    = userProfile?.basicInfo?.name || userProfile?.name || null;

  // ── Weighted GPAX — copy logic จาก Dashboard ทุกบรรทัด ────────────────────
  // รวม customElectives เหมือน Dashboard เพื่อให้ตัวเลขตรงกัน
  const gpaxStats = useMemo(() => {
    if (!userProfile || !roadmapData) return { gpax: null, totalGradedCredits: 0, semCount: 0 };

    const currentYearNum = parseInt(userProfile.basicInfo?.currentYear || userProfile.currentYear) || 1;
    const currentTermNum = parseInt(userProfile.basicInfo?.currentTerm || userProfile.currentTerm) || 1;
    const customElectives = userProfile.customElectives || {};

    // โหลด coopGrades เหมือน Dashboard
    let coopGrades = {};
    try {
      const saved = localStorage.getItem('coopGradeStates');
      if (saved) coopGrades = JSON.parse(saved);
    } catch (e) {}

    let totalPoints = 0;
    let totalGradedCredits = 0;
    let semCount = 0;

    roadmapData.forEach((yearGroup, yIdx) => {
      const yearNum = yIdx + 1;
      yearGroup.semesters.forEach((sem, sIdx) => {
        const termNum = sIdx + 1;
        const termKey = `${yearNum}-${termNum}`;
        const gpaKey  = `Y${yearNum}/${termNum}`;

        const isPastTerm = (yearNum < currentYearNum) ||
                           (yearNum === currentYearNum && termNum < currentTermNum);
        if (!isPastTerm) return;

        const historyGradeStr = userProfile.gpaHistory?.[gpaKey];
        if (!historyGradeStr || isNaN(parseFloat(historyGradeStr))) return;

        const termGPA = parseFloat(historyGradeStr);

        // รวม customElectives เหมือน Dashboard บรรทัดต่อบรรทัด
        let displayCourses = [...sem.courses];
        if (customElectives[termKey]) {
          customElectives[termKey].forEach(elecId => {
            const elecInfo = electiveCourses.find(c => c.id === elecId);
            if (elecInfo) displayCourses.push({ ...elecInfo, isElective: true });
          });
        }

        // credits ที่ passed จริง (รวม elective ที่ user mark passed) — เหมือน Dashboard
        const termPassedCredits = displayCourses.reduce((sum, c) => {
          const status = userProfile.courseStates?.[c.id];
          return status === 'passed' ? sum + c.credits : sum;
        }, 0);

        // fallback = sum credits ของ sem courses เท่านั้น (ไม่รวม elective) — เหมือน Dashboard
        const semDefaultCredits = sem.courses.reduce((a, b) => a + b.credits, 0);
        const weight = termPassedCredits > 0 ? termPassedCredits : semDefaultCredits;

        totalPoints        += termGPA * weight;
        totalGradedCredits += weight;
        semCount++;
      });
    });

    const rawGPA = totalGradedCredits > 0 ? totalPoints / totalGradedCredits : 0;
    const gpax   = totalGradedCredits > 0 ? Math.floor(rawGPA * 100) / 100 : null;

    return { gpax, totalGradedCredits, semCount };
  }, [userProfile]);

  const { gpax: calculatedGPAX, totalGradedCredits, semCount: gradedSemCount } = gpaxStats;

  // ── Determine which case row the user best matches ────────────────────────
  const getUserMatchedCase = () => {
    if (!currentSem || Object.keys(userSemData).length === 0) return null;

    const pastSems = currentSem - 1; // เทอมที่ผ่านมาแล้ว (ไม่รวมปัจจุบัน)
    if (pastSems < 1) return null;

    // อ่านเฉพาะเทอมที่ผ่านมาจริงๆ เทอมที่ยังไม่ผ่านถือว่าไม่มีข้อมูล
    const getSem = (idx) => (idx <= pastSems ? (userSemData[idx] ?? null) : null);
    const g1 = getSem(1);
    const g2 = getSem(2);

    // ── Case A: ผ่านเทอม 1 มาแล้ว และ GPAX < 1.25 ─────────────────────────
    if (pastSems >= 1 && g1 != null && g1 < 1.25) return 'A';

    // ── Case B: ผ่านเทอม 2 มาแล้ว และ GPAX < 1.50 ─────────────────────────
    if (pastSems >= 2 && g2 != null && g2 < 1.50) return 'B';

    // ── วิเคราะห์เทอม 3+ (3 zone mutually exclusive) ───────────────────────
    //   LOW  < 1.75           → รีเซ็ต HIGH counter
    //   HIGH 1.75 ≤ g < 2.00 → รีเซ็ต LOW counter
    //   SAFE ≥ 2.00           → รีเซ็ตทั้งคู่
    let consecutiveLow = 0,  maxConsLow  = 0;
    let consecutiveHigh = 0, maxConsHigh = 0;
    let totalLowCount = 0;
    let hadSafeBeforeLow = false; // มี SAFE คั่นระหว่าง LOW สองช่วง = กระจาย
    let prevWasSafe = false;

    for (let i = 3; i <= pastSems; i++) {
      const g = userSemData[i];
      if (g != null) {
        if (g < 1.75) {
          if (prevWasSafe) hadSafeBeforeLow = true;
          consecutiveLow++;
          totalLowCount++;
          maxConsLow  = Math.max(maxConsLow, consecutiveLow);
          consecutiveHigh = 0;
          prevWasSafe = false;
        } else if (g < 2.00) {
          consecutiveHigh++;
          maxConsHigh = Math.max(maxConsHigh, consecutiveHigh);
          consecutiveLow = 0;
          prevWasSafe = false;
        } else {
          consecutiveLow  = 0;
          consecutiveHigh = 0;
          prevWasSafe = true;
        }
      }
    }

    // ── Case C: เคยติด LOW ≥2 ภาคติดกัน ─────────────────────────────────────
    if (maxConsLow >= 2) return 'C';

    // ── Case D: เคยติด HIGH ≥4 ภาคติดกัน ────────────────────────────────────
    if (maxConsHigh >= 4 || consecutiveHigh >= 3) return 'D';

    // ── Case E: low กระจาย ≥2 ครั้ง (มี safe คั่น แล้วกลับมา low) ───────────
    if (totalLowCount >= 2 && hadSafeBeforeLow) return 'E';

    // ── ใช้ weighted GPAX (เดียวกับ Dashboard) สำหรับ F / G / H ──────────────
    // ดึงค่า GPAX จาก gpaHistory โดยตรงก่อน แล้ว fallback ไป calculatedGPAX
    // เพื่อให้สอดคล้องกับค่าที่แสดงบน Dashboard
    const gpax = calculatedGPAX;

    // ── Case F: เรียนผ่านมาหลายเทอมแล้ว แต่ weighted GPAX < 1.80 ─────────────
    if (gpax != null && gpax < 1.80 && pastSems >= 6) return 'F';

    // ── Case G: weighted GPAX คาบเส้น 1.80–1.99 (ต้องลงรีเกรด) ──────────────
    if (gpax != null && gpax >= 1.80 && gpax < 2.00) return 'G';

    // ── Case H: weighted GPAX ≥ 2.00 หรือ fall-through ────────────────────────
    if (gpax != null && gpax >= 2.00) return 'H';

    // ── ยังไม่มีข้อมูล GPAX พอที่จะระบุ case ────────────────────────────────
    return null;
  };

  const matchedCase = getUserMatchedCase();

  // ── GPA to status (used for user's personal row) ──────────────────────────
  const gpaxToStatus = (gpax, semIdx) => {
    if (semIdx === 1) return gpax < 1.25 ? 'probation-low' : 'warning';
    if (semIdx === 2) return gpax < 1.50 ? 'probation-low' : gpax < 2.00 ? 'warning' : 'safe';
    // เทอม 3 เป็นต้นไป
    if (gpax >= 2.00) return 'safe';
    if (gpax >= 1.75) return 'probation-high';
    return 'probation-low';
  };

  // ── Render a single GPA cell ──────────────────────────────────────────────
  const GpaCell = ({ gpa, status, note, isCurrent = false, isUser = false, dimmed = false }) => {
    const s = CELL_STYLES[status] || CELL_STYLES.empty;
    return (
      <div
        className="relative flex flex-col items-center justify-center rounded-lg border-2 text-center transition-all"
        style={{
          background: dimmed ? '#0d111820' : s.bg,
          borderColor: dimmed ? '#1f293740' : s.border,
          color: dimmed ? '#374151' : s.text,
          opacity: dimmed ? 0.25 : 1,
          outline: isCurrent ? '2px solid #3b82f6' : isUser ? '2px solid #22c55e' : 'none',
          outlineOffset: '2px',
          minHeight: '82px',
          padding: '5px 3px',
        }}
      >
        {note && (
          <div style={{ fontSize: '10px', lineHeight: 1.2, opacity: 0.9, marginBottom: '2px', whiteSpace: 'pre-line', fontWeight: 700 }}>
            {note}
          </div>
        )}
        {gpa != null && (
          <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
            {typeof gpa === 'number' ? gpa.toFixed(2) : gpa}
          </div>
        )}
        {isCurrent && (
          <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '3px', color: '#60a5fa' }}>◀ ตอนนี้</div>
        )}
        {isUser && !isCurrent && gpa != null && (
          <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px', color: '#22c55e' }}>● ของคุณ</div>
        )}
      </div>
    );
  };

  // ── Render the X (retired marker) cell ───────────────────────────────────
  const RetiredCell = () => (
    <div
      className="flex items-center justify-center rounded-lg border-2"
      style={{ background: '#e53e3e18', borderColor: '#e53e3e60', minHeight: '82px' }}
    >
      <XCircle size={24} color="#f87171" strokeWidth={2.5} />
    </div>
  );

  const EmptyCell = () => (
    <div
      className="rounded-lg flex items-center justify-center"
      style={{ borderColor: 'transparent', minHeight: '82px', background: '#0d111830' }}
    >
    </div>
  );

  // ── Build user's personal GPAX row ───────────────────────────────────────
  const renderUserRow = () => {
    if (!userProfile || Object.keys(userSemData).length === 0) return null;
    const cells = [];
    for (let sem = 1; sem <= 12; sem++) {
      const gpa = userSemData[sem];
      const isCurrent = sem === currentSem;
      const isFuture  = sem > (currentSem || 0);
      const isPast    = sem < (currentSem || 0);

      if (isFuture) {
        cells.push(<EmptyCell key={sem} />);
      } else if (isCurrent) {
        cells.push(
          <GpaCell
            key={sem}
            gpa="?"
            status="safe"
            isCurrent={true}
          />
        );
      } else if (isPast && gpa != null) {
        cells.push(
          <GpaCell
            key={sem}
            gpa={gpa}
            status={gpaxToStatus(gpa, sem)}
            isUser={true}
          />
        );
      } else {
        cells.push(<EmptyCell key={sem} />);
      }
    }
    return cells;
  };

  // Total semesters visible in the table = 12 (6 ปี)
  const TOTAL_SEMS = 12;

  // มีเกรดเทอมปัจจุบันจริงๆ ไหม (= user กรอก GPA ของเทอมนี้มาด้วย)
  const hasCurrentSemGrade = currentSem != null && userSemData[currentSem] != null;

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }} className="p-4 md:p-6">

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '10px', borderRadius: '12px', background: '#1a202c', border: '1px solid #2d3748', color: '#a0aec0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e53e3e'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3748'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <XCircle size={20} color="#fff" />
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                การติดวิทยาทัณฑ์ <span style={{ color: '#fc8181' }}>(ติดโปร)</span>
              </h1>
            </div>
            <p style={{ color: '#718096', fontSize: '13px', marginTop: '2px', marginLeft: '48px' }}>
              Academic Dismissal &amp; Probation Criteria — ENG59
            </p>
          </div>
        </div>

        {/* ── User status banner (if logged in) ── */}
        {userProfile && (
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* ── Profile + Case badge row ── */}
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div className="flex items-center gap-3">
                <img
                  src={userProfile?.basicInfo?.image || userProfile?.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                  alt="profile"
                  style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #2d3748', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{userName || 'นิสิต'}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    ปี {currentYear} เทอม {currentTerm} &nbsp;·&nbsp; ภาคเรียนที่ {currentSem} (เทอมปัจจุบัน)
                  </div>
                </div>
              </div>
              {matchedCase && (() => {
                const isRetired  = ['A','B','C','D','E','F'].includes(matchedCase);
                const isRegrade  = matchedCase === 'G';
                const isSafeFull = matchedCase === 'H' && hasCurrentSemGrade;
                const isSafeTend = matchedCase === 'H' && !hasCurrentSemGrade;

                const bgColor     = isSafeFull ? '#27674922' : isSafeTend ? '#2c5f2e22' : isRegrade ? '#2b6cb022' : '#e53e3e22';
                const borderColor = isSafeFull ? '#276749'   : isSafeTend ? '#2d6a2f'   : isRegrade ? '#2b6cb0'   : '#e53e3e';
                const textColor   = isSafeFull ? '#68d391'   : isSafeTend ? '#9ae6a0'   : isRegrade ? '#90cdf4'   : '#fc8181';
                const caseLabels = {
                  A: 'GPAX ต่ำกว่า 1.25 ในเทอม 1',
                  B: 'GPAX ต่ำกว่า 1.50 ในเทอม 2',
                  C: 'โปรต่ำ ใกล้พ้นสภาพ',
                  D: 'โปรสูง ใกล้พ้นสภาพ',
                  E: 'โปรกระจาย เฝ้าระวัง',
                  F: 'GPAX ต่ำกว่า 1.80 ใกล้จบ',
                  G: 'GPAX คาบเส้น 1.80–1.99',
                  H: isSafeFull ? 'ปรับตัวสำเร็จ ✓' : 'แนวโน้มดี ยังไม่ติดโปร',
                };
                const IconEl = (isSafeFull || isSafeTend) ? CheckCircle2 : AlertTriangle;
                return (
                  <div style={{
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: 14,
                    padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    boxShadow: `0 0 20px ${textColor}25`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${textColor}18`,
                      border: `1.5px solid ${textColor}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconEl size={20} color={textColor} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: textColor, letterSpacing: '-0.3px' }}>
                        แนวโน้มใกล้เคียง Case {matchedCase}
                      </div>
                      <div style={{ fontSize: '12px', color: textColor, opacity: 0.8, marginTop: 2 }}>
                        {caseLabels[matchedCase]}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── Graduation eligibility card ── */}
            {(() => {
              if (calculatedGPAX === null) return null;

              const gpax     = calculatedGPAX;
              const semCount = gradedSemCount;

              // ── เกณฑ์เกรด ──────────────────────────────────────────────────
              const gradeOk      = gpax >= 2.00;
              const gradeRegrade = gpax >= 1.80 && gpax < 2.00;
              const gradeFail    = gpax < 1.80;

              // ── เกณฑ์เทอม: CS ENG59 = 8 เทอม (4 ปี) ──────────────────────
              // pastSems = เทอมที่จบแล้ว (ไม่รวมปัจจุบัน)
              const pastSems      = currentSem != null ? currentSem - 1 : semCount;
              const REQUIRED_SEMS = 8;
              const semOk         = pastSems >= REQUIRED_SEMS;
              const semsLeft      = Math.max(0, REQUIRED_SEMS - pastSems);

              // ── สรุปสถานะ ──────────────────────────────────────────────────
              // canGrad = เกรดผ่าน AND เรียนครบเทอมแล้ว
              // gradeOkNotDone = เกรดผ่าน แต่เทอมยังไม่ครบ
              const canGrad       = gradeOk && semOk;
              const gradeOkNotDone = gradeOk && !semOk;
              const needsRegrade  = gradeRegrade;
              const notReady      = gradeFail;

              // ── สี ────────────────────────────────────────────────────────
              const accent = canGrad       ? '#22c55e'
                           : gradeOkNotDone ? '#facc15'
                           : needsRegrade  ? '#60a5fa'
                           :                 '#f87171';

              const borderCol = canGrad       ? '#16a34a'
                              : gradeOkNotDone ? '#ca8a04'
                              : needsRegrade  ? '#2563eb'
                              :                 '#dc2626';

              const bgCol = canGrad       ? 'linear-gradient(135deg, #052e16 0%, #0f2820 100%)'
                          : gradeOkNotDone ? 'linear-gradient(135deg, #1c1500 0%, #2d2000 100%)'
                          : needsRegrade  ? 'linear-gradient(135deg, #0c1a2e 0%, #0a1628 100%)'
                          :                 'linear-gradient(135deg, #1f0707 0%, #2d0f0f 100%)';

              const StatusIcon = canGrad ? CheckCircle2
                               : gradeOkNotDone ? AlertTriangle
                               : needsRegrade ? AlertTriangle
                               : XCircle;

              const headline = canGrad       ? 'จบการศึกษาได้'
                             : gradeOkNotDone ? 'เกรดผ่านแล้ว — รอครบเทอม'
                             : needsRegrade  ? 'ต้องลงรีเกรดก่อนจบ'
                             :                 'ยังจบไม่ได้';

              const subline = canGrad       ? 'GPAX ≥ 2.00 และเรียนครบ 8 เทอมแล้ว'
                            : gradeOkNotDone ? `GPAX ผ่านแล้ว แต่ยังเหลืออีก ${semsLeft} เทอม`
                            : needsRegrade  ? 'GPAX 1.80–1.99 ต้องดึงเกรดให้ถึง 2.00 ก่อน'
                            :                 'GPAX ต่ำกว่า 1.80 ต้องเร่งดึงเกรดอย่างเร่งด่วน';

              // คำนวณเกรดที่ต้องได้ (กรณียังไม่ผ่าน)
              const avgWeight  = semCount > 0 ? totalGradedCredits / semCount : 20;
              const needed1Sem = !gradeOk && semCount > 0
                ? (2.00 * (totalGradedCredits + avgWeight) - gpax * totalGradedCredits) / avgWeight
                : null;
              const needed2Sem = !gradeOk && semCount > 0
                ? (2.00 * (totalGradedCredits + avgWeight * 2) - gpax * totalGradedCredits) / (avgWeight * 2)
                : null;

              return (
                <div style={{
                  background: bgCol,
                  border: `1.5px solid ${borderCol}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: `0 0 60px ${accent}22, 0 0 120px ${accent}0a, inset 0 1px 0 ${accent}15`,
                  position: 'relative',
                }}>
                  {/* Glow orb background */}
                  <div style={{
                    position: 'absolute', top: -60, right: -60, width: 220, height: 220,
                    borderRadius: '50%', background: `${accent}0c`, filter: 'blur(60px)', pointerEvents: 'none',
                  }} />

                  {/* ── Top bar: verdict ─────────────────────────────────── */}
                  <div style={{
                    padding: '28px 32px',
                    display: 'flex', alignItems: 'center', gap: 24,
                    borderBottom: `1px solid ${borderCol}40`,
                    flexWrap: 'wrap',
                    position: 'relative',
                  }}>
                    {/* Icon — bigger */}
                    <div style={{
                      width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                      background: `${accent}15`,
                      border: `2px solid ${accent}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 24px ${accent}30`,
                    }}>
                      <StatusIcon size={36} color={accent} strokeWidth={2.5} />
                    </div>

                    {/* Headline */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{
                        fontSize: '28px', fontWeight: 900, color: accent,
                        letterSpacing: '-0.8px', lineHeight: 1.1,
                        textShadow: `0 0 20px ${accent}50`,
                      }}>
                        {headline}
                      </div>
                      <div style={{ fontSize: '14px', color: `${accent}cc`, marginTop: 6, fontWeight: 600 }}>
                        {subline}
                      </div>
                    </div>

                    {/* GPAX big number — much bigger */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>GPAX สะสม</div>
                      <div style={{
                        fontSize: '64px', fontWeight: 900, fontFamily: 'monospace',
                        color: accent, lineHeight: 1,
                        textShadow: `0 0 30px ${accent}60`,
                        letterSpacing: '-2px',
                      }}>
                        {gpax.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: 4 }}>จาก 4.00</div>
                    </div>
                  </div>

                  {/* ── Bottom: progress bars ─────────────────────────────── */}
                  <div style={{ padding: '22px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>

                    {/* GPAX bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 700 }}>เกรดสะสม (GPAX)</span>
                        <span style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'monospace',
                          color: gradeOk ? '#22c55e' : gradeRegrade ? '#60a5fa' : '#f87171' }}>
                          {gpax.toFixed(2)} / 2.00
                        </span>
                      </div>
                      <div style={{ position: 'relative', height: 16, borderRadius: 99, background: '#0d111880', overflow: 'visible', boxShadow: 'inset 0 2px 4px #00000040' }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0,
                          width: `${Math.min((gpax / 4) * 100, 100)}%`,
                          borderRadius: 99,
                          background: gradeOk
                            ? 'linear-gradient(90deg,#16a34a,#22c55e,#4ade80)'
                            : gradeRegrade
                            ? 'linear-gradient(90deg,#1d4ed8,#60a5fa)'
                            : 'linear-gradient(90deg,#991b1b,#f87171)',
                          boxShadow: gradeOk ? '0 0 12px #22c55e80' : gradeRegrade ? '0 0 12px #60a5fa80' : '0 0 12px #f8717180',
                          transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }} />
                        {/* 2.00 target marker */}
                        <div style={{
                          position: 'absolute', top: -6, bottom: -6, left: '50%',
                          width: 3, borderRadius: 3, background: '#facc15',
                          boxShadow: '0 0 8px #facc1580',
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: '11px', color: '#374151' }}>0.00</span>
                        <span style={{ fontSize: '11px', color: '#facc15', fontWeight: 800 }}>เป้า 2.00</span>
                        <span style={{ fontSize: '11px', color: '#374151' }}>4.00</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: 5 }}>
                        weighted จาก {gradedSemCount} เทอม · {totalGradedCredits} หน่วยกิต
                      </div>
                    </div>

                    {/* Semester progress bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 700 }}>เทอมที่เรียนแล้ว</span>
                        <span style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'monospace',
                          color: semOk ? '#22c55e' : '#facc15' }}>
                          {pastSems} / {REQUIRED_SEMS} เทอม
                        </span>
                      </div>
                      <div style={{ position: 'relative', height: 16, borderRadius: 99, background: '#0d111880', boxShadow: 'inset 0 2px 4px #00000040' }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0,
                          width: `${Math.min((pastSems / REQUIRED_SEMS) * 100, 100)}%`,
                          borderRadius: 99,
                          background: semOk
                            ? 'linear-gradient(90deg,#16a34a,#22c55e,#4ade80)'
                            : 'linear-gradient(90deg,#854d0e,#facc15)',
                          boxShadow: semOk ? '0 0 12px #22c55e80' : '0 0 12px #facc1560',
                          transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }} />
                      </div>
                      <div style={{ marginTop: 10 }}>
                        {semOk ? (
                          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>✓ เรียนครบ 8 เทอมแล้ว</span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#facc15', fontWeight: 700 }}>
                            ⏳ ยังขาดอีก {semsLeft} เทอม (ปัจจุบัน: ปี {currentYear} เทอม {currentTerm})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Needed grade section (if grade not passing) */}
                    {!gradeOk && needed1Sem !== null && (
                      <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${borderCol}30`, paddingTop: 14 }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 700, marginBottom: 10 }}>
                          ต้องได้เกรดเท่าไรถึงจะดึง GPAX ขึ้น 2.00 ได้
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {[
                            { label: 'ใน 1 เทอมถัดไป', val: needed1Sem },
                            { label: 'เฉลี่ย 2 เทอมถัดไป', val: needed2Sem },
                          ].map(({ label, val }) => {
                            const impossible = !val || val > 4;
                            const hard = val > 3.5;
                            const c = impossible ? '#f87171' : hard ? '#f97316' : '#facc15';
                            return (
                              <div key={label} style={{
                                flex: 1, borderRadius: 10,
                                background: '#111827', border: `1px solid ${c}40`,
                                padding: '10px 14px',
                              }}>
                                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: 4 }}>{label}</div>
                                <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'monospace', color: c }}>
                                  {impossible ? '> 4.00' : val.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '10px', color: c, opacity: 0.7, marginTop: 2 }}>
                                  {impossible ? 'เป็นไปไม่ได้ใน 1 เทอม' : hard ? 'ยาก แต่ทำได้' : 'พอทำได้'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ── Core Courses Checklist ── */}
        {userProfile && (() => {
          const courseStates = userProfile.courseStates || {};
          
          // รวบรวมวิชาแกนทั้งหมดจาก roadmapData
          const allCoreCourses = [];
          roadmapData.forEach((yearGroup, yIdx) => {
            yearGroup.semesters.forEach((sem, sIdx) => {
              sem.courses.forEach(course => {
                allCoreCourses.push({
                  ...course,
                  year: yIdx + 1,
                  term: sIdx + 1,
                  termLabel: sem.term,
                });
              });
            });
          });

          const passedCount  = allCoreCourses.filter(c => courseStates[c.id] === 'passed').length;
          const total        = allCoreCourses.length;
          const percent      = total > 0 ? Math.round((passedCount / total) * 100) : 0;
          const allPassed    = passedCount === total;

          // group by year
          const byYear = {};
          allCoreCourses.forEach(c => {
            if (!byYear[c.year]) byYear[c.year] = {};
            if (!byYear[c.year][c.term]) byYear[c.year][c.term] = { label: c.termLabel, courses: [] };
            byYear[c.year][c.term].courses.push(c);
          });

          return (
            <div style={{
              background: allPassed ? 'linear-gradient(135deg, #052e16 0%, #0f2820 100%)' : '#0d1117',
              border: `1.5px solid ${allPassed ? '#16a34a' : '#1f2937'}`,
              borderRadius: 18,
              marginBottom: 20,
              overflow: 'hidden',
              boxShadow: allPassed ? '0 0 40px #22c55e15' : 'none',
            }}>
              {/* Header row */}
              <div
                onClick={() => setShowCoreCourses(p => !p)}
                style={{
                  padding: '18px 24px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer',
                  borderBottom: showCoreCourses ? `1px solid ${allPassed ? '#16a34a40' : '#1f2937'}` : 'none',
                  userSelect: 'none',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                  background: allPassed ? '#22c55e20' : '#1e293b',
                  border: `1.5px solid ${allPassed ? '#16a34a' : '#2d3748'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={20} color={allPassed ? '#22c55e' : '#94a3b8'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '16px', color: allPassed ? '#22c55e' : '#fff', marginBottom: 2 }}>
                    วิชาแกนหลักสูตร (Core Courses)
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    ต้องผ่านทุกวิชาแกน จึงจะสำเร็จการศึกษาได้
                  </div>
                </div>
                {/* Progress badge */}
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'monospace', color: allPassed ? '#22c55e' : percent >= 70 ? '#facc15' : '#f87171', lineHeight: 1 }}>
                    {passedCount}<span style={{ fontSize: '14px', color: '#4b5563', fontWeight: 700 }}>/{total}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: 2 }}>ผ่านแล้ว</div>
                </div>
                {/* Progress bar */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ height: 6, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${percent}%`,
                      background: allPassed ? '#22c55e' : percent >= 70 ? '#facc15' : '#f87171',
                      borderRadius: 99,
                      transition: 'width 0.5s ease',
                    }}/>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: 4, textAlign: 'center' }}>{percent}%</div>
                </div>
                {showCoreCourses ? <ChevronUp size={16} color="#4b5563"/> : <ChevronDown size={16} color="#4b5563"/>}
              </div>

              {/* Course list */}
              {showCoreCourses && (
                <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {Object.entries(byYear).map(([year, terms]) => (
                    <div key={year}>
                      {/* Year label */}
                      <div style={{
                        fontSize: '11px', fontWeight: 900, color: '#6b7280',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{ height: 1, width: 16, background: '#2d3748' }}/>
                        ปีที่ {year}
                        <div style={{ height: 1, flex: 1, background: '#2d3748' }}/>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.entries(terms).map(([term, { label, courses }]) => (
                          <div key={term}>
                            {/* Term label */}
                            <div style={{ fontSize: '10px', color: '#4b5563', fontWeight: 700, marginBottom: 6, marginLeft: 4 }}>
                              {label}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 6 }}>
                              {courses.map(course => {
                                const status = courseStates[course.id];
                                const passed  = status === 'passed';
                                const learning = status === 'learning';
                                const prereqOk = !course.prereq || courseStates[course.prereq] === 'passed';

                                return (
                                  <div key={course.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    background: passed   ? '#052e1680'
                                              : learning ? '#0c1a2e80'
                                              : '#111827',
                                    border: `1px solid ${passed ? '#16a34a50' : learning ? '#2563eb40' : '#1f2937'}`,
                                    transition: 'all 0.2s',
                                  }}>
                                    {/* Status icon */}
                                    <div style={{ flexShrink: 0 }}>
                                      {passed   ? <CheckCircle2 size={16} color="#22c55e"/>
                                       : learning ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}/></div>
                                       : !prereqOk ? <Lock size={14} color="#6b7280"/>
                                       : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #374151' }}/>}
                                    </div>
                                    {/* Course info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: '12px', fontWeight: 700, color: passed ? '#86efac' : learning ? '#93c5fd' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {course.name}
                                      </div>
                                      <div style={{ fontSize: '10px', color: '#4b5563', marginTop: 1 }}>
                                        {course.code} · {course.credits} หน่วยกิต
                                      </div>
                                    </div>
                                    {/* Status badge */}
                                    <div style={{
                                      fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: 99, flexShrink: 0,
                                      background: passed ? '#22c55e20' : learning ? '#3b82f620' : '#1f293760',
                                      color: passed ? '#22c55e' : learning ? '#60a5fa' : '#4b5563',
                                      border: `1px solid ${passed ? '#16a34a40' : learning ? '#2563eb40' : '#1f2937'}`,
                                    }}>
                                      {passed ? 'ผ่าน' : learning ? 'กำลังเรียน' : 'ยังไม่ผ่าน'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Legend ── */}
        <div style={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#a0aec0', fontSize: '12px', fontWeight: 700 }}>
            <Info size={14} />
            สัญลักษณ์สถานะ
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { status: 'warning',        label: 'เสี่ยง / ปี 1'   },
              { status: 'probation-low',  label: 'โปรต่ำ < 1.75'  },
              { status: 'probation-high', label: 'โปรสูง < 2.00'  },
              { status: 'retired',        label: 'พ้นสภาพ'         },
              { status: 'safe',           label: 'ปกติ ≥ 2.00'     },
              { status: 'regrade',        label: 'รีเกรด'          },
              { status: 'graduated',      label: 'สำเร็จการศึกษา' },
            ].map(({ status, label }) => {
              const s = CELL_STYLES[status];
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '5px 10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.text }}>{label}</span>
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e53e3e22', border: '1px solid #e53e3e80', borderRadius: 8, padding: '5px 10px' }}>
              <XCircle size={12} color="#fc8181" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fc8181' }}>พ้นสภาพ ณ เทอมนี้</span>
            </div>
          </div>
        </div>

        {/* ── Main Table ── */}
        <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 32px #00000060' }}>

          {/* Table outer scroll wrapper */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>

              {/* ── Year header row ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', background: '#060910', borderBottom: '1px solid #1f2937' }}>
                <div style={{ padding: '12px 8px', borderRight: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#374151', letterSpacing: 2 }}>CASE</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
                  {['ปี 1','ปี 2','ปี 3','ปี 4','ปี 5','ปี 6'].map((yr, i) => (
                    <div key={yr} style={{
                      padding: '12px 4px', textAlign: 'center',
                      borderRight: i < 5 ? '1px solid #1f2937' : 'none',
                      background: currentYear === i+1 ? '#1e3a5f' : 'transparent',
                    }}>
                      <span style={{
                        fontSize: '12px', fontWeight: 900, letterSpacing: 1,
                        color: currentYear === i+1 ? '#60a5fa' : '#4b5563',
                      }}>{yr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Semester sub-header ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', background: '#080c12', borderBottom: '2px solid #1f2937' }}>
                <div style={{ padding: '6px 8px', borderRight: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#374151', letterSpacing: 1 }}>เทอม</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const termNum = i % 2 === 0 ? 1 : 2;
                    const isCurSem = currentSem === i + 1;
                    return (
                      <div key={i} style={{
                        padding: '6px 2px', textAlign: 'center',
                        borderRight: i % 2 === 1 && i < 11 ? '1px solid #1f2937' : i % 2 === 0 ? '1px dashed #1f293760' : 'none',
                        background: isCurSem ? '#1e3a5f' : 'transparent',
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: isCurSem ? '#60a5fa' : '#374151' }}>
                          {termNum}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── User's GPAX row ── */}
              {userProfile && Object.keys(userSemData).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', borderBottom: '2px solid #2563eb40', background: '#1e40af08' }}>
                  <div style={{ padding: '8px 6px', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <img
                      src={userProfile?.basicInfo?.image || userProfile?.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                      alt="you"
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                    />
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#60a5fa', textAlign: 'center', lineHeight: 1.2 }}>
                      {userName ? userName.split(' ')[0] : 'คุณ'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px', padding: '5px 3px' }}>
                    {renderUserRow()}
                  </div>
                </div>
              )}

              {/* ── Case rows A–H ── */}
              {TABLE_ROWS.map((row, rowIdx) => {
                const isSelected = selectedRow === row.id;
                const OutcomeIcon = OUTCOME_STYLES[row.outcome]?.icon || XCircle;
                const outcomeStyle = OUTCOME_STYLES[row.outcome] || OUTCOME_STYLES.retired;
                const isMatched = matchedCase === row.id;

                // outcome color accent per row
                const rowAccent = row.outcome === 'retired' ? '#e53e3e' : row.outcome === 'graduated' ? '#553c9a' : '#2b6cb0';

                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '88px 1fr',
                      borderBottom: rowIdx < TABLE_ROWS.length - 1 ? '1px solid #1a2030' : 'none',
                      background: isMatched ? '#68d39106' : isSelected ? '#111827' : 'transparent',
                      transition: 'background 0.2s',
                      borderLeft: isMatched ? '3px solid #22c55e' : '3px solid transparent',
                    }}
                  >
                    {/* Row label */}
                    <div
                      style={{ padding: '6px', borderRight: '1px solid #1a2030', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}
                      onClick={() => setSelectedRow(isSelected ? null : row.id)}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: isSelected ? rowAccent : '#111827',
                        border: `2px solid ${isMatched ? '#22c55e' : isSelected ? rowAccent : '#1f2937'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 900, color: isSelected ? '#fff' : '#6b7280' }}>{row.id}</span>
                      </div>
                      {isMatched && (
                        <span style={{ fontSize: '7px', fontWeight: 800, color: '#22c55e', background: '#16a34a20', border: '1px solid #22c55e50', borderRadius: 4, padding: '1px 4px', textAlign: 'center', lineHeight: 1.4 }}>
                          ← คุณ
                        </span>
                      )}
                    </div>

                    {/* GPA cells + outcome badge */}
                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                      {/* GPA grid — 12 cols with year dividers */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px', padding: '5px 3px' }}>
                        {Array.from({ length: TOTAL_SEMS }, (_, i) => {
                          const semNum = i + 1;
                          const cell = row.cells.find(c => c.sem === semNum);
                          if (!cell) return <EmptyCell key={i} />;
                          if (cell.status === 'retired') return <RetiredCell key={i} />;
                          return <GpaCell key={i} gpa={cell.gpa} status={cell.status} note={cell.note} />;
                        })}
                      </div>

                      {/* Outcome badge */}
                      <div
                        style={{
                          width: 200, flexShrink: 0,
                          margin: '5px 5px 5px 0',
                          borderRadius: 10,
                          background: outcomeStyle.bg,
                          border: `1px solid ${outcomeStyle.border}`,
                          padding: '8px 10px',
                          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedRow(isSelected ? null : row.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <OutcomeIcon size={13} color={outcomeStyle.text} strokeWidth={2.5} />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: outcomeStyle.text }}>
                            {row.outcome === 'graduated' ? 'สำเร็จการศึกษา' :
                             row.outcome === 'regrade' ? 'รีเกรดได้' : 'พ้นสภาพ'}
                          </span>
                        </div>
                        <p style={{ fontSize: '10px', color: '#e2e8f060', lineHeight: 1.5, margin: 0 }}>
                          {row.outcomeText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Detail panel (when a case is selected) ── */}
        {selectedRow && (() => {
          const row = TABLE_ROWS.find(r => r.id === selectedRow);
          if (!row) return null;
          return (
            <div style={{ marginTop: 20, background: '#111827', border: '2px solid #2d3748', borderRadius: 16, padding: '20px 24px', animation: 'fadeUp 0.25s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>Case {row.id}</h3>
                  <p style={{ color: '#a0aec0', fontSize: '13px', marginTop: 4 }}>{row.outcomeText}</p>
                </div>
              </div>

              {/* Semester timeline (compact) */}
              <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
                  {row.cells.map((cell, idx) => {
                    const { year, term } = semToYearTerm(cell.sem);
                    const s = cell.status === 'retired'
                      ? CELL_STYLES.empty
                      : CELL_STYLES[cell.status] || CELL_STYLES.empty;
                    const isRetired = cell.status === 'retired';
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: '10px', color: '#718096', fontWeight: 700 }}>ปี {year}/T{term}</div>
                        {isRetired ? (
                          <div style={{ width: 60, height: 72, borderRadius: 10, background: '#e53e3e22', border: '2px solid #e53e3e80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <XCircle size={24} color="#fc8181" />
                          </div>
                        ) : (
                          <div style={{ width: 60, height: 72, borderRadius: 10, background: s.bg, border: `2px solid ${s.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 4 }}>
                            {cell.note && <div style={{ fontSize: '8px', color: s.text, opacity: 0.85, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{cell.note}</div>}
                            <div style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace', color: s.text }}>{cell.gpa}</div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: s.text, opacity: 0.8 }}>{s.label}</div>
                          </div>
                        )}
                        {idx < row.cells.length - 1 && (
                          <div style={{ fontSize: '16px', color: '#4a5568', position: 'absolute', right: -10 }}>→</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Summary footer ── */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            {
              color: '#e53e3e', icon: null,
              title: 'ปี 1 — เกณฑ์ขั้นต่ำ',
              text: 'GPAX < 1.25 ในเทอม 1 = พ้นสภาพทันที\nGPAX < 1.50 ในเทอม 2 = พ้นสภาพ'
            },
            {
              color: '#dd6b20', icon: null,
              title: 'ปี 2+ — วิทยาทัณฑ์',
              text: 'โปรต่ำ (< 1.75) ติดกัน 2 ภาค = พ้นสภาพ\nโปรสูง (< 2.00) ติดกัน 4 ภาค = พ้นสภาพ'
            },
            {
              color: '#553c9a', icon: null,
              title: 'เงื่อนไขจบการศึกษา',
              text: 'ต้องมี GPAX ≥ 2.00\nถ้า 1.80–1.99 → รีเกรดได้\nต่ำกว่า 1.80 หลังเรียนจบ → ไม่ได้ปริญญา'
            },
          ].map(({ color, icon, title, text }) => (
            <div key={title} style={{ background: '#111827', border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{title}</span>
              </div>
              <pre style={{ fontFamily: 'inherit', fontSize: '12px', color: '#a0aec0', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</pre>
            </div>
          ))}
        </div>

        {/* Source note */}
        <div style={{ marginTop: 16, textAlign: 'center', color: '#4a5568', fontSize: '11px' }}>
          อ้างอิง ตามระเบียบ มจพ. ว่าด้วย การศึกษาระดับปริญญาบัณฑิต (ฉบับที่ 2) ลงวันที่ 23 พฤศจิกายน 2566 &nbsp;·&nbsp; ENG59
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AcademicCriteriaPage;