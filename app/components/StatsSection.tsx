export function StatsSection() {
  const stats = [
    { value: '70M+', label: 'Songs' },
    { value: '2.9M+', label: 'Podcasts' },
    { value: '450M+', label: 'Users' },
    { value: '180+', label: 'Countries' },
  ];

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl">Get news, statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
