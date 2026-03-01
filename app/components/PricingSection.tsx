import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Mini',
    price: '$4.99',
    color: 'from-purple-500 to-purple-600',
    features: ['Ad-free music', 'Download 30 songs', 'Group Session', 'Mobile only'],
  },
  {
    name: 'Individual',
    price: '$9.99',
    color: 'from-orange-500 to-orange-600',
    features: ['Ad-free music', 'Unlimited downloads', 'High quality audio', 'All devices'],
  },
  {
    name: 'Family',
    price: '$14.99',
    color: 'from-pink-500 to-red-500',
    features: ['Ad-free music', 'Up to 6 accounts', 'Family mix playlist', 'Parental controls'],
  },
];

export function PricingSection() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl mb-4">What's plan<br />to power you?</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${plan.color} rounded-3xl p-8 text-white`}
          >
            <h3 className="text-2xl mb-2">{plan.name}</h3>
            <div className="text-4xl mb-8">{plan.price}</div>
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-white text-gray-900 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
