// AnimationWrapper.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

const AnimationWrapper = ({ children, animation, duration }) => {
  useEffect(() => {
    AOS.init({
      duration: duration || 1000, 
    });
  }, []);

  return (
    <div data-aos={animation}>
      {children}
    </div>
  );
};

export default AnimationWrapper;
