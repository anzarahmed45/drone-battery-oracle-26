
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DroneParameters } from '@/lib/predictionModel'
import { Wind, Thermometer, Box, Zap, ArrowUpDown, Route, RefreshCw } from 'lucide-react'

interface DroneParameterFormProps {
  onParametersChange: (params: DroneParameters) => void
  onPredict: () => void
  isCalculating?: boolean
}

export function DroneParameterForm({ 
  onParametersChange, 
  onPredict,
  isCalculating = false
}: DroneParameterFormProps) {
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
  
  // Parameter ranges for validation
  const paramRanges = {
    speed: { min: 0, max: 30, step: 0.5 },
    altitude: { min: 0, max: 3000, step: 10 },
    windSpeed: { min: 0, max: 20, step: 0.5 },
    windDirection: { min: 0, max: 360, step: 5 },
    payloadWeight: { min: 0, max: 2000, step: 10 },
    temperature: { min: -10, max: 50, step: 1 },
    flightDistance: { min: 0.1, max: 50, step: 0.1 },
    batteryCapacity: { min: 1000, max: 10000, step: 100 }
  }
  
  // Update parent component when parameters change
  useEffect(() => {
    onParametersChange(parameters)
  }, [parameters, onParametersChange])
  
  const handleParameterChange = (key: keyof DroneParameters, value: number | number[]) => {
    // If the value is an array (from slider), take the first element
    const newValue = Array.isArray(value) ? value[0] : value
    
    // Make sure the value is within range
    const range = paramRanges[key]
    const clampedValue = Math.max(range.min, Math.min(range.max, newValue))
    
    setParameters(prev => ({ ...prev, [key]: clampedValue }))
  }
  
  const resetToDefaults = () => {
    setParameters({
      speed: 10,
      altitude: 100,
      windSpeed: 5,
      windDirection: 0,
      payloadWeight: 500,
      temperature: 25,
      flightDistance: 5,
      batteryCapacity: 5000
    })
  }
  
  return (
    <Card className="drone-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowUpDown className="h-5 w-5 mr-2 text-drone-teal" />
          Flight Parameters
        </CardTitle>
        <CardDescription>
          Adjust the parameters to predict battery consumption
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic" className="flex-1">Basic Parameters</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            {/* Flight Speed */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="speed" className="flex items-center text-sm font-medium">
                  Flight Speed (m/s)
                </Label>
                <span className="text-sm font-mono">{parameters.speed} m/s</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="speed"
                  min={paramRanges.speed.min}
                  max={paramRanges.speed.max}
                  step={paramRanges.speed.step}
                  value={[parameters.speed]}
                  onValueChange={(value) => handleParameterChange('speed', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.speed}
                  onChange={(e) => handleParameterChange('speed', parseFloat(e.target.value))}
                  min={paramRanges.speed.min}
                  max={paramRanges.speed.max}
                  step={paramRanges.speed.step}
                  className="w-20"
                />
              </div>
              {parameters.speed > 20 && (
                <Alert variant="destructive" className="p-2 mt-1">
                  <AlertDescription>
                    High speeds significantly increase battery consumption.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Altitude */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="altitude" className="flex items-center text-sm font-medium">
                  Altitude (meters)
                </Label>
                <span className="text-sm font-mono">{parameters.altitude} m</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="altitude"
                  min={paramRanges.altitude.min}
                  max={paramRanges.altitude.max}
                  step={paramRanges.altitude.step}
                  value={[parameters.altitude]}
                  onValueChange={(value) => handleParameterChange('altitude', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.altitude}
                  onChange={(e) => handleParameterChange('altitude', parseFloat(e.target.value))}
                  min={paramRanges.altitude.min}
                  max={paramRanges.altitude.max}
                  step={paramRanges.altitude.step}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Flight Distance */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="flightDistance" className="flex items-center text-sm font-medium">
                  <Route className="h-4 w-4 mr-1" />
                  Flight Distance (km)
                </Label>
                <span className="text-sm font-mono">{parameters.flightDistance} km</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="flightDistance"
                  min={paramRanges.flightDistance.min}
                  max={paramRanges.flightDistance.max}
                  step={paramRanges.flightDistance.step}
                  value={[parameters.flightDistance]}
                  onValueChange={(value) => handleParameterChange('flightDistance', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.flightDistance}
                  onChange={(e) => handleParameterChange('flightDistance', parseFloat(e.target.value))}
                  min={paramRanges.flightDistance.min}
                  max={paramRanges.flightDistance.max}
                  step={paramRanges.flightDistance.step}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Battery Capacity */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="batteryCapacity" className="flex items-center text-sm font-medium">
                  <Zap className="h-4 w-4 mr-1" />
                  Battery Capacity (mAh)
                </Label>
                <span className="text-sm font-mono">{parameters.batteryCapacity} mAh</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="batteryCapacity"
                  min={paramRanges.batteryCapacity.min}
                  max={paramRanges.batteryCapacity.max}
                  step={paramRanges.batteryCapacity.step}
                  value={[parameters.batteryCapacity]}
                  onValueChange={(value) => handleParameterChange('batteryCapacity', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.batteryCapacity}
                  onChange={(e) => handleParameterChange('batteryCapacity', parseFloat(e.target.value))}
                  min={paramRanges.batteryCapacity.min}
                  max={paramRanges.batteryCapacity.max}
                  step={paramRanges.batteryCapacity.step}
                  className="w-20"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            {/* Wind Speed */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="windSpeed" className="flex items-center text-sm font-medium">
                  <Wind className="h-4 w-4 mr-1" />
                  Wind Speed (m/s)
                </Label>
                <span className="text-sm font-mono">{parameters.windSpeed} m/s</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="windSpeed"
                  min={paramRanges.windSpeed.min}
                  max={paramRanges.windSpeed.max}
                  step={paramRanges.windSpeed.step}
                  value={[parameters.windSpeed]}
                  onValueChange={(value) => handleParameterChange('windSpeed', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.windSpeed}
                  onChange={(e) => handleParameterChange('windSpeed', parseFloat(e.target.value))}
                  min={paramRanges.windSpeed.min}
                  max={paramRanges.windSpeed.max}
                  step={paramRanges.windSpeed.step}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Wind Direction */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="windDirection" className="flex items-center text-sm font-medium">
                  Wind Direction (°)
                </Label>
                <span className="text-sm font-mono">{parameters.windDirection}°</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="windDirection"
                  min={paramRanges.windDirection.min}
                  max={paramRanges.windDirection.max}
                  step={paramRanges.windDirection.step}
                  value={[parameters.windDirection]}
                  onValueChange={(value) => handleParameterChange('windDirection', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.windDirection}
                  onChange={(e) => handleParameterChange('windDirection', parseFloat(e.target.value))}
                  min={paramRanges.windDirection.min}
                  max={paramRanges.windDirection.max}
                  step={paramRanges.windDirection.step}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Payload Weight */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="payloadWeight" className="flex items-center text-sm font-medium">
                  <Box className="h-4 w-4 mr-1" />
                  Payload Weight (g)
                </Label>
                <span className="text-sm font-mono">{parameters.payloadWeight} g</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="payloadWeight"
                  min={paramRanges.payloadWeight.min}
                  max={paramRanges.payloadWeight.max}
                  step={paramRanges.payloadWeight.step}
                  value={[parameters.payloadWeight]}
                  onValueChange={(value) => handleParameterChange('payloadWeight', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.payloadWeight}
                  onChange={(e) => handleParameterChange('payloadWeight', parseFloat(e.target.value))}
                  min={paramRanges.payloadWeight.min}
                  max={paramRanges.payloadWeight.max}
                  step={paramRanges.payloadWeight.step}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature" className="flex items-center text-sm font-medium">
                  <Thermometer className="h-4 w-4 mr-1" />
                  Temperature (°C)
                </Label>
                <span className="text-sm font-mono">{parameters.temperature}°C</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="temperature"
                  min={paramRanges.temperature.min}
                  max={paramRanges.temperature.max}
                  step={paramRanges.temperature.step}
                  value={[parameters.temperature]}
                  onValueChange={(value) => handleParameterChange('temperature', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={parameters.temperature}
                  onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
                  min={paramRanges.temperature.min}
                  max={paramRanges.temperature.max}
                  step={paramRanges.temperature.step}
                  className="w-20"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={onPredict} disabled={isCalculating}>
          {isCalculating ? 'Calculating...' : 'Calculate Consumption'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DroneParameterForm
