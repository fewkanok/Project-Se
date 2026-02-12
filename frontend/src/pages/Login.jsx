import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Terminal } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. อ่านข้อมูลจากที่ลงทะเบียนไว้
    const registeredUser = JSON.parse(localStorage.getItem('registered_user'));

    let isValid = false;
    let currentUserData = null;

    // 2. เช็คว่ามีข้อมูลตรงกันไหม (Email & Password)
    if (registeredUser && registeredUser.email === formData.email) {
        if (registeredUser.password === formData.password) {
            isValid = true;
            currentUserData = registeredUser;
        } else {
            alert("Wrong password for this Survivor!");
            return;
        }
    } else {
        // Backdoor สำหรับการ Test (Optional)
        if (formData.email === "test@example.com" && formData.password === "1234") {
            isValid = true;
            currentUserData = { 
                name: 'Survivor Guest', 
                studentId: '6609999999', 
                email: 'test@example.com' 
            };
        } else {
            alert("Email not found! Please register first.");
            return;
        }
    }

    if (isValid) {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            
            // ✅ จุดสำคัญ: บันทึก Session ว่าใครล็อกอินอยู่ (Active Session)
            localStorage.setItem('active_session', JSON.stringify(currentUserData));
            
            navigate('/setup');
        }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 mb-4 shadow-lg shadow-orange-500/20">
            <Terminal size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">SURVIVOR</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Login to Survive</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-orange-400 transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
              <input name="email" type="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300" required />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
              <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-orange-500/10 flex items-center justify-center gap-2 mt-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            {loading ? <span className="text-sm">Authenticating...</span> : <>LOGIN TO SURVIVE <ArrowRight size={20} /></>}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          ยังไม่มีรหัสผ่าน? <span onClick={() => navigate('/register')} className="text-white cursor-pointer hover:text-orange-400 transition-colors underline decoration-slate-700 underline-offset-4 ml-1">ลงทะเบียนเพื่อความอยู่รอด</span>
        </div>
      </div>
    </div>
  );
};

export default Login;