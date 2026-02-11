// src/data/courses.js

export const roadmapData = [
  // --- YEAR 1 ---
  {
    year: "Year 1",
    semesters: [
      {
        term: "Semester 1",
        courses: [
          { id: '040203101', code: '040203101', name: 'MATHEMATICS I', credits: 3, status: 'passed', prereq: null },
          { id: '040613103', code: '040613103', name: 'DISCRETE MATH. FOR CS', credits: 3, status: 'passed', prereq: null },
          { id: '040613201', code: '040613201', name: 'COMPUTER PROGRAMMING I', credits: 3, status: 'passed', prereq: null },
          { id: '040613100', code: '040613100', name: 'FUNDAMENTAL OF CS', credits: 3, status: 'passed', prereq: null },
          { id: '0802xxxxx', code: '0802xxxxx', name: 'SOCIAL SCIENCES ELECTIVE', credits: 3, status: 'passed', prereq: null },
          { id: '04xxxxxxx', code: '04xxxxxxx', name: 'SCIENCES & MATH ELECTIVE', credits: 3, status: 'passed', prereq: null },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          { id: '040613104', code: '040613104', name: 'MATHEMATICS FOR COMPUTER', credits: 3, status: 'passed', prereq: '040203101' },
          { id: '040613301', code: '040613301', name: 'DATABASE SYSTEMS', credits: 3, status: 'passed', prereq: '040613201' },
          { id: '040613203', code: '040613203', name: 'STRUCTURE PROGRAMMING', credits: 3, status: 'passed', prereq: '040613201' },
          { id: '040613501', code: '040613501', name: 'ORG & OPERATING SYSTEM', credits: 3, status: 'passed', prereq: '040613100' },
          { id: '040613303', code: '040613303', name: 'HUMAN COMPUTER INTERACTION', credits: 3, status: 'passed', prereq: null },
          { id: '040503011', code: '040503011', name: 'STAT. FOR ENGINEERS', credits: 3, status: 'passed', prereq: null },
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
          { id: '040613105', code: '040613105', name: 'NUMERICAL METHODS', credits: 3, status: 'passed', prereq: '040613104' },
          { id: '040613205', code: '040613205', name: 'DATA STRUCTURE', credits: 3, status: 'passed', prereq: '040613201' },
          { id: '040613204', code: '040613204', name: 'OOP', credits: 3, status: 'passed', prereq: '040613203' },
          { id: '040613302', code: '040613302', name: 'SYSTEM ANALYSIS AND DESIGN', credits: 3, status: 'passed', prereq: '040613301' },
          { id: '040613xxx', code: '040613xxx', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'passed', prereq: null },
          { id: '08xxxxxxx', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'passed', prereq: null },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          { id: '040613502', code: '040613502', name: 'COMPUTER NETWORKS', credits: 3, status: 'active', prereq: '040613501' },
          { id: '040613206', code: '040613206', name: 'DESIGN & ANALYSIS ALGO', credits: 3, status: 'active', prereq: '040613205' },
          { id: '040613701', code: '040613701', name: 'INTELLIGENT SYSTEMS', credits: 3, status: 'active', prereq: '040613205' },
          { id: '040613306', code: '040613306', name: 'SOFTWARE ENGINEERING', credits: 3, status: 'active', prereq: '040613302' },
          { id: '040613601', code: '040613601', name: 'COMPUTER SECURITY', credits: 3, status: 'active', prereq: '040613100' },
          { id: '08xxxxxxx-2', code: '08xxxxxxx', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'active', prereq: null },
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
          { id: 'PE1', code: 'PE-1', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE2', code: 'PE-2', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE3', code: 'PE-3', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE4', code: 'PE-4', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'SCI2', code: 'SCI-2', name: 'SCIENCES & MATH ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'LANG2', code: 'LANG-2', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'locked', prereq: null },
        ]
      },
      {
        term: "Semester 2",
        courses: [
          { id: 'PE5', code: 'PE-5', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE6', code: 'PE-6', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE7', code: 'PE-7', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: '040003004', code: '040003004', name: 'DESIGN THINKING', credits: 3, status: 'locked', prereq: null },
          { id: 'SPORT', code: 'SPORT', name: 'SPORT & RECREATION', credits: 1, status: 'locked', prereq: null },
          { id: 'LANG3', code: 'LANG-3', name: 'LANGUAGE ELECTIVE', credits: 3, status: 'locked', prereq: null },
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
          { id: 'INTERNSHIP', code: 'INTERNSHIP', name: 'INTERNSHIP (240 hours)', credits: 0, status: 'locked', prereq: null },
        ]
      },
      {
        term: "Semester 1 (Project I)",
        courses: [
          { id: '040613141', code: '040613141', name: 'SPECIAL PROJECT I', credits: 1, status: 'locked', prereq: null },
          { id: 'PE8', code: 'PE-8', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'PE9', code: 'PE-9', name: 'PROFESSIONAL ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'FREE1', code: 'FREE-1', name: 'FREE ELECTIVE COURSE', credits: 3, status: 'locked', prereq: null },
        ]
      },
      {
        term: "Semester 2 (Project II)",
        courses: [
          { id: '040613142', code: '040613142', name: 'SPECIAL PROJECT II', credits: 3, status: 'locked', prereq: '040613141' },
          { id: 'SOC2', code: 'SOC-2', name: 'SOCIAL SCIENCE ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'HUM1', code: 'HUM-1', name: 'HUMANTIES ELECTIVE', credits: 3, status: 'locked', prereq: null },
          { id: 'FREE2', code: 'FREE-2', name: 'FREE ELECTIVE COURSE', credits: 3, status: 'locked', prereq: null },
        ]
      }
    ]
  }
];