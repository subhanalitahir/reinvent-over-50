import { ImageWithFallback } from './figma/ImageWithFallback';

export function OfflineSection() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4">
            Listening is all where you are.<br />
            Even offline.
          </h2>
        </div>
        <div className="flex justify-center">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1600365966065-703b4c4441c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwaGVhZHBob25lcyUyMG11c2ljfGVufDF8fHx8MTc3MjM1MzEzMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Mobile device with headphones"
            className="w-full max-w-md rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
