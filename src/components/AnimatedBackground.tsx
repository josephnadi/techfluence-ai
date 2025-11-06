import { useEffect, useState } from 'react';
import bgVr from '@/assets/bg-vr.jpg';
import bgMatrix from '@/assets/bg-matrix.jpg';
import bgEarth from '@/assets/bg-earth.jpg';
import bgNetwork from '@/assets/bg-network.jpg';
import bgLightWaves from '@/assets/bg-light-waves.jpg';
import bgWaveParticles from '@/assets/bg-wave-particles.jpg';
import bgPurpleDesk from '@/assets/bg-purple-desk.jpg';

const AnimatedBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const backgrounds = [
    bgVr,
    bgMatrix,
    bgEarth,
    bgNetwork,
    bgLightWaves,
    bgWaveParticles,
    bgPurpleDesk
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-2000"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentIndex ? 0.3 : 0,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
