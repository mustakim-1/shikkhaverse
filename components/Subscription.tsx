import React from 'react';
import { CheckCircle, Zap, Shield, Crown } from 'lucide-react';
import { SubscriptionPlan } from '../types';

export const Subscription: React.FC = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Pass',
      price: 100,
      duration: 'MONTHLY',
      features: [
        'All Video Lectures (HD)',
        'Live Interactive Classes',
        'Teacher Chat Support',
        'Weekly Model Tests',
        'Offline Downloads',
        'Parent Dashboard Access',
        'AI Mentor Access',
        'Personalized Learning Path'
      ]
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Unlock Your Potential
        </h2>
        <p className="text-slate-400">
          Get unlimited access to the country's best teachers and smart learning tools for the price of a burger.
        </p>
      </div>

      <div className="grid grid-cols-1 max-w-md mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-panel p-8 rounded-3xl relative border-2 border-slate-700 hover:border-blue-500 transition-all group">
             {plan.duration === 'YEARLY' && (
               <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl">
                 BEST VALUE
               </div>
             )}
             
             <div className="flex items-center gap-4 mb-6">
               <div className={`p-4 rounded-2xl ${plan.duration === 'YEARLY' ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                 {plan.duration === 'YEARLY' ? <Crown className="w-8 h-8 text-amber-400" /> : <Zap className="w-8 h-8 text-blue-400" />}
               </div>
               <div>
                 <h3 className="text-xl font-bold">{plan.name}</h3>
                 <p className="text-slate-400 text-sm">Cancel anytime</p>
               </div>
             </div>

             <div className="mb-8">
               <span className="text-4xl font-bold">৳{plan.price}</span>
               <span className="text-slate-500">/{plan.duration === 'MONTHLY' ? 'mo' : 'yr'}</span>
             </div>

             <ul className="space-y-4 mb-8">
               {plan.features.map((feature, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-slate-300">
                   <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                   {feature}
                 </li>
               ))}
             </ul>

             <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105">
               Get Started Now
             </button>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between max-w-4xl mx-auto">
         <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-emerald-400" />
            <div>
              <h4 className="font-bold text-lg">100% Secure Payment</h4>
              <p className="text-slate-400 text-sm">Bkash, Nagad, Rocket supported</p>
            </div>
         </div>
         <div className="flex gap-2 opacity-50">
            <div className="w-12 h-8 bg-slate-700 rounded"></div>
            <div className="w-12 h-8 bg-slate-700 rounded"></div>
            <div className="w-12 h-8 bg-slate-700 rounded"></div>
         </div>
      </div>
    </div>
  );
};
