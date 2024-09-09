import React, { useEffect } from 'react';

const BlueNode = ({ ctx, node, isExpanding }) => {
  useEffect(() => {
    const drawNode = () => {
      // Gradually increase the glow opacity when expanding
      if (isExpanding) {
        node.glowOpacity = Math.min(1, node.glowOpacity + 0.05); // Increase gradually
      } else {
        node.glowOpacity = Math.max(0, node.glowOpacity - 0.02); // Decrease gradually
      }

      // Draw the main node with a metallic blue gradient
      const gradient = ctx.createRadialGradient(
        node.x - 5,
        node.y - 5,
        10,
        node.x,
        node.y,
        node.size
      );
      gradient.addColorStop(0, 'rgba(135, 206, 250, 1)'); // Light blue center to simulate light hitting
      gradient.addColorStop(0.5, 'rgba(30, 144, 255, 1)'); // Bright blue mid-tone
      gradient.addColorStop(1, 'rgba(15, 75, 150, 0.8)'); // Dark blue edge for depth

      // Define the starting and ending sizes for the glow animation with much smaller sizes
      const innerGlowSize = node.size * (1 + node.glowOpacity * 0.01); // Smaller inner radius
      const outerGlowSize = node.size * (1.3 + node.glowOpacity * 0.1); // Smaller outer radius

      // Add the glowing effect with a slight blue tint and smaller size
      const glowGradient = ctx.createRadialGradient(
        node.x,
        node.y,
        innerGlowSize, // Inner radius grows gradually and is smaller
        node.x,
        node.y,
        outerGlowSize // Outer radius grows gradually and is smaller
      );
      glowGradient.addColorStop(0, `rgba(173, 216, 230, ${node.glowOpacity * 0.3})`); // Light blue, more transparent
      glowGradient.addColorStop(1, 'rgba(30, 144, 255, 0)'); // Fade out to transparent blue

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, outerGlowSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();

      // Determine the text based on hover state
      const displayText = node.isHovered ? 'Become an AI company' : 'Découvrir';

      // Draw the appropriate text inside the main node
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayText, node.x, node.y);
    };

    drawNode();
  }, [ctx, node, isExpanding]);

  return null; // This component only handles drawing
};

export default BlueNode;
