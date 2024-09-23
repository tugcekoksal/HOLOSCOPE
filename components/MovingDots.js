import React, { useRef, useEffect, useCallback, useState } from "react"
import Notification from "./Notification"
import NavBar from "./Navbar"
import Title from "./Title"
import { generateNodes } from "./utils"
import { canvasStyles } from "@/styles/canvasStyle"
import { ExpandingButton } from "./ExpandingButton"

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
  const [buttonText, setButtonText] = useState("C'est parti !")
  const [notification, setNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const canvasRef = useRef(null)

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
      setEmailError("Veuillez entrer une adresse e-mail valide.")
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
        "🎉 Félicitations ! Votre email a été enregistré avec succès!"
      )
    } catch (error) {
      console.error(error)
      setEmailError(
        error.message || "Il y a eu une erreur, veuillez réessayer plus tard."
      )
      setButtonText("C'est parti !")
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
    setButtonText("C'est parti !")
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
      {isButtonClicked && <NavBar isMobile={isMobile} />}
      <canvas
        ref={canvasRef}
        className="absolute z-0 fade-in-node"
        style={canvasStyles(isMobile)}
      />
      <Title
        isButtonClicked={isButtonClicked}
        isHoveredText={isHoveredText}
        isMobile={isMobile}
      />{" "}
      <ExpandingButton
        isButtonClicked={isButtonClicked}
        buttonRef={buttonRef}
        isFullyExpanded={isFullyExpanded}
        shine={shine}
        buttonText={buttonText}
        handleButtonClick={handleButtonClick} // Function to handle button click event
        handleCloseClick={handleCloseClick} // Function to handle close button click
        isExpand={isExpand} // Boolean for whether the button is expanding
        isMobile={isMobile} // Boolean for mobile responsiveness
        email={email} // Email state for the form
        setEmail={setEmail} // Function to update email state
        emailError={emailError} // Email error message for the form
        handleSubmit={handleSubmit} // Function to handle form submit
        isTextVisible={isTextVisible} // Boolean to control text visibility inside the button
      />
    </div>
  )
}

export default KnowledgeGraph
