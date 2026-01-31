import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Mock cart items for demo
      setCartItems([
        {
          _id: '1',
          productId: { _id: 'mock-1', name: 'Classic White T-Shirt', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'] },
          quantity: 1,
          price: 29.99,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:5001/api/cart/${itemId}`, 
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setCartItems(cartItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Update locally for demo
      setCartItems(cartItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      setCartItems(cartItems.filter(item => item._id !== itemId));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
                <img
                  src={item.productId?.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={item.productId?.name || 'Product'}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.productId?.name || item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">${item.price}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="text-sm text-gray-600 mb-4 bg-yellow-50 p-3 rounded-lg">
                  Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium mb-3">
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="w-full text-center block text-gray-600 hover:text-black py-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
