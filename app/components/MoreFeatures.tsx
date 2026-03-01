import { Heart, Share2, Download } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Like what you hear',
    description: 'Save unlimited songs and albums',
    color: 'from-pink-500 to-purple-500',
  },
  {
    icon: Share2,
    title: 'Share the love',
    description: 'Share songs with friends anywhere',
    color: 'from-purple-500 to-blue-500',
  },
  {
    icon: Download,
    title: 'Download & listen',
    description: 'Take your music offline anywhere',
    color: 'from-blue-500 to-cyan-500',
  },
];

export function MoreFeatures() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${feature.color} text-white rounded-3xl p-8`}
          >
            <feature.icon className="w-12 h-12 mb-4" />
            <h3 className="text-2xl mb-3">{feature.title}</h3>
            <p className="text-white/90">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
