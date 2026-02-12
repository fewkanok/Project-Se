import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight, Terminal, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      // --- จุดสำคัญ: บันทึกข้อมูลลงเครื่องจริงๆ (LocalStorage) ---
      const userData = {
          name: formData.fullName,
          studentId: formData.studentId,
          email: formData.email, // บันทึก Email
          password: formData.password // บันทึก Password
      };
      
      // เก็บข้อมูลใส่กล่องชื่อ 'registered_user'
      localStorage.setItem('registered_user', JSON.stringify(userData));

      alert("Registration Successful! Now go Login.");
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans py-10">
      
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/20">
            <Terminal size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">SURVIVOR</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">Create account to survive CS</p>
        </div>

        {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-pulse">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="fullName" type="text" placeholder="John Doe" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500/50 outline-none transition-all" required />
            </div>
          </div>

          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Student ID</label>
            <div className="relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="studentId" type="text" placeholder="660xxxxxxx" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-purple-500/50 outline-none transition-all" required />
            </div>
          </div>

          <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="email" type="email" placeholder="student@example.com" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-cyan-500/50 outline-none transition-all" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input name="password" type="password" placeholder="••••••" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-pink-500/50 outline-none transition-all" required />
                </div>
            </div>

            <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Confirm</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input name="confirmPassword" type="password" placeholder="••••••" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-pink-500/50 outline-none transition-all" required />
                </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-orange-500/10 flex items-center justify-center gap-2 mt-4 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            {loading ? <span className="text-sm">Saving...</span> : <>REGISTER NOW <ArrowRight size={20} /></>}
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