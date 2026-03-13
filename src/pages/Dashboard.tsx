/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Activity, LogOut, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, upgradeToPremium } from '../store/slices/authSlice';
import { openPremiumModal } from '../store/slices/uiSlice';
import PremiumModal from '../components/PremiumModal';
import AnalyzeModal from '../components/AnalyzeModal';
import AnalysisDetailModal from '../components/AnalysisDetailModal';
import { ArrowRight } from 'lucide-react'; 

interface ResumeAnalysis {
  _id: string;
  resumeText: string;
  riskScore: number;
  feedback: string[];
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const[isVerifying, setIsVerifying] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const { data: history, isLoading, isError } = useQuery({
    queryKey: ['resumeHistory'],
    queryFn: async () => {
      const response = await api.get('/resume/history');
      return response.data.data as ResumeAnalysis[];
    },
  });

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    if (paymentStatus === 'success' && sessionId) {
      verifyPaymentSession(sessionId);
    } else if (paymentStatus === 'cancelled') {
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  const verifyPaymentSession = async (sessionId: string) => {
    try {
      setIsVerifying(true);
      const response = await api.post('/payment/verify-session', { sessionId });    
      if (response.data.success) {
        dispatch(upgradeToPremium());
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      alert("We couldn't verify your payment. If you were charged, please contact support.");
    } finally {
      navigate('/dashboard', { replace: true });
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const handleNewAnalysisClick = () => {
    if (user?.role === 'PREMIUM' || user?.role === 'ADMIN') {
      setIsAnalyzeModalOpen(true);
    } else {
      dispatch(openPremiumModal());
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-brand-500/30">
      <PremiumModal />
      <AnalyzeModal 
        isOpen={isAnalyzeModalOpen} 
        onClose={() => setIsAnalyzeModalOpen(false)} 
      />

       <AnalysisDetailModal 
        analysis={selectedAnalysis} 
        onClose={() => setSelectedAnalysis(null)} 
      />

      <AnimatePresence>
        {isVerifying && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md"
          >
            <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
            <p className="text-slate-400">Please wait while we unlock your Premium features.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Workspace</h1>
            <p className="text-sm text-slate-400">Welcome, {user?.email}</p>
          </div>
          {user?.role === 'PREMIUM' && (
            <div className="ml-4 px-3 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pro</span>
            </div>
          )}
        </div>
        
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </header>
      <main className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Past Analyses</h2>
            <p className="text-slate-400">Review your AI-generated resume feedback.</p>
          </div>
          <button 
            onClick={handleNewAnalysisClick} 
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2"
          >
            <FileText className="w-5 h-5" /> New Analysis
          </button>
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 h-72 animate-pulse">
                <div className="w-14 h-14 bg-slate-800 rounded-full mb-6"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-slate-800 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        )}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center gap-4 text-red-400">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Failed to load history</h3>
              <p>Please try refreshing the page or logging in again.</p>
            </div>
          </div>
        )}
        {!isLoading && !isError && history?.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">No resumes analyzed yet</h3>
            <p className="text-slate-500 mt-2">Click "New Analysis" to upload and scan your first PDF.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history?.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-brand-500/50 rounded-3xl p-6 transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-4 
                  ${item.riskScore > 70 ? 'border-red-500/30 text-red-400' : item.riskScore > 40 ? 'border-yellow-500/30 text-yellow-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                  {item.riskScore}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                Parsed Document
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 grow">
                "{item.resumeText}"
              </p>
              <div className="bg-slate-950/50 rounded-xl p-4 flex flex-col gap-3 border border-white/5 mt-auto">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-purple-400" /> AI Suggestions
                </h4>
                
                <div className="flex flex-col gap-2.5">
                  {item.feedback.slice(0, 2).map((tip, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <CheckCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}

                  {item.feedback.length > 2 && (
                    <div className="pt-1 pl-6">
                      <span className="text-xs font-medium text-brand-400/80 bg-brand-500/10 px-2 py-1 rounded-md">
                        + {item.feedback.length - 2} more tips
                      </span>
                    </div>
                  )}

                  {item.feedback.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No feedback available.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setSelectedAnalysis(item)}
                className="mt-5 w-full py-3 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 rounded-xl text-brand-400 text-sm font-bold transition-all flex items-center justify-center gap-2 group"
              >
                View Full Report 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}