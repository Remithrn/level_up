import { CheckIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from './Card';

const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    price: 120,
    plan: 'month',
    description: "monthly plan",
    features: ['unlimited ai tokens', 'unlimited ai interviews', 'unlimited ai quiz', 'unlimited leetcode analysis','unlimited access to aichatbot'],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    price: 1000,
    description: 'yearly plan',
    plan: 'year',
    features: ['unlimited ai tokens', 'unlimited ai interviews', 'unlimited ai quiz', 'unlimited leetcode analysis','unlimited access to aichatbot'],
    featured: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  const { error, isLoading, Razorpay } = useRazorpay();
  const { access } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (profile?.subscription_status === true) {
    return <div className="flex mt-64 justify-center font-bold capitalize leading-7 text-indigo-600 text-3xl">You are already subscribed</div>;
  }

  const complete_order = (paymentID, orderID, signature, price) => {
    axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/payments/order-complete/`,
      {
        payment_id: paymentID,
        order_id: orderID,
        signature: signature,
        amount: price,
      },
      { headers: { Authorization: `Bearer ${access}` } }
    )
    .then((response) => {
      Swal.fire('Success', 'Payment completed successfully!', 'success');
      navigate('/');
    })
    .catch((error) => {
      Swal.fire('Error', 'There was an issue completing the payment.', 'error');
    });
  }

  const razopayPayment = (price) => {
    axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/payments/create-order/`,
      {
        amount: price * 100, // Razorpay expects amount in paise
        currency: 'INR',
      },
      { headers: { Authorization: `Bearer ${access}` } }
    )
    .then((response) => {
      const order_id = response.data.id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        name: "Level Up",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order_id,
        handler: function (response) {
          complete_order(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, price);
        },
        prefill: {
          name: "Remith Nair",
          email: "youremail@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: `Error Code: ${response.error.code}\nDescription: ${response.error.description}\nReason: ${response.error.reason}`,
        });
      });
      rzp1.open();
    })
    .catch((error) => {
      Swal.fire('Error', 'Failed to initiate payment. Please try again.', 'error');
    });
  };

  return (
    <Card>
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="font-bold capitalize leading-7 text-indigo-600 text-2xl">Pricing</h2>
      </div>
      <div className="mx-auto  grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div key={tier.id} className={classNames(tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60', 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10')}>
            <h3 id={tier.id} className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base font-semibold leading-7')}>
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className={classNames(tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-bold tracking-tight')}>₹ {tier.price}</span>
              <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/{tier.plan}</span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>{tier.description}</p>
            <ul role="list" className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm leading-6 sm:mt-10')}>
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => { razopayPayment(tier.price); }}
              aria-describedby={tier.id}
              className={classNames(tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300', 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold sm:mt-10')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Buy Now'}
            </button>
            {error && <p>Error: {error}</p>}
          </div>
        ))}
      </div>
    </div>
    </Card>
  );
}
