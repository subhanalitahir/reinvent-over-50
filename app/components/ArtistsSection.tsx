import { ImageWithFallback } from './figma/ImageWithFallback';

export function ArtistsSection() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl">
          Your artists.<br />
          From inspiring.
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
              <ImageWithFallback 
                src={`https://images.unsplash.com/photo-1560313306-f95075eb4749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjMxMTk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&sig=${item}`}
                alt={`Artist ${item}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm text-gray-600">Artist</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
