import React, { useState, useEffect, useCallback, useRef } from 'react';

const MovingDots = () => {
  const [dots, setDots] = useState([]);
  const [colorValue, setColorValue] = useState(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  const createDot = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 1,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
  }), []);

  useEffect(() => {
    setDots(Array.from({ length: 200 }, createDot));
  }, [createDot]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      mousePos.current = {
        x: (clientX / innerWidth) * 100,
        y: (clientY / innerHeight) * 100,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const animateDots = useCallback(() => {
    setDots(prevDots =>
      prevDots.map(dot => {
        let { x, y, speedX, speedY } = dot;
        
        // Calculate distance from mouse
        const dx = x - mousePos.current.x;
        const dy = y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If the dot is close to the mouse, push it away more strongly
        if (distance < 10) {
          const angle = Math.atan2(dy, dx);
          const repulsionStrength = 0.2 * (1 - distance / 10);
          const pushX = Math.cos(angle) * repulsionStrength;
          const pushY = Math.sin(angle) * repulsionStrength;
          speedX += pushX;
          speedY += pushY;
        }
        
        // Update position
        x = (x + speedX + 100) % 100;
        y = (y + speedY + 100) % 100;
        
        // Dampen speed
        speedX *= 0.95;
        speedY *= 0.95;

        // Ensure minimum and maximum speed
        const minSpeed = 0.05;
        const maxSpeed = 0.7;
        const currentSpeed = Math.sqrt(speedX * speedX + speedY * speedY);
        if (currentSpeed > maxSpeed) {
          speedX = (speedX / currentSpeed) * maxSpeed;
          speedY = (speedY / currentSpeed) * maxSpeed;
        } else if (currentSpeed < minSpeed) {
          speedX = (speedX / currentSpeed) * minSpeed;
          speedY = (speedY / currentSpeed) * minSpeed;
        }

        return { ...dot, x, y, speedX, speedY };
      })
    );

    // Update color
    setColorValue(prevValue => (prevValue + 0.05) % 100);

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animateDots);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateDots]);

  // Function to convert colorValue to a visible HSL color, excluding light green and yellow
  const getVisibleColor = (value) => {
    // Map the value to a hue range that excludes light green and yellow
    let hue;
    if (value < 60) {
      // Red to blue (0-240)
      hue = value * 4;
    } else {
      // Purple to red (240-360)
      hue = 240 + (value - 60) * 3;
    }
    hue = hue % 360;

    // Adjust saturation and lightness for better visibility
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute rounded-full opacity-70"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: getVisibleColor(colorValue),
          }}
        />
      ))}
    </div>
  );
};

export default MovingDots;