'use client';

import React, { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { Instagram, Twitter, Loader2 } from 'lucide-react';

// Componente para exibir o card de jogador
function JogadorCard({ jogador }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gradient-to-b from-black to-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-red-600/40 hover:-translate-y-2 border border-red-900/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-72 bg-gradient-to-br from-red-900 to-black p-4 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -inset-10 bg-red-600 blur-3xl"></div>
        </div>
        <div className="relative h-full w-full flex items-center justify-center">
          <OptimizedImage
            src={jogador.foto}
            alt={jogador.nome}
            className={`rounded-lg object-contain max-h-full max-w-full z-10 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            aspectRatio="aspect-auto"
            width={180}
            height={180}
            style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
        {jogador.numero && (
          <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-xl h-10 w-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white/20 z-20">
            {jogador.numero}
          </div>
        )}
        {jogador.titular && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-lg">
            Titular
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      <div className="p-5">
        <div className="border-b border-red-900/30 pb-3 mb-3">
          <h3 className="text-xl font-bold mb-1 text-white">{jogador.apelido}</h3>
          <p className="text-red-500 font-medium">{jogador.posicao}</p>
        </div>
        
        <div className="text-sm text-gray-300 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Nome completo:</span>
            <span className="font-medium text-white">{jogador.nome}</span>
          </div>
          {jogador.idade > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Idade:</span>
              <span className="font-medium text-white">{jogador.idade} anos</span>
            </div>
          )}
          {jogador.altura && jogador.altura !== '0' && (
            <div className="flex justify-between">
              <span className="text-gray-400">Altura:</span>
              <span className="font-medium text-white">{jogador.altura}</span>
            </div>
          )}
        </div>
        
        <div className="mt-5 pt-3 border-t border-red-900/30 flex justify-center space-x-4">
          {jogador.socialMedia?.instagram && (
            <a 
              href={`https://instagram.com/${jogador.socialMedia.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-pink-600 to-purple-600 p-2.5 rounded-full text-white hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-110 shadow-lg"
              aria-label={`Instagram de ${jogador.nome}`}
            >
              <Instagram size={18} />
            </a>
          )}
          {jogador.socialMedia?.twitter && (
            <a 
              href={`https://twitter.com/${jogador.socialMedia.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-full text-white hover:from-blue-500 hover:to-blue-300 transition-all transform hover:scale-110 shadow-lg"
              aria-label={`Twitter de ${jogador.nome}`}
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente principal do Elenco
export default function Elenco() {
  const [jogadores, setJogadores] = useState([]);
  const [formacao, setFormacao] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchTeamData() {
      try {
        setLoading(true);
        // Usa o endpoint flamengoGames com o parâmetro elenco=true
        const response = await fetch('/api/flamengoGames?elenco=true');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do elenco');
        }
        
        const data = await response.json();
        
        // Verifica se há dados válidos
        if (!data.jogadores || data.jogadores.length === 0) {
          throw new Error('Dados do elenco não encontrados');
        }
        
        setJogadores(data.jogadores);
        setFormacao(data.formacao || '');
        setLastUpdate(data.lastUpdate ? new Date(data.lastUpdate) : null);
      } catch (err) {
        console.error('Erro ao buscar dados do elenco:', err);
        setError(err.message);
        // Usar dados fallback em caso de erro
        setFallbackData();
      } finally {
        setLoading(false);
      }
    }
    
    // Carrega dados do elenco ao montar o componente
    fetchTeamData();
  }, []);
  
  // Função para carregar dados estáticos em caso de erro
  function setFallbackData() {
    // Dados do elenco atual do Flamengo como fallback
    const fallbackJogadores = [
      // Goleiros
      {
        id: 1,
        nome: 'Matheus Cunha',
        apelido: 'Matheus Cunha',
        posicao: 'Goleiro',
        numero: '25',
        foto: '/assets/bannerubro.png',
        nacionalidade: 'Brasil',
        idade: 22,
        altura: '1,97m',
        peso: '89kg',
        socialMedia: {
          instagram: 'mcunha_25',
        }
      },
      {
        id: 2,
        nome: 'Agustín Rossi',
        apelido: 'Rossi',
        posicao: 'Goleiro',
        numero: '1',
        foto: '/assets/bannerubro.png',
        nacionalidade: 'Argentina',
        idade: 28,
        altura: '1,90m',
        peso: '85kg',
        socialMedia: {
          instagram: 'agustinrossi_oficial',
        }
      },
      // Zagueiros
      {
        id: 4,
        nome: 'Fabrício Bruno',
        apelido: 'Fabrício Bruno',
        posicao: 'Zagueiro',
        numero: '15',
        foto: '/assets/bannerubro.png',
        nacionalidade: 'Brasil',
        idade: 28,
        altura: '1,92m',
        peso: '88kg',
        socialMedia: {
          instagram: 'fabriciobruno31',
        }
      },
      // Meio-campistas
      {
        id: 13,
        nome: 'Giorgian De Arrascaeta',
        apelido: 'Arrascaeta',
        posicao: 'Meia',
        numero: '14',
        foto: '/assets/bannerubro.png',
        nacionalidade: 'Uruguai',
        idade: 30,
        altura: '1,74m',
        peso: '70kg',
        socialMedia: {
          instagram: 'arrascaeta10',
          twitter: 'GiorgiandeA',
        }
      },
      // Atacantes
      {
        id: 18,
        nome: 'Gabriel Barbosa',
        apelido: 'Gabigol',
        posicao: 'Atacante',
        numero: '10',
        foto: '/assets/bannerubro.png',
        nacionalidade: 'Brasil',
        idade: 27,
        altura: '1,78m',
        peso: '78kg',
        socialMedia: {
          instagram: 'gabigol',
          twitter: 'gabigol',
        }
      },
      // Técnico
      {
        id: 21,
        nome: 'Filipe Luis',
        apelido: 'Filipe Luis',
        posicao: 'Técnico',
        foto: '/assets/coaches/filipeluis.webp',
        nacionalidade: 'Brasil',
        idade: 38,
        socialMedia: {
          instagram: 'filipeluis',
        }
      }
    ];
    
    setJogadores(fallbackJogadores);
    setFormacao('4-3-3');
    setLastUpdate(new Date());
  }
  
  // Agrupar jogadores por posição
  const tecnico = jogadores.filter(j => j.posicao.includes('Técnico') || j.posicao.includes('Treinador'));
  const goleiros = jogadores.filter(j => j.posicao.includes('Goleiro'));
  const defensores = jogadores.filter(j => j.posicao.includes('Zagueiro') || j.posicao.includes('Lateral'));
  const meias = jogadores.filter(j => j.posicao.includes('Meia') || j.posicao.includes('Volante') || j.posicao.includes('Meio-campista'));
  const atacantes = jogadores.filter(j => j.posicao.includes('Atacante') || j.posicao.includes('Ponta'));

  // Exibe um loader enquanto os dados são carregados
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-900 py-12 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Carregando elenco...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-white relative" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          <span className="relative inline-block" style={{
            background: 'linear-gradient(90deg, #e10600 0%, #9a0000 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ELENCO DO FLAMENGO
            <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></span>
          </span>
        </h1>
        
        {formacao && (
          <div className="text-center mb-8">
            <p className="text-xl">Formação: <span className="font-bold text-red-500">{formacao}</span></p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 text-white p-4 rounded-lg mb-8 text-center">
            <p>Erro ao carregar dados mais recentes: {error}</p>
            <p className="text-sm">Exibindo dados de backup.</p>
          </div>
        )}
        
        {lastUpdate && (
          <div className="text-center mb-8 text-sm text-gray-300">
            <p>Última atualização: {lastUpdate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p className="text-xs mt-1">(Dados atualizados automaticamente a cada 2 semanas)</p>
          </div>
        )}
        
        {/* Comissão Técnica */}
        {tecnico.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white relative inline-block">
              <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                COMISSÃO TÉCNICA
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {tecnico.map(jogador => (
                <JogadorCard key={jogador.id} jogador={jogador} />
              ))}
            </div>
          </div>
        )}
        
        {/* Goleiros */}
        {goleiros.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white relative inline-block">
              <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                GOLEIROS
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {goleiros.map(jogador => (
                <JogadorCard key={jogador.id} jogador={jogador} />
              ))}
            </div>
          </div>
        )}
        
        {/* Defensores */}
        {defensores.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white relative inline-block">
              <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                DEFENSORES
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {defensores.map(jogador => (
                <JogadorCard key={jogador.id} jogador={jogador} />
              ))}
            </div>
          </div>
        )}
        
        {/* Meio-campistas */}
        {meias.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white relative inline-block">
              <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                MEIO-CAMPISTAS
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {meias.map(jogador => (
                <JogadorCard key={jogador.id} jogador={jogador} />
              ))}
            </div>
          </div>
        )}
        
        {/* Atacantes */}
        {atacantes.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white relative inline-block">
              <span className="relative" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                ATACANTES
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {atacantes.map(jogador => (
                <JogadorCard key={jogador.id} jogador={jogador} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
