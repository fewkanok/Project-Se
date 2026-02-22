// ============================================================
// courseData.js — CS Curriculum Data (หลักสูตร 2564)
// ============================================================

/**
 * @typedef {Object} Course
 * @property {string} code       - รหัสวิชา
 * @property {string} name       - ชื่อวิชา (ภาษาไทย)
 * @property {string} nameEn     - ชื่อวิชา (ภาษาอังกฤษ)
 * @property {string} credits    - หน่วยกิต เช่น "3(3-0-6)"
 * @property {string|null} prereq - วิชาบังคับก่อน (null = ไม่มี)
 */

/** @type {Record<string, Course>} */
export const courses = {
  // ─── Foundation / Base ──────────────────────────────────────
  "040613100": {
    code: "040613100",
    name: "พื้นฐานวิทยาการคอมพิวเตอร์และประเด็นทางวิชาชีพ",
    nameEn: "Fundamental of Computer Science and Professional Issues",
    credits: "3(3-0-6)",
    prereq: null,
  },
  "040613201": {
    code: "040613201",
    name: "การโปรแกรมคอมพิวเตอร์ 1",
    nameEn: "Computer Programming I",
    credits: "3(2-2-5)",
    prereq: null,
  },
  "040613203": {
    code: "040613203",
    name: "การโปรแกรมเชิงโครงสร้าง",
    nameEn: "Structured Programming",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613204": {
    code: "040613204",
    name: "การโปรแกรมเชิงวัตถุ",
    nameEn: "Object-Oriented Programming",
    credits: "3(2-2-5)",
    prereq: "040613203",
  },
  "040613205": {
    code: "040613205",
    name: "โครงสร้างข้อมูล",
    nameEn: "Data Structure",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613301": {
    code: "040613301",
    name: "ระบบฐานข้อมูล",
    nameEn: "Database System",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613104": {
    code: "040613104",
    name: "คณิตศาสตร์สำหรับการคณนา",
    nameEn: "Mathematics for Computing",
    credits: "3(3-0-6)",
    prereq: "040203101",
  },
  "040613112": {
    code: "040613112",
    name: "การออกแบบวงจรดิจิทัล",
    nameEn: "Digital Circuit Design",
    credits: "3(3-0-6)",
    prereq: null,
  },

  // ─── AI Track ───────────────────────────────────────────────
  "040613701": {
    code: "040613701",
    name: "ระบบอัจฉริยะ",
    nameEn: "Intelligent System",
    credits: "3(2-2-5)",
    prereq: "040613205",
  },
  "040613702": {
    code: "040613702",
    name: "การเรียนรู้ของเครื่องคอมพิวเตอร์",
    nameEn: "Machine Learning",
    credits: "3(2-2-5)",
    prereq: "040613701",
  },
  "040613704": {
    code: "040613704",
    name: "การเรียนรู้เชิงลึก",
    nameEn: "Deep Learning",
    credits: "3(2-2-5)",
    prereq: "040613702",
  },
  "040613703": {
    code: "040613703",
    name: "การพัฒนาซอฟต์แวร์ทางปัญญาประดิษฐ์",
    nameEn: "AI Software Development",
    credits: "3(2-2-5)",
    prereq: "040613701",
  },
  "040613152": {
    code: "040613152",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 2",
    nameEn: "Selected Topics in Computer Science II",
    credits: "3(3-0-6)",
    prereq: null,
  },
  "040613705": {
    code: "040613705",
    name: "วิศวกรรมข้อมูลขนาดใหญ่",
    nameEn: "Big Data Engineering",
    credits: "3(2-2-5)",
    prereq: "040613701",
  },
  "040613706": {
    code: "040613706",
    name: "การประมวลผลภาษาธรรมชาติ",
    nameEn: "Natural Language Processing",
    credits: "3(3-0-6)",
    prereq: "040613701",
  },
  "040613707": {
    code: "040613707",
    name: "คอมพิวเตอร์วิทัศน์",
    nameEn: "Computer Vision",
    credits: "3(2-2-5)",
    prereq: "040613701",
  },

  // ─── Security & Network Track ───────────────────────────────
  "040613502": {
    code: "040613502",
    name: "เครือข่ายคอมพิวเตอร์",
    nameEn: "Computer Network",
    credits: "3(2-2-5)",
    prereq: null,
  },
  "040613601": {
    code: "040613601",
    name: "ความมั่นคงของระบบคอมพิวเตอร์",
    nameEn: "Computer System Security",
    credits: "3(3-0-6)",
    prereq: "040613100",
  },
  "040613504": {
    code: "040613504",
    name: "เทคโนโลยีการเชื่อมต่อระหว่างเครือข่าย",
    nameEn: "Inter-networking Technology",
    credits: "3(2-2-5)",
    prereq: "040613502",
  },
  "040613503": {
    code: "040613503",
    name: "การสื่อสารและเครือข่ายไร้สาย",
    nameEn: "Wireless Communication and Network",
    credits: "3(3-0-6)",
    prereq: "040613502",
  },
  "040613605": {
    code: "040613605",
    name: "การทดสอบเจาะระบบและการป้องกัน",
    nameEn: "Penetration Testing and Protection",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
  },
  "040613602": {
    code: "040613602",
    name: "ความมั่นคงของเครือข่าย",
    nameEn: "Network Security",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
  },
  "040613604": {
    code: "040613604",
    name: "นิติวิทยาศาสตร์ดิจิทัล",
    nameEn: "Digital Forensics",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
  },
  "040613603": {
    code: "040613603",
    name: "การโปรแกรมเชิงป้องกัน",
    nameEn: "Defensive Programming",
    credits: "3(2-2-5)",
    prereq: "040613203, 040613601",
  },
  "040613505": {
    code: "040613505",
    name: "เครื่องมือยูนิกซ์",
    nameEn: "UNIX Tool",
    credits: "3(2-2-5)",
    prereq: "040613100",
  },
  "040613506": {
    code: "040613506",
    name: "การบริหารยูนิกซ์",
    nameEn: "UNIX Administration",
    credits: "3(2-2-5)",
    prereq: "040613505",
  },

  // ─── Game & Graphic Track ───────────────────────────────────
  "040613801": {
    code: "040613801",
    name: "คอมพิวเตอร์กราฟิกส์",
    nameEn: "Computer Graphics",
    credits: "3(2-2-5)",
    prereq: "040613104, 040613201",
  },
  "040613802": {
    code: "040613802",
    name: "การออกแบบเกมคอมพิวเตอร์",
    nameEn: "Computer Game Design",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613804": {
    code: "040613804",
    name: "การสร้างแบบจำลองสามมิติ",
    nameEn: "3D Modeling",
    credits: "3(2-2-5)",
    prereq: "040613104",
  },
  "040613805": {
    code: "040613805",
    name: "ภาพเคลื่อนไหวคอมพิวเตอร์",
    nameEn: "Computer Animation",
    credits: "3(2-2-5)",
    prereq: "040613801",
  },
  "040613806": {
    code: "040613806",
    name: "การให้แสงและเงา",
    nameEn: "Lighting and Shading",
    credits: "3(2-2-5)",
    prereq: "040613801",
  },
  "040613803": {
    code: "040613803",
    name: "ความเป็นจริงเสมือนและความเป็นจริงเสริม",
    nameEn: "Virtual Reality and Augmented Reality",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },

  // ─── IoT & Robot Track ──────────────────────────────────────
  "040613901": {
    code: "040613901",
    name: "การออกแบบระบบฝังตัว",
    nameEn: "Embedded System Design",
    credits: "3(3-0-6)",
    prereq: "040613112",
  },
  "040613902": {
    code: "040613902",
    name: "อินเทอร์เน็ตของสรรพสิ่ง",
    nameEn: "Internet of Things",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613904": {
    code: "040613904",
    name: "วิทยาการหุ่นยนต์และการควบคุม",
    nameEn: "Robotic Science and Control System",
    credits: "3(2-2-5)",
    prereq: "040613901",
  },
  "040613903": {
    code: "040613903",
    name: "เทคโนโลยีสารสนเทศภูมิศาสตร์สำหรับเมืองอัจฉริยะ",
    nameEn: "Geospatial Information Technology for Smart City",
    credits: "3(3-0-6)",
    prereq: "040613301",
  },
  "040613153": {
    code: "040613153",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 3",
    nameEn: "Selected Topics in Computer Science III",
    credits: "3(3-0-6)",
    prereq: null,
  },
  "040613905": {
    code: "040613905",
    name: "ห่วงโซ่บล็อก",
    nameEn: "Blockchain",
    credits: "3(3-0-6)",
    prereq: null,
  },

  // ─── Full-Stack Track ───────────────────────────────────────
  "040613411": {
    code: "040613411",
    name: "การพัฒนาเว็บ",
    nameEn: "Web Development",
    credits: "3(2-2-5)",
    prereq: "040613201",
  },
  "040613412": {
    code: "040613412",
    name: "เว็บเฟรมเวิร์ค",
    nameEn: "Web Framework",
    credits: "3(2-2-5)",
    prereq: "040613411",
  },
  "040613421": {
    code: "040613421",
    name: "การพัฒนาโปรแกรมประยุกต์เคลื่อนที่",
    nameEn: "Mobile Application Development",
    credits: "3(2-2-5)",
    prereq: "040613204",
  },
  "040613521": {
    code: "040613521",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 1",
    nameEn: "Selected Topics in Computer Science I",
    credits: "3(3-0-6)",
    prereq: null,
  },
  // ─── outside of track  ───────────────────────────────────────
  "040613207": {
    code: "040613207",
    name: "หลักภาษาโปรแกรม",
    nameEn: "Principles of Programming Languages",
    credits: "3(2-2-5)",
    prereq: "040613204",
  },
  "040613304": {
    code: "040613304",
    name: "การบริหารโครงการ",
    nameEn: "Project Management",
    credits: "3(2-2-5)",
    prereq: "040613302",
  },
  "040613111": {
    code: "040613111",
    name: "ดิจิทัลและระบบตรรกะ",
    nameEn: "Digital and Logic Systems",
    credits: "3(3-0-6)",
    prereq: null,
  },
  "040613305": {
    code: "040613305",
    name: "สถาปัตยกรรมซอฟต์แวร์",
    nameEn: "Software Architecture",
    credits: "3(3-0-6)",
    prereq: "040613302",
  },
  "040613307": {
    code: "040613307",
    name: "การทดสอบซอฟต์แวร์",
    nameEn: "Software Testing",
    credits: "3(3-0-6)",
    prereq: "040613302",
  },
};

