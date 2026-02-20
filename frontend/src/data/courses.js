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
            id: '080103001', code: '080103001', name: 'ENGLISH I', credits: 3, prereq: null,
            description: 'ทักษะการฟัง การพูด การอ่าน และการเขียน การสื่อสารในงานและกิจวัตรประจำวันแบบง่าย การอ่านย่อหน้าแบบสั้น การเขียนประโยค และการฝึกภาษาทางอินเตอร์เนตเพิ่มเติม',
            professors: ['อาจารย์วรางคณา แซ่เจ็ง', 'อาจารย์Khagendra Raj Dhakal', 'อาจารย์กรกฎ ก่ำแก้ว'],
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
            id: '080103002', code: '080103002', name: 'ENGLISH II', credits: 3, prereq: '080103001',
            description: 'วิชาเลือกด้านภาษา เช่น ภาษาอังกฤษเทคนิค ภาษาญี่ปุ่น ภาษาจีน หรือการสื่อสารเพื่อธุรกิจ เพื่อเพิ่มทักษะการสื่อสารในระดับสากล',
            professors: ['อาจารย์วรางคณา แซ่เจ็ง', 'อาจารย์Khagendra Raj Dhakal', 'อาจารย์กรกฎ ก่ำแก้ว'],
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
            id: '040613151', code: '040613151', name: 'SELEC TOP IN COMP SCI I', credits: 3, prereq: null,
            description: 'หัวข้อทางด้านวิทยาการคอมพิวเตอร์ ไม่ได้บรรจุอยู่ในวิชาที่เปิดสอนในหลักสูตร เพื่อให้ทันต่อการเปลี่ยนแปลงของวิทยาการคอมพิวเตอร์ในขณะนั้น',
            professors: ['ผู้ช่วยศาสตราจารย์ ดร.อัครา ประโยชน์'], difficulty: 1.0, satisfaction: 4.0,
            scoring: 
            [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: 
            { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: '040613504', code: '040613504', name: 'INTER-NETWORKING TECHNOLOGY', credits: 3, prereq: '040613502',
            description: 'การเชื่อมต่อระหว่างเครือข่าย โพรโทคอลจัดเส้นทาง การตั้งค่าเครือข่ายเบื้องต้น การออกแบบเครือข่ายเฉพาะที่ ความมั่นคงเครือข่าย โพรโทคอลจัดการเครือข่าย',
            professors: ['อาจารย์ปรัชญาพร เลี้ยงสุทธิสกนธ์'], difficulty: 2.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'QUIZ 1', percent: 10, color: 'bg-blue-500' } ,{ label: 'QUIZ 2', percent: 10, color: 'bg-blue-500' },{ label: 'งานที่ได้รับมอบหมาย', percent: 10, color: 'bg-blue-500' }],
            topics: { midterm: ['ทบทวนหัวข้อที่สำคัญในรายวิชาเครือข่ายคอมพิวเตอร์','Routers & Basic Router Configuration','Static Routing vs Dynamic Routing Protocols','Dynamic Routing Protocol: RIP','Dynamic Routing: OSPF','Dynamic Host Configuration Protocol','Local Area Network'], 
              final: ['Virtual LAN','Traffic Filtering: Standard ACLs','Traffic Filtering: Extended ACLs','Network Address Translation & Default Static Route','Simple Network Management Protocol','Review/Presentation'] },
          },
          {
            id: '040613604', code: '040613604', name: 'DIGITAL FORENSICS', credits: 3, prereq: ['040613504', '040613601'],
            description: 'การจัดการพยานหลักฐาน ห่วงโซ่การคุ้มครองพยานหลักฐาน การรวบรวมพยานหลักฐานและการสำเนาข้อมูล การวิเคราะห์ข้อมูล ระเบียบวิธีการตรวจพิสูจน์นิติวิทยาศาสตร์คอมพิวเตอร์ การกู้คืนแฟ้มข้อมูลและพาร์ทิชันที่ถูกลบ นิติวิทยาศาสตร์ของการซ่อนข้อมูลและแฟ้มรูปภาพ การจัดการประวัติและความเกี่ยวข้องของเหตุการณ์ นิติวิทยาศาสตร์เครือข่าย การรายงานผลการตรวจพิสูจน์',
            professors: ['ผู้ช่วยศาสตราจารย์ ดร.ธรรศฏภณ สุระศักดิ์'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: '040613702', code: '040613702', name: 'MACHINE LEARNING', credits: 3, prereq: '040613701',
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['ผู้ช่วยศาสตราจารย์ ดร.ลือพล พิพานเมฆาภรณ์', 'อาจารย์ ดร.ยนต์ชนก เขาแก้ว'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'BIOLOGY IN DAILY LIFE', code: '040413001', name: 'BIOLOGY IN DAILY LIFE', credits: 3, prereq: null,
            description: 'วิชาเลือกด้านวิทยาศาสตร์และคณิตศาสตร์ เพื่อเสริมพื้นฐานทางวิทยาศาสตร์',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 3.5,
            scoring: [{ label: 'Midterm Exam', percent: 40, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 40, color: 'bg-red-500' }, { label: 'Assignments', percent: 20, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: '080103030', code: '080103030', name: 'STRATEGIC READING', credits: 3, prereq: ['080103002'],
            description: 'กลยุทธ์การอ่าน การพัฒนาความสามารถด้านการอ่านโดยเน้นเนื้อหาเชิงวิชาการ',
            professors: ['อาจารย์วรางคณา แซ่เจ็ง', 'อาจารย์ ดร.พรสวรรค์ เจนพึ่งพร','อาจารย์ ดร.อริยาธรณ์ ฟองไพบูลย์','อาจารย์ ดร.อัญชกาญจน์ เอี่ยมทองอินทร์'], difficulty: 2.5, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          {
            id: '040613304', code: '040613304', name: 'PROJECT MANAGEMENT', credits: 3, prereq: ['040613302'],
            description: 'วัฏจักรชีวิตของโครงการ การกำหนดและเริ่มต้นโครงการ การวางแผนโครงการ แผนภาพการจัดตารางเวลาโครงการภายใต้ข้อจำกัดทางทรัพยากร การปฏิบัติโครงการ การปิดโครงการกระบวนการพัฒนาแบบอใจล์',
            professors: ['อาจารย์ณัฐวุฒิ สร้อยดอกสน'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, 
              { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, 
              { label: 'การบ้านหรืองานที่มอบหมาย + ความมีส่วนร่วมในชั้นเรียน', percent: 30, color: 'bg-blue-500' }],
            topics: 
            { midterm: ['แนะนํารายวิชา (Course Outline)','ภาพรวมของการบริหารโครงการ (Project Management Overview)', 
              'วัฎจักรชีวิตของโครงการ (Project Life Cycle)', 'ผู้บริหารโครงการ (Project manager)', 'ระบบสารสนเทศ (Information Systems)', 
              'วัฎจักรชีวิตในการพัฒนาระบบ 1 (System Development Life Cycle I)', 'วัฎจักรชีวิตในการพัฒนาระบบ 2 (System Development Life Cycle 2)', 
              'การกําหนดและเริ่มต้นโครงการ (Defining the Project)', 'การวางแผนโครงการ (Planning the Project)', 'การศึกษาความเป็นไปได้ของโครงการ (Project feasibility)','การศึกษาความเป็นไปได้ของโครงการ (Project feasibility)' ], 
              final: ['การกําหนดเวลางานโครงการ (Project Scheduling)', 'การสร้างแผนงานแบบแผนภูมิแกนต์ (GANTT Chart)', 'การกําหนดเวลาโครงการด้วยวิธีข่ายงานนําหน้า (Precedence Diagram Method)', 'การกําหนดเวลาโครงการด้วยวิธีสายงานวิกฤติ (Critical Path Method)', 
                'การกําหนดเวลางานโครงการภายใต้ทรัพยากรจํากัด (Project Scheduling withResource Constraints)','การกําหนดเวลางานโครงการภายใต้ทรัพยากรจํากัด (Project Scheduling withResource Constraints)','การกําหนดเวลางานโดยวิธี PERTการเร่งโครงการ (Reducing Project Time)','การเร่งโครงการ (Reducing Project Time)'] },},
          {
            id: '040613602', code: '040613602', name: 'NETWORK SECURITY', credits: 3, prereq: ['040613502', '040613601'],
            description: 'แนวคิดด้านความมั่นคงของเครือข่าย วิทยาการรหัสลับและการกระจายคีย์ การพิสูจน์ตัวจริงความมั่นคงของเว็บและระดับชั้นขนส่ง ซอฟต์แวร์ประสงค์ร้าย ระบบตรวจจับการบุกรุก ฮันนีพอตและไฟร์วอลล์ ความมั่นคงของเครือข่ายไร้สาย การจัดการความมั่นคงเครือข่า',
            professors: ['รองศาสตราจารย์ ดร.ธนภัทร์ อนุศาสน์อมรกุล'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: '040613902', code: '040613902', name: 'INTERNET OF THINGS', credits: 3, prereq: ['040613201'],
            description: 'สถาปัตยกรรมไอโอที องค์ประกอบไอโอที เซ็นเซอร์ ตัวกระทำ ส่วนต่อประสานระหว่างองค์ประกอบ การออกแบบและพัฒนาระบบไอโอที การเชื่อมต่อระบบเครือข่าย โพรโทคอลและการสื่อสารฐานข้อมูล เครื่องแม่ข่ายและคลาวน์สำหรับการบริการ ความมั่นคงและความเป็นส่วนตั',
            professors: ['รองศาสตราจารย์ ดร.กอบเกียรติ สระอุบล'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
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
            id: '080103034', code: '080103034-3', name: 'ENGLISH CONVERSATION', credits: 3, prereq: '080103002',
            description: 
            'ทักษะการสื่อสารภาษาอังกฤษ โดยเน้นการพูด การฟัง และการออกเสียง การสนทนาภาษาอังกฤษในสถานการณ์ต่าง ๆ ในชีวิตประจำวั',
            professors: 
            ['อาจารย์Khagendra Raj Dhakal', 'อาจารย์ธานินทร์ วีระเดช','อาจารย์ธานี เขียดทอง','อาจารย์วิโรจน์ อัศวจารุพันธุ์'], difficulty: 2.5, satisfaction: 4.0,
            scoring: 
            [{ label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 30, color: 'bg-red-500' }, { label: 'Participation', percent: 40, color: 'bg-yellow-500' }],
            topics: 
            { midterm: ['TBA'], final: ['TBA'] },
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
            id: 'PE8', code: 'PE-8', name: 'PROFESSIONAL ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
          },
          {
            id: 'PE9', code: 'PE-9', name: 'PROFESSIONAL ELECTIVE', credits: 3, prereq: null,
            description: 'วิชาเลือกเฉพาะสาขา ให้นักศึกษาเลือกเรียนตามความสนใจและแนวทางอาชีพที่ต้องการ',
            professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
            scoring: [{ label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' }, { label: 'Final Exam', percent: 35, color: 'bg-red-500' }, { label: 'Project', percent: 30, color: 'bg-blue-500' }],
            topics: { midterm: ['TBA'], final: ['TBA'] },
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
,

  // ─── TRACK COURSES SECTION ─────────────────────────────────────────────────
  {
    year: "Track Courses",
    semesters: [
      {
        term: "All Tracks",
        courses: [
  // ─── TRACK COURSES (เพิ่มเพื่อรองรับ CourseDetail จากหน้าแบ่งสาย) ───────────

  // AI Track
  {
    id: '040613701', code: '040613701', name: 'INTELLIGENT SYSTEM', credits: 3, prereq: '040613205',
    description: 'ศึกษาพื้นฐานระบบอัจฉริยะ การค้นหาแบบฮิวริสติก การแทนความรู้ (Knowledge Representation) ตรรกะเชิงเพรดิเคต ระบบผู้เชี่ยวชาญ และ Fuzzy Logic เพื่อนำไปต่อยอดด้านปัญญาประดิษฐ์',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.2,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Project & Labs', percent: 30, color: 'bg-purple-500' },
    ],
    topics: {
      midterm: ['AI Overview', 'Search Algorithms (BFS, DFS, A*)', 'Heuristic Search', 'Knowledge Representation', 'Predicate Logic'],
      final: ['Expert Systems', 'Fuzzy Logic', 'Planning', 'Introduction to ML', 'AI Applications'],
    },
  },
  {
    id: '040613702', code: '040613702', name: 'MACHINE LEARNING', credits: 3, prereq: '040613701',
    description: 'หลักการการเรียนรู้ของเครื่อง Supervised/Unsupervised/Reinforcement Learning อัลกอริทึม Regression, Classification, Clustering และ Neural Network เบื้องต้น รวมถึงการประเมินและปรับจูนโมเดล',
    professors: ['TBA'], difficulty: 4.5, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Project', percent: 40, color: 'bg-blue-500' },
    ],
    topics: {
      midterm: ['Supervised Learning', 'Regression', 'Classification (KNN, SVM, Decision Tree)', 'Model Evaluation'],
      final: ['Unsupervised Learning', 'Clustering', 'Dimensionality Reduction', 'Neural Networks Basics', 'Reinforcement Learning'],
    },
  },
  {
    id: '040613704', code: '040613704', name: 'DEEP LEARNING', credits: 3, prereq: '040613702',
    description: 'โครงข่ายประสาทเทียมเชิงลึก (Deep Neural Networks) CNN สำหรับภาพ RNN/LSTM สำหรับลำดับข้อมูล Transformer และการนำไปประยุกต์ใช้ด้าน CV และ NLP',
    professors: ['TBA'], difficulty: 5.0, satisfaction: 4.6,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Deep Learning Project', percent: 40, color: 'bg-violet-500' },
    ],
    topics: {
      midterm: ['MLP & Backpropagation', 'CNN Architecture', 'Image Classification', 'Transfer Learning'],
      final: ['RNN & LSTM', 'Attention Mechanism', 'Transformer Basics', 'Object Detection', 'Generative Models'],
    },
  },
  {
    id: '040613703', code: '040613703', name: 'AI SOFTWARE DEVELOPMENT', credits: 3, prereq: '040613701',
    description: 'การพัฒนาซอฟต์แวร์ที่ผสานปัญญาประดิษฐ์ การออกแบบระบบ AI-Powered Application การ Deploy โมเดล ML สู่ Production การใช้ API และ Framework สมัยใหม่',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.3,
    scoring: [
      { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
      { label: 'AI Application Project', percent: 50, color: 'bg-emerald-500' },
    ],
    topics: {
      midterm: ['AI System Design', 'Data Pipeline', 'Model Integration', 'REST API for AI'],
      final: ['Model Deployment', 'MLOps Basics', 'AI Ethics & Bias', 'Final AI Project'],
    },
  },
  {
    id: '040613705', code: '040613705', name: 'BIG DATA ENGINEERING', credits: 3, prereq: '040613701',
    description: 'วิศวกรรมข้อมูลขนาดใหญ่ เทคโนโลยี Hadoop, Spark, Kafka, Data Warehouse, Data Lake และ ETL Pipeline การวิเคราะห์ข้อมูลในระดับ Big Data',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Big Data Project', percent: 30, color: 'bg-cyan-500' },
    ],
    topics: {
      midterm: ['Big Data Concepts', 'Hadoop Ecosystem', 'MapReduce', 'HDFS'],
      final: ['Apache Spark', 'Kafka Streaming', 'Data Warehouse vs Data Lake', 'ETL Pipeline Project'],
    },
  },
  {
    id: '040613706', code: '040613706', name: 'NATURAL LANGUAGE PROCESSING', credits: 3, prereq: '040613701',
    description: 'การประมวลผลภาษาธรรมชาติ Text Preprocessing, Word Embedding, Sentiment Analysis, Named Entity Recognition, Machine Translation และการใช้ Transformer/LLM',
    professors: ['TBA'], difficulty: 4.5, satisfaction: 4.4,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'NLP Project', percent: 40, color: 'bg-indigo-500' },
    ],
    topics: {
      midterm: ['Text Preprocessing', 'Word Embedding (Word2Vec, GloVe)', 'Sentiment Analysis', 'Text Classification'],
      final: ['Sequence Models', 'NER & POS Tagging', 'Machine Translation', 'BERT & Transformers', 'Chatbot Development'],
    },
  },
  {
    id: '040613707', code: '040613707', name: 'COMPUTER VISION', credits: 3, prereq: '040613701',
    description: 'คอมพิวเตอร์วิทัศน์ การประมวลผลภาพ Feature Extraction, Object Detection, Image Segmentation, Face Recognition และการประยุกต์ใช้ Deep Learning กับภาพ',
    professors: ['TBA'], difficulty: 4.5, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Vision Project', percent: 40, color: 'bg-rose-500' },
    ],
    topics: {
      midterm: ['Image Fundamentals', 'Filtering & Edge Detection', 'Feature Extraction (HOG, SIFT)', 'Image Classification with CNN'],
      final: ['Object Detection (YOLO)', 'Image Segmentation', 'Face Recognition', 'Video Analysis', 'CV Project Demo'],
    },
  },
  {
    id: '040613152', code: '040613152', name: 'SELECTED TOPICS IN CS II', credits: 3, prereq: null,
    description: 'หัวข้อพิเศษด้านวิทยาการคอมพิวเตอร์ที่น่าสนใจและทันสมัย เนื้อหาจะปรับเปลี่ยนตามแนวโน้มเทคโนโลยีในแต่ละปีการศึกษา',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Report / Project', percent: 30, color: 'bg-blue-500' },
    ],
    topics: { midterm: ['TBA — ขึ้นกับอาจารย์ผู้สอน'], final: ['TBA — ขึ้นกับอาจารย์ผู้สอน'] },
  },

  // Security & Network Track
  {
    id: '040613504', code: '040613504', name: 'INTERNETWORKING TECHNOLOGY', credits: 3, prereq: '040613502',
    description: 'เทคโนโลยีการเชื่อมต่อระหว่างเครือข่าย Routing Protocols (RIP, OSPF, BGP) VLAN, Subnetting, IPv6, QoS และสถาปัตยกรรม SDN',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Lab Assignments', percent: 30, color: 'bg-cyan-500' },
    ],
    topics: {
      midterm: ['Subnetting & VLSM', 'VLAN & Trunking', 'RIP & OSPF', 'IPv6'],
      final: ['BGP Basics', 'NAT & PAT', 'QoS', 'SDN Introduction', 'Network Project'],
    },
  },
  {
    id: '040613503', code: '040613503', name: 'WIRELESS COMMUNICATION & NETWORK', credits: 3, prereq: '040613502',
    description: 'การสื่อสารแบบไร้สาย WiFi (802.11), Bluetooth, ZigBee, 4G/5G, การออกแบบเครือข่ายไร้สาย ความปลอดภัยและการจัดการความถี่',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.1,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Lab Project', percent: 30, color: 'bg-sky-500' },
    ],
    topics: {
      midterm: ['Wireless Fundamentals', 'IEEE 802.11 (WiFi)', 'Bluetooth & ZigBee', 'Cellular Networks'],
      final: ['4G LTE & 5G', 'Wireless Security', 'WLAN Design', 'IoT Connectivity'],
    },
  },
  {
    id: '040613605', code: '040613605', name: 'PENETRATION TESTING & PROTECTION', credits: 3, prereq: '040613502',
    description: 'การทดสอบเจาะระบบ (Penetration Testing) Ethical Hacking, การสแกนช่องโหว่ Exploitation Techniques, Post-Exploitation และการเขียน Security Report',
    professors: ['TBA'], difficulty: 5.0, satisfaction: 4.7,
    scoring: [
      { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
      { label: 'Pentest Lab Project', percent: 50, color: 'bg-red-700' },
    ],
    topics: {
      midterm: ['Ethical Hacking Methodology', 'Reconnaissance & Scanning', 'Vulnerability Assessment', 'Exploitation Basics'],
      final: ['Web App Pentesting', 'Network Pentesting', 'Post-Exploitation', 'Report Writing', 'CTF Challenge'],
    },
  },
  {
    id: '040613602', code: '040613602', name: 'NETWORK SECURITY', credits: 3, prereq: '040613502',
    description: 'ความมั่นคงของเครือข่าย Firewall, IDS/IPS, VPN, PKI, SSL/TLS, Zero Trust Architecture และการรับมือกับการโจมตีในระดับเครือข่าย',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.2,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Security Lab', percent: 30, color: 'bg-blue-700' },
    ],
    topics: {
      midterm: ['Cryptography Review', 'Firewall & ACL', 'IDS & IPS', 'VPN Configuration'],
      final: ['PKI & SSL/TLS', 'DoS/DDoS Protection', 'Zero Trust', 'SIEM & Log Analysis', 'Security Audit'],
    },
  },
  {
    id: '040613604', code: '040613604', name: 'DIGITAL FORENSICS', credits: 3, prereq: '040613502',
    description: 'นิติวิทยาศาสตร์ดิจิทัล กระบวนการสืบสวนดิจิทัล การเก็บหลักฐาน (Evidence Collection) การวิเคราะห์ระบบไฟล์ Memory Forensics และ Network Forensics',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.3,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Forensic Case Project', percent: 40, color: 'bg-slate-500' },
    ],
    topics: {
      midterm: ['Digital Forensics Overview', 'Evidence Handling & Chain of Custody', 'File System Forensics', 'Disk Imaging'],
      final: ['Memory Forensics', 'Network Forensics', 'Mobile Forensics', 'Forensic Report', 'Case Study'],
    },
  },
  {
    id: '040613603', code: '040613603', name: 'DEFENSIVE PROGRAMMING', credits: 3, prereq: '040613203',
    description: 'การเขียนโปรแกรมเชิงป้องกัน Secure Coding Practices, OWASP Top 10, Buffer Overflow Prevention, Input Validation, SQL Injection Prevention และ Static/Dynamic Analysis',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.1,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Secure Code Project', percent: 40, color: 'bg-green-700' },
    ],
    topics: {
      midterm: ['Secure Coding Principles', 'Input Validation & Sanitization', 'OWASP Top 10', 'Buffer Overflow'],
      final: ['SQL Injection Prevention', 'XSS & CSRF', 'Cryptography in Code', 'Code Review & Static Analysis', 'Security Testing'],
    },
  },
  {
    id: '040613505', code: '040613505', name: 'UNIX TOOL', credits: 3, prereq: '040613100',
    description: 'การใช้งาน UNIX/Linux Shell และเครื่องมือต่างๆ การเขียน Shell Script การจัดการไฟล์และกระบวนการ Regex, AWK, SED, Grep และการใช้งาน Command Line อย่างมีประสิทธิภาพ',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.3,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Shell Script Project', percent: 40, color: 'bg-green-600' },
    ],
    topics: {
      midterm: ['Linux File System', 'Basic Commands', 'Permissions & Users', 'Shell Scripting Basics', 'Regex'],
      final: ['AWK & SED', 'Process Management', 'Cron Jobs', 'Networking Commands', 'Automation Scripts'],
    },
  },
  {
    id: '040613506', code: '040613506', name: 'UNIX ADMINISTRATION', credits: 3, prereq: '040613505',
    description: 'การบริหารระบบ UNIX/Linux การติดตั้งและกำหนดค่า Server การจัดการ User/Group การตรวจสอบระบบ Backup/Restore และการทำ RAID และ LVM',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Admin Lab Project', percent: 40, color: 'bg-emerald-600' },
    ],
    topics: {
      midterm: ['User & Group Management', 'Package Management', 'Service & Daemon Control', 'Disk Management & RAID'],
      final: ['Network Services (DNS, DHCP, NFS)', 'Backup & Recovery', 'System Monitoring', 'Security Hardening', 'Admin Project'],
    },
  },

  // Game & Graphic Track
  {
    id: '040613801', code: '040613801', name: 'COMPUTER GRAPHICS', credits: 3, prereq: '040613104',
    description: 'คอมพิวเตอร์กราฟิกส์ เรขาคณิต 2D/3D, Transformation Matrix, Projection, Rasterization, Shading Models (Phong, Gouraud), OpenGL/WebGL เบื้องต้น',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.2,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Graphics Project', percent: 40, color: 'bg-amber-500' },
    ],
    topics: {
      midterm: ['2D/3D Geometry', 'Transformation Matrices', 'Viewing & Projection', 'Rasterization'],
      final: ['Shading & Lighting', 'Texture Mapping', 'OpenGL Basics', 'Ray Tracing Intro', 'Graphics Project'],
    },
  },
  {
    id: '040613802', code: '040613802', name: 'COMPUTER GAME DESIGN', credits: 3, prereq: '040613201',
    description: 'หลักการออกแบบเกมคอมพิวเตอร์ Game Mechanics, Gameplay Design, Level Design, Game Engine (Unity/Unreal), Physics Engine, AI สำหรับเกม และ Playtesting',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.8,
    scoring: [
      { label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 20, color: 'bg-red-500' },
      { label: 'Game Project', percent: 60, color: 'bg-yellow-500' },
    ],
    topics: {
      midterm: ['Game Design Principles', 'Game Mechanics & Dynamics', 'Level Design', 'Game Engine Intro (Unity)'],
      final: ['Physics Engine', 'AI in Games', 'UI/UX for Games', 'Playtesting', 'Final Game Demo'],
    },
  },
  {
    id: '040613804', code: '040613804', name: '3D MODELING', credits: 3, prereq: '040613104',
    description: 'การสร้างโมเดลสามมิติด้วยซอฟต์แวร์ (Blender/Maya) Polygon Modeling, Subdivision Surface, UV Mapping, Texturing และการเตรียม Asset สำหรับ Game/Animation',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.6,
    scoring: [
      { label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 20, color: 'bg-red-500' },
      { label: '3D Project Portfolio', percent: 60, color: 'bg-orange-600' },
    ],
    topics: {
      midterm: ['3D Software Interface', 'Polygon Modeling', 'Subdivision Surfaces', 'UV Unwrapping'],
      final: ['Texturing & Materials', 'Rigging Basics', 'Scene Lighting', 'Rendering', 'Portfolio Project'],
    },
  },
  {
    id: '040613805', code: '040613805', name: 'COMPUTER ANIMATION', credits: 3, prereq: '040613801',
    description: 'ภาพเคลื่อนไหวคอมพิวเตอร์ 12 Principles of Animation, Keyframe Animation, Rigging & Skinning, Motion Capture, Particle System และ Procedural Animation',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 20, color: 'bg-red-500' },
      { label: 'Animation Portfolio', percent: 60, color: 'bg-pink-500' },
    ],
    topics: {
      midterm: ['12 Principles of Animation', 'Keyframe Animation', 'Rigging & Skinning', 'Walk Cycle'],
      final: ['Facial Animation', 'Motion Capture', 'Particle Systems', 'Procedural Animation', 'Short Animation Project'],
    },
  },
  {
    id: '040613806', code: '040613806', name: 'LIGHTING & SHADING', credits: 3, prereq: '040613801',
    description: 'การให้แสงและเงาในงาน 3D Light Types, Shadow Algorithms, PBR (Physically Based Rendering), Shader Programming (GLSL/HLSL) และ Post-processing Effects',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.3,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Shading Project', percent: 40, color: 'bg-amber-600' },
    ],
    topics: {
      midterm: ['Light Types & Properties', 'Shadow Mapping', 'PBR Introduction', 'GLSL Shader Basics'],
      final: ['Advanced Shaders', 'Global Illumination', 'HDR & Tone Mapping', 'Post-processing', 'Shader Portfolio'],
    },
  },
  {
    id: '040613803', code: '040613803', name: 'VIRTUAL REALITY & AUGMENTED REALITY', credits: 3, prereq: '040613201',
    description: 'ความเป็นจริงเสมือนและเสริม VR/AR Hardware, Head-Mounted Display, Spatial Computing, Unity XR Development, Interaction Design สำหรับ Immersive Experience',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.7,
    scoring: [
      { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
      { label: 'XR Project', percent: 50, color: 'bg-violet-500' },
    ],
    topics: {
      midterm: ['VR/AR Overview', 'HMD & Input Devices', 'Unity XR Setup', '3DoF vs 6DoF'],
      final: ['Spatial Interaction Design', 'AR Marker Tracking', 'Occlusion & Blending', 'Performance Optimization', 'XR App Demo'],
    },
  },

  // IoT & Robot Track
  {
    id: '040613901', code: '040613901', name: 'EMBEDDED SYSTEM DESIGN', credits: 3, prereq: '040613112',
    description: 'การออกแบบระบบฝังตัว สถาปัตยกรรม Microcontroller (ARM Cortex-M), GPIO, Interrupt, Timer, UART/SPI/I2C, RTOS เบื้องต้น และการเชื่อมต่อ Sensor/Actuator',
    professors: ['TBA'], difficulty: 4.5, satisfaction: 4.3,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Embedded Project', percent: 40, color: 'bg-emerald-600' },
    ],
    topics: {
      midterm: ['Microcontroller Architecture', 'GPIO & Interrupts', 'Timers & PWM', 'UART Communication'],
      final: ['SPI & I2C', 'RTOS Basics', 'Sensor Integration', 'Power Management', 'Embedded System Project'],
    },
  },
  {
    id: '040613902', code: '040613902', name: 'INTERNET OF THINGS', credits: 3, prereq: '040613201',
    description: 'อินเทอร์เน็ตของสรรพสิ่ง สถาปัตยกรรม IoT, Protocol (MQTT, CoAP, HTTP), Edge Computing, Cloud Platform (AWS IoT, Azure IoT), Security สำหรับ IoT',
    professors: ['TBA'], difficulty: 3.5, satisfaction: 4.4,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'IoT Project', percent: 40, color: 'bg-teal-500' },
    ],
    topics: {
      midterm: ['IoT Architecture & Layers', 'Sensor & Actuator', 'MQTT Protocol', 'ESP32/Raspberry Pi'],
      final: ['Cloud IoT Platform', 'Edge Computing', 'IoT Security', 'Data Analytics for IoT', 'Smart Device Project'],
    },
  },
  {
    id: '040613904', code: '040613904', name: 'ROBOTIC SCIENCE AND CONTROL SYSTEM', credits: 3, prereq: '040613901',
    description: 'วิทยาการหุ่นยนต์และระบบควบคุม Kinematics, Dynamics, PID Controller, Robot Operating System (ROS), Path Planning และการเขียนโปรแกรมควบคุมหุ่นยนต์',
    professors: ['TBA'], difficulty: 4.5, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Robotics Project', percent: 40, color: 'bg-green-600' },
    ],
    topics: {
      midterm: ['Robot Kinematics', 'Forward & Inverse Kinematics', 'Sensors for Robotics', 'PID Controller'],
      final: ['Robot Operating System (ROS)', 'Path Planning (A*, Dijkstra)', 'SLAM Basics', 'Robot Demo Project'],
    },
  },
  {
    id: '040613903', code: '040613903', name: 'GEOSPATIAL INFO TECH FOR SMART CITY', credits: 3, prereq: '040613301',
    description: 'เทคโนโลยีสารสนเทศภูมิศาสตร์สำหรับเมืองอัจฉริยะ GIS, GPS, Remote Sensing, OpenStreetMap, การวิเคราะห์เชิงพื้นที่ และการนำไปใช้ในระบบ Smart City',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'GIS Project', percent: 30, color: 'bg-lime-600' },
    ],
    topics: {
      midterm: ['GIS Fundamentals', 'Coordinate Systems', 'Remote Sensing', 'Spatial Data Types'],
      final: ['Spatial Analysis', 'OpenStreetMap & QGIS', 'Smart City Applications', 'GIS Project'],
    },
  },
  {
    id: '040613153', code: '040613153', name: 'SELECTED TOPICS IN CS III', credits: 3, prereq: null,
    description: 'หัวข้อพิเศษด้านวิทยาการคอมพิวเตอร์ที่น่าสนใจและทันสมัย เนื้อหาจะปรับเปลี่ยนตามแนวโน้มเทคโนโลยีในแต่ละปีการศึกษา',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Report / Project', percent: 30, color: 'bg-blue-500' },
    ],
    topics: { midterm: ['TBA — ขึ้นกับอาจารย์ผู้สอน'], final: ['TBA — ขึ้นกับอาจารย์ผู้สอน'] },
  },
  {
    id: '040613905', code: '040613905', name: 'BLOCKCHAIN', credits: 3, prereq: null,
    description: 'ห่วงโซ่บล็อก Distributed Ledger Technology, Consensus Mechanisms (PoW, PoS), Smart Contract (Solidity), Ethereum, DeFi, NFT และการประยุกต์ใช้ Blockchain ในธุรกิจ',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.2,
    scoring: [
      { label: 'Midterm Exam', percent: 30, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 30, color: 'bg-red-500' },
      { label: 'Smart Contract Project', percent: 40, color: 'bg-yellow-600' },
    ],
    topics: {
      midterm: ['Blockchain Fundamentals', 'Cryptographic Hashing', 'Consensus Mechanisms', 'Bitcoin & Ethereum'],
      final: ['Smart Contracts (Solidity)', 'DApps Development', 'DeFi & NFT', 'Blockchain Security', 'Project Demo'],
    },
  },

  // Full-Stack Track
  {
    id: '040613411', code: '040613411', name: 'WEB DEVELOPMENT', credits: 3, prereq: '040613201',
    description: 'การพัฒนาเว็บแอปพลิเคชัน HTML5, CSS3, JavaScript (ES6+), Responsive Design, เครื่องมือ Developer และการ Deploy เว็บขึ้น Server เบื้องต้น',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
      { label: 'Web Project', percent: 50, color: 'bg-pink-500' },
    ],
    topics: {
      midterm: ['HTML5 & CSS3', 'JavaScript Basics', 'DOM Manipulation', 'Responsive Design'],
      final: ['ES6+ Features', 'Fetch API & AJAX', 'Git & Deployment', 'Web Project Demo'],
    },
  },
  {
    id: '040613412', code: '040613412', name: 'WEB FRAMEWORK', credits: 3, prereq: '040613411',
    description: 'เว็บเฟรมเวิร์คสมัยใหม่ React.js หรือ Vue.js สำหรับ Frontend, Node.js/Express หรือ Django/FastAPI สำหรับ Backend, REST API, Authentication และ Full-Stack Deployment',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.6,
    scoring: [
      { label: 'Midterm Exam', percent: 20, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 20, color: 'bg-red-500' },
      { label: 'Full-Stack Project', percent: 60, color: 'bg-rose-500' },
    ],
    topics: {
      midterm: ['React/Vue Fundamentals', 'Component Architecture', 'State Management', 'REST API Design'],
      final: ['Backend with Node/Django', 'Database Integration', 'JWT Authentication', 'Deployment (Docker/Cloud)', 'Full-Stack Demo'],
    },
  },
  {
    id: '040613421', code: '040613421', name: 'MOBILE APPLICATION DEVELOPMENT', credits: 3, prereq: '040613204',
    description: 'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่ Flutter/React Native สำหรับ Cross-Platform, UI Components, State Management, Local Storage, REST API Integration และการ Publish แอป',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 4.5,
    scoring: [
      { label: 'Midterm Exam', percent: 25, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 25, color: 'bg-red-500' },
      { label: 'Mobile App Project', percent: 50, color: 'bg-fuchsia-500' },
    ],
    topics: {
      midterm: ['Mobile Dev Overview', 'Flutter/React Native Setup', 'UI Components & Layouts', 'Navigation'],
      final: ['State Management', 'API Integration', 'Local Storage', 'Push Notifications', 'App Store Deployment'],
    },
  },
  {
    id: '040613521', code: '040613521', name: 'SELECTED TOPICS IN CS I', credits: 3, prereq: null,
    description: 'หัวข้อพิเศษด้านวิทยาการคอมพิวเตอร์ที่น่าสนใจและทันสมัย เนื้อหาจะปรับเปลี่ยนตามแนวโน้มเทคโนโลยีในแต่ละปีการศึกษา',
    professors: ['TBA'], difficulty: 3.0, satisfaction: 4.0,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Report / Project', percent: 30, color: 'bg-blue-500' },
    ],
    topics: { midterm: ['TBA — ขึ้นกับอาจารย์ผู้สอน'], final: ['TBA — ขึ้นกับอาจารย์ผู้สอน'] },
  },

  // Digital Circuit (base for IoT)
  {
    id: '040613112', code: '040613112', name: 'DIGITAL CIRCUIT DESIGN', credits: 3, prereq: null,
    description: 'การออกแบบวงจรดิจิทัล พีชคณิตบูลีน ตารางความจริง วงจรเชิงตรรกะ (Combinational Circuits) วงจรเชิงลำดับ (Sequential Circuits) Flip-Flop, Register, Counter และการออกแบบด้วย HDL',
    professors: ['TBA'], difficulty: 4.0, satisfaction: 3.8,
    scoring: [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam', percent: 35, color: 'bg-red-500' },
      { label: 'Lab', percent: 30, color: 'bg-yellow-600' },
    ],
    topics: {
      midterm: ['Boolean Algebra', 'Logic Gates', 'Karnaugh Map', 'Combinational Circuits (Adder, MUX, Decoder)'],
      final: ['Sequential Circuits', 'Flip-Flops', 'Registers & Counters', 'Finite State Machine', 'VHDL/Verilog Intro'],
    },
  },
        ]
      }
    ]
  }
];