import React from 'react';
import { X, Award, CheckCircle2, XCircle, AlertCircle, BookOpen, Calendar, FileText, Sparkles, TrendingUp, Target, GraduationCap, Briefcase, ClipboardCheck } from 'lucide-react';

const CoopEligibilityModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const RequirementCard = ({ icon: Icon, title, current, required, isPassed, unit, description }) => (
    <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
      isPassed 
        ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent' 
        : 'border-red-500/50 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent'
    }`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isPassed ? '#10b981' : '#ef4444'} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <Icon size={24} className={isPassed ? 'text-emerald-400' : 'text-red-400'} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{title}</h4>
              {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
          </div>
          <div className={`p-2 rounded-full ${isPassed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {isPassed ? (
              <CheckCircle2 size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">
              {current}
            </span>
            <span className="text-lg text-slate-400">
              / {required} {unit}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                isPassed 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${Math.min(100, (current / required) * 100)}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span className={isPassed ? 'text-emerald-400' : 'text-red-400'}>
              {Math.round((current / required) * 100)}% Complete
            </span>
            <span className="text-slate-500">
              Required: {required} {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseListItem = ({ number, code, name, isPassed }) => (
    <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
      isPassed 
        ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' 
        : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
    }`}>
      <div className="flex items-center gap-4 p-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
          isPassed 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-slate-700/50 text-slate-400'
        }`}>
          {number}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{name}</p>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{code}</p>
        </div>

        {isPassed && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">PASSED</span>
          </div>
        )}
      </div>
    </div>
  );

  const TimelineStep = ({ number, title, detail, isActive }) => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
          isActive 
            ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/50' 
            : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {number}
        </div>
        {number < 3 && (
          <div className={`w-0.5 h-16 transition-all duration-300 ${
            isActive ? 'bg-gradient-to-b from-cyan-500 to-slate-700' : 'bg-slate-700'
          }`}></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <h5 className={`font-bold mb-1 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-slate-400'
        }`}>
          {title}
        </h5>
        <p className="text-sm text-slate-500 leading-relaxed">{detail}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-xl opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
                    <Award size={32} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Co-op Eligibility Check
                  </h2>
                  <p className="text-slate-400 text-sm">
                    ระเบียบการและคุณสมบัติสำหรับนักศึกษาโครงการสหกิจศึกษา
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-xs font-bold text-cyan-400">CIS • KMUTNB</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
          <div className="p-8 space-y-8">
            
            {/* Overall Status Banner */}
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 ${
              stats.coopStats.isFullyEligible
                ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent'
                : 'border-orange-500/50 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent'
            }`}>
              <div className="relative flex items-center gap-4">
                {stats.coopStats.isFullyEligible ? (
                  <>
                    <div className="p-4 rounded-2xl bg-emerald-500/20">
                      <Sparkles size={32} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-1">
                        🎉 คุณมีคุณสมบัติครบถ้วน!
                      </h3>
                      <p className="text-emerald-300">
                        ยินดีด้วย! คุณผ่านเกณฑ์ทั้งหมดสำหรับโครงการสหกิจศึกษา
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-orange-500/20">
                      <Target size={32} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-1">
                        กำลังดำเนินการ
                      </h3>
                      <p className="text-orange-300">
                        คุณกำลังอยู่ในเส้นทางที่ถูกต้อง โปรดตรวจสอบข้อกำหนดด้านล่าง
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Main Requirements Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ClipboardCheck size={24} className="text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">
                  คุณสมบัติหลัก (3 ข้อ)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RequirementCard
                  icon={BookOpen}
                  title="หน่วยกิตสะสม"
                  description="ลงทะเบียนเรียนครบตามตารางที่ภาควิชากำหนด"
                  current={Math.round(stats.earnedCredits)}
                  required={90}
                  isPassed={stats.coopStats.isCreditReady}
                  unit="หน่วยกิต"
                />
                
                <RequirementCard
                  icon={TrendingUp}
                  title="เกรดเฉลี่ยรวม (GPA)"
                  description="ผลการเรียน 5 ภาคการศึกษา"
                  current={stats.calculatedGPAX.toFixed(2)}
                  required={2.75}
                  isPassed={stats.coopStats.isGPAReady}
                  unit=""
                />
                
                <RequirementCard
                  icon={GraduationCap}
                  title="เกรดเฉลี่ยวิชาเอก"
                  description="GPA_10 ใน 10 รายวิชาที่กำหนด"
                  current={stats.coopStats.passedCount}
                  required={10}
                  isPassed={stats.coopStats.isCoursesReady}
                  unit="วิชา"
                />
              </div>
            </div>

            {/* Required Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">
                    10 รายวิชาบังคับ (GPA_10 ≥ 2.50)
                  </h3>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-sm font-mono text-white">
                    <span className="text-cyan-400 font-bold">{stats.coopStats.passedCount}</span>
                    <span className="text-slate-500"> / 10 Passed</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.coopStats.courseDetails.map((course, idx) => (
                  <CourseListItem
                    key={course.code}
                    number={idx + 1}
                    code={course.code}
                    name={course.name}
                    isPassed={course.isPassed}
                  />
                ))}
              </div>

              <div className="mt-6 p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-blue-200 font-semibold">
                      ⚠️ ข้อกำหนดสำคัญ
                    </p>
                    <p className="text-xs text-blue-300 leading-relaxed">
                      นอกจากต้องเรียนผ่านครบทั้ง 10 วิชาแล้ว นักศึกษาต้องมี{' '}
                      <strong className="text-blue-100">เกรดเฉลี่ยเฉพาะกลุ่มวิชานี้ (GPA_10) ไม่ต่ำกว่า 2.50</strong>{' '}
                      โดยคำนวณจากผลการเรียนใน 10 รายวิชาข้างต้นเท่านั้น
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calendar size={24} className="text-emerald-400" />
                <h3 className="text-2xl font-bold text-white">
                  ขั้นตอนการสมัคร
                </h3>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <TimelineStep
                  number={1}
                  title="ตรวจสอบคุณสมบัติ"
                  detail="ตรวจสอบว่าตนเองมีคุณสมบัติครบถ้วนตามเงื่อนไข 3 ข้อข้างต้น (หน่วยกิต, GPA, และ GPA_10)"
                  isActive={true}
                />
                <TimelineStep
                  number={2}
                  title="ช่วงเวลาสมัคร"
                  detail="สมัครเข้าร่วมโครงการในช่วงปี 3 เทอม 2 (ภาคการศึกษาที่ 2 ของชั้นปีที่ 3)"
                  isActive={true}
                />
                <TimelineStep
                  number={3}
                  title="ลงทะเบียนเรียน Pre-coop"
                  detail="ลงทะเบียนเรียนรายวิชา 040613400 Pre-coop ไปพร้อมกับการสมัครเข้าร่วมโครงการ"
                  isActive={true}
                />
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  <Briefcase size={24} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">
                    เกี่ยวกับโครงการสหกิจศึกษา
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    โครงการสหกิจศึกษา (Cooperative Education) เป็นโครงการที่ช่วยให้นักศึกษาได้รับประสบการณ์การทำงานจริง
                    ในสถานประกอบการ เพื่อเป็นการพัฒนาทักษะและความรู้ที่สอดคล้องกับการเรียนในมหาวิทยาลัย
                    และเตรียมความพร้อมสำหรับการทำงานในอนาคต
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
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

export default CoopEligibilityModal;