'use client'

export default function NewsletterSignup() {
  return (
    <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg my-8">
      <h3 className="text-xl font-bold mb-4">Fique por dentro das novidades</h3>
      <div className="flex gap-2">
        <input 
          type="email" 
          placeholder="Seu melhor e-mail" 
          className="flex-1 px-4 py-2 rounded text-black"
        />
        <button className="btn bg-black text-white hover:bg-white hover:text-black">
          Inscrever
        </button>
      </div>
    </div>
  );
}