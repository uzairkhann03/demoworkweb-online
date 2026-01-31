import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/AuthContext';

const OrderTracking = ({ orderId }) => {
  const socket = useContext(SocketContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();

    if (socket) {
      socket.on('order-status-updated', (data) => {
        if (data.orderId === orderId) {
          setOrder(prev => ({
            ...prev,
            status: data.status,
            trackingNumber: data.trackingNumber,
          }));
        }
      });
    }

    return () => {
      if (socket) socket.off('order-status-updated');
    };
  }, [orderId, socket]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Order Status: {order.orderNumber}</h2>

      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {statusSteps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index <= currentStepIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            {index < statusSteps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status Labels */}
      <div className="flex justify-between text-sm font-medium mb-6">
        {statusSteps.map(step => (
          <span
            key={step}
            className={`capitalize ${
              statusSteps.indexOf(step) <= currentStepIndex
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <p className="text-lg">
          <strong>Tracking:</strong> <span className="font-mono">{order.trackingNumber}</span>
        </p>
      )}

      {/* Order Details */}
      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between py-2 font-bold">
          <span>Total:</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
