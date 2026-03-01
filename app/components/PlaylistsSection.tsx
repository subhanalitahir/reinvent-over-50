import { ImageWithFallback } from './figma/ImageWithFallback';

const playlists = [
  'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzIzMzM4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0fGVufDF8fHx8MTc3MjI2NjYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzcyMjg0ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1769509068789-f242b5a6fc47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvcmRpbmclMjBzdHVkaW8lMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcyMzI3NzgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function PlaylistsSection() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl">Playlists</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {playlists.map((image, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden">
            <ImageWithFallback 
              src={image}
              alt={`Playlist ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
