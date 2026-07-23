import { useEffect, useState } from 'react';
import bgVr from '@/assets/bg-vr.jpg';
import bgMatrix from '@/assets/bg-matrix.jpg';
import bgEarth from '@/assets/bg-earth.jpg';
import bgNetwork from '@/assets/bg-network.jpg';
import bgLightWaves from '@/assets/bg-light-waves.jpg';
import bgWaveParticles from '@/assets/bg-wave-particles.jpg';
import bgPurpleDesk from '@/assets/bg-purple-desk.jpg';

const backgrounds = [
  bgVr,
  bgMatrix,
  bgEarth,
  bgNetwork,
  bgLightWaves,
  bgWaveParticles,
  bgPurpleDesk
];

const AnimatedBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Preload the next background well ahead of the switch so there's no pop-in,
    // without needing every image mounted (and fetched) up front like before.
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    const preload = new Image();
    preload.src = backgrounds[nextIndex];
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-0">
      <div
        key={currentIndex}
        className="absolute inset-0 bg-reveal"
        style={{
          backgroundImage: `url(${backgrounds[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
