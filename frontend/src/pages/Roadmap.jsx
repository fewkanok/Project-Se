import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { CheckCircle, Lock, BookOpen, AlertCircle, Sparkles, GraduationCap, Code, GitBranch } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as trackCoursesData, tracks } from '../data/courseData';
import { useNavigate } from 'react-router-dom';

const CURRICULUM_COURSES = {
  "040613100": { code:"040613100", name:"พื้นฐานวิทยาการคอมพิวเตอร์และประเด็นทางวิชาชีพ", nameEn:"Fundamental of Computer Science and Professional Issues", credits:"3(3-0-6)", prereq:null },
  "040613201": { code:"040613201", name:"การโปรแกรมคอมพิวเตอร์ 1", nameEn:"Computer Programming I", credits:"3(2-2-5)", prereq:null },
  "040613203": { code:"040613203", name:"การโปรแกรมเชิงโครงสร้าง", nameEn:"Structured Programming", credits:"3(2-2-5)", prereq:"040613201" },
  "040613204": { code:"040613204", name:"การโปรแกรมเชิงวัตถุ", nameEn:"Object-Oriented Programming", credits:"3(2-2-5)", prereq:"040613203" },
  "040613205": { code:"040613205", name:"โครงสร้างข้อมูล", nameEn:"Data Structure", credits:"3(2-2-5)", prereq:"040613201" },
  "040613301": { code:"040613301", name:"ระบบฐานข้อมูล", nameEn:"Database System", credits:"3(2-2-5)", prereq:"040613201" },
  "040613302": { code:"040613302", name:"การวิเคราะห์และออกแบบ", nameEn:"System Analysis and Design", credits:"3(3-0-6)", prereq:"040613201" },
  "040613104": { code:"040613104", name:"คณิตศาสตร์สำหรับการคณนา", nameEn:"Mathematics for Computing", credits:"3(3-0-6)", prereq:"040203101" },
  "040613112": { code:"040613112", name:"การออกแบบวงจรดิจิทัล", nameEn:"Digital Circuit Design", credits:"3(3-0-6)", prereq:null },
  "040613701": { code:"040613701", name:"ระบบอัจฉริยะ", nameEn:"Intelligent System", credits:"3(2-2-5)", prereq:"040613205" },
  "040613702": { code:"040613702", name:"การเรียนรู้ของเครื่องคอมพิวเตอร์", nameEn:"Machine Learning", credits:"3(2-2-5)", prereq:"040613701" },
  "040613704": { code:"040613704", name:"การเรียนรู้เชิงลึก", nameEn:"Deep Learning", credits:"3(2-2-5)", prereq:"040613702" },
  "040613703": { code:"040613703", name:"การพัฒนาซอฟต์แวร์ทางปัญญาประดิษฐ์", nameEn:"AI Software Development", credits:"3(2-2-5)", prereq:"040613701" },
  "040613152": { code:"040613152", name:"การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 2", nameEn:"Selected Topics in Computer Science II", credits:"3(3-0-6)", prereq:null },
  "040613705": { code:"040613705", name:"วิศวกรรมข้อมูลขนาดใหญ่", nameEn:"Big Data Engineering", credits:"3(2-2-5)", prereq:"040613701" },
  "040613706": { code:"040613706", name:"การประมวลผลภาษาธรรมชาติ", nameEn:"Natural Language Processing", credits:"3(3-0-6)", prereq:"040613701" },
  "040613707": { code:"040613707", name:"คอมพิวเตอร์วิทัศน์", nameEn:"Computer Vision", credits:"3(2-2-5)", prereq:"040613701" },
  "040613502": { code:"040613502", name:"เครือข่ายคอมพิวเตอร์", nameEn:"Computer Network", credits:"3(2-2-5)", prereq:null },
  "040613601": { code:"040613601", name:"ความมั่นคงของระบบคอมพิวเตอร์", nameEn:"Computer System Security", credits:"3(3-0-6)", prereq:"040613100" },
  "040613504": { code:"040613504", name:"เทคโนโลยีการเชื่อมต่อระหว่างเครือข่าย", nameEn:"Inter-networking Technology", credits:"3(2-2-5)", prereq:"040613502" },
  "040613503": { code:"040613503", name:"การสื่อสารและเครือข่ายไร้สาย", nameEn:"Wireless Communication and Network", credits:"3(3-0-6)", prereq:"040613502" },
  "040613605": { code:"040613605", name:"การทดสอบเจาะระบบและการป้องกัน", nameEn:"Penetration Testing and Protection", credits:"3(2-2-5)", prereq:"040613502, 040613601" },
  "040613602": { code:"040613602", name:"ความมั่นคงของเครือข่าย", nameEn:"Network Security", credits:"3(2-2-5)", prereq:"040613502, 040613601" },
  "040613604": { code:"040613604", name:"นิติวิทยาศาสตร์ดิจิทัล", nameEn:"Digital Forensics", credits:"3(2-2-5)", prereq:"040613502, 040613601" },
  "040613603": { code:"040613603", name:"การโปรแกรมเชิงป้องกัน", nameEn:"Defensive Programming", credits:"3(2-2-5)", prereq:"040613203, 040613601" },
  "040613505": { code:"040613505", name:"เครื่องมือยูนิกซ์", nameEn:"UNIX Tool", credits:"3(2-2-5)", prereq:"040613100" },
  "040613506": { code:"040613506", name:"การบริหารยูนิกซ์", nameEn:"UNIX Administration", credits:"3(2-2-5)", prereq:"040613505" },
  "040613801": { code:"040613801", name:"คอมพิวเตอร์กราฟิกส์", nameEn:"Computer Graphics", credits:"3(2-2-5)", prereq:"040613104, 040613201" },
  "040613802": { code:"040613802", name:"การออกแบบเกมคอมพิวเตอร์", nameEn:"Computer Game Design", credits:"3(2-2-5)", prereq:"040613201" },
  "040613804": { code:"040613804", name:"การสร้างแบบจำลองสามมิติ", nameEn:"3D Modeling", credits:"3(2-2-5)", prereq:"040613104" },
  "040613805": { code:"040613805", name:"ภาพเคลื่อนไหวคอมพิวเตอร์", nameEn:"Computer Animation", credits:"3(2-2-5)", prereq:"040613801" },
  "040613806": { code:"040613806", name:"การให้แสงและเงา", nameEn:"Lighting and Shading", credits:"3(2-2-5)", prereq:"040613801" },
  "040613803": { code:"040613803", name:"ความเป็นจริงเสมือนและความเป็นจริงเสริม", nameEn:"Virtual Reality and Augmented Reality", credits:"3(2-2-5)", prereq:"040613201" },
  "040613901": { code:"040613901", name:"การออกแบบระบบฝังตัว", nameEn:"Embedded System Design", credits:"3(3-0-6)", prereq:"040613112" },
  "040613902": { code:"040613902", name:"อินเทอร์เน็ตของสรรพสิ่ง", nameEn:"Internet of Things", credits:"3(2-2-5)", prereq:"040613201" },
  "040613904": { code:"040613904", name:"วิทยาการหุ่นยนต์และการควบคุม", nameEn:"Robotic Science and Control System", credits:"3(2-2-5)", prereq:"040613901" },
  "040613903": { code:"040613903", name:"เทคโนโลยีสารสนเทศภูมิศาสตร์สำหรับเมืองอัจฉริยะ", nameEn:"Geospatial Information Technology for Smart City", credits:"3(3-0-6)", prereq:"040613301" },
  "040613153": { code:"040613153", name:"การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 3", nameEn:"Selected Topics in Computer Science III", credits:"3(3-0-6)", prereq:null },
  "040613905": { code:"040613905", name:"ห่วงโซ่บล็อก", nameEn:"Blockchain", credits:"3(3-0-6)", prereq:null },
  "040613411": { code:"040613411", name:"การพัฒนาเว็บ", nameEn:"Web Development", credits:"3(2-2-5)", prereq:"040613201" },
  "040613412": { code:"040613412", name:"เว็บเฟรมเวิร์ค", nameEn:"Web Framework", credits:"3(2-2-5)", prereq:"040613411" },
  "040613421": { code:"040613421", name:"การพัฒนาโปรแกรมประยุกต์เคลื่อนที่", nameEn:"Mobile Application Development", credits:"3(2-2-5)", prereq:"040613204" },
  "040613521": { code:"040613521", name:"การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 1", nameEn:"Selected Topics in Computer Science I", credits:"3(3-0-6)", prereq:null },
  "040613207": { code:"040613207", name:"หลักภาษาโปรแกรม", nameEn:"Principle of Programming Language", credits:"3(2-2-5)", prereq:"040613203" },
  "040613307": { code:"040613307", name:"การทดสอบซอฟต์แวร์", nameEn:"Software Testing", credits:"3(3-0-6)", prereq:"040613302" },
  "040613305": { code:"040613305", name:"สถาปัตยกรรมซอฟต์แวร์", nameEn:"Software Architecture", credits:"3(3-0-6)", prereq:"040613302" },
  "040613308": { code:"040613308", name:"วิศวกรรมความต้องการ", nameEn:"Requirements Engineering", credits:"3(3-0-6)", prereq:"040613302" },
  "040613111": { code:"040613111", name:"ดิจิทัลและระบบตรรกะ", nameEn:"Digital and Logic Systems", credits:"3(3-0-6)", prereq: null},
  "040613304": { code:"040613304", name:"การบริหารโครงการ", nameEn:"Project Management", credits:"3(3-0-6)", prereq:"040613201" },
};

