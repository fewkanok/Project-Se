// // ข้อมูลวิชาเลือกทั้งหมดที่มีให้เลือก
// export const ELECTIVE_POOL = [
//     // === Core CS Electives ===
//     {
//         id: 'ELEC-CS-001',
//         code: 'CS401',
//         name: 'Advanced Algorithms',
//         credits: 3,
//         category: 'Core CS',
//         description: 'Advanced algorithmic techniques and complexity theory'
//     },
//     {
//         id: 'ELEC-CS-002',
//         code: 'CS402',
//         name: 'Compiler Design',
//         credits: 3,
//         category: 'Core CS',
//         description: 'Principles of compiler construction and optimization'
//     },
//     {
//         id: 'ELEC-CS-003',
//         code: 'CS403',
//         name: 'Computer Graphics',
//         credits: 3,
//         category: 'Core CS',
//         description: '2D/3D graphics, rendering, and visualization'
//     },
//     {
//         id: 'ELEC-CS-004',
//         code: 'CS404',
//         name: 'Parallel Computing',
//         credits: 3,
//         category: 'Core CS',
//         description: 'Parallel algorithms and distributed systems'
//     },
//     {
//         id: 'ELEC-CS-005',
//         code: 'CS405',
//         name: 'Theory of Computation',
//         credits: 3,
//         category: 'Core CS',
//         description: 'Automata theory, formal languages, and computability'
//     },

//     // === AI & Machine Learning ===
//     {
//         id: 'ELEC-AI-001',
//         code: 'AI301',
//         name: 'Deep Learning',
//         credits: 3,
//         category: 'AI & ML',
//         description: 'Neural networks, CNNs, RNNs, and transformers'
//     },
//     {
//         id: 'ELEC-AI-002',
//         code: 'AI302',
//         name: 'Natural Language Processing',
//         credits: 3,
//         category: 'AI & ML',
//         description: 'Text processing, language models, and NLP applications'
//     },
//     {
//         id: 'ELEC-AI-003',
//         code: 'AI303',
//         name: 'Computer Vision',
//         credits: 3,
//         category: 'AI & ML',
//         description: 'Image processing, object detection, and recognition'
//     },
//     {
//         id: 'ELEC-AI-004',
//         code: 'AI304',
//         name: 'Reinforcement Learning',
//         credits: 3,
//         category: 'AI & ML',
//         description: 'Agent-based learning and decision making'
//     },
//     {
//         id: 'ELEC-AI-005',
//         code: 'AI305',
//         name: 'Machine Learning Engineering',
//         credits: 3,
//         category: 'AI & ML',
//         description: 'ML deployment, MLOps, and production systems'
//     },

//     // === Web & Mobile Development ===
//     {
//         id: 'ELEC-WEB-001',
//         code: 'WEB301',
//         name: 'Advanced Web Development',
//         credits: 3,
//         category: 'Web & Mobile',
//         description: 'Modern web frameworks, React, Vue, and Angular'
//     },
//     {
//         id: 'ELEC-WEB-002',
//         code: 'WEB302',
//         name: 'Mobile Application Development',
//         credits: 3,
//         category: 'Web & Mobile',
//         description: 'iOS and Android app development'
//     },
//     {
//         id: 'ELEC-WEB-003',
//         code: 'WEB303',
//         name: 'Full-Stack Development',
//         credits: 3,
//         category: 'Web & Mobile',
//         description: 'End-to-end web application development'
//     },
//     {
//         id: 'ELEC-WEB-004',
//         code: 'WEB304',
//         name: 'Progressive Web Apps',
//         credits: 3,
//         category: 'Web & Mobile',
//         description: 'Building offline-capable web applications'
//     },
//     {
//         id: 'ELEC-WEB-005',
//         code: 'WEB305',
//         name: 'UI/UX Design for Developers',
//         credits: 3,
//         category: 'Web & Mobile',
//         description: 'Design principles and user experience'
//     },

