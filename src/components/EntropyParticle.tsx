import { useUserProgressStore } from '../stores/userProgressStore';

const particleStyles = {
    base: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        transition: 'all 0.5s ease-in-out',
        position: 'relative' as 'relative',
    },
    status: {
        'Alta Entropia': {
            backgroundColor: '#a855f7', // Roxo
            boxShadow: '0 0 5px #a855f7',
        },
        'Estado Estacionário': {
            backgroundColor: '#34d399', // Verde
            boxShadow: '0 0 15px #34d399, 0 0 25px #34d399',
        },
        'Coerência Quântica': {
            backgroundColor: '#f59e0b', // Amarelo/Laranja
            boxShadow: '0 0 25px #f59e0b, 0 0 40px #f59e0b, 0 0 60px #f59e0b',
            animation: 'pulse 2s infinite'
        }
    }
}

export function EntropyParticle() {
    const { entropyStatus } = useUserProgressStore();

    const currentStyle = {
        ...particleStyles.base,
        ...(particleStyles.status[entropyStatus] || particleStyles.status['Alta Entropia'])
    };

    return (
        <div className="flex flex-col items-center">
            <div style={currentStyle} />
            <p className="text-text-secondary mt-3 text-sm font-semibold">
                {entropyStatus}
            </p>

            {/* Keyframes para a animação de pulso */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
