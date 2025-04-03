'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Trophy, Star, Users, Flag, Calendar } from 'lucide-react'
import { useState } from 'react'

const timelineEvents = [
  {
    year: '1895',
    title: 'Fundação',
    description: 'Em 17 de novembro de 1895, um grupo de jovens remadores fundou o Clube de Regatas do Flamengo na praia do Flamengo. O clube começou como uma agremiação de remo, esporte que dominava o Rio de Janeiro na época. As cores rubro-negras foram inspiradas no Clube de Regatas Botafogo, que na época usava estas cores.',
    image: '/assets/flamengo.webp',
    details: [
      'Fundação na praia do Flamengo',
      'Início como clube de remo',
      'Adoção das cores rubro-negras'
    ]
  },
  {
    year: '1911',
    title: 'Início no Futebol',
    description: 'A história do Flamengo no futebol começou em 1911, quando um grupo de jogadores dissidentes do Fluminense, liderados por Alberto Borgerão, se juntou ao clube. O primeiro jogo oficial aconteceu em 3 de maio de 1912 contra o Mangueira, com vitória do Flamengo por 16 a 2, marcando o início de uma trajetória vitóriosa.',
    image: '/assets/flamengo2.webp',
    details: [
      'Chegada dos dissidentes do Fluminense',
      'Primeiro jogo em 1912',
      'Início da tradição no futebol'
    ]
  },
  {
    year: '1981',
    title: 'Glória Eterna',
    description: 'O ano de 1981 marcou o auge do Flamengo com a conquista da Libertadores, vencendo o Cobreloa na final. Em dezembro, veio a consagração mundial com a vitória sobre o Liverpool por 3 a 0 no Japão. O time liderado por Zico, considerado o maior jogador da história do clube, entrou para a eternidade com estas conquistas históricas.',
    image: '/assets/flamengo3.webp',
    details: [
      'Conquista da Libertadores',
      'Título Mundial sobre o Liverpool',
      'Time lendário liderado por Zico'
    ]
  },
  {
    year: '2019',
    title: 'Era Moderna',
    description: 'Em 2019, o Flamengo viveu um dos anos mais mágicos de sua história. Sob o comando de Jorge Jesus, o time conquistou a Libertadores com uma vitória dramática sobre o River Plate, com dois gols de Gabigol nos minutos finais. Além disso, conquistou o Brasileiro com números impressionantes, estabelecendo recordes de pontos e vitórias.',
    image: '/assets/flamengo4.webp',
    details: [
      'Libertadores com vitória épica',
      'Brasileiro com recordes',
      'Time comandado por Jorge Jesus'
    ]
  },
  {
    year: '2022',
    title: 'Tri da América',
    description: 'A terceira conquista da Libertadores veio em 2022, consolidando a era mais vitoriosa do clube em competições continentais. O Flamengo venceu o Athletico-PR na final em Guayaquil, com gols de Gabigol e Pedro. Esta conquista reforçou a posição do clube como uma das maiores forças do futebol sul-americano da atualidade.',
    image: '/assets/flamengo5.webp',
    details: [
      'Terceira Libertadores',
      'Final contra Athletico-PR',
      'Consolidação continental'
    ]
  }
];

export default function Historia() {
  const [activeEvent, setActiveEvent] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  console.log("title",timelineEvents[activeEvent].image)

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/maracana-hero.jpg"
            alt="Maracanã"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center space-y-6 px-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-black text-white gradient-text shine-effect"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              História do Mengão
            </motion.h1>
            <p className="text-2xl text-red-100 font-medium">
              Desde 1895 - O Mais Querido do Brasil
            </p>
          </div>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          style={{ y }}
          className="relative"
        >
          {/* Timeline Navigation */}
          <div className="flex justify-between items-center mb-12 overflow-x-auto py-4 scrollbar-hide">
            {timelineEvents.map((event, index) => (
              <button
                key={event.year}
                onClick={() => setActiveEvent(index)}
                className={`flex flex-col items-center min-w-[100px] px-4 py-2 rounded-lg transition-all ${
                  activeEvent === index ? 'bg-flamengoRed text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className={`w-6 h-6 mb-2 ${activeEvent === index ? 'animate-pulse' : ''}`} />
                <span className="text-2xl font-bold">{event.year}</span>
              </button>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 mb-24">
            {/* Image Side */}
            <motion.div
              key={activeEvent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src={timelineEvents[activeEvent].image}
                alt={timelineEvents[activeEvent].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>

            {/* Content Side */}
            <motion.div
              key={`content-${activeEvent}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white gradient-text">
                  {timelineEvents[activeEvent].title}
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {timelineEvents[activeEvent].description}
                </p>
                
                {/* Detalhes do Período */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-flamengoRed">Destaques da Época</h3>
                  <ul className="space-y-3">
                    {timelineEvents[activeEvent].details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-3 text-gray-300"
                      >
                        <div className="w-2 h-2 bg-flamengoRed rounded-full" />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 mt-48 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl">
            <Trophy className="w-8 h-8 text-white/80 mb-4" />
            <div className="text-3xl font-black text-white mb-2">47</div>
            <div className="text-sm text-white/80">Títulos Importantes</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl">
            <Star className="w-8 h-8 text-white/80 mb-4" />
            <div className="text-3xl font-black text-white mb-2">3</div>
            <div className="text-sm text-white/80">Libertadores</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl">
            <Users className="w-8 h-8 text-white/80 mb-4" />
            <div className="text-3xl font-black text-white mb-2">40M+</div>
            <div className="text-sm text-white/80">Torcedores</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl">
            <Flag className="w-8 h-8 text-white/80 mb-4" />
            <div className="text-3xl font-black text-white mb-2">8</div>
            <div className="text-sm text-white/80">Brasileiros</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
