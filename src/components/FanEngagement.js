'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Share2, MessageCircle } from 'lucide-react';

export default function FanEngagement() {
  return (
    <div className="bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nação Rubro-Negra
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Compartilhe sua paixão pelo Mengão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fan Post Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-neutral-700 rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-64">
              <Image
                src="/assets/torcida1.jpg"
                alt="Torcida do Flamengo"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden relative">
                  <Image
                    src="/assets/avatar1.jpg"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">João Silva</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@joaosilva</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Mais uma vez no Maracanã! Sempre contigo, meu Mengão! ❤️🖤
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center gap-1 hover:text-flamengoRed transition-colors">
                  <Heart size={18} />
                  <span>2.5k</span>
                </button>
                <button className="flex items-center gap-1 hover:text-flamengoRed transition-colors">
                  <MessageCircle size={18} />
                  <span>128</span>
                </button>
                <button className="flex items-center gap-1 hover:text-flamengoRed transition-colors">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* More fan posts... */}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-flamengoRed hover:bg-flamengoRed/90 transition-colors">
            Compartilhe sua história
          </button>
        </div>
      </div>
    </div>
  );
}