//     // === Data Science & Analytics ===
//     {
//         id: 'ELEC-DATA-001',
//         code: 'DATA301',
//         name: 'Big Data Analytics',
//         credits: 3,
//         category: 'Data Science',
//         description: 'Hadoop, Spark, and large-scale data processing'
//     },
//     {
//         id: 'ELEC-DATA-002',
//         code: 'DATA302',
//         name: 'Data Mining',
//         credits: 3,
//         category: 'Data Science',
//         description: 'Pattern discovery and knowledge extraction'
//     },
//     {
//         id: 'ELEC-DATA-003',
//         code: 'DATA303',
//         name: 'Data Visualization',
//         credits: 3,
//         category: 'Data Science',
//         description: 'Visual analytics and interactive dashboards'
//     },
//     {
//         id: 'ELEC-DATA-004',
//         code: 'DATA304',
//         name: 'Statistical Machine Learning',
//         credits: 3,
//         category: 'Data Science',
//         description: 'Statistical methods for ML and inference'
//     },
//     {
//         id: 'ELEC-DATA-005',
//         code: 'DATA305',
//         name: 'Time Series Analysis',
//         credits: 3,
//         category: 'Data Science',
//         description: 'Forecasting and temporal data analysis'
//     },

//     // === Cybersecurity ===
//     {
//         id: 'ELEC-SEC-001',
//         code: 'SEC301',
//         name: 'Ethical Hacking',
//         credits: 3,
//         category: 'Cybersecurity',
//         description: 'Penetration testing and security auditing'
//     },
//     {
//         id: 'ELEC-SEC-002',
//         code: 'SEC302',
//         name: 'Cryptography',
//         credits: 3,
//         category: 'Cybersecurity',
//         description: 'Encryption, digital signatures, and protocols'
//     },
//     {
//         id: 'ELEC-SEC-003',
//         code: 'SEC303',
//         name: 'Network Security',
//         credits: 3,
//         category: 'Cybersecurity',
//         description: 'Firewalls, IDS/IPS, and secure networks'
//     },
//     {
//         id: 'ELEC-SEC-004',
//         code: 'SEC304',
//         name: 'Application Security',
//         credits: 3,
//         category: 'Cybersecurity',
//         description: 'Secure coding and vulnerability prevention'
//     },
//     {
//         id: 'ELEC-SEC-005',
//         code: 'SEC305',
//         name: 'Digital Forensics',
//         credits: 3,
//         category: 'Cybersecurity',
//         description: 'Evidence collection and cyber investigation'
//     },

//     // === Cloud & DevOps ===
//     {
//         id: 'ELEC-CLOUD-001',
//         code: 'CLOUD301',
//         name: 'Cloud Computing',
//         credits: 3,
//         category: 'Cloud & DevOps',
//         description: 'AWS, Azure, and cloud architecture'
//     },
//     {
//         id: 'ELEC-CLOUD-002',
//         code: 'CLOUD302',
//         name: 'DevOps Engineering',
//         credits: 3,
//         category: 'Cloud & DevOps',
//         description: 'CI/CD, containerization, and automation'
//     },
//     {
//         id: 'ELEC-CLOUD-003',
//         code: 'CLOUD303',
//         name: 'Microservices Architecture',
//         credits: 3,
//         category: 'Cloud & DevOps',
//         description: 'Distributed systems and service mesh'
//     },
//     {
//         id: 'ELEC-CLOUD-004',
//         code: 'CLOUD304',
//         name: 'Kubernetes & Container Orchestration',
//         credits: 3,
//         category: 'Cloud & DevOps',
//         description: 'Container management at scale'
//     },
//     {
//         id: 'ELEC-CLOUD-005',
//         code: 'CLOUD305',
//         name: 'Infrastructure as Code',
//         credits: 3,
//         category: 'Cloud & DevOps',
//         description: 'Terraform, Ansible, and automation tools'
//     },

//     // === Game Development ===
//     {
//         id: 'ELEC-GAME-001',
//         code: 'GAME301',
//         name: 'Game Engine Development',
//         credits: 3,
//         category: 'Game Development',
//         description: 'Building game engines from scratch'
//     },
//     {
//         id: 'ELEC-GAME-002',
//         code: 'GAME302',
//         name: '3D Game Programming',
//         credits: 3,
//         category: 'Game Development',
//         description: 'Unity and Unreal Engine development'
//     },
//     {
//         id: 'ELEC-GAME-003',
//         code: 'GAME303',
//         name: 'Game AI',
//         credits: 3,
//         category: 'Game Development',
//         description: 'NPC behavior and procedural generation'
//     },
//     {
//         id: 'ELEC-GAME-004',
//         code: 'GAME304',
//         name: 'Virtual Reality Development',
//         credits: 3,
//         category: 'Game Development',
//         description: 'VR/AR application development'
//     },

