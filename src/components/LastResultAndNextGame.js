'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Trophy, AlertCircle, Loader2 } from 'lucide-react';

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

const GameInfo = ({ icon: Icon, text }) => (
  <div className="flex items-center justify-center gap-1 text-gray-600">
    <Icon size={14} />
    <span className="text-sm">{text}</span>
  </div>
);

const TeamDisplay = ({ badge, name, abbreviation }) => (
  <div className="flex flex-col items-center min-w-[120px]">
    <div className="w-12 h-12 relative mb-2">
      <Image
        src={badge}
        alt={name}
        fill
        className="object-contain"
      />
    </div>
    <span className="font-semibold text-gray-800 text-center whitespace-nowrap">
      {abbreviation}
    </span>
  </div>
);

const ScoreDisplay = ({ score, isNext = false }) => (
  <div className={`font-bold text-2xl flex-shrink-0 w-20 text-center
    ${isNext ? 'text-gray-400' : score.split('x')[0] > score.split('x')[1] 
      ? 'text-green-600' 
      : score.split('x')[0] < score.split('x')[1] 
        ? 'text-red-600' 
        : 'text-gray-600'
    }`}
  >
    {isNext ? 'VS' : score}
  </div>
);

const GameSection = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
    <div className="flex justify-center items-center space-x-8">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-16" />
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
    <div className="flex justify-center gap-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-4">
    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
    <p className="text-gray-600 mb-3">{message}</p>
    <button
      onClick={onRetry}
      className="text-red-600 hover:text-red-700 font-medium transition-colors"
    >
      Tentar novamente
    </button>
  </div>
);

const LastResultAndNextGame = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/flamengoGames?last=1&next=5');
      if (!res.ok) {
        throw new Error('Falha ao buscar dados da API');
      }
      const fetchedData = await res.json();

      setData(fetchedData);
      localStorage.setItem('flamengoGamesData', JSON.stringify(fetchedData));
    } catch (error) {
      setError(error.message);
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const storedData = localStorage.getItem('flamengoGamesData');
    if (storedData) {
      setData(JSON.parse(storedData));
      setIsLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 36000000); // 10 hours

    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        <SkeletonLoader />
        <div className="border-t border-gray-100 pt-6">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  const { resultados, proximosJogos } = data;
  const lastResult = resultados[0];
  const nextGame = proximosJogos[0];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
      {/* Último Resultado */}
      <GameSection title="Último Resultado">
        <div className="flex items-center justify-center gap-6">
          <TeamDisplay 
            badge={lastResult.flamengoBadge ?? '/assets/flamengo.png'}
            name="Flamengo"
            abbreviation={getTeamAbbreviation('Flamengo')}
          />
          <ScoreDisplay score={lastResult.placar} />
          <TeamDisplay 
            badge={lastResult.adversarioBadge}
            name={lastResult.adversario}
            abbreviation={getTeamAbbreviation(lastResult.adversario)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
      <GameInfo icon={Calendar} text={lastResult.data} />
      {lastResult.horario && <GameInfo icon={Clock} text={lastResult.horario} />}
      <GameInfo icon={Trophy} text={lastResult.campeonato} />
    </div>
      </GameSection>

      {/* Divisor */}
      <div className="border-t border-gray-100" />

      {/* Próximo Jogo */}
      <GameSection title="Próximo Jogo">
        <div className="flex items-center justify-center gap-6">
          <TeamDisplay 
            badge={nextGame.flamengoBadge ?? '/assets/flamengo.png'}
            name="Flamengo"
            abbreviation={getTeamAbbreviation('Flamengo')}
          />
          <ScoreDisplay isNext />
          <TeamDisplay 
            badge={nextGame.adversarioBadge}
            name={nextGame.adversario}
            abbreviation={getTeamAbbreviation(nextGame.adversario)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <GameInfo icon={Calendar} text={nextGame.data} />
          <GameInfo icon={Clock} text={nextGame.horario} />
          <GameInfo icon={Trophy} text={nextGame.campeonato} />
        </div>
      </GameSection>
    </div>
  );
};

export default LastResultAndNextGame;