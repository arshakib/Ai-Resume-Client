import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { closePremiumModal } from '../store/slices/uiSlice';
import api from '../services/api';

export default function PremiumModal() {
  const dispatch = useAppDispatch();
  const { isPremiumModalOpen } = useAppSelector((state) => state.ui);
  const [isLoading, setIsLoading] = useState(false);
  if (!isPremiumModalOpen) return null;

  const handleUpgradeClick = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/payment/create-checkout-session');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Failed to start checkout", error);
      alert("Failed to connect to payment provider.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => dispatch(closePremiumModal())}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 blur-[50px] rounded-full"></div>

          <button 
            onClick={() => dispatch(closePremiumModal())}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 relative z-10">
            <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
              <Crown className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium AI</h2>
            <p className="text-slate-400 text-sm">Get the ultimate edge in your job search with deep AI analysis.</p>
          </div>

          <ul className="space-y-4 mb-8 relative z-10">
            {['Unlimited Resume Scans', 'Deep AI Feedback & Risk Scoring', 'ATS Keyword Optimization', 'Priority Premium Support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handleUpgradeClick}
            disabled={isLoading}
            className="relative z-10 w-full py-4 rounded-xl font-bold text-white bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connecting to Secure Checkout...' : (
              <><Sparkles className="w-5 h-5" /> Upgrade Now - $9.99</>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}