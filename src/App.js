import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, SocketProvider } from './context/AuthContext';
import { FiShoppingBag, FiUser, FiHeart, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import Chatbot from './components/Chatbot';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const category = searchParams.get('category');
  const isSale = searchParams.get('sale') === 'true';
  const isNewArrivals = location.pathname === '/shop' && !category && !isSale;
  
  // Detect scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const getNavLinkClass = (isActive, isRed = false) => {
    if (isActive) {
      return isRed 
        ? 'text-red-600 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600 after:transition-all'
        : 'text-black font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:transition-all';
    }
    return isRed 
      ? 'text-red-600 hover:text-red-700 font-medium transition-all relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300'
      : 'text-gray-700 hover:text-black font-medium transition-all relative hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300';
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Premium Fashion Header with Scroll Effect */}
        <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'border-b border-gray-100 shadow-sm'}`}>
          {/* Top Announcement Bar */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white text-center py-2.5 text-sm font-medium">
            <span className="animate-pulse">✨</span> Free Shipping on Orders Over $100 | Spring Collection 2026 <span className="animate-pulse">✨</span>
          </div>
          
          {/* Main Navigation */}
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo with Animation */}
              <Link to="/" className="flex-shrink-0 group">
                <h1 className="text-3xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105" style={{ fontFamily: 'Playfair Display, serif' }}>
                  FASHION<span className="text-green-600 transition-colors group-hover:text-green-700">AI</span>
                </h1>
              </Link>

              {/* Desktop Navigation with Animated Underlines */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/shop" className={`${getNavLinkClass(isNewArrivals)} py-2`}>
                  New Arrivals
                </Link>
                <Link to="/shop?category=women" className={`${getNavLinkClass(category === 'women')} py-2`}>
                  Women
                </Link>
                <Link to="/shop?category=men" className={`${getNavLinkClass(category === 'men')} py-2`}>
                  Men
                </Link>
                <Link to="/shop?sale=true" className={`${getNavLinkClass(isSale, true)} py-2`}>
                  Sale
                </Link>
              </div>

                  {/* Right Icons with Animation */}
                  <div className="flex items-center space-x-6">
                    <button className="hidden md:block text-gray-600 hover:text-black transition-all duration-300 hover:scale-110">
                      <FiSearch className="w-5 h-5" />
                    </button>
                    <Link to="/wishlist" className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-110 relative group">
                      <FiHeart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                        3
                      </span>
                    </Link>
                    <button className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-110">
                      <FiUser className="w-5 h-5" />
                    </button>
                    <Link to="/cart" className="text-gray-600 hover:text-black transition-all duration-300 hover:scale-110 relative group">
                      <FiShoppingBag className="w-5 h-5" />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        2
                      </span>
                    </Link>
                    
                    {/* Mobile Menu Button */}
                    <button 
                      className="md:hidden text-gray-600 hover:text-black"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <div className="md:hidden py-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-4">
                    <Link to="/shop" className={getNavLinkClass(isNewArrivals)}>
                      New Arrivals
                    </Link>
                    <Link to="/shop?category=women" className={getNavLinkClass(category === 'women')}>
                      Women
                    </Link>
                    <Link to="/shop?category=men" className={getNavLinkClass(category === 'men')}>
                      Men
                    </Link>
                    <Link to="/shop?sale=true" className={getNavLinkClass(isSale, true)}>
                      Sale
                    </Link>
                  </div>
                </div>
              )}
            </nav>
          </header>

          {/* Routes */}
          <Routes>
            <Route path="/shop" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/" element={<Navigate to="/shop" />} />
          </Routes>

          {/* Premium Footer */}
          <footer className="bg-gray-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    FASHIONAI
                  </h3>
                  <p className="text-gray-400 text-sm">
                    AI-powered fashion at your fingertips. Discover your style with intelligent recommendations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link to="/shop" className="hover:text-white">New Arrivals</Link></li>
                    <li><Link to="/shop?category=women" className="hover:text-white">Women</Link></li>
                    <li><Link to="/shop?category=men" className="hover:text-white">Men</Link></li>
                    <li><Link to="/shop?sale=true" className="hover:text-white">Sale</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Customer Care</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">Track Order</a></li>
                    <li><a href="#" className="hover:text-white">Returns</a></li>
                    <li><a href="#" className="hover:text-white">Size Guide</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Newsletter</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Subscribe for exclusive offers and updates
                  </p>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-r-lg font-medium">
                      Join
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2026 FashionAI. Powered by AI. Designed for Fashion.</p>
              </div>
            </div>
          </footer>

          {/* Chatbot Widget */}
          <Chatbot />
        </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Navigation />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
