import { motion } from 'framer-motion';

interface AtomoQuanticoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function AtomoQuanticoLogo({ size = 'sm', showText = false }: AtomoQuanticoLogoProps) {
  // Define os tamanhos baseado na prop
  const sizes = {
    sm: { svg: 40, nucleus: 4, orbits: [16, 12, 10] },
    md: { svg: 80, nucleus: 8, orbits: [32, 24, 20] },
    lg: { svg: 150, nucleus: 15, orbits: [60, 45, 38] },
    xl: { svg: 300, nucleus: 30, orbits: [120, 90, 75] }
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          width={s.svg}
          height={s.svg}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_8px_rgba(123,97,255,0.5)]"
        >
          {/* Definição de Gradientes */}
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(123,97,255,0.1)" />
              <stop offset="50%" stopColor="rgba(123,97,255,0.3)" />
              <stop offset="100%" stopColor="rgba(123,97,255,0.1)" />
            </linearGradient>
            <radialGradient id="nucleusGradient">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>

          {/* Órbitas */}
          {[0, 60, 120].map((rotation, i) => (
            <g key={i} transform={`rotate(${rotation} 50 50)`}>
              <ellipse
                cx="50"
                cy="50"
                rx="45"
                ry="15"
                stroke="url(#orbitGradient)"
                strokeWidth="0.5"
              />
              {/* Elétrons (Animação de movimento ao longo da órbita) */}
              <motion.circle
                cx="50"
                cy="50"
                r="2.5"
                fill="#C084FC"
                style={{
                  offsetPath: "ellipse(45px 15px at 50% 50%)",
                  offsetDistance: "0%"
                }}
                animate={{
                  offsetDistance: "100%"
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </g>
          ))}

          {/* Núcleo Central */}
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#nucleusGradient)"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <h1 className="text-4xl font-black tracking-[0.2em] text-white uppercase italic">
            Átomo <span className="text-secondary">Quântico</span>
          </h1>
          <p className="text-text-secondary text-[10px] uppercase tracking-[0.5em] mt-2 opacity-50">
            Frequência da Gratidão
          </p>
        </motion.div>
      )}
    </div>
  );
}
