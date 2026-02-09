import { Mail, Phone } from 'lucide-react';

export function Contact() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-quantum-blue mb-4">Entre em Contato</h1>
      <p className="text-gray-700 mb-6">Adoraríamos ouvir de você! Entre em contato conosco através dos canais abaixo.</p>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="text-quantum-violet" />
          <a href="mailto:contato@quantum.com" className="text-gray-700 hover:text-quantum-blue">contato@quantum.com</a>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="text-quantum-violet" />
          <span className="text-gray-700">+55 (11) 99999-9999</span>
        </div>
      </div>
    </div>
  );
}