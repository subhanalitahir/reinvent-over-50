export function PersonalizeSection() {
  return (
    <section className="px-6 py-16 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl mb-6">You and artist's name</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="w-32 h-32 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg"></div>
        <div className="w-32 h-32 bg-linear-to-br from-blue-400 to-purple-400 rounded-lg"></div>
        <div className="w-32 h-32 bg-linear-to-br from-green-400 to-blue-400 rounded-lg"></div>
      </div>
    </section>
  );
}
