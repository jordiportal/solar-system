# Solar System Application - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Components](#components)
4. [Interfaces](#interfaces)
5. [Public APIs](#public-apis)
6. [Usage Examples](#usage-examples)
7. [Configuration](#configuration)
8. [Assets](#assets)
9. [Development Guide](#development-guide)

## Overview

The Solar System Application is an Angular-based 3D visualization of our solar system built with Three.js. It provides an interactive experience where users can explore planets, their moons, and orbital mechanics with realistic proportions and textures.

### Key Features

- **3D Solar System Visualization**: Realistic representation of all planets and major moons
- **Interactive Controls**: Orbit controls for navigation and zoom
- **Speed Control**: Adjustable simulation speed from 0.1x to 5x
- **Realistic Textures**: High-quality 2K textures for all celestial bodies
- **Orbital Mechanics**: Accurate orbital and rotational speeds
- **Responsive Design**: Adapts to different screen sizes

### Technology Stack

- **Angular 15.0.0**: Frontend framework
- **Three.js 0.175.0**: 3D graphics library
- **TypeScript 4.8.2**: Programming language
- **SCSS**: Styling

## Project Structure

```
src/
├── app/
│   ├── app.component.ts           # Root component
│   ├── app.component.html         # Root template
│   ├── app.component.scss         # Root styles
│   ├── app.module.ts              # Main module
│   ├── app-routing.module.ts      # Routing configuration
│   └── solar-system/
│       ├── solar-system.component.ts    # Main 3D component
│       ├── solar-system.component.html  # Component template
│       ├── solar-system.component.scss  # Component styles
│       └── solar-system.component.spec.ts # Unit tests
├── assets/
│   └── textures/                  # Planet and moon textures
├── index.html                     # Main HTML file
├── main.ts                        # Application bootstrap
└── styles.scss                    # Global styles
```

## Components

### AppComponent

**Selector**: `app-root`

The root component of the application that serves as the main container.

#### Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `title` | `string` | Application title | `'solar-system'` |

#### Template

```html
<app-solar-system></app-solar-system>
```

#### Usage

```typescript
import { AppComponent } from './app.component';

// The AppComponent is automatically bootstrapped in AppModule
```

### SolarSystemComponent

**Selector**: `app-solar-system`

The main component responsible for creating and managing the 3D solar system visualization.

#### Properties

| Property | Type | Access | Description |
|----------|------|--------|-------------|
| `simulationSpeed` | `number` | `public` | Controls the speed of the simulation (0.1x to 5x) |
| `rendererContainer` | `ElementRef` | `private` | ViewChild reference to the renderer container |
| `renderer` | `THREE.WebGLRenderer` | `private` | Three.js WebGL renderer |
| `scene` | `THREE.Scene` | `private` | Three.js scene object |
| `camera` | `THREE.PerspectiveCamera` | `private` | Three.js perspective camera |
| `controls` | `OrbitControls` | `private` | Three.js orbit controls |
| `animationFrameId` | `number` | `private` | Animation frame ID for cleanup |
| `celestialBodies` | `CelestialBody[]` | `private` | Array of all celestial bodies in the system |

#### Methods

##### Public Methods

**None** - All methods are private implementation details.

##### Private Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `ngOnInit()` | - | `void` | Initializes celestial bodies data |
| `ngAfterViewInit()` | - | `void` | Initializes Three.js and starts animation |
| `ngOnDestroy()` | - | `void` | Cleanup method to prevent memory leaks |
| `initThree()` | - | `void` | Initializes Three.js scene, camera, renderer, and lighting |
| `addStars()` | - | `void` | Creates and adds star field background |
| `createSolarSystem()` | - | `void` | Creates all planets, moons, and orbital paths |
| `createRings(planet: CelestialBody)` | `planet: CelestialBody` | `void` | Creates ring system for planets like Saturn |
| `createMoons(planet: CelestialBody)` | `planet: CelestialBody` | `void` | Creates moon objects for planets |
| `animate()` | - | `void` | Main animation loop |
| `onWindowResize()` | - | `void` | Handles window resize events |

#### Lifecycle Hooks

- **OnInit**: Initializes celestial bodies configuration
- **AfterViewInit**: Sets up Three.js scene and starts animation
- **OnDestroy**: Cleans up resources and stops animation

#### Template Features

```html
<div class="solar-system-container">
  <div #rendererContainer class="renderer-container"></div>
  
  <div class="controls-container">
    <div class="speed-control">
      <label for="speed-slider">Velocidad: {{simulationSpeed.toFixed(1)}}x</label>
      <input 
        id="speed-slider" 
        type="range" 
        min="0.1" 
        max="5" 
        step="0.1" 
        [(ngModel)]="simulationSpeed" 
        class="slider"
      >
    </div>
  </div>
</div>
```

#### Usage

```typescript
import { SolarSystemComponent } from './solar-system/solar-system.component';

// Used in templates
<app-solar-system></app-solar-system>
```

## Interfaces

### CelestialBody

Represents a planet or major celestial body in the solar system.

```typescript
interface CelestialBody {
  name: string;                    // Name of the celestial body
  radius: number;                  // Radius in arbitrary units
  distance: number;                // Distance from the sun
  rotationSpeed: number;           // Speed of rotation on axis
  orbitalSpeed: number;            // Speed of orbit around sun
  texture: string;                 // Path to texture image
  color: number;                   // Hex color as fallback
  moons?: Moon[];                  // Array of moons (optional)
  hasRings?: boolean;              // Whether the body has rings
  ringsInnerRadius?: number;       // Inner radius of rings
  ringsOuterRadius?: number;       // Outer radius of rings
  ringsColor?: number;             // Color of rings
  object?: THREE.Mesh;             // Three.js mesh object
  rings?: THREE.Mesh;              // Three.js rings mesh
  orbit?: THREE.Line;              // Three.js orbital path
}
```

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✓ | Display name of the celestial body |
| `radius` | `number` | ✓ | Size of the body (relative units) |
| `distance` | `number` | ✓ | Distance from the sun (0 for sun itself) |
| `rotationSpeed` | `number` | ✓ | Angular velocity of rotation |
| `orbitalSpeed` | `number` | ✓ | Angular velocity of orbit |
| `texture` | `string` | ✓ | File path to texture image |
| `color` | `number` | ✓ | Hex color code for fallback |
| `moons` | `Moon[]` | ✗ | Array of satellite moons |
| `hasRings` | `boolean` | ✗ | Indicates presence of ring system |
| `ringsInnerRadius` | `number` | ✗ | Inner boundary of rings |
| `ringsOuterRadius` | `number` | ✗ | Outer boundary of rings |
| `ringsColor` | `number` | ✗ | Color of ring system |
| `object` | `THREE.Mesh` | ✗ | Three.js mesh (set at runtime) |
| `rings` | `THREE.Mesh` | ✗ | Three.js rings mesh (set at runtime) |
| `orbit` | `THREE.Line` | ✗ | Three.js orbital path (set at runtime) |

### Moon

Represents a natural satellite of a planet.

```typescript
interface Moon {
  name: string;                    // Name of the moon
  radius: number;                  // Radius in arbitrary units
  distance: number;                // Distance from parent planet
  rotationSpeed: number;           // Speed of rotation on axis
  orbitalSpeed: number;            // Speed of orbit around planet
  color: number;                   // Hex color code
  object?: THREE.Mesh;             // Three.js mesh object
}
```

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✓ | Display name of the moon |
| `radius` | `number` | ✓ | Size of the moon (relative units) |
| `distance` | `number` | ✓ | Distance from parent planet |
| `rotationSpeed` | `number` | ✓ | Angular velocity of rotation |
| `orbitalSpeed` | `number` | ✓ | Angular velocity around planet |
| `color` | `number` | ✓ | Hex color code |
| `object` | `THREE.Mesh` | ✗ | Three.js mesh (set at runtime) |

## Public APIs

### Module Configuration

#### AppModule

The main application module that configures the Angular application.

```typescript
@NgModule({
  declarations: [
    AppComponent,
    SolarSystemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### AppRoutingModule

Currently configured with empty routes but ready for expansion.

```typescript
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Component API

#### SolarSystemComponent API

##### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `simulationSpeed` | `number` | `1` | Speed multiplier for the simulation |

##### Output Events

Currently no custom events are emitted.

##### Template Variables

| Variable | Type | Description |
|----------|------|-------------|
| `simulationSpeed` | `number` | Bound to the speed control slider |

## Usage Examples

### Basic Usage

```html
<!-- In your template -->
<app-solar-system></app-solar-system>
```

### Custom Integration

```typescript
import { Component, ViewChild } from '@angular/core';
import { SolarSystemComponent } from './solar-system/solar-system.component';

@Component({
  selector: 'app-custom',
  template: `
    <div class="wrapper">
      <app-solar-system></app-solar-system>
    </div>
  `
})
export class CustomComponent {
  @ViewChild(SolarSystemComponent) solarSystem!: SolarSystemComponent;
  
  // Access the component's public properties
  setSpeed(speed: number) {
    this.solarSystem.simulationSpeed = speed;
  }
}
```

### Extending the Component

To add new celestial bodies, modify the `celestialBodies` array in `ngOnInit()`:

```typescript
// Example: Adding a new planet
{
  name: 'Planet X',
  radius: 1.5,
  distance: 250,
  rotationSpeed: 0.005,
  orbitalSpeed: 0.001,
  texture: 'assets/textures/planet_x.jpg',
  color: 0x8B4513,
  moons: [
    {
      name: 'Moon X1',
      radius: 0.3,
      distance: 4,
      rotationSpeed: 0.02,
      orbitalSpeed: 0.05,
      color: 0xC0C0C0
    }
  ]
}
```

## Configuration

### Environment Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Server**:
   ```bash
   ng serve
   ```

3. **Build for Production**:
   ```bash
   ng build --prod
   ```

### Three.js Configuration

The Three.js setup includes:

- **Camera**: PerspectiveCamera with 75° FOV
- **Renderer**: WebGLRenderer with antialiasing
- **Controls**: OrbitControls for navigation
- **Lighting**: 
  - Ambient light (0.5 intensity)
  - Point light from sun (2.0 intensity)
  - Directional light (0.8 intensity)
  - Hemisphere light (0.5 intensity)

### Performance Settings

- **Stars**: 10,000 point particles for background
- **Planet Geometry**: 32x32 segments for spheres
- **Moon Geometry**: 16x16 segments for spheres
- **Orbit Segments**: 64 segments for orbital paths

## Assets

### Texture Requirements

All textures are stored in `src/assets/textures/` and should be in the following format:

| Planet | Filename | Resolution | Format |
|--------|----------|------------|---------|
| Sun | `2k_sun.jpg` | 2048x1024 | JPEG |
| Mercury | `2k_mercury.jpg` | 2048x1024 | JPEG |
| Venus | `2k_venus_surface.jpg` | 2048x1024 | JPEG |
| Earth | `2k_earth_daymap.jpg` | 2048x1024 | JPEG |
| Mars | `2k_mars.jpg` | 2048x1024 | JPEG |
| Jupiter | `2k_jupiter.jpg` | 2048x1024 | JPEG |
| Saturn | `2k_saturn.jpg` | 2048x1024 | JPEG |
| Uranus | `2k_uranus.jpg` | 2048x1024 | JPEG |
| Neptune | `2k_neptune.jpg` | 2048x1024 | JPEG |
| Moon | `2k_moon.jpg` | 2048x1024 | JPEG |
| Saturn Rings | `2k_saturn_ring_alpha.png` | 1024x1024 | PNG |

### Adding New Textures

1. Place texture files in `src/assets/textures/`
2. Update the `texture` property in the celestial body configuration
3. Ensure the texture follows the equirectangular projection format

## Development Guide

### Adding New Features

#### Adding a New Planet

1. **Define the Planet**:
   ```typescript
   const newPlanet: CelestialBody = {
     name: 'New Planet',
     radius: 2.5,
     distance: 300,
     rotationSpeed: 0.008,
     orbitalSpeed: 0.002,
     texture: 'assets/textures/new_planet.jpg',
     color: 0xFF6B35
   };
   ```

2. **Add to celestialBodies Array**:
   ```typescript
   this.celestialBodies.push(newPlanet);
   ```

#### Adding New Moons

```typescript
const planetWithMoons: CelestialBody = {
  // ... planet properties
  moons: [
    {
      name: 'New Moon',
      radius: 0.4,
      distance: 6,
      rotationSpeed: 0.03,
      orbitalSpeed: 0.06,
      color: 0xDCDCDC
    }
  ]
};
```

#### Customizing Lighting

Modify the lighting setup in `initThree()`:

```typescript
// Add custom lighting
const customLight = new THREE.SpotLight(0xffffff, 1, 100);
customLight.position.set(50, 50, 50);
this.scene.add(customLight);
```

### Testing

Run unit tests:
```bash
ng test
```

The application includes basic component tests in:
- `app.component.spec.ts`
- `solar-system.component.spec.ts`

### Building and Deployment

1. **Development Build**:
   ```bash
   ng build
   ```

2. **Production Build**:
   ```bash
   ng build --prod
   ```

3. **Serve Locally**:
   ```bash
   ng serve --host 0.0.0.0 --port 4200
   ```

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design with touch controls

### Performance Optimization

- Textures are loaded asynchronously with fallback colors
- Animation uses `requestAnimationFrame` for smooth performance
- Resources are properly cleaned up in `ngOnDestroy`
- Orbit controls include damping for smooth interaction

---

## Support and Contribution

For issues, feature requests, or contributions, please refer to the project repository. This documentation covers all public APIs and usage patterns for the Solar System application.