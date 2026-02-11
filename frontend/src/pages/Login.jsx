import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // จำลองการยิง API Login
    setTimeout(() => {
      setLoading(false);
      // พอ Login ผ่าน ให้พาไปหน้า Setup ข้อมูลก่อน (ยังไม่ไป Dashboard)
      navigate('/setup');
    }, 1500);

    // ใน src/pages/Login.jsx

    const [formData, setFormData] = useState({ id: '', password: '' }); // เพิ่ม state เก็บค่า

    // 1. เพิ่มฟังก์ชันจับค่าที่พิมพ์
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.type]: e.target.value });
    };

    const handleLogin = (e) => {
      e.preventDefault();

      // 2. เช็คเงื่อนไขตรงนี้! (Hardcode ไว้ก่อน)
      if (formData.password !== "1234") {
        alert("รหัสผิดครับพี่ชาย! ลอง 1234 ดู");
        return;
      }

      setLoading(true);
      // ... โค้ดเดิม (setTimeout) ...
    };

    // 3. อย่าลืมไปใส่ onChange={handleChange} ใน <input> ทั้งสองช่องด้วยนะครับ
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            CS PORTAL
          </h1>
          <p className="text-slate-400">Computer Science Curriculum Tracker</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Student ID / Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="660406xxxx"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : <>Login <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          First time here? <span className="text-blue-400 cursor-pointer hover:underline">Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;