// ─── Track Definitions ──────────────────────────────────────────
/**
 * Each track has:
 *   id      - unique key used for filtering
 *   label   - display name
 *   color   - CSS variable or hex
 *   icon    - emoji
 *   chains  - array of chains (each chain = ordered array of course codes + "arrow" separators)
 *             Ghost nodes (dimmed repeated nodes) are marked with a trailing "*"
 *             e.g. "040613701*" means render but mark as ghost/reference
 */
export const tracks = [
  {
    id: "ai",
    label: "AI Track",
    color: "#7c3aed",
    colorVar: "var(--ai)",
    icon: "🧠",
    chains: [
      // Main path: Data Structure → Intelligent System → Machine Learning → Deep Learning
      ["040613205", "arrow", "040613701", "arrow", "040613702", "arrow", "040613704"],
      // Branch: Intelligent System → AI Software Dev → Selected Topics II
      ["040613701*", "arrow", "040613703", "arrow", "040613152"],
      // Branch: Intelligent System → Big Data Engineering
      ["040613701*", "arrow", "040613705"],
      // Branch: Intelligent System → NLP
      ["040613701*", "arrow", "040613706"],
      // Branch: Intelligent System → Computer Vision
      ["040613701*", "arrow", "040613707"],
    ],
  },
  {
    id: "net",
    label: "Security & Network",
    color: "#0891b2",
    colorVar: "var(--net)",
    icon: "🔐",
    chains: [
      // Fun-Com → Computer System Security
      ["040613100", "arrow", "040613601"],
      // Fun-Com → Computer Network → Inter-networking
      ["040613100*", "arrow", "040613502", "arrow", "040613504"],
      // Computer Network → Wireless
      ["040613502*", "arrow", "040613503"],
      // Computer System Security → Penetration Testing
      ["040613601*", "arrow", "040613605"],
      // Computer System Security → Network Security
      ["040613601*", "arrow", "040613602"],
      // Computer System Security → Digital Forensics
      ["040613601*", "arrow", "040613604"],
      // Structured Prog + Security → Defensive Programming
      ["040613203", "arrow", "040613603"],
      // Fun-Com → UNIX Tool → UNIX Admin
      ["040613100*", "arrow", "040613505", "arrow", "040613506"],
    ],
  },
  {
    id: "game",
    label: "Game & Graphic",
    color: "#d97706",
    colorVar: "var(--game)",
    icon: "🎮",
    chains: [
      // Math → Computer Graphics → Computer Animation
      ["040613104", "arrow", "040613801", "arrow", "040613805"],
      // Computer Graphics → Lighting & Shading
      ["040613801*", "arrow", "040613806"],
      // Math → 3D Modeling
      ["040613104*", "arrow", "040613804"],
      // ComPro I → Computer Game Design
      ["040613201", "arrow", "040613802"],
      // ComPro I → VR & AR
      ["040613201*", "arrow", "040613803"],
    ],
  },
  {
    id: "iot",
    label: "IoT & Robot",
    color: "#059669",
    colorVar: "var(--iot)",
    icon: "🤖",
    chains: [
      // Digital Circuit → Embedded System → Robotic Science
      ["040613112", "arrow", "040613901", "arrow", "040613904"],
      // ComPro I → Internet of Things
      ["040613201", "arrow", "040613902"],
      // Database System → Geospatial IT
      ["040613301", "arrow", "040613903"],
      // Stand-alone: Selected Topics III
      ["040613153"],
      // Stand-alone: Blockchain
      ["040613905"],
    ],
  },
  {
    id: "fs",
    label: "Full-Stack",
    color: "#db2777",
    colorVar: "var(--fs)",
    icon: "🌐",
    chains: [
      // ComPro I → Web Development → Web Framework
      ["040613201", "arrow", "040613411", "arrow", "040613412"],
      // OOP → Mobile App Dev → Selected Topics I
      ["040613204", "arrow", "040613421", "arrow", "040613521"],
    ],
  },
  {
    id: "Outside",
    label: "Outside of Track",
    color: "#6b7280",
    colorVar: "var(--outside)",
    icon: "📚",
    chains: [
      // Programming path: Prog I → Struct Prog → OOP → Principles of Languages
      ["040613201", "arrow", "040613203", "arrow", "040613204", "arrow", "040613207"],
      // Digital & Logic Systems (standalone)
      ["040613111"],
      // Database & Software Engineering path
      ["040613201", "arrow", "040613301", "arrow", "040613302", "arrow", "040613304" , "arrow", "040613305", "arrow", "040613307"],
    ],
  },
];

