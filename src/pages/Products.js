import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Recommendations from '../components/Recommendations';
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 500,
    size: '',
    color: '',
    sort: 'newest',
    sale: false,
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Beige', hex: '#D4C5B9' },
    { name: 'Red', hex: '#DC2626' },
  ];

  // Update filters when URL params change
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const sale = searchParams.get('sale') === 'true';
    setFilters(prev => ({ ...prev, category, sale }));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.sale) params.append('sale', 'true');
      params.append('minPrice', filters.minPrice);
      params.append('maxPrice', filters.maxPrice);
      params.append('sort', filters.sort);

      const response = await axios.get(
        `http://localhost:5001/api/products?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      let fetchedProducts = response.data.products || [];
      
      // Filter by sale if needed (client-side for demo)
      if (filters.sale) {
        fetchedProducts = fetchedProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
      }
      
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiFilter className="w-5 h-5" />
          Filters
        </h2>
        <button 
          onClick={() => setMobileFilterOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
        <div className="space-y-2">
          {['All', 'Women', 'Men', 'Kids', 'Accessories'].map((cat) => (
            <label key={cat} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat === 'All' ? '' : cat.toLowerCase()}
                checked={filters.category === (cat === 'All' ? '' : cat.toLowerCase())}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-4 h-4 text-black focus:ring-black border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-black transition">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Size</label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setFilters({ ...filters, size: filters.size === size ? '' : size })}
              className={`py-2 px-3 border rounded-lg text-sm font-medium transition ${
                filters.size === size
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter - Enhanced with dots */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
        <div className="grid grid-cols-6 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setFilters({ ...filters, color: filters.color === color.name ? '' : color.name })}
              className={`w-11 h-11 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                filters.color === color.name ? 'border-black ring-2 ring-offset-2 ring-black scale-110' : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {color.hex === '#FFFFFF' && <div className="w-full h-full rounded-full border border-gray-200"></div>}
              {filters.color === color.name && (
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range - Enhanced with live indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Price Range</label>
          <span className="text-sm font-bold text-black bg-gray-100 px-3 py-1 rounded-full">
            ${filters.minPrice} - ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-gray-200 to-black rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>$0</span>
          <span>$500+</span>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setFilters({ category: '', minPrice: 0, maxPrice: 500, size: '', color: '', sort: 'newest' })}
        className="w-full py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:border-black hover:bg-black hover:text-white transition"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              AI-Powered Personalization Active
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) + "'s Collection" : 
               filters.sale ? 'Exclusive Sale' : 'Spring Collection 2026'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {filters.category ? `Discover the latest trends in ${filters.category}'s fashion, curated by our AI` :
               filters.sale ? 'Limited time offers on premium fashion pieces selected just for you' :
               'Experience fashion that understands your style. AI-curated collections tailored to your preferences.'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                Shop New Arrivals
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                Explore AI Picks
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 fill-current text-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition"
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{products.length}</span> Products
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)}></div>
              <div className="absolute inset-y-0 left-0 w-80 bg-white overflow-y-auto">
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shimmer h-96 rounded-2xl"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="mt-20">
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default Products;
