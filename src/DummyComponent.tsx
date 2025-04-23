import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

const images = [
  'https://picsum.photos/id/10/800/1200',
  'https://picsum.photos/id/11/800/1200',
  'https://picsum.photos/id/12/800/1200',
  'https://picsum.photos/id/13/800/1200',
  'https://picsum.photos/id/14/800/1200',
  'https://picsum.photos/id/15/800/1200',
  'https://picsum.photos/id/16/800/1200',
  'https://picsum.photos/id/17/800/1200',
  'https://picsum.photos/id/18/800/1200',
  'https://picsum.photos/id/19/800/1200',
  'https://picsum.photos/id/20/800/1200',
  'https://picsum.photos/id/21/800/1200',
  'https://picsum.photos/id/22/800/1200',
  'https://picsum.photos/id/23/800/1200',
  'https://picsum.photos/id/24/800/1200',
  'https://picsum.photos/id/25/800/1200',
  'https://picsum.photos/id/26/800/1200',
  'https://picsum.photos/id/27/800/1200',
  'https://picsum.photos/id/28/800/1200',
  'https://picsum.photos/id/29/800/1200',
  'https://picsum.photos/id/30/800/1200',
  'https://picsum.photos/id/31/800/1200',
  'https://picsum.photos/id/32/800/1200',
  'https://picsum.photos/id/33/800/1200',
  'https://picsum.photos/id/34/800/1200',
  'https://picsum.photos/id/35/800/1200',
  'https://picsum.photos/id/36/800/1200',
  'https://picsum.photos/id/37/800/1200',
  'https://picsum.photos/id/38/800/1200',
  'https://picsum.photos/id/39/800/1200',
  'https://picsum.photos/id/40/800/1200',
  'https://picsum.photos/id/41/800/1200',
  'https://picsum.photos/id/42/800/1200',
]

const DummyComponent = () => {
  const [touchPosition, setTouchPosition] = useState<null | {
    startX: number
    startY: number
    currentX: number
    currentY: number
  }>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      if (touchPosition) {
        const deltaY = touchPosition.currentY - touchPosition.startY
        if (Math.abs(deltaY) > 80) {
          setOffsetY((prev) => prev - deltaY * 0.1)
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [touchPosition])

  // Store the initial touch position when user starts touching
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    setTouchPosition({
      startX: touch.pageX,
      startY: touch.pageY,
      currentX: touch.pageX,
      currentY: touch.pageY,
    })
  }

  // Calculate vertical movement delta and update offsetY to move images
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch || !touchPosition) return

    // Update current touch position for next movement calculation
    setTouchPosition((prev) =>
      prev ?
        {
          ...prev,
          currentX: touch.pageX,
          currentY: touch.pageY,
        }
      : null,
    )
  }

  // Clear touch position when touch ends
  const handleTouchEnd = () => {
    setTouchPosition(null)
  }

  const containerSizeX = document.documentElement.clientWidth
  const containerSizeY = document.documentElement.clientHeight
  const imgs = []
  let y = offsetY
  // let y = 0
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const ar = 16 / 9
    const sizeX = 40
    const sizeY = sizeX * ar
    const gap = 4
    const intrinsicX = containerSizeX - sizeX - 12
    // const intrinsicX = containerSizeX + sizeX + 12
    let x = intrinsicX
    let scaledSizeX = sizeX
    let scaledSizeY = sizeY
    if (touchPosition) {
      let imageAroundFingerX = touchPosition.currentX - sizeX - 28
      // Calculate normalized distance from finger (0 to 1)
      const distanceFromFinger = Math.abs(y - touchPosition.currentY) / containerSizeY
      // Use sine to create smooth interpolation between positions with accentuated transition
      const sineFactor = Math.sin(distanceFromFinger * Math.PI * 0.7) // More accentuated sine wave
      x = intrinsicX * sineFactor + imageAroundFingerX * (1 - sineFactor)
      // Scale size based on distance from finger
      const scaleFactor = 1.5 - sineFactor * 1.3 // Scale from 1.5 to 0.2
      scaledSizeX = sizeX * scaleFactor
      scaledSizeY = sizeY * scaleFactor
    }
    imgs.push(
      <img key={i} src={image} width={scaledSizeX} height={scaledSizeY} style={{ position: 'absolute', top: y, left: x }} />,
    )
    y += scaledSizeY + gap
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {imgs}
      {touchPosition && (
        <div
          style={{
            position: 'absolute',
            left: touchPosition.currentX - 25,
            top: touchPosition.currentY - 25,
            width: 50,
            height: 50,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.body)
root.render(<DummyComponent />)