import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubsDetails } from '../features/AiMockinterview/interviewSlice';
import ThreeDotsWave from './AnimateLoader';

const SalesSection = () => {
  const dispatch = useDispatch();
  const { subsDetails, loading } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(getSubsDetails());
    console.log(subsDetails);
  }, [dispatch]);

  if (loading) {
    return <ThreeDotsWave/>
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-left">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Subscribers Details</h2>
      
      <div className="space-y-8">
        {subsDetails?.map((subscription) => (
          <div key={subscription.id} className="p-6 bg-white rounded-lg shadow-md">
            {/* User Information */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-800">
                {subscription.user.first_name} {subscription.user.last_name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm ${subscription.user.is_staff ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                {subscription.user.is_staff ? 'Staff' : 'User'}
              </span>
            </div>
            <p className="text-gray-500">@{subscription.user.username} - {subscription.user.email}</p>

            {/* Subscription Dates */}
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Subscription Start:</strong> {new Date(subscription.subscription_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p>
                <strong>Subscription End:</strong> {new Date(subscription.subscription_end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Transaction Info */}
            <div className="mt-6 text-sm text-gray-700 border-t pt-4">
              <p><strong>Payment ID:</strong> {subscription.transaction.payment_id}</p>
              <p><strong>Order ID:</strong> {subscription.transaction.order_id}</p>
              <p><strong>Signature:</strong> {subscription.transaction.signature}</p>
              <p><strong>Amount:</strong> ${subscription.transaction.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesSection;
