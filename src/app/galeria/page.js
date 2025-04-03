'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, ArrowLeft, Construction } from 'lucide-react';

export default function GaleriaConstruction() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Construction Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-32 h-32 bg-flamengoRed/10 rounded-full flex items-center justify-center">
            <Construction className="w-16 h-16 text-flamengoRed animate-pulse" />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 gradient-text">
            Galeria em Construção
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Estamos trabalhando para trazer as melhores imagens do Mengão para você.
            Em breve, muitas fotos e momentos históricos estarão disponíveis aqui!
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-flamengoRed h-2.5 rounded-full w-3/4 shine-effect"></div>
          </div>

          {/* Return Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-flamengoRed text-white rounded-lg hover:bg-flamengoRed/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 -z-10">
          <Camera className="w-64 h-64 text-flamengoRed" />
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 -z-10">
          <Camera className="w-64 h-64 text-flamengoRed" />
        </div>
      </div>
    </div>
  );
}
