
// This is a simulation of a prediction model that would normally be trained on real data

export interface DroneParameters {
  speed: number; // m/s
  altitude: number; // meters
  windSpeed: number; // m/s
  windDirection: number; // degrees
  payloadWeight: number; // grams
  temperature: number; // celsius
  flightDistance: number; // km
  batteryCapacity: number; // mAh
}

export interface PredictionResult {
  batteryConsumption: number; // percentage
  flightTime: number; // minutes
  efficiency: number; // 0-100 percentage
  range: number; // km
  warnings: string[];
}

// Constants for drone energy consumption
const BASE_CURRENT_DRAW = 10; // Amps at hover
const EFFICIENCY_FACTOR = 0.85; // Motor efficiency
const HOVER_POWER = 100; // Watts for hover
const PAYLOAD_FACTOR = 0.0005; // Additional power per gram
const WIND_RESISTANCE_FACTOR = 0.2; // Additional power per m/s wind
const ALTITUDE_FACTOR = 0.01; // Power increase per meter
const SPEED_FACTOR = 0.05; // Power per m/s above hover
const TEMPERATURE_FACTOR = 0.005; // Efficiency loss per degree away from 25°C

// Simulated prediction model based on simplified physics formulas
export function predictBatteryConsumption(params: DroneParameters): PredictionResult {
  // Calculate power requirements
  const hoverPower = HOVER_POWER * (1 + ALTITUDE_FACTOR * (params.altitude / 100));
  
  // Additional power for movement
  const speedPower = Math.pow(params.speed, 2) * SPEED_FACTOR;
  
  // Wind resistance power
  // Calculate effective wind based on direction (simplified)
  const effectiveWind = params.windSpeed * (1 - Math.cos(params.windDirection * Math.PI / 180) / 2);
  const windPower = Math.pow(effectiveWind, 2) * WIND_RESISTANCE_FACTOR;
  
  // Payload impact
  const payloadPower = params.payloadWeight * PAYLOAD_FACTOR;
  
  // Temperature efficiency impact
  const tempFactor = 1 + Math.abs(params.temperature - 25) * TEMPERATURE_FACTOR;
  
  // Total power required
  const totalPower = (hoverPower + speedPower + windPower + payloadPower) * tempFactor / EFFICIENCY_FACTOR;
  
  // Current draw in Amps
  const currentDraw = totalPower / 11.1; // Assuming 3S LiPo (11.1V)
  
  // Flight time calculation in hours
  const flightTimeHours = params.batteryCapacity / 1000 / currentDraw;
  
  // Flight time in minutes
  const flightTime = flightTimeHours * 60;
  
  // Distance possible
  const range = params.speed * flightTimeHours;
  
  // Battery consumption for requested distance
  const timeForDistance = params.flightDistance / params.speed;
  const batteryConsumption = Math.min(100, (timeForDistance / flightTimeHours) * 100);
  
  // Calculate efficiency (lower power consumption is better)
  const theoreticalMinPower = HOVER_POWER * (1 + params.payloadWeight * 0.0001);
  const efficiency = Math.max(0, Math.min(100, 100 - ((totalPower - theoreticalMinPower) / theoreticalMinPower * 50)));
  
  // Generate warnings
  const warnings: string[] = [];
  
  if (batteryConsumption > 90) {
    warnings.push("Flight distance is near maximum range");
  }
  
  if (params.windSpeed > 8) {
    warnings.push("High wind conditions will significantly reduce battery life");
  }
  
  if (params.temperature < 0 || params.temperature > 40) {
    warnings.push("Extreme temperatures will affect battery performance");
  }
  
  if (params.altitude > 2000) {
    warnings.push("High altitude flight requires more power");
  }
  
  if (params.speed > 15) {
    warnings.push("High speeds dramatically increase power consumption");
  }
  
  return {
    batteryConsumption,
    flightTime,
    efficiency,
    range,
    warnings
  };
}

// Function to get optimized parameters for maximum efficiency
export function getOptimizedParameters(params: DroneParameters): DroneParameters {
  // Create a copy of the original parameters
  const optimized = { ...params };
  
  // Optimize speed for efficiency (usually lower speeds are more efficient)
  optimized.speed = Math.max(5, params.speed * 0.7);
  
  // Reduce altitude if possible
  optimized.altitude = Math.max(10, params.altitude * 0.8);
  
  // Can't optimize wind or temperature (environmental factors)
  
  // Can potentially reduce payload
  if (params.payloadWeight > 500) {
    optimized.payloadWeight = params.payloadWeight * 0.9;
  }
  
  return optimized;
}

// Simulate model confidence by adding some variability
export function getPredictionConfidence(params: DroneParameters): number {
  // Base confidence
  let confidence = 85;
  
  // Reduce confidence in extreme conditions
  if (params.windSpeed > 10) confidence -= 10;
  if (params.altitude > 1500) confidence -= 5;
  if (params.temperature < 0 || params.temperature > 35) confidence -= 8;
  if (params.speed > 20) confidence -= 7;
  
  // Ensure confidence is between 0-100
  return Math.max(50, Math.min(95, confidence));
}
