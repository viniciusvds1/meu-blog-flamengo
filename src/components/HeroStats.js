'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Users, Star, TrendingUp, Fire } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { icon: Trophy, label: 'Títulos', value: '47', suffix: '', color: 'from-yellow-400 to-yellow-600' },
  { icon: Users, label: 'Sócios', value: '150', suffix: 'mil', color: 'from-red-500 to-red-700' },
  { icon: Star, label: 'Libertadores', value: '3', suffix: '', color: 'from-blue-500 to-blue-700' },
  { icon: TrendingUp, label: 'Brasileirão', value: '8', suffix: '', color: 'from-green-500 to-green-700' },
];

export default function HeroStats() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Background Video/Image */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/assets/maracana.jpg"
          alt="Maracanã"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 flamengo-pattern opacity-5" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10 opacity-20"
        animate={{ y: ["-10%", "10%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <Fire className="w-32 h-32 text-flamengoRed" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ y }}
        className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 gradient-text shine-effect">
            Maior do Rio, Gigante do Brasil
          </h2>
          <p className="mt-3 text-xl text-red-100 sm:mt-4 font-medium">
            Uma Nação de milhões de apaixonados
          </p>
        </motion.div>

        <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-6 shadow-lg card-hover-effect`}
            >
              <dt>
                <div className="absolute -right-4 -top-4 p-8 opacity-20">
                  <stat.icon className="h-16 w-16 text-white" aria-hidden="true" />
                </div>
                <p className="text-lg font-medium text-white/90 truncate">
                  {stat.label}
                </p>
              </dt>
              <dd className="mt-4">
                <p className="text-4xl font-black text-white tracking-tight">
                  {stat.value}{stat.suffix}
                </p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}
