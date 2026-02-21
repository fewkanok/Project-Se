// src/components/AdminDashboard.jsx
// SURVIVOR ADMIN — Black Terminal Tech Edition

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Save, Trash2, Edit3, X, Star,
  Flag, RefreshCw, Database, MessageSquare,
  ShieldCheck, TrendingUp, Zap, BookOpen,
  AlertTriangle, CheckCircle, Activity, ChevronRight
} from 'lucide-react';
import * as AdminService from '../services/adminService';

// ─── Global Styles ─────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=Geist+Mono:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #000000;
      --bg1:       #080808;
      --bg2:       #0F0F0F;
      --bg3:       #161616;
      --bg4:       #1C1C1C;
      --border:    rgba(255,255,255,0.06);
      --border2:   rgba(255,255,255,0.11);
      --border3:   rgba(255,255,255,0.18);
      --text:      #F5F5F5;
      --text2:     #A0A0A0;
      --muted:     #555555;
      --lime:      #A3E635;
      --lime2:     #BEF264;
      --limebg:    rgba(163,230,53,0.08);
      --limebg2:   rgba(163,230,53,0.15);
      --red:       #FF4444;
      --redbg:     rgba(255,68,68,0.08);
      --amber:     #F59E0B;
      --amberbg:   rgba(245,158,11,0.09);
      --cyan:      #22D3EE;
      --cyanbg:    rgba(34,211,238,0.08);
      --sidebar-w: 210px;
    }

    html, body { background: var(--bg); color: var(--text); }
    body { font-family: 'Geist Mono', monospace; -webkit-font-smoothing: antialiased; }
    .f-display { font-family: 'Bricolage Grotesque', sans-serif; }
    .f-mono { font-family: 'Geist Mono', monospace; }

    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
    @keyframes spin    { to { transform: rotate(360deg) } }
    @keyframes barGrow { from { width: 0 } }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes toastIn {
      from { opacity:0; transform: translateX(20px); }
      to   { opacity:1; transform: translateX(0); }
    }

    .fadeup { animation: fadeUp .35s cubic-bezier(.22,.68,0,1.2) both; }
    .d1 { animation-delay:.04s } .d2 { animation-delay:.09s }
    .d3 { animation-delay:.14s } .d4 { animation-delay:.19s }
    .spin { animation: spin .65s linear infinite; }

    /* Scanline overlay */
    .scanline-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.03) 2px,
        rgba(0,0,0,0.03) 4px
      );
    }

    /* App layout */
    .app-shell { display: flex; min-height: 100vh; }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-w);
      background: var(--bg1);
      border-right: 1px solid var(--border);
      position: fixed; top:0; left:0; bottom:0; z-index: 50;
      display: flex; flex-direction: column;
    }

    .sidebar-top {
      padding: 22px 18px 18px;
      border-bottom: 1px solid var(--border);
    }
    .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .logo-box {
      width: 30px; height: 30px; border-radius: 6px;
      background: var(--lime);
      display: flex; align-items: center; justify-content: center;
    }
    .logo-text {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 14px; font-weight: 800; color: var(--text);
      letter-spacing: .02em;
    }
    .logo-sub {
      font-size: 9px; color: var(--muted); letter-spacing: .15em;
      text-transform: uppercase;
    }

    .sidebar-nav { padding: 12px 8px; flex: 1; display: flex; flex-direction: column; gap: 2px; }

    .nav-item {
      display: flex; align-items: center; gap: 9px;
      padding: 9px 10px; border-radius: 7px;
      font-size: 11px; font-weight: 500; letter-spacing: .05em;
      text-transform: uppercase; color: var(--muted);
      cursor: pointer; border: none; background: transparent;
      transition: all .14s; width: 100%; text-align: left;
      position: relative;
    }
    .nav-item.active { background: var(--limebg2); color: var(--lime); }
    .nav-item.active::before {
      content: '';
      position: absolute; left: 0; top: 25%; height: 50%;
      width: 2px; border-radius: 0 2px 2px 0;
      background: var(--lime);
    }
    .nav-item:not(.active):hover { color: var(--text2); background: var(--bg2); }
    .nav-badge {
      margin-left: auto;
      background: var(--red); color: #fff;
      font-size: 9px; font-weight: 700;
      padding: 1px 6px; border-radius: 99px;
    }

    .sidebar-footer {
      padding: 12px 18px;
      border-top: 1px solid var(--border);
    }
    .status-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 10px; color: var(--muted);
    }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--lime);
      animation: blink 2s ease-in-out infinite;
    }

    /* Main area */
    .main-area { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; }

    /* Topbar */
    .topbar {
      height: 52px;
      background: var(--bg1);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
      padding: 0 28px;
      position: sticky; top: 0; z-index: 40;
    }
    .topbar-breadcrumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; color: var(--muted);
    }
    .topbar-breadcrumb strong { color: var(--text); }

    /* Content */
    .content { padding: 28px; flex: 1; position: relative; z-index: 1; }

    /* Page header */
    .page-header { margin-bottom: 24px; }
    .page-title {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 34px; font-weight: 800; line-height: 1; letter-spacing: -.01em;
      color: var(--text);
    }
    .page-title .accent { color: var(--lime); }
    .page-meta { font-size: 11px; color: var(--muted); margin-top: 6px; letter-spacing: .05em; }

    /* Stats grid */
    .stats-grid {
      display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
      margin-bottom: 22px;
    }
    .stat-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 10px; padding: 18px;
      transition: border-color .15s, transform .15s;
      position: relative; overflow: hidden;
    }
    .stat-card:hover { border-color: var(--border2); }
    .stat-card-accent-line {
      position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
    }
    .stat-label { font-size: 9px; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; }
    .stat-val {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 40px; font-weight: 800; line-height: 1; letter-spacing: -.02em;
    }
    .stat-bar { height: 1.5px; background: var(--bg4); border-radius: 99px; overflow: hidden; margin-top: 14px; }
    .stat-bar-fill { height: 100%; border-radius: 99px; animation: barGrow .7s ease both; }

    /* Toolbar */
    .toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }

    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
    .input {
      width: 100%;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 9px 12px 9px 38px;
      color: var(--text);
      font-family: 'Geist Mono', monospace;
      font-size: 12px; outline: none;
      transition: all .15s;
    }
    .input::placeholder { color: var(--muted); }
    .input:focus { border-color: rgba(163,230,53,.3); background: var(--bg3); box-shadow: 0 0 0 3px rgba(163,230,53,.07); }

    .modal-input {
      width: 100%;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 9px 12px;
      color: var(--text);
      font-family: 'Geist Mono', monospace;
      font-size: 12px; outline: none;
      transition: all .15s;
    }
    .modal-input::placeholder { color: var(--muted); }
    .modal-input:focus { border-color: rgba(163,230,53,.35); box-shadow: 0 0 0 3px rgba(163,230,53,.07); }

    .modal-select {
      width: 100%;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 9px 12px;
      color: var(--text);
      font-family: 'Geist Mono', monospace;
      font-size: 12px; outline: none;
      appearance: none; cursor: pointer;
      transition: all .15s;
    }
    .modal-select:focus { border-color: rgba(163,230,53,.35); }
    select option { background: #111; color: #f5f5f5; }

    /* Chips */
    .chip {
      padding: 7px 13px; border-radius: 7px;
      font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
      cursor: pointer; border: 1px solid var(--border);
      background: transparent; color: var(--muted);
      transition: all .13s; white-space: nowrap;
    }
    .chip.active { background: var(--limebg2); color: var(--lime); border-color: rgba(163,230,53,.3); }
    .chip.active-red { background: var(--redbg); color: var(--red); border-color: rgba(255,68,68,.28); }
    .chip:not(.active):not(.active-red):hover { border-color: var(--border2); color: var(--text2); }

    /* Buttons */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 7px;
      background: var(--lime); color: #000;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800; font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
      padding: 9px 18px; border-radius: 8px;
      border: none; cursor: pointer;
      transition: all .15s; white-space: nowrap;
    }
    .btn-primary:hover { background: var(--lime2); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--bg2); color: var(--text2);
      font-size: 11px; font-weight: 500; letter-spacing: .04em;
      padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border); cursor: pointer;
      transition: all .13s;
    }
    .btn-ghost:hover { border-color: var(--border2); color: var(--text); }

    .btn-cancel {
      display: inline-flex; align-items: center; gap: 6px;
      background: transparent; color: var(--muted);
      font-size: 11px; font-weight: 500;
      padding: 8px 14px; border-radius: 8px;
      border: 1px solid var(--border); cursor: pointer;
      transition: all .13s;
    }
    .btn-cancel:hover { color: var(--text); }

    /* Table */
    .table-wrap {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 10px; overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: var(--bg3); border-bottom: 1px solid var(--border); }
    th {
      font-size: 9px; font-weight: 600; letter-spacing: .14em;
      text-transform: uppercase; color: var(--muted);
      padding: 11px 16px; text-align: left; white-space: nowrap;
    }
    .trow { border-bottom: 1px solid var(--border); transition: background .1s; }
    .trow:hover { background: var(--bg3); }
    .trow:last-child { border-bottom: none; }
    td { padding: 13px 16px; }

    .row-act { opacity: 0; transition: opacity .12s; display: flex; justify-content: flex-end; gap: 5px; }
    .trow:hover .row-act { opacity: 1; }

    .ico-btn {
      width: 28px; height: 28px; border-radius: 6px;
      border: 1px solid var(--border); background: var(--bg3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .12s;
    }
    .ico-btn:hover { border-color: var(--border2); }

    .table-foot {
      padding: 8px 16px;
      border-top: 1px solid var(--border);
      background: var(--bg3);
      display: flex; justify-content: space-between;
      font-size: 10px; color: var(--muted);
    }

    /* Pill */
    .pill {
      display: inline-flex; align-items: center; gap: 3px;
      font-size: 9px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
      padding: 3px 8px; border-radius: 99px;
    }

    /* Reviews */
    .review-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 10px; padding: 18px 20px;
      margin-bottom: 8px; transition: all .15s;
    }
    .review-card:hover { border-color: var(--border2); }
    .review-card.flagged { border-color: rgba(255,68,68,.2); background: rgba(255,68,68,.02); }
    .review-card.flagged:hover { border-color: rgba(255,68,68,.35); }

    .avatar {
      width: 30px; height: 30px; border-radius: 6px;
      background: var(--bg4); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800; font-size: 12px; color: var(--text2);
      flex-shrink: 0;
    }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,.85);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 16px;
      animation: fadeIn .15s ease;
    }
    .modal-box {
      background: var(--bg2);
      border: 1px solid var(--border2);
      border-radius: 14px;
      width: 100%; max-width: 500px;
      max-height: 92vh; overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 40px 120px rgba(0,0,0,.9), 0 0 0 1px rgba(163,230,53,.06);
      animation: fadeUp .25s cubic-bezier(.22,.68,0,1.2);
    }
    .modal-head {
      padding: 20px 22px 16px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: flex-start; justify-content: space-between;
    }
    .modal-title {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 20px; font-weight: 800; color: var(--text);
    }
    .modal-sub { font-size: 10px; color: var(--muted); margin-top: 2px; letter-spacing: .06em; }
    .modal-body {
      padding: 20px 22px;
      overflow-y: auto; flex: 1;
      display: flex; flex-direction: column; gap: 16px;
    }
    .modal-foot {
      padding: 14px 22px;
      border-top: 1px solid var(--border);
      background: var(--bg3);
      display: flex; justify-content: flex-end; gap: 8px;
    }
    .modal-close {
      width: 28px; height: 28px; border-radius: 6px;
      border: 1px solid var(--border); background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); transition: all .12s;
    }
    .modal-close:hover { background: var(--bg3); color: var(--text); }
    .field-label {
      font-size: 9px; font-weight: 600; letter-spacing: .14em;
      text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;
    }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Toast */
    .toast {
      position: fixed; bottom: 20px; right: 20px; z-index: 99999;
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-radius: 10px;
      font-size: 12px; font-weight: 500;
      background: var(--bg2);
      border: 1px solid var(--border2);
      box-shadow: 0 20px 60px rgba(0,0,0,.8);
      animation: toastIn .25s cubic-bezier(.22,.68,0,1.2);
    }

    /* Empty */
    .empty { padding: 70px 20px; text-align: center; }
    .empty-ico {
      width: 42px; height: 42px; border-radius: 10px;
      background: var(--bg3); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px;
    }
    .empty-txt { font-size: 11px; color: var(--muted); letter-spacing: .06em; }

    .clamp1 { overflow:hidden; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; }
  `}</style>
);

// ─── Toast ─────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const map = {
    success: { icon: <CheckCircle size={14} />, color: '#A3E635' },
    error:   { icon: <AlertTriangle size={14} />, color: '#FF4444' },
    info:    { icon: <Zap size={14} />, color: '#22D3EE' },
  };
  const c = map[type] || map.info;
  return (
    <div className="toast">
      <span style={{ color: c.color }}>{c.icon}</span>
      <span style={{ color: 'var(--text2)' }}>{msg}</span>
      <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--muted)',display:'flex',marginLeft:4 }}><X size={12}/></button>
    </div>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────
const Badge = ({ type }) => {
  const map = {
    Core:     { bg:'var(--cyanbg)',   c:'var(--cyan)',  bd:'rgba(34,211,238,.18)'  },
    Elective: { bg:'var(--amberbg)',  c:'var(--amber)', bd:'rgba(245,158,11,.18)'  },
    GenEd:    { bg:'var(--limebg)',   c:'var(--lime)',  bd:'rgba(163,230,53,.18)'  },
  };
  const s = map[type] || map.Core;
  return <span className="pill" style={{ background:s.bg, color:s.c, border:`1px solid ${s.bd}` }}>{type}</span>;
};

// ─── Stars ─────────────────────────────────────────────────────────
const Stars = ({ rating, interactive = false, onChange }) => (
  <div style={{ display:'flex', gap:3 }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={12}
        fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
        color={i <= Math.round(rating) ? '#F59E0B' : '#333'}
        style={{ cursor: interactive?'pointer':'default', transition:'all .1s' }}
        onClick={() => interactive && onChange?.(i)}
      />
    ))}
  </div>
);

// ─── Field ─────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
      <label className="field-label" style={{ margin:0 }}>{label}</label>
      {hint && <span style={{ fontSize:9, color:'var(--muted)' }}>{hint}</span>}
    </div>
    {children}
  </div>
);

// ─── Course Modal ───────────────────────────────────────────────────
const CourseModal = ({ item, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.target);
    await onSave({
      uid: item?.uid, id: fd.get('code'), code: fd.get('code'),
      name: fd.get('name'), credits: parseInt(fd.get('credits')) || 3,
      year: fd.get('year'), semester: fd.get('semester'),
      category: fd.get('category'), description: fd.get('description'),
      prerequisites: fd.get('prerequisites')?.split(',').map(s=>s.trim()).filter(Boolean) || [],
    });
    setSaving(false); onClose();
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-title">{item ? 'Edit Course' : 'New Course'}</div>
            <div className="modal-sub">{item ? `EDITING · ${item.code}` : 'ADD CURRICULUM NODE'}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={13}/></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="grid2">
              <Field label="Course Code">
                <input className="modal-input" name="code" defaultValue={item?.code} required placeholder="CS101" />
              </Field>
              <Field label="Credits">
                <input className="modal-input" name="credits" type="number" defaultValue={item?.credits??3} min={1} max={6} />
              </Field>
            </div>
            <Field label="Course Name">
              <input className="modal-input" name="name" defaultValue={item?.name} required placeholder="Introduction to Computer Science" />
            </Field>
            <Field label="Description" hint="optional">
              <textarea className="modal-input" name="description" defaultValue={item?.description} rows={3} placeholder="Brief description…" style={{ resize:'vertical' }} />
            </Field>
            <div className="grid2">
              <Field label="Year">
                <select className="modal-select" name="year" defaultValue={item?.year||'Any'}>
                  {['Any','Year 1','Year 2','Year 3','Year 4'].map(y=><option key={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Semester">
                <select className="modal-select" name="semester" defaultValue={item?.semester||'Any'}>
                  {['Any','Semester 1','Semester 2','Summer'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Category">
              <select className="modal-select" name="category" defaultValue={item?.category||'Core'}>
                {['Core','Elective','GenEd'].map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Prerequisites" hint="comma-separated">
              <input className="modal-input" name="prerequisites"
                defaultValue={Array.isArray(item?.prerequisites)?item.prerequisites.join(', '):item?.prereq||''}
                placeholder="CS101, MATH101" />
            </Field>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <RefreshCw size={12} className="spin"/> : <Save size={12}/>}
              {item ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Rating Modal ───────────────────────────────────────────────────
const RatingModal = ({ review, onClose, onSave }) => {
  const [rating, setRating] = useState(review?.rating||3);
  const [saving, setSaving] = useState(false);
  const submit = async () => { setSaving(true); await onSave(review.id, rating); setSaving(false); onClose(); };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box" style={{ maxWidth:380 }}>
        <div className="modal-head">
          <div><div className="modal-title">Override Rating</div><div className="modal-sub">ADMIN ACTION</div></div>
          <button className="modal-close" onClick={onClose}><X size={13}/></button>
        </div>
        <div className="modal-body">
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, padding:14 }}>
            <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:'.1em', marginBottom:6 }}>
              {review?.courseId} · {review?.user}
            </div>
            <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.65 }}>{review?.comment}</p>
          </div>
          <Field label="New Rating">
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 12px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8 }}>
              <Stars rating={rating} interactive onChange={setRating}/>
              <span style={{ fontSize:11, color:'var(--muted)' }}>{rating} / 5</span>
            </div>
          </Field>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? <RefreshCw size={12} className="spin"/> : <Star size={12}/>}
            Apply Override
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab]                 = useState('courses');
  const [courses, setCourses]         = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('All');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [courseModal, setCourseModal] = useState({ open:false, item:null });
  const [ratingModal, setRatingModal] = useState({ open:false, review:null });
  const [toast, setToast]             = useState(null);

  const notify = (msg, type='success') => setToast({ msg, type });

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try { setCourses(await AdminService.getCourses()); }
    catch { notify('Failed to load courses','error'); }
    finally { setLoading(false); }
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try { setReviews(await AdminService.getReviews()); }
    catch { notify('Failed to load reviews','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCourses(); loadReviews(); }, [loadCourses, loadReviews]);

  const handleSaveCourse = async (data) => {
    try {
      if (data.uid) { await AdminService.updateCourse(data.uid, data); notify('Course updated'); }
      else          { await AdminService.createCourse(data); notify('Course created'); }
      loadCourses();
    } catch { notify('Save failed','error'); }
  };
  const handleDeleteCourse = async (c) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return;
    try { await AdminService.deleteCourse(c.uid||c.id); loadCourses(); notify('Deleted'); }
    catch { notify('Delete failed','error'); }
  };
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await AdminService.deleteReview(id); loadReviews(); notify('Deleted'); }
    catch { notify('Delete failed','error'); }
  };
  const handleOverrideRating = async (id, rating) => {
    try { await AdminService.overrideRating(id, rating); loadReviews(); notify('Rating overridden'); }
    catch { notify('Override failed','error'); }
  };

  const stats = {
    total:   courses.length,
    core:    courses.filter(c=>c.category==='Core').length,
    elective:courses.filter(c=>c.category==='Elective').length,
    flagged: reviews.filter(r=>r.flagged).length,
  };

  const filteredCourses = courses.filter(c => {
    const q = search.toLowerCase();
    return (c.name?.toLowerCase().includes(q)||c.code?.toLowerCase().includes(q))
      && (catFilter==='All'||c.category===catFilter);
  });

  const filteredReviews = reviews.filter(r => {
    const q = search.toLowerCase();
    return (r.comment?.toLowerCase().includes(q)||r.courseId?.includes(q)||r.user?.toLowerCase().includes(q))
      && (!flaggedOnly||r.flagged);
  });

  return (
    <>
      <GlobalStyles />
      <div className="scanline-overlay" />
      <div className="app-shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo-row">
              <div className="logo-box"><Zap size={15} color="#000" fill="#000"/></div>
              <div>
                <div className="logo-text">SURVIVOR</div>
              </div>
            </div>
            <div className="logo-sub">Admin Panel · v3.1</div>
          </div>

          <nav className="sidebar-nav">
            <button className={`nav-item ${tab==='courses'?'active':''}`}
              onClick={()=>{setTab('courses');setSearch('');}}>
              <Database size={13}/> Courses
            </button>
            <button className={`nav-item ${tab==='reviews'?'active':''}`}
              onClick={()=>{setTab('reviews');setSearch('');}}>
              <MessageSquare size={13}/> Reviews
              {stats.flagged>0 && <span className="nav-badge">{stats.flagged}</span>}
            </button>

            <div style={{ height:1, background:'var(--border)', margin:'10px 0' }}/>

            <button className="nav-item" style={{ opacity:.25, pointerEvents:'none' }}>
              <Activity size={13}/> Analytics
            </button>
            <button className="nav-item" style={{ opacity:.25, pointerEvents:'none' }}>
              <TrendingUp size={13}/> Reports
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="status-row">
              <div className="live-dot"/>
              <span>SYSTEM ONLINE</span>
              <span style={{ marginLeft:'auto', opacity:.5 }}>
                {new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}
              </span>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main-area">
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <span>Admin</span>
              <ChevronRight size={12}/>
              <strong>{tab === 'courses' ? 'Courses' : 'Reviews'}</strong>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              <button className="btn-ghost" onClick={()=>tab==='courses'?loadCourses():loadReviews()}>
                <RefreshCw size={11} className={loading?'spin':''}/> Sync
              </button>
              {tab==='courses' && (
                <button className="btn-primary" onClick={()=>setCourseModal({open:true,item:null})}>
                  <Plus size={13}/> New Course
                </button>
              )}
            </div>
          </div>

          <div className="content">
            {/* Header */}
            <div className="page-header fadeup">
              <div className="page-title">
                {tab==='courses'
                  ? <>Course <span className="accent">Database</span></>
                  : <>Review <span className="accent">Moderation</span></>}
              </div>
              <div className="page-meta">
                {tab==='courses'
                  ? `${stats.total} RECORDS LOADED · CURRICULUM MANAGEMENT`
                  : `${reviews.length} TOTAL · ${stats.flagged} FLAGGED`}
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label:'Total',    val:stats.total,    color:'var(--lime)',  bg:'var(--limebg)'  },
                { label:'Core',     val:stats.core,     color:'var(--cyan)',  bg:'var(--cyanbg)'  },
                { label:'Elective', val:stats.elective, color:'var(--amber)', bg:'var(--amberbg)' },
                { label:'Flagged',  val:stats.flagged,  color:stats.flagged>0?'var(--red)':'var(--lime)', bg:stats.flagged>0?'var(--redbg)':'var(--limebg)' },
              ].map((s,i)=>(
                <div key={i} className={`stat-card fadeup d${i+1}`}>
                  <div className="stat-card-accent-line" style={{ background:s.color, opacity:.5 }}/>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-val" style={{ color:s.color }}>{s.val}</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{
                      width:`${Math.min(s.val/Math.max(stats.total,1)*100,100)}%`,
                      background:s.color, animationDelay:`${i*.1}s`
                    }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-wrap">
                <Search className="search-icon" size={13} color="var(--muted)"/>
                <input className="input" value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder={tab==='courses'?'Search code or name…':'Search reviews…'}/>
              </div>

              {tab==='courses' && (
                <div style={{ display:'flex', gap:5 }}>
                  {['All','Core','Elective','GenEd'].map(cat=>(
                    <button key={cat} className={`chip ${catFilter===cat?'active':''}`}
                      onClick={()=>setCatFilter(cat)}>{cat}</button>
                  ))}
                </div>
              )}

              {tab==='reviews' && (
                <button className={`chip ${flaggedOnly?'active-red':''}`}
                  onClick={()=>setFlaggedOnly(!flaggedOnly)}>
                  <Flag size={9}/> {flaggedOnly?'Flagged':'All Reviews'}
                </button>
              )}
            </div>

            {/* ── COURSES TABLE ── */}
            {tab==='courses' && (
              <div className="table-wrap fadeup">
                {loading ? (
                  <div className="empty"><div className="empty-ico"><RefreshCw size={16} color="var(--muted)" className="spin"/></div><div className="empty-txt">LOADING DATA…</div></div>
                ) : filteredCourses.length===0 ? (
                  <div className="empty"><div className="empty-ico"><Database size={16} color="var(--muted)"/></div><div className="empty-txt">NO RECORDS FOUND</div></div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>{['Code','Course Name','Cr','Period','Type','Prerequisites',''].map(h=><th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((c,i)=>(
                          <tr key={c.uid||c.id||i} className="trow">
                            <td style={{ width:1 }}>
                              <span style={{ fontSize:11, color:'var(--lime)', fontWeight:500, whiteSpace:'nowrap' }}>{c.code}</span>
                            </td>
                            <td style={{ maxWidth:280 }}>
                              <div style={{ fontFamily:'Bricolage Grotesque,sans-serif', fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:2 }}>{c.name}</div>
                              {c.description && <div className="clamp1" style={{ fontSize:10, color:'var(--muted)' }}>{c.description}</div>}
                            </td>
                            <td style={{ width:1 }}>
                              <span style={{ fontSize:12, color:'var(--muted)', display:'block', textAlign:'center' }}>{c.credits}</span>
                            </td>
                            <td style={{ width:1 }}>
                              <span style={{ fontSize:10, color:'var(--muted)', whiteSpace:'nowrap' }}>
                                {c.year!=='Any'?c.year?.replace('Year ','Y'):'—'}
                                {c.semester&&c.semester!=='Any'&&c.year!=='Any'?' · '+c.semester?.replace('Semester ','S'):''}
                              </span>
                            </td>
                            <td style={{ width:1 }}><Badge type={c.category}/></td>
                            <td style={{ maxWidth:180 }}>
                              <span style={{ fontSize:10, color:'var(--muted)' }}>
                                {Array.isArray(c.prerequisites)&&c.prerequisites.length>0
                                  ? c.prerequisites.join(', ')
                                  : c.prereq || <span style={{opacity:.25}}>—</span>}
                              </span>
                            </td>
                            <td style={{ width:1 }}>
                              <div className="row-act">
                                <button className="ico-btn" onClick={()=>setCourseModal({open:true,item:c})} style={{ color:'var(--text2)' }}><Edit3 size={12}/></button>
                                <button className="ico-btn" onClick={()=>handleDeleteCourse(c)} style={{ color:'var(--red)' }}><Trash2 size={12}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="table-foot">
                      <span>{filteredCourses.length} of {courses.length} courses</span>
                      <span style={{ opacity:.4 }}>localStorage · swap to axios when backend ready</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── REVIEWS ── */}
            {tab==='reviews' && (
              <div className="fadeup">
                {loading ? (
                  <div className="empty" style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10 }}>
                    <div className="empty-ico"><RefreshCw size={16} color="var(--muted)" className="spin"/></div>
                    <div className="empty-txt">LOADING REVIEWS…</div>
                  </div>
                ) : filteredReviews.length===0 ? (
                  <div className="empty" style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10 }}>
                    <div className="empty-ico"><MessageSquare size={16} color="var(--muted)"/></div>
                    <div className="empty-txt">NO REVIEWS FOUND</div>
                  </div>
                ) : filteredReviews.map(r=>(
                  <div key={r.id} className={`review-card ${r.flagged?'flagged':''}`}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                          <div className="avatar">{r.user?.charAt(0)||'?'}</div>
                          <span style={{ fontFamily:'Bricolage Grotesque,sans-serif', fontWeight:700, fontSize:13, color:'var(--text)' }}>{r.user}</span>
                          <span style={{ fontSize:9, color:'var(--muted)', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:5, padding:'2px 7px', letterSpacing:'.08em' }}>
                            {r.courseId}
                          </span>
                          <span style={{ fontSize:9, color:'var(--muted)', opacity:.35 }}>#{r.id}</span>
                          {r.flagged && (
                            <span className="pill" style={{ background:'var(--redbg)', color:'var(--red)', border:'1px solid rgba(255,68,68,.2)', gap:3 }}>
                              <Flag size={7}/> FLAGGED
                            </span>
                          )}
                          {r.overriddenByAdmin && (
                            <span className="pill" style={{ background:'var(--amberbg)', color:'var(--amber)', border:'1px solid rgba(245,158,11,.2)', gap:3 }}>
                              <ShieldCheck size={7}/> OVERRIDE
                            </span>
                          )}
                        </div>
                        <Stars rating={r.rating}/>
                        <p style={{ marginTop:9, fontSize:12, color:'var(--text2)', lineHeight:1.7 }}>{r.comment}</p>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                        <button onClick={()=>setRatingModal({open:true,review:r})} style={{
                          display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:7,
                          border:'1px solid rgba(245,158,11,.2)', background:'var(--amberbg)',
                          color:'var(--amber)', fontSize:10, fontWeight:600, cursor:'pointer',
                          transition:'background .12s', whiteSpace:'nowrap',
                        }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(245,158,11,.16)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--amberbg)'}>
                          <Star size={11}/> Override
                        </button>
                        <button onClick={()=>handleDeleteReview(r.id)} style={{
                          display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:7,
                          border:'1px solid rgba(255,68,68,.2)', background:'var(--redbg)',
                          color:'var(--red)', fontSize:10, fontWeight:600, cursor:'pointer',
                          transition:'background .12s',
                        }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,68,68,.15)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--redbg)'}>
                          <Trash2 size={11}/> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!loading && filteredReviews.length>0 && (
                  <div style={{ fontSize:10, color:'var(--muted)', textAlign:'right', marginTop:8, opacity:.45 }}>
                    {filteredReviews.length} of {reviews.length} · {stats.flagged} flagged
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {courseModal.open && <CourseModal item={courseModal.item} onClose={()=>setCourseModal({open:false,item:null})} onSave={handleSaveCourse}/>}
        {ratingModal.open && <RatingModal review={ratingModal.review} onClose={()=>setRatingModal({open:false,review:null})} onSave={handleOverrideRating}/>}
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      </div>
    </>
  );
}