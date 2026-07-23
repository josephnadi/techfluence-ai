const StatsSection = () => {
  const stats = [{
    number: "98%",
    label: "Client Satisfaction",
    color: "text-blue-400"
  }, {
    number: "24/7",
    label: "Expert Support",
    color: "text-purple-400"
  }];
  return <div className="grid grid-cols-2 gap-8 max-w-xs mx-auto sm:mx-0">
      {stats.map((stat, index) => <div key={index} className="text-center">
          <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
            {stat.number}
          </div>
          <p className="text-sm text-muted-foreground">
            {stat.label}
          </p>
        </div>)}
    </div>;
};
export default StatsSection;