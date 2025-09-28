const FloatingParticles = () => {
  const particles = [
    { size: "w-2 h-2", color: "bg-primary", delay: "0s", left: "10%", top: "20%" },
    { size: "w-1 h-1", color: "bg-accent", delay: "1s", left: "20%", top: "60%" },
    { size: "w-3 h-3", color: "bg-primary", delay: "2s", left: "80%", top: "30%" },
    { size: "w-1.5 h-1.5", color: "bg-accent", delay: "0.5s", left: "90%", top: "70%" },
    { size: "w-2 h-2", color: "bg-primary", delay: "1.5s", left: "15%", top: "80%" },
    { size: "w-1 h-1", color: "bg-accent", delay: "2.5s", left: "70%", top: "15%" },
    { size: "w-2.5 h-2.5", color: "bg-primary", delay: "3s", left: "60%", top: "85%" },
    { size: "w-1 h-1", color: "bg-accent", delay: "1.2s", left: "40%", top: "10%" },
    { size: "w-1.5 h-1.5", color: "bg-primary", delay: "0.8s", left: "85%", top: "50%" },
    { size: "w-3 h-1", color: "bg-accent", delay: "2.2s", left: "25%", top: "40%" },
    { size: "w-1 h-3", color: "bg-primary", delay: "1.8s", left: "75%", top: "75%" },
    { size: "w-2 h-1", color: "bg-accent", delay: "2.8s", left: "50%", top: "5%" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={index}
          className={`
            absolute rounded-full floating-particle opacity-40
            ${particle.size} ${particle.color}
          `}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;