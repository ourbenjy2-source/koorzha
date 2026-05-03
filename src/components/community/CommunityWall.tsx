import React, { useState, useEffect } from 'react';
import { 
  Flag, ShieldCheck, Users, Search, User, Send,
  ThumbsUp, ThumbsDown, MessageCircle, MoreVertical,
  X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Report, Comment } from '@/types';
import { cn } from '@/utils/cn';
import { User as FirebaseUser } from 'firebase/auth';

interface CommunityWallProps {
  user: FirebaseUser | null;
}

export function CommunityWall({ user }: CommunityWallProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [newReport, setNewReport] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  const handlePostReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReport.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        text: newReport,
        authorId: user.uid,
        authorName: user.displayName || 'Anónimo',
        createdAt: serverTimestamp(),
        likesCount: 0,
        dislikesCount: 0,
        fakeReportCount: 0
      });
      setNewReport('');
    } catch (err) {
      console.error(err);
      alert("Error al publicar reporte.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-[#f1f5f9]">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-legal-900 mb-6 flex items-center gap-3">
              <Flag className="w-6 h-6 text-red-500" />
              Portal de Denuncias y Casos
            </h3>
            <form onSubmit={handlePostReport} className="space-y-6">
              <textarea
                value={newReport}
                onChange={(e) => setNewReport(e.target.value)}
                placeholder="Describa su caso o denuncia de manera detallada. Otros usuarios podrán interactuar y apoyarlo..."
                className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-legal-500/10 focus:border-legal-500 outline-none transition-all resize-none text-slate-700 leading-relaxed"
              />
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-600">
                    {user ? `Identificado como ${user.displayName}` : 'Debe ingresar para publicar'}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!user || !newReport.trim() || isPosting}
                  className="bg-legal-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-legal-900 disabled:opacity-50 transition-all shadow-xl active:scale-95"
                >
                  {isPosting ? 'Enviando...' : 'Publicar Ahora'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6 pb-24">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} user={user} />
            ))}
          </div>
        </div>
      </div>
      
      <aside className="w-80 border-l border-slate-200 bg-white p-8 hidden xl:block overflow-y-auto">
        <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-legal-600" />
          Reglas del Muro
        </h4>
        <div className="space-y-6">
          <RuleItem 
            title="Veracidad" 
            desc="El sistema detecta automáticamente patrones de desinformación."
            icon={<ShieldCheck className="w-4 h-4 text-green-500" />}
          />
          <RuleItem 
            title="Auto-Moderación" 
            desc="50 reportes de 'Denuncia Falsa' eliminan el post de forma inmediata."
            icon={<Flag className="w-4 h-4 text-red-500" />}
          />
          <RuleItem 
            title="Respeto" 
            desc="Mantenga el lenguaje profesional incluso en denuncias graves."
            icon={<Users className="w-4 h-4 text-blue-500" />}
          />
        </div>
        <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 text-red-600" />
            <p className="text-xs font-bold text-red-800 uppercase">Sistema de Alerta</p>
          </div>
          <p className="text-[11px] text-red-700 leading-relaxed">
            Estamos comprometidos con la transparencia en Panamá. Use esta herramienta con responsabilidad ciudadana.
          </p>
        </div>
      </aside>
    </div>
  );
}

function RuleItem({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-bold text-slate-800">{title}</p>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed ml-6">{desc}</p>
    </div>
  );
}

