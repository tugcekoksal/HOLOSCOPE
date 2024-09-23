export const areNodesIntersecting = (node1, node2, minDistance) => {
  const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
  return distance < node1.size + node2.size + minDistance;
}

export const generateNodes = (nodeCount, canvasWidth, canvasHeight, minDistanceFromMain) => {
  const nodes = [];
  const mainNodeSize = 30;

  const mainNode = {
    id: 0,
    x: canvasWidth / 2,
    y: canvasHeight / 2 + 0,
    homeX: canvasWidth / 2,
    homeY: canvasHeight / 2 + 100,
    size: mainNodeSize,
    color: "rgba(245, 245, 245, 1)",
    originalColor: "rgba(30, 144, 255, 0.9)",
    connections: 0,
    speedX: 0,
    speedY: 0,
    isMainNode: true,
    distanceFromMain: 0,
    connectedNodes: new Set(),
  };
  nodes.push(mainNode);

  for (let i = 1; i <= nodeCount; i++) {
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
        color: "rgba(200, 200, 200, 0.9)",
        originalColor: "rgba(200, 200, 200, 0.9)",
        connections: 0,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        isMainNode: false,
        blueLevel: 0,
        transitionDelay: 0,
        turningBlue: false,
        connectedNodes: new Set(),
      }
      isIntersecting = nodes.some(node => areNodesIntersecting(newNode, node, node === mainNode ? minDistanceFromMain : 0));
    } while (isIntersecting);

    newNode.homeX = newNode.x;
    newNode.homeY = newNode.y;
    const dx = newNode.x - mainNode.x
    const dy = newNode.y - mainNode.y
    newNode.distanceFromMain = Math.sqrt(dx * dx + dy * dy)
    nodes.push(newNode);
  }
  
  nodes.sort((a, b) => a.distanceFromMain - b.distanceFromMain);
  return nodes;
}
