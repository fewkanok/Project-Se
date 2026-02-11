import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Lock, BookOpen } from 'lucide-react';
import { roadmapData } from '../data/courses';

const Roadmap = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);

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
    setTimeout(drawLines, 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLineActive = (line) => {
    if (!hoveredCourse) return false;
    return line.start === hoveredCourse || line.end === hoveredCourse;
  };

  // --- Style การ์ดวิชา (ปรับให้ชัดขึ้น!) ---
  const getStatusClass = (status) => {
    // เพิ่ม shadow-md และปรับสีพื้นฐานให้เข้มขึ้น
    const base = "relative p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 h-[150px] flex flex-col justify-between group cursor-pointer shadow-md";
    switch (status) {
      case 'passed':
        // สีเขียวเข้มขึ้น ขอบชัด มีเงาสีเขียว
        return `${base} bg-emerald-800/50 border-emerald-500 shadow-emerald-900/30 hover:bg-emerald-700/60 hover:shadow-lg hover:-translate-y-1`;
      case 'active':
        // สีน้ำเงินเข้ม ขอบสว่าง เด้งขึ้นมานิดนึง
        return `${base} bg-blue-800/60 border-blue-300 shadow-blue-900/40 scale-[1.02] hover:scale-[1.05] z-10`;
      case 'locked':
      default:
        // สีเทาเข้ม ลดความโปร่งใสลงให้อ่านออก แต่อยู่ในโหมด grayscale
        return `${base} bg-slate-800/70 border-slate-600/50 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-slate-700/80 hover:border-slate-500`;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-white"> {/* เปลี่ยน text-slate-200 เป็น text-white */}
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-lg">
          CS Curriculum Roadmap
        </h1>
        <p className="text-slate-300 text-lg">
          Interactive Learning Path & Prerequisite Tree
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium text-slate-300 mt-4 bg-black/20 py-2 px-4 rounded-full w-max mx-auto">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></div> Passed</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div> Now Learning</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div> Locked</span>
        </div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto relative pb-32">
        
        {/* Lines Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible filter drop-shadow-[0_0_3px_rgba(56,189,248,0.5)]">
          <defs>
            <marker id="arrow-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow-inactive" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
            </marker>
          </defs>

          {lines.map((line) => {
            const active = isLineActive(line);
            return (
              <path
                key={line.id}
                d={`M ${line.startX} ${line.startY} C ${line.startX} ${(line.startY + line.endY) / 2}, ${line.endX} ${(line.startY + line.endY) / 2}, ${line.endX} ${line.endY}`}
                fill="none"
                stroke={active ? "#38bdf8" : "#64748b"}
                strokeWidth={active ? "3" : "2"}
                strokeOpacity={active ? "1" : "0.4"}
                markerEnd={active ? "url(#arrow-active)" : "url(#arrow-inactive)"}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Content Layer */}
        <div className="space-y-28">
          {roadmapData.map((yearGroup, yearIdx) => (
            <div key={yearIdx} className="relative z-10">
              
              {/* --- Year Label (ปรับให้ชัด!) --- */}
              <div className="absolute -left-4 md:-left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent hidden xl:block"></div>
              
              {/* แบบมือถือ: ป้าย Badge ชัดๆ ติดด้านบน */}
              <div className="sticky top-24 z-30 flex justify-start mb-10 xl:absolute xl:-left-28 xl:top-0 xl:block xl:w-24 xl:text-right xl:mb-0">
                 <span className="inline-block bg-slate-800/90 backdrop-blur-lg border-2 border-slate-600/80 px-6 py-2 rounded-r-full text-3xl font-black text-white shadow-lg xl:bg-transparent xl:border-none xl:shadow-none xl:p-0 xl:text-7xl xl:text-white/50 xl:uppercase xl:tracking-widest select-none">
                  {yearGroup.year.replace("Year ", "Y")}
                </span>
              </div>

              {/* Semesters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                {yearGroup.semesters.map((sem, semIdx) => (
                  <div key={semIdx} className="space-y-6 bg-black/20 p-6 rounded-3xl border border-white/5">
                    <h3 className="text-2xl font-bold text-white border-l-8 border-blue-500 pl-4">
                      {sem.term}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {sem.courses.map((course) => (
                        <div
                          key={course.id}
                          id={course.id}
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
                            <h4 className="font-bold text-lg text-white leading-tight mb-2 text-shadow-sm">
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