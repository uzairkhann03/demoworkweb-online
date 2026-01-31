import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiZap } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Simulate AI recommendation (you can replace with real logic)
  const isAIPick = product.aiRecommended || Math.random() > 0.7;
  const isTrending = product.trending || Math.random() > 0.8;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Success animation
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5001/api/users/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post(`http://localhost:5001/api/users/wishlist/${product._id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`} 
      className="bg-white rounded-2xl overflow-hidden group block transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl shadow-md"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
    >
      {/* Image Container with Zoom Effect */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            -{product.discount}%
          </div>
        )}
        
        {/* AI Pick Badge */}
        {isAIPick && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
            <FiZap size={12} className="animate-pulse" />
            AI Pick
          </div>
        )}
        
        {/* Trending Badge */}
        {isTrending && !isAIPick && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            🔥 Trending
          </div>
        )}
        
        {/* Wishlist Button with Animation */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 group/heart"
        >
          <FiHeart
            size={20}
            className={`transition-all duration-300 ${
              isFavorite 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-gray-600 group-hover/heart:text-red-500 group-hover/heart:scale-110'
            }`}
          />
        </button>
        
        {/* Quick Add to Cart Overlay */}
        <div className={`absolute inset-x-0 bottom-0 transform transition-all duration-500 ${showQuickAdd ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-black/95 backdrop-blur-sm text-white py-4 flex items-center justify-center gap-2 transition-all font-medium hover:bg-black disabled:bg-gray-400"
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FiShoppingCart size={18} /> Quick Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">
          {product.brand || 'FashionAI'}
        </p>
        <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-black transition-colors" style={{ minHeight: '3rem' }}>
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-black">${product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(5)}
          </div>
          <span className="text-xs text-gray-500">(124)</span>
        </div>

        {/* Available Sizes Preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-xs text-gray-500">Sizes:</span>
            {product.sizes.slice(0, 4).map((size, idx) => (
              <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
