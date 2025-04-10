
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DroneParameters, PredictionResult, getOptimizedParameters } from '@/lib/predictionModel'
import { Battery, Clock, ArrowRight, Gauge, AlertTriangle, Sparkles, Download } from 'lucide-react'
import DroneModel from './DroneModel'

interface BatteryPredictionResultProps {
  parameters: DroneParameters
  result: PredictionResult | null
  modelConfidence: number
  onOptimizeSettings: (params: DroneParameters) => void
}

export function BatteryPredictionResult({ 
  parameters, 
  result, 
  modelConfidence,
  onOptimizeSettings 
}: BatteryPredictionResultProps) {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  
  if (!result) {
    return (
      <Card className="drone-card h-full flex items-center justify-center min-h-[300px]">
        <CardContent className="text-center p-6">
          <Battery className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">
            Adjust parameters and calculate to see prediction results
          </p>
        </CardContent>
      </Card>
    )
  }
  
  const generateCSV = () => {
    // Create CSV content
    const headers = [
      'Parameter', 'Value', 'Unit'
    ];
    
    const rows = [
      ['Flight Speed', parameters.speed, 'm/s'],
      ['Altitude', parameters.altitude, 'm'],
      ['Wind Speed', parameters.windSpeed, 'm/s'],
      ['Wind Direction', parameters.windDirection, '°'],
      ['Payload Weight', parameters.payloadWeight, 'g'],
      ['Temperature', parameters.temperature, '°C'],
      ['Flight Distance', parameters.flightDistance, 'km'],
      ['Battery Capacity', parameters.batteryCapacity, 'mAh'],
      ['', '', ''],
      ['Results', '', ''],
      ['Battery Consumption', result.batteryConsumption.toFixed(1), '%'],
      ['Flight Time', result.flightTime.toFixed(1), 'min'],
      ['Maximum Range', result.range.toFixed(1), 'km'],
      ['Efficiency', result.efficiency.toFixed(1), '%'],
      ['Model Confidence', modelConfidence.toFixed(1), '%']
    ];
    
    // Add warnings as additional rows
    if (result.warnings.length > 0) {
      rows.push(['', '', '']);
      rows.push(['Warnings', '', '']);
      result.warnings.forEach((warning, index) => {
        rows.push([`Warning ${index + 1}`, warning, '']);
      });
    }
    
    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and create a download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'drone_battery_prediction.csv');
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleOptimizeClick = () => {
    const optimizedParams = getOptimizedParameters(parameters);
    onOptimizeSettings(optimizedParams);
  };
  
  // Function to determine battery consumption severity
  const getBatteryConsumptionSeverity = (consumption: number) => {
    if (consumption < 30) return "low";
    if (consumption < 70) return "medium";
    return "high";
  };
  
  // Color classes based on severity
  const severityColors = {
    low: "text-green-500",
    medium: "text-orange-500",
    high: "text-red-500"
  };
  
  const consumptionSeverity = getBatteryConsumptionSeverity(result.batteryConsumption);
  
  return (
    <Card className="drone-card h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Battery className="h-5 w-5 mr-2 text-drone-teal" />
            Prediction Results
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            Model confidence: {modelConfidence.toFixed(0)}%
          </Badge>
        </div>
        <CardDescription>
          Estimated battery consumption for your flight
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Main battery consumption indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Battery Consumption</h3>
                <span className={`text-xl font-bold ${severityColors[consumptionSeverity]}`}>
                  {result.batteryConsumption.toFixed(1)}%
                </span>
              </div>
              <Progress value={result.batteryConsumption} 
                className={`h-3 ${
                  result.batteryConsumption > 90 ? "bg-muted" : ""
                }`}
              />
              <p className="text-sm text-muted-foreground">
                {result.batteryConsumption > 90 
                  ? "Warning: This flight will consume nearly all battery capacity" 
                  : `You'll have approximately ${(100 - result.batteryConsumption).toFixed(1)}% battery remaining`
                }
              </p>
            </div>
            
            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1 text-drone-teal" />
                  Flight Time
                </div>
                <p className="text-xl font-semibold">{result.flightTime.toFixed(1)} min</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm font-medium">
                  <ArrowRight className="h-4 w-4 mr-1 text-drone-teal" />
                  Max Range
                </div>
                <p className="text-xl font-semibold">{result.range.toFixed(1)} km</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm font-medium">
                  <Gauge className="h-4 w-4 mr-1 text-drone-teal" />
                  Efficiency
                </div>
                <p className="text-xl font-semibold">{result.efficiency.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <DroneModel 
              batteryLevel={100 - result.batteryConsumption} 
              isFlying={true}
            />
          </div>
        </div>
        
        {/* Warnings */}
        {result.warnings.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Flight Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {result.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
        >
          <Download className="h-4 w-4" />
          {showDownloadOptions ? "Hide" : "Export Results"}
        </Button>
        
        <Button 
          variant="default" 
          className="gap-2" 
          onClick={handleOptimizeClick}
        >
          <Sparkles className="h-4 w-4" />
          Optimize Settings
        </Button>
      </CardFooter>
      
      {showDownloadOptions && (
        <div className="px-6 pb-6">
          <div className="border rounded-md p-3 bg-muted/40">
            <h4 className="font-medium mb-2">Export Options</h4>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={generateCSV}>
                Download as CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default BatteryPredictionResult
