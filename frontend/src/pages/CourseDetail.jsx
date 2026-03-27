import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { ArrowLeft, Star, Users, BookOpen, Clock, BarChart3, MessageSquare, Send, ThumbsUp, Trash2, Sparkles, CheckCircle, Reply, Quote, Loader2 } from 'lucide-react';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // --- Logic ค้นหาวิชา ---
  const findCourse = (courseId) => {
    for (const year of roadmapData) {
      for (const sem of year.semesters) {
        const found = sem.courses.find(c => c.id === courseId);
        if (found) return { ...found, type: 'core' };
      }
    }
    const elective = electiveCourses.find(c => c.id === courseId);
    if (elective) return { ...elective, type: 'elective' };
    return null;
  };

  const course = findCourse(id);
  const currentUser = "Me (You)"; 

  // --- State Management ---
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [quotedReview, setQuotedReview] = useState(null);

  // 🔄 ดึงรีวิวจริงจาก NestJS
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/reviews/course/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const session = JSON.parse(localStorage.getItem('active_session'));
      const res = await axios.post(`${API_URL}/reviews`, {
        courseId: parseInt(id),
        comment: newComment,
        rating: newRating,
        studentId: session?.id
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );
      setReviews([res.data, ...reviews]);
      setNewComment("");
      setNewRating(0);
      setQuotedReview(null);
      alert("รีวิวสำเร็จ! ขอบคุณครับโก๋ 🌟");
    } catch (error) {
      alert(error.response?.data?.message || "ระบบขัดข้อง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: [...(review.replies || []), { id: Date.now(), user: currentUser, comment: replyText, date: "Just now", likes: 0 }]
        };
      }
      return review;
    }));
    setReplyText("");
    setReplyingTo(null);
  };

  const handleQuote = (review) => {
    setQuotedReview(review);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("ต้องการลบรีวิวนี้ใช่หรือไม่?")) return;
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  if (!course) return <div className="p-10 text-white text-center">Course not found</div>;

  const courseDetails = {
    description: course.description ?? 'ยังไม่มีคำอธิบายรายวิชานี้ในระบบ',
    professors:  course.professors  ?? ['TBA'],
    scoring:     course.scoring     ?? [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
      { label: 'Other',        percent: 30, color: 'bg-blue-500'   },
    ],
    difficulty:   course.difficulty   ?? 0,
    satisfaction: course.satisfaction ?? 0,
    topics: {
      midterm: course.topics?.midterm ?? ['TBA'],
      final:   course.topics?.final   ?? ['TBA'],
    },
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
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-400"/> Course Description
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">{courseDetails.description}</p>
            {course.prereq && (
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <p className="text-sm text-orange-300 font-bold mb-1">📋 Prerequisite Required:</p>
                <p className="text-orange-200 text-sm">You must complete <span className="font-mono bg-orange-500/20 px-2 py-0.5 rounded">{course.prereq}</span> before taking this course.</p>
              </div>
            )}
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-400"/> Topics Covered
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-orange-300 font-bold mb-3 text-sm uppercase">📝 Midterm</h4>
                <ul className="space-y-2">
                  {courseDetails.topics.midterm.map((t, i) => <li key={i} className="text-slate-300 text-sm">▸ {t}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-red-300 font-bold mb-3 text-sm uppercase">📝 Final</h4>
                <ul className="space-y-2">
                  {courseDetails.topics.final.map((t, i) => <li key={i} className="text-slate-300 text-sm">▸ {t}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
             <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-purple-400"/> Grading Criteria
            </h3>
            <div className="space-y-4">
              {courseDetails.scoring.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="text-white font-bold">{s.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Reviews Section --- */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <MessageSquare className="text-emerald-400"/> Community Reviews
            </h3>

            {/* Input Box */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-8 relative z-10">
                {quotedReview && (
                  <div className="mb-4 p-3 bg-slate-800/50 border-l-4 border-blue-500 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-400">Quoting @{quotedReview.author?.name || quotedReview.user}</span>
                      <button onClick={() => setQuotedReview(null)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                    </div>
                    <p className="text-sm text-slate-400 italic line-clamp-2">"{quotedReview.comment}"</p>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-slate-300 text-sm font-medium">Rate this course:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={22} className={`cursor-pointer transition-transform hover:scale-110 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} onClick={() => setNewRating(star)} />
                        ))}
                    </div>
                </div>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="เขียนรีวิวแบ่งปันเพื่อนๆ หน่อย..." className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white h-24 mb-3" />
                <div className="flex justify-end">
                    <button onClick={handleSubmitReview} disabled={!newComment || newRating === 0 || isSubmitting} className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition-all ${!newComment || newRating === 0 || isSubmitting ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} />} Post Review
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6 relative z-10">
                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" size={32}/></div> : 
                 reviews.length === 0 ? <p className="text-center text-slate-500 py-4">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเลย!</p> :
                 reviews.map((r) => (
                    <div key={r.id} className="border border-white/5 rounded-xl p-5 bg-black/20 group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-purple-500 to-indigo-600">{(r.author?.name || "U").charAt(0)}</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{r.author?.name || "Student"}</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                                      {r.sentiment && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${r.sentiment === 'งานเดือด' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>✨ {r.sentiment}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-700"} />)}</div>
                                <button onClick={() => handleDeleteReview(r.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm ml-[52px] mb-3">"{r.comment}"</p>
                        <div className="flex items-center gap-4 ml-[52px]">
                            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400"><ThumbsUp size={14} /> Helpful ({r.likes || 0})</button>
                            <button onClick={() => setReplyingTo(replyingTo === r.id ? null : r.id)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-400"><Reply size={14} /> Reply</button>
                            <button onClick={() => handleQuote(r)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400"><Quote size={14} /> Quote</button>
                        </div>
                        {replyingTo === r.id && (
                          <div className="ml-[52px] mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="ตอบกลับ..." className="w-full bg-slate-900/50 p-2 text-white text-sm h-20 mb-2" />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setReplyingTo(null)} className="text-xs text-slate-400">Cancel</button>
                              <button onClick={() => handleReply(r.id)} className="px-4 py-1 rounded-lg text-xs bg-green-600">Reply</button>
                            </div>
                          </div>
                        )}
                    </div>
                ))}
            </div>
          </section>
        </div>

        {/* --- Right Column: Stats --- */}
        <div className="space-y-8">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-slate-400 mb-2 font-medium">ความยากของเนื้อหา</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-red-400">{courseDetails.difficulty.toFixed(1)}</span>
              <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
            </div>
            <div className="flex gap-1">{[1,2,3,4,5].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(courseDetails.difficulty) ? 'bg-red-500' : 'bg-slate-700'}`} />)}</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-slate-400 mb-2 font-medium">ความประทับใจต่อรายวิชา</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-emerald-400">{courseDetails.satisfaction.toFixed(1)}</span>
              <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2"><div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${(courseDetails.satisfaction / 5) * 100}%` }} /></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-blue-400"/> ผู้สอน</h4>
            <ul className="space-y-3">
              {courseDetails.professors.map((p, i) => <li key={i} className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">{p.charAt(0)}</div><span className="text-slate-300 text-sm">{p}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;