import { Music, Radio, Mic, Headphones, ListMusic, Download, Users, Sparkles } from 'lucide-react';

const benefits = [
  { icon: Music, title: 'Unlimited songs' },
  { icon: Radio, title: 'Live radio' },
  { icon: Mic, title: 'Podcasts' },
  { icon: Headphones, title: 'High quality' },
  { icon: ListMusic, title: 'Smart playlists' },
  { icon: Download, title: 'Offline mode' },
  { icon: Users, title: 'Family sharing' },
  { icon: Sparkles, title: 'AI recommendations' },
];

export function BenefitsGrid() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="bg-blue-500 text-white rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-center"
          >
            <benefit.icon className="w-12 h-12 mb-4" />
            <h3 className="text-lg">{benefit.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
