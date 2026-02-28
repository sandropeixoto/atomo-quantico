export function About() {
  return (
    <div className="max-w-7xl mx-auto text-text-primary px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Sobre o Átomo Quântico</h1>

      {/* Seção Sobre */}
      <section className="bg-primary p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold mb-4">O Que É o Átomo Quântico?</h2>
        <p className="text-text-secondary leading-relaxed">
          O Átomo Quântico é uma aplicação web de código aberto, construída para ser um espaço seguro e acolhedor onde os usuários podem cultivar o hábito da gratidão. Através de um diário pessoal, é possível registrar pensamentos e momentos pelos quais se é grato, com a opção de compartilhar essas reflexões com a comunidade.
        </p>
      </section>

      {/* Seção de Gamificação (FAQ) */}
      <section className="bg-primary p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8">Guia da Gamificação: Entenda Sua Jornada</h2>
        
        <div className="space-y-8">
          {/* Fótons e Níveis */}
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-secondary">O que são Fótons e Níveis?</h3>
            <p className="text-text-secondary leading-relaxed">
              Cada vez que você faz uma anotação em seu diário, você ganha <strong>Fótons</strong>, que são como seus pontos de energia no aplicativo. Acumular fótons permite que você suba de <strong>Nível</strong>. Pense nisso como uma representação do seu progresso e comprometimento contínuo com a prática da gratidão.
            </p>
          </div>

          {/* Nível de Entropia */}
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-secondary">O que é o Nível de Entropia?</h3>
            <p className="text-text-secondary leading-relaxed">
              O Nível de Entropia é uma medida da sua <strong>consistência</strong>. Ele reflete a sua sequência de anotações diárias e possui três estados:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-text-secondary">
              <li><strong>Alta Entropia:</strong> Uma sequência de 0 a 2 dias. Representa o início da sua jornada ou uma pequena pausa.</li>
              <li><strong>Estado Estacionário:</strong> Uma sequência de 3 a 6 dias. Você está começando a construir um hábito sólido!</li>
              <li><strong>Coerência Quântica:</strong> Uma sequência de 7 dias ou mais. Você alcançou um estado de prática consistente e focada!</li>
            </ul>
          </div>

          {/* Conquistas (Badges) */}
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-secondary">O que são as Conquistas (Badges)?</h3>
            <p className="text-text-secondary leading-relaxed">
              Conquistas são recompensas especiais que você desbloqueia ao atingir marcos específicos em sua jornada. Elas celebram seu progresso e dedicação. Alguns exemplos incluem:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-text-secondary">
              <li><strong>Nível X:</strong> Desbloqueado sempre que você sobe de nível.</li>
              <li><strong>Observador (Bronze):</strong> Concedido ao fazer suas primeiras 7 anotações.</li>
              <li><strong>Coerente (Prata):</strong> Concedido ao manter uma sequência de 7 dias consecutivos.</li>
               <li><strong>Status de Entropia:</strong> Concedido ao alcançar novos status, como o 'Estado Estacionário'.</li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