//     // === IoT & Embedded Systems ===
//     {
//         id: 'ELEC-IOT-001',
//         code: 'IOT301',
//         name: 'Internet of Things',
//         credits: 3,
//         category: 'IoT & Embedded',
//         description: 'IoT protocols, sensors, and edge computing'
//     },
//     {
//         id: 'ELEC-IOT-002',
//         code: 'IOT302',
//         name: 'Embedded Systems Programming',
//         credits: 3,
//         category: 'IoT & Embedded',
//         description: 'Microcontrollers and real-time systems'
//     },
//     {
//         id: 'ELEC-IOT-003',
//         code: 'IOT303',
//         name: 'Robotics',
//         credits: 3,
//         category: 'IoT & Embedded',
//         description: 'Robot control and autonomous systems'
//     },

//     // === Blockchain & Web3 ===
//     {
//         id: 'ELEC-BLOCK-001',
//         code: 'BLOCK301',
//         name: 'Blockchain Technology',
//         credits: 3,
//         category: 'Blockchain',
//         description: 'Distributed ledgers and consensus algorithms'
//     },
//     {
//         id: 'ELEC-BLOCK-002',
//         code: 'BLOCK302',
//         name: 'Smart Contract Development',
//         credits: 3,
//         category: 'Blockchain',
//         description: 'Solidity and Ethereum development'
//     },
//     {
//         id: 'ELEC-BLOCK-003',
//         code: 'BLOCK303',
//         name: 'Decentralized Applications',
//         credits: 3,
//         category: 'Blockchain',
//         description: 'Building DApps and Web3 interfaces'
//     },

//     // === Interdisciplinary ===
//     {
//         id: 'ELEC-INTER-001',
//         code: 'INTER301',
//         name: 'Quantum Computing',
//         credits: 3,
//         category: 'Interdisciplinary',
//         description: 'Quantum algorithms and computing principles'
//     },
//     {
//         id: 'ELEC-INTER-002',
//         code: 'INTER302',
//         name: 'Bioinformatics',
//         credits: 3,
//         category: 'Interdisciplinary',
//         description: 'Computational biology and genomics'
//     },
//     {
//         id: 'ELEC-INTER-003',
//         code: 'INTER303',
//         name: 'Human-Computer Interaction',
//         credits: 3,
//         category: 'Interdisciplinary',
//         description: 'Interface design and usability studies'
//     },
//     {
//         id: 'ELEC-INTER-004',
//         code: 'INTER304',
//         name: 'Digital Signal Processing',
//         credits: 3,
//         category: 'Interdisciplinary',
//         description: 'Audio/video processing and filters'
//     }
// ];

// 🎓 รายวิชาเสรีทั้งหมด
export const electiveCourses = [
  { id: '030953115', code: '030953115', name: 'สมาธิเพื่อการพัฒนา', credits: 3 },
  { id: '080203901', code: '080203901', name: 'มนุษย์กับสังคม', credits: 3 },
  { id: '080203904', code: '080203904', name: 'กฎหมายในชีวิตประจําวัน', credits: 3 },
  { id: '080303103', code: '080303103', name: 'จิตวิทยาเพื่อความสุขในการดำรงชีวิต', credits: 3 },
  { id: '080303401', code: '080303401', name: 'คาราโอเกะ', credits: 3 },
  { id: '080303601', code: '080303601', name: 'มนุษยสัมพันธ์', credits: 3 },
  { id: '080303609', code: '080303609', name: 'สุขภาพเพื่อชีวิต', credits: 3 },
  { id: '080303607', code: '080303607', name: 'ความปลอดภัยในชีวิต', credits: 3 },
  { id: '040313017', code: '040313017', name: 'ทักษะการออกกำลังกายและกีฬา', credits: 3 },
  { id: '040313018', code: '040313018', name: 'ร่างกายมนุษย์และสุขภาพ', credits: 3 },
  { id: '040713002', code: '040713002', name: 'วิทยาศาสตร์สุขภาพและโภชนาการ', credits: 3 },
  { id: '040713005', code: '040713005', name: 'สมุนไพรเพื่อสุขภาพ', credits: 3 },
  { id: '030923102', code: '030923102', name: 'วิทยาศาสตร์ในชีวิตประจำวัน', credits: 3 },
  { id: '030923103', code: '030923103', name: 'วิทยาศาสตร์และเทคโนโลยีเพื่อคุณภาพชีวิตและสังคม', credits: 3 },
  { id: '030923100', code: '030923100', name: 'Physics for Technologist', credits: 3 },
  { id: '030923101', code: '030923101', name: 'Energy Resources', credits: 3 },
  { id: '030943131', code: '030943131', name: 'คณิตศาสตร์ในชีวิตประจําวัน', credits: 3 }
];