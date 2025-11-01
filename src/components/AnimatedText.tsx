import { useState, useEffect } from "react";

const AnimatedText = () => {
  const texts = [
    "Digital Future",
    "Business Success", 
    "Cloud Excellence",
    "AI Revolution"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`
        text-primary inline-block transition-all duration-300 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default AnimatedText;