// src/pages/Roadmap.jsx
import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Lock, BookOpen } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { useNavigate } from 'react-router-dom'; 

const Roadmap = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const navigate = useNavigate(); 

  // --- Logic วาดเส้น (คำนวณตำแหน่งจาก DOM Elements) ---
  const drawLines = () => {
    if (!containerRef.current) return;
    const newLines = [];
    const containerRect = containerRef.current.getBoundingClientRect();

    roadmapData.forEach(year => {
      year.semesters.forEach(sem => {
        sem.courses.forEach(course => {
          if (course.prereq) {
            const startEl = document.getElementById(course.prereq);
            const endEl = document.getElementById(course.id);

            if (startEl && endEl) {
              const startRect = startEl.getBoundingClientRect();
              const endRect = endEl.getBoundingClientRect();

              const startX = startRect.left + startRect.width / 2 - containerRect.left;
              const startY = startRect.bottom - containerRect.top;
              const endX = endRect.left + endRect.width / 2 - containerRect.left;
              const endY = endRect.top - containerRect.top;

              newLines.push({
                id: `${course.prereq}-${course.id}`,
                start: course.prereq,
                end: course.id,
                startX, startY, endX, endY
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
    // รอให้หน้าเว็บ Render เสร็จก่อนค่อยวาดเส้น
    setTimeout(drawLines, 500); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLineActive = (line) => {
    if (!hoveredCourse) return false;
    return line.start === hoveredCourse || line.end === hoveredCourse;
  };

  // --- Style Helper สำหรับการ์ดวิชา ---
  const getStatusClass = (status) => {
    const base = "relative p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 h-[150px] flex flex-col justify-between group cursor-pointer shadow-md select-none";
    switch (status) {
      case 'passed':
        return `${base} bg-emerald-900/40 border-emerald-500/50 shadow-emerald-900/20 hover:bg-emerald-800/50 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-400`;
      case 'active':
        return `${base} bg-blue-900/50 border-blue-400/60 shadow-blue-900/30 scale-[1.02] hover:scale-[1.05] hover:border-blue-300 z-10`;
      case 'locked':
      default:
        return `${base} bg-slate-800/60 border-slate-700/50 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-slate-700/80 hover:border-slate-500`;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-white relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4 relative z-20">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-lg">
          CS Curriculum Roadmap
        </h1>
        <p className="text-slate-300 text-lg">
          Interactive Learning Path & Prerequisite Tree
        </p>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm font-medium text-slate-300 mt-4 bg-black/40 py-2 px-4 rounded-full w-max mx-auto border border-white/10 backdrop-blur-md">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div> Passed</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]"></div> Now Learning</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div> Locked</span>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <div ref={containerRef} className="max-w-7xl mx-auto relative pb-32">
        
        {/* --- Layer 1: Lines (SVG Background) --- */}
        {/* overflow-visible จำเป็นมากเพื่อให้แสง Glow ไม่โดนตัดขอบ */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
            {/* หัวลูกศรตอน Active: ใหญ่และสีฟ้า Neon */}
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="#22d3ee" />
            </marker>
            {/* หัวลูกศรตอนปกติ */}
            <marker id="arrow-inactive" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#475569" />
            </marker>
          </defs>

          {lines.map((line) => {
            const active = isLineActive(line);
            return (
              <path
                key={line.id}
                d={`M ${line.startX} ${line.startY} C ${line.startX} ${(line.startY + line.endY) / 2}, ${line.endX} ${(line.startY + line.endY) / 2}, ${line.endX} ${line.endY}`}
                fill="none"
                // สีเส้น: Active = Neon Cyan, Inactive = Dark Slate
                stroke={active ? "#22d3ee" : "#475569"}
                // ความหนา: Active = 5px (Bold), Inactive = 2px
                strokeWidth={active ? "5" : "2"}
                // ความชัด: Active = 100%, Inactive = 20%
                strokeOpacity={active ? "1" : "0.2"}
                markerEnd={active ? "url(#arrow-active)" : "url(#arrow-inactive)"}
                // Glow Effect: Drop Shadow สีฟ้าเรืองแสง
                className={`transition-all duration-300 ${active ? 'filter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}`}
              />
            );
          })}
        </svg>

        {/* --- Layer 2: Courses (Foreground Cards) --- */}
        <div className="space-y-28">
          {roadmapData.map((yearGroup, yearIdx) => (
            <div key={yearIdx} className="relative z-10">
              
              {/* Year Label (Timeline ด้านซ้าย) */}
              <div className="absolute -left-4 md:-left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent hidden xl:block"></div>
              <div className="sticky top-24 z-20 flex justify-start mb-10 xl:absolute xl:-left-28 xl:top-0 xl:block xl:w-24 xl:text-right xl:mb-0">
                 <span className="inline-block bg-slate-800/90 backdrop-blur-lg border-2 border-slate-600/80 px-6 py-2 rounded-r-full text-3xl font-black text-white shadow-lg xl:bg-transparent xl:border-none xl:shadow-none xl:p-0 xl:text-7xl xl:text-white/50 xl:uppercase xl:tracking-widest select-none">
                  {yearGroup.year.replace("Year ", "Y")}
                </span>
              </div>

              {/* Semesters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                {yearGroup.semesters.map((sem, semIdx) => (
                  <div key={semIdx} className="space-y-6 bg-black/20 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white border-l-8 border-blue-500 pl-4">
                      {sem.term}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {sem.courses.map((course) => (
                        <div
                          key={course.id}
                          id={course.id}
                          // คลิกแล้วไปหน้า Course Detail
                          onClick={() => navigate(`/course/${course.id}`)}
                          className={getStatusClass(course.status)}
                          onMouseEnter={() => setHoveredCourse(course.id)}
                          onMouseLeave={() => setHoveredCourse(null)}
                        >
                          {/* Header Card */}
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold font-mono tracking-wider text-white bg-black/40 px-3 py-1 rounded-md border border-white/10">
                              {course.code}
                            </span>
                            {course.status === 'passed' && <CheckCircle size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                            {course.status === 'active' && <BookOpen size={20} className="text-blue-300 animate-pulse drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" />}
                            {course.status === 'locked' && <Lock size={20} className="text-slate-400" />}
                          </div>

                          {/* Content Card */}
                          <div>
                            <h4 className="font-bold text-lg text-white leading-tight mb-2 text-shadow-sm group-hover:text-blue-200 transition-colors">
                              {course.name}
                            </h4>
                            <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-slate-300">
                                <span className="bg-black/30 px-2 py-0.5 rounded">{course.credits} Credits</span>
                                {course.prereq && (
                                    <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded border border-slate-600 text-slate-300">
                                        Req: {course.prereq}
                                    </span>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;