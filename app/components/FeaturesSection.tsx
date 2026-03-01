import { Sparkles, Heart, Users, TrendingUp } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    { icon: Sparkles, color: 'text-purple-500' },
    { icon: Heart, color: 'text-pink-500' },
    { icon: Users, color: 'text-blue-500' },
    { icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl mb-4">It gets you.</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {features.map((Feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 ${Feature.color}`}>
              <Feature.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
