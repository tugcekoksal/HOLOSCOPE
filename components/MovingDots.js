import React, { useRef, useEffect, useCallback, useState } from "react"
import Notification from "./Notification"

// Function to check if two nodes overlap
const areNodesIntersecting = (node1, node2, minDistance) => {
  const distance = Math.sqrt(
    (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
  )
  return distance < node1.size + node2.size + minDistance
}

// Generate nodes with non-overlapping positions and ensure the largest node is in the center
const generateNodes = (
  nodeCount,
  canvasWidth,
  canvasHeight,
  minDistanceFromMain
) => {
  const nodes = []
  const mainNodeSize = 30

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
    isHovered: false,
    distanceFromMain: 0,
    connectedNodes: new Set(),
    glowOpacity: 0,
  }
  nodes.push(mainNode)

  for (let i = 1; i <= nodeCount; i++) {
    let newNode
    let isIntersecting

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

      isIntersecting = nodes.some((node) =>
        areNodesIntersecting(
          newNode,
          node,
          node === mainNode ? minDistanceFromMain : 0
        )
      )
    } while (isIntersecting)

    newNode.homeX = newNode.x
    newNode.homeY = newNode.y

    const dx = newNode.x - mainNode.x
    const dy = newNode.y - mainNode.y
    newNode.distanceFromMain = Math.sqrt(dx * dx + dy * dy)

    nodes.push(newNode)
  }

  nodes.sort((a, b) => a.distanceFromMain - b.distanceFromMain)

  return nodes
}