// ─── Node type mapping ──────────────────────────────────────────
// Maps a course code to its visual node type per track.
// "major" = highlighted gateway/core course in that track.
export const nodeTypeMap = {
  ai:   { "040613205": "base", "040613701": "ai-major", "040613702": "ai-major",
          "040613704": "ai",   "040613703": "ai",       "040613152": "ai",
          "040613705": "ai",   "040613706": "ai",       "040613707": "ai" },

  net:  { "040613100": "base", "040613502": "net-major","040613601": "net-major",
          "040613504": "net",  "040613503": "net",      "040613605": "net",
          "040613602": "net",  "040613604": "net",      "040613603": "net",
          "040613203": "base", "040613505": "net",      "040613506": "net" },

  game: { "040613104": "base", "040613201": "base",     "040613801": "game-major",
          "040613802": "game-major", "040613804": "game","040613805": "game",
          "040613806": "game", "040613803": "game" },

  iot:  { "040613112": "base", "040613201": "base",     "040613301": "base",
          "040613901": "iot-major","040613902": "iot-major","040613904": "iot",
          "040613903": "iot",  "040613153": "iot",      "040613905": "iot" },

  fs:   { "040613201": "base", "040613204": "base",
          "040613411": "fs-major","040613412": "fs",
          "040613421": "fs-major","040613521": "fs" },
};
