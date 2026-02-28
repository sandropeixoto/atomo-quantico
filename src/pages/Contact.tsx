import { Mail, Phone } from 'lucide-react';

export function Contact() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 text-text-primary">
      <h1 className="text-4xl font-bold mb-8">Entre em Contato</h1>
      <p className="text-text-secondary text-lg mb-8 leading-relaxed">
        Adoraríamos ouvir de você! Seja para tirar dúvidas, dar sugestões ou apenas compartilhar sua jornada de gratidão conosco.
      </p>
      <div className="bg-primary p-8 rounded-2xl shadow-lg space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-secondary/20 p-3 rounded-full">
            <Mail className="text-secondary" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary">E-mail</p>
            <a href="mailto:contato@atomoquantico.com" className="text-lg hover:text-secondary transition-colors">contato@atomoquantico.com</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-accent/20 p-3 rounded-full">
            <Phone className="text-accent" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Telefone / WhatsApp</p>
            <span className="text-lg">+55 (11) 99999-9999</span>
          </div>
        </div>
      </div>
    </div>
  );
}