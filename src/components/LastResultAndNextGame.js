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
  <div className="flex items-center justify-center gap-1.5 text-gray-600 dark:text-gray-400 animate-fade-in">
    <Icon size={16} className="text-flamengoRed" />
    <span className="text-sm font-medium">{text}</span>
  </div>
));

GameInfo.displayName = 'GameInfo';

const TeamDisplay = memo(({ badge, name, abbreviation }) => {
  const [imgError, setImgError] = useState(false);
  const defaultBadge = name === 'Flamengo' ? '/assets/flamengo.png' : '/assets/logooficialrubronews.png';

  return (
    <div className="flex flex-col items-center min-w-[100px] max-w-[140px] px-2 group animate-fade-in">
      <div className="w-16 h-16 relative mb-3 transform transition-transform duration-300 group-hover:scale-110">
        <MemoizedImage
          src={imgError ? defaultBadge : (badge || defaultBadge)}
          alt={name}
          fill
          sizes="(max-width: 768px) 64px, 64px"
          priority={true}
          className="object-contain drop-shadow-lg transition-opacity duration-300"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="w-full">
        <span 
          className="font-bold text-gray-800 dark:text-white text-center block truncate text-lg"
          title={name}
        >
          {abbreviation}
        </span>
      </div>
    </div>
  );
});

TeamDisplay.displayName = 'TeamDisplay';

const ScoreDisplay = ({ score, isNext = false }) => {
  const getScoreColor = (score) => {
    if (!score || isNext) return 'text-flamengoRed animate-pulse';
    
    const [home, away] = score.split('x').map(Number);
    if (home > away) return 'text-green-600 animate-fade-in scale-110';
    if (home < away) return 'text-flamengoRed animate-fade-in scale-110';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`font-bold text-3xl flex-shrink-0 w-24 text-center transform transition-all duration-300 ${getScoreColor(score)}`}>
      {isNext ? 'VS' : score}
    </div>
  );
};

const GameSection = ({ title, children }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 animate-fade-in">
    <h3 className="text-xl font-bold mb-6 text-center text-flamengoRed dark:text-white">
      {title}
    </h3>
    <div className="space-y-6 px-4">
      {children}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto" />
    <div className="flex justify-center items-center space-x-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
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
  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center animate-fade-in">
    <AlertCircle className="w-16 h-16 text-flamengoRed mx-auto mb-6 animate-bounce" />
    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-flamengoRed hover:bg-flamengoRed/90 text-white rounded-lg
               inline-flex items-center gap-2 group transition-all duration-300"
    >
      <span>Tentar novamente</span>
      <Loader2 className="w-4 h-4 animate-spin group-hover:rotate-180 transition-transform" />
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
      const res = await fetch('/api/flamengoGames?last=5&next=5')

      if (!res.ok) {
        throw new Error('Falha ao buscar dados da API');
      }
      const fetchedData = await res.json();
      
      if (!fetchedData?.resultados?.length && !fetchedData?.proximosJogos?.length) {
        throw new Error('Nenhum jogo encontrado');
      }

      setData(fetchedData);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao buscar jogos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 36000000); 

    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
        <SkeletonLoader />
        <SkeletonLoader />
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

  if (!data?.resultados?.length || !data?.proximosJogos?.length) {
    return (
      <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
        <ErrorState 
          message="Nenhum jogo encontrado. Tente novamente mais tarde." 
          onRetry={fetchData} 
        />
      </div>
    );
  }

  const lastResult = data.resultados[0];
  const nextGame = data.proximosJogos[0];

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
      {lastResult && (
        <GameSection title="Último Resultado">
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="flex justify-center items-center space-x-4">
              <TeamDisplay
                badge={lastResult.flamengoBadge || '/assets/flamengo.png'}
                name="Flamengo"
                abbreviation="FLA"
              />
              <ScoreDisplay score={lastResult.placar} />
              <TeamDisplay
                badge={lastResult.adversarioBadge || '/assets/placeholder-team.png'}
                name={lastResult.adversario}
                abbreviation={getTeamAbbreviation(lastResult.adversario)}
              />
            </div>
          </div>
          <div className="flex justify-center space-x-8">
            <GameInfo
              icon={Calendar}
              text={lastResult.data}
            />
            <GameInfo icon={Trophy} text={lastResult.campeonato} />
          </div>
        </GameSection>
      )}

      {nextGame && (
        <GameSection title="Próximo Jogo">
          <div className="flex justify-center items-center space-x-6 mb-6">
            <TeamDisplay
              badge={nextGame.flamengoBadge || '/assets/flamengo.png'}
              name="Flamengo"
              abbreviation="FLA"
            />
            <ScoreDisplay score="" isNext />
            <TeamDisplay
              badge={nextGame.adversarioBadge || '/assets/placeholder-team.png'}
              name={nextGame.adversario}
              abbreviation={getTeamAbbreviation(nextGame.adversario)}
            />
          </div>
          <div className="flex justify-center space-x-8">
            <GameInfo
              icon={Calendar}
              text={nextGame.data}
            />
            <GameInfo
              icon={Clock}
              text={nextGame.horario}
            />
            <GameInfo icon={Trophy} text={nextGame.campeonato} />
          </div>
        </GameSection>
      )}
    </div>
  );
};

export default LastResultAndNextGame;