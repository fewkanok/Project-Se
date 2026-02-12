// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera, Terminal, Pencil, Plus, Trash2 } from 'lucide-react';
// import { roadmapData } from '../data/courses';
// import { electiveCourses } from '../data/electiveCourses';

// const SetupProfile = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
  
//   // --- 1. Load Data ---
//   const getSavedData = () => {
//       try {
//           const saved = localStorage.getItem('userProfile');
//           return saved ? JSON.parse(saved) : null;
//       } catch (e) {
//           return null;
//       }
//   };

//   const savedData = getSavedData();
//   // 🐛 FIX: ใช้ useRef อย่างถูกต้อง
//   const hasExistingData = useRef(savedData?.courseStates && Object.keys(savedData.courseStates).length > 0);

//   // State: Basic Info
//   const [basicInfo, setBasicInfo] = useState(() => {
//     if (savedData) {
//         return {
//             name: savedData.basicInfo?.name || savedData.name || '',
//             studentId: savedData.basicInfo?.studentId || savedData.studentId || '',
//             currentYear: savedData.basicInfo?.currentYear || savedData.currentYear || 1,
//             currentTerm: savedData.basicInfo?.currentTerm || savedData.currentTerm || 1,
//             image: savedData.basicInfo?.image || savedData.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
//         };
//     }
//     const sessionData = localStorage.getItem('active_session');
//     const user = sessionData ? JSON.parse(sessionData) : {};
//     return {
//         name: user.name || '',
//         studentId: user.studentId || '',
//         currentYear: 1,
//         currentTerm: 1,
//         image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
//     };
//   });

//   // State: Course States
//   const [courseStates, setCourseStates] = useState(() => {
//     return savedData?.courseStates || {};
//   });

//   // State: วิชาเสรีในแต่ละเทอม
//   const [electivesBySemester, setElectivesBySemester] = useState(() => {
//     return savedData?.electivesBySemester || {};
//   });

//   // State: Modal
//   const [showElectiveModal, setShowElectiveModal] = useState(false);
//   const [selectedSemester, setSelectedSemester] = useState(null);
//   const [electiveSearchTerm, setElectiveSearchTerm] = useState('');

//   // State: GPA
//   const [gpaHistory, setGpaHistory] = useState(() => {
//     return savedData?.gpaHistory || {};
//   });

//   const [totalCredits, setTotalCredits] = useState(0);

//   // --- 2. Auto-Select Logic ---
//   useEffect(() => {
//     // 🐛 FIX: ใช้ .current
//     if (hasExistingData.current) {
//         return;
//     }

//     let newStates = { ...courseStates }; 
//     let hasChanges = false;

//     roadmapData.forEach((yearGroup, yearIdx) => {
//         const thisYear = yearIdx + 1;
//         yearGroup.semesters.forEach((sem, semIdx) => {
//             const thisTerm = semIdx + 1;
            
//             const isPast = (thisYear < basicInfo.currentYear) || 
//                            (thisYear === basicInfo.currentYear && thisTerm < basicInfo.currentTerm);
//             const isCurrent = (thisYear === basicInfo.currentYear && thisTerm === basicInfo.currentTerm);

//             sem.courses.forEach(course => {
//                 const currentStatus = newStates[course.id];

//                 if (currentStatus === 'learning' && isPast) {
//                     newStates[course.id] = 'passed';
//                     hasChanges = true;
//                 }

//                 if (!currentStatus) {
//                     const prereqId = course.prereq;
//                     const isPrereqMet = !prereqId || (prereqId && newStates[prereqId] === 'passed');

//                     if (isPrereqMet) {
//                         if (isPast) {
//                             newStates[course.id] = 'passed';
//                             hasChanges = true;
//                         } else if (isCurrent) {
//                             newStates[course.id] = 'learning';
//                             hasChanges = true;
//                         }
//                     }
//                 }
//             });
//         });
//     });

//     if (hasChanges) {
//         setCourseStates(newStates);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);


//   // --- 3. Calculate Credits ---
//   useEffect(() => {
//     let credits = 0;
    
//     // วิชาแกน
//     roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
//         if (courseStates[c.id] === 'passed') credits += c.credits;
//     })));
    
//     // 🐛 FIX: เช็คว่า electivesBySemester เป็น object ก่อน
//     if (electivesBySemester && typeof electivesBySemester === 'object') {
//         Object.values(electivesBySemester).forEach(electives => {
//             if (Array.isArray(electives)) {
//                 electives.forEach(electiveId => {
//                     const elective = electiveCourses.find(e => e.id === electiveId);
//                     if (elective && courseStates[electiveId] === 'passed') {
//                         credits += elective.credits;
//                     }
//                 });
//             }
//         });
//     }
    
//     setTotalCredits(credits);
//   }, [courseStates, electivesBySemester]);


//   // --- Helper Functions ---
//   const getDependentCourses = (parentId) => {
//       let dependents = [];
      
//       // เช็ควิชาแกน
//       roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
//           if (c.prereq === parentId) {
//               dependents.push(c.id);
//               dependents = [...dependents, ...getDependentCourses(c.id)];
//           }
//       })));
      
