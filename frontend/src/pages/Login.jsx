import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Terminal } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // สร้าง state เก็บค่า input
  const [formData, setFormData] = useState({ 
    id: '', 
    password: '' 
  });

  // ฟังก์ชันจับค่าที่พิมพ์
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. ตรวจสอบรหัสผ่าน (Hardcode: 1234)
    if (formData.password !== "1234") {
      alert("รหัสผิดครับพี่ชาย! ลอง 1234 ดูครับ เพื่อความอยู่รอด!");
      return;
    }

    setLoading(true);

    // 2. จำลองการยิง API Login
    setTimeout(() => {
      setLoading(false);
      // Login ผ่าน -> ไปหน้า Setup
      navigate('/setup');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 mb-4 shadow-lg shadow-orange-500/20">
            <Terminal size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">SURVIVOR</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">CS ต้องรอด • Computer Science Tracker</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-orange-400 transition-colors">Student ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                name="id" 
                type="text"
                placeholder="660xxxxxxx"
                value={formData.id}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                name="password" 
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-orange-500/10 flex items-center justify-center gap-2 mt-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SURVIVING...
              </span>
            ) : (
              <>LOGIN TO SURVIVE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          ยังไม่มีรหัสผ่าน? 
          {/* ✅ แก้ไขตรงนี้: เพิ่ม onClick เพื่อเปลี่ยนหน้าไป Register */}
          <span 
            onClick={() => navigate('/register')} 
            className="text-white cursor-pointer hover:text-orange-400 transition-colors underline decoration-slate-700 underline-offset-4 ml-1"
          >
            ลงทะเบียนเพื่อความอยู่รอด
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;