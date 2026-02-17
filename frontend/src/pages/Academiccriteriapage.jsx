import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, GraduationCap, Info, BookOpen, RotateCcw } from 'lucide-react';

// ─── TABLE DATA — mirrors the infographic exactly ───────────────────────────
// Each "case row" = one example student trajectory
// status: 'warning' | 'probation-low' | 'probation-high' | 'retired' | 'safe' | 'regrade' | 'graduated' | 'empty' | 'note'
const TABLE_ROWS = [
  {
    id: 'A', icon: null, label: 'A',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : เกรดเฉลี่ยสะสม ต่ำกว่า 1.25 ในภาคการเรียนที่ 1',
    cells: [
      { sem: 1, gpa: '1.24', status: 'retired' },
    ]
  },
  {
    id: 'B', icon: null, label: 'B',
    outcome: 'retired',
    outcomeText: 'พ้นสภาพ : เกรดเฉลี่ยสะสม ต่ำกว่า 1.50 ในภาคการเรียนที่ 2',
    cells: [
      { sem: 1, gpa: '1.25', status: 'warning' },
      { sem: 2, gpa: '1.49', status: 'retired' },
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
      { sem: 4, gpa: '1.74', status: 'retired' },
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
      { sem: 6, gpa: '1.99', status: 'retired' },
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
      { sem: 7, gpa: '1.74', status: 'retired' },
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
      { sem: 8, gpa: '1.79', status: 'retired' },
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
  'regrade':   { bg: '#2b6cb022', border: '#2b6cb0', text: '#90cdf4', icon: RotateCcw },
};

// ─── Main Component ─────────────────────────────────────────────────────────
const AcademicCriteriaPage = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
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

  const currentYear = userProfile?.basicInfo?.currentYear || userProfile?.currentYear || null;
  const currentTerm = userProfile?.basicInfo?.currentTerm || userProfile?.currentTerm || null;
  const currentSem  = currentYear && currentTerm ? (currentYear - 1) * 2 + currentTerm : null;
  const userName    = userProfile?.basicInfo?.name || userProfile?.name || null;

  // ── Determine which case row the user best matches ────────────────────────
  const getUserMatchedCase = () => {
    if (!currentSem || Object.keys(userSemData).length === 0) return null;
    // Simple heuristic: check most recent known GPAX and probation count
    const gpaxValues = Object.entries(userSemData)
      .filter(([sem]) => parseInt(sem) <= (currentSem - 1))
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    
    if (gpaxValues.length === 0) return null;
    const latestGpax = parseFloat(gpaxValues[gpaxValues.length - 1]?.[1]) || 0;

    if (currentSem === 1 && latestGpax < 1.25) return 'A';
    if (currentSem === 2 && latestGpax < 1.50) return 'B';
    
    // Count consecutive low probations (< 1.75)
    let consecutiveLow = 0, maxConsLow = 0;
    let consecutiveHigh = 0, maxConsHigh = 0;
    for (let i = 3; i <= currentSem - 1; i++) {
      const g = userSemData[i];
      if (g !== undefined && g !== null) {
        if (g < 1.75) { consecutiveLow++; maxConsLow = Math.max(maxConsLow, consecutiveLow); }
        else consecutiveLow = 0;
        if (g < 2.00) { consecutiveHigh++; maxConsHigh = Math.max(maxConsHigh, consecutiveHigh); }
        else consecutiveHigh = 0;
      }
    }
    if (maxConsLow >= 2) return 'C';
    if (maxConsHigh >= 4) return 'D';
    return 'H'; // on track
  };

  const matchedCase = getUserMatchedCase();

  // ── GPA to status (used for user's personal row) ──────────────────────────
  const gpaxToStatus = (gpax, semIdx) => {
    if (semIdx === 1) return gpax < 1.25 ? 'retired' : 'warning';
    if (semIdx === 2) return gpax < 1.50 ? 'retired' : gpax < 2.00 ? 'warning' : 'safe';
    if (gpax >= 2.00) return 'safe';
    if (gpax >= 1.75) return 'probation-high';
    return 'probation-low';
  };

  // ── Render a single GPA cell ──────────────────────────────────────────────
  const GpaCell = ({ gpa, status, note, isCurrent = false, isUser = false, dimmed = false }) => {
    const s = CELL_STYLES[status] || CELL_STYLES.empty;
    return (
      <div
        className="relative flex flex-col items-center justify-center rounded-md border-2 text-center transition-all"
        style={{
          background: dimmed ? '#1a202c30' : s.bg,
          borderColor: dimmed ? '#2d374850' : s.border,
          color: dimmed ? '#4a5568' : s.text,
          opacity: dimmed ? 0.3 : 1,
          outline: isCurrent ? '2.5px solid #63b3ed' : isUser ? '2px solid #68d391' : '',
          outlineOffset: '2px',
          minHeight: '62px',
          padding: '4px 2px',
        }}
      >
        {note && (
          <div style={{ fontSize: '8px', lineHeight: 1.2, opacity: 0.85, marginBottom: '1px', whiteSpace: 'pre-line' }}>
            {note}
          </div>
        )}
        {gpa != null && (
          <div style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
            {typeof gpa === 'number' ? gpa.toFixed(2) : gpa}
          </div>
        )}
        {isCurrent && (
          <div style={{ fontSize: '8px', fontWeight: 700, marginTop: '2px', color: '#63b3ed' }}>◀ ปัจจุบัน</div>
        )}
        {isUser && !isCurrent && gpa != null && (
          <div style={{ fontSize: '8px', fontWeight: 700, marginTop: '1px', color: '#68d391' }}>● ของคุณ</div>
        )}
      </div>
    );
  };

  // ── Render the X (retired marker) cell ───────────────────────────────────
  const RetiredCell = () => (
    <div
      className="flex items-center justify-center rounded-md border-2"
      style={{ background: '#e53e3e22', borderColor: '#e53e3e80', minHeight: '62px' }}
    >
      <XCircle size={22} color="#fc8181" strokeWidth={2.5} />
    </div>
  );

  // ── Render an empty placeholder ───────────────────────────────────────────
  const EmptyCell = () => (
    <div
      className="rounded-md border-dashed border-2 flex items-center justify-center"
      style={{ borderColor: '#2d374850', minHeight: '62px', background: '#1a202c15' }}
    >
      <span style={{ color: '#2d3748', fontSize: '11px' }}>—</span>
    </div>
  );

  // ── Build user's personal GPAX row ───────────────────────────────────────
  const renderUserRow = () => {
    if (!userProfile || Object.keys(userSemData).length === 0) return null;
    const cells = [];
    for (let sem = 1; sem <= 16; sem++) {
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

  // Total semesters visible in the table = 16
  const TOTAL_SEMS = 16;

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
          <div style={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
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
            {matchedCase && (
              <div style={{ background: matchedCase === 'H' ? '#27674922' : '#e53e3e22', border: `1px solid ${matchedCase === 'H' ? '#276749' : '#e53e3e'}`, borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {matchedCase === 'H'
                  ? <CheckCircle2 size={16} color="#68d391" />
                  : <AlertTriangle size={16} color="#fc8181" />
                }
                <span style={{ fontSize: '13px', fontWeight: 700, color: matchedCase === 'H' ? '#68d391' : '#fc8181' }}>
                  แนวโน้มใกล้เคียง Case {matchedCase}
                </span>
              </div>
            )}
          </div>
        )}

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
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, overflow: 'hidden' }}>

          {/* Table outer scroll wrapper */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 1100 }}>

              {/* ── Column header row: EX | 1ST YEAR | 2ND YEAR | ... | 8TH YEAR ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', background: '#0d1117', borderBottom: '2px solid #1f2937' }}>
                {/* Top-left corner */}
                <div style={{ padding: '10px 8px', borderRight: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#4a5568', letterSpacing: 1 }}>EX.</span>
                </div>
                {/* Year headers 1–8 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {['1ST YEAR','2ND YEAR','3RD YEAR','4TH YEAR','5TH YEAR','6TH YEAR','7TH YEAR','8TH YEAR'].map((yr, i) => (
                    <div key={yr} style={{ padding: '10px 4px', textAlign: 'center', borderRight: i < 7 ? '1px solid #1f2937' : 'none', borderLeft: i === 0 ? 'none' : undefined }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#a0aec0', letterSpacing: 0.5 }}>{yr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Semester sub-header row: (blank) | 1 2 | 3 4 | ... ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', background: '#0d1117', borderBottom: '2px solid #1f2937' }}>
                <div style={{ padding: '6px 8px', borderRight: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4a5568' }}>SEMESTER</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)' }}>
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} style={{ padding: '6px 2px', textAlign: 'center', borderRight: i < 15 ? '1px solid #1f2937' : 'none', background: currentSem === i + 1 ? '#63b3ed18' : 'transparent' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: currentSem === i + 1 ? '#63b3ed' : '#718096' }}>{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── User's actual GPAX row (if data exists) ── */}
              {userProfile && Object.keys(userSemData).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: '2px solid #63b3ed40', background: '#63b3ed06' }}>
                  {/* Row label */}
                  <div style={{ padding: '8px 6px', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <img
                      src={userProfile?.basicInfo?.image || userProfile?.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                      alt="you"
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid #63b3ed' }}
                    />
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#63b3ed', textAlign: 'center', lineHeight: 1.2 }}>
                      {userName ? userName.split(' ')[0] : 'คุณ'}
                    </span>
                  </div>

                  {/* Cells */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px', padding: '6px 4px' }}>
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

                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr',
                      borderBottom: rowIdx < TABLE_ROWS.length - 1 ? '1px solid #1f2937' : 'none',
                      background: isMatched ? '#68d39108' : isSelected ? '#1a202c' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* ── Row Label cell (case icon + letter) ── */}
                    <div
                      style={{ padding: '8px 6px', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}
                      onClick={() => setSelectedRow(isSelected ? null : row.id)}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: isSelected ? '#2d3748' : '#1a202c', border: '2px solid #2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: isSelected ? '#fff' : '#a0aec0' }}>{row.id}</span>
                      </div>
                      {isMatched && (
                        <span style={{ fontSize: '8px', fontWeight: 800, color: '#68d391', background: '#27674920', border: '1px solid #27674960', borderRadius: 4, padding: '2px 4px', textAlign: 'center', lineHeight: 1.3 }}>
                          ใกล้เคียง<br/>คุณ
                        </span>
                      )}
                    </div>

                    {/* ── GPA cells + outcome cell ── */}
                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                      {/* GPA grid */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px', padding: '6px 4px' }}>
                        {Array.from({ length: TOTAL_SEMS }, (_, i) => {
                          const semNum = i + 1;
                          const cell = row.cells.find(c => c.sem === semNum);

                          // If the row ends with 'retired', show X mark at the cell AFTER the last filled cell
                          const maxFilledSem = row.cells[row.cells.length - 1]?.sem || 0;
                          const isRetiredCell = row.outcome === 'retired' && semNum === maxFilledSem + 1;

                          if (isRetiredCell) return <RetiredCell key={i} />;
                          if (!cell) return <EmptyCell key={i} />;

                          // For 'retired' outcome, the last cell with status='retired' = the X mark
                          if (cell.status === 'retired') return <RetiredCell key={i} />;

                          return (
                            <GpaCell
                              key={i}
                              gpa={cell.gpa}
                              status={cell.status}
                              note={cell.note}
                            />
                          );
                        })}
                      </div>

                      {/* Outcome description — right side badge */}
                      <div
                        style={{
                          minWidth: 220,
                          maxWidth: 280,
                          margin: '6px 6px 6px 0',
                          borderRadius: 10,
                          background: outcomeStyle.bg,
                          border: `1px solid ${outcomeStyle.border}`,
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        onClick={() => setSelectedRow(isSelected ? null : row.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <OutcomeIcon size={14} color={outcomeStyle.text} strokeWidth={2.5} />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: outcomeStyle.text }}>
                            {row.outcome === 'graduated' ? 'สำเร็จการศึกษา' :
                             row.outcome === 'regrade' ? 'รีเกรดได้' : 'พ้นสภาพ'}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#e2e8f080', lineHeight: 1.5, margin: 0 }}>
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