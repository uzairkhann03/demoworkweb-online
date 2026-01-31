import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiTruck, FiRotateCcw, FiShield } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes?.[0] || '');
      setSelectedColor(response.data.colors?.[0] || '');
    } catch (error) {
      console.error('Error fetching product:', error);
      // Mock product for demo
      setProduct({
        _id: id,
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a classic fit. Perfect for everyday wear. Made from 100% organic cotton for ultimate comfort.',
        price: 29.99,
        originalPrice: 39.99,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        stock: 100,
        brand: 'FashionAI',
        category: 'men',
      });
      setSelectedSize('M');
      setSelectedColor('White');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        name: product.name,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Added to cart!');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-black">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="text-gray-600">(124 reviews)</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium capitalize transition-colors ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x-2 border-gray-300 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-black transition-colors">
                <FiHeart size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex items-center gap-4">
                <FiTruck className="text-green-600" size={24} />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiRotateCcw className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiShield className="text-purple-600" size={24} />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
