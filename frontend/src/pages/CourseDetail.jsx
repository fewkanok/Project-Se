import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/courses';
import { electiveCourses } from '../data/electiveCourses';
import { ArrowLeft, Star, Users, BookOpen, Clock, BarChart3, MessageSquare, Send, ThumbsUp, Trash2, Sparkles, CheckCircle, Reply, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // 🛡️ 1. ดึงข้อมูล Session มาไว้ข้างบนสุดเพื่อใช้เช็คสิทธิ์
  const session = useMemo(() => {
    try {
      const data = localStorage.getItem('active_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const isAdmin = session?.role === 'admin';
  const currentUserId = session?.id;

  // --- Logic ค้นหาวิชา ---
  const findCourse = (courseId) => {
    for (const year of roadmapData) {
      for (const sem of year.semesters) {
        const found = sem.courses.find(c => c.id === courseId);
        if (found) return { ...found, type: 'core' };
      }
    }
    const elective = electiveCourses.find(c => c.id === courseId);
    return elective ? { ...elective, type: 'elective' } : null;
  };

  const course = findCourse(id);

  // --- State Management ---
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // 🔄 ดึงรีวิว
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/reviews/course/${id}`);
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sorted);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  // ✅ Pagination Calculation
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/reviews`, {
        courseId: parseInt(id),
        comment: newComment,
        rating: newRating,
        studentId: currentUserId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews([res.data, ...reviews]);
      setNewComment("");
      setNewRating(0);
      setCurrentPage(1);
    } catch (error) {
      alert(error.response?.data?.message || "ระบบขัดข้อง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("ต้องการลบรีวิวนี้ใช่หรือไม่?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  if (!course) return <div className="p-10 text-white text-center font-mono">LOADING COURSE DATA...</div>;

  const courseDetails = {
    description: course.description ?? 'ยังไม่มีคำอธิบายรายวิชานี้ในระบบ',
    professors:  course.professors  ?? ['อาจารย์ผู้สอนสาขาวิชา CS'],
    scoring:     course.scoring     ?? [
      { label: 'Midterm Exam', percent: 35, color: 'bg-orange-500' },
      { label: 'Final Exam',   percent: 35, color: 'bg-red-500'    },
      { label: 'Other',        percent: 30, color: 'bg-blue-500'   },
    ],
    difficulty:   course.difficulty   ?? 0,
    satisfaction: course.satisfaction ?? 0,
    topics: {
      midterm: course.topics?.midterm ?? ['ติดต่อภาควิชาเพื่อรับข้อมูล'],
      final:   course.topics?.final   ?? ['ติดต่อภาควิชาเพื่อรับข้อมูล'],
    },
  };

  return (
    <div className="min-h-screen text-slate-200 p-6 md:p-12 pb-32 animate-in fade-in duration-500">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
        Back to Roadmap
      </button>

      {/* --- Header Section --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/10 p-8 md:p-12 shadow-2xl mb-8">
        <div className={`absolute top-0 right-0 w-96 h-96 ${course.type === 'elective' ? 'bg-orange-500/20' : 'bg-blue-500/20'} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              {course.type === 'elective' && <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1"><Sparkles size={12} /> ELECTIVE</span>}
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-mono">{course.code}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{course.name}</h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm"><Clock size={16} /> 3 Hours / Week &bull; {course.credits} Credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="text-blue-400" size={20}/> Course Description</h3>
            <p className="text-slate-300 leading-relaxed">{courseDetails.description}</p>
          </section>

          {/* Topics */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><CheckCircle className="text-green-400" size={20}/> Topics Covered</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-orange-400 font-bold mb-3 text-xs uppercase tracking-widest">Midterm</h4>
                <ul className="space-y-2">{courseDetails.topics.midterm.map((t, i) => <li key={i} className="text-slate-400 text-sm flex gap-2"><span>▹</span> {t}</li>)}</ul>
              </div>
              <div>
                <h4 className="text-red-400 font-bold mb-3 text-xs uppercase tracking-widest">Final</h4>
                <ul className="space-y-2">{courseDetails.topics.final.map((t, i) => <li key={i} className="text-slate-400 text-sm flex gap-2"><span>▹</span> {t}</li>)}</ul>
              </div>
            </div>
          </section>

          {/* Grading */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="text-purple-400" size={20}/> Grading Criteria</h3>
             <div className="space-y-5">
              {courseDetails.scoring.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="text-white font-bold">{s.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Reviews Section --- */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-emerald-400" size={20}/> Community Reviews
            </h3>

            {/* Post Review Input */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-slate-400 text-sm">Rate:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={20} className={`cursor-pointer transition-all ${star <= newRating ? "fill-yellow-400 text-yellow-400 shadow-yellow-400" : "text-slate-700"}`} onClick={() => setNewRating(star)} />
                        ))}
                    </div>
                </div>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="แชร์ประสบการณ์วิชานี้ให้เพื่อนๆ ฟังหน่อย..." className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white h-28 mb-4 focus:border-blue-500 outline-none transition-all text-sm" />
                <div className="flex justify-end">
                    <button onClick={handleSubmitReview} disabled={!newComment || newRating === 0 || isSubmitting} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${!newComment || newRating === 0 || isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} />} Post
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" size={32}/></div> : 
                 reviews.length === 0 ? <p className="text-center text-slate-500 py-4">No reviews yet. Be the first!</p> :
                 currentReviews.map((r) => (
                    <div key={r.id} className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] group transition-all hover:bg-white/[0.04]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 uppercase">{(r.author?.name || "S").charAt(0)}</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{r.author?.name || "Student"}</h4>
                                    <span className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-800"} />)}</div>
                                
                                {/* ✅ ปุ่มลบ: จะขึ้นเฉพาะ Admin หรือ เจ้าของรีวิวเท่านั้น */}
                                {(isAdmin || r.studentId === currentUserId) && (
                                  <button onClick={() => handleDeleteReview(r.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                )}
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">"{r.comment}"</p>
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-tight"><ThumbsUp size={14} /> Helpful ({r.likes || 0})</button>
                            <button onClick={() => setReplyingTo(replyingTo === r.id ? null : r.id)} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-emerald-400 transition-colors font-bold uppercase tracking-tight"><Reply size={14} /> Reply</button>
                        </div>
                        
                        {/* Reply Input */}
                        {replyingTo === r.id && (
                          <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full bg-slate-900/50 p-3 text-white text-xs h-20 mb-2 rounded-lg outline-none" />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setReplyingTo(null)} className="text-[10px] text-slate-500 font-bold uppercase">Cancel</button>
                              <button className="px-4 py-1.5 rounded-lg text-[10px] bg-emerald-600 font-bold uppercase">Submit</button>
                            </div>
                          </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full border border-white/10 transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${currentPage === i + 1 ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full border border-white/10 transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">Difficulty Level</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-red-500">{courseDetails.difficulty.toFixed(1)}</span>
              <span className="text-xs text-slate-600 mb-1.5 font-bold">/ 5.0</span>
            </div>
            <div className="flex gap-1.5">{[1,2,3,4,5].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(courseDetails.difficulty) ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-800'}`} />)}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">Satisfaction</h4>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-emerald-400">{courseDetails.satisfaction.toFixed(1)}</span>
              <span className="text-xs text-slate-600 mb-1.5 font-bold">/ 5.0</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(courseDetails.satisfaction / 5) * 100}%` }} /></div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold text-sm mb-5 flex items-center gap-2"><Users size={18} className="text-blue-400"/> Professors</h4>
            <ul className="space-y-4">
              {courseDetails.professors.map((p, i) => (
                <li key={i} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/5 group-hover:border-blue-500/50 transition-all">{p.charAt(0)}</div>
                  <span className="text-slate-400 text-xs group-hover:text-white transition-colors">{p}</span>
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