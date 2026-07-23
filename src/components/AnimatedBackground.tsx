import { useEffect, useRef } from 'react';
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

const MAX_OPACITY = 0.3;
const SEGMENTS = backgrounds.length - 1;

const layerStyle = (image: string): React.CSSProperties => ({
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
});

const AnimatedBackground = () => {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    // Preload every frame up front — they're swapped in directly by index as
    // the user scrolls, so a cache miss would show as a pop-in mid-crossfade.
    backgrounds.forEach(src => {
      const preload = new Image();
      preload.src = src;
    });

    let ticking = false;

    const update = () => {
      ticking = false;

      // The sequence should finish before the footer ("#contact") scrolls into
      // view, not across the whole document (which would drag it out through
      // the footer itself).
      const footer = document.getElementById('contact');
      const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
      const scrollable = Math.max(1, footerTop - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));

      const pos = progress * SEGMENTS;
      const index = Math.min(SEGMENTS - 1, Math.floor(pos));
      const frac = pos - index;

      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        if (layerARef.current) layerARef.current.style.backgroundImage = `url(${backgrounds[index]})`;
        if (layerBRef.current) layerBRef.current.style.backgroundImage = `url(${backgrounds[index + 1]})`;
      }

      if (layerARef.current) layerARef.current.style.opacity = String((1 - frac) * MAX_OPACITY);
      if (layerBRef.current) layerBRef.current.style.opacity = String(frac * MAX_OPACITY);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div ref={layerARef} className="absolute inset-0" style={{ ...layerStyle(backgrounds[0]), opacity: MAX_OPACITY }} />
      <div ref={layerBRef} className="absolute inset-0" style={{ ...layerStyle(backgrounds[1]), opacity: 0 }} />
    </div>
  );
};

export default AnimatedBackground;
