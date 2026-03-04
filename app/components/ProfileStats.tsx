import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProfileStats() {
  const stats = [
    { label: 'Followers', value: '125K' },
    { label: 'Following', value: '892' },
    { label: 'Tracks', value: '1.2K' },
  ];

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-6">What play</h2>
      </div>
      <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1560313306-f95075eb4749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjMxMTk0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Artist profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl md:text-3xl mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
