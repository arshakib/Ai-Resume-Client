import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertTriangle, CheckCircle, Target, TrendingUp, FileText, Sparkles, BrainCircuit } from 'lucide-react';

interface ResumeAnalysis {
  _id: string;
  resumeText: string;
  riskScore: number;
  feedback: string[];
  createdAt: string;
}

interface AnalysisDetailModalProps {
  analysis: ResumeAnalysis | null;
  onClose: () => void;
}

export default function AnalysisDetailModal({ analysis, onClose }: AnalysisDetailModalProps) {
  if (!analysis) return null;
  const atsCompatibility = 100 - analysis.riskScore;
  const impactScore = Math.min(100, Math.max(10, atsCompatibility + 15)); 
  const isHighRisk = analysis.riskScore > 70;
  const isMediumRisk = analysis.riskScore > 40 && analysis.riskScore <= 70;
  
  const scoreColor = isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-yellow-400' : 'text-emerald-400';
  const scoreBg = isHighRisk ? 'bg-red-500/10 border-red-500/30' : isMediumRisk ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-emerald-500/10 border-emerald-500/30';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center border border-brand-500/30">
                <BrainCircuit className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Detailed AI Report</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(analysis.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-6 rounded-2xl border ${scoreBg} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10 blur-xl"></div>
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Rejection Risk</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-extrabold ${scoreColor}`}>{analysis.riskScore}</span>
                      <span className={`text-lg font-bold ${scoreColor}`}>/100</span>
                    </div>
                    <span className="text-xs text-slate-400 mt-2">
                      {isHighRisk ? 'Critical updates needed' : isMediumRisk ? 'Room for improvement' : 'Highly competitive'}
                    </span>
                  </div>
                  <div className="p-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-semibold text-slate-300">ATS Match Rate</span>
                    </div>
                    <span className="text-3xl font-bold text-white">{atsCompatibility}%</span>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${atsCompatibility}%` }} transition={{ duration: 1, delay: 0.2 }} className="bg-brand-500 h-1.5 rounded-full" />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-slate-300">Impact Power</span>
                    </div>
                    <span className="text-3xl font-bold text-white">{impactScore}%</span>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${impactScore}%` }} transition={{ duration: 1, delay: 0.4 }} className="bg-purple-500 h-1.5 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-400" /> Actionable Improvements
                  </h3>
                  {analysis.feedback.length === 0 ? (
                    <p className="text-slate-400">Your resume looks perfect! No major feedback found.</p>
                  ) : (
                    <div className="space-y-4">
                      {analysis.feedback.map((tip, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="mt-0.5">
                            {isHighRisk && index < 2 ? (
                              <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                            {tip}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex flex-col h-[500px] lg:h-auto">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-400" /> Parsed Document
                </h3>
                <p className="text-xs text-slate-500 mb-4">This is the exact text the AI read from your PDF. If it looks scrambled, the ATS will scramble it too.</p>   
                <div className="flex-1 overflow-y-auto bg-slate-900 border border-white/5 rounded-xl p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <pre className="font-sans text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {analysis.resumeText}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}