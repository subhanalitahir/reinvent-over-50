import { ImageWithFallback } from './figma/ImageWithFallback';

const albums = [
  { 
    image: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzcyMzI1NjU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 1'
  },
  { 
    image: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0fGVufDF8fHx8MTc3MjI2NjYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 2'
  },
  { 
    image: 'https://images.unsplash.com/photo-1600542552868-56ed242290e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMHR1cm50YWJsZSUyMG1peGluZ3xlbnwxfHx8fDE3NzIzNTMxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 3'
  },
  { 
    image: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzIzMzM4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 4'
  },
  { 
    image: 'https://images.unsplash.com/photo-1560313306-f95075eb4749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjMxMTk0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 5'
  },
  { 
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzcyMjg0ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Album 6'
  },
];

export function AlbumGrid() {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map((album, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden">
            <ImageWithFallback 
              src={album.image}
              alt={album.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
