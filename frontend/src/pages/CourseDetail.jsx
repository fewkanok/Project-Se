import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses'; // ✅ เพิ่ม import
import { ArrowLeft, Star, Users, BookOpen, Clock, BarChart3, MessageSquare, Send, ThumbsUp, Trash2, Sparkles, CheckCircle, Reply, Quote } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Logic ค้นหาวิชา (รองรับทั้งวิชาแกนและวิชาเสรี) ---
  const findCourse = (courseId) => {
    // 1. ค้นหาในวิชาแกน (roadmapData)
    for (const year of roadmapData) {
      for (const sem of year.semesters) {
        const found = sem.courses.find(c => c.id === courseId);
        if (found) return { ...found, type: 'core' };
      }
    }
    
    // 2. ค้นหาในวิชาเสรี (electiveCourses)
    const elective = electiveCourses.find(c => c.id === courseId);
    if (elective) return { ...elective, type: 'elective' };
    
    return null;
  };

  const course = findCourse(id);

  // --- State สำหรับระบบรีวิว + Reply แบบ Pantip ---
  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      user: "Senior Year 4", 
      comment: "วิชานี้ตัด A ยากหน่อย แต่อาจารย์สอนดีมาก ถ้าตั้งใจเข้าเรียนทำแล็บครบก็ผ่านฉลุย", 
      rating: 5, 
      date: "2 days ago", 
      likes: 12,
      replies: [
        { id: 101, user: "Junior Dev", comment: "ขอบคุณพี่สำหรับคำแนะนำครับ", date: "1 day ago", likes: 2 }
      ]
    },
    { 
      id: 2, 
      user: "Dev Sleepy", 
      comment: "โปรเจกต์จบเดือดจัด! แนะนำให้หาทีมดีๆ เตรียมตัวไว้แต่เนิ่นๆ เลย ไม่งั้นไม่ได้นอนแน่", 
      rating: 4, 
      date: "1 week ago", 
      likes: 8,
      replies: []
    },
    { 
      id: 3, 
      user: "Anonymous", 
      comment: "ข้อสอบ Midterm เน้นทฤษฎีเยอะมาก อ่าน slide วนไปครับ", 
      rating: 3, 
      date: "2 weeks ago", 
      likes: 3,
      replies: []
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  
  // ✅ State สำหรับ Reply
  const [replyingTo, setReplyingTo] = useState(null); // ID ของ review ที่กำลัง reply
  const [replyText, setReplyText] = useState("");
  
  // ✅ State สำหรับ Quote
  const [quotedReview, setQuotedReview] = useState(null);

  // ฟังก์ชันกดส่งรีวิว
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) return;

    const newReview = {
      id: Date.now(),
      user: "Me (You)",
      comment: newComment,
      rating: newRating,
      date: "Just now",
      likes: 0,
      replies: [],
      quotedReview: quotedReview // เก็บข้อมูล quote ถ้ามี
    };

    setReviews([newReview, ...reviews]);
    setNewComment("");
    setNewRating(0);
    setQuotedReview(null); // ล้าง quote
  };

  // ✅ ฟังก์ชัน Reply
  const handleReply = (reviewId) => {
    if (!replyText.trim()) return;
    
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: [
            ...review.replies,
            {
              id: Date.now(),
              user: "Me (You)",
              comment: replyText,
              date: "Just now",
              likes: 0
            }
          ]
        };
      }
      return review;
    }));
    
    setReplyText("");
    setReplyingTo(null);
  };
  
  // ✅ ฟังก์ชัน Quote
  const handleQuote = (review) => {
    setQuotedReview(review);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ฟังก์ชันลบรีวิว
  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };
  
  // ✅ ฟังก์ชันลบ Reply
  const handleDeleteReply = (reviewId, replyId) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: review.replies.filter(reply => reply.id !== replyId)
        };
      }
      return review;
    }));
  };

  if (!course) return <div className="p-10 text-white text-center">Course not found</div>;

  // Mock Data
  const courseDetails = {
    description: course.type === 'elective' 
      ? "วิชาเลือกเสรีที่ให้นักศึกษาได้เรียนรู้ตามความสนใจและความถนัด เพื่อเสริมทักษะเฉพาะด้านที่ต้องการพัฒนา หรือขยายองค์ความรู้ในสาขาที่หลากหลาย" 
      : "วิชานี้เน้นการปูพื้นฐานกระบวนการคิดแบบคอมพิวเตอร์ การแก้ปัญหาด้วยอัลกอริทึม และโครงสร้างข้อมูลเบื้องต้น เหมาะสำหรับผู้เริ่มต้นที่ต้องการเข้าใจระบบการทำงานของโปรแกรมอย่างลึกซึ้ง",
    professors: course.type === 'elective' 
      ? ["Dr. Elective Expert", "Asst. Prof. Optional"] 
      : ["Dr. Somsak", "Assoc. Prof. Manee"],
    scoring: [
      { label: "Midterm Exam", percent: 35, color: "bg-orange-500" },
      { label: "Final Exam", percent: 35, color: "bg-red-500" },
      { label: "Project & Labs", percent: 30, color: "bg-blue-500" },
    ],
    // ✅ หัวข้อที่เรียน
    topics: {
      midterm: [
        "Introduction to Programming Concepts",
        "Variables, Data Types & Operators",
        "Control Structures (If-else, Loops)",
        "Functions & Recursion",
        "Arrays & Strings Manipulation",
        "Object-Oriented Programming Basics",
        "Classes, Objects & Inheritance"
      ],
      final: [
        "Polymorphism & Abstraction",
        "File I/O Operations",
        "Exception Handling & Debugging",
        "Data Structures (Stack, Queue, Linked List)",
        "Algorithms & Complexity Analysis",
        "Design Patterns (Observer, Factory, Singleton)",
        "Final Project: Full Application Development"
      ]
    }
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
        <div className={`absolute top-0 right-0 w-96 h-96 ${course.type === 'elective' ? 'bg-orange-500/20' : 'bg-blue-500/20'} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* ✅ Badge แสดงประเภทวิชา */}
              {course.type === 'elective' && (
                <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-3 py-1 rounded-lg text-sm font-bold tracking-wider flex items-center gap-1 shadow-lg">
                  <Sparkles size={14} /> ELECTIVE
                </span>
              )}
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-sm font-mono tracking-wider">
                {course.code}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm border font-medium uppercase ${course.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : course.status === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                {course.status || 'available'}
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
            
            {/* ✅ แสดง Prerequisite ถ้ามี */}
            {course.prereq && (
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <p className="text-sm text-orange-300 font-bold mb-1">📋 Prerequisite Required:</p>
                <p className="text-orange-200 text-sm">
                  You must complete <span className="font-mono bg-orange-500/20 px-2 py-0.5 rounded">{course.prereq}</span> before taking this course.
                </p>
              </div>
            )}
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
                {/* ✅ แสดง Quote Box ถ้ามีการ Quote */}
                {quotedReview && (
                  <div className="mb-4 p-3 bg-slate-800/50 border-l-4 border-blue-500 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-400">Quoting @{quotedReview.user}</span>
                      <button 
                        onClick={() => setQuotedReview(null)}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 italic line-clamp-2">"{quotedReview.comment}"</p>
                  </div>
                )}
                
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
                    placeholder={quotedReview ? "เขียนความเห็นเกี่ยวกับ quote นี้..." : "เขียนรีวิวแบ่งปันเพื่อนๆ หน่อย..."}
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
                    <div key={review.id} className="border border-white/5 rounded-xl p-5 bg-black/20 animate-in slide-in-from-bottom-2 group">
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

                                {/* ปุ่มลบ */}
                                <button 
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="text-slate-600 hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    title="Delete Review"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        {/* ✅ แสดง Quote ถ้ามี */}
                        {review.quotedReview && (
                          <div className="ml-[52px] mb-3 p-3 bg-slate-800/30 border-l-4 border-blue-500/50 rounded">
                            <p className="text-xs text-slate-400 mb-1">Quoted @{review.quotedReview.user}</p>
                            <p className="text-sm text-slate-400 italic line-clamp-2">"{review.quotedReview.comment}"</p>
                          </div>
                        )}
                        
                        <p className="text-slate-300 text-sm leading-relaxed ml-[52px] mb-3">
                            "{review.comment}"
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 ml-[52px]">
                            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors">
                                <ThumbsUp size={14} /> Helpful ({review.likes})
                            </button>
                            <button 
                              onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-400 transition-colors"
                            >
                                <Reply size={14} /> Reply ({review.replies?.length || 0})
                            </button>
                            <button 
                              onClick={() => handleQuote(review)}
                              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors"
                            >
                                <Quote size={14} /> Quote
                            </button>
                        </div>

                        {/* ✅ Reply Box (แบบ Pantip) */}
                        {replyingTo === review.id && (
                          <div className="ml-[52px] mt-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`ตอบกลับ @${review.user}...`}
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors resize-none h-20 mb-2"
                            ></textarea>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReply(review.id)}
                                disabled={!replyText.trim()}
                                className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${!replyText.trim() ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ✅ Nested Replies (แบบ Pantip) */}
                        {review.replies && review.replies.length > 0 && (
                          <div className="ml-[52px] mt-4 space-y-3">
                            {review.replies.map((reply) => (
                              <div key={reply.id} className="border-l-2 border-green-500/30 pl-4 py-2 bg-slate-800/20 rounded-r group/reply">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                                      {reply.user.charAt(0)}
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-white text-xs">{reply.user}</h5>
                                      <span className="text-[10px] text-slate-500">{reply.date}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteReply(review.id, reply.id)}
                                    className="text-slate-600 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover/reply:opacity-100"
                                    title="Delete Reply"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <p className="text-slate-300 text-xs leading-relaxed ml-9">
                                  {reply.comment}
                                </p>
                                <button className="flex items-center gap-1 ml-9 mt-2 text-[10px] text-slate-600 hover:text-blue-400 transition-colors">
                                  <ThumbsUp size={10} /> {reply.likes}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                ))}
            </div>
          </section>

        </div>

        {/* Right Column: Stats */}
        <div className="space-y-8">
          {/* Course Type Badge */}
          {course.type === 'elective' && (
            <div className="bg-gradient-to-br from-orange-600/20 to-pink-600/20 border-2 border-orange-500/50 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-orange-400" size={20} />
                <h4 className="text-orange-300 font-bold">Free Elective Course</h4>
              </div>
              <p className="text-sm text-orange-200/80">
                This is an optional course that you can choose based on your interests.
              </p>
            </div>
          )}

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