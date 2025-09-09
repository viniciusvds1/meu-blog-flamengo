import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, History, MapPin, Star, ChevronRight } from 'lucide-react';
import { blogApi } from '../services/api';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const categoryIcons = {
    'noticias': Trophy,
    'jogadores': Users,
    'historia': History,
    'maracana': MapPin,
    'tacas': Star,
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await blogApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Trophy className="w-5 h-5 text-red-600 mr-2" />
        Categorias
      </h3>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.slug] || Trophy;
          
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    style={{ color: category.color }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          );
        })}
      </div>

      {/* All Categories Link */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/category/noticias"
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center group"
        >
          Ver todas as categorias
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CategorySection;