const CURRICULUM_TRACKS = [
  {
    id: "ai", label: "AI Track", color: "#7c3aed", icon: "🧠",
    chains: [
      ["040613205", "arrow", "040613701", "arrow", "040613702", "arrow", "040613704"],
      ["040613701*", "arrow", "040613703", "arrow", "040613152"],
      ["040613701*", "arrow", "040613705"],
      ["040613701*", "arrow", "040613706"],
      ["040613701*", "arrow", "040613707"],
    ],
  },
  {
    id: "net", label: "Security & Network", color: "#0891b2", icon: "🔐",
    chains: [
      ["040613100", "arrow", "040613601"],
      ["040613100*", "arrow", "040613502", "arrow", "040613504"],
      ["040613502*", "arrow", "040613503"],
      ["040613601*", "arrow", "040613605"],
      ["040613601*", "arrow", "040613602"],
      ["040613601*", "arrow", "040613604"],
      ["040613203", "arrow", "040613603"],
      ["040613100*", "arrow", "040613505", "arrow", "040613506"],
    ],
  },
  {
    id: "game", label: "Game & Graphic", color: "#d97706", icon: "🎮",
    chains: [
      ["040613104", "arrow", "040613801", "arrow", "040613805"],
      ["040613801*", "arrow", "040613806"],
      ["040613104*", "arrow", "040613804"],
      ["040613201", "arrow", "040613802"],
      ["040613201*", "arrow", "040613803"],
    ],
  },
  {
    id: "iot", label: "IoT & Robot", color: "#059669", icon: "🤖",
    chains: [
      ["040613112", "arrow", "040613901", "arrow", "040613904"],
      ["040613201", "arrow", "040613902"],
      ["040613301", "arrow", "040613903"],
      ["040613153"],
      ["040613905"],
    ],
  },
  {
    id: "fs", label: "Full-Stack", color: "#db2777", icon: "🌐",
    chains: [
      ["040613201", "arrow", "040613411", "arrow", "040613412"],
      ["040613204", "arrow", "040613421", "arrow", "040613521"],
    ],
  },
  {
    id: "Outside", label: "Outside of Track", color: "#db2777", icon: "🌐",
    chains: [
      ["040613201", "arrow", "040613302", "arrow", ["040613304", "040613305", "040613307", "040613308"]],
      ["040613201", "arrow", "040613203", "arrow", "040613203", "arrow", "040613207"],
      ["040613111"],
    ],
  },
];

const CURRICULUM_NODE_TYPE_MAP = {
  ai:   { "040613205":"base","040613701":"ai-major","040613702":"ai-major","040613704":"ai","040613703":"ai","040613152":"ai","040613705":"ai","040613706":"ai","040613707":"ai" },
  net:  { "040613100":"base","040613502":"net-major","040613601":"net-major","040613504":"net","040613503":"net","040613605":"net","040613602":"net","040613604":"net","040613603":"net","040613203":"base","040613505":"net","040613506":"net" },
  game: { "040613104":"base","040613201":"base","040613801":"game-major","040613802":"game-major","040613804":"game","040613805":"game","040613806":"game","040613803":"game" },
  iot:  { "040613112":"base","040613201":"base","040613301":"base","040613901":"iot-major","040613902":"iot-major","040613904":"iot","040613903":"iot","040613153":"iot","040613905":"iot" },
  fs:   { "040613201":"base","040613204":"base","040613411":"fs-major","040613412":"fs","040613421":"fs-major","040613521":"fs" },
};

const CM_TREES = [
  {
    id:"fs", label:"Full-Stack Track", icon:"🌐", color:"#db2777",
    gradient:"from-pink-600 to-rose-600", shadow:"shadow-pink-500/50", activeBg:"from-pink-900/60 to-rose-900/40",
    roots:[
      { code:"040613201", t:"base", children:[
        { code:"040613411", t:"minor", children:[
          { code:"040613412", t:"minor", children:[] },
        ]},
      ]},
      { code:"040613204", t:"base", children:[
        { code:"040613421", t:"minor", children:[] },
      ]},
      { code:"040613521", t:"major", children:[] },
    ]
  },
  {
    id:"net", label:"Security & Network Track", icon:"🔐", color:"#0891b2",
    gradient:"from-cyan-600 to-sky-600", shadow:"shadow-cyan-500/50", activeBg:"from-cyan-900/60 to-sky-900/40",
    roots:[
      { code:"040613100", t:"base", children:[
        { code:"040613502", t:"base", children:[
          { code:"040613504", t:"minor", children:[] },
          { code:"040613503", t:"free",  children:[] },
        ]},
        { code:"040613601", t:"base", children:[
          { code:"040613605", t:"major", children:[] },
          { code:"040613602", t:"minor", children:[] },
          { code:"040613604", t:"major", children:[] },
        ]},
        { code:"040613203", t:"base", children:[
          { code:"040613603", t:"major", children:[] },
        ]},
        { code:"040613505", t:"minor", children:[
          { code:"040613506", t:"free",  children:[] },
        ]},
      ]},
    ]
  },
  {
    id:"game", label:"Game & Graphic Track", icon:"🎮", color:"#d97706",
    gradient:"from-amber-600 to-orange-600", shadow:"shadow-amber-500/50", activeBg:"from-amber-900/60 to-orange-900/40",
    roots:[
      { code:"040613104", t:"base", children:[
        { code:"040613804", t:"major", children:[] },
        { code:"040613801", t:"minor", children:[
          { code:"040613805", t:"major", children:[] },
          { code:"040613806", t:"major", children:[] },
        ]},
      ]},
      { code:"040613201", t:"base", children:[
        { code:"040613801", t:"minor", children:[] },  
        { code:"040613802", t:"minor", children:[] },
        { code:"040613803", t:"major", children:[] },
      ]},
    ]
  },
  {
    id:"iot", label:"IoT & Robot Track", icon:"🤖", color:"#059669",
    gradient:"from-emerald-600 to-green-600", shadow:"shadow-emerald-500/50", activeBg:"from-emerald-900/60 to-green-900/40",
    roots:[
      { code:"040613112", t:"base", children:[
        { code:"040613901", t:"minor", children:[
          { code:"040613904", t:"major", children:[] },
        ]},
      ]},
      { code:"040613201", t:"base", children:[
        { code:"040613902", t:"minor", children:[] },
      ]},
      { code:"040613301", t:"base", children:[
        { code:"040613903", t:"major", children:[] },
      ]},
      { code:"040613153", t:"major", children:[] },
      { code:"040613905", t:"major", children:[] },
    ]
  },
  {
    id:"ai", label:"AI Track", icon:"🧠", color:"#7c3aed",
    gradient:"from-violet-600 to-purple-600", shadow:"shadow-violet-500/50", activeBg:"from-violet-900/60 to-purple-900/40",
    roots:[
      { code:"040613205", t:"base", children:[
        { code:"040613701", t:"base", children:[
          { code:"040613702", t:"minor", children:[
            { code:"040613704", t:"major", children:[] },
          ]},
          { code:"040613703", t:"minor", children:[] },
          { code:"040613705", t:"major", children:[] },
          { code:"040613706", t:"major", children:[] },
          { code:"040613707", t:"major", children:[] },
        ]},
      ]},
      { code:"040613152", t:"major", children:[] },
    ]
  },
  {
    id:"outside", label:"Outside of Track", icon:"🌐", color:"#7c3aed",
    gradient:"from-violet-600 to-purple-600", shadow:"shadow-violet-500/50", activeBg:"from-violet-900/60 to-purple-900/40",
    roots:[
      { code:"040613201", t:"base", children:[
        { code:"040613302", t:"base", children:[
          { code:"040613304", t:"major", children:[] },
          { code:"040613305", t:"major", children:[] },
          { code:"040613307", t:"major", children:[] },
          { code:"040613308", t:"major", children:[] },
        ]},
      ]},
      { code:"040613111", t:"major", children:[] },
    ]
  },
];

const CM_NODE_COLORS = {
  base:  { border:"2px solid #22c55e", bg:"rgba(20,83,45,0.55)",  nameColor:"#ffffff", codeColor:"#86efac" },
  minor: { border:"2px solid #60a5fa", bg:"rgba(30,58,138,0.55)", nameColor:"#ffffff", codeColor:"#93c5fd" },
  major: { border:"2px solid #f87171", bg:"rgba(127,29,29,0.45)", nameColor:"#ffffff", codeColor:"#fca5a5" },
  free:  { border:"2px solid #64748b", bg:"rgba(30,41,59,0.45)",  nameColor:"#e2e8f0", codeColor:"#94a3b8" },
};

function CMNodeBox({ code, t, onHover, onLeave, courseStates, navigate }) {
  const course = CURRICULUM_COURSES[code];
  const [hov, setHov] = useState(false);
  const c = CM_NODE_COLORS[t] || CM_NODE_COLORS.free;

  const handleEnter = useCallback((e) => { setHov(true);  onHover?.(e, code); }, [code, onHover]);
  const handleLeave = useCallback(()    => { setHov(false); onLeave?.();       }, [onLeave]);
  const handleClick = useCallback(() => { if (navigate && code) navigate(`/course/${code}`); }, [navigate, code]);

  const courseState = courseStates?.[code];
  const isPassed    = courseState === 'passed';
  const prereqCode      = course?.prereq;
  const prereqSatisfied = !prereqCode || prereqCode.split(',').map(s => s.trim()).every(p => courseStates?.[p] === 'passed');
  const isLearning  = courseState === 'learning' && prereqSatisfied;
  const isLocked    = courseState === 'learning' && !prereqSatisfied;

  let borderStyle = c.border;
  let bgStyle     = c.bg;
  if (isPassed)   { borderStyle = "2px solid #10b981"; bgStyle = "rgba(6,78,59,0.75)"; }
  if (isLearning) { borderStyle = "2px solid #60a5fa"; bgStyle = "rgba(23,37,84,0.75)"; }
  if (isLocked)   { borderStyle = "2px solid #ef4444"; bgStyle = "rgba(69,10,10,0.65)"; }

  const glowMap = { base:"rgba(34,197,94,", minor:"rgba(96,165,250,", major:"rgba(248,113,113,", free:"rgba(100,116,139," };
  const glowColor = isPassed ? "rgba(16,185,129," : isLearning ? "rgba(96,165,250," : isLocked ? "rgba(239,68,68," : (glowMap[t] || "rgba(148,163,184,");

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{
        border:      hov ? `1.5px solid ${glowColor}0.9)` : borderStyle,
        background: bgStyle,
        transform:  hov ? "translateY(-3px) scale(1.04)" : "none",
        boxShadow:  isPassed
          ? `0 0 0 1px rgba(16,185,129,0.3), 0 4px 20px rgba(16,185,129,0.25)`
          : isLearning
          ? `0 0 0 1px rgba(96,165,250,0.3), 0 4px 20px rgba(96,165,250,0.2)`
          : hov
          ? `0 0 0 1px ${glowColor}0.4), 0 8px 28px ${glowColor}0.3), 0 2px 8px rgba(0,0,0,0.6)`
          : "0 2px 8px rgba(0,0,0,0.3)",
        transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        flexShrink: 0,
        width:      "220px",
        cursor:     "pointer",
        userSelect: "none",
        borderRadius: "12px",
        padding:    "12px 14px 10px",
        backdropFilter: "blur(12px)",
        position:   "relative",
        height:     "100%",
        boxSizing:  "border-box",
        display:    "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {isPassed && (
        <div style={{ position:"absolute", top:6, right:6, background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:999, padding:"2px 7px", fontSize:"0.58rem", fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap:3, boxShadow:"0 2px 8px rgba(16,185,129,0.5)" }}>
          ✓ ผ่าน
        </div>
      )}
      {isLearning && !isPassed && (
        <div style={{ position:"absolute", top:6, right:6, background:"linear-gradient(135deg,#1d4ed8,#2563eb)", borderRadius:999, padding:"2px 7px", fontSize:"0.58rem", fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap:3, boxShadow:"0 2px 8px rgba(37,99,235,0.5)" }}>
          📖 เรียน
        </div>
      )}
      {isLocked && (
        <div style={{ position:"absolute", top:6, right:6, background:"linear-gradient(135deg,#991b1b,#ef4444)", borderRadius:999, padding:"2px 7px", fontSize:"0.58rem", fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap:3, boxShadow:"0 2px 8px rgba(239,68,68,0.5)" }}>
          🔒 ลงไม่ได้
        </div>
      )}

      <div style={{ color: c.nameColor, fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.4, marginBottom: 4, paddingRight: (isPassed || isLearning || isLocked) ? 48 : 4, letterSpacing: "0.01em", wordBreak: "break-word" }}>
        {course?.nameEn || code}
      </div>
      <div style={{ color: c.codeColor, fontSize: "0.65rem", fontFamily: "monospace", opacity: 0.75, letterSpacing: "0.05em" }}>
        {code}
      </div>

      {hov && (
        <div style={{ position:"absolute", bottom:6, right:8, fontSize:"0.55rem", color: glowColor + "0.8)", fontWeight:700, letterSpacing:"0.05em" }}>
          ดูรายละเอียด →
        </div>
      )}
    </div>
  );
}

const NODE_W = 220;
const NODE_H = 80;
const COL_GAP = 130;  
const ROW_GAP = 52;   

function computeTreeLayout(roots) {
  const posMap = {}; 
  const seen   = new Set();

  function leafCount(node) {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((s, c) => s + leafCount(c), 0);
  }

  function assignPos(node, col, slotStart) {
    if (seen.has(node.code)) return;
    seen.add(node.code);

    const myLeaves = leafCount(node);
    const centerSlot = slotStart + (myLeaves - 1) / 2;
    const x = col * (NODE_W + COL_GAP) + NODE_W / 2;
    const y = centerSlot * (NODE_H + ROW_GAP) + NODE_H / 2;
    posMap[node.code] = { x, y, t: node.t };

    let childSlot = slotStart;
    (node.children || []).forEach(child => {
      assignPos(child, col + 1, childSlot);
      childSlot += leafCount(child);
    });
  }

  let slotCursor = 0;
  roots.forEach((root, i) => {
    assignPos(root, 0, slotCursor);
    slotCursor += leafCount(root);
    if (i < roots.length - 1) slotCursor += 0.7; 
  });

  return posMap;
}

function collectEdges(roots) {
  const edges   = [];
  const visited = new Set();
  function walk(node) {
    (node.children || []).forEach(child => {
      edges.push({ from: node.code, to: child.code });
      if (!visited.has(child.code)) {
        visited.add(child.code);
        walk(child);
      }
    });
  }
  roots.forEach(r => { visited.add(r.code); walk(r); });
  return edges;
}

