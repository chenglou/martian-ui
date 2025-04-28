//# Import the correct dependencies. Respect alphabetical order
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const images = [
  'https://picsum.photos/id/10/800/1200',
  //# insert more images here using the same format, except replace id/10 with id/11, id/12, etc. all the way til id/42
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

  //# useEffect that kicks off a requestAnimationFrame loop every frame that updates the offsetY based on touch position:
  //# if we're touching, and if the delta between our original touch y and current y is greater than 80, subtract 0.1x of it from offsetY
  useEffect(() => {
    let animationFrameId: number
    
    const updateOffset = () => {
      if (touchPosition && Math.abs(touchPosition.currentY - touchPosition.startY) > 80) {
        const delta = touchPosition.currentY - touchPosition.startY
        setOffsetY(prev => prev - delta * 0.1)
      }
      animationFrameId = requestAnimationFrame(updateOffset)
    }
    
    animationFrameId = requestAnimationFrame(updateOffset)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [touchPosition])

  //# Store the initial touch position when user starts touching. Use pageX/Y
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      setTouchPosition({
        startX: touch.pageX,
        startY: touch.pageY,
        currentX: touch.pageX,
        currentY: touch.pageY
      })
    }
  }

  //# Write a touch move that updates the current touch position if we're touching
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touchPosition && touch) {
      setTouchPosition({
        ...touchPosition,
        currentX: touch.pageX,
        currentY: touch.pageY
      })
    }
  }

  //# Clear touch position when touch ends
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
    const gap = 4 // gap between images
    const intrinsicX = containerSizeX - sizeX - 12
    let scaledSizeX = sizeX
    let scaledSizeY = sizeY
    let x = intrinsicX
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
      //# Hook up the touch events we've declared
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {imgs}
      {touchPosition && (
        //# Render a 30px red transparent circle div centered at touch position
        <div
          style={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            transform: 'translate(-50%, -50%)',
            left: touchPosition.currentX,
            top: touchPosition.currentY
          }}
        />
      )}
    </div>
  )
}

const root = document.createElement('div')
//# add root it to document.body, and render the component into it
document.body.appendChild(root)
createRoot(root).render(<DummyComponent />)