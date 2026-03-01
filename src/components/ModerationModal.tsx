import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, UserMinus, EyeOff, Eye } from 'lucide-react';

export const MODERATION_REASONS = [
  { id: 'off_topic', label: 'Fora de Propósito', description: 'Conteúdo não condiz com o tema de gratidão e evolução.' },
  { id: 'toxic', label: 'Comportamento Tóxico', description: 'Linguagem imprópria ou desrespeitosa.' },
  { id: 'spam', label: 'Spam/Propaganda', description: 'Publicidade ou repetições indesejadas.' },
  { id: 'misinfo', label: 'Desinformação', description: 'Conteúdo que promove informações falsas ou nocivas.' },
  { id: 'other', label: 'Outro', description: 'Violação das diretrizes da comunidade.' },
];

interface ModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { status: 'active' | 'hidden' | 'removed'; reason: string; blockUser: boolean }) => void;
  targetType: 'post' | 'comment';
  currentStatus?: string;
  authorName: string;
}

export const ModerationModal: React.FC<ModerationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetType,
  currentStatus = 'active',
  authorName,
}) => {
  const [selectedReason, setSelectedReason] = useState(MODERATION_REASONS[0].id);
  const [blockUser, setBlockUser] = useState(false);

  const handleConfirm = () => {
    const reasonObj = MODERATION_REASONS.find(r => r.id === selectedReason);
    onConfirm({
      status: currentStatus === 'active' ? 'hidden' : 'active',
      reason: reasonObj?.label || 'Outro',
      blockUser,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150]"
          />

          <div className="fixed inset-0 flex items-center justify-center z-[160] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1A1625] border border-secondary/30 rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.2)] w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header - Fixo */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-secondary/10 to-transparent shrink-0">
                <div className="flex items-center gap-3 text-secondary">
                  <ShieldAlert size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-wider italic">Moderação</h3>
                </div>
                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Content - Rolável */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                  <p className="text-text-secondary text-xs uppercase tracking-widest mb-2 opacity-60">Ação sobre o conteúdo</p>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    {currentStatus === 'active' ? (
                      <>
                        <EyeOff size={24} className="text-red-400" />
                        <p className="font-bold text-white text-sm">Ocultar este {targetType === 'post' ? 'Post' : 'Comentário'}</p>
                      </>
                    ) : (
                      <>
                        <Eye size={24} className="text-emerald-400" />
                        <p className="font-bold text-white text-sm">Restaurar Conteúdo</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-text-secondary text-xs uppercase tracking-widest mb-3 opacity-60">Motivo da Moderação</p>
                  <div className="grid grid-cols-1 gap-2">
                    {MODERATION_REASONS.map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className={`p-3 rounded-xl text-left transition-all border ${
                          selectedReason === reason.id 
                            ? 'bg-secondary/20 border-secondary text-white' 
                            : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <p className="font-bold text-sm">{reason.label}</p>
                        <p className="text-[10px] opacity-60">{reason.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <UserMinus size={20} className="text-red-400" />
                    <div>
                      <p className="font-bold text-white text-xs">Bloquear Autor</p>
                      <p className="text-[10px] text-red-400/60">{authorName}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={blockUser}
                    onChange={(e) => setBlockUser(e.target.checked)}
                    className="w-5 h-5 rounded bg-black border-white/10 text-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Footer - Fixo */}
              <div className="p-6 bg-black/40 flex gap-3 shrink-0">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 font-bold uppercase tracking-widest text-xs text-text-secondary hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-secondary hover:bg-secondary/80 py-3 rounded-xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-secondary/20 transition-all active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
