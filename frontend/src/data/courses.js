// src/data/courses.js

export const roadmapData = [
  // --- YEAR 1 ---
  {
    year: "Year 1",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          {
            id: '040203101', code: '040203101', name: 'MATHEMATICS I', credits: 3, status: 'passed', prereq: null,
            description: 'ศึกษาแคลคูลัสเบื้องต้น ลิมิต อนุพันธ์ และปริพันธ์ของฟังก์ชันตัวแปรเดียว รวมถึงการประยุกต์ใช้ในการแก้ปัญหาทางวิทยาศาสตร์และวิศวกรรม',
            professors: ['Assoc. Prof. Wanchai', 'Dr. Nipa'],
            difficulty: 4.0,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
              { label: 'Quizzes',      percent: 30, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['Limits & Continuity', 'Derivatives', 'Applications of Derivatives'],
              final:   ['Integration', 'Techniques of Integration', 'Applications of Integration'],
            },
          },
          {
            id: '040613103', code: '040613103', name: 'DISCRETE MATH. FOR CS', credits: 3, status: 'passed', prereq: null,
            description: 'ตรรกศาสตร์ เซต ความสัมพันธ์และฟังก์ชัน ทฤษฎีกราฟ การนับ ความน่าจะเป็น และการพิสูจน์ทางคณิตศาสตร์ สำหรับการเรียนวิทยาการคอมพิวเตอร์',
            professors: ['Dr. Pradit'],
            difficulty: 3.5,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 30, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['Logic & Proofs', 'Set Theory', 'Relations & Functions'],
              final:   ['Graph Theory', 'Counting & Combinatorics', 'Probability Basics'],
            },
          },
          {
            id: '040613201', code: '040613201', name: 'COMPUTER PROGRAMMING I', credits: 3, status: 'passed', prereq: null,
            description: 'แนะนำภาษาโปรแกรมมิ่ง การเขียนโปรแกรมเบื้องต้น ตัวแปร ประเภทข้อมูล คำสั่งควบคุม ฟังก์ชัน และการแก้ปัญหาด้วยอัลกอริทึมอย่างเป็นระบบ',
            professors: ['Dr. Somsak', 'Asst. Prof. Kannika'],
            difficulty: 3.0,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam',     percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',       percent: 30, color: 'bg-red-500'    },
              { label: 'Labs & Projects',  percent: 40, color: 'bg-green-500'  },
            ],
            topics: {
              midterm: ['Intro to Programming', 'Variables & Data Types', 'Control Flow', 'Functions'],
              final:   ['Arrays', 'Pointers & Memory', 'File I/O', 'Basic Algorithms'],
            },
          },
          {
            id: '040613100', code: '040613100', name: 'FUNDAMENTAL OF CS', credits: 3, status: 'passed', prereq: null,
            description: 'ภาพรวมของวิทยาการคอมพิวเตอร์ ประวัติของคอมพิวเตอร์ สถาปัตยกรรม ระบบปฏิบัติการ เครือข่าย ฐานข้อมูล และแนวโน้มเทคโนโลยีในอนาคต',
            professors: ['Prof. Montri'],
            difficulty: 2.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Report',       percent: 20, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['History of Computing', 'Hardware & Architecture', 'Number Systems'],
              final:   ['OS Concepts', 'Networking Basics', 'Database Overview', 'Future Trends'],
            },
          },
          {
            id: '0802xxxxx', code: '0802xxxxx', name: 'SOCIAL SCIENCES ELECTIVE', credits: 3, status: 'passed', prereq: null,
            description: 'วิชาเลือกด้านสังคมศาสตร์ ให้นักศึกษาเลือกเรียนตามความสนใจ เช่น สังคมวิทยา รัฐศาสตร์ เศรษฐศาสตร์ หรือจิตวิทยาเบื้องต้น',
            professors: ['TBA'],
            difficulty: 2.0,
            satisfaction: 3.8,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 20, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['TBA'],
              final:   ['TBA'],
            },
          },
          {
            id: '04xxxxxxx', code: '04xxxxxxx', name: 'SCIENCES & MATH ELECTIVE', credits: 3, status: 'passed', prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ ให้นักศึกษาเลือกเรียนตามความสนใจ เพื่อเสริมพื้นฐานทางวิทยาศาสตร์',
            professors: ['TBA'],
            difficulty: 3.0,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 20, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['TBA'],
              final:   ['TBA'],
            },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: '040613104', code: '040613104', name: 'MATHEMATICS FOR COMPUTER', credits: 3, status: 'passed', prereq: '040203101',
            description: 'คณิตศาสตร์สำหรับคอมพิวเตอร์ ได้แก่ พีชคณิตเชิงเส้น แมทริกซ์ การแปลงฟูเรียร์ และคณิตศาสตร์สำหรับกราฟิกส์และการประมวลผลสัญญาณ',
            professors: ['Assoc. Prof. Wanchai'],
            difficulty: 4.0,
            satisfaction: 3.8,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 30, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['Vectors & Matrices', 'Linear Transformations', 'Determinants'],
              final:   ['Eigenvalues', 'Fourier Basics', 'Applications in CS'],
            },
          },
          {
            id: '040613301', code: '040613301', name: 'DATABASE SYSTEMS', credits: 3, status: 'passed', prereq: '040613201',
            description: 'แนวคิดระบบฐานข้อมูล แบบจำลอง ER การออกแบบฐานข้อมูลเชิงสัมพันธ์ ภาษา SQL การ Normalize และการจัดการธุรกรรม',
            professors: ['Dr. Manee', 'Asst. Prof. Suree'],
            difficulty: 3.5,
            satisfaction: 4.2,
            scoring: [
              { label: 'Midterm Exam',  percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',    percent: 30, color: 'bg-red-500'    },
              { label: 'Project & Lab', percent: 40, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['ER Diagram', 'Relational Model', 'SQL Basics'],
              final:   ['Normalization', 'Transactions & Concurrency', 'Database Design Project'],
            },
          },
          {
            id: '040613203', code: '040613203', name: 'STRUCTURE PROGRAMMING', credits: 3, status: 'passed', prereq: '040613201',
            description: 'เทคนิคการเขียนโปรแกรมแบบมีโครงสร้าง การแยกย่อยปัญหา การเขียน Modular Code รูปแบบ Procedure/Function และการ Debug',
            professors: ['Dr. Somsak'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 30, color: 'bg-red-500'    },
              { label: 'Labs',         percent: 40, color: 'bg-green-500'  },
            ],
            topics: {
              midterm: ['Structured Design', 'Modules & Functions', 'Recursion'],
              final:   ['Debugging Techniques', 'Code Optimization', 'Case Studies'],
            },
          },
          {
            id: '040613501', code: '040613501', name: 'ORG & OPERATING SYSTEM', credits: 3, status: 'passed', prereq: '040613100',
            description: 'สถาปัตยกรรมคอมพิวเตอร์ CPU หน่วยความจำ I/O และระบบปฏิบัติการ กระบวนการ การจัดการหน่วยความจำ การจัดตาราง และ Deadlock',
            professors: ['Dr. Pakorn'],
            difficulty: 4.5,
            satisfaction: 3.7,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['Computer Architecture', 'CPU & ALU', 'Memory Hierarchy'],
              final:   ['Process Management', 'Scheduling Algorithms', 'Deadlock & Virtual Memory'],
            },
          },
          {
            id: '040613303', code: '040613303', name: 'HUMAN COMPUTER INTERACTION', credits: 3, status: 'passed', prereq: null,
            description: 'หลักการออกแบบส่วนติดต่อผู้ใช้ที่ดี UX/UI Design Thinking การทดสอบความสามารถในการใช้งาน (Usability Testing) และแนวโน้มใหม่ในการโต้ตอบระหว่างมนุษย์กับคอมพิวเตอร์',
            professors: ['Asst. Prof. Nattida'],
            difficulty: 2.5,
            satisfaction: 4.6,
            scoring: [
              { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 25, color: 'bg-red-500'    },
              { label: 'UI Project',   percent: 50, color: 'bg-pink-500'   },
            ],
            topics: {
              midterm: ['HCI Principles', 'Design Heuristics', 'Prototyping'],
              final:   ['Usability Testing', 'Accessibility', 'Mobile & Emerging UI'],
            },
          },
          {
            id: '040503011', code: '040503011', name: 'STAT. FOR ENGINEERS', credits: 3, status: 'passed', prereq: null,
            description: 'สถิติเบื้องต้นสำหรับวิศวกร การแจกแจงความน่าจะเป็น การทดสอบสมมติฐาน การถดถอยเชิงเส้น และการควบคุมคุณภาพเชิงสถิติ',
            professors: ['Dr. Ratree'],
            difficulty: 3.8,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Quizzes',      percent: 20, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['Descriptive Statistics', 'Probability Distributions', 'Sampling'],
              final:   ['Hypothesis Testing', 'Linear Regression', 'Statistical Quality Control'],
            },
          },
        ]
      }
    ]
  },

  // --- YEAR 2 ---
  {
    year: "Year 2",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          {
            id: '040613105', code: '040613105', name: 'NUMERICAL METHODS', credits: 3, status: 'passed', prereq: '040613104',
            description: 'วิธีเชิงตัวเลขสำหรับการแก้สมการ การหาค่าประมาณ การอินทิเกรตเชิงตัวเลข และการแก้สมการเชิงอนุพันธ์ด้วยคอมพิวเตอร์',
            professors: ['Dr. Chaiwat'],
            difficulty: 4.2,
            satisfaction: 3.6,
            scoring: [
              { label: 'Midterm Exam',            percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',              percent: 35, color: 'bg-red-500'    },
              { label: 'Programming Assignments', percent: 30, color: 'bg-green-500'  },
            ],
            topics: {
              midterm: ['Roots of Equations', 'Systems of Linear Equations', 'Interpolation'],
              final:   ['Numerical Integration', 'ODE Solvers', 'Error Analysis'],
            },
          },
          {
            id: '040613205', code: '040613205', name: 'DATA STRUCTURE', credits: 3, status: 'passed', prereq: '040613201',
            description: 'โครงสร้างข้อมูลพื้นฐาน ได้แก่ Array, Linked List, Stack, Queue, Tree, Graph และ Hash Table รวมถึง Algorithm ที่เกี่ยวข้องกับการค้นหาและการเรียงลำดับ',
            professors: ['Assoc. Prof. Veera', 'Dr. Kittisak'],
            difficulty: 4.5,
            satisfaction: 4.3,
            scoring: [
              { label: 'Midterm Exam',    percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',      percent: 30, color: 'bg-red-500'    },
              { label: 'Labs & Projects', percent: 40, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['Arrays & Linked Lists', 'Stacks & Queues', 'Recursion', 'Trees'],
              final:   ['Graphs', 'Sorting Algorithms', 'Hash Tables', 'Heap'],
            },
          },
          {
            id: '040613204', code: '040613204', name: 'OOP', credits: 3, status: 'passed', prereq: '040613203',
            description: 'การเขียนโปรแกรมเชิงวัตถุ (OOP) แนวคิด Class, Object, Inheritance, Polymorphism, Encapsulation และ Design Patterns เบื้องต้น',
            professors: ['Dr. Somsak', 'Asst. Prof. Kannika'],
            difficulty: 3.8,
            satisfaction: 4.4,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 30, color: 'bg-red-500'    },
              { label: 'Project',      percent: 40, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['OOP Principles', 'Classes & Objects', 'Inheritance', 'Polymorphism'],
              final:   ['Abstract Classes & Interfaces', 'Exceptions', 'Design Patterns', 'OOP Project'],
            },
          },
          {
            id: '040613302', code: '040613302', name: 'SYSTEM ANALYSIS AND DESIGN', credits: 3, status: 'passed', prereq: '040613301',
            description: 'กระบวนการวิเคราะห์และออกแบบระบบสารสนเทศ การเก็บรวบรวมความต้องการ การสร้าง Use Case, DFD, Class Diagram และการจัดทำเอกสารระบบ',
            professors: ['Dr. Manee'],
            difficulty: 3.2,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam',           percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam',             percent: 25, color: 'bg-red-500'    },
              { label: 'System Analysis Project',percent: 50, color: 'bg-teal-500'   },
            ],
            topics: {
              midterm: ['SDLC', 'Requirements Gathering', 'Use Case Diagram', 'DFD'],
              final:   ['Class Diagram', 'System Design', 'Documentation', 'Presentation'],
            },
          },
          {
            id: '040613xxx', code: '040613xxx', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'passed', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ เช่น Web Dev, Mobile, AI, Cybersecurity หรือ Cloud Computing',
            professors: ['TBA'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
              { label: 'Project',      percent: 30, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['TBA'],
              final:   ['TBA'],
            },
          },
          {
            id: '08xxxxxxx', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'passed', prereq: null,
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น ภาษาจีน หรือการสื่อสารเพื่อธุรกิจ เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'],
            difficulty: 2.5,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam',   percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',     percent: 30, color: 'bg-red-500'    },
              { label: 'Participation',  percent: 40, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final:   ['TBA'],
            },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: '040613502', code: '040613502', name: 'COMPUTER NETWORKS', credits: 3, status: 'active', prereq: '040613501',
            description: 'หลักการเครือข่ายคอมพิวเตอร์ โมเดล OSI/TCP-IP โปรโตคอล การกำหนดเส้นทาง (Routing) การสื่อสารข้อมูล และแนวคิด Cloud Networking',
            professors: ['Dr. Pakorn', 'Asst. Prof. Thitima'],
            difficulty: 4.0,
            satisfaction: 4.1,
            scoring: [
              { label: 'Midterm Exam',        percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',          percent: 35, color: 'bg-red-500'    },
              { label: 'Lab (Packet Tracer)', percent: 30, color: 'bg-blue-500'   },
            ],
            topics: {
              midterm: ['OSI & TCP/IP Model', 'Data Link Layer', 'IP Addressing & Subnetting'],
              final:   ['Routing Protocols', 'Transport Layer', 'Application Layer Protocols', 'Network Security Basics'],
            },
          },
          {
            id: '040613206', code: '040613206', name: 'DESIGN & ANALYSIS ALGO', credits: 3, status: 'active', prereq: '040613205',
            description: 'การวิเคราะห์และออกแบบอัลกอริทึมที่มีประสิทธิภาพ การวิเคราะห์ความซับซ้อน (Big-O) Divide & Conquer, Dynamic Programming, Greedy และ NP-Completeness',
            professors: ['Assoc. Prof. Veera'],
            difficulty: 5.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam',   percent: 40, color: 'bg-red-500'    },
              { label: 'Assignments',  percent: 20, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['Complexity Analysis', 'Divide & Conquer', 'Sorting & Searching'],
              final:   ['Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms', 'NP-Completeness'],
            },
          },
          {
            id: '040613701', code: '040613701', name: 'INTELLIGENT SYSTEMS', credits: 3, status: 'active', prereq: '040613205',
            description: 'แนะนำปัญญาประดิษฐ์และระบบอัจฉริยะ การค้นหา (Search), Logic, Machine Learning เบื้องต้น Neural Networks และการประยุกต์ใช้ AI ในงานจริง',
            professors: ['Dr. Kittisak', 'Asst. Prof. Pornpan'],
            difficulty: 4.0,
            satisfaction: 4.7,
            scoring: [
              { label: 'Midterm Exam',    percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',      percent: 30, color: 'bg-red-500'    },
              { label: 'AI Mini-Project', percent: 40, color: 'bg-violet-500' },
            ],
            topics: {
              midterm: ['AI Concepts', 'Search Algorithms (BFS/DFS/A*)', 'Knowledge Representation'],
              final:   ['Machine Learning Basics', 'Neural Networks', 'AI Applications'],
            },
          },
          {
            id: '040613306', code: '040613306', name: 'SOFTWARE ENGINEERING', credits: 3, status: 'active', prereq: '040613302',
            description: 'กระบวนการพัฒนาซอฟต์แวร์ Agile/Scrum การจัดการโปรเจกต์ การทดสอบซอฟต์แวร์ การรับประกันคุณภาพ และการทำงานเป็นทีมในการสร้างซอฟต์แวร์จริง',
            professors: ['Dr. Manee', 'Asst. Prof. Suree'],
            difficulty: 3.5,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam',         percent: 20, color: 'bg-orange-500'  },
              { label: 'Final Exam',           percent: 20, color: 'bg-red-500'     },
              { label: 'Team Project (Agile)', percent: 60, color: 'bg-emerald-500' },
            ],
            topics: {
              midterm: ['SDLC & Agile', 'Requirements Engineering', 'UML & Architecture Design'],
              final:   ['Testing & QA', 'DevOps Basics', 'Team Project Demo & Review'],
            },
          },
          {
            id: '040613601', code: '040613601', name: 'COMPUTER SECURITY', credits: 3, status: 'active', prereq: '040613100',
            description: 'หลักการความปลอดภัยคอมพิวเตอร์ การเข้ารหัสลับ (Cryptography) การโจมตีและการป้องกัน Cybersecurity Frameworks และกฎหมายที่เกี่ยวข้อง',
            professors: ['Dr. Pakorn'],
            difficulty: 4.3,
            satisfaction: 4.2,
            scoring: [
              { label: 'Midterm Exam',   percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam',     percent: 35, color: 'bg-red-500'    },
              { label: 'CTF Challenges', percent: 30, color: 'bg-cyan-500'   },
            ],
            topics: {
              midterm: ['CIA Triad', 'Cryptography', 'Authentication & Access Control'],
              final:   ['Network Attacks & Defense', 'Web Security', 'Incident Response', 'Cybersecurity Law'],
            },
          },
          {
            id: '08xxxxxxx-2', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'active', prereq: null,
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น ภาษาจีน หรือการสื่อสารเพื่อธุรกิจ เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'],
            difficulty: 2.5,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam',  percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam',    percent: 30, color: 'bg-red-500'    },
              { label: 'Participation', percent: 40, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final:   ['TBA'],
            },
          },
        ]
      }
    ]
  },

  // --- YEAR 3 ---
  {
    year: "Year 3",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          {
            id: 'PE1', code: 'PE-1', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE2', code: 'PE-2', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE3', code: 'PE-3', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE4', code: 'PE-4', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'SCI2', code: 'SCI-2', name: 'SCIENCES & MATH ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ เพื่อเสริมพื้นฐานทางวิทยาศาสตร์',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 3.5,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'LANG2', code: 'LANG-2', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกด้านภาษา เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: 'PE5', code: 'PE-5', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE6', code: 'PE-6', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE7', code: 'PE-7', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: '040003004', code: '040003004', name: 'DESIGN THINKING', credits: 3, status: 'locked', prereq: null,
            description: 'กระบวนการ Design Thinking เพื่อการแก้ปัญหาเชิงสร้างสรรค์ การ Empathize, Define, Ideate, Prototype และ Test โดยนำไปประยุกต์กับโปรเจกต์จริง',
            professors: ['Asst. Prof. Nattida'],
            difficulty: 2.0,
            satisfaction: 4.8,
            scoring: [
              { label: 'Participation', percent: 20, color: 'bg-orange-500' },
              { label: 'Workshop',      percent: 30, color: 'bg-blue-500'   },
              { label: 'Final Project', percent: 50, color: 'bg-pink-500'   },
            ],
            topics: {
              midterm: ['Empathy & Define', 'Ideation Techniques', 'Prototyping'],
              final:   ['User Testing', 'Iteration', 'Final Pitch Presentation'],
            },
          },
          {
            id: 'SPORT', code: 'SPORT', name: 'SPORT & RECREATION', credits: 1, status: 'locked', prereq: null,
            description: 'กิจกรรมกีฬาและนันทนาการเพื่อสุขภาพ นักศึกษาเลือกชนิดกีฬาตามความสนใจ เน้นการออกกำลังกายและการทำงานเป็นทีม',
            professors: ['Physical Education Dept.'],
            difficulty: 1.0,
            satisfaction: 4.9,
            scoring: [
              { label: 'Attendance & Participation', percent: 70, color: 'bg-green-500' },
              { label: 'Skill Assessment',           percent: 30, color: 'bg-blue-500'  },
            ],
            topics: {
              midterm: ['Sport Skills Training'],
              final:   ['Sport Competition / Assessment'],
            },
          },
          {
            id: 'LANG3', code: 'LANG-3', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกด้านภาษา เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      }
    ]
  },

  // --- YEAR 4 ---
  {
    year: "Year 4",
    semesters: [
      {
        term: "Summer / Term 1",
        courses: [
          {
            id: 'INTERNSHIP', code: 'INTERNSHIP', name: 'INTERNSHIP (240 hours)', credits: 0, status: 'locked', prereq: null,
            description: 'ฝึกงานในสถานประกอบการจริงไม่น้อยกว่า 240 ชั่วโมง นักศึกษาจะได้รับประสบการณ์การทำงานจริงในสายงานวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
            professors: ['Industry Supervisor', 'Faculty Advisor'],
            difficulty: 3.0,
            satisfaction: 4.8,
            scoring: [
              { label: 'Supervisor Evaluation', percent: 50, color: 'bg-blue-500'   },
              { label: 'Internship Report',      percent: 30, color: 'bg-green-500'  },
              { label: 'Presentation',           percent: 20, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['On-site Training', 'Professional Work Experience'],
              final:   ['Project Contribution', 'Internship Report Writing', 'Oral Presentation'],
            },
          },
        ]
      },
      {
        term: "Semester 1 (Project I)",
        courses: [
          {
            id: '040613141', code: '040613141', name: 'SPECIAL PROJECT I', credits: 1, status: 'locked', prereq: null,
            description: 'นักศึกษาเลือกหัวข้อโปรเจกต์พิเศษ วางแผนการดำเนินงาน ทบทวนวรรณกรรม และนำเสนอ Proposal ของโครงงานวิทยาการคอมพิวเตอร์',
            professors: ['Advisor (ตามที่นักศึกษาเลือก)'],
            difficulty: 3.5,
            satisfaction: 4.5,
            scoring: [
              { label: 'Proposal Report',        percent: 30, color: 'bg-blue-500'   },
              { label: 'Advisor Evaluation',     percent: 40, color: 'bg-orange-500' },
              { label: 'Committee Presentation', percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['Topic Selection', 'Literature Review', 'Proposal Writing'],
              final:   ['Proposal Presentation', 'Methodology Plan'],
            },
          },
          {
            id: 'PE8', code: 'PE-8', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE9', code: 'PE-9', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'FREE1', code: 'FREE-1', name: 'FREE ELECTIVE COURSE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเสรี นักศึกษาสามารถเลือกเรียนวิชาใดก็ได้ที่เปิดสอนในมหาวิทยาลัยตามความสนใจ',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      },
      {
        term: "Semester 2 (Project II)",
        courses: [
          {
            id: '040613142', code: '040613142', name: 'SPECIAL PROJECT II', credits: 3, status: 'locked', prereq: '040613141',
            description: 'นักศึกษาพัฒนาระบบตามที่วางแผนใน Special Project I จัดทำเอกสาร ทดสอบระบบ และนำเสนอผลลัพธ์ต่อคณะกรรมการ',
            professors: ['Advisor (ตามที่นักศึกษาเลือก)'],
            difficulty: 4.5,
            satisfaction: 4.7,
            scoring: [
              { label: 'System Implementation', percent: 40, color: 'bg-green-500'  },
              { label: 'Final Report',          percent: 30, color: 'bg-blue-500'   },
              { label: 'Committee Evaluation',  percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['System Development', 'Testing & Debugging', 'Progress Report'],
              final:   ['Final System Demo', 'Documentation', 'Oral Defense'],
            },
          },
          {
            id: 'SOC2', code: 'SOC-2', name: 'SOCIAL SCIENCE ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกด้านสังคมศาสตร์ เช่น สังคมวิทยา รัฐศาสตร์ เศรษฐศาสตร์ หรือจิตวิทยาเบื้องต้น',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 3.8,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'HUM1', code: 'HUM-1', name: 'HUMANTIES ELECTIVE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกด้านมนุษยศาสตร์ เช่น ปรัชญา ประวัติศาสตร์ ศิลปะ หรือดนตรี เพื่อพัฒนามุมมองและความคิดสร้างสรรค์',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 4.2,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Essay/Report', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'FREE2', code: 'FREE-2', name: 'FREE ELECTIVE COURSE', credits: 3, status: 'locked', prereq: null,
            description: 'วิชาเลือกเสรี นักศึกษาสามารถเลือกเรียนวิชาใดก็ได้ที่เปิดสอนในมหาวิทยาลัยตามความสนใจ',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      }
    ]
  }
];