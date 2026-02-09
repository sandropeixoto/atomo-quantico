export function Footer() {
  return (
    <footer className="bg-primary text-text-primary py-4 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Quantum. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}