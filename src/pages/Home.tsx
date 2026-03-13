import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight, FileCheck, BrainCircuit, Sparkles, BarChart3, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
function Floating3DCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100],[-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <div 
      className="relative w-full max-w-lg mx-auto perspective-[2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)]"
      >
        <div style={{ transform: "translateZ(50px)" }} className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <div className="h-4 w-24 bg-slate-700 rounded-md mb-2"></div>
              <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
            </div>
          </div>
          <div className="relative w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-lg">12</span>
            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-400 animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
        <div style={{ transform: "translateZ(30px)" }} className="space-y-4">
          <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <div className="h-3 w-32 bg-purple-500/20 rounded-md"></div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-md mb-2"></div>
            <div className="h-2 w-4/5 bg-slate-800 rounded-md"></div>
          </div>
          <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
             <div className="h-2 w-full bg-slate-800 rounded-md mb-2"></div>
             <div className="h-2 w-3/5 bg-slate-800 rounded-md"></div>
          </div>
        </div>
        <div style={{ transform: "translateZ(-20px)" }} className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-purple-600/20 blur-2xl rounded-3xl -z-10"></div>
      </motion.div>
    </div>
  );
}
export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  },[]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-white/5 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-linear-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Resume<span className="text-brand-400">AI</span></span>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Workspace
                </Link>
                <button 
                  onClick={() => dispatch(logout())} 
                  className="flex items-center gap-2 bg-slate-900 border border-white/10 text-white px-5 py-2 rounded-full font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all shadow-lg"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors hidden sm:block">Log in</Link>
                <Link to="/register" className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <motion.div animate={{ y:[0, -20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-40 left-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl"></motion.div>
        <motion.div animate={{ y:[0, 30, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute bottom-10 right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></motion.div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-medium text-sm mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-4 h-4" /> Google Gemini 1.5 Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Outsmart the <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-400 to-purple-500">ATS algorithm.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              Upload your PDF resume. Our AI instantly reads your history, calculates your rejection risk, and tells you exactly what to rewrite to land the interview.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group">
                {isAuthenticated ? "Go to Workspace" : "Analyze My Resume"} 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, type: "spring" }}>
            <Floating3DCard />
          </motion.div>
        </div>
      </section>
      <section className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
          {[
            { label: "Resumes Analyzed", value: "10,000+" },
            { label: "Interview Rate", value: "92%" },
            { label: "ATS Bypass Success", value: "99.9%" },
            { label: "Data Privacy", value: "100%" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white mb-1">{stat.value}</span>
              <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Three simple steps to a bulletproof resume.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 -translate-y-1/2 z-0"></div>

            {[
              { icon: FileCheck, title: "1. Upload PDF", desc: "Drag & drop your resume. We extract the text locally in your browser for absolute privacy." },
              { icon: BrainCircuit, title: "2. AI Analysis", desc: "Our Gemini AI reads your experience and compares it against top-tier tech industry standards." },
              { icon: BarChart3, title: "3. Get Your Score", desc: "Receive a strict risk score and actionable, line-by-line feedback to improve your phrasing." }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="relative z-10 bg-slate-900 border border-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl"
              >
                <div className="w-16 h-16 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  <step.icon className="w-8 h-8 text-brand-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-brand-400 w-5 h-5" />
            <span className="font-bold text-lg tracking-tight">Resume<span className="text-brand-400">AI</span></span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ResumeAI Platform. Built with React & Node.js.</p>
        </div>
      </footer>
    </div>
  );
}