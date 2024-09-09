import React, { useRef, useEffect } from 'react';

const areNodesIntersecting = (node1, node2) => {
  const distance = Math.sqrt(
    (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
  );
  return distance < node1.size + node2.size;
};

const generateNodes = (count, canvasWidth, canvasHeight) => {
  const nodes = [];

  for (let i = 0; i < count; i++) {
    let newNode;
    let isIntersecting;

    do {
      newNode = {
        id: i,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 8 + 3,
        color: 'rgba(0, 0, 0, 0.2)',
        connections: 0,
        speedX: (Math.random() - 0.5) * 2, // Initial random speed
        speedY: (Math.random() - 0.5) * 2,
        isMainNode: false,
      };

      isIntersecting = nodes.some((node) => areNodesIntersecting(newNode, node));
    } while (isIntersecting);

    nodes.push(newNode);
  }

  const largestNode = nodes.reduce((max, node) => (node.size > max.size ? node : max), nodes[0]);
  largestNode.color = 'rgba(30, 144, 255, 0.8)';
  largestNode.size = 30;
  largestNode.x = canvasWidth / 2;
  largestNode.y = (canvasHeight / 2) + 50;
  largestNode.isMainNode = true;

  return nodes;
};

const createMinimumSpanningTree = (nodes) => {
  // ... (Keep the existing implementation)
};

const KnowledgeGraph = () => {
  const canvasRef = useRef(null);
  const nodes = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { innerWidth: canvasWidth, innerHeight: canvasHeight } = window;

    nodes.current = generateNodes(100, canvasWidth, canvasHeight);
    createMinimumSpanningTree(nodes.current);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.current.forEach((node1, index) => {
        for (let i = index + 1; i < nodes.current.length; i++) {
          const node2 = nodes.current[i];
          const distance = Math.sqrt(
            (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
          );

          if (distance < 200) { // Increased connection distance
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
            node1.connections++;
            node2.connections++;
          }
        }
      });

      // Ensure every node has at least one connection
      nodes.current.forEach((node) => {
        if (node.connections === 0) {
          let nearestNode = null;
          let minDistance = Infinity;
          nodes.current.forEach((otherNode) => {
            if (node.id !== otherNode.id) {
              const distance = Math.sqrt(
                (node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestNode = otherNode;
              }
            }
          });

          if (nearestNode) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nearestNode.x, nearestNode.y);
            ctx.stroke();
            node.connections++;
            nearestNode.connections++;
          }
        }
      });

      // Draw the nodes in two passes: first non-main nodes, then the main node
      nodes.current.forEach((node) => {
        if (!node.isMainNode) {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw the main node last so it's always on top
      const mainNode = nodes.current.find(node => node.isMainNode);
      if (mainNode) {
        ctx.fillStyle = mainNode.color;
        ctx.beginPath();
        ctx.arc(mainNode.x, mainNode.y, mainNode.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const updateNodes = () => {
      nodes.current.forEach((node) => {
        if (!node.isMainNode) {
          // Update position based on speed
          node.x += node.speedX;
          node.y += node.speedY;

          // Bounce off edges
          if (node.x <= node.size || node.x >= canvasWidth - node.size) {
            node.speedX *= -1;
          }
          if (node.y <= node.size || node.y >= canvasHeight - node.size) {
            node.speedY *= -1;
          }

          // Adjust speed based on mouse position
          const dx = node.x - mousePos.current.x;
          const dy = node.y - mousePos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Increased influence range
            const angle = Math.atan2(dy, dx);
            node.speedX += Math.cos(angle) * 0.2;
            node.speedY += Math.sin(angle) * 0.2;
          }

          // Apply speed limits
          const maxSpeed = 5;
          const speed = Math.sqrt(node.speedX ** 2 + node.speedY ** 2);
          if (speed > maxSpeed) {
            node.speedX = (node.speedX / speed) * maxSpeed;
            node.speedY = (node.speedY / speed) * maxSpeed;
          }

          // Apply damping
          node.speedX *= 0.98;
          node.speedY *= 0.98;
        }
      });

      draw();
      requestAnimationFrame(updateNodes);
    };

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    draw();
    updateNodes();

    const handleMouseMove = (event) => {
      mousePos.current.x = event.clientX;
      mousePos.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes.current = generateNodes(100, window.innerWidth, window.innerHeight);
      createMinimumSpanningTree(nodes.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default KnowledgeGraph;