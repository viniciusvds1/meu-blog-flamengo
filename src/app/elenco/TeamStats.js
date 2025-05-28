// TeamStats.js
'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export default function TeamStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    resultados: [],
    proximosJogos: [],
    tabelaBrasileiro: null,
    tabelaCarioca: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/flamengoGames?last=3&next=3');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do time');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-black/30 p-6 rounded-xl mb-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Carregando estatísticas do time...</h3>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-black/30 p-6 rounded-xl mb-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Estatísticas não disponíveis</h3>
        <p className="text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black/30 p-6 rounded-xl mb-8">
      <h3 className="text-2xl font-bold mb-6 text-white">Estatísticas do Time</h3>
      
      {/* Últimos Resultados */}
      {stats.resultados && stats.resultados.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-3 text-red-500">Últimos Jogos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.resultados.map(jogo => (
              <div key={jogo.id} className="bg-gradient-to-b from-gray-900 to-black p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{jogo.data}</span>
                  <span className="text-white font-semibold bg-red-600 px-2 py-0.5 rounded text-xs">
                    {jogo.campeonato}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 relative">
                      <OptimizedImage 
                        src={jogo.flamengoBadge} 
                        alt="Flamengo" 
                        width={32} 
                        height={32}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <span className="text-white font-medium">Flamengo</span>
                  </div>
                  
                  <span className="text-white font-bold text-xl">{jogo.placar}</span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{jogo.adversario}</span>
                    <div className="w-8 h-8 relative">
                      <OptimizedImage 
                        src={jogo.adversarioBadge} 
                        alt={jogo.adversario} 
                        width={32} 
                        height={32}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Próximos Jogos */}
      {stats.proximosJogos && stats.proximosJogos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-3 text-red-500">Próximos Jogos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.proximosJogos.map(jogo => (
              <div key={jogo.id} className="bg-gradient-to-b from-gray-900 to-black p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{jogo.data} - {jogo.horario}</span>
                  <span className="text-white font-semibold bg-red-600 px-2 py-0.5 rounded text-xs">
                    {jogo.campeonato}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 relative">
                      <OptimizedImage 
                        src={jogo.flamengoBadge} 
                        alt="Flamengo" 
                        width={32} 
                        height={32}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <span className="text-white font-medium">Flamengo</span>
                  </div>
                  
                  <span className="text-white font-bold text-xl">x</span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{jogo.adversario}</span>
                    <div className="w-8 h-8 relative">
                      <OptimizedImage 
                        src={jogo.adversarioBadge} 
                        alt={jogo.adversario} 
                        width={32} 
                        height={32}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabela do Brasileiro */}
      {stats.tabelaBrasileiro && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-3 text-red-500">Tabela Brasileirão</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-white">
              <thead className="bg-red-900">
                <tr>
                  <th className="px-4 py-2 text-left">Pos</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-center">P</th>
                  <th className="px-4 py-2 text-center">J</th>
                  <th className="px-4 py-2 text-center">V</th>
                  <th className="px-4 py-2 text-center">E</th>
                  <th className="px-4 py-2 text-center">D</th>
                  <th className="px-4 py-2 text-center">SG</th>
                </tr>
              </thead>
              <tbody>
                {stats.tabelaBrasileiro.slice(0, 5).map((time, index) => {
                  const isFlamengo = time.time === "Flamengo";
                  return (
                    <tr key={index} className={`${isFlamengo ? 'bg-red-800/30' : (index % 2 === 0 ? 'bg-gray-900/50' : 'bg-black/50')}`}>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.posicao}</td>
                      <td className="px-4 py-2 border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 relative">
                            <OptimizedImage 
                              src={time.logo} 
                              alt={time.time} 
                              width={24} 
                              height={24}
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <span className={`${isFlamengo ? 'font-bold text-red-500' : ''}`}>{time.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.pontos}</td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.jogos}</td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.vitorias}</td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.empates}</td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.derrotas}</td>
                      <td className="px-4 py-2 border-b border-gray-800 text-center">{time.saldoGols}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
