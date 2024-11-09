// src/components/Resultados.jsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Resultados() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResultados = async () => {
    const TEAM_ID = 127; // Substitua pelo ID correto do Flamengo
    const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${TEAM_ID}&last=5&next=5`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao buscar dados da API');
      }

      const result = await res.json();

      if (!result.response) {
        setData(null);
        return;
      }

      // Processar dados
      const ultimos5 = result.response.filter(fixture => fixture.fixture.status.short !== 'TBD' && fixture.fixture.status.short !== 'SUSP').slice(0,5);
      const proximos5 = result.response.filter(fixture => fixture.fixture.status.short === 'TBD').slice(0,5);

      const processedData = {
        ultimosJogos: ultimos5.map(fixture => {
          const isHome = fixture.teams.home.name.toLowerCase() === 'flamengo';
          const golsFlamengo = isHome ? fixture.goals.home : fixture.goals.away;
          const golsAdversario = isHome ? fixture.goals.away : fixture.goals.home;
          let resultado;

          if (golsFlamengo > golsAdversario) {
            resultado = 'V'; // Vitória
          } else if (golsFlamengo < golsAdversario) {
            resultado = 'D'; // Derrota
          } else {
            resultado = 'E'; // Empate
          }

          return {
            id: fixture.fixture.id,
            adversario: isHome ? fixture.teams.away.name : fixture.teams.home.name,
            placar: `${golsFlamengo} - ${golsAdversario}`,
            resultado,
            adversarioBadge: isHome ? fixture.teams.away.logo : fixture.teams.home.logo,
            flamengoBadge: isHome ? fixture.teams.home.logo : fixture.teams.away.logo,
            data: new Date(fixture.fixture.date).toLocaleDateString('pt-BR'),
            hora: new Date(fixture.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            campeonato: fixture.league.name,
            local: isHome ? 'Casa' : 'Fora',
          };
        }),
        proximosJogos: proximos5.map(fixture => {
          const isHome = fixture.teams.home.name.toLowerCase() === 'flamengo';
          return {
            id: fixture.fixture.id,
            adversario: isHome ? fixture.teams.away.name : fixture.teams.home.name,
            placar: 'A definir',
            resultado: 'A',
            adversarioBadge: isHome ? fixture.teams.away.logo : fixture.teams.home.logo,
            flamengoBadge: isHome ? fixture.teams.home.logo : fixture.teams.away.logo,
            data: new Date(fixture.fixture.date).toLocaleDateString('pt-BR'),
            hora: new Date(fixture.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            campeonato: fixture.league.name,
            local: isHome ? 'Casa' : 'Fora',
          };
        }),
      };

      setData(processedData);
      localStorage.setItem('flamengoResultados', JSON.stringify(processedData));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      setData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se os dados estão no localStorage
    const storedData = localStorage.getItem('flamengoResultados');
    if (storedData) {
      setData(JSON.parse(storedData));
      setLoading(false);
    } else {
      fetchResultados();
    }
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow rounded">
        <p>Carregando resultados...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-red-100 text-red-700 shadow rounded">
        <p>Não foi possível carregar os resultados no momento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Últimos Jogos */}
      <h1 className="text-4xl font-bold mb-6 text-center">Últimos Resultados do Flamengo</h1>
      {data.ultimosJogos.length === 0 ? (
        <p className="text-center">Nenhum resultado disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {data.ultimosJogos.map((resultado) => (
            <div
              key={resultado.id}
              className={`p-6 rounded shadow flex items-center space-x-6 ${
                resultado.resultado === 'V'
                  ? 'bg-green-100 border border-green-400'
                  : resultado.resultado === 'D'
                  ? 'bg-red-100 border border-red-400'
                  : 'bg-gray-100 border border-gray-400'
              }`}
            >
              {/* Logo do Flamengo */}
              <div className="w-16 h-16 relative">
                {resultado.flamengoBadge ? (
                  <Image
                    src={resultado.flamengoBadge}
                    alt="Flamengo Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={resultado.resultado === 'V'}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Nome do Adversário */}
              <span className="font-semibold text-xl flex-1">{resultado.adversario}</span>

              {/* Placar */}
              <span className="text-3xl font-bold">{resultado.placar}</span>

              {/* Logo do Adversário */}
              <div className="w-16 h-16 relative">
                {resultado.adversarioBadge ? (
                  <Image
                    src={resultado.adversarioBadge}
                    alt={`${resultado.adversario} Logo`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Próximos Jogos */}
      <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Próximos Jogos do Flamengo</h2>
      {data.proximosJogos.length === 0 ? (
        <p className="text-center">Nenhum próximo jogo disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {data.proximosJogos.map((jogo) => (
            <div
              key={jogo.id}
              className={`p-6 rounded shadow flex items-center space-x-6 ${
                jogo.resultado === 'V'
                  ? 'bg-green-100 border border-green-400'
                  : jogo.resultado === 'D'
                  ? 'bg-red-100 border border-red-400'
                  : 'bg-gray-100 border border-gray-400'
              }`}
            >
              {/* Logo do Flamengo */}
              <div className="w-16 h-16 relative">
                {jogo.flamengoBadge ? (
                  <Image
                    src={jogo.flamengoBadge}
                    alt="Flamengo Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Nome do Adversário */}
              <span className="font-semibold text-xl flex-1">{jogo.adversario}</span>

              {/* Placar */}
              <span className="text-3xl font-bold">{jogo.placar}</span>

              {/* Logo do Adversário */}
              <div className="w-16 h-16 relative">
                {jogo.adversarioBadge ? (
                  <Image
                    src={jogo.adversarioBadge}
                    alt={`${jogo.adversario} Logo`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
