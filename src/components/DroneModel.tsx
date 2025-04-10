
import { useEffect, useRef } from 'react'

interface DroneModelProps {
  batteryLevel: number
  isFlying?: boolean
}

export function DroneModel({ batteryLevel, isFlying = false }: DroneModelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set drone dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const droneSize = Math.min(canvas.width, canvas.height) * 0.7
    
    // Draw drone body
    ctx.fillStyle = '#2CA58D'
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, droneSize / 4, droneSize / 6, 0, 0, 2 * Math.PI)
    ctx.fill()
    
    // Draw arms
    ctx.strokeStyle = '#0A2342'
    ctx.lineWidth = droneSize / 25
    
    // Arm 1
    ctx.beginPath()
    ctx.moveTo(centerX - droneSize / 5, centerY - droneSize / 5)
    ctx.lineTo(centerX - droneSize / 2, centerY - droneSize / 2)
    ctx.stroke()
    
    // Arm 2
    ctx.beginPath()
    ctx.moveTo(centerX + droneSize / 5, centerY - droneSize / 5)
    ctx.lineTo(centerX + droneSize / 2, centerY - droneSize / 2)
    ctx.stroke()
    
    // Arm 3
    ctx.beginPath()
    ctx.moveTo(centerX - droneSize / 5, centerY + droneSize / 5)
    ctx.lineTo(centerX - droneSize / 2, centerY + droneSize / 2)
    ctx.stroke()
    
    // Arm 4
    ctx.beginPath()
    ctx.moveTo(centerX + droneSize / 5, centerY + droneSize / 5)
    ctx.lineTo(centerX + droneSize / 2, centerY + droneSize / 2)
    ctx.stroke()
    
    // Draw propellers
    const drawPropeller = (x: number, y: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      ctx.fillStyle = isFlying ? '#F27F0C' : '#666'
      ctx.beginPath()
      ctx.ellipse(0, 0, droneSize / 10, droneSize / 3, 0, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.restore()
    }
    
    const propellerRotation = isFlying ? Date.now() / 100 : 0
    drawPropeller(centerX - droneSize / 2, centerY - droneSize / 2, propellerRotation)
    drawPropeller(centerX + droneSize / 2, centerY - droneSize / 2, propellerRotation + Math.PI / 2)
    drawPropeller(centerX - droneSize / 2, centerY + droneSize / 2, propellerRotation + Math.PI)
    drawPropeller(centerX + droneSize / 2, centerY + droneSize / 2, propellerRotation + 3 * Math.PI / 2)
    
    // Draw battery indicator
    const batteryWidth = droneSize / 2
    const batteryHeight = droneSize / 10
    const batteryX = centerX - batteryWidth / 2
    const batteryY = centerY + droneSize / 3
    
    // Battery outline
    ctx.fillStyle = '#eee'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(batteryX, batteryY, batteryWidth, batteryHeight, 4)
    ctx.fill()
    ctx.stroke()
    
    // Battery level
    const levelWidth = Math.max(0, Math.min(1, batteryLevel / 100)) * (batteryWidth - 4)
    
    // Color based on battery level
    let levelColor = '#4ade80' // green
    if (batteryLevel < 30) levelColor = '#ef4444' // red
    else if (batteryLevel < 60) levelColor = '#f97316' // orange
    
    ctx.fillStyle = levelColor
    ctx.beginPath()
    ctx.roundRect(batteryX + 2, batteryY + 2, levelWidth, batteryHeight - 4, 2)
    ctx.fill()
    
    // Battery percentage text
    ctx.fillStyle = batteryLevel < 50 ? '#fff' : '#000'
    ctx.font = `${batteryHeight * 0.7}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(batteryLevel)}%`, centerX, batteryY + batteryHeight / 2)
    
  }, [batteryLevel, isFlying])
  
  // Animation loop for flying state
  useEffect(() => {
    if (!isFlying) return
    
    const animationFrame = requestAnimationFrame(() => {
      // Force re-render
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    })
    
    return () => cancelAnimationFrame(animationFrame)
  }, [isFlying])
  
  return (
    <div className={`relative ${isFlying ? 'animate-float' : ''}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full h-auto"
      />
    </div>
  )
}

export default DroneModel
