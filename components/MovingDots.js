import React, { useRef, useEffect, useCallback, useState } from 'react';

// Function to check if two nodes overlap
const areNodesIntersecting = (node1, node2, minDistance) => {
  const distance = Math.sqrt(
    (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
  );
  return distance < (node1.size + node2.size + minDistance);
};

// Generate nodes with non-overlapping positions and ensure the largest node is in the center
const generateNodes = (count, canvasWidth, canvasHeight) => {
  const nodes = [];
  const mainNodeSize = 30; // Slightly larger size for the main node
  const minDistanceFromMain = 150;

  // Create main node first
  const mainNode = {
    id: 0,
    x: canvasWidth / 2,
    y: canvasHeight / 2 + 50, // Positioned slightly lower
    homeX: canvasWidth / 2,
    homeY: canvasHeight / 2 + 100,
    size: mainNodeSize,
    color: 'rgba(30, 144, 255, 0.9)', // Bright blue for main node
    originalColor: 'rgba(30, 144, 255, 0.9)',
    connections: 0,
    speedX: 0,
    speedY: 0,
    isMainNode: true,
    isHovered: false,
    distanceFromMain: 0, // To track distance for sequential effect
    connectedNodes: new Set(), // Initialize connectedNodes set
    glowOpacity: 0, // Track the opacity of the glowing effect
  };
  nodes.push(mainNode);

  for (let i = 1; i <= count; i++) {
    let newNode;
    let isIntersecting;

    do {
      newNode = {
        id: i,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        homeX: 0,
        homeY: 0,
        size: Math.random() * 12 + 3,
        color: 'rgba(200, 200, 200, 0.9)', // Gray color for nodes
        originalColor: 'rgba(200, 200, 200, 0.9)', // Save original color for reversion
        connections: 0, // Track the number of connections
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        isMainNode: false,
        blueLevel: 0, // Track the transition level of blue
        transitionDelay: 0, // Delay before starting blue transition
        turningBlue: false, // Flag for managing blue state
        connectedNodes: new Set(), // Initialize connectedNodes set
      };

      isIntersecting = nodes.some((node) =>
        areNodesIntersecting(newNode, node, node === mainNode ? minDistanceFromMain : 0)
      );
    } while (isIntersecting);

    newNode.homeX = newNode.x;
    newNode.homeY = newNode.y;

    // Calculate distance from the main node for sequential effect
    const dx = newNode.x - mainNode.x;
    const dy = newNode.y - mainNode.y;
    newNode.distanceFromMain = Math.sqrt(dx * dx + dy * dy);

    nodes.push(newNode);
  }

  // Sort nodes by distance to the main node
  nodes.sort((a, b) => a.distanceFromMain - b.distanceFromMain);

  return nodes;
};

const KnowledgeGraph = () => {
  const [isHoveredText, setIsHoveredText] = useState(false);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null); // Ref for the HOLOSCOPE text
  const nodes = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const isExpanding = useRef(false); // Use ref to track if expanding
  const maxConnectionDistance = 150; // Maximum distance for connecting nodes
  const minConnectionDistance = 30; // Minimum distance to maintain a connection
  const maxConnectionsPerNode = 6; // Maximum number of connections per node

  const handleMouseMove = useCallback((event) => {
    mousePos.current.x = event.clientX;
    mousePos.current.y = event.clientY;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (
        mousePos.current.x >= rect.left &&
        mousePos.current.x <= rect.right &&
        mousePos.current.y >= rect.top &&
        mousePos.current.y <= rect.bottom
      ) {
        isExpanding.current = true;
        setIsHoveredText(true);
      } else {
        isExpanding.current = false;
        setIsHoveredText(false);
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    nodes.current = generateNodes(100, window.innerWidth, window.innerHeight);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { innerWidth: canvasWidth, innerHeight: canvasHeight } = window;

    nodes.current = generateNodes(100, canvasWidth, canvasHeight);

    const drawCircularMetallicBackground = () => {
      const mainNode = nodes.current[0];

      // Create a radial gradient for the metallic effect
      const gradient = ctx.createRadialGradient(
        mainNode.x,
        mainNode.y,
        0,
        mainNode.x,
        mainNode.y,
        Math.max(canvasWidth, canvasHeight)
      );

      gradient.addColorStop(0, 'rgba(245, 245, 245, 1)'); // background color White

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const createConnections = () => {
      nodes.current.forEach((node1) => {
        const potentialConnections = nodes.current
          .filter((node2) => {
            const distance = Math.sqrt(
              (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
            );
            return (
              node1 !== node2 &&
              distance < maxConnectionDistance && // Only connect if within max distance
              node1.connections < maxConnectionsPerNode &&
              node2.connections < maxConnectionsPerNode
            );
          })
          .sort((a, b) => {
            const distA = Math.sqrt(
              (node1.x - a.x) ** 2 + (node1.y - a.y) ** 2
            );
            const distB = Math.sqrt(
              (node1.x - b.x) ** 2 + (node1.y - b.y) ** 2
            );
            return distA - distB;
          });

        for (const node2 of potentialConnections) {
          if (
            node1.connections < maxConnectionsPerNode &&
            node2.connections < maxConnectionsPerNode &&
            !node1.connectedNodes.has(node2) &&
            !node2.connectedNodes.has(node1)
          ) {
            node1.connectedNodes.add(node2);
            node2.connectedNodes.add(node1);
            node1.connections++;
            node2.connections++;
          }
        }
      });
    };

    const updateConnections = () => {
      nodes.current.forEach((node1) => {
        // Check existing connections
        node1.connectedNodes.forEach((node2) => {
          const distance = Math.sqrt(
            (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
          );
          // If nodes are too far apart, disconnect them
          if (distance > maxConnectionDistance) {
            node1.connectedNodes.delete(node2);
            node2.connectedNodes.delete(node1);
            node1.connections--;
            node2.connections--;
          }
        });

        // Attempt to reconnect if under connection limit
        if (node1.connections < maxConnectionsPerNode) {
          const potentialConnections = nodes.current
            .filter((node2) => {
              const distance = Math.sqrt(
                (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
              );
              return (
                node1 !== node2 &&
                distance >= minConnectionDistance &&
                distance < maxConnectionDistance &&
                node1.connections < maxConnectionsPerNode &&
                node2.connections < maxConnectionsPerNode &&
                !node1.connectedNodes.has(node2) &&
                !node2.connectedNodes.has(node1)
              );
            })
            .sort((a, b) => {
              const distA = Math.sqrt(
                (node1.x - a.x) ** 2 + (node1.y - a.y) ** 2
              );
              const distB = Math.sqrt(
                (node1.x - b.x) ** 2 + (node1.y - b.y) ** 2
              );
              return distA - distB;
            });

          for (const node2 of potentialConnections) {
            if (
              node1.connections < maxConnectionsPerNode &&
              node2.connections < maxConnectionsPerNode
            ) {
              node1.connectedNodes.add(node2);
              node2.connectedNodes.add(node1);
              node1.connections++;
              node2.connections++;
            }
          }
        }
      });
    };

    const drawConnections = () => {
      nodes.current.forEach((node1) => {
        if (node1.connectedNodes && node1.connectedNodes instanceof Set) {
          node1.connectedNodes.forEach((node2) => {
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'; // connection color for white background
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          });
        }
      });
    };

    const drawNodes = () => {
      nodes.current.forEach((node) => {
        if (node.isMainNode) {
          // Gradually increase the glow opacity when expanding
          if (isExpanding.current) {
            node.glowOpacity = Math.min(1, node.glowOpacity + 0.05); // Increase gradually
          } else {
            node.glowOpacity = Math.max(0, node.glowOpacity - 0.02); // Decrease gradually
          }

          // Draw the main node with an inverse metallic blue gradient
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            node.size + 10,
            node.x,
            node.y,
            0
          );

          gradient.addColorStop(1, 'rgba(64, 64, 64, 0.6)'); // Dark blue at the center

          // // Define the starting and ending sizes for the glow animation with much smaller sizes
          // const innerGlowSize = node.size * (1 + node.glowOpacity * 0.01); // Smaller inner radius
          // const outerGlowSize = node.size * (1.3 + node.glowOpacity * 0.1); // Smaller outer radius

          // // Add the glowing effect with a slight blue tint and smaller size
          // const glowGradient = ctx.createRadialGradient(
          //   node.x,
          //   node.y,
          //   innerGlowSize, // Inner radius grows gradually and is smaller
          //   node.x,
          //   node.y,
          //   outerGlowSize // Outer radius grows gradually and is smaller
          // );
          // glowGradient.addColorStop(
          //   0,
          //   `rgba(70, 130, 180, ${node.glowOpacity * 0.3})`
          // ); // Steel blue, more transparent
          // glowGradient.addColorStop(1, 'rgba(30, 144, 255, 0)'); // Fade out to transparent blue

          // ctx.fillStyle = glowGradient;
          // ctx.beginPath();
          // ctx.arc(node.x, node.y, outerGlowSize, 0, Math.PI * 2);
          // ctx.fill();

          // ctx.fillStyle = gradient;
          // ctx.beginPath();
          // ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          // ctx.fill();

          // Draw the text "Become an AI company" inside the main node when hovered
          if (node.isHovered) {
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Become an AI', node.x, node.y - 10); // First line
            ctx.fillText('company', node.x, node.y + 10); // Second line
          }
        } else {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const draw = () => {
      drawCircularMetallicBackground();
      drawConnections();
      drawNodes();
    };

    const updateNodes = () => {
      const mainNode = nodes.current[0];

      nodes.current.forEach((node, index) => {
        if (!node.isMainNode) {
          node.x += node.speedX;
          node.y += node.speedY;

          if (node.x <= node.size || node.x >= canvasWidth - node.size) {
            node.speedX *= -0.8;
          }
          if (node.y <= node.size || node.y >= canvasHeight - node.size) {
            node.speedY *= -0.8;
          }

          const dx = node.x - mainNode.x;
          const dy = node.y - mainNode.y;
          const distanceToMain = Math.sqrt(dx * dx + dy * dy);
          const minDistance = 100;
          if (distanceToMain < minDistance) {
            const angle = Math.atan2(dy, dx);
            const repulsionForce = 0.05;
            node.speedX += Math.cos(angle) * repulsionForce;
            node.speedY += Math.sin(angle) * repulsionForce;
          }

          const mouseDistance = Math.sqrt(
            (node.x - mousePos.current.x) ** 2 +
              (node.y - mousePos.current.y) ** 2
          );

          if (mouseDistance < 300) {
            const angle = Math.atan2(
              node.y - mousePos.current.y,
              node.x - mousePos.current.x
            );
            node.speedX += Math.cos(angle) * 0.1;
            node.speedY += Math.sin(angle) * 0.1;
          }

          const homeForce = 0.001;
          node.speedX += (node.homeX - node.x) * homeForce;
          node.speedY += (node.homeY - node.y) * homeForce;

          const maxSpeed = 2;
          const speed = Math.sqrt(node.speedX ** 2 + node.speedY ** 2);
          if (speed > maxSpeed) {
            node.speedX = (node.speedX / speed) * maxSpeed;
            node.speedY = (node.speedY / speed) * maxSpeed;
          }

          node.speedX *= 0.91;
          node.speedY *= 0.91;

          if (isExpanding.current) {
            // Gradual color change to blue when the text is hovered
            if (!node.turningBlue) {
              const groupIndex = Math.floor(index / 3);
              node.transitionDelay = groupIndex * 5;
              node.turningBlue = true;
            }
            if (node.transitionDelay <= 0) {
              node.blueLevel = Math.min(1, node.blueLevel + 0.02);
              node.color = `rgba(85, 107, 47, ${0.7 + node.blueLevel * 0.3})`; // Sea blue with a metallic touch
            } else {
              node.transitionDelay -= 1;
            }
          } else {
            node.turningBlue = false;
            const groupIndex = Math.floor(index / 3);
            node.transitionDelay = groupIndex * 100;
            node.blueLevel = Math.max(0, node.blueLevel - 0.02);
            node.color = `rgba(160,160,160,255)`;
          }
        }
      });

      updateConnections();
      draw();
      requestAnimationFrame(updateNodes);
    };

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    drawCircularMetallicBackground();
    createConnections();
    draw();
    updateNodes();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, isHoveredText]);

  return (
    <div
      className="relative w-full h-full"
      style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ position: 'absolute', inset: 0 }}
      />
      <h1
        
        className={`absolute font-bold mb-20 z-10 transition-all duration-[1.5s] ease-in-out  text-[#3B3B3B] ${
          isHoveredText ? 'text-[4.4rem] ' : 'text-6xl'
        }`}
        id='company-name'
        style={{
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        HOLOSCOPE
      </h1>
      <button
      ref={buttonRef}
    className="absolute z-10 px-8 py-4  text-white font-semibold bg-[#6B8E23] rounded-full shadow-md hover:bg-[#556B2F] transition-all duration-300 ease-in-out"
    style={{
      top: '55%', // Adjust to place the button right under the text
      left: '50%',
      transform: 'translate(-50%, 0)',
    }}
    onClick={() => alert('Action triggered!')} // Replace with your actual action
  >
    Become an AI Company
  </button>
    </div>
  );
};

export default KnowledgeGraph;
