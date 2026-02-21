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
            id: '040203101', code: '040203101', name: 'MATHEMATICS I', credits: 3, prereq: null,
            description: 'ศึกษาลิมิตและความต่อเนื่อง, อนุพันธ์ของฟังก์ชัน, การประยุกต์ใช้อนุพันธ์ (ความชัน, อัตราสัมพัทธ์, ค่าสูงสุด-ต่ำสุด), และอินทิกรัล (Integral) ทั้งจำกัดและไม่จำกัดเขต',
            professors: ['รศ.ดร.พงศ์พล จันทรี', 'รศ.เสาวลักษณ์ เจศรีชัย', 'ผศ.ดร.จิราภรณ์ รื่นสัมฤทธิ์', 'และคณาจารย์ท่านอื่นๆ ในภาควิชา'],
            difficulty: 5.0,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 45, color: 'bg-red-500' },
              { label: 'Assignments', percent: 10, color: 'bg-blue-500' },
              { label: 'การเข้าชั้นเรียน', percent: 5, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['ลิมิตและความต่อเนื่อง', 'อนุพันธ์ (นิยาม, สูตรเบื้องต้น, กฎลูกโซ่)', 'อนุพันธ์ฟังก์ชันตรีโกณมิติ/ลอการิทึม', 'กฎของโลปิตาล', 'อัตราสัมพัทธ์'],
              final: ['ค่าสูงสุดและต่ำสุดสัมพัทธ์', 'การวาดกราฟ', 'ปริพันธ์ (Integration) เบื้องต้น', 'เทคนิคการอินทิเกรต', 'การหาพื้นที่ระหว่างเส้นโค้ง', 'ปริพันธ์เชิงตัวเลข'],
            },
          },
          {
            id: '040613103', code: '040613103', name: 'DISCRETE MATH. FOR CS', credits: 3, prereq: null,
            description: 'คณิตศาสตร์สำหรับคอมพิวเตอร์ เช่น เซต, ตรรกศาสตร์, การพิสูจน์, ความสัมพันธ์, ทฤษฎีกราฟ และพีชคณิตบูลีน',
            professors: ['ดร.สรร รัตนสัญญา', 'รศ.ดร.ธนภัทร์ อนุศาสน์อมรกุล', 'ผศ.ดร.ลือพล พิพานเมฆาภรณ์', 'อ.เอิญ สุริยะฉาย'],
            difficulty: 4.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'Assignments', percent: 15, color: 'bg-green-500' },
              { label: 'การมีส่วนร่วม', percent: 5, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['เซต', 'ตรรกศาสตร์', 'การอ้างเหตุผล', 'การพิสูจน์', 'ความสัมพันธ์และฟังก์ชัน'],
              final: ['ลำดับและอนุกรม', 'ความสัมพันธ์เวียนเกิด', 'ทฤษฎีกราฟ (Graphs)', 'ต้นไม้ (Trees)'],
            },
          },
          {
            id: '040613201', code: '040613201', name: 'COMPUTER PROGRAMMING I', credits: 3, prereq: null,
            description: 'แนะนำภาษาโปรแกรมมิ่ง การเขียนโปรแกรมเบื้องต้น ตัวแปร ประเภทข้อมูล คำสั่งควบคุม ฟังก์ชัน และการแก้ปัญหาด้วยอัลกอริทึมอย่างเป็นระบบ',
            professors: ['รองศาสตราจารย์ ดร.เฉียบวุฒิ รัตนวิไลสกุล (CHR)'],
            difficulty: 3.0,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Quiz', percent: 35, color: 'bg-blue-500' },
              { label: 'การมีส่วนร่วมในชั้นเรียน & Lap', percent: 5, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['Intro to Programming', 'Variables & Data Types', 'Control Flow', 'Functions'],
              final: ['Arrays', 'Pointers & Memory', 'File I/O', 'Basic Algorithms'],
            },
          },
          {
            id: '040613100', code: '040613100', name: 'FUNDAMENTAL OF CS', credits: 3, prereq: null,
            description: 'ปูพื้นฐานองค์ประกอบคอมพิวเตอร์, ระบบจำนวน, เครือข่ายและคลาวด์, การเขียนผังงาน (Flowchart) และรหัสจำลอง (Pseudocode), รวมถึงกฎหมายและจริยธรรมทางคอมพิวเตอร์',
            professors: ['อ.ณัฐวุฒิ สร้อยดอกสน', 'อ.ดร.ณัฐกิตติ์ จิตรเอื้อตระกูล'],
            difficulty: 1.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'การบ้าน 5 % / งานที่มอบหมาย( โปรเจคสร้างเว็บแนะนำตัว ) 15%', percent: 20, color: 'bg-blue-500' },
              { label: 'การมีส่วนร่วม', percent: 5, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['ระบบจำนวน (ฐานสอง, ฐานสิบ)', 'องค์ประกอบฮาร์ดแวร์', 'ระบบเครือข่ายเบื้องต้น', 'อินเทอร์เน็ตและการประมวลผลแบบคลาวด์'],
              final: ['ระบบปฏิบัติการ', 'ฐานข้อมูล', 'ความปลอดภัยคอมพิวเตอร์', 'วัฏจักรการพัฒนาระบบ (SDLC)', 'การเขียนผังงาน (Flowchart) และรหัสจำลอง'],
            },
          },
          {
            id: '0802xxxxx', code: '0802xxxxx', name: 'SOCIAL SCIENCES ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาศึกษาทั่วไปที่มุ่งเน้นให้เข้าใจหลักเศรษฐศาสตร์เพื่อการดำรงชีวิต ศึกษาพฤติกรรมมนุษย์ในการตัดสินใจเลือกทรัพยากรที่มีจำกัด กลไกราคาในตลาด (อุปสงค์-อุปทาน) ความรู้เรื่องการเงินส่วนบุคคล เช่น การวางแผนการใช้จ่าย การออม และการลงทุน รวมถึงความเข้าใจในระบบเศรษฐกิจภาพรวม การผลิต และการตลาด',
            professors: ['ดร.พิเศษพร วศวงศ์', 'ผศ.ดร.กมลนัทธ์ มีถาวร', 'ผศ.ดร.อรษา ตันติยะวงศ์ษา', 'ผศ.ดร.ภาตย์ สังข์แก้ว'],
            difficulty: 1.0,
            satisfaction: 3.8,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'Assignments', percent: 20, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['ความรู้เบื้องต้นทางเศรษฐศาสตร์', 'ระบบเศรษฐกิจ', 'อุปสงค์-อุปทาน', 'ดุลยภาพตลาด (กลไกราคา)', 'การตัดสินใจเลือกซื้อและวางแผนการใช้จ่าย'],
              final: ['การออมและการลงทุน (Saving & Investment)', 'การผลิต', 'หลักการตลาด'],
            },
          },
          {
            id: '04xxxxxxx', code: '04xxxxxxx', name: 'SCIENCES & MATH ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ ให้นักศึกษาเลือกเรียนตามความสนใจ เพื่อเสริมพื้นฐานทางวิทยาศาสตร์',
            professors: ['TBA'],
            difficulty: 3.0,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'Assignments', percent: 20, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final: ['TBA'],
            },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: '040613104', code: '040613104', name: 'MATHEMATICS FOR COMPUTER', credits: 3, prereq: '040203101',
            description: 'คณิตศาสตร์สำหรับคอมพิวเตอร์ ได้แก่ พีชคณิตเชิงเส้น แมทริกซ์ การแปลงฟูเรียร์ และคณิตศาสตร์สำหรับกราฟิกส์และการประมวลผลสัญญาณ',
            professors: ['Assoc. Prof. Wanchai'],
            difficulty: 4.0,
            satisfaction: 3.8,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Assignments', percent: 30, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['Vectors & Matrices', 'Linear Transformations', 'Determinants'],
              final: ['Eigenvalues', 'Fourier Basics', 'Applications in CS'],
            },
          },
          {
            id: '040613301', code: '040613301', name: 'DATABASE SYSTEMS', credits: 3, prereq: '040613201',
            description: 'แนวคิดระบบฐานข้อมูล แบบจำลอง ER การออกแบบฐานข้อมูลเชิงสัมพันธ์ ภาษา SQL การ Normalize และการจัดการธุรกรรม',
            professors: ['Dr. Manee', 'Asst. Prof. Suree'],
            difficulty: 3.5,
            satisfaction: 4.2,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Project & Lab', percent: 40, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['ER Diagram', 'Relational Model', 'SQL Basics'],
              final: ['Normalization', 'Transactions & Concurrency', 'Database Design Project'],
            },
          },
          {
            id: '040613203', code: '040613203', name: 'STRUCTURE PROGRAMMING', credits: 3, prereq: '040613201',
            description: 'เทคนิคการเขียนโปรแกรมแบบมีโครงสร้าง การแยกย่อยปัญหา การเขียน Modular Code รูปแบบ Procedure/Function และการ Debug',
            professors: ['Dr. Somsak'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Labs', percent: 40, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['Structured Design', 'Modules & Functions', 'Recursion'],
              final: ['Debugging Techniques', 'Code Optimization', 'Case Studies'],
            },
          },
          {
            id: '040613501', code: '040613501', name: 'ORG & OPERATING SYSTEM', credits: 3, prereq: '040613100',
            description: 'สถาปัตยกรรมคอมพิวเตอร์ CPU หน่วยความจำ I/O และระบบปฏิบัติการ กระบวนการ การจัดการหน่วยความจำ การจัดตาราง และ Deadlock',
            professors: ['Dr. Pakorn'],
            difficulty: 4.5,
            satisfaction: 3.7,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Assignments', percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['Computer Architecture', 'CPU & ALU', 'Memory Hierarchy'],
              final: ['Process Management', 'Scheduling Algorithms', 'Deadlock & Virtual Memory'],
            },
          },
          {
            id: '040613303', code: '040613303', name: 'HUMAN COMPUTER INTERACTION', credits: 3, prereq: null,
            description: 'ศึกษาศาสตร์การออกแบบที่เชื่อมโยงระหว่างผู้ใช้ (User) และระบบคอมพิวเตอร์ เน้นกระบวนการออกแบบที่ยึดผู้ใช้เป็นศูนย์กลาง (User-Centered Design) การทำความเข้าใจพฤติกรรมและจิตวิทยาของผู้ใช้ เพื่อสร้าง UI และ UX ที่ดี ใช้งานง่าย และมีประสิทธิภาพ',
            professors: ['TBA'],
            difficulty: 2.0,
            satisfaction: 4.6,
            scoring: [
              { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
              { label: 'UI Project', percent: 50, color: 'bg-pink-500' },
            ],
            topics: {
              midterm: ['นิยามและประวัติของ HCI', 'วิวัฒนาการของการโต้ตอบระหว่างคนกับเครื่อง', 'กระบวนการออกแบบ HCI', 'User-Centered Design'],
              final: ['Prototyping', 'Evaluation', 'Usability Testing'],
            },
          },
          {
            id: '040503011', code: '040503011', name: 'STAT. FOR ENGINEERS', credits: 3, prereq: null,
            description: 'สถิติเบื้องต้นสำหรับวิศวกร การแจกแจงความน่าจะเป็น การทดสอบสมมติฐาน การถดถอยเชิงเส้น และการควบคุมคุณภาพเชิงสถิติ',
            professors: ['Dr. Ratree'],
            difficulty: 3.8,
            satisfaction: 3.5,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'Quizzes', percent: 20, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['Descriptive Statistics', 'Probability Distributions', 'Sampling'],
              final: ['Hypothesis Testing', 'Linear Regression', 'Statistical Quality Control'],
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
            id: '040613105', code: '040613105', name: 'NUMERICAL METHODS', credits: 3, prereq: '040613104',
            description: 'วิธีเชิงตัวเลขสำหรับการแก้สมการ การหาค่าประมาณ การอินทิเกรตเชิงตัวเลข และการแก้สมการเชิงอนุพันธ์ด้วยคอมพิวเตอร์',
            professors: ['Dr. Chaiwat'],
            difficulty: 4.2,
            satisfaction: 3.6,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Programming Assignments', percent: 30, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['Roots of Equations', 'Systems of Linear Equations', 'Interpolation'],
              final: ['Numerical Integration', 'ODE Solvers', 'Error Analysis'],
            },
          },
          {
            id: '040613205', code: '040613205', name: 'DATA STRUCTURE', credits: 3, prereq: '040613201',
            description: 'โครงสร้างข้อมูลพื้นฐาน ได้แก่ Array, Linked List, Stack, Queue, Tree, Graph และ Hash Table รวมถึง Algorithm ที่เกี่ยวข้องกับการค้นหาและการเรียงลำดับ',
            professors: ['Assoc. Prof. Veera', 'Dr. Kittisak'],
            difficulty: 4.5,
            satisfaction: 4.3,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Labs & Projects', percent: 40, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['Arrays & Linked Lists', 'Stacks & Queues', 'Recursion', 'Trees'],
              final: ['Graphs', 'Sorting Algorithms', 'Hash Tables', 'Heap'],
            },
          },
          {
            id: '040613204', code: '040613204', name: 'OOP', credits: 3, prereq: '040613203',
            description: 'ศึกษาและปฏิบัติการเขียนโปรแกรมโดยใช้กระบวนทัศน์เชิงวัตถุ (Object-Oriented Paradigm) เน้นเรื่องการออกแบบ Class และ Object การจัดการข้อมูลแบบ Encapsulation การสืบทอดคุณสมบัติ (Inheritance) และการพ้องรูป (Polymorphism) รวมถึงการพัฒนา GUI และการจัดการ Threads',
            professors: ['ผศ.ดร.สุวัจชัย กมลสันติโรจน์', 'ผศ.สถิตย์ ประสมพันธ์'],
            difficulty: 4.0,
            satisfaction: 4.4,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Project', percent: 40, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['แนวคิด OOP', 'ชนิดข้อมูลแบบนามธรรม (ADT)', 'การสร้าง Class/Object', 'การห่อหุ้มข้อมูล (Encapsulation)', 'การสืบทอด (Inheritance)'],
              final: ['การพ้องรูป (Polymorphism)', 'การสร้าง GUI', 'การจัดการเหตุการณ์ (Event Handling)', 'การจัดการข้อผิดพลาด (Exception Handling)', 'Threads'],
            },
          },
          {
            id: '040613302', code: '040613302', name: 'SYSTEM ANALYSIS AND DESIGN', credits: 3, prereq: '040613301',
            description: 'ศึกษาหลักการและขั้นตอนในการวิเคราะห์ระบบสารสนเทศ เพื่อแก้ปัญหาหรือปรับปรุงกระบวนการทำงานในองค์กร เรียนรู้เครื่องมือและเทคนิคในการสำรวจความต้องการของผู้ใช้ การสร้างแบบจำลองระบบ (System Modeling) การออกแบบฐานข้อมูล และการออกแบบส่วนต่อประสานกับผู้ใช้',
            professors: ['ผศ.ดร.คันธารัตน์ อเนกบุณย์', 'ผศ.ดร.ธรรศฏภณ สุระศักดิ์'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
              { label: 'System Analysis Project', percent: 50, color: 'bg-teal-500' },
            ],
            topics: {
              midterm: ['SDLC', 'Requirements Gathering', 'Data Flow Diagram (DFD)', 'Use Case Diagram'],
              final: ['ER-Diagram', 'System Architecture', 'UI Design', 'Documentation & Presentation'],
            },
          },
          {
            id: '040613xxx', code: '040613xxx', name: 'PROFESSIONAL ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ เช่น Web Dev, Mobile, AI, Cybersecurity หรือ Cloud Computing',
            professors: ['TBA'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Project', percent: 30, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final: ['TBA'],
            },
          },
          {
            id: '08xxxxxxx', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น ภาษาจีน หรือการสื่อสารเพื่อธุรกิจ เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'],
            difficulty: 2.5,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Participation', percent: 40, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final: ['TBA'],
            },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: '040613502', code: '040613502', name: 'COMPUTER NETWORKS', credits: 3, prereq: '040613501',
            description: 'ศึกษาแบบจำลองเครือข่าย (Network Models) เช่น OSI และ TCP/IP, หน้าที่ของโพรโทคอลในแต่ละชั้น, การส่งข้อมูล, การตรวจสอบข้อผิดพลาด, เครือข่าย LAN/WAN, ความมั่นคงของเครือข่าย และสถาปัตยกรรมคลาวด์',
            professors: ['อ.ปรัชญาพร เลี้ยงสุทธิสกนธ์'],
            difficulty: 3.0,
            satisfaction: 4.1,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Assignments', percent: 10, color: 'bg-blue-500' },
              { label: 'การเข้าเรียน/Lab/งานที่มอบหมาย', percent: 20, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['ความหมายและองค์ประกอบเครือข่าย', 'แบบจำลองเครือข่าย (OSI, TCP/IP)', 'สัญญาณและการส่งข้อมูลในชั้นกายภาพ', 'การตรวจสอบข้อผิดพลาดในการส่งข้อมูล'],
              final: ['มาตรฐานเครือข่าย LAN/Wireless', 'ที่อยู่ไอพี (IP Address)', 'โพรโทคอลชั้นเน็ตเวิร์ค & VLAN', 'การจัดเส้นทาง (Routing)', 'โพรโทคอลในชั้น Transport'],
            },
          },
          {
            id: '040613206', code: '040613206', name: 'DESIGN & ANALYSIS ALGO', credits: 3, prereq: '040613205',
            description: 'หลักการออกแบบอัลกอริทึม, การวิเคราะห์ความซับซ้อน (Big-O), และเทคนิคการแก้ปัญหาแบบต่างๆ เช่น Divide and Conquer, Greedy, Dynamic Programming',
            professors: ['ผศ.ดร.สุวัจชัย กมลสันติโรจน์', 'ผศ.ดร.อัครา ประโยชน์', 'ดร.ยนตร์ชนก เขาแก้ว'],
            difficulty: 5.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'Assignments', percent: 20, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['พื้นฐานอัลกอริทึม', 'การวิเคราะห์ความซับซ้อน (Big-O)', 'Brute Force', 'Divide and Conquer'],
              final: ['Greedy Techniques', 'Dynamic Programming', 'Graph Algorithms (MST, Shortest Path)'],
            },
          },
          {
            id: '040613701', code: '040613701', name: 'INTELLIGENT SYSTEMS', credits: 3, prereq: '040613205',
            description: 'แนะนำปัญญาประดิษฐ์และระบบอัจฉริยะ การค้นหา (Search), Logic, Machine Learning เบื้องต้น Neural Networks และการประยุกต์ใช้ AI ในงานจริง',
            professors: ['Dr. Kittisak', 'Asst. Prof. Pornpan'],
            difficulty: 4.0,
            satisfaction: 4.7,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'AI Mini-Project', percent: 40, color: 'bg-violet-500' },
            ],
            topics: {
              midterm: ['AI Concepts', 'Search Algorithms (BFS/DFS/A*)', 'Knowledge Representation'],
              final: ['Machine Learning Basics', 'Neural Networks', 'AI Applications'],
            },
          },
          {
            id: '040613306', code: '040613306', name: 'SOFTWARE ENGINEERING', credits: 3, prereq: '040613302',
            description: 'ศึกษากระบวนการทางวิศวกรรมเพื่อการพัฒนาซอฟต์แวร์ที่มีคุณภาพ ครอบคลุมวงจรการพัฒนาระบบ (SDLC) ตั้งแต่การเก็บรวบรวมความต้องการ การวิเคราะห์ การออกแบบ การเขียนโค้ด การทดสอบระบบ ไปจนถึงการบำรุงรักษา รวมถึงการบริหารจัดการโครงการซอฟต์แวร์ให้สำเร็จตามกำหนดและงบประมาณ',
            professors: ['ผศ.สถิตย์ ประสมพันธ์'],
            difficulty: 3.0,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 20, color: 'bg-red-500' },
              { label: 'Team Project (Agile)', percent: 60, color: 'bg-emerald-500' },
            ],
            topics: {
              midterm: ['SDLC & Agile', 'Waterfall Model', 'Requirements Engineering', 'UML & Architecture Design'],
              final: ['Testing & QA', 'Maintenance', 'Project Management', 'Team Project Demo & Review'],
            },
          },
          {
            id: '040613601', code: '040613601', name: 'COMPUTER SECURITY', credits: 3, prereq: '040613100',
            description: 'ศึกษาภาพรวมและความสำคัญของการรักษาความมั่นคงของระบบคอมพิวเตอร์ ภัยคุกคามรูปแบบต่างๆ (Threats) หลักการวิทยาการรหัสลับ (Cryptography) การป้องกันมัลแวร์และความปลอดภัยของซอฟต์แวร์ รวมถึงความมั่นคงในระดับระบบปฏิบัติการ ฐานข้อมูล เครือข่าย IoT และ Cloud Computing ควบคู่กับกฎหมายและจริยธรรมที่เกี่ยวข้อง',
            professors: ['TBA'],
            difficulty: 4.0,
            satisfaction: 4.2,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Assignment 1 (พจนานุกรมคำศัพท์ บทที่ 1-6)', percent: 15, color: 'bg-cyan-500' },
              { label: 'Assignment 2 (พจนานุกรมคำศัพท์ บทที่ 7-12)', percent: 15, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['หลักการ Cryptography', 'ซอฟต์แวร์ประสงค์ร้าย (Malicious Software)', 'ความมั่นคงของระบบปฏิบัติการ (Authentication & Access Control)', 'ความมั่นคงของฐานข้อมูล'],
              final: ['ความมั่นคงของเว็บ (Web Security)', 'ภัยคุกคามทางอินเทอร์เน็ต (DoS, Firewall, IDS/IPS)', 'ความมั่นคงของ IoT และ Cloud', 'นโยบายความมั่นคง', 'กฎหมายคอมพิวเตอร์'],
            },
          },
          {
            id: '08xxxxxxx-2', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น ภาษาจีน หรือการสื่อสารเพื่อธุรกิจ เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['TBA'],
            difficulty: 2.5,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Participation', percent: 40, color: 'bg-yellow-500' },
            ],
            topics: {
              midterm: ['TBA'],
              final: ['TBA'],
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
            id: '040613702', code: '040613702', name: 'MACHINE LEARNING', credits: 3, prereq: '040613701',
            isProfessionalElective: true, slotIndex: 0,
            description: 'หลักการ Machine Learning แบบ Supervised, Unsupervised และ Reinforcement Learning การประมวลผลและเตรียมข้อมูล (Feature Engineering) โมเดลคลาสสิก (Linear/Logistic Regression, Decision Tree, SVM, k-NN) การประเมินโมเดล (Cross-validation, Confusion Matrix) และการนำไปใช้งานจริงด้วย scikit-learn/Python',
            professors: ['ผศ.ดร.ลือพล พิพานเมฆาภรณ์', 'อ.ดร.ยนต์ชนก เขาแก้ว'],
            difficulty: 4.0,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'ML Project', percent: 40, color: 'bg-violet-500' },
            ],
            topics: {
              midterm: ['Introduction to ML & Types of Learning', 'Data Preprocessing & Feature Engineering', 'Linear Regression & Logistic Regression', 'Decision Trees & Random Forest', 'Support Vector Machine (SVM)', 'k-Nearest Neighbors (k-NN)', 'Model Evaluation (Accuracy, Precision, Recall, F1, ROC)'],
              final: ['Unsupervised Learning (k-Means, DBSCAN, PCA)', 'Neural Networks & Deep Learning เบื้องต้น', 'Convolutional Neural Network (CNN)', 'Natural Language Processing เบื้องต้น', 'Ensemble Methods (Boosting, Bagging)', 'Model Deployment & ML Pipeline', 'Final Project Presentation'],
            },
          },
          {
            id: '040613604', code: '040613604', name: 'DIGITAL FORENSICS', credits: 3, prereq: '040613601',
            isProfessionalElective: true, slotIndex: 1,
            description: 'นิติวิทยาศาสตร์ดิจิทัล ครอบคลุมการจัดการพยานหลักฐาน (Chain of Custody) การรวบรวมและสำเนาข้อมูล (Disk Imaging) การกู้คืนไฟล์ที่ถูกลบ การวิเคราะห์ระบบไฟล์ (FAT, NTFS) การตรวจสอบ Log, Registry, Memory Forensics การซ่อนข้อมูล (Steganography) และ Network Forensics พร้อมการรายงานผลตามมาตรฐาน',
            professors: ['ผศ.ดร.ธรรศฏภณ สุระศักดิ์'],
            difficulty: 3.5,
            satisfaction: 4.2,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Lab & Case Study Report', percent: 30, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['Introduction to Digital Forensics & Laws', 'Chain of Custody & Evidence Handling', 'Disk Imaging (dd, FTK Imager)', 'File System Analysis (FAT32, NTFS, Ext4)', 'File Recovery & Carving', 'Registry Analysis & Windows Artifacts', 'Log File Analysis'],
              final: ['Memory Forensics (Volatility)', 'Network Forensics & Packet Analysis (Wireshark)', 'Mobile Device Forensics', 'Steganography Detection', 'Anti-Forensics Techniques', 'Report Writing & Expert Testimony', 'CTF / Case Study Final'],
            },
          },
          {
            id: '040613504', code: '040613504', name: 'INTER-NETWORKING TECHNOLOGY', credits: 3, prereq: '040613502',
            isProfessionalElective: true, slotIndex: 2,
            description: 'เทคโนโลยีการเชื่อมต่อระหว่างเครือข่าย โพรโทคอลจัดเส้นทางแบบ Static และ Dynamic (RIP, OSPF) การตั้งค่า Router และ Switch เบื้องต้น การออกแบบ VLAN, ACL, NAT การจัดการเครือข่าย (SNMP) และความมั่นคงของเครือข่าย มุ่งเน้นทักษะ Hands-on ระดับ CCNA',
            professors: ['อ.ปรัชญาพร เลี้ยงสุทธิสกนธ์'],
            difficulty: 3.0,
            satisfaction: 4.3,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Quiz 1', percent: 10, color: 'bg-blue-400' },
              { label: 'Quiz 2', percent: 10, color: 'bg-blue-500' },
              { label: 'งานที่มอบหมาย', percent: 10, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['ทบทวน OSI/TCP-IP Model & Subnetting', 'Router & Basic Router Configuration (Cisco IOS)', 'Static Routing vs Dynamic Routing', 'Dynamic Routing: RIP v1/v2', 'Dynamic Routing: OSPF (Single & Multi-Area)', 'DHCP Server Configuration', 'LAN Design & Switching Concepts'],
              final: ['Virtual LAN (VLAN) & Inter-VLAN Routing', 'Standard ACL (Access Control List)', 'Extended ACL', 'Network Address Translation (NAT) & PAT', 'Simple Network Management Protocol (SNMP)', 'WAN Technologies Overview', 'Final Lab Exam / Presentation'],
            },
          },
          {
            id: '040613411', code: '040613411', name: 'WEB DEVELOPMENT', credits: 3, prereq: '040613204',
            isProfessionalElective: true, slotIndex: 3,
            description: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่ ครอบคลุม HTML5 & CSS3 (Flexbox, Grid, Responsive Design), JavaScript (ES6+), DOM Manipulation, REST API (Fetch/Axios), การใช้ Git & GitHub และการ Deploy เว็บขึ้น Cloud Platform (Vercel, Netlify) โดยมีโปรเจกต์จริงทุกสัปดาห์',
            professors: ['TBA'],
            difficulty: 3.0,
            satisfaction: 4.6,
            scoring: [
              { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
              { label: 'Web Project (4 Mini + 1 Final)', percent: 50, color: 'bg-pink-500' },
            ],
            topics: {
              midterm: ['HTML5 Semantic Elements & Forms', 'CSS3: Flexbox, Grid, Animation', 'Responsive Design & Media Queries', 'JavaScript Basics (ES6+): let/const, Arrow fn, Destructuring', 'DOM Manipulation & Events', 'Asynchronous JS: Promise, Async/Await, Fetch API'],
              final: ['REST API Integration', 'Git & GitHub Workflow', 'Introduction to React.js / Vue.js', 'State Management เบื้องต้น', 'Web Performance & SEO Basics', 'Deployment (Vercel, Netlify, GitHub Pages)', 'Final Web Project Demo'],
            },
          },
          {
            id: 'SCI2', code: 'SCI-2', name: 'SCIENCES & MATH ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ เพื่อเสริมพื้นฐานทางวิทยาศาสตร์',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 3.5,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'LANG2', code: 'LANG-2', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
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
            id: '040613602', code: '040613602', name: 'NETWORK SECURITY', credits: 3, prereq: '040613502',
            isProfessionalElective: true, slotIndex: 4,
            description: 'แนวคิดด้านความมั่นคงของเครือข่าย วิทยาการรหัสลับ (Symmetric/Asymmetric) การพิสูจน์ตัวจริง (PKI, TLS/SSL) ความมั่นคงของเว็บ (OWASP Top 10) ซอฟต์แวร์ประสงค์ร้าย ระบบตรวจจับการบุกรุก (IDS/IPS) ฮันนีพอตและไฟร์วอลล์ ความมั่นคงของ Wi-Fi (WPA3) และการจัดการความมั่นคงเครือข่ายองค์กร',
            professors: ['รศ.ดร.ธนภัทร์ อนุศาสน์อมรกุล'],
            difficulty: 4.0,
            satisfaction: 4.3,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'Security Lab & Project', percent: 30, color: 'bg-cyan-600' },
            ],
            topics: {
              midterm: ['Network Security Fundamentals & Threat Landscape', 'Cryptography: Symmetric (AES, DES) & Asymmetric (RSA, ECC)', 'Public Key Infrastructure (PKI) & Digital Certificate', 'TLS/SSL & HTTPS Protocol', 'Authentication & Authorization (OAuth, JWT)', 'Firewalls (Packet Filter, Stateful, WAF)', 'VPN (IPSec, OpenVPN, WireGuard)'],
              final: ['Intrusion Detection & Prevention System (IDS/IPS)', 'Wireless Network Security (WPA2/WPA3, Evil Twin)', 'Web Security & OWASP Top 10', 'Denial of Service (DoS/DDoS) & Mitigation', 'Network Monitoring & Log Analysis (SIEM)', 'Honeypot & Deception Technology', 'Penetration Testing เบื้องต้น', 'Security Project Demo'],
            },
          },
          {
            id: '040613902', code: '040613902', name: 'INTERNET OF THINGS', credits: 3, prereq: '040613201',
            isProfessionalElective: true, slotIndex: 5,
            description: 'สถาปัตยกรรมและระบบนิเวศของ IoT เซ็นเซอร์และ Actuator การเขียนโปรแกรมบน ESP32/Raspberry Pi โพรโทคอล IoT (MQTT, CoAP, HTTP) การเชื่อมต่อกับ Cloud Platform (AWS IoT, Google Cloud IoT) Edge Computing ความมั่นคงของ IoT และการทำโปรเจกต์ Smart Device จริง',
            professors: ['รศ.ดร.กอบเกียรติ สระอุบล'],
            difficulty: 3.5,
            satisfaction: 4.4,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'IoT Project', percent: 40, color: 'bg-teal-500' },
            ],
            topics: {
              midterm: ['IoT Architecture & Layers (Perception, Network, Application)', 'Sensor & Actuator Types & Interfacing', 'Microcontroller: ESP32 / Arduino Programming', 'Single Board Computer: Raspberry Pi Basics', 'MQTT Protocol & Broker (Mosquitto)', 'CoAP & HTTP/REST for IoT', 'IoT Data Format: JSON, CBOR'],
              final: ['Cloud IoT Platform (AWS IoT Core, Node-RED, ThingSpeak)', 'Edge Computing & Fog Computing', 'IoT Security: Threats & Countermeasures', 'Data Analytics & Visualization for IoT', 'IPv6 & 6LoWPAN สำหรับ IoT', 'Smart Home / Smart City Application', 'IoT Final Project Demo'],
            },
          },
          {
            id: '040613304', code: '040613304', name: 'PROJECT MANAGEMENT', credits: 3, prereq: '040613302',
            isProfessionalElective: true, slotIndex: 6,
            description: 'วัฏจักรชีวิตของโครงการ การกำหนดและเริ่มต้นโครงการ การวางแผนโครงการ แผนภาพการจัดตารางเวลาโครงการภายใต้ข้อจำกัดทางทรัพยากร การปฏิบัติโครงการ การปิดโครงการ และกระบวนการพัฒนาแบบอไจล์',
            professors: ['อ.ณัฐวุฒิ สร้อยดอกสน'],
            difficulty: 3.0,
            satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
              { label: 'การบ้านหรืองานที่มอบหมาย + ความมีส่วนร่วมในชั้นเรียน', percent: 30, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['ภาพรวมของการบริหารโครงการ (Project Management Overview)', 'วัฎจักรชีวิตของโครงการ (Project Life Cycle)', 'ผู้บริหารโครงการ (Project Manager)', 'ระบบสารสนเทศ (Information Systems)', 'วัฎจักรชีวิตในการพัฒนาระบบ (SDLC I & II)', 'การกําหนดและเริ่มต้นโครงการ (Defining the Project)', 'การวางแผนโครงการ (Planning the Project)', 'การศึกษาความเป็นไปได้ของโครงการ (Project Feasibility)'],
              final: ['การกําหนดเวลางานโครงการ (Project Scheduling)', 'แผนภูมิแกนต์ (Gantt Chart)', 'Precedence Diagram Method (PDM)', 'Critical Path Method (CPM)', 'Project Scheduling with Resource Constraints', 'การกำหนดเวลางานโดยวิธี PERT', 'การเร่งโครงการ (Crashing)', 'Agile & Scrum Project Management'],
            },
          },
          {
            id: '040003004', code: '040003004', name: 'DESIGN THINKING', credits: 3, prereq: null,
            description: 'กระบวนการ Design Thinking เพื่อการแก้ปัญหาเชิงสร้างสรรค์ การ Empathize, Define, Ideate, Prototype และ Test โดยนำไปประยุกต์กับโปรเจกต์จริง',
            professors: ['Asst. Prof. Nattida'],
            difficulty: 2.0,
            satisfaction: 4.8,
            scoring: [
              { label: 'Participation', percent: 20, color: 'bg-orange-500' },
              { label: 'Workshop', percent: 30, color: 'bg-blue-500' },
              { label: 'Final Project', percent: 50, color: 'bg-pink-500' },
            ],
            topics: {
              midterm: ['Empathy & Define', 'Ideation Techniques', 'Prototyping'],
              final: ['User Testing', 'Iteration', 'Final Pitch Presentation'],
            },
          },
          {
            id: 'SPORT', code: 'SPORT', name: 'SPORT & RECREATION', credits: 1, prereq: null,
            description: 'กิจกรรมกีฬาและนันทนาการเพื่อสุขภาพ นักศึกษาเลือกชนิดกีฬาตามความสนใจ เน้นการออกกำลังกายและการทำงานเป็นทีม',
            professors: ['Physical Education Dept.'],
            difficulty: 1.0,
            satisfaction: 4.9,
            scoring: [
              { label: 'Attendance & Participation', percent: 70, color: 'bg-green-500' },
              { label: 'Skill Assessment', percent: 30, color: 'bg-blue-500' },
            ],
            topics: {
              midterm: ['Sport Skills Training'],
              final: ['Sport Competition / Assessment'],
            },
          },
          {
            id: 'LANG3', code: 'LANG-3', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
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
            id: 'INTERNSHIP', code: 'INTERNSHIP', name: 'INTERNSHIP (240 hours)', credits: 0, prereq: null,
            description: 'ฝึกงานในสถานประกอบการจริงไม่น้อยกว่า 240 ชั่วโมง นักศึกษาจะได้รับประสบการณ์การทำงานจริงในสายงานวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
            professors: ['Industry Supervisor', 'Faculty Advisor'],
            difficulty: 3.0,
            satisfaction: 4.8,
            scoring: [
              { label: 'Supervisor Evaluation', percent: 50, color: 'bg-blue-500' },
              { label: 'Internship Report', percent: 30, color: 'bg-green-500' },
              { label: 'Presentation', percent: 20, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['On-site Training', 'Professional Work Experience'],
              final: ['Project Contribution', 'Internship Report Writing', 'Oral Presentation'],
            },
          },
        ]
      },
      {
        term: "Semester 1 (Project I)",
        courses: [
          {
            id: '040613141', code: '040613141', name: 'SPECIAL PROJECT I', credits: 1, prereq: null,
            description: 'นักศึกษาเลือกหัวข้อโปรเจกต์พิเศษ วางแผนการดำเนินงาน ทบทวนวรรณกรรม และนำเสนอ Proposal ของโครงงานวิทยาการคอมพิวเตอร์',
            professors: ['Advisor (ตามที่นักศึกษาเลือก)'],
            difficulty: 3.5,
            satisfaction: 4.5,
            scoring: [
              { label: 'Proposal Report', percent: 30, color: 'bg-blue-500' },
              { label: 'Advisor Evaluation', percent: 40, color: 'bg-orange-500' },
              { label: 'Committee Presentation', percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['Topic Selection', 'Literature Review', 'Proposal Writing'],
              final: ['Proposal Presentation', 'Methodology Plan'],
            },
          },
          {
            id: '040613703', code: '040613703', name: 'DEEP LEARNING', credits: 3, prereq: '040613702',
            isProfessionalElective: true, slotIndex: 7,
            description: 'Deep Learning เชิงลึก ครอบคลุม Neural Network Architecture, Convolutional Neural Network (CNN) สำหรับ Computer Vision, Recurrent Neural Network (RNN/LSTM) สำหรับ Sequential Data, Transformer & Attention Mechanism, Generative AI (GAN, Diffusion Model) และการ Fine-tune โมเดล Pre-trained (Hugging Face) ด้วย PyTorch/TensorFlow',
            professors: ['ผศ.ดร.ลือพล พิพานเมฆาภรณ์'],
            difficulty: 4.5,
            satisfaction: 4.6,
            scoring: [
              { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
              { label: 'Deep Learning Project', percent: 50, color: 'bg-purple-600' },
            ],
            topics: {
              midterm: ['Neural Network Fundamentals & Backpropagation', 'Activation Functions & Optimization (SGD, Adam)', 'Regularization (Dropout, Batch Norm, L1/L2)', 'Convolutional Neural Network (CNN) Architecture', 'Image Classification & Object Detection (YOLO, R-CNN)', 'Transfer Learning & Fine-tuning', 'Recurrent Neural Network (RNN, LSTM, GRU)'],
              final: ['Transformer Architecture & Self-Attention', 'BERT, GPT และ Large Language Model เบื้องต้น', 'Generative Adversarial Network (GAN)', 'Diffusion Model & Stable Diffusion เบื้องต้น', 'Reinforcement Learning เบื้องต้น', 'Model Deployment (ONNX, TensorRT, FastAPI)', 'Final Deep Learning Project Demo'],
            },
          },
          {
            id: '040613503', code: '040613503', name: 'CLOUD COMPUTING', credits: 3, prereq: '040613502',
            isProfessionalElective: true, slotIndex: 8,
            description: 'แนวคิดและบริการ Cloud Computing (IaaS, PaaS, SaaS) การใช้งาน AWS / Google Cloud / Azure เบื้องต้น Virtualization & Container (Docker, Kubernetes) Infrastructure as Code (Terraform) CI/CD Pipeline DevOps และ Cloud Security การออกแบบระบบให้ Scalable, Fault-tolerant บน Cloud',
            professors: ['TBA'],
            difficulty: 3.5,
            satisfaction: 4.5,
            scoring: [
              { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
              { label: 'Cloud Project & Lab', percent: 40, color: 'bg-sky-500' },
            ],
            topics: {
              midterm: ['Cloud Computing Concepts (IaaS, PaaS, SaaS)', 'Virtualization & Hypervisor', 'AWS Core Services (EC2, S3, RDS, VPC, IAM)', 'Containerization: Docker (Image, Container, Compose)', 'Container Orchestration: Kubernetes เบื้องต้น', 'Networking in Cloud (Load Balancer, CDN, DNS)', 'Storage in Cloud (Block, Object, File Storage)'],
              final: ['Infrastructure as Code: Terraform & CloudFormation', 'CI/CD Pipeline (GitHub Actions, Jenkins)', 'Serverless Computing (AWS Lambda, Cloud Functions)', 'Cloud Security & Compliance (IAM, KMS, Security Groups)', 'Monitoring & Logging (CloudWatch, Prometheus, Grafana)', 'Cost Optimization & Cloud FinOps', 'Final Cloud Architecture Project Demo'],
            },
          },
          {
            id: 'FREE1', code: 'FREE-1', name: 'FREE ELECTIVE COURSE', credits: 3, prereq: null,
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
            id: '040613142', code: '040613142', name: 'SPECIAL PROJECT II', credits: 3, prereq: '040613141',
            description: 'นักศึกษาพัฒนาระบบตามที่วางแผนใน Special Project I จัดทำเอกสาร ทดสอบระบบ และนำเสนอผลลัพธ์ต่อคณะกรรมการ',
            professors: ['Advisor (ตามที่นักศึกษาเลือก)'],
            difficulty: 4.5,
            satisfaction: 4.7,
            scoring: [
              { label: 'System Implementation', percent: 40, color: 'bg-green-500' },
              { label: 'Final Report', percent: 30, color: 'bg-blue-500' },
              { label: 'Committee Evaluation', percent: 30, color: 'bg-purple-500' },
            ],
            topics: {
              midterm: ['System Development', 'Testing & Debugging', 'Progress Report'],
              final: ['Final System Demo', 'Documentation', 'Oral Defense'],
            },
          },
          {
            id: 'SOC2', code: 'SOC-2', name: 'SOCIAL SCIENCE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านสังคมศาสตร์ เช่น สังคมวิทยา รัฐศาสตร์ เศรษฐศาสตร์ หรือจิตวิทยาเบื้องต้น',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 3.8,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'HUM1', code: 'HUM-1', name: 'HUMANTIES ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านมนุษยศาสตร์ เช่น ปรัชญา ประวัติศาสตร์ ศิลปะ หรือดนตรี เพื่อพัฒนามุมมองและความคิดสร้างสรรค์',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 4.2,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Essay/Report', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'FREE2', code: 'FREE-2', name: 'FREE ELECTIVE COURSE', credits: 3, prereq: null,
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