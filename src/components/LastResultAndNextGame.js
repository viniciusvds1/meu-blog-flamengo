'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const teamAbbreviations = {
  'Flamengo': 'FLA',
  'Atletico Mineiro': 'CAM',
  'Atletico-MG': 'CAM',
  'Palmeiras': 'PAL',
  'São Paulo': 'SAO',
  'Santos': 'SAN',
  'Corinthians': 'COR',
  'Internacional': 'INT',
  'Grêmio': 'GRE',
  'Fluminense': 'FLU',
  'Botafogo': 'BOT',
  'Vasco': 'VAS',
  'Athletico Paranaense': 'CAP',
  'Athletico-PR': 'CAP',
  'Bragantino': 'RBB',
  'Red Bull Bragantino': 'RBB',
  'Bahia': 'BAH',
  'Fortaleza': 'FOR',
  'Cruzeiro': 'CRU',
  'Cuiabá': 'CUI',
  'Goiás': 'GOI',
  'América Mineiro': 'AME',
  'América-MG': 'AME',
  'Coritiba': 'CFC',
  'Juventude': 'JUV',
  'Sport': 'SPT',
  'Vitória': 'VIT',
};

const getTeamAbbreviation = (teamName) => {
  return teamAbbreviations[teamName] || teamName;
};

const LastResultAndNextGame = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('flamengoGamesData');

    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/flamengoGames?last=1&next=1');
          if (!res.ok) {
            throw new Error('Falha ao buscar dados da API');
          }
          const fetchedData = await res.json();

          setData(fetchedData);
          localStorage.setItem('flamengoGamesData', JSON.stringify(fetchedData));
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      };

      fetchData();
    }
  }, []);

  if (!data) {
    return <div>Carregando...</div>;
  }

  const { resultados, proximosJogos } = data;

  const lastResult = resultados[0];
  const nextGame = proximosJogos[0];

  return (
    <div className="bg-base-100 shadow-xl p-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-center">Último Resultado</h3>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 relative">
              <Image src={lastResult.flamengoBadge} alt="Flamengo Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <span className="font-semibold text-lg mx-1 w-16 text-center">
              {getTeamAbbreviation('Flamengo')}
            </span>
            <span className="font-bold text-lg mx-2 flex-none">
              {lastResult.placar}
            </span>
            <span className="font-semibold text-lg mx-1 w-16 text-center">
              {getTeamAbbreviation(lastResult.adversario)}
            </span>
            <div className="w-6 h-6 relative">
              <Image src={lastResult.adversarioBadge} alt={`${lastResult.adversario} Logo`} fill style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1 text-center">
            {lastResult.data}, {lastResult.horario}, {lastResult.campeonato}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2 text-center">Próximo Jogo</h3>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 relative">
              <Image src={nextGame.flamengoBadge} alt="Flamengo Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <span className="font-semibold text-lg mx-1 w-16 text-center">
              {getTeamAbbreviation('Flamengo')}
            </span>
            <span className="text-lg font-bold mx-1 w-10 text-center">vs</span>
            <span className="font-semibold text-lg mx-1 w-16 text-center">
              {getTeamAbbreviation(nextGame.adversario)}
            </span>
            <div className="w-6 h-6 relative">
              <Image src={nextGame.adversarioBadge} alt={`${nextGame.adversario} Logo`} fill style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1 text-center">
            {nextGame.data}, {nextGame.horario}, {nextGame.campeonato}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastResultAndNextGame;