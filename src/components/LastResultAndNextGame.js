'use client';

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Calendar, Trophy, Clock, AlertCircle, Loader2 } from 'lucide-react';

// Memoize static components for better performance
const MemoizedImage = memo(Image);

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

const GameInfo = memo(({ icon: Icon, text }) => (
  <div className="flex items-center justify-center gap-1.5 bg-red-50 text-red-800 px-2 py-1 rounded-full w-full border border-red-100">
    <Icon size={14} className="text-red-600" />
    <span className="text-xs font-medium">{text}</span>
  </div>
));

GameInfo.displayName = 'GameInfo';

// Declare constants outside component to avoid recreating them on each render
const getDefaultBadge = (name) => name === 'Flamengo' ? '/assets/flamengo.png' : '/assets/default-team.png';

const TeamDisplay = memo(({ badge, name, abbreviation }) => {
  // Create the defaultBadge value outside the component to prevent re-creation
  const defaultBadge = getDefaultBadge(name);
  
  // Use a function for error handling instead of useState to avoid hook issues
  const handleImageError = (e) => {
    if (e && e.target) {
      e.target.src = defaultBadge;
      e.target.onerror = null; // Prevent infinite loop
    }
  };

  return (
    <div className="flex flex-col items-center w-14 sm:w-16 md:w-20">
      <div className="bg-white rounded-full p-1 shadow border border-gray-200 mb-1 flex items-center justify-center">
        <MemoizedImage
          src={badge || defaultBadge}
          alt={`${name} badge`}
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          onError={handleImageError}
        />
      </div>
      <span className="font-bold text-xs sm:text-sm text-gray-900">{abbreviation}</span>
    </div>
  );
});

TeamDisplay.displayName = 'TeamDisplay';

const ScoreDisplay = ({ score, isNext = false }) => {
  const getScoreColor = (score) => {
    if (!score || isNext) return 'text-flamengo-red animate-pulse';
    
    const [home, away] = score.split('x').map(Number);
    if (home > away) return 'text-green-600 animate-fade-in scale-110';
    if (home < away) return 'text-flamengo-red animate-fade-in scale-110';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`font-bold text-3xl sm:text-4xl flex-shrink-0 min-w-[60px] w-20 sm:w-24 text-center my-4 sm:my-0 transform transition-all duration-300 ${getScoreColor(score)}`}>
      <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full p-3 shadow-sm">
        {isNext ? 'VS' : score}
      </div>
    </div>
  );
};

const GameSection = ({ title, children }) => (
  <div className="bg-gradient-to-b from-black to-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-red-600/40 p-6 animate-fade-in border border-red-900/30 w-full">
    <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
      <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
        {title}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
      </span>
    </h3>
    <div className="space-y-6 px-2 sm:px-4">
      {children}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="bg-gradient-to-b from-black to-gray-900 rounded-xl overflow-hidden shadow-2xl p-6 animate-pulse space-y-6 border border-red-900/30">
    <div className="h-8 bg-gray-800/50 rounded-lg w-3/4 mx-auto" />
    <div className="flex justify-center items-center space-x-8">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gray-800/50 h-14 w-14" />
        <div className="h-4 bg-gray-800/50 rounded w-10 mt-2" />
      </div>
      <div className="h-10 bg-red-900/40 rounded-lg w-16 mx-4" />
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gray-800/50 h-14 w-14" />
        <div className="h-4 bg-gray-800/50 rounded w-10 mt-2" />
      </div>
    </div>
    <div className="flex justify-between">
      <div className="h-4 bg-gray-800/50 rounded w-20" />
      <div className="h-4 bg-gray-800/50 rounded w-20" />
    </div>
    <div className="h-px bg-red-900/30 w-full" />
    <div className="h-8 bg-gray-800/50 rounded-lg w-3/4 mx-auto" />
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="bg-gradient-to-b from-black to-gray-900 rounded-xl overflow-hidden shadow-lg p-6 text-center border border-red-900/30">
    <div className="flex justify-center">
      <AlertCircle size={40} className="text-red-600 mb-4" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-white">Erro ao carregar dados</h3>
    <p className="text-gray-300 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-500 transition-colors duration-200 font-medium shadow-lg"
    >
      Tentar Novamente
    </button>
  </div>
);

const LastResultAndNextGame = () => {
  const [data, setData] = useState({
    lastResult: null,
    nextGame: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/flamengoGames?last=1&next=1');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados dos jogos');
      }
      
      const gameData = await response.json();
      
      setData({
        lastResult: gameData.resultados?.[0] || null,
        nextGame: gameData.proximosJogos?.[0] || null,
      });
    } catch (error) {
      console.error('Erro ao buscar dados dos jogos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-white">Carregando resultados...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  if (!data.lastResult || !data.nextGame) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
        <ErrorState 
          message="Nenhum jogo encontrado. Tente novamente mais tarde." 
          onRetry={fetchData} 
        />
      </div>
    );
  }

  const { lastResult, nextGame } = {
    lastResult: data.lastResult,
    nextGame: data.nextGame
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-lg p-4 border border-red-600 shadow-sm">
        <h3 className="text-base font-bold text-red-700 mb-3 border-b border-red-200 pb-1 uppercase tracking-tight">
          ÚLTIMO RESULTADO
        </h3>
        <div className="flex items-center justify-between">
          <TeamDisplay badge={lastResult.flamengoBadge || '/assets/flamengo.png'} name="Flamengo" abbreviation="FLA" />
          <div className="font-bold text-xl text-white bg-red-700 px-3 py-1 rounded">
            {lastResult.placar}
          </div>
          <TeamDisplay badge={lastResult.adversarioBadge || '/assets/default-team.png'} name={lastResult.adversario} abbreviation={getTeamAbbreviation(lastResult.adversario)} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
          <GameInfo icon={Calendar} text={lastResult.data} />
          <GameInfo icon={Trophy} text={lastResult.campeonato} />
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-red-600 shadow-sm">
        <h3 className="text-base font-bold text-red-700 mb-3 border-b border-red-200 pb-1 uppercase tracking-tight">
          PRÓXIMO JOGO
        </h3>
        <div className="flex items-center justify-between">
          <TeamDisplay badge={nextGame.flamengoBadge || '/assets/flamengo.png'} name="Flamengo" abbreviation="FLA" />
          <div className="font-bold text-xl text-white bg-red-700 px-3 py-1 rounded animate-pulse">
            VS
          </div>
          <TeamDisplay badge={nextGame.adversarioBadge || '/assets/default-team.png'} name={nextGame.adversario} abbreviation={getTeamAbbreviation(nextGame.adversario)} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-300 flex-wrap gap-1">
          <GameInfo icon={Calendar} text={nextGame.data} />
          <GameInfo icon={Clock} text={nextGame.horario} />
          <GameInfo icon={Trophy} text={<span className="truncate block max-w-[80px] w-full">{nextGame.campeonato}</span>} />
        </div>
      </div>
    </div>
  );
};

export default LastResultAndNextGame;