import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight, Terminal, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State สำหรับเก็บค่า Input
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // ล้าง error เมื่อพิมพ์ใหม่
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Validation Logic
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    // 2. จำลองการบันทึกข้อมูล (Simulation)
    setTimeout(() => {
      setLoading(false);
      // ในระบบจริง: ยิง API ไปสร้าง User
      // Simulation: แจ้งเตือนและกลับไปหน้า Login
      alert("Registration Successful! Welcome to the Survivor Squad.");
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans py-10">
      
      {/* --- Background Effects (Theme: Survivor) --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      
      {/* Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/20">
            <Terminal size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">SQUAD</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">Create account to survive CS</p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-pulse">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-white transition-colors">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-400 transition-colors" size={18} />
              <input
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Student ID */}
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-white transition-colors">Student ID</label>
            <div className="relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input
                name="studentId"
                type="text"
                placeholder="660xxxxxxx"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-white transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-white transition-colors">Password</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                <input
                    name="password"
                    type="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
                    required
                />
                </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-white transition-colors">Confirm</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
                    required
                />
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-orange-500/10 flex items-center justify-center gap-2 mt-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            {loading ? (
              <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enlisting...
              </span>
            ) : (
              <>REGISTER NOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already have an account? <span onClick={() => navigate('/login')} className="text-white cursor-pointer hover:text-orange-400 transition-colors underline decoration-slate-700 underline-offset-4">Login here</span>
        </div>
      </div>
    </div>
  );
};

export default Register;