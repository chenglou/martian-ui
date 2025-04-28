import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const ResponsiveRectangleList = () => {
  // State for tracking mouse position
  const [mouseY, setMouseY] = useState(0)
  const [mouseX, setMouseX] = useState(0)

  // Number of rectangles
  const numRectangles = 8

  // Default dimensions
  const defaultWidth = 240
  const defaultHeight = 80
  const margin = 10 // Margin between rectangles

  // Maximum total growth to distribute (100% = sum of all growth percentages)
  const totalGrowthBudget = 1.0
  const totalXMovementBudget = 1.0

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseY(e.clientY)
      setMouseX(e.clientX)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate the default vertical centers of each rectangle
  const calculateDefaultCenters = () => {
    return Array(numRectangles)
      .fill(0)
      .map((_, i) => i * (defaultHeight + margin) + defaultHeight / 2)
  }

  // Calculate distribution based on mouse position
  const calculateDistribution = (centers, mousePrimary, sigma, totalBudget) => {
    // Use a Gaussian distribution

    // Calculate unnormalized values based on distance from mouse
    const rawValues = centers.map((center) => {
      const distance = Math.abs(mousePrimary - center)
      return Math.exp(-(distance * distance) / (2 * sigma * sigma))
    })

    // Sum of raw values for normalization
    const totalRawValue = rawValues.reduce((sum, v) => sum + v, 0)

    // Normalize so the sum equals the total budget
    return totalRawValue > 0 ? rawValues.map((v) => (v / totalRawValue) * totalBudget) : Array(numRectangles).fill(0)
  }

  // Calculate growth distribution based on mouse position
  const calculateGrowthDistribution = () => {
    const centers = calculateDefaultCenters()
    const sigma = defaultHeight * 2 // Standard deviation - controls how quickly growth falls off
    return calculateDistribution(centers, mouseY, sigma, totalGrowthBudget)
  }

  // Calculate x-movement distribution based on mouse position
  const calculateXMovementDistribution = () => {
    const centers = calculateDefaultCenters()
    const sigma = defaultHeight * 2 // Standard deviation - same as for growth
    return calculateDistribution(centers, mouseY, sigma, totalXMovementBudget)
  }

  // Calculate dimensions and positions of rectangles
  const calculateRectangles = () => {
    const growthDistribution = calculateGrowthDistribution()
    const xMovementDistribution = calculateXMovementDistribution()
    const rectangles = []

    let currentTop = 0

    // Default right edge position (80% of window width)
    const defaultRightEdge = window.innerWidth * 0.8

    // Create an amplification factor based on window width
    const xMovementAmplificationFactor = window.innerWidth / 300

    for (let i = 0; i < numRectangles; i++) {
      // Calculate size increase based on growth distribution
      const growthFactor = growthDistribution[i]
      const scale = 1 + growthFactor

      // Calculate dimensions
      const width = defaultWidth * scale
      const height = defaultHeight * scale

      // Calculate x-movement based on distribution and mouse position
      const xMovementFactor = xMovementDistribution[i]

      // Only apply x-movement if mouse is to the left of the default right edge
      let rightEdge = defaultRightEdge
      if (mouseX < defaultRightEdge) {
        // Move right edge toward mouse x, scaled by the movement factor AND amplification factor
        const desiredMovement = (defaultRightEdge - mouseX) * xMovementFactor * xMovementAmplificationFactor
        rightEdge = defaultRightEdge - desiredMovement
      }

      // Calculate left position based on right edge and width
      const left = rightEdge - width

      rectangles.push({
        width,
        height,
        left,
        top: currentTop,
        growth: growthFactor,
        xMovement: xMovementFactor,
        xMovementAmplificationFactor: xMovementAmplificationFactor,
      })

      // Update position for next rectangle
      currentTop += height + margin
    }

    return rectangles
  }

  const rectangles = calculateRectangles()

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {rectangles.map((rect, i) => (
        <div
          key={i}
          className="absolute bg-blue-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
          style={{
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            left: `${rect.left}px`,
            top: `${rect.top}px`,
          }}
        >
          <span className="text-sm">
            Rectangle {i + 1} (+{Math.round(rect.growth * 100)}% | X-Factor:
            {Math.round(rect.xMovement * rect.xMovementAmplificationFactor * 100)}%)
          </span>
        </div>
      ))}
    </div>
  )
}

const root = document.createElement('div')
//# add root it to document.body, and render the component into it
document.body.appendChild(root)
createRoot(root).render(<ResponsiveRectangleList />)
