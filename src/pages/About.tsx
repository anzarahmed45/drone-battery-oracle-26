
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/Navigation"
import { Battery, Github, Info, LineChart, Plane, Zap } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Battery className="h-12 w-12 text-drone-teal" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Drone Battery Oracle</h1>
            <p className="text-xl text-muted-foreground">
              Predicting battery consumption for drone flights
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-drone-teal" />
                About This Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Drone Battery Oracle is a predictive model that estimates a drone's battery consumption based on various flight parameters including speed, altitude, wind conditions, payload weight, and more.
              </p>
              <p>
                This tool helps pilots optimize their flight plans, ensure sufficient battery capacity for missions, and improve overall flight efficiency.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-drone-teal" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our prediction model uses a combination of physics-based formulas and machine learning techniques to estimate energy consumption based on:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Drone aerodynamics and propulsion efficiency</li>
                  <li>Environmental factors affecting flight performance</li>
                  <li>Power requirements for different flight conditions</li>
                  <li>Battery discharge characteristics</li>
                </ul>
                <p>
                  The core algorithm calculates power requirements using the formula:
                </p>
                <div className="p-3 bg-muted rounded-md font-mono text-sm">
                  P = (1/η) × (P<sub>hover</sub> + P<sub>movement</sub> + P<sub>wind</sub>)
                </div>
                <p>
                  Where η is efficiency factor, P<sub>hover</sub> is power required for hovering, P<sub>movement</sub> is additional power for movement, and P<sub>wind</sub> is power to overcome wind resistance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-drone-teal" />
                  Model Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-medium">The model considers:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Flight Speed:</span> Higher speeds require more power</li>
                  <li><span className="font-medium">Altitude:</span> Higher altitudes decrease air density and propeller efficiency</li>
                  <li><span className="font-medium">Wind:</span> Direction and speed affect power requirements</li>
                  <li><span className="font-medium">Payload:</span> Additional weight increases power consumption</li>
                  <li><span className="font-medium">Temperature:</span> Affects battery efficiency and air density</li>
                </ul>
                
                <h3 className="font-medium mt-4">Output metrics include:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Battery Consumption:</span> Percentage of battery used</li>
                  <li><span className="font-medium">Flight Time:</span> Estimated duration with given battery</li>
                  <li><span className="font-medium">Maximum Range:</span> Distance possible with current charge</li>
                  <li><span className="font-medium">Efficiency:</span> How effectively battery power is being utilized</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-5 w-5 mr-2 text-drone-teal" />
                Future Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This project is under active development with planned future enhancements:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Technical Improvements:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Integration with real flight data</li>
                    <li>Support for different drone models</li>
                    <li>Machine learning model improvements</li>
                    <li>Dynamic route optimization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">User Features:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Flight path visualization</li>
                    <li>Historical data tracking</li>
                    <li>Mobile application</li>
                    <li>Integration with flight controllers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="flex justify-center">
            <Button variant="outline" asChild className="gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
