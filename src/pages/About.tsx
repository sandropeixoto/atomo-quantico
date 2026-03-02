import { motion } from 'framer-motion';
import { Youtube, Send, Bell, Users } from 'lucide-react';

export function About() {
  const socialLinks = [
    {
      name: 'Grupo WhatsApp',
      icon: <Users size={24} />,
      description: 'Participe da nossa comunidade e troque experiências de gratidão.',
      color: 'bg-emerald-500',
      link: 'https://chat.whatsapp.com/KOllIdR1uvABKsUvicyJcJ'
    },
    {
      name: 'Lista de Transmissão',
      icon: <Bell size={24} />,
      description: 'Receba insights e lembretes diários diretamente no seu celular.',
      color: 'bg-blue-500',
      link: 'https://whatsapp.com/channel/0029VaCeG5LKgsNljHG89L1v'
    },
    {
      name: 'Canal no YouTube',
      icon: <Youtube size={24} />,
      description: 'Vídeos sobre física quântica, gratidão e evolução da consciência.',
      color: 'bg-red-600',
      link: 'https://www.youtube.com/atomoquantico'
    },
    {
      name: 'Grupo Telegram',
      icon: <Send size={24} />,
      description: 'Conteúdos exclusivos e discussões aprofundadas sobre o projeto.',
      color: 'bg-sky-500',
      link: 'https://t.me/grupoatomoquantico'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto text-text-primary px-4 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-center mb-12 uppercase italic tracking-wider"
      >
        Sobre o <span className="text-secondary">Átomo Quântico</span>
      </motion.h1>

      {/* Seção Sobre */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-xl mb-12"
      >
        <h2 className="text-3xl font-black mb-4 uppercase italic text-text-primary">O Que É?</h2>
        <p className="text-text-secondary leading-relaxed text-lg">
          O Átomo Quântico é uma aplicação de código aberto, construída para ser um espaço seguro e acolhedor onde os usuários podem cultivar o hábito da gratidão. Através de um diário pessoal, é possível registrar pensamentos e momentos pelos quais se é grato, com a opção de compartilhar essas reflexões com a comunidade.
        </p>
      </motion.section>

      {/* Seção de Redes Sociais */}
      <section className="mb-16">
        <h2 className="text-2xl font-black mb-8 uppercase italic tracking-widest text-center flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-secondary/50"></span>
          Conexão Quântica
          <span className="h-px w-8 bg-secondary/50"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 hover:border-secondary/30 transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 ${social.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>
              <div className={`${social.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/20`}>
                {social.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-secondary transition-colors">{social.name}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{social.description}</p>
              <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                Conectar &rarr;
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Seção de Gamificação (FAQ) */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-primary/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-xl"
      >
        <h2 className="text-3xl font-black mb-8 uppercase italic">Guia da Jornada</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Fótons e Níveis */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-secondary uppercase italic">O que são Fótons e Níveis?</h3>
            <p className="text-text-secondary leading-relaxed">
              Cada vez que você faz uma anotação em seu diário, você ganha <strong>Fótons</strong>, que são como seus pontos de energia no aplicativo. Acumular fótons permite que você suba de <strong>Nível</strong>. Pense nisso como uma representação do seu progresso e comprometimento contínuo com a prática da gratidão.
            </p>
          </div>

          {/* Nível de Entropia */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-secondary uppercase italic">O que é o Nível de Entropia?</h3>
            <p className="text-text-secondary leading-relaxed">
              O Nível de Entropia é uma medida da sua <strong>consistência</strong>. Ele reflete a sua sequência de anotações diárias e possui três estados:
            </p>
            <ul className="mt-4 space-y-3 text-text-secondary">
              <li className="flex items-start gap-2 italic">
                <span className="text-secondary font-black">01</span>
                <span><strong>Alta Entropia:</strong> Sequência de 0 a 2 dias. Representa o início ou uma pausa.</span>
              </li>
              <li className="flex items-start gap-2 italic">
                <span className="text-secondary font-black">02</span>
                <span><strong>Estado Estacionário:</strong> Sequência de 3 a 6 dias. Hábito sendo construído!</span>
              </li>
              <li className="flex items-start gap-2 italic">
                <span className="text-secondary font-black">03</span>
                <span><strong>Coerência Quântica:</strong> 7 dias ou mais. Prática consistente e focada!</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