//       // 🐛 FIX: เช็ควิชาเสรีด้วย (ถ้ามี prereq)
//       electiveCourses.forEach(elective => {
//           if (elective.prereq === parentId && courseStates[elective.id]) {
//               dependents.push(elective.id);
//               dependents = [...dependents, ...getDependentCourses(elective.id)];
//           }
//       });
      
//       return dependents;
//   };

//   const findCourseById = (id) => {
//       let found = null;
//       roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
//           if (c.id === id) found = c;
//       })));
//       return found;
//   };

//   // --- Click Handlers ---
//   const handleCourseClick = (courseId) => {
//       const currentState = courseStates[courseId];
//       const courseObj = findCourseById(courseId) || electiveCourses.find(e => e.id === courseId);
      
//       let nextState = '';
//       if (!currentState) nextState = 'learning'; 
//       else if (currentState === 'learning') nextState = 'passed';
//       else if (currentState === 'passed') nextState = undefined; 

//       if (nextState === 'passed' || nextState === 'learning') {
//           if (courseObj?.prereq) {
//               const prereqState = courseStates[courseObj.prereq];
//               if (prereqState !== 'passed') {
//                   const prereqCourse = findCourseById(courseObj.prereq) || electiveCourses.find(e => e.id === courseObj.prereq);
//                   alert(`Cannot select this course! You must pass "${prereqCourse?.name || courseObj.prereq}" first.`);
//                   return;
//               }
//           }
//       }

//       setCourseStates(prev => {
//           const updated = { ...prev };
//           if (nextState) {
//               updated[courseId] = nextState;
//           } else {
//               delete updated[courseId];
//               const children = getDependentCourses(courseId);
//               children.forEach(childId => delete updated[childId]);
//           }
//           return updated;
//       });
//   };

//   // เปิด Modal
//   const handleAddElective = (yearIdx, semIdx) => {
//     setSelectedSemester({ yearIdx, semIdx });
//     setShowElectiveModal(true);
//     setElectiveSearchTerm(''); // 🐛 FIX: รีเซ็ตค่าค้นหาทุกครั้ง
//   };

//   // เลือกวิชาเสรี
//   const handleSelectElective = (electiveId) => {
//     const semesterKey = `Y${selectedSemester.yearIdx + 1}/T${selectedSemester.semIdx + 1}`;
    
//     // 🐛 FIX: เช็คว่าถูกเลือกไปแล้วหรือยัง
//     const alreadySelected = Object.values(electivesBySemester || {}).some(electives => 
//         Array.isArray(electives) && electives.includes(electiveId)
//     );
    
//     if (alreadySelected) {
//         alert('วิชานี้ถูกเลือกไปแล้วในเทอมอื่น!');
//         return;
//     }
    
//     setElectivesBySemester(prev => ({
//         ...prev,
//         [semesterKey]: [...(prev[semesterKey] || []), electiveId]
//     }));
    
//     setCourseStates(prev => ({
//         ...prev,
//         [electiveId]: 'learning'
//     }));
    
//     setShowElectiveModal(false);
//     setElectiveSearchTerm('');
//   };

//   // ลบวิชาเสรี
//   const handleRemoveElective = (semesterKey, electiveId) => {
//     // 🐛 FIX: ลบวิชา child ที่ depend ด้วย
//     const children = getDependentCourses(electiveId);
    
//     setElectivesBySemester(prev => ({
//         ...prev,
//         [semesterKey]: (prev[semesterKey] || []).filter(id => id !== electiveId)
//     }));
    
//     setCourseStates(prev => {
//         const updated = { ...prev };
//         delete updated[electiveId];
//         // ลบ children ด้วย
//         children.forEach(childId => delete updated[childId]);
//         return updated;
//     });
//   };

