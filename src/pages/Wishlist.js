import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/wishlist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWishlistItems(response.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Mock wishlist for demo
      setWishlistItems([
        {
          _id: 'mock-2',
          name: 'Elegant Summer Dress',
          price: 89.99,
          images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500'],
          category: 'women',
        },
        {
          _id: 'mock-3',
          name: 'Leather Jacket',
          price: 299.99,
          images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
          category: 'men',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        productId: product._id,
        quantity: 1,
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiHeart className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items here</p>
          <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <FiHeart className="text-red-500" size={32} />
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Wishlist
          </h1>
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
            {wishlistItems.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden group relative">
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiX size={18} />
              </button>

              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">{item.category}</p>
                <p className="text-xl font-bold text-black mb-3">${item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
