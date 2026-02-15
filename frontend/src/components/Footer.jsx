// src/components/Footer.jsx
import { Github, Facebook, Twitter, Instagram, Heart, Code, Terminal, ArrowUpRight, Sparkles, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative w-full mt-32 overflow-hidden">
      
      {/* --- Background Layers: Multiple Gradients for Depth --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/95 to-black -z-10"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse -z-10" style={{animationDelay: '1s'}}></div>
      
      {/* --- Decorative Top Section with Glow --- */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-4 left-[20%] opacity-50">
          <Sparkles size={16} className="text-blue-400 animate-pulse" />
        </div>
        <div className="absolute top-8 right-[25%] opacity-40">
          <Sparkles size={12} className="text-purple-400 animate-pulse" style={{animationDelay: '500ms'}} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section - CS ต้องรอด (สีน้ำเงิน) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                  <Terminal className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 tracking-tight">
                  CS ต้องรอด
                </h3>
                <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-bold flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
                  Curriculum Survivor
                </p>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              แหล่งรวมข้อมูลรายวิชาและเส้นทางการเรียนรู้สำหรับนักศึกษา Computer Science 
              เพื่อวางแผนการเรียนอย่างมีประสิทธิภาพและประสบความสำเร็จ
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <a href="mailto:info@cssurvive.com" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                  <Mail size={14} />
                </div>
                <span>info@cssurvive.com</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span>Computer Science Department</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></span> 
                Navigation
              </h4>
              <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/roadmap', label: 'Core Courses' },
                { to: '/setup', label: 'Setup Profile' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-all text-sm"
                  >
                    <ArrowUpRight 
                      size={14} 
                      className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" 
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Enhanced */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]"></span> 
                Resources
              </h4>
              <div className="h-[2px] w-12 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {[
                'University Registration',
                'Academic Calendar',
                'Download Syllabus',
                'Course Reviews',
                'Study Materials',
                'Report Issue'
              ].map((item, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    className="group flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Connect - Enhanced */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span> 
                Connect
              </h4>
              <div className="h-[2px] w-12 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
            </div>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              ติดตามเราเพื่อรับข้อมูลอัพเดทล่าสุด และเคล็ดลับการเรียนต่างๆ
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Facebook, color: 'hover:bg-blue-600 hover:border-blue-500/50', name: 'Facebook' },
                { icon: Twitter, color: 'hover:bg-sky-500 hover:border-sky-400/50', name: 'Twitter' },
                { icon: Instagram, color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-pink-500/50', name: 'Instagram' },
                { icon: Github, color: 'hover:bg-white hover:text-black hover:border-white/50', name: 'Github' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className={`group relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${social.color}`}
                  title={social.name}
                >
                  <social.icon size={18} />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-transparent via-blue-500/20 to-transparent px-4">
              <Sparkles size={16} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} <span className="font-bold text-slate-400">CS Curriculum Roadmap</span>. All rights reserved.
          </p>
          
          {/* Made with Love Badge - Enhanced */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all cursor-default backdrop-blur-sm">
              <span>Crafted with</span>
              <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
              <span>and</span>
              <Code size={12} className="text-blue-400" />
              <span>by CS Students</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-3 text-[10px] text-slate-600">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span>React</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>Tailwind</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
              <span>Vite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent blur-xl"></div>
    </footer>
  );
};

export default Footer;