function CMTrackBody({ track, onHover, onLeave, courseStates, navigate }) {
  const posMap = useMemo(() => computeTreeLayout(track.roots), [track.roots]);
  const edges  = useMemo(() => collectEdges(track.roots),      [track.roots]);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const positions = Object.values(posMap);
  const maxX    = Math.max(...positions.map(p => p.x)) + NODE_W / 2;
  const maxY    = Math.max(...positions.map(p => p.y)) + NODE_H / 2;
  const canvasW = maxX + 28;
  const canvasH = maxY + 28;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 56; 
      setScale(available < canvasW ? available / canvasW : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasW]);

  function buildPath(fromCode, toCode) {
    const f = posMap[fromCode];
    const t = posMap[toCode];
    if (!f || !t) return "";
    const fx = f.x + NODE_W / 2;
    const fy = f.y;
    const tx = t.x - NODE_W / 2;
    const ty = t.y;
    const mx = fx + COL_GAP / 2;
    return `M ${fx} ${fy} L ${mx} ${fy} L ${mx} ${ty} L ${tx} ${ty}`;
  }

  return (
    <div ref={containerRef} style={{ position:"relative", overflow:"hidden", padding:"20px 28px" }}>
      <div style={{ position:"relative", width:"100%", height: canvasH * scale }}>
        <div style={{
          position:"absolute", top:0, left:0,
          width: canvasW, height: canvasH,
          transformOrigin:"top left",
          transform: `scale(${scale})`,
        }}>
        <svg
          style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", overflow:"visible", pointerEvents:"none" }}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
        >
          <defs>
            <marker id={`arrow-default-${track.id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 Z" fill="rgba(255,255,255,0.45)" />
            </marker>
            <marker id={`arrow-passed-${track.id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 Z" fill="#10b981" />
            </marker>
            <marker id={`arrow-learning-${track.id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 Z" fill="#60a5fa" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const fromState = courseStates?.[e.from];
            const isPassed   = fromState === 'passed';
            const isLearning = fromState === 'learning';
            const stroke = isPassed
              ? '#10b981'
              : isLearning
              ? '#60a5fa'
              : 'rgba(255,255,255,0.3)';
            const markerId = isPassed
              ? `arrow-passed-${track.id}`
              : isLearning
              ? `arrow-learning-${track.id}`
              : `arrow-default-${track.id}`;
            const opacity = isPassed ? 1 : isLearning ? 0.9 : 0.5;
            return (
              <path
                key={i}
                d={buildPath(e.from, e.to)}
                fill="none"
                stroke={stroke}
                strokeWidth={isPassed ? 2.5 : isLearning ? 2 : 1.5}
                strokeDasharray={(!isPassed && !isLearning) ? "6 4" : undefined}
                opacity={opacity}
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
        </svg>
        {Object.entries(posMap).map(([code, pos]) => (
          <div
            key={code}
            style={{
              position: "absolute",
              left: pos.x - NODE_W / 2,
              top:  pos.y - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
            }}
          >
            <CMNodeBox
              code={code}
              t={pos.t}
              onHover={onHover}
              onLeave={onLeave}
              courseStates={courseStates}
              navigate={navigate}
            />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function CMTrackSection({ track, onHover, onLeave, courseStates, navigate }) {
  const countNodes = (roots) => {
    const seen = new Set();
    const walk = (n) => {
      if (seen.has(n.code)) return 0;
      seen.add(n.code);
      return 1 + (n.children || []).reduce((s, c) => s + walk(c), 0);
    };
    return roots.reduce((s, r) => s + walk(r), 0);
  };

  const countPassed = (roots) => {
    const seen = new Set();
    const walk = (n) => {
      if (seen.has(n.code)) return 0;
      seen.add(n.code);
      const self = courseStates?.[n.code] === 'passed' ? 1 : 0;
      return self + (n.children || []).reduce((s, c) => s + walk(c), 0);
    };
    return roots.reduce((s, r) => s + walk(r), 0);
  };

  const total  = countNodes(track.roots);
  const passed = countPassed(track.roots);
  const pct    = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div style={{
      background: "rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: `0 0 0 0px ${track.color}`,
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${track.color}22 0%, rgba(0,0,0,0) 60%)`,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{ width: 3, height: 32, borderRadius: 99, background: `linear-gradient(to bottom, ${track.color}, ${track.color}44)`, flexShrink: 0 }} />
        <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{track.icon}</span>
        <h3 style={{ fontWeight: 900, color: "#fff", fontSize: "1rem", letterSpacing: "0.01em", margin: 0 }}>{track.label}</h3>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99, padding: "5px 14px" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#10b981" }}>{passed}/{total}</span>
          <div style={{ width: 56, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${track.color}, ${track.color}cc)`, borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
        </div>
      </div>
      <CMTrackBody track={track} onHover={onHover} onLeave={onLeave} courseStates={courseStates} navigate={navigate} />
    </div>
  );
}

function CMTooltip({ course, courseState, position, visible }) {
  if (!course) return null;
  const isPassed   = courseState === 'passed';
  const isLearning = courseState === 'learning';
  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: position.x, top: position.y, opacity: visible ? 1 : 0, transition: "opacity 0.12s ease", transform: visible ? "translateY(0)" : "translateY(4px)" }}
    >
      <div style={{
        background: "rgba(10,10,20,0.97)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "14px 16px",
        maxWidth: 270,
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontFamily:"monospace", fontSize:"0.6rem", color:"#6366f1", marginBottom:4, letterSpacing:"0.08em" }}>{course.code}</div>
        <div style={{ fontWeight:900, color:"#fff", fontSize:"0.88rem", lineHeight:1.35, marginBottom:3 }}>{course.nameEn || course.name}</div>
        <div style={{ fontSize:"0.68rem", color:"#94a3b8", marginBottom:10, lineHeight:1.4 }}>{course.nameEn ? course.name : ""}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, flexWrap:"wrap" }}>
          <span style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc", fontFamily:"monospace", fontSize:"0.62rem", padding:"2px 10px", borderRadius:999, fontWeight:700 }}>
            {course.credits}
          </span>
          {isPassed && <span style={{ background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:999, padding:"2px 10px", fontSize:"0.62rem", fontWeight:800, color:"#fff" }}>✓ ผ่านแล้ว</span>}
          {isLearning && !isPassed && <span style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)", borderRadius:999, padding:"2px 10px", fontSize:"0.62rem", fontWeight:800, color:"#fff" }}>📖 กำลังเรียน</span>}
          {!isPassed && !isLearning && <span style={{ background:"rgba(51,65,85,0.8)", borderRadius:999, padding:"2px 10px", fontSize:"0.62rem", fontWeight:700, color:"#64748b" }}>ยังไม่ได้ลง</span>}
        </div>
        <div style={{ fontSize:"0.65rem", color:"#64748b", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ color:"#94a3b8", fontWeight:700 }}>Prereq:</span>
          <span style={{ fontFamily:"monospace", color: course.prereq ? "#f59e0b" : "#475569" }}>{course.prereq || "ไม่มี"}</span>
        </div>
        <div style={{ marginTop:10, paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.06)", fontSize:"0.6rem", color:"rgba(99,102,241,0.7)", fontWeight:700, letterSpacing:"0.05em" }}>
          คลิกเพื่อดูรายละเอียด →
        </div>
      </div>
    </div>
  );
}

function CurriculumMapTab() {
  const navigate = useNavigate();
  const [activeCMTrack, setActiveCMTrack] = useState("all");
  const [tooltip, setTooltip]               = useState({ visible:false, course:null, x:0, y:0 });
  const tooltipTimeoutRef                   = useRef(null);

  const courseStates = useMemo(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const rawStates = parsed.courseStates || {};
      const peAssignments = parsed.peAssignments || {};
      const peSlotIds = new Set(
        roadmapData.flatMap(y => y.semesters.flatMap(s =>
          s.courses.filter(c => c.isProfessionalElective).map(c => c.id)
        ))
      );
      const assignedCodes = new Set(Object.values(peAssignments).filter(Boolean));
      const allTrackIds = new Set(Object.keys(trackCoursesData));
      const roadmapNonPeIds = new Set(
        roadmapData.flatMap(y => y.semesters.flatMap(s =>
          s.courses.filter(c => !c.isProfessionalElective).map(c => c.id)
        ))
      );
      const adjusted = {};
      Object.entries(rawStates).forEach(([id, state]) => {
        if (peSlotIds.has(id) && !assignedCodes.has(id)) return;
        if (allTrackIds.has(id) && !roadmapNonPeIds.has(id) && !assignedCodes.has(id)) return;
        adjusted[id] = state;
      });
      return adjusted;
    } catch { return {}; }
  }, []);

  const handleHover = useCallback((e, code) => {
    clearTimeout(tooltipTimeoutRef.current);
    const course = CURRICULUM_COURSES[code];
    if (!course) return;
    let x = e.clientX + 14;
    let y = e.clientY + 14;
    if (x + 300 > window.innerWidth)  x = e.clientX - 310;
    if (y + 180 > window.innerHeight) y = e.clientY - 190;
    const state = courseStates[code];
    setTooltip({ visible:true, course, courseState: state, x, y });
  }, [courseStates]);

  const handleLeave = useCallback(() => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible:false }));
    }, 80);
  }, []);

  const visibleTrees = activeCMTrack === "all"
    ? CM_TREES
    : CM_TREES.filter(t => t.id === activeCMTrack);

  return (
    <div className="text-white">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {[
            { id:"all",   icon:"⚡", label:"All",                 color:"#94a3b8" },
            { id:"ai",   icon:"🧠", label:"AI",                  color:"#7c3aed" },
            { id:"fs",   icon:"🌐", label:"Full-Stack",          color:"#db2777" },
            { id:"net",  icon:"🔐", label:"Security & Network", color:"#0891b2" },
            { id:"game", icon:"🎮", label:"Game & Graphic",      color:"#d97706" },
            { id:"iot",  icon:"🤖", label:"IoT & Robot",         color:"#059669" },
            { id:"outside",  icon:"🌐", label:"Outside of Track",        color:"#FEE12B" },
          ].map(t => {
            const active = activeCMTrack === t.id;
            const countNodes = (roots) => {
              const seen = new Set();
              const walk = (n) => { if(seen.has(n.code))return; seen.add(n.code); (n.children||[]).forEach(walk); };
              (roots||[]).forEach(walk); return seen.size;
            };
            const count = t.id === "all"
              ? CM_TREES.reduce((s,tr) => s + countNodes(tr.roots), 0)
              : countNodes(CM_TREES.find(tr => tr.id === t.id)?.roots);
            return (
              <button
                key={t.id}
                onClick={() => setActiveCMTrack(t.id)}
                style={active && t.color ? {
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
                  boxShadow: `0 4px 20px ${t.color}55`,
                  border: '1px solid rgba(255,255,255,0.25)',
                  transform: 'scale(1.05)',
                } : active ? {
                  background: 'linear-gradient(135deg,#475569,#334155)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)',
                } : {
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 text-white hover:scale-105"
              >
                <span>{t.icon}</span>
                <span className="whitespace-nowrap">{t.label}</span>
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  borderRadius:'999px', padding:'1px 7px', fontSize:'0.68rem', fontWeight:800,
                }}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 py-2">
          {[
            { color:"#22c55e", label:"Base Subject" },
            { color:"#60a5fa", label:"Major" },
            { color:"#f87171", label:"Minor" },
            { color:"#64748b", label:"Up to you" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div style={{ width:18, height:18, borderRadius:5, border:`2.5px solid ${color}`, background:`${color}35` }} />
              <span style={{ color: color, fontSize:'1rem', fontWeight:800 }}>{label}</span>
            </div>
          ))}
          <div style={{ width:1, height:28, background:'rgba(255,255,255,0.15)' }} />
          <div style={{ background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:999, padding:"5px 16px", fontSize:"0.9rem", fontWeight:800, color:"#fff" }}>✓ ผ่าน</div>
          <div style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)", borderRadius:999, padding:"5px 16px", fontSize:"0.9rem", fontWeight:800, color:"#fff" }}>📖 เรียนอยู่</div>
          <span className="text-slate-500 italic text-xs">คลิกที่วิชาเพื่อดูรายละเอียด</span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {visibleTrees.map(track => (
          <CMTrackSection key={track.id} track={track} onHover={handleHover} onLeave={handleLeave} courseStates={courseStates} navigate={navigate} />
        ))}
      </div>
      <CMTooltip course={tooltip.course} courseState={tooltip.courseState} position={{ x:tooltip.x, y:tooltip.y }} visible={tooltip.visible} />
    </div>
  );
}

const ElectiveCard = ({ elective, profile, navigate, getElectiveStatusClass }) => (
  <div
    onClick={() => navigate(`/course/${elective.id}`)}
    className={getElectiveStatusClass(elective.status)}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs font-bold font-mono tracking-wider text-white/90 bg-black/60 px-3 py-1.5 rounded-lg border border-white/20 shadow-md">
        {elective.code}
      </span>
      {elective.status === 'passed' && <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" />}
      {elective.status === 'active' && <BookOpen size={22} className="text-blue-300 animate-pulse drop-shadow-[0_0_10px_rgba(147,197,253,1)]" />}
      {elective.status === 'available' && <Sparkles size={20} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-lg text-white leading-tight mb-2 group-hover:text-orange-200 transition-colors line-clamp-2">
        {elective.nameEn || elective.name}
      </h4>
      {elective.nameEn && <p className="text-xs text-slate-500 mb-2 leading-tight line-clamp-1">{elective.name}</p>}
      <div className="flex items-center gap-2 text-sm">
        <span className="bg-black/40 px-3 py-1 rounded-md text-white/90 font-bold border border-white/10">
          {elective.credits} Credits
        </span>
        {elective.prereq && (
          <span className="text-xs bg-slate-700/60 px-2.5 py-1 rounded-md border border-slate-600 text-slate-200 font-medium">
            Req: {elective.prereq}
          </span>
        )}
      </div>
    </div>
    {Object.values(profile.customElectives || {}).some(electives =>
      Array.isArray(electives) && electives.includes(elective.id)
    ) && (
      <div className="absolute top-3 right-3">
        <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold shadow-lg shadow-orange-500/50">SELECTED</span>
      </div>
    )}
  </div>
);

const Roadmap = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('core'); 
  const [activeElectiveCategory, setActiveElectiveCategory] = useState('all');
  const [activeYear, setActiveYear] = useState(1);
  const navigate = useNavigate();

  const [profile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (!saved) return {
      passedCourses: [], learningCourses: [], courseStates: {},
      customElectives: {}, customTrackCourses: {}, peAssignments: {}, currentYear: 1, currentTerm: 1
    };
    const parsed = JSON.parse(saved);
    const peSlotIds = new Set(
      roadmapData.flatMap(y => y.semesters.flatMap(s =>
        s.courses.filter(c => c.isProfessionalElective).map(c => c.id)
      ))
    );
    const assignedCodes = new Set(Object.values(parsed.peAssignments || {}).filter(Boolean));
    const allTrackCourseIds = new Set(Object.keys(trackCoursesData));
    const roadmapNonPeIds = new Set(
      roadmapData.flatMap(y => y.semesters.flatMap(s =>
        s.courses.filter(c => !c.isProfessionalElective).map(c => c.id)
      ))
    );
    const step1 = {};
    Object.entries(parsed.courseStates || {}).forEach(([id, state]) => {
      if (peSlotIds.has(id) && !assignedCodes.has(id)) return;
      if (allTrackCourseIds.has(id) && !roadmapNonPeIds.has(id) && !assignedCodes.has(id)) return;
      step1[id] = state;
    });

    return { ...parsed, courseStates: step1 };
  });

  const processedRoadmap = useMemo(() => {
    return roadmapData.map((yearGroup) => {
      const yearNum = parseInt(yearGroup.year.replace('Year ', ''));
      return {
        ...yearGroup,
        semesters: yearGroup.semesters.map((sem, sIdx) => {
          const termNum = sIdx + 1;
          return {
            ...sem,
            courses: sem.courses.map(course => {
              const curYear = parseInt(profile.basicInfo?.currentYear || profile.currentYear) || 1;
              const curTerm = parseInt(profile.basicInfo?.currentTerm || profile.currentTerm) || 1;
              let status = 'locked';
              const courseState = profile.courseStates?.[course.id];
              if (courseState === 'passed') status = 'passed';
              else if (courseState === 'learning') status = 'active';
              else if (curYear === yearNum && curTerm === termNum) status = 'available';
              else if (curYear > yearNum || (curYear === yearNum && curTerm > termNum)) status = 'missed';
              if (course.prereq) {
                const prereqPassed = profile.courseStates?.[course.prereq] === 'passed';
                if (!prereqPassed && status === 'locked') status = 'locked';
              }
              return { ...course, status };
            })
          };
        })
      };
    });
  }, [profile]);

  const visibleRoadmap = processedRoadmap.filter(y => y.year !== 'Track Courses');

  const processedElectives = useMemo(() => {
    return electiveCourses.map(elective => {
      let status = 'available';
      const courseState = profile.courseStates?.[elective.id];
      if (courseState === 'passed') status = 'passed';
      else if (courseState === 'learning') status = 'active';
      return { ...elective, status };
    });
  }, [profile]);

  const processedTrackCourses = useMemo(() => {
    const result = [];
    const customTrackCourses = profile.customTrackCourses || {};
    Object.entries(customTrackCourses).forEach(([termKey, courseIds]) => {
      if (!Array.isArray(courseIds)) return;
      courseIds.forEach(courseId => {
        const course = trackCoursesData[courseId];
        if (!course) return;
        const courseState = profile.courseStates?.[courseId];
        let status = 'available';
        if (courseState === 'passed') status = 'passed';
        else if (courseState === 'learning') status = 'active';
        const [yearStr, termStr] = termKey.split('-');
        result.push({ ...course, id: courseId, termKey, year: parseInt(yearStr), term: parseInt(termStr), status });
      });
    });
    result.sort((a, b) => a.year !== b.year ? a.year - b.year : a.term - b.term);
    return result;
  }, [profile]);

  const TRACK_LINE_STYLES = {
    ai:   { dash: 'none',       width: 3,   glow: 18 },
    net:  { dash: '10 4',       width: 2.5, glow: 14 },
    game: { dash: '4 4',        width: 2.5, glow: 14 },
    iot:  { dash: '16 5 4 5',   width: 3,   glow: 16 },
    fs:   { dash: '2 5',        width: 2.5, glow: 12 },
  };

  const drawLines = () => {
    if (!containerRef.current || activeTab !== 'core') return;
    const newLines = [];
    const containerRect = containerRef.current.getBoundingClientRect();

    visibleRoadmap.forEach(year => {
      year.semesters.forEach(sem => {
        sem.courses.forEach(course => {
          if (course.isProfessionalElective) return;
          if (course.prereq) {
            const startEl = document.getElementById(`core-${course.prereq}`);
            const endEl   = document.getElementById(`core-${course.id}`);
            if (startEl && endEl) {
              const startRect = startEl.getBoundingClientRect();
              const endRect   = endEl.getBoundingClientRect();
              newLines.push({
                id: `${course.prereq}-${course.id}`,
                start: course.prereq, end: course.id,
                startX: startRect.left + startRect.width / 2 - containerRect.left,
                startY: startRect.bottom - containerRect.top,
                endX:   endRect.left + endRect.width / 2 - containerRect.left,
                endY:   endRect.top - containerRect.top,
                prereqPassed: profile.courseStates?.[course.prereq] === 'passed',
                targetPassed: profile.courseStates?.[course.id] === 'passed',
                isPeTrack: false,
              });
            }
          }
        });
      });
    });

    const peAssignments = profile.peAssignments || {};
    const assignedCodes = Object.values(peAssignments).filter(Boolean);

    assignedCodes.forEach(code => {
      const course = trackCoursesData[code];
      if (!course?.prereq) return;
      if (!assignedCodes.includes(course.prereq)) return;
      const startEl = document.getElementById(`pe-card-${course.prereq}`);
      const endEl   = document.getElementById(`pe-card-${code}`);
      if (!startEl || !endEl) return;
      const startRect = startEl.getBoundingClientRect();
      const endRect   = endEl.getBoundingClientRect();
      const peTrack = tracks.find(t => {
        const codes = new Set();
        t.chains.forEach(c => c.forEach(item => { if (item !== 'arrow') codes.add(item.replace('*', '')); }));
        return codes.has(code);
      });
      newLines.push({
        id: `pe-${course.prereq}-${code}`,
        start: course.prereq, end: code,
        startX: startRect.left + startRect.width / 2 - containerRect.left,
        startY: startRect.bottom - containerRect.top,
        endX:   endRect.left + endRect.width / 2 - containerRect.left,
        endY:   endRect.top - containerRect.top,
        prereqPassed: profile.courseStates?.[course.prereq] === 'passed',
        targetPassed: profile.courseStates?.[code] === 'passed',
        isPeTrack: true,
        trackId:    peTrack?.id || 'ai',
        trackColor: peTrack?.color || '#7c3aed',
      });
    });
    setLines(newLines);
  };

  useEffect(() => {
    if (activeTab !== 'core') return;
    const observers = [];
    visibleRoadmap.forEach((_, idx) => {
      const el = document.getElementById(`year-section-${idx + 1}`);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveYear(idx + 1); }, { threshold:0.15 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [activeTab, processedRoadmap]);

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(drawLines);
    setTimeout(drawLines, 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [processedRoadmap, activeTab]);

  const isLineActive = (line) => {
    if (!hoveredCourse) return false;
    return line.start === hoveredCourse || line.end === hoveredCourse;
  };

  const getRelatedCourses = (courseId) => {
    if (!courseId) return { related:new Set(), direction:null };
    const related = new Set([courseId]);
    let hasPrereq = false;
    visibleRoadmap.forEach(year => year.semesters.forEach(sem => sem.courses.forEach(course => {
      if (course.id === courseId && course.prereq) hasPrereq = true;
    })));
    if (hasPrereq) {
      const findPrereqs = (id) => {
        visibleRoadmap.forEach(year => year.semesters.forEach(sem => sem.courses.forEach(course => {
          if (course.id === id && course.prereq) { related.add(course.prereq); findPrereqs(course.prereq); }
        })));
      };
      findPrereqs(courseId);
      return { related, direction:'backward' };
    } else {
      const findDependents = (id) => {
        visibleRoadmap.forEach(year => year.semesters.forEach(sem => sem.courses.forEach(course => {
          if (course.prereq === id) { related.add(course.id); findDependents(course.id); }
        })));
      };
      findDependents(courseId);
      return { related, direction:'forward' };
    }
  };

  const { related:relatedCourses, direction:relatedDirection } = useMemo(() => getRelatedCourses(hoveredCourse), [hoveredCourse, processedRoadmap]);

  const getCoreStatusClass = (status, isRelated = false) => {
    const base = "relative p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 h-[140px] flex flex-col justify-between group cursor-pointer shadow-lg select-none";
    const relatedClass = isRelated ? "!scale-110 !z-50 !shadow-2xl !shadow-cyan-500/50 !border-cyan-400 ring-4 ring-cyan-400/50 !-translate-y-2" : "";
    switch (status) {
      case 'passed':   return `${base} ${relatedClass} bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border-emerald-500/60 shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-emerald-400`;
      case 'active':   return `${base} ${relatedClass} bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-400/70 shadow-blue-500/30 hover:shadow-blue-500/50 scale-[1.02] hover:scale-[1.05] hover:border-blue-300 z-10 ring-2 ring-blue-400/30 animate-pulse-subtle`;
      case 'available':return `${base} ${relatedClass} bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/40 shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-purple-400`;
      case 'missed':   return `${base} ${relatedClass} bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/40 shadow-orange-500/20 opacity-80 hover:opacity-100 hover:-translate-y-1`;
      default:         return `${base} ${relatedClass} bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-600/40 opacity-60 grayscale hover:opacity-90 hover:grayscale-0 hover:border-slate-500`;
    }
  };

  const getElectiveStatusClass = (status) => {
    const base = "relative p-5 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 min-h-[160px] flex flex-col justify-between group cursor-pointer shadow-lg select-none";
    switch (status) {
      case 'passed': return `${base} bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border-emerald-500/60 shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-2 hover:scale-[1.03]`;
      case 'active': return `${base} bg-gradient-to-br from-blue-900/70 to-cyan-900/50 border-blue-400/70 shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-2 hover:scale-[1.03] ring-2 ring-blue-400/30`;
      default:       return `${base} bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-600/50 hover:border-orange-500/50 hover:shadow-orange-500/30 hover:-translate-y-2 hover:scale-[1.03]`;
    }
  };

  const getCourseType = (courseCode) => {
    if (courseCode.startsWith('PE-')) return 'professional';
    if (courseCode.startsWith('FREE-')) return 'free';
    if (courseCode.startsWith('SOC-') || courseCode === 'SPORT') return 'social';
    if (courseCode.startsWith('SCI-')) return 'science';
    if (courseCode.startsWith('LANG-')) return 'language';
    if (courseCode === 'HUM-1') return 'humanities';
    if (courseCode === 'INTERNSHIP') return 'internship';
    if (courseCode.includes('040613141') || courseCode.includes('040613142')) return 'project';
    return 'core';
  };

  const getElectiveCategory = (elective) => {
    if (elective.category) return elective.category;
    const id = elective.id || '';
    const name = elective.name || '';
    const sportIds = ['040313017','040313018'];
    const sportKeywords = ['กีฬา','ออกกำลังกาย','สุขภาพ','โภชนาการ','สมุนไพร','ร่างกาย','fitness','sport','exercise'];
    if (sportIds.includes(id) || sportKeywords.some(k => name.includes(k))) return 'sport';
    const scienceIds = ['030923100','030923101','030923102','030923103','030943131','040713002','040713005'];
    const scienceKeywords = ['วิทยาศาสตร์','physics','energy','คณิตศาสตร์','เทคโนโลยี'];
    if (scienceIds.includes(id) || scienceKeywords.some(k => name.toLowerCase().includes(k.toLowerCase()))) return 'science';
    const humIds = ['080203901','080203904','080303103','080303401','080303601','080303607','080303609','030953115'];
    const humKeywords = ['มนุษย์','สังคม','กฎหมาย','จิตวิทยา','คาราโอเกะ','มนุษยสัมพันธ์','ความปลอดภัย','สมาธิ'];
    if (humIds.includes(id) || humKeywords.some(k => name.includes(k))) return 'humanities';
    return 'other';
  };

  const ELECTIVE_CATEGORIES = [
    { key:'all',        label:'ทั้งหมด',           emoji:'📚', gradient:'from-slate-600 to-slate-700',   active:'from-slate-500 to-slate-600' },
    { key:'sport',      label:'กีฬา & สุขภาพ',      emoji:'🏃', gradient:'from-green-700 to-emerald-700', active:'from-green-500 to-emerald-500' },
    { key:'science',    label:'วิทยาศาสตร์',        emoji:'🔬', gradient:'from-purple-700 to-violet-700', active:'from-purple-500 to-violet-500' },
    { key:'humanities', label:'มนุษยศาสตร์/สังคม', emoji:'🎨', gradient:'from-pink-700 to-rose-700',      active:'from-pink-500 to-rose-500' },
    { key:'other',      label:'อื่นๆ',              emoji:'✨', gradient:'from-orange-700 to-amber-700',  active:'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 text-white relative overflow-hidden">
      <div className="text-center mb-12 space-y-6 relative z-20">
        <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-2xl tracking-tight">
          CS Curriculum Roadmap
        </h1>
        <p className="text-slate-300 text-lg md:text-xl font-medium">
          แผนผังเส้นทางการเรียนสาขาวิทยาการคอมพิวเตอร์
        </p>
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <button
            onClick={() => setActiveTab('core')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'core'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/70 hover:text-white border border-slate-700'
            }`}
          >
            <Code size={20} />
            กลุ่มวิชา หลัก
          </button>
          <button
            onClick={() => setActiveTab('elective')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'elective'
                ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/70 hover:text-white border border-slate-700'
            }`}
          >
            <Sparkles size={20} />
            กลุ่มวิชา เสรี
          </button>
          <button
            onClick={() => setActiveTab('trackmap')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'trackmap'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/70 hover:text-white border border-slate-700'
            }`}
          >
            <GitBranch size={20} />
            เเบ่งสาย
          </button>
        </div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto relative pb-32">
        {activeTab === 'core' && (
          <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="lineGradientPassed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                </linearGradient>
                <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="#22d3ee" />
                </marker>
                <marker id="arrow-passed" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="#10b981" />
                </marker>
                <marker id="arrow-inactive" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L8,4 z" fill="#475569" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {[
                  { id:'ai',   color:'#7c3aed' },
                  { id:'net',  color:'#0891b2' },
                  { id:'game', color:'#d97706' },
                  { id:'iot',  color:'#059669' },
                  { id:'fs',   color:'#db2777' },
                ].map(({ id, color }) => (
                  <g key={id}>
                    <marker id={`arrow-pe-${id}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                      <path d="M0,0 L0,10 L10,5 z" fill={color} />
                    </marker>
                    <marker id={`arrow-pe-${id}-dim`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                      <path d="M0,0 L0,9 L9,4.5 z" fill={color} fillOpacity="0.4" />
                    </marker>
                    <filter id={`glow-pe-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feFlood floodColor={color} floodOpacity="0.6" result="color"/>
                      <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </g>
                ))}
              </defs>

              {lines.map((line) => {
                const active      = isLineActive(line);
                const bothPassed  = line.prereqPassed && line.targetPassed;
                const isRelated   = relatedCourses.has(line.start) && relatedCourses.has(line.end);

                if (line.isPeTrack) {
                  const tId    = line.trackId || 'ai';
                  const tColor = line.trackColor || '#7c3aed';
                  const style   = TRACK_LINE_STYLES[tId] || TRACK_LINE_STYLES.ai;
                  const passed = line.prereqPassed;
                  const both   = line.prereqPassed && line.targetPassed;
                  return (
                    <g key={line.id}>
                      <path
                        d={`M ${line.startX} ${line.startY} C ${line.startX} ${line.startY + 120}, ${line.endX} ${line.endY - 120}, ${line.endX} ${line.endY}`}
                        fill="none"
                        stroke={tColor}
                        strokeWidth={style.width + 6}
                        strokeOpacity={both ? 0.25 : passed ? 0.15 : 0.08}
                        strokeDasharray={style.dash !== 'none' ? style.dash : undefined}
                        filter={`url(#glow-pe-${tId})`}
                      />
                      <path
                        d={`M ${line.startX} ${line.startY} C ${line.startX} ${line.startY + 120}, ${line.endX} ${line.endY - 120}, ${line.endX} ${line.endY}`}
                        fill="none"
                        stroke={tColor}
                        strokeWidth={both ? style.width + 1 : style.width}
                        strokeOpacity={both ? 0.95 : passed ? 0.7 : 0.35}
                        strokeDasharray={style.dash !== 'none' ? style.dash : undefined}
                        markerEnd={`url(#arrow-pe-${tId}${both || passed ? '' : '-dim'})`}
                      />
                    </g>
                  );
                }

                let strokeColor   = "#475569";
                let strokeWidth   = "2";
                let strokeOpacity = "0.04";
                let marker        = "url(#arrow-inactive)";
                let useGlow        = false;

                if (active || isRelated) {
                  useGlow      = true;
                  strokeColor  = "url(#lineGradientActive)";
                  strokeWidth  = isRelated ? "6" : "4";
                  strokeOpacity = "1";
                  marker       = "url(#arrow-active)";
                } else if (bothPassed) {
                  strokeColor  = "#94a3b8";
                  strokeWidth  = "2.5";
                  strokeOpacity = "0.08";
                  marker       = "url(#arrow-inactive)";
                } else if (line.prereqPassed) {
                  strokeColor  = "#94a3b8";
                  strokeWidth  = "2";
                  strokeOpacity = "0.06";
                  marker       = "url(#arrow-inactive)";
                }

                return (
                  <path
                    key={line.id}
                    d={`M ${line.startX} ${line.startY} C ${line.startX} ${line.startY + 80}, ${line.endX} ${line.endY - 80}, ${line.endX} ${line.endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    markerEnd={marker}
                    filter={useGlow ? "url(#glow)" : "none"}
                    className={`transition-all duration-500 ${(active || isRelated) ? 'animate-pulse-slow' : ''}`}
                  />
                );
              })}
            </svg>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-3">
                <Code className="text-cyan-400" size={28} />
                <h2 className="text-3xl font-black text-white">กลุ่มวิชา หลัก</h2>
              </div>
              <p className="text-slate-400 text-base mb-6">วิชาหลักตามหลักสูตร พร้อม prerequisite และสถานะการเรียน</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px]" style={{ border: '2.5px solid #10b981', background: '#10b98135' }}></div>
                  <span className="font-bold text-base" style={{ color: '#10b981' }}>Passed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px] animate-pulse" style={{ border: '2.5px solid #60a5fa', background: '#60a5fa35' }}></div>
                  <span className="font-bold text-base" style={{ color: '#60a5fa' }}>Learning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px]" style={{ border: '2.5px solid #a855f7', background: '#a855f735' }}></div>
                  <span className="font-bold text-base" style={{ color: '#a855f7' }}>Available</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px]" style={{ border: '2.5px solid #64748b', background: '#64748b35' }}></div>
                  <span className="font-bold text-base" style={{ color: '#64748b' }}>Locked</span>
                </div>
              </div>
            </div>

            <div className="sticky top-4 z-30 flex justify-center mb-12 pointer-events-none">
                <div className="relative pointer-events-auto flex items-center gap-0 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-white/10 transition-all duration-300 ease-in-out"
                  style={{ left:`calc(${(Math.min(activeYear,4)-1)*25}% + 4px)`, width:'calc(25% - 2px)' }}
                />
                {visibleRoadmap.slice(0,4).map((yearGroup, idx) => {
                  const yearNum = idx + 1;
                  const isActive = activeYear === yearNum;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveYear(yearNum);
                        const el = document.getElementById(`year-section-${yearNum}`);
                        if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
                      }}
                      className="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 select-none"
                      style={{ color:isActive ? '#fff' : 'rgba(148,163,184,0.6)', width:'80px' }}
                    >
                      ปี {yearNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-32 relative z-10">
              {visibleRoadmap.map((yearGroup, yearIdx) => (
                <div key={yearIdx} id={`year-section-${yearIdx+1}`} className="relative">
                  <div className="sticky top-20 z-20 flex justify-start mb-12">
                    <div className="bg-gradient-to-r from-slate-800/95 via-slate-800/90 to-transparent backdrop-blur-xl border-2 border-slate-600/50 px-8 py-3 rounded-r-full shadow-2xl">
                      <span className="text-4xl font-black text-white tracking-wider flex items-center gap-3">
                        <GraduationCap className="text-blue-400" size={32} />
                        {yearGroup.year}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {yearGroup.semesters.map((sem, semIdx) => {
                      const yearNum = parseInt(yearGroup.year.replace('Year ',''));
                      const termNum = semIdx + 1;
                      return (
                        <div key={semIdx} className="space-y-6 bg-black/30 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                              {sem.term}
                            </h3>
                            {profile.currentYear === yearNum && profile.currentTerm === termNum && (
                              <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full animate-pulse font-bold shadow-lg shadow-blue-500/50">
                                Current Term
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {sem.courses.map((course) => {
                              const isRelated = relatedCourses.has(course.id);
                              const isPeSlot = course.isProfessionalElective === true;
                              const assignedCode = isPeSlot ? (profile.peAssignments?.[course.id]) : null;
                              const assignedCourse = assignedCode ? trackCoursesData[assignedCode] : null;

                              if (isPeSlot && assignedCourse) {
                                const assignedState = profile.courseStates?.[assignedCode];
                                const assignedPrereq = assignedCourse?.prereq;
                                const assignedPrereqList = assignedPrereq ? assignedPrereq.split(",").map(s => s.trim()) : [];
                                const prereqOk = assignedPrereqList.length === 0 || assignedPrereqList.every(p => profile.courseStates?.[p] === 'passed');
                                const effectiveState = !prereqOk && assignedState === 'learning' ? 'locked' : assignedState;
                                const status = effectiveState === 'passed' ? 'passed'
                                  : effectiveState === 'learning' ? 'active'
                                  : effectiveState === 'locked'   ? 'locked'
                                  : 'available';
                                const assignedTrack = tracks.find(t => {
                                  const codes = new Set();
                                  t.chains.forEach(c => c.forEach(item => { if (item !== 'arrow') codes.add(item.replace('*','')); }));
                                  return codes.has(assignedCode);
                                });
                                const tColor = assignedTrack?.color || '#7c3aed';
                                return (
                                  <div
                                    key={course.id}
                                    id={`pe-card-${assignedCode}`}
                                    onClick={() => navigate(`/course/${assignedCode}`)}
                                    className={`relative p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 h-[140px] flex flex-col justify-between group cursor-pointer shadow-lg select-none hover:-translate-y-1 hover:scale-[1.02] ${
                                      status === 'passed'     ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border-emerald-500/60 shadow-emerald-500/20' :
                                      status === 'active'     ? 'bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-400/70 shadow-blue-500/30 ring-2 ring-blue-400/30' :
                                      status === 'locked'     ? 'bg-gradient-to-br from-red-950/60 to-red-900/30 border-red-500/50 shadow-red-500/20 opacity-75' :
                                      'border-2'
                                    }`}
                                    style={status === 'available' ? { borderColor: tColor + '60', background: tColor + '12' } : {}}
                                  >
                                    <div className="absolute -top-2 -left-2 z-10">
                                      <span className="text-[9px] text-white px-2 py-1 rounded-full font-bold shadow-lg" style={{ background: tColor }}>
                                        {assignedTrack?.icon} {assignedTrack?.label || 'ELECTIVE'}
                                      </span>
                                    </div>
                                    {status === 'locked' && (
                                      <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-red-950/40 backdrop-blur-[1px] z-10 pointer-events-none">
                                        <div className="flex flex-col items-center gap-1 text-center px-3">
                                          <Lock size={18} className="text-red-400"/>
                                          <span className="text-[10px] text-red-300 font-bold leading-tight">ต้องผ่านวิชาก่อนหน้าก่อน</span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-xs font-bold font-mono tracking-wider bg-black/50 px-3 py-1.5 rounded-lg border shadow-md" style={{ color: status === 'locked' ? '#f87171' : tColor, borderColor: (status === 'locked' ? '#ef4444' : tColor) + '40' }}>
                                        {assignedCourse.code}
                                      </span>
                                      {status === 'passed'    && <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]"/>}
                                      {status === 'active'    && <BookOpen size={22} className="text-blue-300 animate-pulse"/>}
                                      {status === 'locked'    && <Lock size={20} className="text-red-400"/>}
                                      {status === 'available' && <GraduationCap size={20} style={{ color: tColor }}/>}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-base text-white leading-snug mb-1 group-hover:opacity-80 transition-opacity line-clamp-2">
                                        {assignedCourse.nameEn || assignedCourse.name}
                                      </h4>
                                      {assignedCourse.nameEn && <p className="text-[10px] text-slate-500 mb-1 line-clamp-1">{assignedCourse.name}</p>}
                                      <div className="flex items-center gap-2 text-sm">
                                        <span className="bg-black/40 px-2.5 py-1 rounded-md text-white/90 font-bold border border-white/10">
                                          {assignedCourse.credits}
                                        </span>
                                        <span className="text-[10px] text-slate-500">slot: {course.id}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              if (isPeSlot && !assignedCourse) {
                                return (
                                  <div
                                    key={course.id}
                                    id={`core-${course.id}`}
                                    className="relative p-4 rounded-xl border-2 border-dashed border-purple-500/20 bg-purple-500/5 h-[140px] flex flex-col items-center justify-center gap-2 select-none"
                                  >
                                    <div className="absolute -top-2 -left-2 z-10">
                                      <span className="text-[9px] bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">ELECTIVE</span>
                                    </div>
                                    <GraduationCap size={24} className="text-purple-500/40"/>
                                    <p className="text-xs text-slate-600 font-bold">{course.id} · ยังไม่ได้เลือก</p>
                                    <p className="text-[10px] text-slate-700">ไปที่ Setup Profile เพื่อเลือกวิชา</p>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={course.id}
                                  id={`core-${course.id}`}
                                  onClick={() => navigate(`/course/${course.id}`)}
                                  className={getCoreStatusClass(course.status, isRelated)}
                                  onMouseEnter={() => setHoveredCourse(course.id)}
                                  onMouseLeave={() => setHoveredCourse(null)}
                                >
                                  {getCourseType(course.code) !== 'core' && (
                                    <div className="absolute -top-2 -left-2 z-10">
                                      {getCourseType(course.code) === 'free' && (
                                        <span className="text-[9px] bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">FREE</span>
                                      )}
                                      {getCourseType(course.code) === 'project' && (
                                        <span className="text-[9px] bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">PROJECT</span>
                                      )}
                                      {getCourseType(course.code) === 'internship' && (
                                        <span className="text-[9px] bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">INTERNSHIP</span>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold font-mono tracking-wider text-white/90 bg-black/50 px-3 py-1.5 rounded-lg border border-white/20 shadow-md">
                                      {course.code}
                                    </span>
                                    {course.status === 'passed'    && <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" />}
                                    {course.status === 'active'    && <BookOpen size={22} className="text-blue-300 animate-pulse drop-shadow-[0_0_10px_rgba(147,197,253,1)]" />}
                                    {course.status === 'locked'    && <Lock size={20} className="text-slate-500" />}
                                    {course.status === 'available' && <AlertCircle size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-base text-white leading-snug mb-1 group-hover:text-cyan-200 transition-colors">
                                      {course.nameEn || course.name}
                                    </h4>
                                    {course.nameEn && <p className="text-[10px] text-slate-500 mb-2 line-clamp-1">{course.name}</p>}
                                    <div className="flex items-center flex-wrap gap-2 text-sm">
                                      <span className="bg-black/40 px-2.5 py-1 rounded-md text-white/90 font-bold border border-white/10">
                                        {course.credits} Credits
                                      </span>
                                      {course.prereq && (
                                        <span className="text-xs bg-slate-700/60 px-2.5 py-1 rounded-md border border-slate-600 text-slate-200 font-medium">
                                          Req: {course.prereq}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {isRelated && course.id !== hoveredCourse && (
                                    <div className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg shadow-cyan-500/50 animate-bounce">
                                      {relatedDirection === 'forward' ? '→ NEXT' : '← REQ'}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {(() => {
              const peAssignments = profile.peAssignments || {};
              const assignedEntries = Object.entries(peAssignments).filter(([, code]) => !!trackCoursesData[code]);
              if (assignedEntries.length === 0) return null;

              const byTrack = {};
              assignedEntries.forEach(([slotId, code]) => {
                const course = trackCoursesData[code];
                const track = tracks.find(t => {
                  const codes = new Set();
                  t.chains.forEach(c => c.forEach(item => { if (item !== 'arrow') codes.add(item.replace('*','')); }));
                  return codes.has(code);
                });
                const tId = track?.id || 'other';
                if (!byTrack[tId]) byTrack[tId] = { track, courses: [] };
                const state = profile.courseStates?.[code];
                const status = state === 'passed' ? 'passed' : state === 'learning' ? 'active' : 'available';
                byTrack[tId].courses.push({ slotId, code, course, status, track });
              });

              return (
                <div className="relative z-10 mt-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900/60 to-blue-900/40 border border-purple-500/30 px-6 py-3 rounded-2xl backdrop-blur-md shadow-xl">
                      <GraduationCap className="text-purple-400" size={24}/>
                      <h2 className="text-2xl font-black text-white">วิชาเลือกเอก (Professional Elective)</h2>
                      <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-500/30">
                        {assignedEntries.length} / 9 slots
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent"/>
                  </div>

                  <div className="space-y-8">
                    {Object.values(byTrack).map(({ track, courses }) => (
                      <div key={track?.id || 'other'}>
                        {track && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border"
                              style={{ borderColor: track.color + '60', background: track.color + '18', color: track.color }}>
                              <span className="text-base">{track.icon}</span>
                              <span>{track.label}</span>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                          {courses.map(({ slotId, code, course, status, track: t }) => {
                            const tColor = t?.color || '#7c3aed';
                            const statusClass = status === 'passed'
                              ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border-emerald-500/60 shadow-emerald-500/20'
                              : status === 'active'
                              ? 'bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-400/70 shadow-blue-500/30 ring-2 ring-blue-400/30'
                              : '';
                            return (
                              <div key={slotId}
                                id={`pe-card-${code}`}
                                onClick={() => navigate(`/course/${code}`)}
                                className={`relative p-5 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 min-h-[160px] flex flex-col justify-between group cursor-pointer shadow-lg select-none hover:-translate-y-1 hover:scale-[1.02] ${statusClass}`}
                                style={status === 'available' ? { borderColor: tColor + '50', background: tColor + '10' } : {}}
                              >
                                <div className="absolute -top-2 -left-2 z-10">
                                  <span className="text-[9px] text-white px-2 py-1 rounded-full font-bold shadow-lg" style={{ background: tColor }}>
                                    {t?.icon} slot: {slotId}
                                  </span>
                                </div>
                                <div className="flex justify-between items-start mb-3">
                                  <span className="text-xs font-bold font-mono tracking-wider bg-black/50 px-3 py-1.5 rounded-lg border shadow-md"
                                    style={{ color: tColor, borderColor: tColor + '40' }}>
                                    {course.code}
                                  </span>
                                  {status === 'passed'    && <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]"/>}
                                  {status === 'active'    && <BookOpen size={22} className="text-blue-300 animate-pulse"/>}
                                  {status === 'available' && <GraduationCap size={20} style={{ color: tColor }}/>}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-base text-white leading-snug mb-1 group-hover:opacity-80 transition-opacity line-clamp-2">
                                    {course.nameEn || course.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{course.nameEn ? course.name : ""}</p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-black/40 px-2.5 py-1 rounded-md text-white/90 font-bold border border-white/10 text-sm">
                                      {course.credits}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {activeTab === 'elective' && (
          <div className="space-y-8 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-3">
                <Sparkles className="text-orange-400" size={28} />
                <h2 className="text-3xl font-black text-white">กลุ่มวิชา เสรี</h2>
              </div>
              <p className="text-slate-400 text-base mb-6">เลือกวิชาเสรีตามความสนใจและเป้าหมายอาชีพของคุณ</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px]" style={{ border: '2.5px solid #10b981', background: '#10b98135' }}></div>
                  <span className="font-bold text-base" style={{ color: '#10b981' }}>Passed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px] animate-pulse" style={{ border: '2.5px solid #60a5fa', background: '#60a5fa35' }}></div>
                  <span className="font-bold text-base" style={{ color: '#60a5fa' }}>Learning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-[5px]" style={{ border: '2.5px solid #f97316', background: '#f9731635' }}></div>
                  <span className="font-bold text-base" style={{ color: '#f97316' }}>Available</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {ELECTIVE_CATEGORIES.map(cat => {
                const count = cat.key === 'all'
                  ? processedElectives.length
                  : processedElectives.filter(e => getElectiveCategory(e) === cat.key).length;
                if (count === 0 && cat.key !== 'all') return null;
                const isActive = activeElectiveCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveElectiveCategory(cat.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${
                      isActive
                        ? `bg-gradient-to-r ${cat.active} text-white border-white/30 shadow-lg scale-105`
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {activeElectiveCategory === 'all' ? (
              <div className="space-y-12">
                {ELECTIVE_CATEGORIES.filter(c => c.key !== 'all').map(cat => {
                  const catCourses = processedElectives.filter(e => getElectiveCategory(e) === cat.key);
                  if (catCourses.length === 0) return null;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`flex items-center gap-3 bg-gradient-to-r ${cat.active} px-6 py-2.5 rounded-full shadow-lg`}>
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="text-white font-black text-lg">{cat.label}</span>
                          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">{catCourses.length} วิชา</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {catCourses.map(elective => (
                          <ElectiveCard key={elective.id} elective={elective} profile={profile} navigate={navigate} getElectiveStatusClass={getElectiveStatusClass} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedElectives.filter(e => getElectiveCategory(e) === activeElectiveCategory).map(elective => (
                  <ElectiveCard key={elective.id} elective={elective} profile={profile} navigate={navigate} getElectiveStatusClass={getElectiveStatusClass} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'trackmap' && (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-3" style={{ background: 'transparent' }}>
                <GitBranch className="text-violet-400" size={28} />
                <h2 className="text-3xl font-black text-white">เเบ่งสาย</h2>
              </div>
              <p className="text-slate-400 text-base">
                ดูเส้นทางการเรียนในแต่ละสาย พร้อม prerequisite chains ทั้งหมด
              </p>
            </div>
            <CurriculumMapTab />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default Roadmap;