function ReportCard({ report, user }: { report: Report, user: FirebaseUser | null }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [moderationMenu, setModerationMenu] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [secretCode, setSecretCode] = useState('');

  useEffect(() => {
    const q = query(collection(db, `reports/${report.id}/comments`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return () => unsubscribe();
  }, [report.id]);

  const handleVote = async (type: 'like' | 'dislike' | 'fake') => {
    if (!user) return alert("Debe iniciar sesión para interactuar.");
    
    const voteRef = doc(db, `reports/${report.id}/votes`, user.uid);
    const voteSnap = await getDoc(voteRef);

    try {
      if (voteSnap.exists()) {
        const existingVote = voteSnap.data() as { type: string };
        if (existingVote.type === type) return;
        
        await updateDoc(doc(db, 'reports', report.id), {
          [`${existingVote.type === 'fake' ? 'fakeReport' : existingVote.type + 's'}Count`]: increment(-1),
          [`${type === 'fake' ? 'fakeReport' : type + 's'}Count`]: increment(1)
        });
      } else {
        await updateDoc(doc(db, 'reports', report.id), {
          [`${type === 'fake' ? 'fakeReport' : type + 's'}Count`]: increment(1)
        });
      }

      await setDoc(voteRef, { type, userId: user.uid });

      // Verificación de auto-borrado
      if (type === 'fake') {
        const freshSnap = await getDoc(doc(db, 'reports', report.id));
        if (freshSnap.exists() && (freshSnap.data().fakeReportCount >= 50)) {
          await deleteDoc(doc(db, 'reports', report.id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModeration = async () => {
    if (secretCode === '01020') {
      try {
        await deleteDoc(doc(db, 'reports', report.id));
        alert("Publicación eliminada por moderación.");
      } catch (err) { console.error(err); }
    } else {
      alert("Código de moderación inválido.");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      await addDoc(collection(db, `reports/${report.id}/comments`), {
        text: newComment,
        authorId: user.uid,
        authorName: user.displayName || 'Anónimo',
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 tracking-tight">{report.authorName}</p>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Search className="w-3 h-3" />
                {report.createdAt?.toDate().toLocaleDateString('es-PA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) || 'Procesando...'}
              </p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setModerationMenu(!moderationMenu)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
            <AnimatePresence>
              {moderationMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 shadow-2xl rounded-2xl z-20 py-2"
                >
                  <button 
                    onClick={() => { setShowCodeInput(true); setModerationMenu(false); }}
                    className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <ShieldCheck className="w-4 h-4 text-legal-600" /> Moderación Especial
                  </button>
                  <button 
                    onClick={() => { handleVote('fake'); setModerationMenu(false); }}
                    className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <Flag className="w-4 h-4" /> Reportar Denuncia Falsa
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed mb-8 text-lg font-medium whitespace-pre-wrap">
          {report.text}
        </p>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 pt-6 border-t border-slate-50">
          <button 
            onClick={() => handleVote('like')}
            className="flex items-center gap-2 group transition-colors"
          >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-green-50 text-slate-400 group-hover:text-green-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-600 group-hover:text-green-600">{report.likesCount}</span>
          </button>
          
          <button 
            onClick={() => handleVote('dislike')}
            className="flex items-center gap-2 group transition-colors"
          >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-red-50 text-slate-400 group-hover:text-red-600 transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-600 group-hover:text-red-600">{report.dislikesCount}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 group transition-colors"
          >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-legal-50 text-slate-400 group-hover:text-legal-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-600 group-hover:text-legal-600">{comments.length}</span>
          </button>

          <div className="md:ml-auto flex items-center gap-3">
             <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200" />
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-1.5 h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400" style={{ width: `${(report.fakeReportCount / 50) * 100}%` }} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{report.fakeReportCount}/50 REPORTES DE FALSEDAD</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCodeInput && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 py-5 bg-legal-900 border-t border-legal-800 flex flex-col sm:flex-row items-center gap-5"
          >
            <p className="text-xs font-bold text-legal-300 uppercase shrink-0">MODERACIÓN RESTRINGIDA:</p>
            <div className="flex-1 flex gap-3 w-full">
              <input 
                type="password" 
                placeholder="Código Secreto"
                className="flex-1 bg-legal-800 border-none p-3 rounded-xl text-sm text-white placeholder-legal-600 outline-none ring-2 ring-transparent focus:ring-legal-500"
                maxLength={5}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
              />
              <button 
                onClick={handleModeration}
                className="bg-red-500 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg hover:bg-red-600 transition-colors uppercase tracking-widest"
              >
                Ejecutar
              </button>
              <button onClick={() => setShowCodeInput(false)} className="p-3 text-legal-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 p-8 border-t border-slate-100 space-y-6"
          >
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative">
                       <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{comment.authorName}</p>
                          <span className="text-[9px] text-slate-400">{comment.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Sin comentarios aún</p>
              )}
            </div>

            <form onSubmit={handlePostComment} className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-legal-500/10 transition-all">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escriba su aporte o comentario..."
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-medium text-slate-700"
              />
              <button 
                disabled={!user || !newComment.trim()}
                className="bg-legal-800 text-white p-3 rounded-xl disabled:opacity-30 hover:bg-legal-900 transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
