// src/pages/Roadmap.jsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { CheckCircle, Lock, BookOpen, AlertCircle, Sparkles, GraduationCap, Code } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { useNavigate } from 'react-router-dom';


const Roadmap = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('core'); // 'core' or 'elective'
  const navigate = useNavigate();

  // --- 1. Load User Data from LocalStorage ---
  const [profile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      passedCourses: [],
      learningCourses: [],
      courseStates: {},
      customElectives: {},
      currentYear: 1,
      currentTerm: 1
    };
  });

  // --- 2. Process Core Courses with Status ---
  const processedRoadmap = useMemo(() => {
    return roadmapData.map((yearGroup, yIdx) => {
      const yearNum = parseInt(yearGroup.year.replace('Year ', ''));

      return {
        ...yearGroup,
        semesters: yearGroup.semesters.map((sem, sIdx) => {
          // กำหนด termNum ตามจริง (Year 4 มี 3 terms)
          const termNum = sIdx + 1;

          return {
            ...sem,
            courses: sem.courses.map(course => {
              let status = 'locked'; // Default

              // Check from courseStates
              const courseState = profile.courseStates?.[course.id];
              if (courseState === 'passed') {
                status = 'passed';
              } else if (courseState === 'learning') {
                status = 'active';
              } else if (profile.currentYear === yearNum && profile.currentTerm === termNum) {
                status = 'available'; // เทอมปัจจุบันแต่ยังไม่เลือก
              } else if (profile.currentYear > yearNum || (profile.currentYear === yearNum && profile.currentTerm > termNum)) {
                status = 'missed'; // เทอมที่ผ่านมาแล้วแต่ยังไม่ผ่าน
              }

              // ✅ เช็ค Prerequisite สำหรับการ Unlock
              if (course.prereq) {
                const prereqPassed = profile.courseStates?.[course.prereq] === 'passed';
                if (!prereqPassed && status === 'locked') {
                  status = 'locked'; // ยังล็อคอยู่ถ้า Prereq ยังไม่ผ่าน
                }
              }

              return { ...course, status };
            })
          };
        })
      };
    });
  }, [profile]);

  // --- 3. Process Elective Courses ---
  const processedElectives = useMemo(() => {
    return electiveCourses.map(elective => {
      let status = 'available'; // Default
      const courseState = profile.courseStates?.[elective.id];

      if (courseState === 'passed') {
        status = 'passed';
      } else if (courseState === 'learning') {
        status = 'active';
      }

      return { ...elective, status };
    });
  }, [profile]);

  // --- 4. Draw Lines for Core Courses ---
  const drawLines = () => {
    if (!containerRef.current || activeTab !== 'core') return;
    const newLines = [];
    const containerRect = containerRef.current.getBoundingClientRect();

    processedRoadmap.forEach(year => {
      year.semesters.forEach(sem => {
        sem.courses.forEach(course => {
          if (course.prereq) {
            const startEl = document.getElementById(`core-${course.prereq}`);
            const endEl = document.getElementById(`core-${course.id}`);

            if (startEl && endEl) {
              const startRect = startEl.getBoundingClientRect();
              const endRect = endEl.getBoundingClientRect();

              const startX = startRect.left + startRect.width / 2 - containerRect.left;
              const startY = startRect.bottom - containerRect.top;
              const endX = endRect.left + endRect.width / 2 - containerRect.left;
              const endY = endRect.top - containerRect.top;

              // Check if prerequisite is passed
              const prereqPassed = profile.courseStates?.[course.prereq] === 'passed';
              const targetPassed = profile.courseStates?.[course.id] === 'passed';

              newLines.push({
                id: `${course.prereq}-${course.id}`,
                start: course.prereq,
                end: course.id,
                startX,
                startY,
                endX,
                endY,
                prereqPassed,
                targetPassed
              });
            }
          }
        });
      });
    });
    setLines(newLines);
  };

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

  // --- Helper: หาวิชาที่เกี่ยวข้อง (ถ้า Hover ต้นทาง → แสดงแค่ลูก, ถ้า Hover ปลายทาง → แสดงทั้งสายย้อนกลับ) ---
  const getRelatedCourses = (courseId) => {
    if (!courseId) return { related: new Set(), direction: null };
    
    const related = new Set([courseId]); // เริ่มจากตัวเอง
    
    // เช็คว่าวิชานี้มี Prerequisite หรือไม่
    let hasPrereq = false;
    processedRoadmap.forEach(year => {
      year.semesters.forEach(sem => {
        sem.courses.forEach(course => {
          if (course.id === courseId && course.prereq) {
            hasPrereq = true;
          }
        });
      });
    });
    
    if (hasPrereq) {
      // ✅ กรณีที่ 1: วิชานี้มี Prereq → แสดงทั้งสายย้อนกลับ (Prerequisites)
      const findPrereqs = (id) => {
        processedRoadmap.forEach(year => {
          year.semesters.forEach(sem => {
            sem.courses.forEach(course => {
              if (course.id === id && course.prereq) {
                related.add(course.prereq);
                findPrereqs(course.prereq); // ย้อนต่อไปเรื่อยๆ
              }
            });
          });
        });
      };
      findPrereqs(courseId);
      return { related, direction: 'backward' };
      
    } else {
      // ✅ กรณีที่ 2: วิชานี้ไม่มี Prereq (เป็นต้นทาง) → แสดงแค่ลูกโซ่ถัดไป (Dependents)
      const findDependents = (id) => {
        processedRoadmap.forEach(year => {
          year.semesters.forEach(sem => {
            sem.courses.forEach(course => {
              if (course.prereq === id) {
                related.add(course.id);
                findDependents(course.id); // หาต่อไปเรื่อยๆ
              }
            });
          });
        });
      };
      findDependents(courseId);
      return { related, direction: 'forward' };
    }
  };

  const { related: relatedCourses, direction: relatedDirection } = useMemo(() => {
    return getRelatedCourses(hoveredCourse);
  }, [hoveredCourse, processedRoadmap]);

  // --- Style Helpers ---
  const getCoreStatusClass = (status, isRelated = false) => {
    const base = "relative p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 h-[140px] flex flex-col justify-between group cursor-pointer shadow-lg select-none";
    
    // ✅ ถ้าเป็นวิชาที่เกี่ยวข้อง ให้นูนขึ้นมาเด่นๆ
    const relatedClass = isRelated 
      ? "!scale-110 !z-50 !shadow-2xl !shadow-cyan-500/50 !border-cyan-400 ring-4 ring-cyan-400/50 !-translate-y-2" 
      : "";
    
    switch (status) {
      case 'passed':
        return `${base} ${relatedClass} bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border-emerald-500/60 shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-emerald-400`;
      case 'active':
        return `${base} ${relatedClass} bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-400/70 shadow-blue-500/30 hover:shadow-blue-500/50 scale-[1.02] hover:scale-[1.05] hover:border-blue-300 z-10 ring-2 ring-blue-400/30 animate-pulse-subtle`;
      case 'available':
        return `${base} ${relatedClass} bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/40 shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-purple-400`;
      case 'missed':
        return `${base} ${relatedClass} bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/40 shadow-orange-500/20 opacity-80 hover:opacity-100 hover:-translate-y-1`;
      case 'locked':
      default:
        return `${base} ${relatedClass} bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-600/40 opacity-60 grayscale hover:opacity-90 hover:grayscale-0 hover:border-slate-500`;
    }
  };

  const getElectiveStatusClass = (status) => {
    const base = "relative p-5 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 min-h-[160px] flex flex-col justify-between group cursor-pointer shadow-lg select-none";
    switch (status) {
      case 'passed':
        return `${base} bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border-emerald-500/60 shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-2 hover:scale-[1.03]`;
      case 'active':
        return `${base} bg-gradient-to-br from-blue-900/70 to-cyan-900/50 border-blue-400/70 shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-2 hover:scale-[1.03] ring-2 ring-blue-400/30`;
      default:
        return `${base} bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-600/50 hover:border-orange-500/50 hover:shadow-orange-500/30 hover:-translate-y-2 hover:scale-[1.03]`;
    }
  };

  // ✅ Helper: ตรวจสอบประเภทของวิชา
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

  return (
    <div className="min-h-screen p-6 md:p-12 text-white relative overflow-hidden">
      {/* พื้นหลังโปร่งใสเพื่อให้เห็นภาพพื้นหลังด้านหลัง */}

      {/* Header */}
      <div className="text-center mb-12 space-y-6 relative z-20">
        <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-2xl tracking-tight">
          CS Curriculum Roadmap
        </h1>
        <p className="text-slate-300 text-lg md:text-xl font-medium">
          Interactive Learning Path & Course Explorer
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setActiveTab('core')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              activeTab === 'core'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/70 hover:text-white border border-slate-700'
            }`}
          >
            <Code size={20} />
            Core Courses
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
            Elective Courses
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold text-slate-300 mt-6 bg-black/40 py-3 px-8 rounded-full w-max mx-auto border border-white/20 backdrop-blur-xl shadow-xl">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></div>
            Passed
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_#60a5fa]"></div>
            Learning
          </span>
          {activeTab === 'core' && (
            <>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                Available
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                Locked
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="max-w-7xl mx-auto relative pb-32">
        
        {/* CORE COURSES TAB */}
        {activeTab === 'core' && (
          <>
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                {/* Gradient Definitions */}
                <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="lineGradientPassed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                </linearGradient>

                {/* Arrow Markers */}
                <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="#22d3ee" />
                </marker>
                <marker id="arrow-passed" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="#10b981" />
                </marker>
                <marker id="arrow-inactive" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L8,4 z" fill="#475569" />
                </marker>

                {/* Glow Filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {lines.map((line) => {
                const active = isLineActive(line);
                const bothPassed = line.prereqPassed && line.targetPassed;
                
                // ✅ เช็คว่าเส้นนี้เกี่ยวข้องกับวิชาที่ Hover หรือไม่
                const isRelated = relatedCourses.has(line.start) && relatedCourses.has(line.end);
                
                let strokeColor = "#475569";
                let strokeWidth = "2";
                let strokeOpacity = "0.3";
                let marker = "url(#arrow-inactive)";
                let useGlow = false;

                if (active || isRelated) {
                  useGlow = true;
                  strokeColor = "url(#lineGradientActive)";
                  strokeWidth = isRelated ? "6" : "4"; // ✅ เส้นที่เกี่ยวข้องหนากว่า
                  strokeOpacity = "1";
                  marker = "url(#arrow-active)";
                } else if (bothPassed) {
                  strokeColor = "url(#lineGradientPassed)";
                  strokeWidth = "3";
                  strokeOpacity = "0.7";
                  marker = "url(#arrow-passed)";
                } else if (line.prereqPassed) {
                  strokeColor = "#10b981";
                  strokeWidth = "2.5";
                  strokeOpacity = "0.5";
                  marker = "url(#arrow-passed)";
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

            {/* Core Courses Grid */}
            <div className="space-y-32 relative z-10">
              {processedRoadmap.map((yearGroup, yearIdx) => (
                <div key={yearIdx} className="relative">
                  
                  {/* Year Label */}
                  <div className="sticky top-20 z-20 flex justify-start mb-12">
                    <div className="bg-gradient-to-r from-slate-800/95 via-slate-800/90 to-transparent backdrop-blur-xl border-2 border-slate-600/50 px-8 py-3 rounded-r-full shadow-2xl">
                      <span className="text-4xl font-black text-white tracking-wider flex items-center gap-3">
                        <GraduationCap className="text-blue-400" size={32} />
                        {yearGroup.year}
                      </span>
                    </div>
                  </div>

                  {/* Semesters Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {yearGroup.semesters.map((sem, semIdx) => {
                      const yearNum = parseInt(yearGroup.year.replace('Year ', ''));
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
                            const isRelated = relatedCourses.has(course.id); // ✅ เช็คว่าเกี่ยวข้องหรือไม่
                            
                            return (
                              <div
                                key={course.id}
                                id={`core-${course.id}`}
                                onClick={() => navigate(`/course/${course.id}`)}
                                className={getCoreStatusClass(course.status, isRelated)}
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                              >
                                {/* ✅ Badge แสดงประเภทของวิชา */}
                                {getCourseType(course.code) !== 'core' && (
                                  <div className="absolute -top-2 -left-2 z-10">
                                    {getCourseType(course.code) === 'professional' && (
                                      <span className="text-[9px] bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                                        ELECTIVE
                                      </span>
                                    )}
                                    {getCourseType(course.code) === 'free' && (
                                      <span className="text-[9px] bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                                        FREE
                                      </span>
                                    )}
                                    {getCourseType(course.code) === 'project' && (
                                      <span className="text-[9px] bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                                        PROJECT
                                      </span>
                                    )}
                                    {getCourseType(course.code) === 'internship' && (
                                      <span className="text-[9px] bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                                        INTERNSHIP
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Header */}
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-bold font-mono tracking-wider text-white/90 bg-black/50 px-3 py-1.5 rounded-lg border border-white/20 shadow-md">
                                    {course.code}
                                  </span>
                                  {course.status === 'passed' && (
                                    <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" />
                                  )}
                                  {course.status === 'active' && (
                                    <BookOpen size={22} className="text-blue-300 animate-pulse drop-shadow-[0_0_10px_rgba(147,197,253,1)]" />
                                  )}
                                  {course.status === 'locked' && <Lock size={20} className="text-slate-500" />}
                                  {course.status === 'available' && (
                                    <AlertCircle size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                  )}
                                </div>

                                {/* Content */}
                                <div>
                                  <h4 className="font-bold text-base text-white leading-snug mb-3 group-hover:text-cyan-200 transition-colors">
                                    {course.name}
                                  </h4>
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

                                {/* ✅ Badge แสดงความสัมพันธ์ */}
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
          </>
        )}

        {/* ELECTIVE COURSES TAB */}
        {activeTab === 'elective' && (
          <div className="space-y-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">Free Elective Courses</h2>
              <p className="text-slate-400 text-lg">
                Choose courses that match your interests and career goals
              </p>
            </div>

            {/* Elective Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedElectives.map((elective) => (
                <div
                  key={elective.id}
                  onClick={() => navigate(`/course/${elective.id}`)}
                  className={getElectiveStatusClass(elective.status)}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold font-mono tracking-wider text-white/90 bg-black/60 px-3 py-1.5 rounded-lg border border-white/20 shadow-md">
                      {elective.code}
                    </span>
                    {elective.status === 'passed' && (
                      <CheckCircle size={22} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]" />
                    )}
                    {elective.status === 'active' && (
                      <BookOpen size={22} className="text-blue-300 animate-pulse drop-shadow-[0_0_10px_rgba(147,197,253,1)]" />
                    )}
                    {elective.status === 'available' && (
                      <Sparkles size={20} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-white leading-tight mb-4 group-hover:text-orange-200 transition-colors line-clamp-2">
                      {elective.name}
                    </h4>
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

                  {/* Badge for selected electives */}
                  {Object.values(profile.customElectives || {}).some(electives =>
                    Array.isArray(electives) && electives.includes(elective.id)
                  ) && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold shadow-lg shadow-orange-500/50">
                        SELECTED
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {processedElectives.length === 0 && (
              <div className="text-center py-20">
                <AlertCircle className="mx-auto mb-4 text-slate-600" size={64} />
                <p className="text-slate-500 text-lg">No elective courses available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Roadmap;