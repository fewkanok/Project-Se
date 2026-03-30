// src/data/courses.js

export const roadmapData = [
  // --- YEAR 1 (ข้อมูลเดิม 100%) ---
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
            difficulty: 5.0, satisfaction: 3.5,
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
            difficulty: 4.0, satisfaction: 4.0,
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
            difficulty: 3.0, satisfaction: 4.5,
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
            difficulty: 1.0, satisfaction: 4.0,
            scoring: [
              { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
              { label: 'Final Exam', percent: 40, color: 'bg-red-500' },
              { label: 'การบ้าน/โครงงานสร้างเว็บ', percent: 20, color: 'bg-blue-500' },
              { label: 'การมีส่วนร่วม', percent: 5, color: 'bg-green-500' },
            ],
            topics: {
              midterm: ['ระบบจำนวน (ฐานสอง, ฐานสิบ)', 'องค์ประกอบฮาร์ดแวร์', 'ระบบเครือข่ายเบื้องต้น', 'อินเทอร์เน็ตและการประมวลผลแบบคลาวด์'],
              final: ['ระบบปฏิบัติการ', 'ฐานข้อมูล', 'ความปลอดภัยคอมพิวเตอร์', 'วัฏจักรการพัฒนาระบบ (SDLC)', 'การเขียนผังงาน (Flowchart) และรหัสจำลอง'],
            },
          },
          {
            id: '0802xxxxx', code: '0802xxxxx', name: 'SOCIAL SCIENCES ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาศึกษาทั่วไปที่มุ่งเน้นให้เข้าใจหลักเศรษฐศาสตร์เพื่อการดำรงชีวิต ศึกษาพฤติกรรมมนุษย์ในการตัดสินใจเลือกทรัพยากรที่มีจำกัด',
            professors: ['ดร.พิเศษพร วศวงศ์', 'ผศ.ดร.กมลนัทธ์ มีถาวร', 'ผศ.ดร.อรษา ตันติยะวงศ์ษา', 'ผศ.ดร.ภาตย์ สังข์แก้ว'],
            difficulty: 1.0, satisfaction: 3.8,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['ความรู้เบื้องต้นทางเศรษฐศาสตร์', 'ระบบเศรษฐกิจ', 'อุปสงค์-อุปทาน'], final: ['การออมและการลงทุน', 'การผลิต', 'หลักการตลาด'] },
          },
          {
            id: '04xxxxxxx', code: '04xxxxxxx', name: 'SCIENCES & MATH ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ ให้นักศึกษาเลือกเรียนตามความสนใจ',
            professors: ['คณาจารย์ผู้ทรงคุณวุฒิ'], difficulty: 3.0, satisfaction: 3.5,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['เนื้อหาตามรายวิชาที่เลือก'], final: ['เนื้อหาตามรายวิชาที่เลือก'] },
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
            difficulty: 4.0, satisfaction: 3.8,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['Vectors & Matrices', 'Linear Transformations', 'Determinants'], final: ['Eigenvalues', 'Fourier Basics', 'Applications in CS'] },
          },
          {
            id: '040613301', code: '040613301', name: 'DATABASE SYSTEMS', credits: 3, prereq: '040613201',
            description: 'แนวคิดระบบฐานข้อมูล แบบจำลอง ER การออกแบบฐานข้อมูลเชิงสัมพันธ์ ภาษา SQL การ Normalize และการจัดการธุรกรรม',
            professors: ['Dr. Manee', 'Asst. Prof. Suree'],
            difficulty: 3.5, satisfaction: 4.2,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Project & Lab', percent: 40, color: 'bg-blue-500' }],
            topics: { midterm: ['ER Diagram', 'Relational Model', 'SQL Basics'], final: ['Normalization', 'Transactions & Concurrency', 'Database Design Project'] },
          },
          {
            id: '040613203', code: '040613203', name: 'STRUCTURE PROGRAMMING', credits: 3, prereq: '040613201',
            description: 'เทคนิคการเขียนโปรแกรมแบบมีโครงสร้าง การแยกย่อยปัญหา การเขียน Modular Code รูปแบบ Procedure/Function และการ Debug',
            professors: ['Dr. Somsak'],
            difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Labs', percent: 40, color: 'bg-green-500' }],
            topics: { midterm: ['Structured Design', 'Modules & Functions', 'Recursion'], final: ['Debugging Techniques', 'Code Optimization', 'Case Studies'] },
          },
          {
            id: '040613501', code: '040613501', name: 'ORG & OPERATING SYSTEM', credits: 3, prereq: '040613100',
            description: 'สถาปัตยกรรมคอมพิวเตอร์ CPU หน่วยความจำ I/O และระบบปฏิบัติการ กระบวนการ การจัดการหน่วยความจำ การจัดตาราง และ Deadlock',
            professors: ['Dr. Pakorn'],
            difficulty: 4.5, satisfaction: 3.7,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-purple-500' }],
            topics: { midterm: ['Computer Architecture', 'CPU & ALU', 'Memory Hierarchy'], final: ['Process Management', 'Scheduling Algorithms', 'Deadlock & Virtual Memory'] },
          },
          {
            id: '040613303', code: '040613303', name: 'HUMAN COMPUTER INTERACTION', credits: 3, prereq: null,
            description: 'ศึกษาศาสตร์การออกแบบที่เชื่อมโยงระหว่างผู้ใช้ (User) และระบบคอมพิวเตอร์ เน้นกระบวนการออกแบบที่ยึดผู้ใช้เป็นศูนย์กลาง',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 4.6,
            scoring: [{ label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 25, color: 'bg-red-500' }, { label: 'UI Project', percent: 50, color: 'bg-pink-500' }],
            topics: { midterm: ['นิยามและประวัติของ HCI', 'วิวัฒนาการของการโต้ตอบ', 'User-Centered Design'], final: ['Prototyping', 'Evaluation', 'Usability Testing'] },
          },
          {
            id: '040503011', code: '040503011', name: 'STAT. FOR ENGINEERS', credits: 3, prereq: null,
            description: 'สถิติเบื้องต้นสำหรับวิศวกร การแจกแจงความน่าจะเป็น การทดสอบสมมติฐาน การถดถอยเชิงเส้น และการควบคุมคุณภาพเชิงสถิติ',
            professors: ['Dr. Ratree'],
            difficulty: 3.8, satisfaction: 3.5,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Quizzes', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['Descriptive Statistics', 'Probability Distributions', 'Sampling'], final: ['Hypothesis Testing', 'Linear Regression', 'Statistical Quality Control'] },
          },
        ]
      }
    ]
  },

  // --- YEAR 2 (ข้อมูลเดิม 100%) ---
  {
    year: "Year 2",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          {
            id: '040613105', code: '040613105', name: 'NUMERICAL METHODS', credits: 3, prereq: '040613104',
            description: 'วิธีเชิงตัวเลขสำหรับการแก้สมการ การหาค่าประมาณ การอินทิเกรตเชิงตัวเลข และการแก้สมการเชิงอนุพันธ์ด้วยคอมพิวเตอร์',
            professors: ['Dr. Chaiwat'], difficulty: 4.2, satisfaction: 3.6,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-green-500' }],
            topics: { midterm: ['Roots of Equations', 'Systems of Linear Equations', 'Interpolation'], final: ['Numerical Integration', 'ODE Solvers', 'Error Analysis'] },
          },
          {
            id: '040613205', code: '040613205', name: 'DATA STRUCTURE', credits: 3, prereq: '040613201',
            description: 'โครงสร้างข้อมูลพื้นฐาน ได้แก่ Array, Linked List, Stack, Queue, Tree, Graph และ Hash Table รวมถึง Algorithm ที่เกี่ยวข้อง',
            professors: ['Assoc. Prof. Veera', 'Dr. Kittisak'], difficulty: 4.5, satisfaction: 4.3,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Labs & Projects', percent: 40, color: 'bg-blue-500' }],
            topics: { midterm: ['Arrays & Linked Lists', 'Stacks & Queues', 'Recursion', 'Trees'], final: ['Graphs', 'Sorting Algorithms', 'Hash Tables', 'Heap'] },
          },
          {
            id: '040613204', code: '040613204', name: 'OOP', credits: 3, prereq: '040613203',
            description: 'ศึกษาและปฏิบัติการเขียนโปรแกรมโดยใช้กระบวนทัศน์เชิงวัตถุ (Object-Oriented Paradigm) เน้นเรื่องการออกแบบ Class และ Object',
            professors: ['ผศ.ดร.สุวัจชัย กมลสันติโรจน์', 'ผศ.สถิตย์ ประสมพันธ์'], difficulty: 4.0, satisfaction: 4.4,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Project', percent: 40, color: 'bg-purple-500' }],
            topics: { midterm: ['แนวคิด OOP', 'ชนิดข้อมูลแบบนามธรรม (ADT)', 'การสร้าง Class/Object', 'Inheritance'], final: ['Polymorphism', 'การสร้าง GUI', 'Event Handling', 'Threads'] },
          },
          {
            id: '040613302', code: '040613302', name: 'SYSTEM ANALYSIS AND DESIGN', credits: 3, prereq: '040613301',
            description: 'ศึกษาหลักการและขั้นตอนในการวิเคราะห์ระบบสารสนเทศ การสร้างแบบจำลองระบบ (System Modeling) และการออกแบบฐานข้อมูล',
            professors: ['ผศ.ดร.คันธารัตน์ อเนกบุณย์', 'ผศ.ดร.ธรรศฏภณ สุระศักดิ์'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 25, color: 'bg-red-500' }, { label: 'System Analysis Project', percent: 50, color: 'bg-teal-500' }],
            topics: { midterm: ['SDLC', 'Requirements Gathering', 'Data Flow Diagram (DFD)', 'Use Case Diagram'], final: ['ER-Diagram', 'System Architecture', 'UI Design', 'Documentation'] },
          },
          {
            id: '040613212', code: '040613212', name: "Digital Circuits and Logic Design", credits: 3, prereq: null,
            description: "ศึกษาหลักการวงจรดิจิทัล ระบบเลขฐาน พีชคณิต Boolean, Logic Gate, Combinational Circuit และ Sequential Circuit",
            professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"], difficulty: 3.5, satisfaction: 3.6,
            scoring: [{ label: "Midterm", percent: 35, color: "bg-orange-500" }, { label: "Final", percent: 35, color: "bg-red-500" }, { label: "Lab", percent: 20, color: "bg-green-500" }, { label: "Quiz", percent: 10, color: "bg-yellow-400" }],
            topics: { midterm: ["ระบบเลขฐาน", "Boolean Algebra", "Logic Gates", "Combinational Circuits"], final: ["Flip-Flop & Latch", "Sequential Circuits", "Finite State Machine", "HDL เบื้องต้น"] }
          },
          {
            id: '08xxxxxxx', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น หรือภาษาจีน เพื่อเพิ่มทักษะการสื่อสาร',
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
            id: '040613502', code: '040613502', name: 'COMPUTER NETWORKS', credits: 3, prereq: '040613501',
            description: 'ศึกษาแบบจำลองเครือข่าย OSI และ TCP/IP, หน้าที่ของโพรโทคอลในแต่ละชั้น, เครือข่าย LAN/WAN และความมั่นคงของเครือข่าย',
            professors: ['อ.ปรัชญาพร เลี้ยงสุทธิสกนธ์'], difficulty: 3.0, satisfaction: 4.1,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Lab/Homework', percent: 30, color: 'bg-green-500' }],
            topics: { midterm: ['Network Models', 'Physical Layer', 'Data Link Layer', 'Error Detection'], final: ['IP Addressing', 'Routing Protocols', 'Transport Layer', 'Network Security'] },
          },
          {
            id: '040613206', code: '040613206', name: 'DESIGN & ANALYSIS ALGO', credits: 3, prereq: '040613205',
            description: 'หลักการออกแบบอัลกอริทึม, การวิเคราะห์ความซับซ้อน (Big-O), Divide and Conquer, Greedy และ Dynamic Programming',
            professors: ['ผศ.ดร.สุวัจชัย กมลสันติโรจน์', 'ผศ.ดร.อัครา ประโยชน์'], difficulty: 5.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-yellow-500' }],
            topics: { midterm: ['Algorithm Analysis (Big-O)', 'Brute Force', 'Divide and Conquer'], final: ['Greedy Techniques', 'Dynamic Programming', 'Graph Algorithms'] },
          },
          {
            id: '040613701', code: '040613701', name: 'INTELLIGENT SYSTEMS', credits: 3, prereq: '040613205',
            description: 'แนะนำปัญญาประดิษฐ์ การค้นหา (Search), Logic, Machine Learning และ Neural Networks',
            professors: ['Dr. Kittisak', 'Asst. Prof. Pornpan'], difficulty: 4.0, satisfaction: 4.7,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'AI Mini-Project', percent: 40, color: 'bg-violet-500' }],
            topics: { midterm: ['AI History', 'Search (BFS/DFS/A*)', 'Knowledge Representation'], final: ['Machine Learning', 'Neural Networks', 'Expert Systems'] },
          },
          {
            id: '040613306', code: '040613306', name: 'SOFTWARE ENGINEERING', credits: 3, prereq: '040613302',
            description: 'ศึกษากระบวนการทางวิศวกรรมเพื่อการพัฒนาซอฟต์แวร์ที่มีคุณภาพ ครอบคลุมวงจรการพัฒนาระบบ (SDLC)',
            professors: ['ผศ.สถิตย์ ประสมพันธ์'], difficulty: 3.0, satisfaction: 4.5,
            scoring: [{ label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 20, color: 'bg-red-500' }, { label: 'Team Project (Agile)', percent: 60, color: 'bg-emerald-500' }],
            topics: { midterm: ['SDLC & Agile', 'Waterfall', 'UML Design'], final: ['Testing & QA', 'Maintenance', 'Project Management'] },
          },
          {
            id: '040613601', code: '040613601', name: 'COMPUTER SECURITY', credits: 3, prereq: '040613100',
            description: 'ศึกษาภัยคุกคามรูปแบบต่างๆ หลักการรหัสลับ (Cryptography) การป้องกันมัลแวร์และความมั่นคงในระดับระบบต่างๆ',
            professors: ['TBA'], difficulty: 4.0, satisfaction: 4.2,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['Cryptography', 'Malware', 'OS Security'], final: ['Network Security', 'Cloud/IoT Security', 'Computer Law'] },
          },
          {
            id: '08xxxxxxx-2', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษาเพิ่มเติมเพื่อการสื่อสารในระดับสากล',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      }
    ]
  },

  // --- YEAR 3 (Core Courses Only) ---
  {
    year: "Year 3",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          { id: 'PE_SLOT_1', name: 'Professional Elective I', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_2', name: 'Professional Elective II', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_3', name: 'Professional Elective III', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_4', name: 'Professional Elective IV', isProfessionalElective: true, credits: 3 },
          {
            id: 'SCI2', code: 'SCI-2', name: 'SCIENCES & MATH ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ชุดที่ 2',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 3.5,
            scoring: [{ label: 'Exams', percent: 80, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'LANG2', code: 'LANG-2', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษาชุดที่ 2',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Exams', percent: 60, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          { id: 'PE_SLOT_5', name: 'Professional Elective 5', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_6', name: 'Professional Elective 6', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_7', name: 'Professional Elective 7', isProfessionalElective: true, credits: 3 },
          {
            id: '040003004', code: '040003004', name: 'DESIGN THINKING', credits: 3, prereq: null,
            description: 'กระบวนการ Design Thinking เพื่อแก้ปัญหาเชิงสร้างสรรค์ เน้นการทำโปรเจกต์จริง',
            professors: ['Asst. Prof. Nattida'], difficulty: 2.0, satisfaction: 4.8,
            scoring: [{ label: 'Workshop', percent: 50, color: 'bg-blue-500' }, { label: 'Final Project', percent: 50, color: 'bg-pink-500' }],
            topics: { midterm: ['Empathy & Define', 'Ideation'], final: ['Prototype & Test', 'Pitching'] },
          },
          {
            id: 'SPORT', code: 'SPORT', name: 'SPORT & RECREATION', credits: 1, prereq: null,
            description: 'กิจกรรมกีฬาเพื่อสุขภาพและการทำงานเป็นทีม',
            professors: ['Physical Education Dept.'], difficulty: 1.0, satisfaction: 4.9,
            scoring: [{ label: 'Attendance', percent: 70, color: 'bg-green-500' }, { label: 'Skills', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['Training'], final: ['Assessment'] },
          },
          {
            id: 'LANG3', code: 'LANG-3', name: 'LANGUAGE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านภาษาชุดที่ 3',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Exams', percent: 60, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      }
    ]
  },

  // --- YEAR 4 (Core & Projects Only) ---
  {
    year: "Year 4",
    semesters: [
          
      {
        term: "Summer / Term 1",
        courses: [
          {
            id: 'INTERNSHIP', code: 'INTERNSHIP', name: 'INTERNSHIP (240 hours)', credits: 0, prereq: null,
            description: 'ฝึกงานในสถานประกอบการจริงสายงาน CS ไม่น้อยกว่า 240 ชั่วโมง',
            professors: ['Faculty Advisor'], difficulty: 3.0, satisfaction: 4.8,
            scoring: [{ label: 'Evaluation', percent: 50, color: 'bg-blue-500' }, { label: 'Report', percent: 30, color: 'bg-green-500' }, { label: 'Present', percent: 20, color: 'bg-purple-500' }],
            topics: { midterm: ['On-site Work'], final: ['Final Report'] },
          },
        ]
      },
      {
        term: "Semester 1 (Project I)",
        courses: [
          { id: 'PE_SLOT_8', name: 'Professional Elective 8', isProfessionalElective: true, credits: 3 },
          { id: 'PE_SLOT_9', name: 'Professional Elective 9', isProfessionalElective: true, credits: 3 },
          {
            id: '040613141', code: '040613141', name: 'SPECIAL PROJECT I', credits: 1, prereq: "สะสมครบ 102 หน่วยกิต",
            description: 'วางแผนหัวข้อโครงงาน ทบทวนวรรณกรรม และนำเสนอ Proposal',
            professors: ['Advisor'], difficulty: 3.5, satisfaction: 4.5,
            scoring: [{ label: 'Proposal', percent: 30, color: 'bg-blue-500' }, { label: 'Advisor Eval', percent: 40, color: 'bg-orange-500' }, { label: 'Presentation', percent: 30, color: 'bg-purple-500' }],
            topics: { midterm: ['Topic Selection'], final: ['Proposal Presentation'] },
          },
          {
            id: 'FREE1', code: 'FREE-1', name: 'FREE ELECTIVE COURSE', credits: 3, prereq: null,
            description: 'วิชาเลือกเสรีตามความสนใจ',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Exams', percent: 70, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      },
      {
        term: "Semester 2 (Project II)",
        courses: [
          {
            id: '040613142', code: '040613142', name: 'SPECIAL PROJECT II', credits: 3, prereq: '040613141',
            description: 'พัฒนาระบบตามที่วางแผนไว้ ทดสอบระบบ และนำเสนอผลงานสำเร็จ',
            professors: ['Advisor'], difficulty: 4.5, satisfaction: 4.7,
            scoring: [{ label: 'Implementation', percent: 40, color: 'bg-green-500' }, { label: 'Report', percent: 30, color: 'bg-blue-500' }, { label: 'Defense', percent: 30, color: 'bg-purple-500' }],
            topics: { midterm: ['System Dev'], final: ['Oral Defense'] },
          },
          {
            id: 'SOC2', code: 'SOC-2', name: 'SOCIAL SCIENCE ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านสังคมศาสตร์เพิ่มเติม',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 3.8,
            scoring: [{ label: 'Exams', percent: 80, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'HUM1', code: 'HUM-1', name: 'HUMANTIES ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านมนุษยศาสตร์เพิ่มเติม',
            professors: ['TBA'], difficulty: 2.0, satisfaction: 4.2,
            scoring: [{ label: 'Exams', percent: 70, color: 'bg-red-500' }, { label: 'Essay', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'FREE2', code: 'FREE-2', name: 'FREE ELECTIVE COURSE', credits: 3, prereq: null,
            description: 'วิชาเลือกเสรีวิชาที่ 2',
            professors: ['TBA'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Exams', percent: 70, color: 'bg-red-500' }, { label: 'Assignments', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      }
    ]
  },

  {
    year: "Track Courses",
    semesters: [
      {
        term: "Track Subjects",
        courses: [
          // 1. SMART TECHNOLOGY (SmartTech)
          { id: "040613901", code: "040613901", name: "Embedded System Design", credits: 3, prereq: "040613112", isTrackOnly: true, track: "SmartTech", availableTerms: ["3/1"], description: "ศึกษาหลักการออกแบบระบบฝังตัว Architecture, Real-Time OS", professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"], difficulty: 4.0, satisfaction: 4.0, scoring: [{label:"Exams", percent:60, color:"bg-red-500"}, {label:"Lab", percent:40, color:"bg-green-500"}], topics: {midterm: ["ARM/AVR"], final: ["RTOS"]} },
          { id: "040613902", code: "040613902", name: "Internet of Things", credits: 3, prereq: "040613201", isTrackOnly: true, track: "SmartTech", availableTerms: ["3/2"], description: "ระบบนิเวศ IoT เซ็นเซอร์ ESP32/Raspberry Pi โพรโทคอล MQTT", professors: ["รศ.ดร.กอบเกียรติ สระอุบล"], difficulty: 3.5, satisfaction: 4.4, scoring: [{label:"Project", percent:40, color:"bg-teal-500"}, {label:"Exams", percent:60, color:"bg-orange-500"}], topics: {midterm: ["Sensors"], final: ["Cloud IoT"]} },
          { id: "040613903", code: "040613903", name: "Geospatial Information Technology for Smart City", credits: 3, prereq: "040613301", isTrackOnly: true, track: "SmartTech", availableTerms: ["3/2"], description: "เทคโนโลยี GIS สำหรับเมืองอัจฉริยะ Spatial Data", professors: ["ดร. พัชราภรณ์ ไพรสงบ"], difficulty: 3.0, satisfaction: 4.0, scoring: [{label:"Exams", percent:60, color:"bg-orange-500"}, {label:"GIS Project", percent:40, color:"bg-blue-500"}], topics: {midterm: ["GPS"], final: ["Web Mapping"]} },
          { id: "040613904", code: "040613904", name: "Robotic Science and Control System", credits: 3, prereq: "040613901", isTrackOnly: true, track: "SmartTech", availableTerms: ["3/2"], description: "วิทยาการหุ่นยนต์ Kinematics, ROS Framework", professors: ["ผศ. ดร. รุ่งโรจน์ สุขเกษม"], difficulty: 4.5, satisfaction: 4.5, scoring: [{label:"Exams", percent:50, color:"bg-orange-500"}, {label:"Lab", percent:50, color:"bg-green-500"}], topics: {midterm: ["PID Control"], final: ["ROS SLAM"]} },
          { id: "040613905", code: "040613905", name: "Block Chain", credits: 3, prereq: null, isTrackOnly: true, track: "SmartTech", availableTerms: ["3/1", "3/2", "4/1", "4/2"], description: "Blockchain, Consensus, Smart Contract (Solidity)", professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"], difficulty: 3.5, satisfaction: 4.2, scoring: [{label:"Exams", percent:60, color:"bg-orange-500"}, {label:"Solidity Project", percent:40, color:"bg-blue-500"}], topics: {midterm: ["Cryptography"], final: ["DeFi/NFT"]} },
      
          // 2. ARTIFICIAL INTELLIGENCE (AI)
          { id: "040613702", code: "040613702", name: "Machine Learning", credits: 3, prereq: "040613701", isTrackOnly: true, track: "AI", availableTerms: ["3/1"], description: "Supervised, Unsupervised และ Reinforcement Learning", professors: ["ผศ.ดร.ลือพล พิพานเมฆาภรณ์"], difficulty: 4.0, satisfaction: 4.5, scoring: [{label:"Exams", percent:60, color:"bg-orange-500"}, {label:"ML Project", percent:40, color:"bg-violet-500"}], topics: {midterm: ["Linear Regression"], final: ["Neural Nets"]} },
          { id: "040613703", code: "040613703", name: "Artificial Intelligence Software Development", credits: 3, prereq: "040613701", isTrackOnly: true, track: "AI", availableTerms: ["3/2"], description: "ฝึกพัฒนา AI Application model deployment ด้วย Docker", professors: ["ดร. สมชาย เหมือนยิ้ม"], difficulty: 3.8, satisfaction: 4.4, scoring: [{label:"Lab", percent:30, color:"bg-green-500"}, {label:"Project", percent:70, color:"bg-blue-500"}], topics: {midterm: ["Pipeline"], final: ["MLOps"]} },
          { id: "040613705", code: "040613705", name: "Big Data Engineering", credits: 3, prereq: "040613701", isTrackOnly: true, track: "AI", availableTerms: ["4/1", "4/2"], description: "Hadoop, Spark, Kafka และสถาปัตยกรรมข้อมูลขนาดใหญ่", professors: ["ผศ. ดร. กิตติพงษ์ ชาญชัย"], difficulty: 4.0, satisfaction: 4.0, scoring: [{label:"Midterm", percent:30, color:"bg-orange-500"}, {label:"Final", percent:70, color:"bg-red-500"}], topics: {midterm: ["HDFS"], final: ["Spark Kafka"]} },
          { id: "040613704", code: "040613704", name: "Deep Learning", credits: 3, prereq: "040613702", isTrackOnly: true, track: "AI", availableTerms: ["3/2", "4/1", "4/2"], description: "CNN, RNN, Transformers และ Generative AI", professors: ["ผศ.ดร.ลือพล พิพานเมฆาภรณ์"], difficulty: 4.5, satisfaction: 4.6, scoring: [{label:"Exams", percent:50, color:"bg-orange-500"}, {label:"DL Project", percent:50, color:"bg-purple-600"}], topics: {midterm: ["CNN"], final: ["GANs"]} },
          { id: "040613706", code: "040613706", name: "Natural Language Processing", credits: 3, prereq: "040613701", isTrackOnly: true, track: "AI", availableTerms: ["4/1", "4/2"], description: "Tokenization จนถึง BERT/Transformers สำหรับภาษา", professors: ["ดร. สมชาย เหมือนยิ้ม"], difficulty: 4.0, satisfaction: 4.3, scoring: [{label:"Exams", percent:70, color:"bg-orange-500"}, {label:"Project", percent:30, color:"bg-blue-500"}], topics: {midterm: ["Word2Vec"], final: ["Transformers"]} },
          { id: "040613707", code: "040613707", name: "Computer Vision", credits: 3, prereq: "040613701", isTrackOnly: true, track: "AI", availableTerms: ["4/1", "4/2"], description: "Object Detection, Image Segmentation และ Video Analysis", professors: ["ผศ. ดร. ภูวดล ทรัพย์สิน"], difficulty: 4.2, satisfaction: 4.4, scoring: [{label:"Lab", percent:30, color:"bg-green-500"}, {label:"Exams", percent:70, color:"bg-orange-500"}], topics: {midterm: ["Edge Detection"], final: ["YOLO FaceRec"]} },
          
          // 3. GAMES & MULTIMEDIA
          { id: "040613801", code: "040613801", name: "Computer Graphics", credits: 3, prereq: "040613104", isTrackOnly: true, track: "Games", availableTerms: ["3/1"], description: "การสร้างภาพ 2D/3D และ OpenGL", professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"], difficulty: 4.0, satisfaction: 4.2, scoring: [{label:"Exams", percent:60, color:"bg-orange-500"}, {label:"Lab", percent:40, color:"bg-green-500"}], topics: {midterm: ["Transformation"], final: ["Lighting"]} },
          { id: "040613802", code: "040613802", name: "Computer Game Design", credits: 3, prereq: "040613201", isTrackOnly: true, track: "Games", availableTerms: ["3/1"], description: "ออกแบบเกม Game Loop, Physics Engine, Unity", professors: ["อ. ชัยวัฒน์ สร้างสรรค์"], difficulty: 3.5, satisfaction: 4.8, scoring: [{label:"Lab", percent:30, color:"bg-green-500"}, {label:"Game Project", percent:70, color:"bg-blue-500"}], topics: {midterm: ["Design"], final: ["Unity Engine"]} },
          { id: "040613803", code: "040613803", name: "Virtual Reality and Augmented Reality", credits: 3, prereq: "040613201", isTrackOnly: true, track: "Games", availableTerms: ["3/2", "4/1", "4/2"], description: "VR/AR/MR การพัฒนาแอป XR ด้วย Unity", professors: ["อ. ชัยวัฒน์ สร้างสรรค์"], difficulty: 3.8, satisfaction: 4.7, scoring: [{label:"Project", percent:40, color:"bg-blue-500"}, {label:"Lab", percent:60, color:"bg-green-500"}], topics: {midterm: ["VR Concepts"], final: ["AR Application"]} },
          { id: "040613804", code: "040613804", name: "3D Modeling", credits: 3, prereq: "040613104", isTrackOnly: true, track: "Games", availableTerms: ["3/2", "4/1", "4/2"], description: "สร้างแบบจำลอง 3 มิติด้วย Blender", professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"], difficulty: 3.5, satisfaction: 4.5, scoring: [{label:"Portfolio", percent:100, color:"bg-blue-500"}], topics: {midterm: ["Polygon Modeling"], final: ["Texturing Rendering"]} },
          { id: "040613805", code: "040613805", name: "Computer Animation", credits: 3, prereq: "040613801", isTrackOnly: true, track: "Games", availableTerms: ["3/2", "4/1", "4/2"], description: "Keyframe, Kinematics และ Motion Capture", professors: ["อ. ชัยวัฒน์ สร้างสรรค์"], difficulty: 4.0, satisfaction: 4.4, scoring: [{label:"Animation Project", percent:100, color:"bg-blue-500"}], topics: {midterm: ["Principles"], final: ["Motion Capture"]} },
          { id: "040613806", code: "040613806", name: "Lighting and Shading", credits: 3, prereq: "040613801", isTrackOnly: true, track: "Games", availableTerms: ["3/2", "4/1", "4/2"], description: "เทคนิคแสงเงา 3D, Ray Tracing", professors: ["ผศ. ดร. ศุภโชค วงค์รัตน์"], difficulty: 4.2, satisfaction: 4.3, scoring: [{label:"Portfolio", percent:40, color:"bg-blue-500"}, {label:"Exams", percent:60, color:"bg-orange-500"}], topics: {midterm: ["Light Theory"], final: ["Shaders"]} },
          
          // 4. NETWORK & SECURITY
          { id: "040613504", code: "040613504", name: "Inter-networking Technology", credits: 3, prereq: "040613502", isTrackOnly: true, track: "Network", availableTerms: ["3/1"], description: "โพรโทคอลจัดเส้นทาง (RIP, OSPF) Cisco CCNA", professors: ["อ.ปรัชญาพร เลี้ยงสุทธิสกนธ์"], difficulty: 3.0, satisfaction: 4.3, scoring: [{label:"Exams", percent:70, color:"bg-orange-500"}, {label:"Lab", percent:30, color:"bg-green-500"}], topics: {midterm: ["Subnetting"], final: ["VLAN ACL"]} },
          { id: "040613505", code: "040613505", name: "Unix tool", credits: 3, prereq: "040613100", isTrackOnly: true, track: "Network", availableTerms: ["3/1"], description: "Unix Command Line, Shell Script, Automation", professors: ["อ. ดร. ปิยะวัฒน์ ทองดี"], difficulty: 3.0, satisfaction: 4.3, scoring: [{label:"Lab", percent:40, color:"bg-green-500"}, {label:"Exams", percent:60, color:"bg-orange-500"}], topics: {midterm: ["CLI Nav"], final: ["Shell Script"]} },
          { id: "040613602", code: "040613602", name: "Network Security", credits: 3, prereq: "040613502", isTrackOnly: true, track: "Network", availableTerms: ["3/2"], description: "Cryptography, Web Security, IDS/IPS", professors: ["รศ.ดร.ธนภัทร์ อนุศาสน์อมรกุล"], difficulty: 4.0, satisfaction: 4.3, scoring: [{label:"Exams", percent:70, color:"bg-orange-500"}, {label:"Project", percent:30, color:"bg-blue-500"}], topics: {midterm: ["Cryptography"], final: ["Firewalls"]} },
          { id: "040613603", code: "040613603", name: "Defensive Programming", credits: 3, prereq: "040613202", isTrackOnly: true, track: "Network", availableTerms: ["3/2", "4/1", "4/2"], description: "เขียนโปรแกรมปลอดภัยป้องกัน Injection, Buffer Overflow", professors: ["รศ. ดร. วรพจน์ ศรีสอาด"], difficulty: 4.0, satisfaction: 4.2, scoring: [{label:"Code Review", percent:30, color:"bg-green-500"}, {label:"Exams", percent:70, color:"bg-orange-500"}], topics: {midterm: ["Memory Safety"], final: ["OWASP Top 10"]} },
          { id: "040613604", code: "040613604", name: "Digital Forensics", credits: 3, prereq: "040613502", isTrackOnly: true, track: "Network", availableTerms: ["3/2", "4/1", "4/2"], description: "นิติวิทยาศาสตร์ดิจิทัล กู้คืนไฟล์ FAT/NTFS", professors: ["ผศ.ดร.ธรรศฏภณ สุระศักดิ์"], difficulty: 3.5, satisfaction: 4.2, scoring: [{label:"Lab", percent:30, color:"bg-blue-500"}, {label:"Exams", percent:70, color:"bg-red-500"}], topics: {midterm: ["Evidence Handling"], final: ["Memory Forensics"]} },
          { id: "040613605", code: "040613605", name: "Penetration Testing and Protection", credits: 3, prereq: "040613502", isTrackOnly: true, track: "Network", availableTerms: ["3/2", "4/1", "4/2"], description: "Ethical Hacking, Penetration Testing", professors: ["รศ. ดร. วรพจน์ ศรีสอาด"], difficulty: 4.5, satisfaction: 4.7, scoring: [{label:"Lab/CTF", percent:50, color:"bg-purple-500"}, {label:"Pentest Report", percent:50, color:"bg-red-500"}], topics: {midterm: ["Recon"], final: ["Exploitation"]} },
          
          // 5. FULL-STACK DEVELOPER
          { id: "040613411", code: "040613411", name: "Web Development", credits: 3, prereq: "040613201", isTrackOnly: true, track: "FullStack", availableTerms: ["3/1"], description: "HTML5, CSS3, JS ES6+, Cloud Deployment", professors: ["TBA"], difficulty: 3.0, satisfaction: 4.6, scoring: [{label:"Web Project", percent:50, color:"bg-pink-500"}, {label:"Exams", percent:50, color:"bg-red-500"}], topics: {midterm: ["HTML/CSS"], final: ["JavaScript"]} },
          { id: "040613412", code: "040613412", name: "Web Framework", credits: 3, prereq: "040613411", isTrackOnly: true, track: "FullStack", availableTerms: ["3/2"], description: "React/Vue, Backend Express/Django, CI/CD", professors: ["อ. ณัฐพล มีสุข"], difficulty: 3.8, satisfaction: 4.6, scoring: [{label:"Full-Stack Project", percent:40, color:"bg-blue-500"}, {label:"Exams", percent:60, color:"bg-orange-500"}], topics: {midterm: ["Frontend Framework"], final: ["Backend Auth"]} },
          { id: "040613421", code: "040613421", name: "Mobile Application Development", credits: 3, prereq: "040613204", isTrackOnly: true, track: "FullStack", availableTerms: ["3/2", "4/2"], description: "Native/Cross-platform App Development", professors: ["ผศ. สุรีย์ แก้วใส"], difficulty: 3.8, satisfaction: 4.5, scoring: [{label:"Lab", percent:30, color:"bg-green-500"}, {label:"Exams", percent:45, color:"bg-orange-500"}, {label:"App Project", percent:25, color:"bg-blue-500"}], topics: {midterm: ["UI Components"], final: ["API/Store"]} },
        ]
      }
    ]
  }
];