const KnowledgeGraph = () => {
  const [emailError, setEmailError] = useState("") // State to track email validation errors
  const [isHoveredText, setIsHoveredText] = useState(false)
  const [isExpand, setIsExpanding] = useState(false)
  const [isFullyExpanded, setIsFullyExpanded] = useState(false)
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [minDistanceFromMain, setMinDistanceFromMain] = useState(150)
  const [email, setEmail] = useState("")
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [shine, setShine] = useState(0)
  const [nodeCount, setNodeCount] = useState(100)
  const [buttonText, setButtonText] = useState("Start Your Transformation")
  const [notification, setNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const canvasRef = useRef(null)
  const textRef = useRef(null)
  const buttonRef = useRef(null)
  const nodes = useRef([])
  const mousePos = useRef({ x: 0, y: 0 })
  const isExpanding = useRef(false)
  const maxConnectionDistance = 150
  const minConnectionDistance = 30
  const maxConnectionsPerNode = 6

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const animateShine = () => {
      setShine((prevShine) => (prevShine < 100 ? prevShine + 0.4 : 0))
    }

    const intervalId = setInterval(animateShine, 20)
    return () => {
      document.body.style.overflow = "auto"
      clearInterval(intervalId)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Custom email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }

    setEmailError("") // Reset the error if the email is valid
    setButtonText("Sending...")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      const data = await response.json()
      setFormSubmitted(true)

      setEmail("") // Clear email field on successful submission
      handleCloseClick(e) // Close the form popup
      setNotification(true)
      setNotificationMessage(
        "🎉 Congratulations! Your email registered successfully!"
      )
    } catch (error) {
      console.error(error)
      setEmailError(
        error.message || "There was an error, please try again later."
      )
      setButtonText("Start Your Transformation")
    }
  }
  const handleNotificationClose = () => {
    // Reset the notification state after it fades out
    setNotification(false)
    setNotificationMessage("") // Optionally clear the message
  }

  const handleInteractionMove = (event) => {
    let x, y

    if (event.type === "mousemove") {
      x = event.clientX
      y = event.clientY
    } else if (event.type === "touchmove" || event.type === "touchstart") {
      const touch = event.touches[0]
      x = touch.clientX
      y = touch.clientY
    }

    mousePos.current.x = x
    mousePos.current.y = y

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        isExpanding.current = true
        setIsHoveredText(true)
      } else {
        isExpanding.current = false
        setIsHoveredText(false)
      }
    }
  }

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    nodes.current = generateNodes(
      nodeCount,
      window.innerWidth,
      window.innerHeight,
      minDistanceFromMain
    )
  }, [nodeCount, minDistanceFromMain])

  const handleButtonClick = () => {
    setIsButtonClicked(true)
    setIsExpanding(true)

    // First, fully expand the button
    setTimeout(() => {
      setIsFullyExpanded(true)

      // Then, wait for a brief delay before making the text visible
      setTimeout(() => {
        setIsTextVisible(true) // Now show the text
      }, 200) // Adjust the delay as needed (2 seconds in this case)
    }, 50) // Adjust this to match the button's transition duration
  }

  const handleCloseClick = (e) => {
    e.stopPropagation()
    setIsButtonClicked(false)
    setFormSubmitted(false)
    setButtonText("Start Your Transformation")
    setIsExpanding(false)
    setIsFullyExpanded(false)
    setIsTextVisible(false)
    setEmailError(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const { innerWidth: canvasWidth, innerHeight: canvasHeight } = window

    nodes.current = generateNodes(
      nodeCount,
      canvasWidth,
      canvasHeight,
      minDistanceFromMain
    )

    const drawCircularMetallicBackground = () => {
      const mainNode = nodes.current[0]
      const gradient = ctx.createRadialGradient(
        mainNode.x,
        mainNode.y,
        0,
        mainNode.x,
        mainNode.y,
        Math.max(canvasWidth, canvasHeight)
      )

      gradient.addColorStop(0, "rgba(245, 245, 245, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const createConnections = () => {
      nodes.current.forEach((node1) => {
        const potentialConnections = nodes.current
          .filter((node2) => {
            const distance = Math.sqrt(
              (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
            )
            return (
              node1 !== node2 &&
              distance < maxConnectionDistance &&
              node1.connections < maxConnectionsPerNode &&
              node2.connections < maxConnectionsPerNode
            )
          })
          .sort((a, b) => {
            const distA = Math.sqrt((node1.x - a.x) ** 2 + (node1.y - a.y) ** 2)
            const distB = Math.sqrt((node1.x - b.x) ** 2 + (node1.y - b.y) ** 2)
            return distA - distB
          })

        for (const node2 of potentialConnections) {
          if (
            node1.connections < maxConnectionsPerNode &&
            node2.connections < maxConnectionsPerNode &&
            !node1.connectedNodes.has(node2) &&
            !node2.connectedNodes.has(node1)
          ) {
            node1.connectedNodes.add(node2)
            node2.connectedNodes.add(node1)
            node1.connections++
            node2.connections++
          }
        }
      })
    }

    const updateConnections = () => {
      nodes.current.forEach((node1) => {
        node1.connectedNodes.forEach((node2) => {
          const distance = Math.sqrt(
            (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
          )
          if (distance > maxConnectionDistance) {
            node1.connectedNodes.delete(node2)
            node2.connectedNodes.delete(node1)
            node1.connections--
            node2.connections--
          }
        })

        if (node1.connections < maxConnectionsPerNode) {
          const potentialConnections = nodes.current
            .filter((node2) => {
              const distance = Math.sqrt(
                (node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2
              )
              return (
                node1 !== node2 &&
                distance >= minConnectionDistance &&
                distance < maxConnectionDistance &&
                node1.connections < maxConnectionsPerNode &&
                node2.connections < maxConnectionsPerNode &&
                !node1.connectedNodes.has(node2) &&
                !node2.connectedNodes.has(node1)
              )
            })
            .sort((a, b) => {
              const distA = Math.sqrt(
                (node1.x - a.x) ** 2 + (node1.y - a.y) ** 2
              )
              const distB = Math.sqrt(
                (node1.x - b.x) ** 2 + (node1.y - b.y) ** 2
              )
              return distA - distB
            })

          for (const node2 of potentialConnections) {
            if (
              node1.connections < maxConnectionsPerNode &&
              node2.connections < maxConnectionsPerNode
            ) {
              node1.connectedNodes.add(node2)
              node2.connectedNodes.add(node1)
              node1.connections++
              node2.connections++
            }
          }
        }
      })
    }

    const drawConnections = () => {
      nodes.current.forEach((node1) => {
        if (node1.connectedNodes && node1.connectedNodes instanceof Set) {
          node1.connectedNodes.forEach((node2) => {
            ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node1.x, node1.y)
            ctx.lineTo(node2.x, node2.y)
            ctx.stroke()
          })
        }
      })
    }

    const drawNodes = () => {
      nodes.current.forEach((node) => {
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const draw = () => {
      drawCircularMetallicBackground()
      drawConnections()
      drawNodes()
    }

    const updateNodes = () => {
      const mainNode = nodes.current[0]

      nodes.current.forEach((node, index) => {
        if (!node.isMainNode) {
          node.x += node.speedX
          node.y += node.speedY

          if (node.x <= node.size || node.x >= canvasWidth - node.size) {
            node.speedX *= -0.8
          }
          if (node.y <= node.size || node.y >= canvasHeight - node.size) {
            node.speedY *= -0.8
          }

          const dx = node.x - mainNode.x
          const dy = node.y - mainNode.y
          const distanceToMain = Math.sqrt(dx * dx + dy * dy)
          const minDistance = 100
          if (distanceToMain < minDistance) {
            const angle = Math.atan2(dy, dx)
            const repulsionForce = 0.05
            node.speedX += Math.cos(angle) * repulsionForce
            node.speedY += Math.sin(angle) * repulsionForce
          }

          const mouseDistance = Math.sqrt(
            (node.x - mousePos.current.x) ** 2 +
              (node.y - mousePos.current.y) ** 2
          )

          if (mouseDistance < 300) {
            const angle = Math.atan2(
              node.y - mousePos.current.y,
              node.x - mousePos.current.x
            )
            node.speedX += Math.cos(angle) * 0.1
            node.speedY += Math.sin(angle) * 0.1
          }

          const homeForce = 0.001
          node.speedX += (node.homeX - node.x) * homeForce
          node.speedY += (node.homeY - node.y) * homeForce

          const maxSpeed = 2
          const speed = Math.sqrt(node.speedX ** 2 + node.speedY ** 2)
          if (speed > maxSpeed) {
            node.speedX = (node.speedX / speed) * maxSpeed
            node.speedY = (node.speedY / speed) * maxSpeed
          }

          node.speedX *= 0.91
          node.speedY *= 0.91

          if (isExpanding.current) {
            if (!node.turningBlue) {
              const groupIndex = Math.floor(index / 3)
              node.transitionDelay = groupIndex * 5
              node.turningBlue = true
            }
            if (node.transitionDelay <= 0) {
              node.blueLevel = Math.min(1, node.blueLevel + 0.02)
              node.color = `rgba(0, 92, 158, ${0.7 + node.blueLevel * 0.3})`
            } else {
              node.transitionDelay -= 3
            }
          } else {
            node.turningBlue = false
            const groupIndex = Math.floor(index / 4)
            node.transitionDelay = groupIndex * 100
            node.blueLevel = Math.max(0, node.blueLevel - 0.02)
            node.color = `rgba(160,160,160,255)`
          }
        }
      })

      updateConnections()
      draw()
      requestAnimationFrame(updateNodes)
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    drawCircularMetallicBackground()
    createConnections()
    draw()
    updateNodes()

    const updateSettings = () => {
      if (window.innerWidth <= 768) {
        setMinDistanceFromMain(150)
        setNodeCount(50)
      } else {
        setMinDistanceFromMain(200)
        setNodeCount(100)
      }
    }

    updateSettings()
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768)
      }
    }

    checkMobile()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize, nodeCount, minDistanceFromMain])

  return (
    <div
      className="relative w-full h-full"
      style={{ position: "fixed", inset: 0, overflow: "hidden" }}
      onMouseMove={handleInteractionMove}
      onTouchMove={handleInteractionMove}
      onTouchStart={handleInteractionMove}
    >
      {/* Add the Notification component */}
      {notification && (
        <Notification
          message={notificationMessage}
          onClose={handleNotificationClose} // Reset notification after fade-out
        />
      )}

      {isButtonClicked && (
        <div
          className="absolute top-0 left-0 w-full h-[60px] bg-white z-20 mb-4"
          style={{
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "all 0.5s ease-in-out",
            marginTop: 0,
            paddingTop: 0,
          }}
        ></div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 fade-in-node"
        style={{ position: "absolute", inset: 0 }}
      />

      <h1
        ref={textRef}
        className={`absolute font-bold z-30 transition-all duration-[0.5s] md:duration-[0.7s] ease-in-out text-[#4A4A4A] 
        ${
          isButtonClicked
            ? "text-4xl sm:text-5xl"
            : isHoveredText
              ? "text-4xl sm:text-6xl"
              : "text-4xl sm:text-5xl"
        }`}
        id="company-name"
        style={{
          top: isButtonClicked ? "1%" : "46%",
          left: "50%",
          transform: isButtonClicked
            ? "translate(-50%, 0)"
            : "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        HOLOSCOPE
      </h1>
      <button
        ref={buttonRef}
        className={`absolute flex flex-col items-center justify-center z-10 rounded-sm shadow-lg font-semibold transition-all duration-1000 ease-out fade-in-node font-montserrat
    ${isButtonClicked ? "bg-white" : "bg-[#0077be] text-white  hover:bg-[#005c9e]"}  ${isMobile && isButtonClicked && isFullyExpanded ? "mobile-height" : ""}
  `}
        style={{
          top: "55%", // Always center vertically
          left: "50%", // Always center horizontally
          transform: "translate(-50%, -50%)", // Maintain centered positioning
          width: isExpand ? (isFullyExpanded ? "90%" : "300px") : "250px",
          maxWidth: isFullyExpanded ? "500px" : "none",
          height: isExpand ? (isFullyExpanded ? "400px" : "100px") : "auto",
          padding: isButtonClicked
            ? isFullyExpanded
              ? "30px"
              : "16px 24px" // Symmetrical padding
            : "16px 24px",
          transformOrigin: "center", // Center the expansion
          transition: isExpand
            ? "width 0.6s ease-out, padding 1.2s ease-out, height 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)" // Slower height transition
            : "all 0.6s ease-out", // Faster closing transition for all properties
          borderRadius: "20px",
          boxShadow: isButtonClicked
            ? "0 8px 30px rgba(0, 0, 0, 0.15)"
            : "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={!isButtonClicked ? handleButtonClick : undefined}
      >
        {" "}
        {!isButtonClicked && (
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              right: "-50%",
              bottom: "-50%",
              background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0) ${shine}%,
                rgba(255,255,255,0.03) ${shine + 10}%,
                rgba(255,255,255,0.2) ${shine + 20}%,
                rgba(255,255,255,0.3) ${shine + 30}%,
                rgba(255,255,255,0.2) ${shine + 40}%,
                rgba(255,255,255,0.03) ${shine + 50}%,
                rgba(255,255,255,0) ${shine + 60}%
              )
            `,
              transform: "rotate(-10deg) skew(-10deg)",
              transition: "opacity 0.3s",
              opacity: 1,
              pointerEvents: "none",
            }}
          />
        )}
        {isFullyExpanded ? (
          <>
            <button
              className="absolute top-[-10px] right-[-10px]  flex items-center justify-center w-8 h-8 rounded-full bg-[#0077be] text-white hover:bg-[#005c9e] transition-colors duration-300 ease-in-out"
              onClick={handleCloseClick}
              aria-label="Close"
              style={{
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              ✕
            </button>
            <div
              className="w-full mx-auto"
              style={{
                opacity: isTextVisible ? 1 : 0, // Use isTextVisible to control visibility
                transition: "opacity 1s ease-in-out", // Smooth fade-in transition
              }}
            >
              <h2
                className={` mb-4 text-[2rem] text-left flex-wrap text-gray-700 font-montserrat`}
              >
                Elevate Your Business!
              </h2>

              <p className="text-left text-sm mb-2 font-normal text-gray-500 font-montserrat">
                Imagine a world where running your company feels as natural as
                breathing. With AI as your silent partner, that world is now
                within reach. We're not just dreaming of
                <span className="font-semibold mx-2">
                  easier business management
                </span>
                —we're making it a reality.
              </p>

              {!formSubmitted && (
                <p className="text-left text-sm mb-8 text-gray-500 font-semibold font-poppins">
                  Ready to transform how you run your company?
                </p>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{
                opacity: isTextVisible ? 1 : 0, // Form fades in when fully expanded
                transition: "opacity 1s ease-in-out", // Smooth fade-in transition
              }}
              className="flex flex-col items-center space-y-3 focus-within:bg-white rounded-[15px] w-full"
            >
              <style jsx>
                {`
                  input::placeholder {
                    font-weight: 400;
                  }
                `}
              </style>
              
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:bg-white mb-2 sm:mb-0 p-3 px-4 w-full sm:flex-grow rounded-[15px] outline-none border border-gray-300  bg-gray-100 text-gray-700 placeholder-gray-400  placeholder-opacity-75 "
                required
              />
              {/* Show error message */}
              {emailError && (
                <p className="text-red-500 text-sm font-medium ">
                  {emailError}
                </p>
              )}
              <button
                type="submit"
                className="bg-[#0077be] font-montserrat text-white px-6 py-3 w-full sm:flex-grow rounded-[15px] hover:bg-[#005c9e] mt-2 sm:mt-0 font-semibold"
              >
                <span className="font-semibold">{buttonText}</span>
              </button>
            </form>
          </>
        ) : (
          <span
            style={{
              position: "relative",
              zIndex: 1,
              opacity: isExpand ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          >
            Become an AI Company
          </span>
        )}
      </button>
    </div>
  )
}

export default KnowledgeGraph
