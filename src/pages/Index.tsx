
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/Navigation"
import DroneParameterForm from "@/components/DroneParameterForm"
import BatteryPredictionResult from "@/components/BatteryPredictionResult"
import ComparisonChart from "@/components/ComparisonChart"
import { DroneParameters, PredictionResult, predictBatteryConsumption, getPredictionConfidence } from '@/lib/predictionModel'

export default function Index() {
  const [parameters, setParameters] = useState<DroneParameters>({
    speed: 10,
    altitude: 100,
    windSpeed: 5,
    windDirection: 0,
    payloadWeight: 500,
    temperature: 25,
    flightDistance: 5,
    batteryCapacity: 5000
  })
  
  const [optimizedParameters, setOptimizedParameters] = useState<DroneParameters | undefined>(undefined)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [optimizedResult, setOptimizedResult] = useState<PredictionResult | undefined>(undefined)
  const [modelConfidence, setModelConfidence] = useState<number>(85)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  
  const handleParametersChange = (newParams: DroneParameters) => {
    setParameters(newParams)
    
    // Reset optimized results when parameters change
    if (optimizedParameters) {
      setOptimizedParameters(undefined)
      setOptimizedResult(undefined)
    }
  }
  
  const handlePredict = () => {
    setIsCalculating(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      try {
        const result = predictBatteryConsumption(parameters)
        setPredictionResult(result)
        
        // Recalculate optimized results if they exist
        if (optimizedParameters) {
          const optResult = predictBatteryConsumption(optimizedParameters)
          setOptimizedResult(optResult)
        }
        
        const confidence = getPredictionConfidence(parameters)
        setModelConfidence(confidence)
        
        // Show toast notification for significant warnings
        if (result.warnings.length > 0) {
          toast.warning("Flight warnings detected", {
            description: result.warnings[0],
            action: {
              label: "View",
              onClick: () => {}
            }
          })
        }
        
        if (result.batteryConsumption > 95) {
          toast.error("Critical battery warning", {
            description: "This flight will use nearly all available battery capacity!",
          })
        }
      } catch (error) {
        toast.error("Error calculating prediction", {
          description: "There was a problem with your parameters. Please try again.",
        })
        console.error("Prediction error:", error)
      } finally {
        setIsCalculating(false)
      }
    }, 800) // Simulate calculation time
  }
  
  const handleOptimize = (optimizedParams: DroneParameters) => {
    setOptimizedParameters(optimizedParams)
    
    try {
      const result = predictBatteryConsumption(optimizedParams)
      setOptimizedResult(result)
      
      toast.success("Settings optimized", {
        description: "Flight parameters have been optimized for better efficiency.",
      })
    } catch (error) {
      toast.error("Optimization error", {
        description: "Failed to calculate with optimized parameters.",
      })
      console.error("Optimization error:", error)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Drone Battery Consumption Oracle</h1>
          <p className="text-muted-foreground mt-2">
            Predict your drone's battery usage based on flight parameters
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DroneParameterForm 
            onParametersChange={handleParametersChange} 
            onPredict={handlePredict}
            isCalculating={isCalculating}
          />
          
          <BatteryPredictionResult 
            parameters={parameters} 
            result={predictionResult}
            modelConfidence={modelConfidence}
            onOptimizeSettings={handleOptimize}
          />
        </div>
        
        {predictionResult && (
          <>
            <Separator className="my-8" />
            
            <div className="mb-6">
              <ComparisonChart
                originalParams={parameters}
                optimizedParams={optimizedParameters}
                originalResult={predictionResult}
                optimizedResult={optimizedResult}
              />
            </div>
          </>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Drone Battery Oracle | Battery consumption prediction model for drones</p>
          <p className="mt-1">Built with modern machine learning and physics-based models</p>
        </div>
      </footer>
    </div>
  )
}
