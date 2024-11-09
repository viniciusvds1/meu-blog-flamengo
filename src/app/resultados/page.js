'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Resultados() {
  const [data, setData] = useState({ resultados: [], proximosJogos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('flamengoGamesData');

    if (storedData) {
      setData(JSON.parse(storedData));
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/flamengoGames?last=5&next=5');
          if (!res.ok) {
            throw new Error('Falha ao buscar dados da API');
          }
          const fetchedData = await res.json();

          setData(fetchedData);
          localStorage.setItem('flamengoGamesData', JSON.stringify(fetchedData));
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const { resultados, proximosJogos } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Últimos Jogos */}
      <h1 className="text-4xl font-bold mb-6 text-center">Últimos Resultados do Flamengo</h1>
      {resultados.length === 0 ? (
        <p className="text-center">Nenhum resultado disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {resultados.map((resultado) => (
            <div
              key={resultado.id}
              className={`p-4 rounded shadow ${
                resultado.resultado === 'V'
                  ? 'bg-green-100 border border-green-400'
                  : resultado.resultado === 'D'
                  ? 'bg-red-100 border border-red-400'
                  : 'bg-gray-100 border border-gray-400'
              }`}
            >
              {/* Placar e Times com Logos */}
              <div className="flex justify-center items-center">
                {/* Logo Flamengo */}
                <div className="w-8 h-8 relative">
                  <Image
                    src={resultado.flamengoBadge}
                    alt="Flamengo Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {/* Nome Flamengo */}
                <span className="font-semibold text-lg mx-2 w-28 text-center">
                  Flamengo
                </span>
                {/* Placar */}
                <span className="text-3xl font-bold">{resultado.placar}</span>
                {/* Nome Adversário */}
                <span className="font-semibold text-lg mx-2 w-28 text-center">
                  {resultado.adversario}
                </span>
                {/* Logo Adversário */}
                <div className="w-8 h-8 relative">
                  <Image
                    src={resultado.adversarioBadge}
                    alt={`${resultado.adversario} Logo`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              {/* Data, Local e Campeonato */}
              <div className="text-sm text-gray-600 mt-1 text-center">
                {resultado.data}, {resultado.local}, {resultado.campeonato}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Próximos Jogos */}
      <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Próximos Jogos do Flamengo</h2>
      {proximosJogos.length === 0 ? (
        <p className="text-center">Nenhum próximo jogo disponível no momento.</p>
      ) : (
        <div className="space-y-6">
          {proximosJogos.map((jogo) => (
            <div
              key={jogo.id}
              className="p-4 rounded shadow bg-gray-100 border border-gray-400"
            >
              {/* Placar e Times com Logos */}
              <div className="flex justify-center items-center">
                {/* Logo Flamengo */}
                <div className="w-8 h-8 relative">
                  <Image
                    src={jogo.flamengoBadge}
                    alt="Flamengo Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {/* Nome Flamengo */}
                <span className="font-semibold text-lg mx-2 w-28 text-center">
                  Flamengo
                </span>
                {/* vs */}
                <span className="text-lg font-bold mx-2 w-12 text-center">vs</span>
                {/* Nome Adversário */}
                <span className="font-semibold text-lg mx-2 w-28 text-center">
                  {jogo.adversario}
                </span>
                {/* Logo Adversário */}
                <div className="w-8 h-8 relative">
                  <Image
                    src={jogo.adversarioBadge}
                    alt={`${jogo.adversario} Logo`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              {/* Data, Local e Campeonato */}
              <div className="text-sm text-gray-600 mt-1 text-center">
                {jogo.data}, {jogo.horario}, {jogo.campeonato}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
