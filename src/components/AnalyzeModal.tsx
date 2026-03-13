/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, UploadCloud, FileCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as pdfjsLib from 'pdfjs-dist';
import api from '../services/api';

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyzeModal({ isOpen, onClose }: AnalyzeModalProps) {
  const[file, setFile] = useState<File | null>(null);
  const[extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const handleClose = () => {
    setFile(null);
    setExtractedText("");
    setPdfError(null);
    onClose();
  };

  const extractTextFromPDF = async (pdfFile: File) => {
    try {
      setIsExtracting(true);
      setPdfError(null);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      if (fullText.trim().length < 50) {
        throw new Error("Could not extract enough text. Ensure the PDF is not an image.");
      }
      setExtractedText(fullText);
    } catch (error: any) {
      console.error("PDF Extraction Error:", error);
      setPdfError(error.message || "Failed to read PDF. Please try another file.");
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setPdfError("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    extractTextFromPDF(selectedFile);
  };

  const analyzeMutation = useMutation({
    
    mutationFn: async (text: string) => {
        console.log("Sending text to analyze:", text.substring(0, 100) + "...", text);
      const response = await api.post('/resume/analyze', { resumeText: text });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeHistory'] });
      handleClose();
    },
    onError: (error: any) => {
      setPdfError(error.response?.data?.message || "AI Analysis failed");
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-brand-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
        >
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <UploadCloud className="text-brand-400 w-6 h-6" /> Upload Resume
            </h2>
            <p className="text-slate-400 text-sm">Upload your resume in PDF format. We will extract the text securely in your browser and analyze it using AI.</p>
          </div>
          <div className="mb-8">
            <input 
              type="file" 
              accept=".pdf,application/pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-700 hover:border-brand-500 hover:bg-brand-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 bg-slate-800 group-hover:bg-brand-500/20 rounded-full flex items-center justify-center mb-3 transition-colors">
                  <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-brand-400 transition-colors" />
                </div>
                <p className="text-white font-medium mb-1">Click to upload your PDF</p>
                <p className="text-sm text-slate-500">Max file size: 5MB</p>
              </div>
            ) : (
              <div className="w-full border border-brand-500/30 bg-brand-500/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {isExtracting ? (
                  <>
                    <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-3" />
                    <p className="text-brand-300 font-medium animate-pulse">Extracting text from PDF...</p>
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-500 to-purple-600"></div>
                    <FileCheck className="w-12 h-12 text-emerald-400 mb-3" />
                    <p className="text-white font-medium text-lg">{file.name}</p>
                    <p className="text-sm text-emerald-400/80 mb-4">Text extracted successfully!</p>
                    
                    <button 
                      onClick={() => setFile(null)} 
                      className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4"
                    >
                      Remove and upload different file
                    </button>
                  </>
                )}
              </div>
            )}
            {pdfError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{pdfError}</p>
              </motion.div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button onClick={handleClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => analyzeMutation.mutate(extractedText)}
              disabled={!file || isExtracting || analyzeMutation.isPending}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              {analyzeMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Start AI Analysis</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}