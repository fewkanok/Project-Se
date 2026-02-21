import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera, Terminal, Pencil, Plus, Trash2, Search, Save } from 'lucide-react';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { courses as allTrackCourses, tracks } from '../data/courseData';

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- 1. Load Data with Error Handling ---
  const getSavedData = () => {
      try {
          const saved = localStorage.getItem('userProfile');
          if (!saved) return null;
          
          const parsed = JSON.parse(saved);
          
          // Validate data structure
          if (typeof parsed !== 'object') {
              console.warn('Invalid saved data structure');
              return null;
          }
          
          return parsed;
      } catch (error) {
          console.error('Error loading saved profile:', error);
          // Clear corrupted data
          localStorage.removeItem('userProfile');
          return null;
      }
  };

  const savedData = getSavedData();
  const hasExistingData = useRef(savedData?.courseStates && Object.keys(savedData.courseStates).length > 0);
  
  // Ref ป้องกันการ Auto-run ตอนโหลดครั้งแรกถ้ามีข้อมูลเก่าอยู่แล้ว
  const isFirstRun = useRef(true);

  // State: Basic Info
  const [basicInfo, setBasicInfo] = useState(() => {
    try {
        if (savedData) {
            return {
                name: savedData.basicInfo?.name || savedData.name || '',
                studentId: savedData.basicInfo?.studentId || savedData.studentId || '',
                currentYear: parseInt(savedData.basicInfo?.currentYear || savedData.currentYear || 1),
                currentTerm: parseInt(savedData.basicInfo?.currentTerm || savedData.currentTerm || 1),
                image: savedData.basicInfo?.image || savedData.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
            };
        }
        
        const sessionData = localStorage.getItem('active_session');
        const user = sessionData ? JSON.parse(sessionData) : {};
        return {
            name: user.name || '',
            studentId: user.studentId || '',
            currentYear: 1,
            currentTerm: 1,
            image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
        };
    } catch (error) {
        console.error('Error initializing basic info:', error);
        return {
            name: '',
            studentId: '',
            currentYear: 1,
            currentTerm: 1,
            image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
        };
    }
  });

  // State: Course States
  const [courseStates, setCourseStates] = useState(() => {
    try {
        return savedData?.courseStates || {};
    } catch (error) {
        console.error('Error loading course states:', error);
        return {};
    }
  });

  // State: Custom Electives
  const [customElectives, setCustomElectives] = useState(() => {
    try {
        return savedData?.customElectives || {};
    } catch (error) {
        console.error('Error loading custom electives:', error);
        return {};
    }
  });

  // State: PE Slot Assignments { 'PE1': 'courseCode', 'PE2': 'courseCode', ... }
  const [peAssignments, setPeAssignments] = useState(() => {
    try {
        return savedData?.peAssignments || {};
    } catch (error) {
        console.error('Error loading PE assignments:', error);
        return {};
    }
  });

  // State: PE Modal
  const [showPeModal, setShowPeModal] = useState(false);
  const [activePeSlotId, setActivePeSlotId] = useState(null); // 'PE1', 'PE2', ...
  const [selectedTrack, setSelectedTrack] = useState(null);   // track id string
  const [peSearchTerm, setPeSearchTerm] = useState('');

  // State: Modal
  const [showElectiveModal, setShowElectiveModal] = useState(false);
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [electiveSearchTerm, setElectiveSearchTerm] = useState('');

  // State: GPA
  const [gpaHistory, setGpaHistory] = useState(() => {
    try {
        return savedData?.gpaHistory || {};
    } catch (error) {
        console.error('Error loading GPA history:', error);
        return {};
    }
  });

  // State: maxYear (ปีสูงสุดที่แสดงปุ่ม — ขยายได้เกิน 4)
  const [maxYear, setMaxYear] = useState(() => {
    try {
      const saved = savedData?.basicInfo?.currentYear || savedData?.currentYear || 1;
      return Math.max(4, parseInt(saved) || 4);
    } catch { return 4; }
  });

  const [totalCredits, setTotalCredits] = useState(0);

  // State: Save Status
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const saveTimeoutRef = useRef(null);

  // --- 2. Auto-Save Function with Error Handling ---
  const autoSave = (dataToSave) => {
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Validate data before saving
        if (!dataToSave.basicInfo || typeof dataToSave.basicInfo !== 'object') {
            throw new Error('Invalid basic info data');
        }
        
        if (!dataToSave.courseStates || typeof dataToSave.courseStates !== 'object') {
            throw new Error('Invalid course states data');
        }

        const userPayload = {
          basicInfo: dataToSave.basicInfo,
          ...dataToSave.basicInfo,
          gpaHistory: dataToSave.gpaHistory || {},
          passedCourses: Object.keys(dataToSave.courseStates).filter(id => dataToSave.courseStates[id] === 'passed'),
          learningCourses: Object.keys(dataToSave.courseStates).filter(id => dataToSave.courseStates[id] === 'learning'),
          courseStates: dataToSave.courseStates,
          customElectives: dataToSave.customElectives || {},
          peAssignments: dataToSave.peAssignments || {},
          maxYear: dataToSave.maxYear || 4,
          totalCredits: dataToSave.totalCredits || 0,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userPayload));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('saved'), 2000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        
        // Show user-friendly error message
        setTimeout(() => {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง');
            setSaveStatus('saved');
        }, 1000);
      }
    }, 500);
  };

  // --- 3. Auto-Save Effect ---
  useEffect(() => {
    if (isFirstRun.current) {
      return;
    }
    
    try {
        autoSave({ basicInfo, courseStates, customElectives, peAssignments, gpaHistory, maxYear, totalCredits });
    } catch (error) {
        console.error('Error in auto-save effect:', error);
    }
  }, [basicInfo, courseStates, customElectives, peAssignments, gpaHistory, totalCredits]);

  const hasUserInteracted = useRef(false);

  // --- 4. Auto-Select Logic (แก้ไขแล้ว) ---
  useEffect(() => {
    try {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            if (hasExistingData.current) {
                return; 
            }
        }

        if (!hasUserInteracted.current) {
            return;
        }

        const curYear = parseInt(basicInfo.currentYear);
        const curTerm = parseInt(basicInfo.currentTerm);
        
        // Validate year and term
        if (isNaN(curYear) || isNaN(curTerm) || curYear < 1 || curYear > 4 || curTerm < 1 || curTerm > 2) {
            console.error('Invalid year or term values');
            return;
        }

        setCourseStates(prevStates => {
            let nextStates = { ...prevStates };

            const getStatus = (y, t, currentState) => {
                if (y < curYear) {
                    // เทอมในอดีต: ถ้าเคยติก (passed/learning) ให้เป็น passed
                    return currentState ? 'passed' : null;
                }
                if (y === curYear) {
                    if (t < curTerm) {
                        // เทอมในอดีตของปีปัจจุบัน: ถ้าเคยติก ให้เป็น passed
                        return currentState ? 'passed' : null;
                    }
                    if (t === curTerm) {
                        // เทอมปัจจุบัน: 
                        // - ถ้าเคย passed อยู่แล้ว ให้คงเป็น passed
                        // - ถ้าไม่มีหรือเป็น learning ให้เป็น learning
                        return currentState === 'passed' ? 'passed' : 'learning';
                    }
                }
                // เทอมอนาคต: ลบออก
                return null;
            };

            roadmapData.forEach((yearGroup, yearIdx) => {
                const y = yearIdx + 1;
                yearGroup.semesters.forEach((sem, semIdx) => {
                    const t = semIdx + 1;

                    sem.courses.forEach(course => {
                        const currentState = prevStates[course.id];
                        const newStatus = getStatus(y, t, currentState);
                        
                        if (newStatus) {
                            nextStates[course.id] = newStatus;
                        } else {
                            delete nextStates[course.id];
                        }
                    });
                });
            });

            Object.keys(customElectives).forEach(termKey => {
                const [yStr, tStr] = termKey.split('-');
                const y = parseInt(yStr);
                const t = parseInt(tStr);
                
                if (isNaN(y) || isNaN(t)) return;
                
                const electivesInTerm = customElectives[termKey];
                if (Array.isArray(electivesInTerm)) {
                    electivesInTerm.forEach(elecId => {
                        const currentState = prevStates[elecId];
                        const newStatus = getStatus(y, t, currentState);
                        
                        if (newStatus) {
                            nextStates[elecId] = newStatus;
                        } else {
                            delete nextStates[elecId];
                        }
                    });
                }
            });

            return nextStates;
        });
    } catch (error) {
        console.error('Error in auto-select logic:', error);
    }
  }, [basicInfo.currentYear, basicInfo.currentTerm]); 


  // --- 5. Calculate Credits (Only Passed Courses) with Error Handling ---
  useEffect(() => {
    try {
        let credits = 0;
        
        // นับหน่วยกิตจากวิชาบังคับที่ผ่านแล้วเท่านั้น
        if (Array.isArray(roadmapData)) {
            roadmapData.forEach(y => {
                if (y.semesters && Array.isArray(y.semesters)) {
                    y.semesters.forEach(s => {
                        if (s.courses && Array.isArray(s.courses)) {
                            s.courses.forEach(c => {
                                // ✅ นับเฉพาะวิชาที่ผ่านแล้ว (status === 'passed')
                                if (courseStates[c.id] === 'passed' && typeof c.credits === 'number' && !isNaN(c.credits)) {
                                    credits += c.credits;
                                }
                            });
                        }
                    });
                }
            });
        }
        
        // นับหน่วยกิตจากวิชาเลือกที่ผ่านแล้วเท่านั้น
        if (customElectives && typeof customElectives === 'object') {
            Object.values(customElectives).forEach(electives => {
                if (Array.isArray(electives)) {
                    electives.forEach(electiveId => {
                        if (typeof electiveId === 'string') {
                            const elective = electiveCourses.find(e => e.id === electiveId);
                            // ✅ นับเฉพาะวิชาที่ผ่านแล้ว (status === 'passed')
                            if (elective && courseStates[electiveId] === 'passed' && typeof elective.credits === 'number' && !isNaN(elective.credits)) {
                                credits += elective.credits;
                            }
                        }
                    });
                }
            });
        }
        
        // Validate final credit count
        if (credits < 0 || credits > 200 || isNaN(credits)) {
            console.error('Invalid credit calculation:', credits);
            setTotalCredits(0);
        } else {
            setTotalCredits(credits);
        }
    } catch (error) {
        console.error('Error calculating credits:', error);
        setTotalCredits(0);
    }
  }, [courseStates, customElectives]);


  // --- Helper Functions with Error Handling ---
  const getDependentCourses = (parentId) => {
      try {
          let dependents = [];
          
          if (!parentId || typeof parentId !== 'string') return dependents;
          
          roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
              if (c.prereq === parentId) {
                  dependents.push(c.id);
                  dependents = [...dependents, ...getDependentCourses(c.id)];
              }
          })));
          
          electiveCourses.forEach(elective => {
              if (elective.prereq === parentId && courseStates[elective.id]) {
                  dependents.push(elective.id);
                  dependents = [...dependents, ...getDependentCourses(elective.id)];
              }
          });
          
          return dependents;
      } catch (error) {
          console.error('Error getting dependent courses:', error);
          return [];
      }
  };

  const findCourseById = (id) => {
      try {
          if (!id || typeof id !== 'string') return null;
          
          let found = null;
          roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
              if (c.id === id) found = c;
          })));
          return found;
      } catch (error) {
          console.error('Error finding course:', error);
          return null;
      }
  };

  // --- Click Handlers with Error Handling ---
  const handleCourseClick = (courseId) => {
      try {
          if (!courseId || typeof courseId !== 'string') {
              console.error('Invalid course ID');
              return;
          }
          
          const currentState = courseStates[courseId];
          // ค้นหาวิชาจากทุก source รวมถึง PE track courses
          const courseObj = findCourseById(courseId) 
              || electiveCourses.find(e => e.id === courseId)
              || allTrackCourses[courseId];
          
          if (!courseObj) {
              console.error('Course not found:', courseId);
              return;
          }
          
          let nextState = '';
          if (!currentState) nextState = 'passed';     
          else if (currentState === 'passed') nextState = 'learning'; 
          else if (currentState === 'learning') nextState = undefined; 

          if (nextState === 'passed' || nextState === 'learning') {
              if (courseObj?.prereq) {
                  const prereqCode = courseObj.prereq;
                  // เช็ค prereq แบบครบ: courseStates + peAssignments (PE courses ที่วางแผนไว้)
                  const prereqInCourseStates = courseStates[prereqCode] === 'passed' || courseStates[prereqCode] === 'learning';
                  const prereqInPeSlot = Object.values(peAssignments).includes(prereqCode);
                  const prereqSatisfied = prereqInCourseStates || prereqInPeSlot;
                  
                  if (!prereqSatisfied) {
                      // หาชื่อวิชา prereq จากทุก source
                      const prereqCourse = findCourseById(prereqCode)
                          || electiveCourses.find(e => e.id === prereqCode)
                          || allTrackCourses[prereqCode];
                      const prereqName = prereqCourse?.name || prereqCode;
                      alert(`ต้องผ่าน "${prereqName}" ก่อนจึงจะลงวิชานี้ได้`);
                      return;
                  }
              }
          }

          setCourseStates(prev => {
              const updated = { ...prev };
              if (nextState) {
                  updated[courseId] = nextState;
              } else {
                  delete updated[courseId];
                  const children = getDependentCourses(courseId);
                  children.forEach(childId => delete updated[childId]);
              }
              return updated;
          });
      } catch (error) {
          console.error('Error handling course click:', error);
          alert('เกิดข้อผิดพลาดในการเลือกวิชา กรุณาลองอีกครั้ง');
      }
  };

  const openElectiveModal = (yearIdx, semIdx) => {
    try {
        if (typeof yearIdx !== 'number' || typeof semIdx !== 'number') {
            console.error('Invalid year or semester index');
            return;
        }
        
        const termKey = `${yearIdx + 1}-${semIdx + 1}`;
        setActiveTermKey(termKey);
        setShowElectiveModal(true);
        setElectiveSearchTerm('');
    } catch (error) {
        console.error('Error opening elective modal:', error);
    }
  };

  const handleSelectElective = (electiveId) => {
    try {
        if (!electiveId || typeof electiveId !== 'string') {
            console.error('Invalid elective ID');
            return;
        }
        
        const alreadySelected = Object.values(customElectives || {}).some(electives => 
            Array.isArray(electives) && electives.includes(electiveId)
        );
        
        if (alreadySelected) {
            alert('วิชานี้ถูกเลือกไปแล้วในเทอมอื่น!');
            return;
        }
        
        setCustomElectives(prev => ({
            ...prev,
            [activeTermKey]: [...(prev[activeTermKey] || []), electiveId]
        }));
        
        const curYear = parseInt(basicInfo.currentYear);
        const curTerm = parseInt(basicInfo.currentTerm);
        const [targetYear, targetTerm] = activeTermKey.split('-').map(Number);
        
        if (isNaN(targetYear) || isNaN(targetTerm)) {
            throw new Error('Invalid term key');
        }
        
        let initialStatus = null; 

        if (targetYear < curYear) {
            initialStatus = 'passed';
        } else if (targetYear === curYear) {
            if (targetTerm < curTerm) {
                initialStatus = 'passed';
            } else if (targetTerm === curTerm) {
                initialStatus = 'learning';
            }
        }
        
        if (initialStatus) {
            setCourseStates(prev => ({
                ...prev,
                [electiveId]: initialStatus
            }));
        }
        
        setShowElectiveModal(false);
        setElectiveSearchTerm('');
    } catch (error) {
        console.error('Error selecting elective:', error);
        alert('เกิดข้อผิดพลาดในการเลือกวิชาเสรี กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveElective = (termKey, electiveId) => {
    try {
        if (!termKey || !electiveId) {
            console.error('Invalid term key or elective ID');
            return;
        }
        
        const children = getDependentCourses(electiveId);
        
        setCustomElectives(prev => ({
            ...prev,
            [termKey]: (prev[termKey] || []).filter(id => id !== electiveId)
        }));
        
        setCourseStates(prev => {
            const updated = { ...prev };
            delete updated[electiveId];
            children.forEach(childId => delete updated[childId]);
            return updated;
        });
    } catch (error) {
        console.error('Error removing elective:', error);
        alert('เกิดข้อผิดพลาดในการลบวิชาเสรี กรุณาลองอีกครั้ง');
    }
  };

  const handleInfoChange = (e) => {
    try {
        const { name, value } = e.target;
        
        if (!name) {
            console.error('Input name is missing');
            return;
        }
        
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    } catch (error) {
        console.error('Error handling info change:', error);
    }
  };

  const handleImageUpload = (e) => {
    try {
        const file = e.target.files?.[0];
        
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file type! Please use JPG, PNG, or WebP image.");
            return;
        }
        
        // Validate file size (1MB = 1048576 bytes)
        if (file.size > 1048576) {
            alert("File size too large! Please use image under 1MB.");
            return;
        }
        
        const reader = new FileReader();
        
        reader.onerror = () => {
            console.error('File reading failed');
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาลองอีกครั้ง');
        };
        
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setBasicInfo(prev => ({ ...prev, image: reader.result }));
            }
        };
        
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองอีกครั้ง');
    }
  };

  // ✅✅✅ แก้ไขส่วนนี้: เพิ่มการเช็ค GPA with Enhanced Error Handling
  const handleSubmit = () => {
    try {
        // 1. เช็คชื่อและรหัสนิสิต
        if (!basicInfo.name || basicInfo.name.trim() === '') {
            alert("กรุณากรอก ชื่อ (Name) ให้ครบถ้วน");
            return;
        }
        
     //    if (!basicInfo.studentId || basicInfo.studentId.trim() === '') {
     //        alert("กรุณากรอก รหัสนิสิต (Student ID) ให้ครบถ้วน");
     //        return;
     //    }
        
        // Validate student ID format (optional - adjust as needed)
     //    if (!/^\d{7,10}$/.test(basicInfo.studentId.trim())) {
     //        const confirmProceed = window.confirm(
     //            "รหัสนิสิตไม่ตรงตามรูปแบบทั่วไป (7-10 หลัก)\nต้องการดำเนินการต่อหรือไม่?"
     //        );
     //        if (!confirmProceed) return;
     //    }

        // 2. เช็คเกรด (GPA) ย้อนหลังให้ครบ
        const curYear = parseInt(basicInfo.currentYear);
        const curTerm = parseInt(basicInfo.currentTerm);
        
        if (isNaN(curYear) || isNaN(curTerm)) {
            alert("ข้อมูลปีและเทอมไม่ถูกต้อง");
            return;
        }
        
        let missingGpaTerm = null;

        // วนลูปเช็คทุกเทอมที่ผ่านแล้ว (Y1 ถึง currentYear/currentTerm)
        outer: for (let y = 1; y <= curYear; y++) {
            for (let t = 1; t <= 2; t++) {
                const isPast = (y < curYear) || (y === curYear && t < curTerm);
                if (isPast) {
                    const termKey = `Y${y}/${t}`;
                    const gpaValue = gpaHistory[termKey];
                    if (!gpaValue || gpaValue.toString().trim() === '') { missingGpaTerm = termKey; break outer; }
                    const gpaNum = parseFloat(gpaValue);
                    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
                        alert(`เกรดเฉลี่ยของเทอม ${termKey} ไม่ถูกต้อง (ต้องอยู่ระหว่าง 0-4)`);
                        return;
                    }
                }
            }
        }

        if (missingGpaTerm) {
            alert(`กรุณากรอกเกรดเฉลี่ย (GPA) ของเทอม ${missingGpaTerm} ให้เรียบร้อยก่อนดำเนินการต่อ`);
            return;
        }
        
        // 3. ถ้าผ่านหมด บันทึกและไปหน้าถัดไป
        const passedCourses = Object.keys(courseStates).filter(id => courseStates[id] === 'passed');
        const learningCourses = Object.keys(courseStates).filter(id => courseStates[id] === 'learning');
        
        const userPayload = { 
            basicInfo,
            ...basicInfo,
            gpaHistory,
            passedCourses, 
            learningCourses,
            courseStates,
            customElectives,
            peAssignments,
            maxYear,
            totalCredits, 
            lastUpdated: new Date().toISOString() 
        };
        
        // Validate payload before saving
        const payloadString = JSON.stringify(userPayload);
        if (payloadString.length > 5000000) { // 5MB limit
            alert('ข้อมูลมีขนาดใหญ่เกินไป กรุณาติดต่อผู้ดูแลระบบ');
            return;
        }
        
        localStorage.setItem('userProfile', payloadString);
        
        // Navigate with error handling
        navigate('/dashboard');
    } catch (error) {
        console.error('Error in handleSubmit:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง หรือติดต่อผู้ดูแลระบบ');
    }
  };

  const getFilteredElectives = () => {
    try {
        if (!Array.isArray(electiveCourses)) return [];
        return electiveCourses.filter(elective => {
            if (!elective || typeof elective !== 'object') return false;
            const searchLower = electiveSearchTerm.toLowerCase().trim();
            return !searchLower ||
                (elective.name && elective.name.toLowerCase().includes(searchLower)) ||
                (elective.code && elective.code.toLowerCase().includes(searchLower));
        });
    } catch (error) { return []; }
  };

  // --- PE (Professional Elective) Handlers ---
  const openPeModal = (peSlotId) => {
    setActivePeSlotId(peSlotId);
    setSelectedTrack(null);
    setPeSearchTerm('');
    setShowPeModal(true);
  };

  // วิชาที่ assign ไปแล้ว (ทุก slot รวมกัน)
  const getAllAssignedCourseCodes = () => Object.values(peAssignments);

  // วิชาที่ filter จาก track ที่เลือก + ค้นหา + ยังไม่ถูก assign
  const getFilteredTrackCourses = () => {
    if (!selectedTrack) return [];
    const track = tracks.find(t => t.id === selectedTrack);
    if (!track) return [];

    // รวม code ทุกตัวจาก track
    const trackCodes = new Set();
    track.chains.forEach(chain => {
      chain.forEach(item => {
        if (item !== 'arrow') trackCodes.add(item.replace('*', ''));
      });
    });

    const assigned = getAllAssignedCourseCodes();
    const currentAssignedInThisSlot = peAssignments[activePeSlotId];

    // หมายเลข slot ปัจจุบัน เช่น 'PE2' → 2
    const currentSlotNum = parseInt(activePeSlotId?.replace(/\D/g, '') || '0');

    // ฟังก์ชันเช็คว่า prereq "ผ่าน" หรือยัง
    // กฎ: นับเฉพาะ 'passed' เท่านั้น — 'learning' ไม่ผ่าน
    // prereq ผ่านถ้า:
    //   1) courseStates[prereq] === 'passed'  (วิชาหลัก หรือ PE ที่ mark passed แล้ว)
    //   2) prereq ถูก assign ใน PE slot ก่อนหน้า AND courseStates[prereq] === 'passed'
    const isPrereqSatisfied = (prereqCode) => {
      if (!prereqCode) return true;
      // ผ่านจาก courseStates (ครอบคลุมทั้งวิชาหลักและ PE ที่ passed แล้ว)
      if (courseStates[prereqCode] === 'passed') return true;
      // prereq อยู่ใน PE slot ก่อนหน้า → ต้อง passed ด้วยจึงนับ
      const prereqSlotEntry = Object.entries(peAssignments).find(([, code]) => code === prereqCode);
      if (!prereqSlotEntry) return false;
      const prereqSlotNum = parseInt(prereqSlotEntry[0].replace(/\D/g, '') || '999');
      return prereqSlotNum < currentSlotNum && courseStates[prereqCode] === 'passed';
    };

    // หา prereq name เพื่อแสดงในการ์ด
    const getPrereqName = (prereqCode) => {
      if (!prereqCode) return null;
      const c = allTrackCourses[prereqCode];
      return c ? c.name : prereqCode;
    };

    // สร้าง object พร้อม status สำหรับแต่ละวิชา
    const results = Array.from(trackCodes)
      .map(code => allTrackCourses[code])
      .filter(Boolean)
      .map(course => {
        const isCurrentSlot = course.code === currentAssignedInThisSlot;
        const isAssignedElsewhere = !isCurrentSlot && assigned.includes(course.code);
        const isAlreadyPassed = courseStates[course.code] === 'passed';
        const prereqOk = isPrereqSatisfied(course.prereq);

        // ซ่อนถ้าถูก assign ที่ slot อื่น หรือ passed แล้ว
        if (isAssignedElsewhere || isAlreadyPassed) return null;

        // สถานะ
        let status = 'available'; // ลงได้
        let lockReason = null;
        if (isCurrentSlot) {
          status = 'selected';
        } else if (!prereqOk) {
          status = 'locked';
          const prereqName = getPrereqName(course.prereq);
          // หาว่า prereq อยู่ที่ slot ไหน (ถ้า assign ไว้แล้ว)
          const prereqSlotEntry = Object.entries(peAssignments).find(([, c]) => c === course.prereq);
          if (prereqSlotEntry) {
            lockReason = `ต้องลง "${prereqName}" (${prereqSlotEntry[0]}) ก่อน`;
          } else {
            lockReason = `ต้องผ่าน "${prereqName || course.prereq}" ก่อน`;
          }
        }

        // filter search (ยกเว้นที่ selected ให้โชว์เสมอ)
        const searchLower = peSearchTerm.toLowerCase().trim();
        if (searchLower && status !== 'selected') {
          const match =
            course.name?.toLowerCase().includes(searchLower) ||
            course.nameEn?.toLowerCase().includes(searchLower) ||
            course.code?.toLowerCase().includes(searchLower);
          if (!match) return null;
        }

        return { ...course, status, lockReason };
      })
      .filter(Boolean);

    // เรียงลำดับ: selected → available → locked
    const order = { selected: 0, available: 1, locked: 2 };
    return results.sort((a, b) => order[a.status] - order[b.status]);
  };

  // ฟังก์ชัน cascade: ถ้าลบ courseCode ออกจาก slot → ลบ PE ทุกตัวที่ต้องการมันเป็น prereq ด้วย (ทอดต่อกันไป)
  const cascadeRemovePeAssignments = (removedCourseCode, assignments) => {
    let updated = { ...assignments };
    let changed = true;
    while (changed) {
      changed = false;
      const currentValues = Object.values(updated); // codes ที่ยังอยู่
      for (const [slotId, code] of Object.entries(updated)) {
        const course = allTrackCourses[code];
        if (course?.prereq && !currentValues.includes(course.prereq)) {
          // prereq ของวิชานี้หายไปจาก assignments แล้ว → เช็คว่า prereq อยู่ใน courseStates ไหม
          const prereqInStates = courseStates[course.prereq] === 'passed' || courseStates[course.prereq] === 'learning';
          if (!prereqInStates) {
            delete updated[slotId];
            changed = true;
          }
        }
      }
    }
    return updated;
  };

  const handleSelectPeCourse = (courseCode) => {
    const currentInSlot = peAssignments[activePeSlotId];
    if (currentInSlot === courseCode) {
      // toggle ออก → cascade ลบ PE ที่ depend ด้วย
      const afterRemove = { ...peAssignments };
      delete afterRemove[activePeSlotId];
      setPeAssignments(cascadeRemovePeAssignments(courseCode, afterRemove));
    } else {
      setPeAssignments(prev => ({ ...prev, [activePeSlotId]: courseCode }));
    }
    setShowPeModal(false);
    setPeSearchTerm('');
    setSelectedTrack(null);
  };

  const handleRemovePeAssignment = (peSlotId) => {
    const removedCode = peAssignments[peSlotId];
    const afterRemove = { ...peAssignments };
    delete afterRemove[peSlotId];
    // cascade ลบ PE ที่ต้องการวิชานี้เป็น prereq ด้วย
    setPeAssignments(cascadeRemovePeAssignments(removedCode, afterRemove));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 overflow-x-hidden selection:bg-orange-500/30">
      
      {/* Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Save Status */}
      <div className="fixed top-4 right-4 z-[200]">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
          saveStatus === 'saving' 
            ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' 
            : saveStatus === 'saved' 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-red-500/20 border-red-500/50 text-red-300'
        }`}>
          <Save size={16} className={saveStatus === 'saving' ? 'animate-pulse' : ''} />
          <span className="text-xs font-bold">
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Auto-saved' : 'Error saving'}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showElectiveModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-white/20 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl shadow-orange-500/20">
            
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-transparent to-purple-500/10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <Plus className="text-orange-500" size={28}/>
                    เลือกวิชาเสรี
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 font-mono">
                    Term Key: {activeTermKey}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowElectiveModal(false);
                    setElectiveSearchTerm('');
                  }} 
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                  <XCircle size={28}/>
                </button>
              </div>
              
              <div className="relative">
                <input 
                  type="text"
                  placeholder="ค้นหาวิชา... (ชื่อวิชา หรือ รหัสวิชา)"
                  value={electiveSearchTerm}
                  onChange={(e) => setElectiveSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-4 pr-10 text-white placeholder-slate-500 focus:border-orange-500 outline-none transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getFilteredElectives().map(elective => {
                    const alreadySelected = Object.values(customElectives || {}).some(electives => 
                      Array.isArray(electives) && electives.includes(elective.id)
                    );
                    
                    return (
                      <button
                        key={elective.id}
                        onClick={() => !alreadySelected && handleSelectElective(elective.id)}
                        disabled={alreadySelected}
                        className={`group relative p-4 rounded-xl border text-left transition-all transform ${
                          alreadySelected 
                            ? 'bg-emerald-500/5 border-emerald-500/30 opacity-60 cursor-not-allowed' 
                            : 'bg-white/5 border-white/10 hover:bg-orange-500/10 hover:border-orange-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-mono px-2 py-1 rounded-lg border font-bold ${
                              alreadySelected 
                                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                : 'border-orange-500/40 text-orange-400 bg-orange-500/10 group-hover:bg-orange-500/20'
                            }`}>
                              {elective.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                              {elective.credits} หน่วยกิต
                            </span>
                          </div>
                          {alreadySelected && (
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                              <CheckCircle2 size={16} />
                              <span>เลือกแล้ว</span>
                            </div>
                          )}
                        </div>
                        
                        <h4 className={`text-sm font-bold leading-tight ${
                          alreadySelected ? 'text-slate-400' : 'text-white group-hover:text-orange-300'
                        }`}>
                          {elective.nameEn || elective.name}
                        </h4>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{elective.nameEn ? elective.name : ''}</p>
                        
                        {!alreadySelected && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-purple-500/0 group-hover:from-orange-500/5 group-hover:to-purple-500/5 pointer-events-none transition-all"></div>
                        )}
                      </button>
                    );
                  })}
              </div>
              
              {getFilteredElectives().length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-3 text-slate-600" size={48}/>
                  <p className="text-slate-500 text-sm">ไม่พบวิชาที่ค้นหา</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                <span className="font-bold text-white">{electiveCourses.length}</span> วิชาเสรีทั้งหมด
              </div>
              <div className="text-xs text-slate-500">
                คลิกเพื่อเลือกวิชาที่ต้องการ
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ PE (PROFESSIONAL ELECTIVE) MODAL ══════ */}
      {showPeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/20 flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 shrink-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <GraduationCap className="text-purple-400" size={28}/>
                    เลือกวิชาเลือกเอก
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Slot: <span className="font-mono text-purple-400 font-bold">{activePeSlotId}</span>
                    {peAssignments[activePeSlotId] && (
                      <span className="ml-2 text-emerald-400 text-xs">● เลือกแล้ว: <b>{allTrackCourses[peAssignments[activePeSlotId]]?.nameEn || allTrackCourses[peAssignments[activePeSlotId]]?.name || peAssignments[activePeSlotId]}</b></span>
                    )}
                  </p>
                </div>
                <button onClick={() => { setShowPeModal(false); setPeSearchTerm(''); setSelectedTrack(null); }}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
                  <XCircle size={28}/>
                </button>
              </div>
            </div>

            {/* Step 1: เลือก Track */}
            {!selectedTrack ? (
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-slate-400 text-sm mb-5 font-bold uppercase tracking-wider">Step 1 — เลือกสาย (Track)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.map(track => (
                    <button key={track.id} onClick={() => setSelectedTrack(track.id)}
                      className="group p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.03] hover:-translate-y-1"
                      style={{ borderColor: track.color + '60', background: track.color + '12' }}>
                      <div className="text-3xl mb-2">{track.icon}</div>
                      <div className="font-black text-white text-base group-hover:opacity-90" style={{ color: track.color }}>{track.label}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {(() => {
                          const codes = new Set();
                          track.chains.forEach(chain => chain.forEach(item => { if (item !== 'arrow') codes.add(item.replace('*','')); }));
                          return codes.size;
                        })()} วิชา
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: เลือกวิชาจาก Track ที่เลือก */
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Track header + search */}
                <div className="p-4 border-b border-white/10 shrink-0 flex items-center gap-3 flex-wrap">
                  <button onClick={() => setSelectedTrack(null)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white text-sm font-bold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                    ← กลับ
                  </button>
                  <span className="text-sm font-bold" style={{ color: tracks.find(t=>t.id===selectedTrack)?.color }}>
                    {tracks.find(t=>t.id===selectedTrack)?.icon} {tracks.find(t=>t.id===selectedTrack)?.label}
                  </span>
                  <div className="relative flex-1 min-w-[200px]">
                    <input type="text" placeholder="ค้นหาวิชา..."
                      value={peSearchTerm} onChange={e => setPeSearchTerm(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2 pl-4 pr-8 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm"/>
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                  </div>
                </div>

                {/* Course list */}
                <div className="p-4 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getFilteredTrackCourses().map(course => {
                      const { status, lockReason } = course;
                      const isSelected = status === 'selected';
                      const isLocked = status === 'locked';
                      const track = tracks.find(t => t.id === selectedTrack);
                      const trackColor = track?.color || '#7c3aed';

                      return (
                        <button key={course.code}
                          onClick={() => !isLocked && handleSelectPeCourse(course.code)}
                          disabled={isLocked}
                          className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500/70 bg-emerald-500/10'
                              : isLocked
                                ? 'border-slate-700/50 bg-slate-900/40 opacity-60 cursor-not-allowed'
                                : 'border-white/10 bg-white/5 hover:bg-purple-500/10 hover:scale-[1.02] cursor-pointer'
                          }`}>

                          {/* Header row: code + credits + badge */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-mono px-2 py-1 rounded-lg border font-bold"
                                style={isLocked
                                  ? { borderColor: '#374151', color: '#6b7280', background: '#111827' }
                                  : { borderColor: trackColor+'60', color: trackColor, background: trackColor+'18' }}>
                                {course.code}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/10">
                                {course.credits} หน่วยกิต
                              </span>
                            </div>

                            {/* สถานะ badge */}
                            {isSelected && (
                              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={12}/> เลือกแล้ว
                              </div>
                            )}
                            {isLocked && (
                              <div className="flex items-center gap-1 text-slate-500 text-xs font-bold shrink-0 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                                <Lock size={10}/> ยังลงไม่ได้
                              </div>
                            )}
                            {!isSelected && !isLocked && (
                              <div className="flex items-center gap-1 text-xs font-bold shrink-0 px-2 py-0.5 rounded-full border"
                                style={{ color: trackColor, borderColor: trackColor+'50', background: trackColor+'12' }}>
                                <CheckCircle2 size={10}/> ลงได้
                              </div>
                            )}
                          </div>

                          {/* ชื่อวิชา */}
                          <h4 className={`text-sm font-bold leading-tight mb-0.5 ${
                            isSelected ? 'text-emerald-200' : isLocked ? 'text-slate-500' : 'text-white'
                          }`}>
                            {course.nameEn || course.name}
                          </h4>
                          <p className="text-[11px] text-slate-600 leading-tight mb-2">{course.name}</p>

                          {/* Prereq info */}
                          {course.prereq && (
                            <div className={`text-[10px] mt-1 flex items-start gap-1.5 px-2 py-1.5 rounded-lg ${
                              isLocked
                                ? 'bg-red-950/40 border border-red-900/50 text-red-400'
                                : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-500'
                            }`}>
                              {isLocked
                                ? <Lock size={10} className="shrink-0 mt-0.5"/>
                                : <CheckCircle2 size={10} className="shrink-0 mt-0.5"/>
                              }
                              <span>
                                {isLocked
                                  ? lockReason
                                  : `ผ่าน ${allTrackCourses[course.prereq]?.nameEn || allTrackCourses[course.prereq]?.name || course.prereq} แล้ว ✓`
                                }
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {getFilteredTrackCourses().length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <AlertCircle className="mx-auto mb-3 text-slate-600" size={40}/>
                        <p className="text-slate-500 text-sm">ไม่พบวิชา</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-500">เลือกได้เฉพาะปีปัจจุบัน (Y{basicInfo.currentYear}) และปีที่ผ่านมา</span>
              <span className="text-xs text-slate-600">{Object.keys(peAssignments).length} / 9 slots filled</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        
        {/* Header */}
        <div className="mt-8 mb-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-2">
                <Terminal className="text-orange-500" size={32}/>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                    CS SURVIVOR
                </h1>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Profile Setup & Course Planning</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
                
                {/* 1. Identity */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400"><User size={20}/> Survivor Info</h2>
                    
                    <div className="flex flex-col items-center mb-6">
                        <div 
                            className="relative w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer group hover:border-orange-500 transition-all bg-white/5"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img src={basicInfo.image} alt="Profile" className="w-full h-full object-cover p-1 rounded-full" />
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Camera size={24} className="text-white mb-1"/>
                                <span className="text-[10px] text-white font-bold">Change</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                        />
                        <p className="text-xs text-slate-500 mt-2">Click image to upload (Max 1MB)</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Full Name</label>
                            <div className="relative group">
                                <input 
                                    name="name" 
                                    value={basicInfo.name} 
                                    onChange={handleInfoChange} 
                                    placeholder="Full Name (English)" 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-orange-500 outline-none transition-colors group-hover:border-white/30" 
                                />
                                <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-400 transition-colors pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Student ID</label>
                            <div className="relative group">
                                <input 
                                    name="studentId" 
                                    value={basicInfo.studentId} 
                                    onChange={handleInfoChange} 
                                    placeholder="Student ID (e.g. 660xxxx)" 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-purple-500 outline-none transition-colors group-hover:border-white/30" 
                                />
                                <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-purple-400 transition-colors pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Timeline */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl overflow-hidden relative">
                    {/* bg glow */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"/>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-purple-400 relative z-10"><Calendar size={20}/> Current Timeline</h2>

                    <div className="space-y-5 relative z-10">
                        {/* ── Year selector ── */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">ปีการศึกษา</p>
                            <div className="flex flex-wrap gap-2 items-center">
                                {Array.from({length: maxYear}, (_, i) => i + 1).map(y => {
                                    const isActive = basicInfo.currentYear === y;
                                    const isExtra = y > 4;
                                    return (
                                        <button key={y}
                                            onClick={() => {
                                                hasUserInteracted.current = true;
                                                setBasicInfo(prev => ({...prev, currentYear: y}));
                                            }}
                                            className="relative group"
                                            style={{outline:'none'}}
                                        >
                                            <div className={`
                                                relative px-4 py-2.5 rounded-xl font-black text-sm transition-all duration-200 select-none
                                                ${isActive
                                                    ? isExtra
                                                        ? 'bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-lg shadow-fuchsia-500/30 scale-105'
                                                        : 'bg-gradient-to-br from-purple-500 to-violet-700 text-white shadow-lg shadow-purple-500/30 scale-105'
                                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:scale-105'
                                                }
                                            `}>
                                                {isActive && (
                                                    <span className="absolute inset-0 rounded-xl ring-2 ring-white/20 ring-offset-0 pointer-events-none"/>
                                                )}
                                                <span className="text-[9px] block leading-none mb-0.5 opacity-60 font-medium">{isExtra ? 'EXT' : 'YEAR'}</span>
                                                <span>{y}</span>
                                            </div>
                                        </button>
                                    );
                                })}

                                {/* ── Add year ── */}
                                <button
                                    onClick={() => {
                                        const next = maxYear + 1;
                                        setMaxYear(next);
                                        hasUserInteracted.current = true;
                                        setBasicInfo(prev => ({...prev, currentYear: next}));
                                    }}
                                    className="group relative px-3 py-2.5 rounded-xl border border-dashed border-purple-500/40 text-purple-400 hover:border-purple-400 hover:bg-purple-500/10 hover:scale-105 transition-all duration-200"
                                    title="เพิ่มปี"
                                >
                                    <span className="text-[9px] block leading-none mb-0.5 opacity-50 font-medium">ADD</span>
                                    <Plus size={14} className="mx-auto"/>
                                </button>

                                {/* ── Remove extra year ── */}
                                {maxYear > 4 && (
                                    <button
                                        onClick={() => {
                                            const prev = maxYear - 1;
                                            setMaxYear(prev);
                                            if (basicInfo.currentYear > prev) {
                                                hasUserInteracted.current = true;
                                                setBasicInfo(p => ({...p, currentYear: prev}));
                                            }
                                        }}
                                        className="group relative px-3 py-2.5 rounded-xl border border-dashed border-red-500/30 text-red-400/50 hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-400 hover:scale-105 transition-all duration-200"
                                        title="ลบปีสุดท้าย"
                                    >
                                        <span className="text-[9px] block leading-none mb-0.5 opacity-50 font-medium">DEL</span>
                                        <Trash2 size={14} className="mx-auto"/>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Term selector ── */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">เทอม</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2].map(t => {
                                    const isActive = basicInfo.currentTerm === t;
                                    return (
                                        <button key={t}
                                            onClick={() => {
                                                hasUserInteracted.current = true;
                                                setBasicInfo(prev => ({...prev, currentTerm: t}));
                                            }}
                                            className="relative group"
                                        >
                                            <div className={`
                                                py-3 rounded-xl font-black text-sm transition-all duration-200 text-center select-none
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                                }
                                            `}>
                                                {isActive && <span className="absolute inset-0 rounded-xl ring-2 ring-white/20 pointer-events-none"/>}
                                                <span className="text-[9px] block leading-none mb-1 opacity-60 font-medium">TERM</span>
                                                <span>{t}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Current label ── */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                            <div className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"/>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"/>
                            </div>
                            <span className="text-xs text-slate-400">กำลังเรียน</span>
                            <span className="ml-auto font-black text-white font-mono text-sm">
                                Y{basicInfo.currentYear} / Term {basicInfo.currentTerm}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. GPA — วนทุกปีที่ผ่านแล้ว (Y1 ถึง currentYear/currentTerm) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> Previous GPA</h2>
                    <div className="space-y-2 overflow-visible pr-2">
                        {Array.from({length: basicInfo.currentYear}, (_, yi) => yi + 1).flatMap(y =>
                            [1, 2].map(t => {
                                const isPast = (y < basicInfo.currentYear) ||
                                               (y === basicInfo.currentYear && t < basicInfo.currentTerm);
                                if (!isPast) return null;
                                const termKey = `Y${y}/${t}`;
                                return (
                                    <div key={termKey} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
                                            {termKey} GPA
                                        </span>
                                        <input
                                            type="number" step="0.01" min="0" max="4" placeholder="0.00"
                                            value={gpaHistory[termKey] || ''}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                if (val === '') { setGpaHistory(prev => ({ ...prev, [termKey]: '' })); return; }
                                                const numVal = parseFloat(val);
                                                if (numVal > 4) val = '4';
                                                if (numVal < 0) val = '0';
                                                setGpaHistory(prev => ({ ...prev, [termKey]: val }));
                                            }}
                                            className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                );
                            })
                        )}
                        {basicInfo.currentYear === 1 && basicInfo.currentTerm === 1 && (
                            <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-white/10 rounded-xl">No grades to enter yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT CONTENT --- */}
            <div className="lg:col-span-8 space-y-8">
                {/* Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0a0a0a] to-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-xl gap-4 sticky top-8 z-40 backdrop-blur-xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="text-pink-500"/> Mission Status</h2>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-400/30"><CheckCircle2 size={12}/> Passed</span>
                            <span className="flex items-center gap-1 text-blue-300 bg-blue-500/20 px-2 py-1 rounded border border-blue-400/30"><PlayCircle size={12}/> Learning</span>
                            <span className="flex items-center gap-1 text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10"><XCircle size={12}/> Not Started</span>
                        </div>
                    </div>
                    <div className="text-right bg-white/5 p-3 rounded-xl border border-white/5 min-w-[120px]">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Credits Passed </span>
                        <span className="text-3xl font-mono font-black text-orange-400">{totalCredits}</span>
                        <span className="text-[9px] text-slate-600 block mt-1">(Learning courses not counted)</span>
                    </div>
                </div>

                {/* Courses */}
                {roadmapData.map((yearGroup, yearIdx) => {
                    const isYearCurrent = basicInfo.currentYear === yearGroup.year;
                    
                    return (
                        <div key={yearIdx} className="relative">
                            
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg transition-all ${
                                    isYearCurrent 
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/20' 
                                    : 'bg-white/10 backdrop-blur text-slate-300 border-white/10'
                                }`}>
                                   {yearGroup.year}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearGroup.semesters.map((sem, semIdx) => {
                                    const isTermCurrent = isYearCurrent && basicInfo.currentTerm === (semIdx + 1);
                                    
                                    const termKey = `${yearIdx + 1}-${semIdx + 1}`;
                                    const semesterElectives = customElectives[termKey] || [];

                                    return (
                                        <div key={semIdx} className={`rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 border ${isTermCurrent ? 'bg-white/[0.07] border-white/20 ring-1 ring-white/10' : 'bg-white/5 border-white/5'}`}>
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold uppercase tracking-widest ${isTermCurrent ? 'text-white' : 'text-slate-400'}`}>{sem.term}</span>
                                                    {isTermCurrent && <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded-full">Current</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                {/* Core Courses */}
                                                {sem.courses.map(course => {
                                                    const isPeSlot = course.isProfessionalElective === true;
                                                    const assignedCode = isPeSlot ? peAssignments[course.id] : null;
                                                    const assignedCourse = assignedCode ? allTrackCourses[assignedCode] : null;
                                                    const status = courseStates[course.id];
                                                    const prereqState = course.prereq ? courseStates[course.prereq] : 'passed';
                                                    const isLocked = course.prereq && prereqState !== 'passed';

                                                    // ── PE Slot Card ──
                                                    if (isPeSlot) {
                                                        // ล็อค PE slot สำหรับปีอนาคต
                                                        const slotYear = yearIdx + 1;
                                                        const isFutureYear = slotYear > parseInt(basicInfo.currentYear);

                                                        if (isFutureYear) {
                                                            return (
                                                                <div key={course.id}
                                                                    className="p-3 rounded-xl border border-dashed border-slate-700/40 bg-slate-900/30 flex items-center justify-between opacity-40 cursor-not-allowed"
                                                                >
                                                                    <div className="text-left min-w-0">
                                                                        <div className="text-[10px] font-mono text-slate-600 mb-0.5">{course.id} · PROFESSIONAL ELECTIVE</div>
                                                                        <div className="text-xs text-slate-700 flex items-center gap-1"><Lock size={10}/> ยังไม่ถึงปีการศึกษานี้</div>
                                                                    </div>
                                                                    <Lock size={14} className="text-slate-700 shrink-0"/>
                                                                </div>
                                                            );
                                                        }

                                                        if (assignedCourse) {
                                                            // filled slot — คลิกเพื่อ toggle สถานะ
                                                            const assignedRawStatus = courseStates[assignedCode];
                                                            // เช็ค prereq — ถ้า prereq ยังไม่ passed → locked ลงเรียนพร้อมกันไม่ได้
                                                            const assignedPrereq = allTrackCourses[assignedCode]?.prereq;
                                                            const prereqPassed = !assignedPrereq
                                                              || courseStates[assignedPrereq] === 'passed'
                                                              || Object.values(peAssignments).includes(assignedPrereq) && courseStates[assignedPrereq] === 'passed';
                                                            const assignedStatus = (!prereqPassed && assignedRawStatus === 'learning') ? 'locked' : assignedRawStatus;
                                                            const statusLabel = assignedStatus === 'passed' ? { text: 'ผ่านแล้ว', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
                                                                : assignedStatus === 'learning' ? { text: 'กำลังเรียน', cls: 'text-blue-400 bg-blue-500/10 border-blue-500/30' }
                                                                : assignedStatus === 'locked'   ? { text: '⚠ ลงไม่ได้ — ต้องผ่านวิชาก่อน', cls: 'text-red-400 bg-red-500/10 border-red-500/30' }
                                                                : { text: 'ยังไม่เริ่ม', cls: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
                                                            return (
                                                                <div key={course.id} className="group relative">
                                                                    <div
                                                                        onClick={() => handleCourseClick(assignedCode)}
                                                                        className={`p-3 rounded-xl border border-dashed transition-all flex items-center justify-between cursor-pointer ${assignedStatus === 'passed' ? 'bg-emerald-500/15 border-emerald-500/50' : assignedStatus === 'learning' ? 'bg-blue-500/15 border-blue-500/50' : assignedStatus === 'locked' ? 'bg-red-500/10 border-red-500/40 opacity-75' : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/15'}`}
                                                                    >
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1 mb-0.5">
                                                                                <GraduationCap size={10}/> PROFESSIONAL ELECTIVE · {course.id}
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                                <span className="text-[10px] font-mono px-1 rounded border border-purple-500/30 text-purple-300 shrink-0">{assignedCourse.code}</span>
                                                                                <span className="text-sm font-medium truncate text-purple-100">{assignedCourse.nameEn || assignedCourse.name}</span>
                                                                            </div>
                                                                            {/* สถานะ + คำใบ้ */}
                                                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusLabel.cls}`}>{statusLabel.text}</span>
                                                                                <span className="text-[10px] text-slate-600 italic">คลิกเพื่อเปลี่ยนสถานะ</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                                                            {assignedStatus === 'passed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : assignedStatus === 'learning' ? <PlayCircle size={16} className="text-blue-500"/> : assignedStatus === 'locked' ? <Lock size={16} className="text-red-400"/> : <div className="w-4 h-4 rounded-full border border-purple-500/30"/>}
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleRemovePeAssignment(course.id); }}
                                                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all"
                                                                            ><Trash2 size={14}/></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            // empty PE slot — clickable placeholder
                                                            return (
                                                                <button
                                                                    key={course.id}
                                                                    onClick={() => openPeModal(course.id)}
                                                                    className="w-full p-3 rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all flex items-center justify-between gap-2 group"
                                                                >
                                                                    <div className="text-left min-w-0">
                                                                        <div className="text-[10px] font-mono text-purple-500 mb-0.5">{course.id} · PROFESSIONAL ELECTIVE</div>
                                                                        <div className="text-xs text-slate-600 group-hover:text-purple-400 transition-colors">คลิกเพื่อเลือกวิชา...</div>
                                                                    </div>
                                                                    <Plus size={16} className="text-purple-500/50 group-hover:text-purple-400 shrink-0 transition-colors"/>
                                                                </button>
                                                            );
                                                        }
                                                    }

                                                    // ── Normal Course Card ──
                                                    return (
                                                        <div key={course.id} onClick={() => handleCourseClick(course.id)} className={`relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group select-none ${isLocked ? 'opacity-60 cursor-not-allowed border-red-500/20 bg-red-500/5' : status === 'passed' ? 'cursor-pointer bg-emerald-500/10 border-emerald-500/30' : status === 'learning' ? 'cursor-pointer bg-blue-500/10 border-blue-500/30' : 'cursor-pointer bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${isLocked ? 'border-red-500/30 text-red-400' : status === 'passed' ? 'border-emerald-500/30 text-emerald-400' : status === 'learning' ? 'border-blue-500/30 text-blue-400' : 'border-slate-600 text-slate-500'}`}>{course.code}</span>
                                                                    <h4 className={`text-sm font-medium truncate ${isLocked ? 'text-red-200/50' : status === 'passed' ? 'text-emerald-100' : status === 'learning' ? 'text-blue-100' : 'text-slate-400'}`}>{course.nameEn || course.name}</h4>
                                                                </div>
                                                                {isLocked && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/> Prerequisite: {course.prereq}</p>}
                                                            </div>
                                                            <div className="shrink-0">
                                                                {isLocked ? <Lock size={16} className="text-red-500/50"/> : status === 'passed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : status === 'learning' ? <PlayCircle size={16} className="text-blue-500"/> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Elective Courses */}
                                                {semesterElectives.map(electiveId => {
                                                    const elective = electiveCourses.find(e => e.id === electiveId);
                                                    if (!elective) return null;
                                                    const status = courseStates[elective.id];
                                                    return (
                                                        <div key={elective.id} className="group relative">
                                                            <div onClick={() => handleCourseClick(elective.id)} className={`p-3 rounded-xl border border-dashed transition-all flex items-center justify-between cursor-pointer ${status === 'passed' ? 'bg-emerald-500/20 border-emerald-500/50' : status === 'learning' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10'}`}>
                                                                <div className="min-w-0">
                                                                    <div className="text-[10px] font-mono text-orange-400">FREE ELECTIVE</div>
                                                                    <div className="text-sm font-medium truncate text-orange-100">{elective.nameEn || elective.name}</div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {status === 'passed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : status === 'learning' ? <PlayCircle size={16} className="text-blue-500"/> : <div className="w-4 h-4 rounded-full border border-orange-500/30"/>}
                                                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveElective(termKey, elective.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all"><Trash2 size={14}/></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Add Elective Button */}
                                                <button onClick={() => openElectiveModal(yearIdx, semIdx)} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-slate-500 hover:border-orange-500/50 hover:text-orange-400 transition-all flex items-center justify-center gap-1">
                                                    <Plus size={14}/> ADD ELECTIVE
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 w-full bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex center">
            <div className="max-w-7xl mx-auto flex justify-end">
                <button onClick={handleSubmit}
                    className="bg-white text-black hover:bg-orange-50 font-bold py-3 px-10 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 transition-transform hover:-translate-y-1 active:scale-95 text-lg">
                    Generate Dashboard <ChevronRight size={24}/>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SetupProfile;