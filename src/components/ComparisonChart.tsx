
import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, RadarChart, Radar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { DroneParameters, PredictionResult } from '@/lib/predictionModel'
import { LineChart, LineChartIcon } from 'lucide-react'

interface ComparisonData {
  name: string
  original: number
  optimized?: number
}

interface ComparisonChartProps {
  originalParams: DroneParameters
  optimizedParams?: DroneParameters
  originalResult: PredictionResult
  optimizedResult?: PredictionResult
}

export function ComparisonChart({
  originalParams,
  optimizedParams,
  originalResult,
  optimizedResult
}: ComparisonChartProps) {
  // Prepare data for consumption comparison
  const consumptionData = [
    {
      name: 'Battery %',
      original: parseFloat(originalResult.batteryConsumption.toFixed(1)),
      ...(optimizedResult && { optimized: parseFloat(optimizedResult.batteryConsumption.toFixed(1)) })
    },
    {
      name: 'Flight Time',
      original: parseFloat(originalResult.flightTime.toFixed(1)),
      ...(optimizedResult && { optimized: parseFloat(optimizedResult.flightTime.toFixed(1)) })
    },
    {
      name: 'Efficiency',
      original: parseFloat(originalResult.efficiency.toFixed(1)),
      ...(optimizedResult && { optimized: parseFloat(optimizedResult.efficiency.toFixed(1)) })
    },
    {
      name: 'Range',
      original: parseFloat(originalResult.range.toFixed(1)),
      ...(optimizedResult && { optimized: parseFloat(optimizedResult.range.toFixed(1)) })
    }
  ]
  
  // Prepare data for parameter comparison
  const parameterData = [
    {
      subject: 'Speed (m/s)',
      original: originalParams.speed,
      ...(optimizedParams && { optimized: optimizedParams.speed }),
      fullMark: 30
    },
    {
      subject: 'Altitude (m)',
      original: originalParams.altitude / 100, // Scale down for visualization
      ...(optimizedParams && { optimized: optimizedParams.altitude / 100 }),
      fullMark: 30
    },
    {
      subject: 'Wind (m/s)',
      original: originalParams.windSpeed,
      ...(optimizedParams && { optimized: optimizedParams.windSpeed }),
      fullMark: 20
    },
    {
      subject: 'Payload (g)',
      original: originalParams.payloadWeight / 100, // Scale down for visualization
      ...(optimizedParams && { optimized: optimizedParams.payloadWeight / 100 }),
      fullMark: 20
    },
    {
      subject: 'Distance (km)',
      original: originalParams.flightDistance,
      ...(optimizedParams && { optimized: optimizedParams.flightDistance }),
      fullMark: 50
    }
  ]
  
  return (
    <Card className="drone-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChartIcon className="h-5 w-5 mr-2 text-drone-teal" />
          Performance Analysis
        </CardTitle>
        <CardDescription>
          {optimizedResult 
            ? "Comparing original settings with optimized configuration" 
            : "Visualizing battery consumption metrics"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="metrics" className="flex-1">Performance Metrics</TabsTrigger>
            <TabsTrigger value="parameters" className="flex-1">Flight Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={consumptionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    return [`${value}`, name === 'original' ? 'Current' : 'Optimized'];
                  }}
                />
                <Legend />
                <Bar dataKey="original" name="Current Settings" fill="#0A2342" />
                {optimizedResult && (
                  <Bar dataKey="optimized" name="Optimized Settings" fill="#2CA58D" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="parameters" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={parameterData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Current Settings"
                  dataKey="original"
                  stroke="#0A2342"
                  fill="#0A2342"
                  fillOpacity={0.6}
                />
                {optimizedParams && (
                  <Radar
                    name="Optimized Settings"
                    dataKey="optimized"
                    stroke="#2CA58D"
                    fill="#2CA58D"
                    fillOpacity={0.6}
                  />
                )}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ComparisonChart
