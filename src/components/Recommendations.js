import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiZap, FiShoppingCart, FiHeart } from 'react-icons/fi';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5001/api/recommendations/for-user',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="py-12 text-center">
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
      <p className="mt-4 text-gray-600 font-medium">AI is analyzing your preferences...</p>
    </div>
  );

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl shadow-2xl p-10 border border-purple-100 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <FiZap className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                Recommended For You
              </h2>
            </div>
            <p className="text-gray-600 ml-15 text-sm">
              These items match your style based on your browsing and preferences
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
            <FiZap className="w-4 h-4" />
            AI Powered
          </div>
        </div>

        {/* Premium Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(product => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/50"
            >
              {/* Image with Hover Effect */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* AI Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <FiZap size={10} />
                  AI Pick
                </div>
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Added to wishlist!');
                    }}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all shadow-lg"
                  >
                    <FiHeart size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Added to cart!');
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-110 transition-all shadow-lg font-semibold flex items-center gap-2"
                  >
                    <FiShoppingCart size={16} />
                    Add
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <p className="text-xs text-purple-600 mb-1.5 uppercase tracking-wider font-bold">
                  {product.brand || 'FashionAI'}
                </p>
                <h3 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-900 transition-colors" style={{ minHeight: '3rem' }}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-2xl font-bold text-black">${product.price}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-xs text-gray-500">(4.8)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Explanation Footer */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How AI Personalization Works</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Our AI analyzes your browsing patterns, style preferences, and purchase history to curate personalized recommendations. 
                The more you shop, the better we understand your unique style. We use machine learning to continuously improve your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
