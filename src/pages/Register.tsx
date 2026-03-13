/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormInputs } from '../schemas/authSchema';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const[serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setServerError(null);
      const response = await api.post('/auth/register', { 
        email: data.email, 
        password: data.password 
      });
      
      const { token, user } = response.data;
      dispatch(setCredentials({ user, token }));
      navigate('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-linear-to-br from-brand-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
          >
            <UserPlus className="text-white w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-400">Join thousands landing their dream jobs.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {serverError}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-brand-400'}`} />
              </div>
              <input type="email" placeholder="Email Address" {...register('email')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 transition-all outline-none
                  ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email.message}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-brand-400'}`} />
              </div>
              <input type="password" placeholder="Create Password" {...register('password')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 transition-all outline-none
                  ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'}`}
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1 pl-1">{errors.password.message}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-slate-500 group-focus-within:text-brand-400'}`} />
              </div>
              <input type="password" placeholder="Confirm Password" {...register('confirmPassword')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 transition-all outline-none
                  ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-2">
            <button type="submit" disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-brand-600 hover:bg-brand-500 font-semibold transition-all overflow-hidden disabled:opacity-70 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <span className="relative flex items-center">
                {isSubmitting ? 'Creating Account...' : 'Sign Up Free'}
                {!isSubmitting && <Sparkles className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />}
              </span>
            </button>
          </motion.div>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}