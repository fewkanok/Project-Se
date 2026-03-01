import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Award, BookOpen, Zap, TrendingUp, Calendar, Clock, AlertCircle, LogOut, Settings, Target, Trophy, Star, Sparkles, ArrowUpRight, ChevronRight, Activity, Flame, BarChart3, Cpu, Layers, Grid3x3, CheckCircle2, XCircle, AlertTriangle, X, Check, FileText, Shield, ShieldAlert, ShieldCheck, Medal, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses } from '../data/courseData';

// --- Configuration: Co-op Requirements ---
const COOP_REQUIREMENTS = {
  minCredits: 90,
  minGPA: 2.75,
  targetCourses: [
    "040613203", // Structured Programming
    "040613205", // Data Structure
    "040613204", // Object-oriented Programming
    "040613302", // System Analysis and Design
    "040613501", // Computer Organization and OS
    "040613306", // Software Engineering
    "040613502", // Computer Network
    "040613301", // Database System
    "040613601", // Computer System Security
    "040613701"  // Intelligent System
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [animatedGPA, setAnimatedGPA] = useState(0);
  const [animatedCredits, setAnimatedCredits] = useState(0);

  // --- Honors Checklist State (เกณฑ์ที่ user ต้องยืนยันเอง) ---
  const [honorsChecks, setHonorsChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('honorsChecks');
      return saved ? JSON.parse(saved) : { noFGrade: false, noRegrade: false };
    } catch { return { noFGrade: false, noRegrade: false }; }
  });

  const toggleHonorsCheck = (key) => {
    setHonorsChecks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem('honorsChecks', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // --- 1. Load Data ---
  const [profile] = useState(() => {
    try {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
  });

  if (!profile) {
      return (
          <div className="h-screen flex flex-col items-center justify-center text-white gap-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-[100px] animate-pulse"></div>
                <div className="relative w-32 h-32 tech-card rounded-3xl flex items-center justify-center">
                  <AlertCircle size={64} className="text-cyan-400"/>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-black tech-gradient">
                  ไม่พบข้อมูลผู้ใช้
                </h2>
                <p className="text-slate-300 text-lg font-light">กรุณาสร้างโปรไฟล์ของคุณก่อนเข้าใช้งาน</p>
              </div>
              
              <button 
                onClick={() => navigate('/setup')} 
                className="group relative px-12 py-5 tech-button text-white font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  <Sparkles size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                  Initialize Profile
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
          </div>
      );
  }

  // --- 2. Calculation Logic ---
  const stats = useMemo(() => {
    let totalStructureCredits = 0; 
    let earnedCredits = 0;         
    let activeCoursesList = [];    
    let totalPoints = 0;           
    let totalGradedCredits = 0;    
    let graphData = [];
    
    // Co-op Logic Variables
    let passedCourseCodes = new Set();

    const currentYearNum = parseInt(profile.basicInfo?.currentYear || profile.currentYear) || 1;
    const currentTermNum = parseInt(profile.basicInfo?.currentTerm || profile.currentTerm) || 1;
    const customElectives = profile.customElectives || {};
    const peAssignments = profile.peAssignments || {}; // { 'PE5': '040613704', 'PE6': '040613505', ... }

    // helper: แปลง "3(2-2-5)" → 3
    const parseCredits = (val) => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'string') {
        const num = parseInt(val, 10);
        if (!isNaN(num)) return num;
      }
      return 3; // default fallback
    };

    // สร้าง lookup map: peSlotId → course object จาก allTrackCourses
    const peSlotCourseMap = {};
    Object.entries(peAssignments).forEach(([slotId, courseCode]) => {
      const trackCourse = allTrackCourses?.[courseCode];
      if (trackCourse) {
        peSlotCourseMap[slotId] = {
          ...trackCourse,
          id: courseCode,
          code: courseCode,
          name: trackCourse.nameEn || trackCourse.name, // ใช้ชื่ออังกฤษ
          credits: parseCredits(trackCourse.credits),   // แปลงเป็น number
          _peSlot: slotId,
        };
      }
    });

    // โหลดเกรดจาก Coop Modal
    let coopGrades = {};
    try {
      const saved = localStorage.getItem('coopGradeStates');
      if (saved) {
        coopGrades = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading coop grades:', e);
    }

    if (roadmapData) {
        roadmapData.forEach((yearGroup, yIdx) => {
            const yearNum = yIdx + 1;
            
            yearGroup.semesters.forEach((sem, sIdx) => {
                const termNum = sIdx + 1;
                const termKey = `${yearNum}-${termNum}`;
                const gpaKey = `Y${yearNum}/${termNum}`;

                // แทนที่ PE slots ด้วย course จริงจาก peSlotCourseMap
                // ⚠️ ถ้า PE slot ไม่ได้ assign → กรองออก ไม่นำไปแสดงหรือนับ
                let displayCourses = sem.courses.reduce((acc, c) => {
                  if (c.isProfessionalElective) {
                    if (peSlotCourseMap[c.id]) {
                      // assign แล้ว → ใช้ course object จริงจาก allTrackCourses
                      acc.push(peSlotCourseMap[c.id]);
                    }
                    // ไม่ได้ assign → ข้ามไปเลย (ไม่ push)
                    return acc;
                  }
                  acc.push(c);
                  return acc;
                }, []);
                if (customElectives[termKey]) {
                    customElectives[termKey].forEach(elecId => {
                        const elecInfo = electiveCourses.find(c => c.id === elecId);
                        if (elecInfo) {
                            displayCourses.push({ ...elecInfo, isElective: true });
                        }
                    });
                }

                let termPassedCredits = 0;

                displayCourses.forEach(c => {
                    const status = profile.courseStates?.[c.id];
                    // ป้องกัน NaN: credits ต้องเป็นตัวเลขเสมอ
                    const safeCredits = typeof c.credits === 'number' && !isNaN(c.credits)
                      ? c.credits
                      : parseInt(c.credits, 10) || 3;
                    
                    if (!c.isElective) {
                        totalStructureCredits += safeCredits;
                    }

                    if (status === 'learning') {
                        activeCoursesList.push({
                            ...c,
                            credits: safeCredits,
                            termLabel: c.isElective 
                              ? `Free Elective (Y${yearNum}/${termNum})` 
                              : c._peSlot 
                                ? `Prof. Elective (Y${yearNum}/${termNum})`
                                : sem.term
                        });
                    }

                    if (status === 'passed') {
                        earnedCredits += safeCredits;
                        termPassedCredits += safeCredits;
                        passedCourseCodes.add(c.code);
                        passedCourseCodes.add(c.id);
                    }
                });

                const isPastTerm = (yearNum < currentYearNum) || (yearNum === currentYearNum && termNum < currentTermNum);

                if (isPastTerm) {
                    const historyGradeStr = profile.gpaHistory?.[gpaKey];
                    
                    if (historyGradeStr && !isNaN(parseFloat(historyGradeStr))) {
                        const termGPA = parseFloat(historyGradeStr);
                        const weight = termPassedCredits > 0 ? termPassedCredits : sem.courses.reduce((a,b)=>a+b.credits,0);

                        totalPoints += (termGPA * weight);
                        totalGradedCredits += weight;

                        graphData.push({
                            term: gpaKey, 
                            year: yearNum,
                            semester: termNum,
                            gpa: parseFloat(termGPA.toFixed(2)),
                            fullTerm: sem.term,
                            credits: weight
                        });
                    }
                }
            });
        });
    }

    let calculatedGPAX = 0;
    if (totalGradedCredits > 0) {
        const rawGPA = totalPoints / totalGradedCredits;
        calculatedGPAX = Math.floor(rawGPA * 100) / 100;
    }

    const progressPercent = totalStructureCredits > 0 
        ? Math.round((earnedCredits / totalStructureCredits) * 100) 
        : 0;
    
    // Co-op Detail Calculation
    const coopCourseDetails = COOP_REQUIREMENTS.targetCourses.map(code => {
        let courseName = "Unknown Course";
        roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
            if(c.code === code) courseName = c.name;
        })));
        
        const isPassed = passedCourseCodes.has(code);
        const grade = coopGrades[code];
        
        return {
            code,
            name: courseName,
            isPassed,
            grade: grade !== null && grade !== undefined ? grade : null
        };
    });

    const coopCoursesPassedCount = coopCourseDetails.filter(c => c.isPassed).length;
    const coopCoursesTotal = COOP_REQUIREMENTS.targetCourses.length;

    // คำนวณ GPA_10
    let gpa10Sum = 0;
    let gpa10Count = 0;
    coopCourseDetails.forEach(c => {
      if (c.isPassed && c.grade !== null && c.grade !== undefined) {
        gpa10Sum += c.grade;
        gpa10Count++;
      }
    });
    const gpa10 = gpa10Count > 0 ? gpa10Sum / gpa10Count : null;

    const isCreditReady = earnedCredits >= COOP_REQUIREMENTS.minCredits;
    const isGPAReady = calculatedGPAX >= COOP_REQUIREMENTS.minGPA;
    const isCoursesReady = coopCoursesPassedCount === coopCoursesTotal && gpa10 !== null && gpa10 >= 2.5;

    return { 
      totalCredits: totalStructureCredits, 
      earnedCredits, 
      activeCoursesList, 
      calculatedGPAX, 
      graphData, 
      progressPercent,
      coopStats: {
        isCreditReady,
        isGPAReady,
        isCoursesReady,
        passedCount: coopCoursesPassedCount,
        totalCount: coopCoursesTotal,
        courseDetails: coopCourseDetails,
        gpa10: gpa10,
        gpa10Count: gpa10Count,
        isFullyEligible: isCreditReady && isGPAReady && isCoursesReady
      }
    };
  }, [profile]);

  // --- 3. Academic Status Analysis Logic (With Prediction) ---
  const academicStatus = useMemo(() => {
    const sortedHistory = [...stats.graphData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.semester - b.semester;
    });

    let statusState = { 
        status: 'NORMAL', 
        message: 'สถานะปกติ', 
        detail: 'รอผลการเรียน', 
        color: 'emerald', 
        riskLevel: 0,
        prediction: null
    };

    if (sortedHistory.length === 0) return statusState;

    let accumulatedPoints = 0;
    let accumulatedCredits = 0;
    let lowProCount = 0;
    let highProCount = 0;

    for (let termData of sortedHistory) {
        const { year, semester, gpa, credits } = termData;
        
        accumulatedPoints += (gpa * credits);
        accumulatedCredits += credits;
        
        if (accumulatedCredits === 0) continue;
        const currentGPAX = accumulatedPoints / accumulatedCredits;

        if (year === 1) {
            if (semester === 1 && currentGPAX < 1.25) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'GPAX ปี 1 เทอม 1 ต่ำกว่า 1.25', color: 'red', riskLevel: 100 };
            if (semester === 2 && currentGPAX < 1.50) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'GPAX ปี 1 เทอม 2 ต่ำกว่า 1.50', color: 'red', riskLevel: 100 };
        } 
        else if (year >= 2) {
            // กฎ: นับจาก GPA รายเทอม (term GPA) ไม่ใช่ GPAX สะสม
            // LOW (<1.75), HIGH (1.75–1.99), SAFE (≥2.00) — reset ซึ่งกันและกัน
            if (gpa < 1.75) {
                lowProCount++;
                highProCount = 0; // LOW รีเซ็ต HIGH counter
            } else if (gpa < 2.00) {
                highProCount++;
                lowProCount = 0; // HIGH รีเซ็ต LOW counter
            } else {
                lowProCount = 0;  // SAFE รีเซ็ตทั้งคู่
                highProCount = 0;
            }

            if (lowProCount >= 2) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'โปรต่ำ (GPA < 1.75) 2 ครั้งติดกัน', color: 'red', riskLevel: 100 };
            if (highProCount >= 4) return { ...statusState, status: 'RETIRED', message: 'พ้นสภาพ', detail: 'โปรสูง (GPA < 2.00) 4 ครั้งติดกัน', color: 'red', riskLevel: 100 };
        }
    }

    const latestGPAX = accumulatedCredits > 0 ? (accumulatedPoints / accumulatedCredits) : 0;
    
    // คำนวณ credits เฉลี่ยต่อเทอม (เหมือน AcademicCriteriaPage)
    const semesterCount = sortedHistory.length;
    const avgCreditsPerSem = semesterCount > 0 ? accumulatedCredits / semesterCount : 19;
    const nextTermCredits = Math.round(avgCreditsPerSem); // ปัดเศษเพื่อให้อ่านง่าย
    
    const targetGPAX = 2.00;
    const totalCreditsNext = accumulatedCredits + nextTermCredits;
    const requiredPoints = targetGPAX * totalCreditsNext;
    const missingPoints = requiredPoints - accumulatedPoints;
    let neededGPA = missingPoints / nextTermCredits;
    
    let predictionText = "";
    if (neededGPA > 4.00) {
        predictionText = "ยากมาก (ต้องได้เกิน 4.00)";
    } else if (neededGPA <= 0) {
        predictionText = "รอดแน่นอน (เพียงแค่ผ่าน)";
    } else {
        predictionText = neededGPA.toFixed(2);
    }

    if (lowProCount === 1) {
        // โปรต่ำ 1 ครั้ง — วิกฤต เหลือโอกาสเดียว
        statusState = {
            status: 'CRITICAL',
            message: 'ภาวะวิกฤต (โปรต่ำ)',
            detail: `GPA เทอมล่าสุด ต่ำกว่า 1.75 อีกครั้งจะพ้นสภาพ`,
            color: 'red',
            riskLevel: 90,
            prediction: { label: 'เป้าหมายเทอมหน้า (เพื่อหลุดโปร)', value: predictionText, credits: nextTermCredits }
        };
    } else if (highProCount === 3) {
        // โปรสูง 3 ครั้ง — เหลือโอกาสเดียว
        statusState = {
            status: 'CRITICAL',
            message: 'โปรสูง (ครั้งสุดท้าย)',
            detail: `เหลือโอกาสเดียว! ต้องทำให้ GPA เทอมหน้าถึง 2.00`,
            color: 'orange',
            riskLevel: 80,
            prediction: { label: 'ต้องทำเกรดเทอมหน้า', value: predictionText, credits: nextTermCredits }
        };
    } else if (highProCount > 0) {
        // โปรสูง 1-2 ครั้ง
        statusState = {
            status: 'PROBATION',
            message: `ติดวิทยาทัณฑ์ (ครั้งที่ ${highProCount})`,
            detail: `GPA เทอมล่าสุด ต่ำกว่า 2.00 (ครั้งที่ ${highProCount}/4)`,
            color: 'orange',
            riskLevel: 40 + (highProCount * 15),
            prediction: { label: 'เกรดที่ต้องทำเพื่อหลุดโปร', value: predictionText, credits: nextTermCredits }
        };
    } else {
        if (latestGPAX < 2.00) {
             statusState = {
                 status: 'WARNING',
                 message: 'เฝ้าระวัง',
                 detail: `GPAX ${latestGPAX.toFixed(2)} ยังไม่ถึง 2.00`,
                 color: 'yellow',
                 riskLevel: 30,
                 prediction: { label: 'ทำเกรดให้ถึง 2.00', value: predictionText, credits: nextTermCredits }
             };
        } else {
             statusState = {
                status: 'NORMAL',
                message: 'สถานะปกติ',
                detail: `GPAX ${latestGPAX.toFixed(2)} ปลอดภัย`,
                color: 'emerald',
                riskLevel: 10,
                prediction: null
            };
        }
    }

    return statusState;
  }, [stats.graphData]);

  // Animated Counter Effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const gpaIncrement = stats.calculatedGPAX / steps;
    const creditsIncrement = stats.earnedCredits / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedGPA(prev => Math.min(prev + gpaIncrement, stats.calculatedGPAX));
      setAnimatedCredits(prev => Math.min(prev + creditsIncrement, stats.earnedCredits));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedGPA(stats.calculatedGPAX);
        setAnimatedCredits(stats.earnedCredits);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stats.calculatedGPAX, stats.earnedCredits]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tech-card p-5 rounded-xl border border-cyan-500/30">
          <p className="text-white text-sm font-bold mb-2 font-mono">{data.term}</p>
          <div className="text-cyan-400 font-black text-3xl mb-1">
            {data.gpa.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {data.credits} หน่วยกิต
          </p>
        </div>
      );
    }
    return null;
  };

  // const handleLogout = () => {
  //     if(window.confirm('ต้องการออกจากระบบหรือไม่?')) {
  //         localStorage.removeItem('userProfile'); 
  //         localStorage.removeItem('active_session');
  //         navigate('/login'); 
  //     }
  // };
  const handleLogout = () => {
    if(window.confirm('ต้องการออกจากระบบหรือไม่?')){
      localStorage.removeItem('active_session');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleEditSetup = () => navigate('/setup');

  const getGradeInfo = (gpa) => {
    if (gpa >= 3.5) return { gradient: 'from-emerald-400 via-teal-400 to-cyan-400', bg: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/10', label: 'EXCELLENT', icon: '🏆' };
    if (gpa >= 3.0) return { gradient: 'from-blue-400 via-cyan-400 to-sky-400', bg: 'from-blue-500/20 via-cyan-500/15 to-sky-500/10', label: 'VERY GOOD', icon: '⭐' };
    if (gpa >= 2.5) return { gradient: 'from-amber-400 via-yellow-400 to-orange-400', bg: 'from-amber-500/20 via-yellow-500/15 to-orange-500/10', label: 'GOOD', icon: '👍' };
    return { gradient: 'from-rose-400 via-pink-400 to-fuchsia-400', bg: 'from-rose-500/20 via-pink-500/15 to-fuchsia-500/10', label: 'KEEP GOING', icon: '📈' };
  };

  const gradeInfo = getGradeInfo(stats.calculatedGPAX);

  // ─── Honors / เกียรตินิยม (อ้างอิงเกณฑ์คณะวิศวกรรมศาสตร์ มจพ.) ──────────
  // เงื่อนไข:
  //   1) GPAX ≥ 3.50 → อันดับ 1 / GPAX ≥ 3.25 → อันดับ 2
  //   2) ไม่เคยได้ F, FE, FA, U (user ยืนยัน)
  //   3) ไม่เคยลงทะเบียนเรียนซ้ำ / Regrade (user ยืนยัน)
  //   4) ต้องศึกษาครบหน่วยกิตตามหลักสูตร (earnedCredits >= totalCredits)
  //   * W ยังได้รับการพิจารณา (ไม่นับเป็นการตัดสิทธิ์)
  //   * เรียนเกินหน่วยกิตยังได้รับการพิจารณา
  const getHonorsInfo = (gpax, earnedCredits, totalCredits, checks) => {
    const hasEnoughCredits = totalCredits > 0 && earnedCredits >= totalCredits;
    const noFGrade   = checks.noFGrade;   // user ยืนยัน: ไม่เคยได้ F/FE/FA/U
    const noRegrade  = checks.noRegrade;  // user ยืนยัน: ไม่เคย Regrade

    // เกณฑ์ที่ผ่านทั้งหมด (ไม่นับ GPAX — ดูแยก)
    const allConditionsMet = noFGrade && noRegrade && hasEnoughCredits;

    if (gpax >= 3.50) {
      return {
        tier: allConditionsMet ? 1 : 'pending',
        label: 'เกียรตินิยมอันดับ 1',
        labelEn: '1st Class Honors',
        gradient: 'from-yellow-400 via-amber-400 to-orange-400',
        bg: 'from-yellow-500/20 via-amber-500/15 to-orange-500/10',
        border: allConditionsMet ? 'border-yellow-500/50' : 'border-yellow-500/20',
        glow: 'shadow-yellow-500/20',
        icon: '🥇',
        gpaxOk: true,
        allConditionsMet,
        hasEnoughCredits,
        needed: null,
      };
    } else if (gpax >= 3.25) {
      return {
        tier: allConditionsMet ? 2 : 'pending',
        label: 'เกียรตินิยมอันดับ 2',
        labelEn: '2nd Class Honors',
        gradient: 'from-slate-300 via-slate-200 to-white',
        bg: 'from-slate-400/15 via-slate-300/10 to-slate-200/5',
        border: allConditionsMet ? 'border-slate-400/50' : 'border-slate-500/20',
        glow: 'shadow-slate-400/10',
        icon: '🥈',
        gpaxOk: true,
        allConditionsMet,
        hasEnoughCredits,
        needed: null,
      };
    } else {
      const needed = (3.25 - gpax).toFixed(2);
      return {
        tier: 0,
        label: 'ยังไม่ถึงเกณฑ์ GPA',
        labelEn: 'No Honors',
        gradient: 'from-slate-500 via-slate-400 to-slate-300',
        bg: 'from-slate-500/10 via-slate-400/5 to-slate-300/5',
        border: 'border-slate-600/30',
        glow: 'shadow-slate-500/10',
        icon: '📚',
        gpaxOk: false,
        allConditionsMet: false,
        hasEnoughCredits,
        needed,
      };
    }
  };

  const honorsInfo = getHonorsInfo(stats.calculatedGPAX, stats.earnedCredits, stats.totalCredits, honorsChecks);

  const CoopStatusItem = ({ label, value, passed, subtext }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
        <div>
            <p className="text-slate-400 text-xs font-mono uppercase">{label}</p>
            <p className="text-white font-bold">{value}</p>
            {subtext && <p className="text-[10px] text-slate-500">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-full ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
    </div>
  );

  const getStatusIcon = (color) => {
      switch(color) {
          case 'emerald': return <ShieldCheck size={24} className="text-emerald-400" />;
          case 'orange': return <AlertTriangle size={24} className="text-orange-400" />;
          case 'red': return <ShieldAlert size={24} className="text-red-400" />;
          default: return <Shield size={24} className="text-slate-400" />;
      }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto">
        
        {/* Tech Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                    HOME
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </div>
                    <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">
                      System Online • <span className="text-white font-bold">{profile.basicInfo?.name || profile.name || 'User'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/academic-criteria')} className="tech-button px-6 py-3 rounded-xl text-emerald-400 font-semibold flex items-center gap-2 text-sm border-emerald-500/20">
                <FileText size={18}/> <span className="hidden md:inline">Academic Criteria</span>
              </button>
              <button onClick={handleEditSetup} className="tech-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 text-sm">
                <Settings size={18}/> <span className="hidden md:inline">Settings</span>
              </button>
              <button onClick={handleLogout} className="tech-button px-6 py-3 rounded-xl text-red-400 font-semibold flex items-center gap-2 text-sm border-red-500/20">
                <LogOut size={18}/> <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="tech-card p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Cpu size={20} className="text-white"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase">GPAX</p>
                  <p className="text-2xl font-black text-white">{stats.calculatedGPAX.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="tech-card p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target size={20} className="text-white"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase">หน่วยกิต</p>
                  <p className="text-2xl font-black text-white">{Math.round(animatedCredits)}<span className="text-base text-slate-500">/{stats.totalCredits}</span></p>
                </div>
              </div>
            </div>
            <div className="tech-card p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Flame size={20} className="text-white"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase">กำลังศึกษา</p>
                  <p className="text-2xl font-black text-white">{stats.activeCoursesList.length}</p>
                </div>
              </div>
            </div>
            <div className="tech-card p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Trophy size={20} className="text-white"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase">Progress</p>
                  <p className="text-2xl font-black text-white">{stats.progressPercent}<span className="text-base text-slate-500">%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left - Profile, GPAX & Co-op */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <div className="tech-card p-6 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-purple-500/50 rounded-xl blur-lg"></div>
                  <img src={profile.basicInfo?.image || profile.image || 'https://via.placeholder.com/150'} alt="Profile" className="relative w-16 h-16 rounded-xl object-cover border-2 border-white/20"/>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white mb-1 truncate">{profile.basicInfo?.name || profile.name || 'User'}</h2>
                  <p className="text-xs text-slate-500 font-mono mb-2">ID: {profile.basicInfo?.studentId || profile.studentId || '-'}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg tech-card">
                    <Layers size={11} className="text-cyan-400"/>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">CS</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="tech-card p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-purple-400"/>
                      <span className="text-xs text-slate-400 font-mono">TERM</span>
                    </div>
                    <span className="text-sm font-black text-white">Y{profile.basicInfo?.currentYear || profile.currentYear}/{profile.basicInfo?.currentTerm || profile.currentTerm}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GPAX + Honors — single unified card, side by side */}
            <div className={`tech-card rounded-2xl relative overflow-hidden border ${honorsInfo.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradeInfo.bg} opacity-30`}></div>
              {(honorsInfo.tier === 1 || honorsInfo.tier === 'pending') && honorsInfo.gpaxOk && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/5 to-transparent animate-pulse pointer-events-none"></div>
              )}

              <div className="relative flex">
                {/* ─── Left: GPAX ─── */}
                <div className="flex-shrink-0 w-44 p-5 flex flex-col items-center justify-center border-r border-white/5">
                  <div className="flex items-center gap-1.5 mb-3 self-start">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradeInfo.gradient} flex items-center justify-center`}>
                      <BarChart3 size={12} className="text-white"/>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">GPAX</p>
                  </div>
                  <div className={`text-6xl font-black bg-gradient-to-r ${gradeInfo.gradient} bg-clip-text text-transparent mb-1`}>
                    {animatedGPA.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mb-3">OUT OF 4.00</p>
                  <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${gradeInfo.gradient}`}>
                    <span className="text-[10px] font-black text-white tracking-wider">{gradeInfo.label}</span>
                  </div>
                </div>

                {/* ─── Right: Honors ─── */}
                <div className="flex-1 p-5 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={14} className={honorsInfo.gpaxOk ? 'text-yellow-400' : 'text-slate-400'} />
                      <span className="text-xs font-bold text-white uppercase tracking-wide">เกียรตินิยม</span>
                    </div>
                    <span className="text-lg">{honorsInfo.icon}</span>
                  </div>

                  {/* Status Badge */}
                  <div className={`mb-3 px-3 py-2 rounded-xl bg-gradient-to-r ${honorsInfo.gradient}`}>
                    <p className={`text-xs font-black leading-tight ${honorsInfo.tier === 0 ? 'text-slate-300' : 'text-black/80'}`}>
                      {honorsInfo.label}
                    </p>
                    <p className={`text-[9px] font-mono ${honorsInfo.tier === 0 ? 'text-slate-500' : 'text-black/60'}`}>
                      {honorsInfo.labelEn}{honorsInfo.tier === 'pending' && ' · รอยืนยัน'}
                    </p>
                  </div>

                  {/* GPA Progress bars */}
                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400 font-mono">🥇 3.50</span>
                        <span className={`font-bold ${stats.calculatedGPAX >= 3.50 ? 'text-yellow-400' : 'text-slate-500'}`}>{stats.calculatedGPAX.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (stats.calculatedGPAX / 3.50) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400 font-mono">🥈 3.25</span>
                        <span className={`font-bold ${stats.calculatedGPAX >= 3.25 ? 'text-slate-300' : 'text-slate-500'}`}>{stats.calculatedGPAX.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-slate-300 to-slate-400 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (stats.calculatedGPAX / 3.25) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Checklist — compact icon-only row */}
                  <div className="mb-3">
                    <p className="text-[9px] text-slate-600 font-mono uppercase mb-1.5">เงื่อนไขเพิ่มเติม</p>
                    <div className="flex flex-col gap-1.5">
                      {/* เงื่อนไข 1 */}
                      <button onClick={() => toggleHonorsCheck('noFGrade')}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                          honorsChecks.noFGrade ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/50'
                        }`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                          honorsChecks.noFGrade ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                        }`}>
                          {honorsChecks.noFGrade && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`text-[10px] font-bold leading-tight ${honorsChecks.noFGrade ? 'text-emerald-300' : 'text-slate-400'}`}>
                          ไม่เคยได้ F / FE / FA / U
                        </span>
                      </button>
                      {/* เงื่อนไข 2 */}
                      <button onClick={() => toggleHonorsCheck('noRegrade')}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                          honorsChecks.noRegrade ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/50'
                        }`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                          honorsChecks.noRegrade ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                        }`}>
                          {honorsChecks.noRegrade && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`text-[10px] font-bold leading-tight ${honorsChecks.noRegrade ? 'text-emerald-300' : 'text-slate-400'}`}>
                          ไม่เคย Regrade
                        </span>
                      </button>
                      {/* เงื่อนไข 3 — auto */}
                      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                        honorsInfo.hasEnoughCredits ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/50'
                      }`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                          honorsInfo.hasEnoughCredits ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                        }`}>
                          {honorsInfo.hasEnoughCredits && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`text-[10px] font-bold leading-tight ${honorsInfo.hasEnoughCredits ? 'text-emerald-300' : 'text-slate-400'}`}>
                          หน่วยกิตครบ ({Math.round(stats.earnedCredits)}/{stats.totalCredits})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ผลสรุป */}
                  {honorsInfo.gpaxOk ? (
                    honorsInfo.allConditionsMet ? (
                      <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <p className="text-[10px] font-black text-emerald-400">✓ ผ่านเกณฑ์ทั้งหมด!</p>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                        <p className="text-[10px] font-bold text-yellow-400">GPA ผ่าน — ยืนยันเงื่อนไขด้วย</p>
                      </div>
                    )
                  ) : (
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-between">
                      <p className="text-[10px] text-slate-500 font-mono">ต้องการอีก</p>
                      <span className="text-sm font-black text-amber-400">+{honorsInfo.needed}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ Co-op Eligibility Card — navigate ไปหน้า /coop */}
            <div 
              onClick={() => navigate('/coop')}
              className={`tech-card p-6 rounded-2xl border-l-4 ${stats.coopStats.isFullyEligible ? 'border-emerald-500' : 'border-orange-500'} cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden`}
            >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-slate-400" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <Award size={20} className={stats.coopStats.isFullyEligible ? "text-emerald-400" : "text-orange-400"} />
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Co-op Status (คุณสมบัติ)</h3>
                </div>
                
                <div className="space-y-3">
                    {/* หน่วยกิต */}
                    <Link to="/setup" className="block pointer-events-auto">
                      <CoopStatusItem 
                          label="หน่วยกิต"
                          value={`${Math.round(stats.earnedCredits)} / 90`} 
                          passed={stats.coopStats.isCreditReady}
                      />
                    </Link>

                    
                    {/* GPA */}
                    <CoopStatusItem 
                        label="GPAX" 
                        value={`${stats.calculatedGPAX.toFixed(2)} / 2.75`} 
                        passed={stats.coopStats.isGPAReady}
                    />
                    
                    {/* GPA_10 พร้อมสถิติ */}
                    <div className="space-y-2">
                      <CoopStatusItem 
                          label="GPA_10" 
                          value={stats.coopStats.gpa10 !== null ? `${stats.coopStats.gpa10.toFixed(2)} / 2.50` : '— / 2.50'} 
                          passed={stats.coopStats.isCoursesReady}
                          subtext={`${stats.coopStats.passedCount}/10 passed • ${stats.coopStats.gpa10Count}/10 graded`}
                      />
                      
                      {/* แสดงสรุปเกรดแบบ progress */}
                      {stats.coopStats.gpa10Count > 0 && (
                        <div className="mt-2 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-slate-400 font-mono">GRADE DISTRIBUTION</span>
                            <span className="text-[10px] text-slate-400 font-mono">{stats.coopStats.gpa10Count}/10</span>
                          </div>
                          
                          {/* Progress bar แสดงจำนวนเกรดแต่ละช่วง */}
                          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800/50">
                            {(() => {
                              const gradeRanges = {
                                A: 0,  // >= 3.5
                                B: 0,  // >= 3.0
                                C: 0,  // >= 2.5
                                D: 0,  // >= 1.0
                                F: 0   // < 1.0
                              };
                              
                              stats.coopStats.courseDetails.forEach(c => {
                                if (c.isPassed && c.grade !== null && c.grade !== undefined) {
                                  if (c.grade >= 3.5) gradeRanges.A++;
                                  else if (c.grade >= 3.0) gradeRanges.B++;
                                  else if (c.grade >= 2.5) gradeRanges.C++;
                                  else if (c.grade >= 1.0) gradeRanges.D++;
                                  else gradeRanges.F++;
                                }
                              });
                              
                              return (
                                <>
                                  {gradeRanges.A > 0 && <div className="bg-emerald-500 flex-shrink-0" style={{width: `${(gradeRanges.A / stats.coopStats.gpa10Count) * 100}%`}} title={`A: ${gradeRanges.A}`}></div>}
                                  {gradeRanges.B > 0 && <div className="bg-cyan-500 flex-shrink-0" style={{width: `${(gradeRanges.B / stats.coopStats.gpa10Count) * 100}%`}} title={`B: ${gradeRanges.B}`}></div>}
                                  {gradeRanges.C > 0 && <div className="bg-yellow-500 flex-shrink-0" style={{width: `${(gradeRanges.C / stats.coopStats.gpa10Count) * 100}%`}} title={`C: ${gradeRanges.C}`}></div>}
                                  {gradeRanges.D > 0 && <div className="bg-orange-500 flex-shrink-0" style={{width: `${(gradeRanges.D / stats.coopStats.gpa10Count) * 100}%`}} title={`D: ${gradeRanges.D}`}></div>}
                                  {gradeRanges.F > 0 && <div className="bg-red-500 flex-shrink-0" style={{width: `${(gradeRanges.F / stats.coopStats.gpa10Count) * 100}%`}} title={`F: ${gradeRanges.F}`}></div>}
                                </>
                              );
                            })()}
                          </div>
                          
                          {/* Legend */}
                          <div className="flex gap-3 mt-2 justify-center">
                            {(() => {
                              const counts = {
                                A: 0, B: 0, C: 0, D: 0, F: 0
                              };
                              stats.coopStats.courseDetails.forEach(c => {
                                if (c.isPassed && c.grade !== null && c.grade !== undefined) {
                                  if (c.grade >= 3.5) counts.A++;
                                  else if (c.grade >= 3.0) counts.B++;
                                  else if (c.grade >= 2.5) counts.C++;
                                  else if (c.grade >= 1.0) counts.D++;
                                  else counts.F++;
                                }
                              });
                              
                              return (
                                <>
                                  {counts.A > 0 && <span className="text-[9px] text-emerald-400 font-bold">A:{counts.A}</span>}
                                  {counts.B > 0 && <span className="text-[9px] text-cyan-400 font-bold">B:{counts.B}</span>}
                                  {counts.C > 0 && <span className="text-[9px] text-yellow-400 font-bold">C:{counts.C}</span>}
                                  {counts.D > 0 && <span className="text-[9px] text-orange-400 font-bold">D:{counts.D}</span>}
                                  {counts.F > 0 && <span className="text-[9px] text-red-400 font-bold">F:{counts.F}</span>}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 text-center pointer-events-none">
                     <p className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center justify-center gap-1">
                        Click for Details <ChevronRight size={12} />
                     </p>
                </div>
            </div>

          </div>

          {/* Middle - Active Courses */}
          <div className="lg:col-span-5">
            <div className="tech-card p-6 rounded-2xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-1">
                    <Flame size={24} className="text-orange-400"/>
                    รายวิชาที่กำลัง ศึกษาอยู่
                  </h3>
                </div>
                <div className="px-4 py-2 rounded-lg tech-card">
                  <span className="text-lg font-black text-orange-400">{stats.activeCoursesList.length}</span>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                {stats.activeCoursesList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.activeCoursesList.map((course, idx) => (
                      <button
                        key={`${course.id}-${idx}`}
                        type="button"
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="tech-card-hover p-5 rounded-xl group cursor-pointer text-left focus:outline-none h-fit relative overflow-hidden"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs ${
                              course.isElective 
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {course.code}
                            </div>
                            <ArrowUpRight size={16} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"/>
                          </div>
                          
                          <h4 className="font-bold text-sm text-white mb-3 leading-relaxed line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {course.name}
                          </h4>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <Grid3x3 size={12} className="text-slate-500"/>
                              <span className="text-xs text-slate-400 font-mono">{course.credits} หน่วยกิต</span>
                            </div>
                            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wide">{course.termLabel}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl tech-card flex items-center justify-center mb-5">
                      <AlertCircle size={48} className="text-slate-600"/>
                    </div>
                    <p className="text-lg font-bold text-slate-500 mb-2">NO ACTIVE COURSES</p>
                    <p className="text-sm text-slate-700 font-mono">Mark courses in Setup</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Chart & Actions */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Academic Status Card */}
            <button
              onClick={() => navigate('/academic-criteria')}
              className={`tech-card p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-all w-full text-left`}
            >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-${academicStatus.color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
                
                {/* Hover indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-slate-400" />
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(academicStatus.color)}
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Academic Status(ความเสี่ยง ติด pro)</h3>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-${academicStatus.color}-500/10 text-${academicStatus.color}-400 border border-${academicStatus.color}-500/20`}>
                        {academicStatus.status}
                    </div>
                </div>

                <div className="relative mb-4 z-10">
                    <p className={`text-xl font-black text-${academicStatus.color}-400 mb-1`}>{academicStatus.message}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{academicStatus.detail}</p>
                </div>

                {academicStatus.prediction && (
                    <div className="relative z-10 mt-4 mb-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                                {academicStatus.prediction.label}
                            </p>
                            <p className="text-[10px] text-slate-600">
                                (คำนวณที่ {academicStatus.prediction.credits} หน่วยกิต)
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-black ${parseFloat(academicStatus.prediction.value) > 4.0 ? 'text-red-500' : 'text-white'}`}>
                                {academicStatus.prediction.value}
                            </span>
                        </div>
                    </div>
                )}

                <div className="relative pt-2 z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                        <span>SAFE</span>
                        <span>RISK</span>
                        <span>RETIRE</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 transition-all duration-1000 relative`}
                            style={{ width: `${Math.max(5, academicStatus.riskLevel)}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                        </div>
                    </div>
                </div>
                
                {/* Click hint */}
                <div className="relative z-10 mt-4 pt-4 border-t border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors font-mono flex items-center justify-center gap-1">
                    View Criteria Details <ChevronRight size={12} />
                  </p>
                </div>
            </button>

            {/* Performance Chart */}
            <div className="tech-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                    <Activity size={18} className="text-cyan-400"/>
                    GPA Graph
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">GPA Trend</p>
                </div>
                <div className="px-3 py-1 rounded-lg tech-card">
                  <span className="text-[10px] font-bold text-cyan-400 font-mono">LIVE</span>
                </div>
              </div>

              <div className="h-[220px]">
                {stats.graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.graphData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                      <XAxis 
                        dataKey="term" 
                        stroke="rgba(255,255,255,0.2)" 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        domain={[0, 4]} 
                        stroke="rgba(255,255,255,0.2)" 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                        tickLine={false} 
                        axisLine={false} 
                        ticks={[0, 1, 2, 3, 4]}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 2 }}/>
                      <ReferenceLine y={2.0} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3}/>
                      <Area 
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="#06b6d4" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorGpa)"
                        activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <TrendingUp size={32} className="text-slate-600 mb-3"/>
                    <p className="text-sm font-bold text-slate-500">NO DATA</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="tech-card p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono uppercase tracking-wide">
                <Zap size={14} className="text-yellow-400"/>
                Quick Access
              </h3>
              <div className="space-y-3">
                <button onClick={() => navigate('/roadmap')} className="w-full tech-button p-4 rounded-xl text-left group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen size={18} className="text-white"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Roadmap</p>
                        <p className="text-[10px] text-slate-500 font-mono">View All</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"/>
                  </div>
                </button>

                <button onClick={() => navigate('/academic-criteria')} className="w-full tech-button p-4 rounded-xl text-left group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield size={18} className="text-white"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">กฎเกณฑ์ทังหมด</p>
                        <p className="text-[10px] text-slate-500 font-mono">Timeline</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"/>
                  </div>
                </button>

                <button onClick={handleEditSetup} className="w-full tech-button p-4 rounded-xl text-left group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Settings size={18} className="text-white"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Profile</p>
                        <p className="text-[10px] text-slate-500 font-mono">Edit Info</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"/>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        .tech-card {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        .tech-card-hover {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tech-card-hover:hover {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(6, 182, 212, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(6, 182, 212, 0.1);
        }
        .tech-button {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tech-button:hover {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(6, 182, 212, 0.3);
          transform: scale(1.02);
        }
        .tech-gradient {
          background: linear-gradient(90deg, #fff 0%, #06b6d4 50%, #8b5cf6 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;