//   const handleInfoChange = (e) => {
//     const { name, value } = e.target;
//     setBasicInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 1024 * 1024) {
//         alert("File size too large! Please use image under 1MB.");
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBasicInfo(prev => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = () => {
//     if (!basicInfo.name || !basicInfo.studentId) {
//         alert("Please enter your Name and Student ID.");
//         return;
//     }
    
//     // 🐛 FIX: filter เฉพาะวิชาที่มี state
//     const selectedElectiveDetails = electiveCourses.filter(elective => 
//         courseStates[elective.id] !== undefined
//     );

//     const userPayload = { 
//         basicInfo,
//         ...basicInfo,
//         gpaHistory,
//         passedCourses: Object.keys(courseStates).filter(id => courseStates[id] === 'passed'), 
//         learningCourses: Object.keys(courseStates).filter(id => courseStates[id] === 'learning'),
//         courseStates,
//         electivesBySemester,
//         selectedElectives: selectedElectiveDetails, 
//         totalCredits, 
//         lastUpdated: new Date().toISOString() 
//     };
    
//     localStorage.setItem('userProfile', JSON.stringify(userPayload));
//     navigate('/dashboard');
//   };

//   // 🐛 FIX: ฟังก์ชันกรองวิชาเสรีที่ปรับปรุงแล้ว
//   const getFilteredElectives = () => {
//     return electiveCourses.filter(elective => {
//         const searchLower = electiveSearchTerm.toLowerCase().trim();
//         const matchesSearch = !searchLower || 
//             elective.name.toLowerCase().includes(searchLower) || 
//             elective.code.toLowerCase().includes(searchLower);
        
//         return matchesSearch;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 overflow-x-hidden selection:bg-orange-500/30">
      
//       {/* Background */}
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

//       {/* Modal เลือกวิชาเสรี */}
//       {showElectiveModal && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
//           <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-white/20 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl shadow-orange-500/20">
            
//             {/* Header */}
//             <div className="p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-transparent to-purple-500/10">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-2xl font-black text-white flex items-center gap-2">
//                     <Plus className="text-orange-500" size={28}/>
//                     เลือกวิชาเสรี
//                   </h3>
//                   <p className="text-slate-400 text-sm mt-1">
//                     {selectedSemester && `Year ${selectedSemester.yearIdx + 1} / Term ${selectedSemester.semIdx + 1}`}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setShowElectiveModal(false);
//                     setElectiveSearchTerm('');
//                   }} 
//                   className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
//                 >
//                   <XCircle size={28}/>
//                 </button>
//               </div>
              
//               {/* Search Bar */}
//               <div className="relative">
//                 <input 
//                   type="text"
//                   placeholder="ค้นหาวิชา... (ชื่อวิชา หรือ รหัสวิชา)"
//                   value={electiveSearchTerm}
//                   onChange={(e) => setElectiveSearchTerm(e.target.value)}
//                   className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-4 pr-10 text-white placeholder-slate-500 focus:border-orange-500 outline-none transition-all"
//                 />
//                 <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
//               </div>
//             </div>
            
//             {/* Course Grid */}
//             <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {getFilteredElectives().map(elective => {
//                     // 🐛 FIX: เช็คว่าถูกเลือกไปแล้วหรือยัง (รวม undefined check)
//                     const alreadySelected = Object.values(electivesBySemester || {}).some(electives => 
//                       Array.isArray(electives) && electives.includes(elective.id)
//                     );
                    
//                     return (
//                       <button
//                         key={elective.id}
//                         onClick={() => !alreadySelected && handleSelectElective(elective.id)}
//                         disabled={alreadySelected}
//                         className={`group relative p-4 rounded-xl border text-left transition-all transform ${
//                           alreadySelected 
//                             ? 'bg-emerald-500/5 border-emerald-500/30 opacity-60 cursor-not-allowed' 
//                             : 'bg-white/5 border-white/10 hover:bg-orange-500/10 hover:border-orange-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
//                         }`}
//                       >
//                         {/* Badge ด้านบน */}
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-2">
//                             <span className={`text-[11px] font-mono px-2 py-1 rounded-lg border font-bold ${
//                               alreadySelected 
//                                 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
//                                 : 'border-orange-500/40 text-orange-400 bg-orange-500/10 group-hover:bg-orange-500/20'
//                             }`}>
//                               {elective.code}
//                             </span>
//                             <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
//                               {elective.credits} หน่วยกิต
//                             </span>
//                           </div>
//                           {alreadySelected && (
//                             <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
//                               <CheckCircle2 size={16} />
//                               <span>เลือกแล้ว</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* ชื่อวิชา */}
//                         <h4 className={`text-sm font-bold leading-tight ${
//                           alreadySelected ? 'text-slate-400' : 'text-white group-hover:text-orange-300'
//                         }`}>
//                           {elective.name}
//                         </h4>
                        
//                         {/* Hover Effect */}
//                         {!alreadySelected && (
//                           <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-purple-500/0 group-hover:from-orange-500/5 group-hover:to-purple-500/5 pointer-events-none transition-all"></div>
//                         )}
//                       </button>
//                     );
//                   })}
//               </div>
              
//               {/* No Results */}
//               {getFilteredElectives().length === 0 && (
//                 <div className="text-center py-12">
//                   <AlertCircle className="mx-auto mb-3 text-slate-600" size={48}/>
//                   <p className="text-slate-500 text-sm">ไม่พบวิชาที่ค้นหา</p>
//                 </div>
//               )}
//             </div>
            
//             {/* Footer Summary */}
//             <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
//               <div className="text-sm text-slate-400">
//                 <span className="font-bold text-white">{electiveCourses.length}</span> วิชาเสรีทั้งหมด
//               </div>
//               <div className="text-xs text-slate-500">
//                 คลิกเพื่อเลือกวิชาที่ต้องการ
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto p-6 relative z-10">
        
//         {/* Header */}
//         <div className="mt-8 mb-10 flex flex-col items-center justify-center text-center">
//             <div className="flex items-center gap-3 mb-2">
//                 <Terminal className="text-orange-500" size={32}/>
//                 <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
//                     CS SURVIVOR
//                 </h1>
//             </div>
//             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Profile Setup & Course Planning</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
//             {/* --- LEFT SIDEBAR --- */}
//             <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-8">
                
//                 {/* 1. Identity & Photo */}
//                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden">
//                     <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400"><User size={20}/> Survivor Info</h2>
                    
//                     <div className="flex flex-col items-center mb-6">
//                         <div 
//                             className="relative w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer group hover:border-orange-500 transition-all bg-white/5"
//                             onClick={() => fileInputRef.current?.click()}
//                         >
//                             <img src={basicInfo.image} alt="Profile" className="w-full h-full object-cover p-1 rounded-full" />
//                             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
//                                 <Camera size={24} className="text-white mb-1"/>
//                                 <span className="text-[10px] text-white font-bold">Change</span>
//                             </div>
//                         </div>
//                         <input 
//                             type="file" 
//                             ref={fileInputRef} 
//                             onChange={handleImageUpload} 
//                             className="hidden" 
//                             accept="image/png, image/jpeg, image/jpg"
//                         />
//                         <p className="text-xs text-slate-500 mt-2">Click image to upload (Max 1MB)</p>
//                     </div>

//                     <div className="space-y-4">
//                         <div className="space-y-1">
//                             <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Full Name</label>
//                             <div className="relative group">
//                                 <input 
//                                     name="name" 
//                                     value={basicInfo.name} 
//                                     onChange={handleInfoChange} 
//                                     placeholder="Full Name (English)" 
//                                     className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-orange-500 outline-none transition-colors group-hover:border-white/30" 
//                                 />
//                                 <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-400 transition-colors pointer-events-none" size={16} />
//                             </div>
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Student ID</label>
//                             <div className="relative group">
//                                 <input 
//                                     name="studentId" 
//                                     value={basicInfo.studentId} 
//                                     onChange={handleInfoChange} 
//                                     placeholder="Student ID (e.g. 660xxxx)" 
//                                     className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-purple-500 outline-none transition-colors group-hover:border-white/30" 
//                                 />
//                                 <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-purple-400 transition-colors pointer-events-none" size={16} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 2. Current Timeline */}
//                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
//                     <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><Calendar size={20}/> Current Timeline</h2>
                    
//                     <div className="space-y-4">
//                          <div>
//                             <div className="grid grid-cols-4 gap-2">
//                                 {[1,2,3,4].map(y => (
//                                     <button key={y} 
//                                         onClick={() => setBasicInfo(prev => ({...prev, currentYear: y, currentTerm: 1}))}
//                                         className={`py-2 rounded-lg font-bold transition-all border ${
//                                             basicInfo.currentYear === y 
//                                             ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30' 
//                                             : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
//                                         }`}>
//                                         Y{y}
//                                     </button>
//                                 ))}
//                             </div>
//                          </div>
                         
//                          <div>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {[1,2].map(t => (
//                                     <button key={t} 
//                                         onClick={() => setBasicInfo(prev => ({...prev, currentTerm: t}))}
//                                         className={`py-2 rounded-lg font-bold transition-all border ${
//                                             basicInfo.currentTerm === t 
//                                             ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' 
//                                             : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
//                                         }`}>
//                                         Term {t}
//                                     </button>
//                                 ))}
//                             </div>
//                          </div>
//                     </div>
//                 </div>

//                 {/* 3. GPA */}
//                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
//                     <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> Previous GPA</h2>
//                     <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
//                         {roadmapData.map((yearGroup, yearIdx) => 
//                             yearGroup.semesters.map((sem, semIdx) => {
//                                 const isPast = (yearIdx + 1 < basicInfo.currentYear) || 
//                                                (yearIdx + 1 === basicInfo.currentYear && semIdx + 1 < basicInfo.currentTerm);
                                
//                                 const uniqueTermKey = `Y${yearIdx + 1}/${semIdx + 1}`;

//                                 if (isPast) {
//                                      return (
//                                        <div key={uniqueTermKey} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
//                                             <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
//                                                 {uniqueTermKey} GPA
//                                             </span>
//                                             <input 
//                                                 type="number" step="0.01" min="0" max="4" placeholder="0.00"
//                                                 value={gpaHistory[uniqueTermKey] || ''} 
//                                                 onChange={(e) => {
//                                                     let val = e.target.value;
//                                                     if (val === '') {
//                                                         setGpaHistory(prev => ({ ...prev, [uniqueTermKey]: '' }));
//                                                         return;
//                                                     }
//                                                     const numVal = parseFloat(val);
//                                                     if (numVal > 4) val = 4;
//                                                     if (numVal < 0) val = 0;
//                                                     setGpaHistory(prev => ({ ...prev, [uniqueTermKey]: val }));
//                                                 }}
//                                                 className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors" 
//                                             />
//                                        </div>
//                                      )
//                                 }
//                                 return null;
//                             })
//                         )}
//                         {basicInfo.currentYear === 1 && basicInfo.currentTerm === 1 && (
//                             <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-white/10 rounded-xl">No grades to enter yet</div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* --- RIGHT CONTENT --- */}
//             <div className="lg:col-span-8 space-y-8">
//                 {/* Banner */}
//                 <div className="bg-gradient-to-r from-slate-900 via-[#0a0a0a] to-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-xl gap-4 sticky top-8 z-40 backdrop-blur-xl">
//                     <div>
//                         <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="text-pink-500"/> Mission Status</h2>
//                         <div className="flex flex-wrap gap-4 mt-2 text-xs">
//                             <span className="flex items-center gap-1 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-400/30"><CheckCircle2 size={12}/> Passed</span>
//                             <span className="flex items-center gap-1 text-blue-300 bg-blue-500/20 px-2 py-1 rounded border border-blue-400/30"><PlayCircle size={12}/> Learning</span>
//                             <span className="flex items-center gap-1 text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10"><XCircle size={12}/> Not Started</span>
//                         </div>
//                     </div>
//                     <div className="text-right bg-white/5 p-3 rounded-xl border border-white/5 min-w-[120px]">
//                         <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Credits Collected</span>
//                         <span className="text-3xl font-mono font-black text-orange-400">{totalCredits}</span>
//                     </div>
//                 </div>

//                 {/* Courses */}
//                 {roadmapData.map((yearGroup, yearIdx) => {
//                     const isYearCurrent = basicInfo.currentYear === yearGroup.year;
                    
//                     return (
//                         <div key={yearIdx} className="relative">
                            
//                             <div className="flex items-center gap-3 mb-4">
//                                 <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg transition-all ${
//                                     isYearCurrent 
//                                     ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/20' 
//                                     : 'bg-white/10 backdrop-blur text-slate-300 border-white/10'
//                                 }`}>
//                                     Year {yearGroup.year}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {yearGroup.semesters.map((sem, semIdx) => {
//                                     const isTermCurrent = isYearCurrent && basicInfo.currentTerm === (semIdx + 1);
//                                     const semesterKey = `Y${yearIdx + 1}/T${semIdx + 1}`;
//                                     const semesterElectives = electivesBySemester[semesterKey] || [];

//                                     return (
//                                         <div key={semIdx} className={`rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 border ${isTermCurrent ? 'bg-white/[0.07] border-white/20 ring-1 ring-white/10' : 'bg-white/5 border-white/5'}`}>
//                                             <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className={`text-xs font-bold uppercase tracking-widest ${isTermCurrent ? 'text-white' : 'text-slate-400'}`}>{sem.term}</span>
//                                                     {isTermCurrent && <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded-full">Current</span>}
//                                                 </div>
                                                
//                                                 {/* ปุ่มเพิ่มวิชาเสรี */}
//                                                 <button 
//                                                     onClick={() => handleAddElective(yearIdx, semIdx)}
//                                                     className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all text-xs font-bold"
//                                                 >
//                                                     <Plus size={12}/> วิชาเสรี
//                                                 </button>
//                                             </div>

//                                             <div className="space-y-2.5">
//                                                 {/* วิชาแกน */}
//                                                 {sem.courses.map(course => {
//                                                     const status = courseStates[course.id];
//                                                     const prereqState = course.prereq ? courseStates[course.prereq] : 'passed';
//                                                     const isLocked = course.prereq && prereqState !== 'passed'; 

//                                                     return (
//                                                         <div key={course.id} onClick={() => !isLocked && handleCourseClick(course.id)} className={`relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group select-none ${isLocked ? 'opacity-60 cursor-not-allowed border-red-500/30 bg-red-500/5' : status === 'passed' ? 'cursor-pointer bg-emerald-500/20 border-emerald-400/40' : status === 'learning' ? 'cursor-pointer bg-blue-500/20 border-blue-400/40' : 'cursor-pointer bg-white/5 border-white/5 hover:bg-white/10'}`}>
//                                                             <div className="flex-1 min-w-0">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${isLocked ? 'border-red-400/40 text-red-300' : status === 'passed' ? 'border-emerald-400/40 text-emerald-300' : status === 'learning' ? 'border-blue-400/40 text-blue-300' : 'border-slate-600 text-slate-500'}`}>{course.code}</span>
//                                                                     <h4 className={`text-sm font-medium truncate ${isLocked ? 'text-red-200/50' : status === 'passed' ? 'text-emerald-50' : status === 'learning' ? 'text-blue-50' : 'text-slate-400'}`}>{course.name}</h4>
//                                                                 </div>
//                                                                 <div className="flex items-center gap-2 mt-1">
//                                                                     {isLocked && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={10}/> Prerequisite: {course.prereq}</p>}
//                                                                     <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isLocked ? 'bg-red-500/10 text-red-400' : status === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : status === 'learning' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700/50 text-slate-400'}`}>
//                                                                         {course.credits} หน่วยกิต
//                                                                     </span>
//                                                                 </div>
//                                                             </div>
//                                                             <div className="shrink-0">
//                                                                 {isLocked ? <Lock size={16} className="text-red-400/70"/> : status === 'passed' ? <CheckCircle2 size={16} className="text-emerald-400"/> : status === 'learning' ? <PlayCircle size={16} className="text-blue-400"/> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 })}
                                                
//                                                 {/* วิชาเสรี */}
//                                                 {semesterElectives.map(electiveId => {
//                                                     const elective = electiveCourses.find(e => e.id === electiveId);
//                                                     if (!elective) return null; // 🐛 FIX: ป้องกันกรณีหาไม่เจอ
                                                    
//                                                     const status = courseStates[electiveId];
                                                    
//                                                     return (
//                                                         <div key={electiveId} className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-3 group select-none ${status === 'passed' ? 'cursor-pointer bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-purple-400/60 shadow-lg shadow-purple-500/10' : status === 'learning' ? 'cursor-pointer bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-purple-500/15 border-purple-400/50 shadow-md shadow-purple-500/10' : 'cursor-pointer bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 border-purple-400/30 hover:border-purple-400/50'}`}>
//                                                             <div className="flex-1 min-w-0" onClick={() => handleCourseClick(electiveId)}>
//                                                                 <div className="flex items-center gap-2 mb-1.5">
//                                                                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black tracking-wider shadow-sm">
//                                                                         ✨ ELECTIVE
//                                                                     </span>
//                                                                     <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${status === 'passed' ? 'bg-purple-500/30 text-purple-200' : status === 'learning' ? 'bg-purple-500/25 text-purple-200' : 'bg-purple-500/20 text-purple-300'}`}>
//                                                                         {elective.credits} หน่วยกิต
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="flex items-center gap-2">
//                                                                     <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${status === 'passed' ? 'border-purple-300/50 text-purple-200 bg-purple-500/10' : status === 'learning' ? 'border-purple-300/40 text-purple-200 bg-purple-500/10' : 'border-purple-400/30 text-purple-300'}`}>{elective.code}</span>
//                                                                     <h4 className={`text-sm font-bold truncate ${status === 'passed' ? 'text-purple-50' : status === 'learning' ? 'text-purple-50' : 'text-purple-200'}`}>{elective.name}</h4>
//                                                                 </div>
//                                                             </div>
//                                                             <div className="flex items-center gap-2 shrink-0">
//                                                                 {status === 'passed' ? <CheckCircle2 size={18} className="text-purple-300"/> : status === 'learning' ? <PlayCircle size={18} className="text-purple-300"/> : <div className="w-4 h-4 rounded-full border-2 border-purple-400"></div>}
                                                                
//                                                                 <button 
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         handleRemoveElective(semesterKey, electiveId);
//                                                                     }}
//                                                                     className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/30 rounded-lg border border-transparent hover:border-red-400/50"
//                                                                     title="ลบวิชาเสรี"
//                                                                 >
//                                                                     <Trash2 size={14} className="text-red-300"/>
//                                                                 </button>
//                                                             </div>
                                                            
//                                                             {/* Sparkle effect */}
//                                                             <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 via-pink-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-pink-400/5 group-hover:to-purple-400/5 pointer-events-none transition-all"></div>
//                                                         </div>
//                                                     )
//                                                 })}
//                                             </div>
//                                         </div>
//                                     )
//                                 })}
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>

//         {/* Footer */}
//         <div className="fixed bottom-0 left-0 w-full bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 p-4 z-50">
//             <div className="max-w-7xl mx-auto flex justify-end">
//                 <button onClick={handleSubmit}
//                     className="bg-white text-black hover:bg-orange-50 font-bold py-3 px-10 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 transition-transform hover:-translate-y-1 active:scale-95 text-lg">
//                     Generate Dashboard <ChevronRight size={24}/>
//                 </button>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default SetupProfile;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, CheckCircle2, XCircle, ChevronRight, Calendar, Lock, AlertCircle, PlayCircle, Camera, Terminal, Pencil, Plus, Trash2, Search } from 'lucide-react';
import { roadmapData } from '../data/courses';
// ✅ แก้ไข 1: Import ให้ตรงกับชื่อไฟล์จริง
import { electiveCourses } from '../data/electiveCourses';

const SetupProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- 1. Load Data ---
  const getSavedData = () => {
      try {
          const saved = localStorage.getItem('userProfile');
          return saved ? JSON.parse(saved) : null;
      } catch (e) {
          return null;
      }
  };

  const savedData = getSavedData();
  const hasExistingData = useRef(savedData?.courseStates && Object.keys(savedData.courseStates).length > 0);

  // State: Basic Info
  const [basicInfo, setBasicInfo] = useState(() => {
    if (savedData) {
        return {
            name: savedData.basicInfo?.name || savedData.name || '',
            studentId: savedData.basicInfo?.studentId || savedData.studentId || '',
            currentYear: savedData.basicInfo?.currentYear || savedData.currentYear || 1,
            currentTerm: savedData.basicInfo?.currentTerm || savedData.currentTerm || 1,
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
  });

  // State: Course States
  const [courseStates, setCourseStates] = useState(() => {
    return savedData?.courseStates || {};
  });

  // ✅ แก้ไข 2: ใช้ชื่อ state เป็น customElectives เพื่อให้ตรงกับ Dashboard
  const [customElectives, setCustomElectives] = useState(() => {
    return savedData?.customElectives || {};
  });

  // State: Modal
  const [showElectiveModal, setShowElectiveModal] = useState(false);
  const [activeTermKey, setActiveTermKey] = useState(null); // เก็บ key เช่น "1-1"
  const [electiveSearchTerm, setElectiveSearchTerm] = useState('');

  // State: GPA
  const [gpaHistory, setGpaHistory] = useState(() => {
    return savedData?.gpaHistory || {};
  });

  const [totalCredits, setTotalCredits] = useState(0);

  // --- 2. Auto-Select Logic ---
  useEffect(() => {
    if (hasExistingData.current) {
        return;
    }

    let newStates = { ...courseStates }; 
    let hasChanges = false;

    roadmapData.forEach((yearGroup, yearIdx) => {
        const thisYear = yearIdx + 1;
        yearGroup.semesters.forEach((sem, semIdx) => {
            const thisTerm = semIdx + 1;
            
            const isPast = (thisYear < basicInfo.currentYear) || 
                           (thisYear === basicInfo.currentYear && thisTerm < basicInfo.currentTerm);
            const isCurrent = (thisYear === basicInfo.currentYear && thisTerm === basicInfo.currentTerm);

            sem.courses.forEach(course => {
                const currentStatus = newStates[course.id];

                if (currentStatus === 'learning' && isPast) {
                    newStates[course.id] = 'passed';
                    hasChanges = true;
                }

                if (!currentStatus) {
                    const prereqId = course.prereq;
                    const isPrereqMet = !prereqId || (prereqId && newStates[prereqId] === 'passed');

                    if (isPrereqMet) {
                        if (isPast) {
                            newStates[course.id] = 'passed';
                            hasChanges = true;
                        } else if (isCurrent) {
                            newStates[course.id] = 'learning';
                            hasChanges = true;
                        }
                    }
                }
            });
        });
    });

    if (hasChanges) {
        setCourseStates(newStates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- 3. Calculate Credits ---
  useEffect(() => {
    let credits = 0;
    
    // วิชาแกน
    roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
        if (courseStates[c.id] === 'passed') credits += c.credits;
    })));
    
    // วิชาเสรี
    Object.values(customElectives).forEach(electives => {
        if (Array.isArray(electives)) {
            electives.forEach(electiveId => {
                const elective = electiveCourses.find(e => e.id === electiveId);
                // เช็คว่าวิชาเสรีนี้สถานะเป็น passed หรือไม่
                if (elective && courseStates[electiveId] === 'passed') {
                    credits += elective.credits;
                }
            });
        }
    });
    
    setTotalCredits(credits);
  }, [courseStates, customElectives]);


  // --- Helper Functions ---
  const getDependentCourses = (parentId) => {
      let dependents = [];
      
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
  };

  const findCourseById = (id) => {
      let found = null;
      roadmapData.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => {
          if (c.id === id) found = c;
      })));
      return found;
  };

  // --- Click Handlers ---
  const handleCourseClick = (courseId) => {
      const currentState = courseStates[courseId];
      const courseObj = findCourseById(courseId) || electiveCourses.find(e => e.id === courseId);
      
      let nextState = '';
      if (!currentState) nextState = 'learning'; 
      else if (currentState === 'learning') nextState = 'passed';
      else if (currentState === 'passed') nextState = undefined; 

      if (nextState === 'passed' || nextState === 'learning') {
          if (courseObj?.prereq) {
              const prereqState = courseStates[courseObj.prereq];
              if (prereqState !== 'passed') {
                  const prereqCourse = findCourseById(courseObj.prereq) || electiveCourses.find(e => e.id === courseObj.prereq);
                  alert(`Cannot select this course! You must pass "${prereqCourse?.name || courseObj.prereq}" first.`);
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
  };

  // เปิด Modal
  const openElectiveModal = (yearIdx, semIdx) => {
    // ✅ แก้ไข 3: สร้าง Key เป็นตัวเลข "1-1" เพื่อให้ตรงกับ Dashboard
    const termKey = `${yearIdx + 1}-${semIdx + 1}`;
    setActiveTermKey(termKey);
    setShowElectiveModal(true);
    setElectiveSearchTerm('');
  };

  // เลือกวิชาเสรี
  const handleSelectElective = (electiveId) => {
    // เช็คว่าถูกเลือกไปแล้วหรือยัง (ในเทอมไหนก็ตาม)
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
    
    // ตั้งค่าเริ่มต้นเป็น learning ทันทีที่เลือก
    setCourseStates(prev => ({
        ...prev,
        [electiveId]: 'learning'
    }));
    
    setShowElectiveModal(false);
    setElectiveSearchTerm('');
  };

  // ลบวิชาเสรี
  const handleRemoveElective = (termKey, electiveId) => {
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
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size too large! Please use image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicInfo(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!basicInfo.name || !basicInfo.studentId) {
        alert("Please enter your Name and Student ID.");
        return;
    }
    
    const userPayload = { 
        basicInfo,
        ...basicInfo,
        gpaHistory,
        passedCourses: Object.keys(courseStates).filter(id => courseStates[id] === 'passed'), 
        learningCourses: Object.keys(courseStates).filter(id => courseStates[id] === 'learning'),
        courseStates,
        customElectives, // ✅ ส่ง customElectives ไป Dashboard
        totalCredits, 
        lastUpdated: new Date().toISOString() 
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userPayload));
    navigate('/dashboard');
  };

  // ฟังก์ชันกรองวิชาเสรี
  const getFilteredElectives = () => {
    return electiveCourses.filter(elective => {
        const searchLower = electiveSearchTerm.toLowerCase().trim();
        const matchesSearch = !searchLower || 
            elective.name.toLowerCase().includes(searchLower) || 
            elective.code.toLowerCase().includes(searchLower);
        
        return matchesSearch;
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 overflow-x-hidden selection:bg-orange-500/30">
      
      {/* Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Modal เลือกวิชาเสรี */}
      {showElectiveModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-white/20 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl shadow-orange-500/20">
            
            {/* Header */}
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
              
              {/* Search Bar */}
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
            
            {/* Course Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getFilteredElectives().map(elective => {
                    // เช็คว่าถูกเลือกไปแล้วหรือยัง
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
                          {elective.name}
                        </h4>
                        
                        {!alreadySelected && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-purple-500/0 group-hover:from-orange-500/5 group-hover:to-purple-500/5 pointer-events-none transition-all"></div>
                        )}
                      </button>
                    );
                  })}
              </div>
              
              {/* No Results */}
              {getFilteredElectives().length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-3 text-slate-600" size={48}/>
                  <p className="text-slate-500 text-sm">ไม่พบวิชาที่ค้นหา</p>
                </div>
              )}
            </div>
            
            {/* Footer Summary */}
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
                
                {/* 1. Identity & Photo */}
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
                            accept="image/png, image/jpeg, image/jpg"
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

                {/* 2. Current Timeline */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><Calendar size={20}/> Current Timeline</h2>
                    
                    <div className="space-y-4">
                         <div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1,2,3,4].map(y => (
                                    <button key={y} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentYear: y, currentTerm: 1}))}
                                        className={`py-2 rounded-lg font-bold transition-all border ${
                                            basicInfo.currentYear === y 
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30' 
                                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                        }`}>
                                        Y{y}
                                    </button>
                                ))}
                            </div>
                         </div>
                         
                         <div>
                            <div className="grid grid-cols-2 gap-2">
                                {[1,2].map(t => (
                                    <button key={t} 
                                        onClick={() => setBasicInfo(prev => ({...prev, currentTerm: t}))}
                                        className={`py-2 rounded-lg font-bold transition-all border ${
                                            basicInfo.currentTerm === t 
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                        }`}>
                                        Term {t}
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>

                {/* 3. GPA */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><GraduationCap size={20}/> Previous GPA</h2>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {roadmapData.map((yearGroup, yearIdx) => 
                            yearGroup.semesters.map((sem, semIdx) => {
                                const isPast = (yearIdx + 1 < basicInfo.currentYear) || 
                                               (yearIdx + 1 === basicInfo.currentYear && semIdx + 1 < basicInfo.currentTerm);
                                
                                const uniqueTermKey = `Y${yearIdx + 1}/${semIdx + 1}`;

                                if (isPast) {
                                     return (
                                       <div key={uniqueTermKey} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                                            <span className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
                                                {uniqueTermKey} GPA
                                            </span>
                                            <input 
                                                type="number" step="0.01" min="0" max="4" placeholder="0.00"
                                                value={gpaHistory[uniqueTermKey] || ''} 
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (val === '') {
                                                        setGpaHistory(prev => ({ ...prev, [uniqueTermKey]: '' }));
                                                        return;
                                                    }
                                                    const numVal = parseFloat(val);
                                                    if (numVal > 4) val = 4;
                                                    if (numVal < 0) val = 0;
                                                    setGpaHistory(prev => ({ ...prev, [uniqueTermKey]: val }));
                                                }}
                                                className="w-20 bg-transparent text-right text-emerald-400 font-bold outline-none placeholder-slate-600 border-b border-white/10 focus:border-emerald-500 transition-colors" 
                                            />
                                       </div>
                                     )
                                }
                                return null;
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
                        <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Credits Collected</span>
                        <span className="text-3xl font-mono font-black text-orange-400">{totalCredits}</span>
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
                                    Year {yearGroup.year}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearGroup.semesters.map((sem, semIdx) => {
                                    const isTermCurrent = isYearCurrent && basicInfo.currentTerm === (semIdx + 1);
                                    
                                    // ✅ แก้ไข 4: ใช้ termKey เป็น "1-1" เพื่อดึงวิชาเสรี
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
                                                    const status = courseStates[course.id];
                                                    const prereqState = course.prereq ? courseStates[course.prereq] : 'passed';
                                                    const isLocked = course.prereq && prereqState !== 'passed'; 

                                                    return (
                                                        <div key={course.id} onClick={() => handleCourseClick(course.id)} className={`relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group select-none ${isLocked ? 'opacity-60 cursor-not-allowed border-red-500/20 bg-red-500/5' : status === 'passed' ? 'cursor-pointer bg-emerald-500/10 border-emerald-500/30' : status === 'learning' ? 'cursor-pointer bg-blue-500/10 border-blue-500/30' : 'cursor-pointer bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-mono px-1.5 rounded border shrink-0 ${isLocked ? 'border-red-500/30 text-red-400' : status === 'passed' ? 'border-emerald-500/30 text-emerald-400' : status === 'learning' ? 'border-blue-500/30 text-blue-400' : 'border-slate-600 text-slate-500'}`}>{course.code}</span>
                                                                    <h4 className={`text-sm font-medium truncate ${isLocked ? 'text-red-200/50' : status === 'passed' ? 'text-emerald-100' : status === 'learning' ? 'text-blue-100' : 'text-slate-400'}`}>{course.name}</h4>
                                                                </div>
                                                                {isLocked && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/> Prerequisite: {course.prereq}</p>}
                                                            </div>
                                                            <div className="shrink-0">
                                                                {isLocked ? <Lock size={16} className="text-red-500/50"/> : status === 'passed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : status === 'learning' ? <PlayCircle size={16} className="text-blue-500"/> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
                                                            </div>
                                                        </div>
                                                    )
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
                                                                    <div className="text-sm font-medium truncate text-orange-100">{elective.name}</div>
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
        <div className="fixed bottom-0 left-0 w-full bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 p-4 z-50">
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