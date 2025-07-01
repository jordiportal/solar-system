# Solar System Application - Usage Examples

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Integration Examples](#integration-examples)
4. [Customization Examples](#customization-examples)
5. [Advanced Usage](#advanced-usage)
6. [Performance Optimization](#performance-optimization)
7. [Troubleshooting](#troubleshooting)
8. [Common Patterns](#common-patterns)

## Getting Started

### Prerequisites

Before using the Solar System application, ensure you have:

- **Node.js**: Version 16 or higher
- **Angular CLI**: Version 15 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge with WebGL support

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd solar-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   ng serve
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:4200`

## Basic Usage

### Running the Application

The simplest way to use the application is to run it as-is:

```bash
# Development mode
ng serve

# Production build
ng build --prod
ng serve --prod
```

### Basic Navigation

Once the application is running:

1. **Mouse Controls**:
   - **Left Click + Drag**: Orbit around the solar system
   - **Mouse Wheel**: Zoom in/out
   - **Right Click + Drag**: Pan the view

2. **Speed Control**:
   - Use the slider at the bottom to adjust simulation speed
   - Range: 0.1x (very slow) to 5x (very fast)

3. **Touch Controls** (Mobile):
   - **Single Touch + Drag**: Orbit
   - **Pinch**: Zoom
   - **Two Finger Drag**: Pan

## Integration Examples

### Embedding in Existing Angular Application

#### Step 1: Import the Component

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SolarSystemComponent } from './solar-system/solar-system.component';
import { YourExistingComponent } from './your-component/your-component.component';

@NgModule({
  declarations: [
    YourExistingComponent,
    SolarSystemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [YourExistingComponent]
})
export class AppModule { }
```

#### Step 2: Use in Your Template

```html
<!-- your-component.component.html -->
<div class="your-app-layout">
  <header>
    <h1>My Space Application</h1>
  </header>
  
  <main>
    <app-solar-system></app-solar-system>
  </main>
  
  <footer>
    <p>Powered by Three.js</p>
  </footer>
</div>
```

#### Step 3: Style Integration

```scss
// your-component.component.scss
.your-app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  header {
    background: #1a1a1a;
    color: white;
    padding: 1rem;
    z-index: 1000;
  }
  
  main {
    flex: 1;
    position: relative;
    
    app-solar-system {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  
  footer {
    background: #1a1a1a;
    color: white;
    padding: 0.5rem;
    text-align: center;
    z-index: 1000;
  }
}
```

### Creating a Dashboard with Solar System

```typescript
// dashboard.component.ts
import { Component, ViewChild } from '@angular/core';
import { SolarSystemComponent } from '../solar-system/solar-system.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div class="sidebar">
        <h2>Solar System Controls</h2>
        
        <div class="control-group">
          <label>Simulation Speed</label>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1"
            [(ngModel)]="currentSpeed"
            (input)="updateSpeed($event)"
          >
          <span>{{currentSpeed.toFixed(1)}}x</span>
        </div>
        
        <div class="control-group">
          <button (click)="resetView()">Reset View</button>
          <button (click)="pauseAnimation()">{{isPaused ? 'Resume' : 'Pause'}}</button>
        </div>
        
        <div class="info-panel">
          <h3>Current View</h3>
          <p>Camera Position: {{cameraInfo}}</p>
          <p>Zoom Level: {{zoomLevel}}</p>
        </div>
      </div>
      
      <div class="main-view">
        <app-solar-system #solarSystem></app-solar-system>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('solarSystem') solarSystem!: SolarSystemComponent;
  
  currentSpeed: number = 1;
  isPaused: boolean = false;
  cameraInfo: string = '';
  zoomLevel: string = '';
  
  updateSpeed(event: any) {
    this.currentSpeed = parseFloat(event.target.value);
    if (this.solarSystem) {
      this.solarSystem.simulationSpeed = this.currentSpeed;
    }
  }
  
  resetView() {
    // Reset camera position (would need to expose this in SolarSystemComponent)
    console.log('Reset view requested');
  }
  
  pauseAnimation() {
    this.isPaused = !this.isPaused;
    if (this.solarSystem) {
      this.solarSystem.simulationSpeed = this.isPaused ? 0 : this.currentSpeed;
    }
  }
}
```

## Customization Examples

### Adding New Planets

#### Example 1: Adding Pluto

```typescript
// In solar-system.component.ts, modify the ngOnInit() method
ngOnInit(): void {
  this.celestialBodies = [
    // ... existing planets
    {
      name: 'Plutón',
      radius: 0.4,
      distance: 240,
      rotationSpeed: 0.006,
      orbitalSpeed: 0.0008,
      texture: 'assets/textures/2k_pluto.jpg',
      color: 0x8B7355,
      moons: [
        {
          name: 'Caronte',
          radius: 0.2,
          distance: 2,
          rotationSpeed: 0.02,
          orbitalSpeed: 0.04,
          color: 0xA0A0A0
        }
      ]
    }
  ];
}
```

#### Example 2: Adding an Asteroid Belt

```typescript
// Add this method to SolarSystemComponent
private createAsteroidBelt(): void {
  const asteroidCount = 500;
  const beltInnerRadius = 85;  // Between Mars and Jupiter
  const beltOuterRadius = 95;
  
  for (let i = 0; i < asteroidCount; i++) {
    // Random position within the belt
    const angle = Math.random() * Math.PI * 2;
    const distance = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
    
    // Create small asteroid
    const asteroidGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.x = Math.cos(angle) * distance;
    asteroid.position.z = Math.sin(angle) * distance;
    asteroid.position.y = (Math.random() - 0.5) * 2; // Some vertical variation
    
    this.scene.add(asteroid);
  }
}

// Call this method in createSolarSystem()
private createSolarSystem(): void {
  // ... existing code
  this.createAsteroidBelt();
}
```

### Custom Lighting Setup

```typescript
// Replace the lighting in initThree() method
private initThree(): void {
  // ... existing setup code
  
  // Custom lighting setup
  this.setupCustomLighting();
}

private setupCustomLighting(): void {
  // Remove default lights and add custom ones
  
  // 1. Bright sun light
  const sunLight = new THREE.PointLight(0xFFFFAA, 3, 800);
  sunLight.position.set(0, 0, 0);
  this.scene.add(sunLight);
  
  // 2. Ambient space light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  this.scene.add(ambientLight);
  
  // 3. Rim lighting for planets
  const rimLight = new THREE.DirectionalLight(0x6666FF, 0.5);
  rimLight.position.set(-100, 50, 100);
  this.scene.add(rimLight);
  
  // 4. Fill light from opposite side
  const fillLight = new THREE.DirectionalLight(0xFF6666, 0.3);
  fillLight.position.set(100, -50, -100);
  this.scene.add(fillLight);
}
```

### Custom Planet Configurations

```typescript
// Create a configuration service
@Injectable({
  providedIn: 'root'
})
export class PlanetConfigService {
  
  getDefaultConfiguration(): CelestialBody[] {
    return [
      // ... default planets
    ];
  }
  
  getScientificConfiguration(): CelestialBody[] {
    // More accurate scales and speeds
    return [
      {
        name: 'Sol',
        radius: 109,  // Relative to Earth
        distance: 0,
        rotationSpeed: 0.001,
        orbitalSpeed: 0,
        texture: 'assets/textures/2k_sun.jpg',
        color: 0xffcc00
      },
      {
        name: 'Tierra',
        radius: 1,    // Reference size
        distance: 150, // 1 AU in scaled units
        rotationSpeed: 0.1,  // 24 hour rotation
        orbitalSpeed: 0.01,  // 365 day orbit
        texture: 'assets/textures/2k_earth_daymap.jpg',
        color: 0x1a75ff
      }
      // ... more scientifically accurate data
    ];
  }
  
  getFantasyConfiguration(): CelestialBody[] {
    // Fictional solar system
    return [
      {
        name: 'Crystal Star',
        radius: 20,
        distance: 0,
        rotationSpeed: 0.002,
        orbitalSpeed: 0,
        texture: 'assets/textures/crystal_star.jpg',
        color: 0xFF00FF
      },
      {
        name: 'Water World',
        radius: 3,
        distance: 50,
        rotationSpeed: 0.015,
        orbitalSpeed: 0.02,
        texture: 'assets/textures/water_world.jpg',
        color: 0x0066CC
      }
      // ... more fantasy planets
    ];
  }
}
```

## Advanced Usage

### Creating Interactive Planet Information

```typescript
// Enhanced solar system component with click interactions
export class InteractiveSolarSystemComponent extends SolarSystemComponent {
  
  @Output() planetSelected = new EventEmitter<CelestialBody>();
  
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setupInteractions();
  }
  
  private setupInteractions(): void {
    this.renderer.domElement.addEventListener('click', this.onPlanetClick.bind(this));
  }
  
  private onPlanetClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Calculate objects intersecting the picking ray
    const planetMeshes = this.celestialBodies
      .map(body => body.object)
      .filter(obj => obj !== undefined);
    
    const intersects = this.raycaster.intersectObjects(planetMeshes);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const planet = this.celestialBodies.find(body => body.object === clickedObject);
      
      if (planet) {
        this.planetSelected.emit(planet);
      }
    }
  }
}
```

### Adding Particle Effects

```typescript
// Add comet trails and space dust
private addParticleEffects(): void {
  // Create comet trail
  this.createCometTrail();
  
  // Create space dust
  this.createSpaceDust();
}

private createCometTrail(): void {
  const trailGeometry = new THREE.BufferGeometry();
  const trailMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.5,
    transparent: true,
    opacity: 0.6
  });
  
  const trailPositions = [];
  const trailCount = 1000;
  
  for (let i = 0; i < trailCount; i++) {
    // Create elliptical comet orbit
    const angle = (i / trailCount) * Math.PI * 2;
    const x = Math.cos(angle) * 300;
    const z = Math.sin(angle) * 150;
    const y = Math.sin(angle * 3) * 10;
    
    trailPositions.push(x, y, z);
  }
  
  trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
  const cometTrail = new THREE.Points(trailGeometry, trailMaterial);
  this.scene.add(cometTrail);
}

private createSpaceDust(): void {
  const dustGeometry = new THREE.BufferGeometry();
  const dustMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.1,
    transparent: true,
    opacity: 0.3
  });
  
  const dustPositions = [];
  const dustCount = 5000;
  
  for (let i = 0; i < dustCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    
    dustPositions.push(x, y, z);
  }
  
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const spaceDust = new THREE.Points(dustGeometry, dustMaterial);
  this.scene.add(spaceDust);
}
```

### Dynamic Texture Loading

```typescript
// Service for managing textures
@Injectable({
  providedIn: 'root'
})
export class TextureService {
  private textureLoader = new THREE.TextureLoader();
  private textureCache = new Map<string, THREE.Texture>();
  
  loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (this.textureCache.has(url)) {
        resolve(this.textureCache.get(url)!);
        return;
      }
      
      this.textureLoader.load(
        url,
        (texture) => {
          this.textureCache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  async loadPlanetTextures(planet: CelestialBody): Promise<void> {
    try {
      const texture = await this.loadTexture(planet.texture);
      
      if (planet.object) {
        const material = new THREE.MeshStandardMaterial({ 
          map: texture,
          metalness: 0.1,
          roughness: 0.7
        });
        planet.object.material = material;
      }
    } catch (error) {
      console.error(`Failed to load texture for ${planet.name}:`, error);
      // Keep using fallback color
    }
  }
}
```

## Performance Optimization

### Level of Detail (LOD) System

```typescript
// Implement LOD for distant planets
private setupLevelOfDetail(): void {
  this.celestialBodies.forEach(body => {
    if (body.object && body.distance > 0) {
      const lod = new THREE.LOD();
      
      // High detail (close up)
      const highDetail = this.createPlanetMesh(body, 32);
      lod.addLevel(highDetail, 0);
      
      // Medium detail
      const mediumDetail = this.createPlanetMesh(body, 16);
      lod.addLevel(mediumDetail, 100);
      
      // Low detail (far away)
      const lowDetail = this.createPlanetMesh(body, 8);
      lod.addLevel(lowDetail, 500);
      
      this.scene.remove(body.object);
      this.scene.add(lod);
      body.object = lod;
    }
  });
}

private createPlanetMesh(body: CelestialBody, segments: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(body.radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ color: body.color });
  return new THREE.Mesh(geometry, material);
}
```

### Frustum Culling Optimization

```typescript
// Only render objects within camera view
private optimizeRendering(): void {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4();
  
  // Update frustum with camera matrix
  matrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(matrix);
  
  this.celestialBodies.forEach(body => {
    if (body.object) {
      // Check if object is in view
      const sphere = new THREE.Sphere(body.object.position, body.radius);
      body.object.visible = frustum.intersectsSphere(sphere);
    }
  });
}
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Textures Not Loading

**Problem**: Planets appear as solid colors instead of textured surfaces.

**Solution**:
```typescript
// Add error handling to texture loading
const texture = textureLoader.load(
  body.texture,
  (loadedTexture) => {
    console.log(`✓ Texture loaded: ${body.name}`);
  },
  (progress) => {
    console.log(`Loading ${body.name}: ${(progress.loaded / progress.total * 100)}%`);
  },
  (error) => {
    console.error(`✗ Failed to load texture for ${body.name}:`, error);
    // Check if file exists and path is correct
  }
);
```

#### Issue 2: Performance Problems

**Problem**: Low frame rate or choppy animation.

**Solutions**:
```typescript
// 1. Reduce geometry complexity
const geometry = new THREE.SphereGeometry(radius, 16, 16); // Instead of 32, 32

// 2. Limit star count
const starCount = 5000; // Instead of 10000

// 3. Use instancing for asteroids
const asteroidGeometry = new THREE.InstancedMesh(baseGeometry, material, count);
```

#### Issue 3: Memory Leaks

**Problem**: Application becomes slower over time.

**Solution**:
```typescript
ngOnDestroy(): void {
  // Proper cleanup
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
  }
  
  // Dispose of geometries and materials
  this.celestialBodies.forEach(body => {
    if (body.object) {
      body.object.geometry.dispose();
      if (Array.isArray(body.object.material)) {
        body.object.material.forEach(material => material.dispose());
      } else {
        body.object.material.dispose();
      }
    }
  });
  
  this.renderer.dispose();
  this.scene.clear();
}
```

## Common Patterns

### Configuration Pattern

```typescript
// Centralized configuration
export interface SolarSystemConfig {
  showOrbits: boolean;
  showMoons: boolean;
  enableParticles: boolean;
  qualityLevel: 'low' | 'medium' | 'high';
  customPlanets?: CelestialBody[];
}

export class ConfigurableSolarSystemComponent extends SolarSystemComponent {
  @Input() config: SolarSystemConfig = {
    showOrbits: true,
    showMoons: true,
    enableParticles: false,
    qualityLevel: 'medium'
  };
  
  protected createSolarSystem(): void {
    super.createSolarSystem();
    
    if (!this.config.showOrbits) {
      this.hideOrbits();
    }
    
    if (!this.config.showMoons) {
      this.hideMoons();
    }
    
    if (this.config.enableParticles) {
      this.addParticleEffects();
    }
  }
}
```

### Observer Pattern for Events

```typescript
// Event system for solar system interactions
export interface SolarSystemEvents {
  planetHover: CelestialBody;
  planetClick: CelestialBody;
  speedChange: number;
  viewChange: { position: THREE.Vector3; target: THREE.Vector3 };
}

export class EventDrivenSolarSystemComponent extends SolarSystemComponent {
  private eventEmitter = new EventEmitter<keyof SolarSystemEvents>();
  
  onEvent<K extends keyof SolarSystemEvents>(
    event: K, 
    callback: (data: SolarSystemEvents[K]) => void
  ): void {
    this.eventEmitter.on(event, callback);
  }
  
  private emitEvent<K extends keyof SolarSystemEvents>(
    event: K, 
    data: SolarSystemEvents[K]
  ): void {
    this.eventEmitter.emit(event, data);
  }
}
```

---

This usage guide provides comprehensive examples for integrating, customizing, and extending the Solar System application. Use these patterns as starting points for your own implementations.