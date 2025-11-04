const StatsSection = () => {
  const stats = [
    {
      number: "15+",
      label: "Projects Completed",
      color: "text-green-400"
    },
    {
      number: "98%", 
      label: "Client Satisfaction",
      color: "text-blue-400"
    },
    {
      number: "24/7",
      label: "Expert Support", 
      color: "text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="text-center p-6 rounded-xl card-float"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 text-vibrant`}>
            {stat.number}
          </div>
          <p className="text-sm text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;