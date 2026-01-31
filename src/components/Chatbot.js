import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(`session-${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Pulse effect for attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/chatbot/chat', {
        message: input,
        sessionId,
        userId: localStorage.getItem('userId'),
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response.data.botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl w-96 h-[550px] flex flex-col border border-gray-200 overflow-hidden">
          {/* Enhanced Header with AI Branding */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-5 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <FiZap className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-lg">AI Fashion Assistant</h3>
              </div>
              <p className="text-xs text-purple-100">Powered by Smart Recommendations</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:rotate-90 relative z-10"
            >
              <FiX size={22} />
            </button>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium mb-2">👋 Hi! I'm your AI fashion assistant</p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      I analyze your preferences and browsing history to provide:
                      <br/>• Personalized product recommendations
                      <br/>• Size and fit guidance
                      <br/>• Order tracking & support
                      <br/>• Style advice & trends
                      <br/><br/>How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-sm max-w-xs shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-gray-900 to-black text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <form onSubmit={sendMessage} className="border-t border-gray-200 p-4 bg-white flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about fashion..."
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
            >
              <FiSend size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="relative">
          {/* AI Badge */}
          {pulse && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce z-10">
              AI
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-5 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
            title="Chat with AI Fashion Assistant"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            <FiMessageCircle size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
