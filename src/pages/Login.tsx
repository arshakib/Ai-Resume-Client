/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormInputs } from '../schemas/authSchema';
import api from '../services/api'; 
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setServerError(null); 
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      dispatch(setCredentials({ user, token }));
      console.log("Logged in successfully! Role:", user.role, "User:", user);
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Cannot connect to server. Is your backend running?");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-linear-to-br from-brand-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
          >
            <Sparkles className="text-white w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400">Log in to your Premium AI workspace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium">
              {serverError}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-brand-400'}`} />
              </div>
              <input type="email" placeholder="you@example.com" {...register('email')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 outline-none
                  ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20'}`}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-brand-400'}`} />
              </div>
              <input type="password" placeholder="••••••••" {...register('password')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 outline-none
                  ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20'}`}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-2">
            <button type="submit" disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-500 transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="relative flex items-center">
                {isSubmitting ? 'Authenticating...' : 'Log In to Workspace'}
                {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </motion.div>

        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
  Don't have an account? <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium hover:underline">Sign up</Link>
</p>
      </motion.div>
    </div>
  );
}