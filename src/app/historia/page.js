'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Historia() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full bg-gradient-to-r from-red-700 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
              História do Clube de Regatas do Flamengo
            </h1>
            <p className="text-xl text-white">Desde 1895 - O Mais Querido do Brasil</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-red-700 mb-6">A Origem do Maior do Mundo</h2>
          <p className="text-lg mb-6">
            Fundado em 17 de novembro de 1895, o Clube de Regatas do Flamengo nasceu como uma agremiação de remo
            na praia do Flamengo, Rio de Janeiro. O que começou como um sonho de jovens remadores se transformou
            em uma das maiores instituições esportivas do planeta.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">Do Remo ao Futebol</h3>
              <p className="text-gray-600">
                Em 1911, um grupo de dissidentes do Fluminense se juntou ao Flamengo, marcando o início da 
                trajetória do clube no futebol. Desde então, o Rubro-Negro se tornou uma potência no esporte,
                conquistando inúmeros títulos nacionais e internacionais.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">A Nação Rubro-Negra</h3>
              <p className="text-gray-600">
                Com mais de 40 milhões de torcedores, o Flamengo possui a maior torcida do Brasil. A paixão 
                rubro-negra ultrapassa fronteiras, fazendo do clube uma verdadeira força global do futebol.
              </p>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-red-800 mb-4">Principais Conquistas</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Libertadores da América (1981, 2019, 2022)</li>
              <li>Mundial Interclubes (1981)</li>
              <li>Campeonato Brasileiro (8 títulos)</li>
              <li>Copa do Brasil (4 títulos)</li>
              <li>Supercopa do Brasil (2020, 2021)</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Ídolos Eternos</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-700">Zico</h4>
                <p className="text-gray-600">O Galinho de Quintino, maior ídolo da história do clube</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-700">Júnior</h4>
                <p className="text-gray-600">O Maestro, símbolo de técnica e liderança</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-700">Gabigol</h4>
                <p className="text-gray-600">Artilheiro da era moderna e ídolo contemporâneo</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
