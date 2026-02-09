import { Heart, Target } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-text-primary mb-12">Sobre o Átomo Quântico</h1>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-accent rounded-full p-3">
              <Heart size={24} className="text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Nossa Filosofia</h2>
              <p className="text-text-secondary leading-relaxed mt-2">Acreditamos que a gratidão é uma semente. Quando a cultivamos, ela floresce em uma vida mais positiva e alegre. O Átomo Quântico nasceu do desejo de criar um espaço simples e belo para essa prática transformadora.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-accent rounded-full p-3">
              <Target size={24} className="text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Nossa Missão</h2>
              <p className="text-text-secondary leading-relaxed mt-2">Nossa missão é fornecer uma ferramenta intuitiva e acolhedora que inspire a reflexão e a apreciação pelas pequenas coisas. Queremos que cada "átomo" de gratidão contribua para o seu bem-estar quântico.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          {/* Placeholder for a future image or illustration */}
          <div className="w-64 h-64 bg-accent rounded-full flex items-center justify-center">
            <p className="text-text-secondary italic">"A gratidão dá sentido ao nosso passado, traz paz para o hoje e cria uma visão para o amanhã."</p>
          </div>
        </div>
      </div>
    </div>
  );
}