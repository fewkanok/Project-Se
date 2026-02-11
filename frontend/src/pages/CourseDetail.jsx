import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/courses';
// 1. เพิ่ม Trash2 (รูปถังขยะ) เข้ามา
import { ArrowLeft, Star, Users, BookOpen, Clock, BarChart3, MessageSquare, Send, ThumbsUp, Trash2 } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Logic ค้นหาวิชา ---
  const findCourse = (courseId) => {
    for (const year of roadmapData) {
      for (const sem of year.semesters) {
        const found = sem.courses.find(c => c.id === courseId);
        if (found) return found;
      }
    }
    return null;
  };

  const course = findCourse(id);

  // --- State สำหรับระบบรีวิว ---
  const [reviews, setReviews] = useState([
    { id: 1, user: "Senior Year 4", comment: "วิชานี้ตัด A ยากหน่อย แต่อาจารย์สอนดีมาก ถ้าตั้งใจเข้าเรียนทำแล็บครบก็ผ่านฉลุย", rating: 5, date: "2 days ago", likes: 12 },
    { id: 2, user: "Dev Sleepy", comment: "โปรเจกต์จบเดือดจัด! แนะนำให้หาทีมดีๆ เตรียมตัวไว้แต่เนิ่นๆ เลย ไม่งั้นไม่ได้นอนแน่", rating: 4, date: "1 week ago", likes: 8 },
    { id: 3, user: "Anonymous", comment: "ข้อสอบ Midterm เน้นทฤษฎีเยอะมาก อ่าน slide วนไปครับ", rating: 3, date: "2 weeks ago", likes: 3 },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  // ฟังก์ชันกดส่งรีวิว
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) return;

    const newReview = {
      id: Date.now(), // ใช้เวลาปัจจุบันเป็น ID จะได้ไม่ซ้ำ
      user: "Me (You)",
      comment: newComment,
      rating: newRating,
      date: "Just now",
      likes: 0
    };

    setReviews([newReview, ...reviews]);
    setNewComment("");
    setNewRating(0);
  };

  // 2. ฟังก์ชันลบรีวิว
  const handleDeleteReview = (reviewId) => {
    // กรองเอาเฉพาะ ID ที่ไม่ตรงกับอันที่จะลบ (คือเก็บอันอื่นไว้ เอาอันนี้ออก)
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  if (!course) return <div className="p-10 text-white text-center">Course not found</div>;

  // Mock Data เดิม
  const courseDetails = {
    description: "วิชานี้เน้นการปูพื้นฐานกระบวนการคิดแบบคอมพิวเตอร์ การแก้ปัญหาด้วยอัลกอริทึม และโครงสร้างข้อมูลเบื้องต้น เหมาะสำหรับผู้เริ่มต้นที่ต้องการเข้าใจระบบการทำงานของโปรแกรมอย่างลึกซึ้ง",
    professors: ["Dr. Somsak", "Assoc. Prof. Manee"],
    scoring: [
      { label: "Midterm Exam", percent: 35, color: "bg-orange-500" },
      { label: "Final Exam", percent: 35, color: "bg-red-500" },
      { label: "Project & Labs", percent: 30, color: "bg-blue-500" },
    ],
  };

  return (
    <div className="min-h-screen text-slate-200 p-6 md:p-12 pb-32 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
        Back to Roadmap
      </button>

      {/* --- Header Section --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/10 p-8 md:p-12 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-sm font-mono tracking-wider">
                {course.code}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm border font-medium uppercase ${course.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : course.status === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                {course.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
              {course.name}
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
              <Clock size={18} /> 3 Hours / Week &bull; {course.credits} Credits
            </p>
          </div>
        </div>
      </div>

      {/* --- Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-400"/> Course Description
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              {courseDetails.description}
            </p>
          </section>

          {/* Grading */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
             <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-purple-400"/> Grading Criteria
            </h3>
            <div className="space-y-4">
              {courseDetails.scoring.map((score, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{score.label}</span>
                    <span className="text-white font-bold">{score.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${score.color}`} style={{ width: `${score.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <MessageSquare className="text-emerald-400"/> Community Reviews
            </h3>

            {/* Input Box */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-slate-300 text-sm font-medium">Rate this course:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                size={22} 
                                className={`cursor-pointer transition-transform hover:scale-110 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-slate-600 hover:text-yellow-200"}`}
                                onClick={() => setNewRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="เขียนรีวิวแบ่งปันเพื่อนๆ หน่อย..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none h-24 mb-3"
                ></textarea>
                <div className="flex justify-end">
                    <button 
                        onClick={handleSubmitReview}
                        disabled={!newComment || newRating === 0}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition-all ${!newComment || newRating === 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                    >
                        Post Review <Send size={16} />
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6 relative z-10">
                {reviews.length === 0 && (
                    <p className="text-center text-slate-500 py-4">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเลย!</p>
                )}
                
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0 animate-in slide-in-from-bottom-2 group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner
                                    ${review.id % 2 === 0 ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}>
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{review.user}</h4>
                                    <span className="text-xs text-slate-500">{review.date}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Star Display */}
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-700"} />
                                    ))}
                                </div>

                                {/* 3. ปุ่มลบ (จะโชว์ก็ต่อเมื่อเอาเมาส์ไปชี้ที่การ์ดรีวิว หรือกดง่ายๆ ในมือถือ) */}
                                <button 
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="text-slate-600 hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    title="Delete Review"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed pl-[52px]">
                            "{review.comment}"
                        </p>
                        <div className="flex items-center gap-4 pl-[52px] mt-3">
                            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors">
                                <ThumbsUp size={14} /> Helpful ({review.likes})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </section>

        </div>

        {/* Right Column: Stats */}
        <div className="space-y-8">
          {/* Difficulty Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-slate-400 mb-2 font-medium">Difficulty Level</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-red-400">4.5</span>
              <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                 <div key={star} className={`h-1.5 flex-1 rounded-full ${star <= 4 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
              ))}
            </div>
          </div>

          {/* Satisfaction Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-slate-400 mb-2 font-medium">Satisfaction</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-emerald-400">4.8</span>
              <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{width: '96%'}}></div>
            </div>
          </div>

          {/* Instructors */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Users size={18} className="text-blue-400"/> Instructors
            </h4>
            <ul className="space-y-3">
                {courseDetails.professors.map((prof, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
                            {prof.charAt(0)}
                        </div>
                        <span className="text-slate-300 text-sm">{prof}</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;