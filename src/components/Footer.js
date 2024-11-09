export default function Footer() {
    return (
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Blog do Flamengo. Todos os direitos reservados.</p>
        </div>
      </footer>
    );
}