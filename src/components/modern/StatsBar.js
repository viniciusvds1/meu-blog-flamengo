'use client';

import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const StatsBar = () => {
  const [stats, setStats] = useState({
    titles: 0,
    fans: 0,
    founded: 1895,
    articles: 0
  });

  useEffect(() => {
    // Animate numbers on mount
    const animateNumber = (target, key, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);
    };

    // Animate all stats
    animateNumber(45, 'titles'); // Flamengo titles
    animateNumber(42000000, 'fans'); // Estimated fan base
    animateNumber(150, 'articles'); // Articles count

    setStats(prev => ({ ...prev, founded: 1895 }));
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const statsData = [
    {
      icon: Trophy,
      value: stats.titles,
      label: 'Títulos Conquistados',
      color: 'text-yellow-500'
    },
    {
      icon: Users,
      value: formatNumber(stats.fans),
      label: 'Torcedores no Brasil',
      color: 'text-red-500'
    },
    {
      icon: Calendar,
      value: new Date().getFullYear() - stats.founded,
      label: 'Anos de História',
      color: 'text-black'
    },
    {
      icon: TrendingUp,
      value: stats.articles,
      label: 'Artigos Publicados',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors ${stat.color}`}>
                <IconComponent size={24} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsBar;