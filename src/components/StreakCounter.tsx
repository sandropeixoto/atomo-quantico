import { useUserProgressStore } from '../stores/userProgressStore';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StreakCounter = () => {
    const { currentStreak, isInitialized } = useUserProgressStore();

    if (!isInitialized) return null;

    return (
        <div className="relative group flex items-center gap-1 bg-background/50 hover:bg-background/80 transition-colors px-3 py-1.5 rounded-full border border-gray-800 hover:border-orange-500/30 cursor-help">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStreak}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <Flame
                        size={18}
                        className={`${currentStreak > 0 ? "text-orange-500 fill-orange-500/20" : "text-gray-500"} transition-colors duration-300`}
                        strokeWidth={2.5}
                    />
                </motion.div>
            </AnimatePresence>

            <span className={`font-bold text-sm ${currentStreak > 0 ? "text-orange-100" : "text-gray-500"}`}>
                {currentStreak}
            </span>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-xs text-center shadow-xl">
                <p className="font-semibold text-orange-400 mb-1">Sequência de Gratidão</p>
                <p className="text-gray-300">
                    {currentStreak > 0
                        ? `Você registrou gratidão por ${currentStreak} dia${currentStreak > 1 ? 's' : ''} consecutivo${currentStreak > 1 ? 's' : ''}! 🔥`
                        : "Comece sua sequência hoje registrando algo pelo qual é grato!"}
                </p>
            </div>
        </div>
    );
};

export default StreakCounter;
