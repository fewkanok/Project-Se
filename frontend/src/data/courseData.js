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
    description: "แนะนำภาพรวมของวิทยาการคอมพิวเตอร์ ประวัติศาสตร์ของคอมพิวเตอร์ จริยธรรมวิชาชีพ ลิขสิทธิ์ซอฟต์แวร์ และประเด็นทางสังคมที่เกี่ยวข้องกับเทคโนโลยี",
    professors: ["ผศ. ดร. วิชัย ประดิษฐ์ธรรม"],
    difficulty: 2.0,
    satisfaction: 3.5,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Assignment', percent: 20, color: 'bg-green-500' },
      { label: 'Participation', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['ประวัติคอมพิวเตอร์', 'ระบบตัวเลข', 'สถาปัตยกรรมคอมพิวเตอร์', 'ระบบปฏิบัติการเบื้องต้น'],
      final: ['จริยธรรมวิชาชีพ', 'ลิขสิทธิ์และทรัพย์สินทางปัญญา', 'ความมั่นคงสารสนเทศเบื้องต้น', 'อาชีพในสาย CS'],
    },
  },
  "040613201": {
    code: "040613201",
    name: "การโปรแกรมคอมพิวเตอร์ 1",
    nameEn: "Computer Programming I",
    credits: "3(2-2-5)",
    prereq: null,
    description: "ฝึกทักษะการเขียนโปรแกรมพื้นฐานด้วยภาษา Python หรือ C ครอบคลุมตัวแปร นิพจน์ เงื่อนไข การวนซ้ำ ฟังก์ชัน และ array เพื่อเป็นรากฐานสำคัญของการเรียนวิชาอื่นๆ",
    professors: ["อ. ณัฐพล มีสุข", "ผศ. สุรีย์ แก้วใส"],
    difficulty: 3.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Quiz', percent: 10, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['Variables & Data Types', 'Operators & Expressions', 'Conditions (if/else)', 'Loops (for/while)'],
      final: ['Functions & Recursion', 'Arrays / Lists', 'Strings', 'Basic I/O & File'],
    },
  },
  "040613203": {
    code: "040613203",
    name: "การโปรแกรมเชิงโครงสร้าง",
    nameEn: "Structured Programming",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาการออกแบบโปรแกรมแบบมีโครงสร้างด้วยภาษา C เน้น modular design, pointer, struct และ dynamic memory allocation เพื่อพัฒนาทักษะการแก้ปัญหาเชิงระบบ",
    professors: ["ผศ. ดร. สิทธิ์ศักดิ์ อ่อนนุ่ม"],
    difficulty: 3.5,
    satisfaction: 3.8,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['ทบทวน C พื้นฐาน', 'Pointer & Address', 'Struct & Union', 'Modular Programming'],
      final: ['Dynamic Memory (malloc/free)', 'Linked List เบื้องต้น', 'File I/O', 'Recursion ขั้นสูง'],
    },
  },
  "040613204": {
    code: "040613204",
    name: "การโปรแกรมเชิงวัตถุ",
    nameEn: "Object-Oriented Programming",
    credits: "3(2-2-5)",
    prereq: "040613203",
    description: "ศึกษาแนวคิด OOP ด้วยภาษา Java หรือ C++ ได้แก่ Class, Object, Inheritance, Polymorphism, Encapsulation, Interface และ Exception handling",
    professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"],
    difficulty: 3.5,
    satisfaction: 4.0,
    scoring: [
      { label: 'Lab', percent: 25, color: 'bg-green-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Quiz', percent: 5, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['Class & Object', 'Constructor & Destructor', 'Encapsulation', 'Inheritance'],
      final: ['Polymorphism & Overriding', 'Abstract Class & Interface', 'Exception Handling', 'Collections'],
    },
  },
  "040613205": {
    code: "040613205",
    name: "โครงสร้างข้อมูล",
    nameEn: "Data Structure",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาโครงสร้างข้อมูลพื้นฐานและขั้นสูง ได้แก่ Stack, Queue, Linked List, Tree, Graph, Heap และ Hash Table พร้อมการวิเคราะห์ความซับซ้อนของอัลกอริทึม",
    professors: ["ผศ. ดร. กิตติพงษ์ ชาญชัย"],
    difficulty: 4.0,
    satisfaction: 3.8,
    scoring: [
      { label: 'Lab', percent: 20, color: 'bg-green-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Assignment', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Big-O Notation', 'Array & Linked List', 'Stack & Queue', 'Tree & BST'],
      final: ['AVL Tree', 'Graph & Traversal', 'Heap & Priority Queue', 'Hash Table & Hashing'],
    },
  },
  "040613301": {
    code: "040613301",
    name: "ระบบฐานข้อมูล",
    nameEn: "Database System",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาหลักการของระบบจัดการฐานข้อมูลเชิงสัมพันธ์ การออกแบบ ER Diagram, Normalization, SQL และการทำ transaction management",
    professors: ["ผศ. ดร. มนัสวี สมบัติ"],
    difficulty: 3.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Lab/Project', percent: 30, color: 'bg-blue-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['ER Diagram', 'Relational Model', 'SQL (DDL/DML)', 'Normalization 1NF-3NF'],
      final: ['Advanced SQL (JOIN, Subquery)', 'Transaction & ACID', 'Indexing & Query Optimization', 'NoSQL เบื้องต้น'],
    },
  },
  "040613104": {
    code: "040613104",
    name: "คณิตศาสตร์สำหรับการคณนา",
    nameEn: "Mathematics for Computing",
    credits: "3(3-0-6)",
    prereq: "040203101",
    description: "คณิตศาสตร์ที่จำเป็นสำหรับวิทยาการคอมพิวเตอร์ ครอบคลุม Logic, Set Theory, Graph Theory, Combinatorics และ Probability เบื้องต้น",
    professors: ["รศ. ดร. ชาญณรงค์ พลายงาม"],
    difficulty: 3.8,
    satisfaction: 3.5,
    scoring: [
      { label: 'Midterm', percent: 40, color: 'bg-orange-500' },
      { label: 'Final', percent: 40, color: 'bg-red-500' },
      { label: 'Homework', percent: 20, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['Logic & Proof', 'Set Theory', 'Relations & Functions', 'Mathematical Induction'],
      final: ['Graph Theory', 'Trees', 'Combinatorics & Counting', 'Probability Basics'],
    },
  },
  "040613112": {
    code: "040613112",
    name: "การออกแบบวงจรดิจิทัล",
    nameEn: "Digital Circuit Design",
    credits: "3(3-0-6)",
    prereq: null,
    description: "ศึกษาหลักการวงจรดิจิทัล ระบบเลขฐาน พีชคณิต Boolean, Logic Gate, Combinational Circuit, Sequential Circuit และการออกแบบด้วย HDL เบื้องต้น",
    professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"],
    difficulty: 3.5,
    satisfaction: 3.6,
    scoring: [
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Lab', percent: 20, color: 'bg-green-500' },
      { label: 'Quiz', percent: 10, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['ระบบเลขฐาน', 'Boolean Algebra', 'Logic Gates', 'Combinational Circuits (MUX, Adder)'],
      final: ['Flip-Flop & Latch', 'Sequential Circuits', 'Finite State Machine', 'HDL เบื้องต้น'],
    },
  },

  // ─── AI Track ───────────────────────────────────────────────
  "040613701": {
    code: "040613701",
    name: "ระบบอัจฉริยะ",
    nameEn: "Intelligent System",
    credits: "3(2-2-5)",
    prereq: "040613205",
    // ตัวอย่างข้อมูลเพิ่มเติมที่ CourseDetail จะใช้
    description: "แนะนำหลักการสร้างระบบที่มีพฤติกรรมคล้ายมนุษย์โดยใช้ AI และอัลกอริทึมพื้นฐาน",
    professors: ["ดร. สมชาย เหมือนยิ้ม"],
    difficulty: 3.5,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Introduction to AI', 'Search algorithms', 'Knowledge representation'],
      final: ['Learning basics', 'Expert systems', 'Ethics in AI'],
    },
  },
  "040613702": {
    code: "040613702",
    name: "การเรียนรู้ของเครื่องคอมพิวเตอร์",
    nameEn: "Machine Learning",
    credits: "3(2-2-5)",
    prereq: "040613701",
    // added details as example
    description: "ศึกษาอัลกอริทึมในการเรียนรู้จากข้อมูล ได้แก่ regression, classification, clustering และการประยุกต์",
    professors: ["ผศ. ดร. ภูวดล ทรัพย์สิน"],
    difficulty: 4.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Homework', percent: 20, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['ความรู้เบื้องต้น ML', 'Supervised vs Unsupervised', 'Linear Regression'],
      final: ['Neural Networks', 'Evaluation Metrics', 'Clustering algorithms'],
    },
  },

  "040613704": {
    code: "040613704",
    name: "การเรียนรู้เชิงลึก",
    nameEn: "Deep Learning",
    credits: "3(2-2-5)",
    prereq: "040613702",
    description: "ศึกษา Neural Network เชิงลึก ครอบคลุม CNN, RNN, LSTM, Transformer และ Generative Model พร้อมการประยุกต์ใช้งานจริงด้วย framework เช่น TensorFlow หรือ PyTorch",
    professors: ["ผศ. ดร. ภูวดล ทรัพย์สิน"],
    difficulty: 4.5,
    satisfaction: 4.3,
    scoring: [
      { label: 'Homework', percent: 20, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Project', percent: 30, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Perceptron & MLP', 'Backpropagation', 'CNN Architecture', 'Regularization & Dropout'],
      final: ['RNN & LSTM', 'Attention & Transformer', 'Generative Models (GAN, VAE)', 'Fine-tuning & Transfer Learning'],
    },
  },
  "040613703": {
    code: "040613703",
    name: "การพัฒนาซอฟต์แวร์ทางปัญญาประดิษฐ์",
    nameEn: "AI Software Development",
    credits: "3(2-2-5)",
    prereq: "040613701",
    description: "ฝึกทักษะการพัฒนา AI Application ตั้งแต่ data pipeline, model deployment, API และ containerization เพื่อนำ AI ไปใช้ในสภาพแวดล้อมจริง",
    professors: ["ดร. สมชาย เหมือนยิ้ม"],
    difficulty: 3.8,
    satisfaction: 4.4,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Project', percent: 40, color: 'bg-blue-500' },
      { label: 'Presentation', percent: 30, color: 'bg-purple-500' },
    ],
    topics: {
      midterm: ['Data Collection & Preprocessing', 'Feature Engineering', 'Model Training Pipeline', 'Version Control for ML'],
      final: ['Model Deployment (Flask/FastAPI)', 'Docker & Containerization', 'MLOps Basics', 'AI Ethics & Bias'],
    },
  },
  "040613152": {
    code: "040613152",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 2",
    nameEn: "Selected Topics in Computer Science II",
    credits: "3(3-0-6)",
    prereq: null,
    description: "หัวข้อพิเศษที่น่าสนใจในวิทยาการคอมพิวเตอร์ซึ่งเปลี่ยนไปตามความก้าวหน้าของเทคโนโลยี เช่น Quantum Computing, Edge AI หรือ Explainable AI",
    professors: ["คณาจารย์ภาควิชา CS"],
    difficulty: 3.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Report/Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['หัวข้อพิเศษ Part 1', 'Review & Discussion'],
      final: ['หัวข้อพิเศษ Part 2', 'Presentation & Report'],
    },
  },
  "040613705": {
    code: "040613705",
    name: "วิศวกรรมข้อมูลขนาดใหญ่",
    nameEn: "Big Data Engineering",
    credits: "3(2-2-5)",
    prereq: "040613701",
    description: "ศึกษาสถาปัตยกรรมระบบข้อมูลขนาดใหญ่ เทคโนโลยี Hadoop, Spark, Kafka การออกแบบ Data Pipeline, Data Lake และ Data Warehouse",
    professors: ["ผศ. ดร. กิตติพงษ์ ชาญชัย"],
    difficulty: 4.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 20, color: 'bg-red-500' },
      { label: 'Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Big Data Concepts (5V)', 'Hadoop Ecosystem', 'HDFS & MapReduce', 'Apache Spark Basics'],
      final: ['Kafka & Stream Processing', 'Data Lake vs Data Warehouse', 'ETL Pipeline Design', 'Cloud Big Data Services'],
    },
  },
  "040613706": {
    code: "040613706",
    name: "การประมวลผลภาษาธรรมชาติ",
    nameEn: "Natural Language Processing",
    credits: "3(3-0-6)",
    prereq: "040613701",
    description: "ศึกษาเทคนิคการประมวลผลภาษาธรรมชาติ ตั้งแต่ tokenization, POS tagging, Named Entity Recognition ไปจนถึง Language Model และ Transformer-based models",
    professors: ["ดร. สมชาย เหมือนยิ้ม"],
    difficulty: 4.0,
    satisfaction: 4.3,
    scoring: [
      { label: 'Assignment', percent: 20, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Text Preprocessing', 'Tokenization & Stemming', 'POS Tagging', 'Word Embeddings (Word2Vec, GloVe)'],
      final: ['Sentiment Analysis', 'Named Entity Recognition', 'Sequence-to-Sequence Models', 'BERT & Transformer for NLP'],
    },
  },
  "040613707": {
    code: "040613707",
    name: "คอมพิวเตอร์วิทัศน์",
    nameEn: "Computer Vision",
    credits: "3(2-2-5)",
    prereq: "040613701",
    description: "ศึกษาเทคนิคการประมวลผลและวิเคราะห์ภาพดิจิทัล ครอบคลุม Image Processing, Feature Extraction, Object Detection, Image Segmentation และ Video Analysis",
    professors: ["ผศ. ดร. ภูวดล ทรัพย์สิน"],
    difficulty: 4.2,
    satisfaction: 4.4,
    scoring: [
      { label: 'Lab', percent: 25, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Image Representation', 'Image Filtering & Transformation', 'Edge Detection', 'Feature Extraction (SIFT, HOG)'],
      final: ['Object Detection (YOLO, R-CNN)', 'Image Segmentation', 'Face Recognition', 'Video Analysis & Tracking'],
    },
  },

  // ─── Security & Network Track ───────────────────────────────
  "040613502": {
    code: "040613502",
    name: "เครือข่ายคอมพิวเตอร์",
    nameEn: "Computer Network",
    credits: "3(2-2-5)",
    prereq: null,
    description: "ศึกษาหลักการของเครือข่ายคอมพิวเตอร์ OSI Model, TCP/IP Protocol Stack, Routing, Switching และการตั้งค่าอุปกรณ์เครือข่าย",
    professors: ["ผศ. ดร. อนุชาติ บุญสุข"],
    difficulty: 3.5,
    satisfaction: 3.8,
    scoring: [
      { label: 'Lab', percent: 25, color: 'bg-green-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Quiz', percent: 5, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['OSI & TCP/IP Model', 'Physical & Data Link Layer', 'IP Addressing & Subnetting', 'Routing Protocols'],
      final: ['Transport Layer (TCP/UDP)', 'Application Layer (HTTP, DNS, DHCP)', 'Network Devices', 'Network Troubleshooting'],
    },
  },
  "040613601": {
    code: "040613601",
    name: "ความมั่นคงของระบบคอมพิวเตอร์",
    nameEn: "Computer System Security",
    credits: "3(3-0-6)",
    prereq: "040613100",
    description: "ศึกษาหลักการความมั่นคงปลอดภัยของระบบคอมพิวเตอร์ การเข้ารหัสข้อมูล (Cryptography), Authentication, ภัยคุกคามประเภทต่างๆ และมาตรการป้องกัน",
    professors: ["รศ. ดร. วรพจน์ ศรีสอาด"],
    difficulty: 3.5,
    satisfaction: 4.1,
    scoring: [
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Assignment', percent: 20, color: 'bg-blue-500' },
      { label: 'Quiz', percent: 10, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['Security Concepts (CIA Triad)', 'Cryptography Basics', 'Symmetric & Asymmetric Encryption', 'PKI & Digital Signature'],
      final: ['Malware & Attack Types', 'Authentication & Access Control', 'Vulnerability Assessment', 'Security Policy & Standards'],
    },
  },
  "040613504": {
    code: "040613504",
    name: "เทคโนโลยีการเชื่อมต่อระหว่างเครือข่าย",
    nameEn: "Inter-networking Technology",
    credits: "3(2-2-5)",
    prereq: "040613502",
    description: "ศึกษาเทคโนโลยีขั้นสูงสำหรับการเชื่อมต่อเครือข่าย ได้แก่ VLAN, VPN, SDN, MPLS, BGP และ Cloud Networking",
    professors: ["ผศ. ดร. อนุชาติ บุญสุข"],
    difficulty: 4.0,
    satisfaction: 3.9,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['VLAN & Trunking', 'STP & Redundancy', 'Inter-VLAN Routing', 'WAN Technologies'],
      final: ['VPN & Tunneling', 'BGP & Advanced Routing', 'SDN Concepts', 'Network Virtualization'],
    },
  },
  "040613503": {
    code: "040613503",
    name: "การสื่อสารและเครือข่ายไร้สาย",
    nameEn: "Wireless Communication and Network",
    credits: "3(3-0-6)",
    prereq: "040613502",
    description: "ศึกษาหลักการสื่อสารไร้สาย มาตรฐาน IEEE 802.11 (Wi-Fi), Bluetooth, ZigBee, Cellular Network (4G/5G) และความมั่นคงของเครือข่ายไร้สาย",
    professors: ["ดร. พัชราภรณ์ ไพรสงบ"],
    difficulty: 3.5,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Lab/Report', percent: 30, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['Wireless Fundamentals', 'IEEE 802.11 Standards', 'WLAN Architecture', 'Bluetooth & ZigBee'],
      final: ['Cellular Network (4G/5G)', 'MIMO & Antenna Technology', 'Wireless Security (WPA3)', 'IoT Wireless Protocols'],
    },
  },
  "040613605": {
    code: "040613605",
    name: "การทดสอบเจาะระบบและการป้องกัน",
    nameEn: "Penetration Testing and Protection",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
    description: "ศึกษาวิธีการทดสอบความมั่นคงของระบบด้วยเทคนิค Ethical Hacking, Penetration Testing Methodology, Exploitation และการรายงานผลเพื่อปรับปรุงความปลอดภัย",
    professors: ["รศ. ดร. วรพจน์ ศรีสอาด"],
    difficulty: 4.5,
    satisfaction: 4.7,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'CTF/Challenge', percent: 20, color: 'bg-purple-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Report', percent: 25, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['Recon & OSINT', 'Scanning & Enumeration', 'Vulnerability Analysis', 'Exploitation Basics'],
      final: ['Post-Exploitation', 'Web Application Attacks', 'Social Engineering', 'Pentest Report Writing'],
    },
  },
  "040613602": {
    code: "040613602",
    name: "ความมั่นคงของเครือข่าย",
    nameEn: "Network Security",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
    description: "ศึกษาการรักษาความปลอดภัยของเครือข่าย ครอบคลุม Firewall, IDS/IPS, VPN, Zero Trust Architecture และการตรวจสอบการบุกรุก",
    professors: ["รศ. ดร. วรพจน์ ศรีสอาด"],
    difficulty: 4.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Lab', percent: 25, color: 'bg-green-500' },
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Quiz', percent: 5, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['Firewall Architecture', 'Packet Filtering & Stateful Inspection', 'IDS & IPS', 'VPN Implementation'],
      final: ['SIEM & Log Management', 'DDoS Mitigation', 'Zero Trust Model', 'Network Security Monitoring'],
    },
  },
  "040613604": {
    code: "040613604",
    name: "นิติวิทยาศาสตร์ดิจิทัล",
    nameEn: "Digital Forensics",
    credits: "3(2-2-5)",
    prereq: "040613502, 040613601",
    description: "ศึกษากระบวนการสืบสวนหาหลักฐานดิจิทัล ครอบคลุม Disk Forensics, Memory Forensics, Network Forensics, Chain of Custody และการรายงานผลทางนิติวิทยาศาสตร์",
    professors: ["ดร. พัชราภรณ์ ไพรสงบ"],
    difficulty: 4.0,
    satisfaction: 4.5,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Case Study', percent: 20, color: 'bg-purple-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['Forensics Fundamentals & Chain of Custody', 'Disk Imaging & Evidence Acquisition', 'File System Analysis', 'Deleted File Recovery'],
      final: ['Memory Forensics', 'Network Traffic Analysis', 'Log Analysis', 'Forensics Report Writing'],
    },
  },
  "040613603": {
    code: "040613603",
    name: "การโปรแกรมเชิงป้องกัน",
    nameEn: "Defensive Programming",
    credits: "3(2-2-5)",
    prereq: "040613203, 040613601",
    description: "ศึกษาเทคนิคการเขียนโปรแกรมที่ปลอดภัย ป้องกัน Buffer Overflow, Injection Attacks, OWASP Top 10 และหลักการ Secure Software Development Lifecycle",
    professors: ["รศ. ดร. วรพจน์ ศรีสอาด"],
    difficulty: 4.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Lab/Code Review', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Secure Coding Principles', 'Buffer Overflow & Memory Safety', 'Input Validation', 'SQL Injection Prevention'],
      final: ['OWASP Top 10', 'Authentication & Session Management', 'Cryptography in Code', 'SSDLC & Code Audit'],
    },
  },
  "040613505": {
    code: "040613505",
    name: "เครื่องมือยูนิกซ์",
    nameEn: "UNIX Tool",
    credits: "3(2-2-5)",
    prereq: "040613100",
    description: "ฝึกการใช้งาน UNIX/Linux Command Line เครื่องมือ Shell Script, Text Processing (grep, awk, sed), Process Management และ Automation",
    professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"],
    difficulty: 3.0,
    satisfaction: 4.3,
    scoring: [
      { label: 'Lab', percent: 40, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['UNIX Filesystem & Navigation', 'File Permissions & User Management', 'Text Processing (grep/sed/awk)', 'Regular Expressions'],
      final: ['Shell Scripting', 'Process & Job Control', 'Networking Tools (ssh, netstat)', 'Cron & Task Automation'],
    },
  },
  "040613506": {
    code: "040613506",
    name: "การบริหารยูนิกซ์",
    nameEn: "UNIX Administration",
    credits: "3(2-2-5)",
    prereq: "040613505",
    description: "ศึกษาการบริหารจัดการระบบ UNIX/Linux ระดับสูง ครอบคลุม System Boot, Package Management, Storage, Network Configuration และ Security Hardening",
    professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"],
    difficulty: 3.5,
    satisfaction: 4.1,
    scoring: [
      { label: 'Lab', percent: 40, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Project', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Boot Process & Init System (systemd)', 'Package Management (apt/yum)', 'Disk & Storage Management (LVM)', 'User & Group Administration'],
      final: ['Network Interface Configuration', 'DNS & DHCP Server Setup', 'Security Hardening', 'Backup & Recovery'],
    },
  },

  // ─── Game & Graphic Track ───────────────────────────────────
  "040613801": {
    code: "040613801",
    name: "คอมพิวเตอร์กราฟิกส์",
    nameEn: "Computer Graphics",
    credits: "3(2-2-5)",
    prereq: "040613104, 040613201",
    description: "ศึกษาหลักการสร้างภาพ 2D/3D ด้วยคอมพิวเตอร์ ครอบคลุม Transformation Matrix, Projection, Rasterization, Shading Model และ OpenGL/WebGL เบื้องต้น",
    professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"],
    difficulty: 4.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['2D/3D Coordinate Systems', 'Transformation Matrix (Translate/Rotate/Scale)', 'Viewing & Projection', 'Line & Polygon Rendering'],
      final: ['Lighting & Shading Models', 'Texture Mapping', 'Hidden Surface Removal', 'OpenGL Pipeline'],
    },
  },
  "040613802": {
    code: "040613802",
    name: "การออกแบบเกมคอมพิวเตอร์",
    nameEn: "Computer Game Design",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาหลักการออกแบบและพัฒนาเกม ครอบคลุม Game Loop, Physics Engine, Game AI, Sprite Animation และการใช้งาน Game Engine เช่น Unity",
    professors: ["อ. ชัยวัฒน์ สร้างสรรค์"],
    difficulty: 3.5,
    satisfaction: 4.8,
    scoring: [
      { label: 'Lab/Game Dev', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Final Game Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Game Design Fundamentals', 'Game Loop & Rendering', 'Input & Collision Detection', '2D Platformer Basics'],
      final: ['Sprite Animation & Particle System', 'Game AI (Pathfinding)', 'Audio & Sound Effects', 'Game Polishing & Publishing'],
    },
  },
  "040613804": {
    code: "040613804",
    name: "การสร้างแบบจำลองสามมิติ",
    nameEn: "3D Modeling",
    credits: "3(2-2-5)",
    prereq: "040613104",
    description: "ฝึกทักษะการสร้างแบบจำลอง 3 มิติด้วยซอฟต์แวร์ Blender หรือ Maya ครอบคลุม Polygon Modeling, UV Unwrapping, Texturing, Rigging และการ Render",
    professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"],
    difficulty: 3.5,
    satisfaction: 4.5,
    scoring: [
      { label: 'Portfolio', percent: 50, color: 'bg-blue-500' },
      { label: 'Midterm Project', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Project', percent: 25, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['3D Viewport Navigation', 'Polygon Modeling (Box/Sculpt)', 'UV Unwrapping', 'Basic Materials & Textures'],
      final: ['Rigging & Weight Painting', 'Keyframe Animation', 'Lighting Setup', 'Rendering & Post-Processing'],
    },
  },
  "040613805": {
    code: "040613805",
    name: "ภาพเคลื่อนไหวคอมพิวเตอร์",
    nameEn: "Computer Animation",
    credits: "3(2-2-5)",
    prereq: "040613801",
    description: "ศึกษาหลักการสร้างภาพเคลื่อนไหวด้วยคอมพิวเตอร์ ครอบคลุม Keyframe Animation, Kinematics, Motion Capture, Particle System และ Procedural Animation",
    professors: ["อ. ชัยวัฒน์ สร้างสรรค์"],
    difficulty: 4.0,
    satisfaction: 4.4,
    scoring: [
      { label: 'Animation Projects', percent: 50, color: 'bg-blue-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['12 Principles of Animation', 'Keyframe & Interpolation', 'Forward & Inverse Kinematics', 'Character Rigging'],
      final: ['Motion Capture & Retargeting', 'Particle & Fluid Simulation', 'Procedural Animation', 'Animation Rendering Pipeline'],
    },
  },
  "040613806": {
    code: "040613806",
    name: "การให้แสงและเงา",
    nameEn: "Lighting and Shading",
    credits: "3(2-2-5)",
    prereq: "040613801",
    description: "ศึกษาเทคนิคการให้แสงและเงาในงาน 3D Graphics ครอบคลุม Physically Based Rendering, Ray Tracing, Global Illumination, HDRI Lighting และ Shader Programming",
    professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"],
    difficulty: 4.2,
    satisfaction: 4.3,
    scoring: [
      { label: 'Render Portfolio', percent: 40, color: 'bg-blue-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['Light & Color Theory', 'Local vs Global Illumination', 'Phong & Blinn-Phong Shading', 'Shadow Mapping'],
      final: ['Ray Tracing & Path Tracing', 'Physically Based Rendering (PBR)', 'HDRI & Environment Lighting', 'GLSL Shader Programming'],
    },
  },
  "040613803": {
    code: "040613803",
    name: "ความเป็นจริงเสมือนและความเป็นจริงเสริม",
    nameEn: "Virtual Reality and Augmented Reality",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาเทคโนโลยี VR/AR/MR ครอบคลุม HMD Hardware, Rendering Pipeline สำหรับ VR, Spatial Computing, Marker-based AR และการพัฒนาแอปพลิเคชัน XR ด้วย Unity หรือ WebXR",
    professors: ["อ. ชัยวัฒน์ สร้างสรรค์"],
    difficulty: 3.8,
    satisfaction: 4.7,
    scoring: [
      { label: 'Project', percent: 40, color: 'bg-blue-500' },
      { label: 'Lab Demo', percent: 20, color: 'bg-green-500' },
      { label: 'Midterm', percent: 20, color: 'bg-orange-500' },
      { label: 'Final', percent: 20, color: 'bg-red-500' },
    ],
    topics: {
      midterm: ['VR/AR/MR Concepts', 'HMD Hardware & Tracking', 'VR Rendering & Comfort', 'Unity XR Setup'],
      final: ['Marker-based & Markerless AR', 'Spatial UI Design', 'Hand Tracking & Gestures', 'XR Application Development'],
    },
  },

  // ─── IoT & Robot Track ──────────────────────────────────────
  "040613901": {
    code: "040613901",
    name: "การออกแบบระบบฝังตัว",
    nameEn: "Embedded System Design",
    credits: "3(3-0-6)",
    prereq: "040613112",
    description: "ศึกษาหลักการออกแบบระบบฝังตัว ครอบคลุม Microcontroller Architecture, Assembly Language, Real-Time OS, Peripheral Interfacing และการประยุกต์ใช้กับ Hardware",
    professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"],
    difficulty: 4.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Microcontroller Architecture (ARM/AVR)', 'GPIO & Interrupts', 'Timer & PWM', 'Serial Communication (UART/SPI/I2C)'],
      final: ['Real-Time OS Basics', 'Sensor & Actuator Interfacing', 'ADC/DAC', 'Embedded System Design Project'],
    },
  },
  "040613902": {
    code: "040613902",
    name: "อินเทอร์เน็ตของสรรพสิ่ง",
    nameEn: "Internet of Things",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาสถาปัตยกรรมและเทคโนโลยี IoT ครอบคลุม Sensor Networks, MQTT Protocol, Edge Computing, Cloud Platform (AWS IoT / Azure IoT) และ Security ในระบบ IoT",
    professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"],
    difficulty: 3.5,
    satisfaction: 4.3,
    scoring: [
      { label: 'Lab/Prototype', percent: 35, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Report', percent: 10, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['IoT Architecture & Layers', 'Sensor & Actuator Types', 'Communication Protocols (MQTT, CoAP)', 'Raspberry Pi / Arduino Basics'],
      final: ['Edge Computing', 'Cloud IoT Platforms', 'IoT Data Analytics', 'IoT Security Challenges'],
    },
  },
  "040613904": {
    code: "040613904",
    name: "วิทยาการหุ่นยนต์และการควบคุม",
    nameEn: "Robotic Science and Control System",
    credits: "3(2-2-5)",
    prereq: "040613901",
    description: "ศึกษาหลักการวิทยาการหุ่นยนต์ ครอบคลุม Robot Kinematics, Motion Planning, Control Systems, ROS (Robot Operating System) และการประยุกต์ใช้ Robot ในงานอุตสาหกรรม",
    professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"],
    difficulty: 4.5,
    satisfaction: 4.5,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 25, color: 'bg-red-500' },
      { label: 'Robot Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Robot Anatomy & DOF', 'Forward & Inverse Kinematics', 'Sensor Fusion', 'PID Control'],
      final: ['ROS Framework', 'Motion Planning (A*, RRT)', 'SLAM เบื้องต้น', 'Computer Vision for Robotics'],
    },
  },
  "040613903": {
    code: "040613903",
    name: "เทคโนโลยีสารสนเทศภูมิศาสตร์สำหรับเมืองอัจฉริยะ",
    nameEn: "Geospatial Information Technology for Smart City",
    credits: "3(3-0-6)",
    prereq: "040613301",
    description: "ศึกษาเทคโนโลยี GIS และการนำมาประยุกต์สำหรับเมืองอัจฉริยะ ครอบคลุม Spatial Data, Remote Sensing, GPS Tracking, Open Data และการวิเคราะห์เชิงพื้นที่",
    professors: ["ดร. พัชราภรณ์ ไพรสงบ"],
    difficulty: 3.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'GIS Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['GIS Fundamentals', 'Coordinate Systems & Projections', 'Spatial Data Types (Vector/Raster)', 'Remote Sensing'],
      final: ['Open Data & OpenStreetMap', 'Spatial Analysis', 'Smart City Applications', 'Web Mapping (Leaflet/Mapbox)'],
    },
  },
  "040613153": {
    code: "040613153",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 3",
    nameEn: "Selected Topics in Computer Science III",
    credits: "3(3-0-6)",
    prereq: null,
    description: "หัวข้อพิเศษที่น่าสนใจในวิทยาการคอมพิวเตอร์ด้าน IoT และเทคโนโลยีที่กำลังมาแรง เช่น Edge AI, Digital Twin หรือ Smart Sensor Systems",
    professors: ["คณาจารย์ภาควิชา CS"],
    difficulty: 3.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Report/Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['หัวข้อพิเศษ Part 1', 'Review & Discussion'],
      final: ['หัวข้อพิเศษ Part 2', 'Presentation & Report'],
    },
  },
  "040613905": {
    code: "040613905",
    name: "ห่วงโซ่บล็อก",
    nameEn: "Blockchain",
    credits: "3(3-0-6)",
    prereq: null,
    description: "ศึกษาเทคโนโลยี Blockchain ครอบคลุม Distributed Ledger, Consensus Mechanism, Smart Contract, Ethereum, DeFi และการประยุกต์ใช้ Blockchain ในอุตสาหกรรม",
    professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"],
    difficulty: 3.5,
    satisfaction: 4.2,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Smart Contract Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Blockchain Fundamentals & Cryptography', 'Bitcoin & Distributed Ledger', 'Consensus Mechanisms (PoW/PoS)', 'Ethereum & EVM'],
      final: ['Smart Contract (Solidity)', 'DeFi & NFT Concepts', 'Blockchain Security', 'Enterprise Blockchain (Hyperledger)'],
    },
  },

  // ─── Full-Stack Track ───────────────────────────────────────
  "040613411": {
    code: "040613411",
    name: "การพัฒนาเว็บ",
    nameEn: "Web Development",
    credits: "3(2-2-5)",
    prereq: "040613201",
    description: "ศึกษาการพัฒนาเว็บแอปพลิเคชันตั้งแต่พื้นฐาน HTML5, CSS3, JavaScript ฝั่ง Client พร้อม RESTful API และ Server-side Programming",
    professors: ["อ. ณัฐพล มีสุข"],
    difficulty: 3.0,
    satisfaction: 4.5,
    scoring: [
      { label: 'Lab/Assignment', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 20, color: 'bg-red-500' },
      { label: 'Web Project', percent: 20, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['HTML5 & Semantic Elements', 'CSS3 & Flexbox/Grid', 'JavaScript Basics & DOM', 'Responsive Design'],
      final: ['Async JS & Fetch API', 'RESTful API Design', 'Server-side (Node.js/PHP)', 'Database Integration'],
    },
  },
  "040613412": {
    code: "040613412",
    name: "เว็บเฟรมเวิร์ค",
    nameEn: "Web Framework",
    credits: "3(2-2-5)",
    prereq: "040613411",
    description: "ศึกษาการพัฒนา Web Application ด้วย Framework สมัยใหม่ ทั้งฝั่ง Frontend (React/Vue) และ Backend (Express/Django) พร้อม Deployment และ CI/CD",
    professors: ["อ. ณัฐพล มีสุข"],
    difficulty: 3.8,
    satisfaction: 4.6,
    scoring: [
      { label: 'Lab/Assignment', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 20, color: 'bg-red-500' },
      { label: 'Full-Stack Project', percent: 25, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['React/Vue Fundamentals & Component', 'State Management', 'Routing & Navigation', 'API Integration'],
      final: ['Backend Framework (Express/Django)', 'Authentication (JWT/OAuth)', 'Docker & Deployment', 'Testing & CI/CD'],
    },
  },
  "040613421": {
    code: "040613421",
    name: "การพัฒนาโปรแกรมประยุกต์เคลื่อนที่",
    nameEn: "Mobile Application Development",
    credits: "3(2-2-5)",
    prereq: "040613204",
    description: "ศึกษาการพัฒนาแอปพลิเคชันบนมือถือ ครอบคลุม Native Development (Android/iOS) หรือ Cross-platform (Flutter/React Native) พร้อม UI/UX Principles",
    professors: ["ผศ. สุรีย์ แก้วใส"],
    difficulty: 3.8,
    satisfaction: 4.5,
    scoring: [
      { label: 'Lab', percent: 30, color: 'bg-green-500' },
      { label: 'Midterm', percent: 25, color: 'bg-orange-500' },
      { label: 'Final', percent: 20, color: 'bg-red-500' },
      { label: 'App Project', percent: 25, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Mobile Platform Overview', 'UI Components & Layouts', 'Navigation & Routing', 'State Management'],
      final: ['REST API Integration', 'Local Storage & SQLite', 'Camera, GPS & Sensors', 'App Publishing & Store'],
    },
  },
  "040613521": {
    code: "040613521",
    name: "การศึกษาเฉพาะเรื่องทางวิทยาการคอมพิวเตอร์ 1",
    nameEn: "Selected Topics in Computer Science I",
    credits: "3(3-0-6)",
    prereq: null,
    description: "หัวข้อพิเศษที่น่าสนใจในสาขาวิทยาการคอมพิวเตอร์ด้าน Full-Stack และ Software Engineering เช่น Microservices, GraphQL หรือ Cloud-native Development",
    professors: ["คณาจารย์ภาควิชา CS"],
    difficulty: 3.0,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Report/Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['หัวข้อพิเศษ Part 1', 'Review & Discussion'],
      final: ['หัวข้อพิเศษ Part 2', 'Presentation & Report'],
    },
  },
  // ─── outside of track  ───────────────────────────────────────
  "040613302": {
    code: "040613302",
    name: "วิศวกรรมซอฟต์แวร์",
    nameEn: "Software Engineering",
    credits: "3(3-0-6)",
    prereq: "040613204",
    description: "ศึกษากระบวนการพัฒนาซอฟต์แวร์อย่างเป็นระบบ ครอบคลุม Software Development Life Cycle, Requirements Engineering, UML, Agile, SCRUM และการประกันคุณภาพ",
    professors: ["ผศ. ดร. มนัสวี สมบัติ"],
    difficulty: 3.0,
    satisfaction: 4.2,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Group Project', percent: 35, color: 'bg-blue-500' },
      { label: 'Participation', percent: 5, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['SDLC Models (Waterfall/Iterative)', 'Requirements Engineering', 'UML Diagrams (Use Case, Class, Sequence)', 'Software Design Principles'],
      final: ['Agile & Scrum', 'Implementation & Code Review', 'Testing Strategies', 'Software Quality Assurance'],
    },
  },
  "040613207": {
    code: "040613207",
    name: "หลักภาษาโปรแกรม",
    nameEn: "Principles of Programming Languages",
    credits: "3(2-2-5)",
    prereq: "040613204",
    description: "ศึกษาทฤษฎีและแนวคิดของภาษาโปรแกรม ครอบคลุม Syntax, Semantics, Type System, Functional Programming, Logic Programming และการออกแบบภาษา",
    professors: ["ผศ. ดร. กิตติพงษ์ ชาญชัย"],
    difficulty: 4.0,
    satisfaction: 3.9,
    scoring: [
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Assignment', percent: 30, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['Language Design Principles', 'Syntax & BNF Grammar', 'Lexical Analysis & Parsing', 'Type Systems & Checking'],
      final: ['Functional Programming (Haskell/Lisp)', 'Logic Programming (Prolog)', 'Memory Management', 'Concurrency & Parallelism'],
    },
  },
  "040613304": {
    code: "040613304",
    name: "การบริหารโครงการ",
    nameEn: "Project Management",
    credits: "3(2-2-5)",
    prereq: "040613302",
    description: "ศึกษาหลักการบริหารโครงการซอฟต์แวร์ ครอบคลุม PMBOK, Agile/Scrum, Risk Management, Cost Estimation, Scheduling และการใช้เครื่องมือบริหารโครงการ",
    professors: ["ผศ. ดร. มนัสวี สมบัติ"],
    difficulty: 2.8,
    satisfaction: 4.1,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Group Project', percent: 30, color: 'bg-blue-500' },
      { label: 'Participation', percent: 10, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['Project Management Fundamentals', 'Scope & Requirement Management', 'WBS & Scheduling (Gantt/PERT)', 'Cost Estimation'],
      final: ['Agile & Scrum Framework', 'Risk Management', 'Quality Assurance', 'Project Communication & Closure'],
    },
  },
  "040613111": {
    code: "040613111",
    name: "ดิจิทัลและระบบตรรกะ",
    nameEn: "Digital and Logic Systems",
    credits: "3(3-0-6)",
    prereq: null,
    description: "ศึกษาพื้นฐานระบบดิจิทัลและตรรกะ ครอบคลุมระบบเลขฐาน รหัส Boolean Algebra, Logic Gate, Combinational และ Sequential Circuit เน้นการประยุกต์ใช้ในระบบคอมพิวเตอร์",
    professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"],
    difficulty: 3.2,
    satisfaction: 3.7,
    scoring: [
      { label: 'Midterm', percent: 35, color: 'bg-orange-500' },
      { label: 'Final', percent: 35, color: 'bg-red-500' },
      { label: 'Lab', percent: 20, color: 'bg-green-500' },
      { label: 'Quiz', percent: 10, color: 'bg-yellow-400' },
    ],
    topics: {
      midterm: ['Number Systems & Codes', 'Boolean Algebra & Theorems', 'Logic Gates & Circuits', 'Karnaugh Map'],
      final: ['Combinational Logic Design', 'Adders, Encoders, MUX', 'Flip-Flops & Latches', 'Sequential Logic & FSM'],
    },
  },
  "040613305": {
    code: "040613305",
    name: "สถาปัตยกรรมซอฟต์แวร์",
    nameEn: "Software Architecture",
    credits: "3(3-0-6)",
    prereq: "040613302",
    description: "ศึกษารูปแบบสถาปัตยกรรมซอฟต์แวร์ ครอบคลุม Layered, Microservices, Event-driven, MVC, Design Patterns (GoF) และการประเมิณคุณภาพสถาปัตยกรรม",
    professors: ["ผศ. ดร. วิชัย ประดิษฐ์ธรรม"],
    difficulty: 3.8,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Architecture Document', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Architecture Styles & Patterns', 'Layered & Pipe-and-Filter', 'MVC & MVP', 'GoF Design Patterns (Creational/Structural)'],
      final: ['GoF Design Patterns (Behavioral)', 'Microservices Architecture', 'Event-driven Architecture', 'Architecture Quality Attributes (ATAM)'],
    },
  },
  "040613307": {
    code: "040613307",
    name: "การทดสอบซอฟต์แวร์",
    nameEn: "Software Testing",
    credits: "3(3-0-6)",
    prereq: "040613302",
    description: "ศึกษากระบวนการและเทคนิคการทดสอบซอฟต์แวร์ ครอบคลุม Unit Test, Integration Test, System Test, Black-box & White-box Testing, TDD และ Automation Testing",
    professors: ["ผศ. ดร. วิชัย ประดิษฐ์ธรรม"],
    difficulty: 3.5,
    satisfaction: 4.0,
    scoring: [
      { label: 'Midterm', percent: 30, color: 'bg-orange-500' },
      { label: 'Final', percent: 30, color: 'bg-red-500' },
      { label: 'Testing Lab/Project', percent: 40, color: 'bg-green-500' },
    ],
    topics: {
      midterm: ['Testing Fundamentals & V-Model', 'Black-box Testing (Equivalence/Boundary)', 'White-box Testing (Coverage)', 'Unit Testing (JUnit/pytest)'],
      final: ['Integration & System Testing', 'TDD & BDD', 'Test Automation (Selenium)', 'Performance & Security Testing'],
    },
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

  Outside: { "040613201": "base", "040613203": "base", "040613204": "base",
             "040613207": "outside", "040613111": "outside",
             "040613301": "base", "040613302": "outside", "040613304": "outside",
             "040613305": "outside", "040613307": "outside" },
};