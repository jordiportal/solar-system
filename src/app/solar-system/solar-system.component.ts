import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Moon {
  name: string;
  radius: number;
  distance: number;
  rotationSpeed: number;
  orbitalSpeed: number;
  color: number;
  object?: THREE.Mesh;
}

interface CelestialBody {
  name: string;
  radius: number;
  distance: number;
  rotationSpeed: number;
  orbitalSpeed: number;
  texture: string;
  color: number;
  moons?: Moon[];
  hasRings?: boolean;
  ringsInnerRadius?: number;
  ringsOuterRadius?: number;
  ringsColor?: number;
  object?: THREE.Mesh;
  rings?: THREE.Mesh;
  orbit?: THREE.Line;
}

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss']
})
export class SolarSystemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  
  private animationFrameId!: number;
  private celestialBodies: CelestialBody[] = [];
  
  // Factor de velocidad para la simulación
  public simulationSpeed: number = 1;

  constructor() { }

  ngOnInit(): void {
    // Definimos los cuerpos celestes del sistema solar
    this.celestialBodies = [
      {
        name: 'Sol',
        radius: 15,
        distance: 0,
        rotationSpeed: 0.001,
        orbitalSpeed: 0,
        texture: 'assets/textures/2k_sun.jpg',
        color: 0xffcc00
      },
      {
        name: 'Mercurio',
        radius: 0.8,
        distance: 30,
        rotationSpeed: 0.004,
        orbitalSpeed: 0.02,
        texture: 'assets/textures/2k_mercury.jpg',
        color: 0xaaaaaa
      },
      {
        name: 'Venus',
        radius: 1.5,
        distance: 45,
        rotationSpeed: 0.002,
        orbitalSpeed: 0.015,
        texture: 'assets/textures/2k_venus_surface.jpg',
        color: 0xf5deb3
      },
      {
        name: 'Tierra',
        radius: 2,
        distance: 60,
        rotationSpeed: 0.01,
        orbitalSpeed: 0.01,
        texture: 'assets/textures/2k_earth_daymap.jpg',
        color: 0x1a75ff,
        moons: [
          {
            name: 'Luna',
            radius: 0.5,
            distance: 5,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.05,
            color: 0xdcdcdc
          }
        ]
      },
      {
        name: 'Marte',
        radius: 1.2,
        distance: 78,
        rotationSpeed: 0.008,
        orbitalSpeed: 0.008,
        texture: 'assets/textures/2k_mars.jpg',
        color: 0xff5733,
        moons: [
          {
            name: 'Fobos',
            radius: 0.2,
            distance: 3,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.06,
            color: 0xc0c0c0
          },
          {
            name: 'Deimos',
            radius: 0.1,
            distance: 4,
            rotationSpeed: 0.02,
            orbitalSpeed: 0.04,
            color: 0xc0c0c0
          }
        ]
      },
      {
        name: 'Júpiter',
        radius: 6,
        distance: 100,
        rotationSpeed: 0.02,
        orbitalSpeed: 0.004,
        texture: 'assets/textures/2k_jupiter.jpg',
        color: 0xf0c05a,
        moons: [
          {
            name: 'Io',
            radius: 0.4,
            distance: 7,
            rotationSpeed: 0.04,
            orbitalSpeed: 0.08,
            color: 0xf4a460
          },
          {
            name: 'Europa',
            radius: 0.4,
            distance: 9,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.06,
            color: 0xfafad2
          },
          {
            name: 'Ganímedes',
            radius: 0.6,
            distance: 11,
            rotationSpeed: 0.02,
            orbitalSpeed: 0.04,
            color: 0x8b4513
          },
          {
            name: 'Calisto',
            radius: 0.5,
            distance: 13,
            rotationSpeed: 0.01,
            orbitalSpeed: 0.02,
            color: 0x808080
          }
        ]
      },
      {
        name: 'Saturno',
        radius: 5,
        distance: 138,
        rotationSpeed: 0.018,
        orbitalSpeed: 0.0025,
        texture: 'assets/textures/2k_saturn.jpg',
        color: 0xe7e8e6,
        hasRings: true,
        ringsInnerRadius: 6,
        ringsOuterRadius: 10,
        ringsColor: 0xd2b48c,
        moons: [
          {
            name: 'Titán',
            radius: 0.6,
            distance: 12,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.05,
            color: 0xffd700
          },
          {
            name: 'Encélado',
            radius: 0.3,
            distance: 8,
            rotationSpeed: 0.04,
            orbitalSpeed: 0.07,
            color: 0xf0ffff
          }
        ]
      },
      {
        name: 'Urano',
        radius: 3.5,
        distance: 176,
        rotationSpeed: 0.012,
        orbitalSpeed: 0.002,
        texture: 'assets/textures/2k_uranus.jpg',
        color: 0x4169e1,
        moons: [
          {
            name: 'Titania',
            radius: 0.3,
            distance: 6,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.05,
            color: 0xd3d3d3
          },
          {
            name: 'Oberón',
            radius: 0.3,
            distance: 7,
            rotationSpeed: 0.02,
            orbitalSpeed: 0.04,
            color: 0xa9a9a9
          }
        ]
      },
      {
        name: 'Neptuno',
        radius: 3,
        distance: 200,
        rotationSpeed: 0.01,
        orbitalSpeed: 0.001,
        texture: 'assets/textures/2k_neptune.jpg',
        color: 0x3d85c6,
        moons: [
          {
            name: 'Tritón',
            radius: 0.4,
            distance: 6,
            rotationSpeed: 0.03,
            orbitalSpeed: 0.06,
            color: 0xf5f5f5
          }
        ]
      }
    ];
  }

  ngAfterViewInit(): void {
    this.initThree();
    this.createSolarSystem();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Limpiar la escena y los recursos para prevenir fugas de memoria
    this.renderer.dispose();
    this.scene.clear();
  }

  private initThree(): void {
    // Configuración inicial de Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Configuración de la cámara
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 200;
    this.camera.position.y = 100;

    // Configuración del renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Añadir controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Mejorar iluminación
    // 1. Aumentar la luz ambiental para iluminación general
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 2. Luz principal desde el sol (más intensa)
    const sunLight = new THREE.PointLight(0xffffff, 2, 500);
    this.scene.add(sunLight);
    
    // 3. Luz direccional adicional para mejor visualización
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 50, 50);
    this.scene.add(directionalLight);
    
    // 4. Luz hemisférica para simular reflejos ambientales
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(hemisphereLight);

    // Añadir estrellas de fondo
    this.addStars();

    // Manejar el cambio de tamaño de la ventana
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private addStars(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(starField);
  }

  private createSolarSystem(): void {
    // Cargar texturas
    const textureLoader = new THREE.TextureLoader();
    
    // Crear cada cuerpo celeste
    this.celestialBodies.forEach(body => {
      // Crear la geometría y material del planeta
      const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
      
      let material;
      
      // Cargar textura con manejo de errores optimizado
      const texture = textureLoader.load(
        body.texture,
        // Callback de éxito
        (loadedTexture) => {
          console.log(`Textura cargada con éxito: ${body.name}`);
          
          if (body.name === 'Sol') {
            // El sol tiene emisión de luz propia
            material = new THREE.MeshBasicMaterial({ map: loadedTexture });
          } else {
            // Usar texturas para los planetas con mejor reflectividad
            material = new THREE.MeshStandardMaterial({ 
              map: loadedTexture,
              metalness: 0.1,
              roughness: 0.7,
              emissive: new THREE.Color(0x444444),
              emissiveIntensity: 0.1
            });
          }
          
          // Actualizar el material del objeto
          if (body.object) {
            body.object.material = material;
          }
        },
        // Callback de progreso
        undefined,
        // Callback de error
        (error) => {
          console.error(`Error cargando textura de ${body.name}:`, error);
          
          // Usar color como fallback
          if (body.name === 'Sol') {
            material = new THREE.MeshBasicMaterial({ color: body.color });
          } else {
            material = new THREE.MeshStandardMaterial({ 
              color: body.color,
              metalness: 0.1,
              roughness: 0.7,
              emissive: new THREE.Color(0x444444),
              emissiveIntensity: 0.1
            });
          }
          
          // Actualizar el material del objeto
          if (body.object) {
            body.object.material = material;
          }
        }
      );
      
      // Iniciar con material básico mientras se carga la textura
      if (body.name === 'Sol') {
        material = new THREE.MeshBasicMaterial({ color: body.color });
      } else {
        material = new THREE.MeshStandardMaterial({ 
          color: body.color,
          metalness: 0.1,
          roughness: 0.7,
          emissive: new THREE.Color(0x444444),
          emissiveIntensity: 0.1
        });
      }

      // Crear el objeto 3D
      const mesh = new THREE.Mesh(geometry, material);
      
      // Posicionar el cuerpo celeste
      if (body.distance > 0) {
        mesh.position.x = body.distance;
        
        // Crear la órbita
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
        
        const orbitPoints = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            Math.cos(theta) * body.distance,
            0,
            Math.sin(theta) * body.distance
          );
        }
        
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        body.orbit = orbit;
        this.scene.add(orbit);
      }
      
      body.object = mesh;
      this.scene.add(mesh);
      
      // Añadir anillos si corresponde
      if (body.hasRings && body.ringsInnerRadius && body.ringsOuterRadius && body.ringsColor) {
        this.createRings(body);
      }
      
      // Crear lunas si las tiene
      if (body.moons && body.moons.length > 0) {
        this.createMoons(body);
      }
    });
  }
  
  private createRings(planet: CelestialBody): void {
    // Verificar que todos los valores requeridos existan
    if (
      typeof planet.ringsInnerRadius !== 'number' || 
      typeof planet.ringsOuterRadius !== 'number' || 
      typeof planet.ringsColor !== 'number' || 
      !planet.object
    ) {
      return;
    }
    
    // Referencia temporal para evitar problemas con TypeScript
    const planetObj = planet.object;
    
    const ringGeometry = new THREE.RingGeometry(
      planet.ringsInnerRadius, 
      planet.ringsOuterRadius, 
      64
    );
    
    // Crear material inicial con color
    let ringMaterial = new THREE.MeshBasicMaterial({
      color: planet.ringsColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    
    // Crear los anillos con el material inicial
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    
    planet.rings = rings;
    planetObj.add(rings);
    
    // Intentar cargar textura para los anillos
    if (planet.name === 'Saturno') {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        'assets/textures/2k_saturn_ring_alpha.png',
        // Callback de éxito
        (texture) => {
          console.log('Textura de anillos cargada con éxito');
          // Reemplazar el material con uno que use la textura
          const texturedMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
          });
          if (planet.rings) {
            planet.rings.material = texturedMaterial;
          }
        },
        // Callback de progreso
        undefined,
        // Callback de error
        (error) => {
          console.error('Error cargando textura de anillos:', error);
        }
      );
    }
  }
  
  private createMoons(planet: CelestialBody): void {
    if (!planet.moons || !planet.object) return;
    
    // Crear referencia temporal al objeto que TypeScript puede confirmar que no es undefined
    const planetObj = planet.object;
    const textureLoader = new THREE.TextureLoader();
    
    planet.moons.forEach(moon => {
      // Crear la geometría y material de la luna
      const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
      
      // Iniciar con material de color
      let moonMaterial = new THREE.MeshStandardMaterial({ 
        color: moon.color,
        metalness: 0.1,
        roughness: 0.5,
        emissive: new THREE.Color(0x222222),
        emissiveIntensity: 0.1
      });
      
      // Crear el objeto 3D
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
      
      // Posicionar inicialmente la luna
      moonMesh.position.x = moon.distance;
      
      // Crear un objeto contenedor para la luna
      const moonPivot = new THREE.Object3D();
      moonPivot.add(moonMesh);
      
      // Añadir el pivot al planeta para que rote con él
      planetObj.add(moonPivot);
      
      // Guardar referencia a la luna
      moon.object = moonMesh;
      
      // Intentar cargar textura para la Luna de la Tierra
      if (moon.name === 'Luna') {
        textureLoader.load(
          'assets/textures/2k_moon.jpg',
          // Callback de éxito
          (texture) => {
            console.log('Textura de Luna cargada con éxito');
            const texturedMaterial = new THREE.MeshStandardMaterial({ 
              map: texture,
              metalness: 0.1,
              roughness: 0.5,
              emissive: new THREE.Color(0x222222),
              emissiveIntensity: 0.1
            });
            if (moon.object) {
              moon.object.material = texturedMaterial;
            }
          },
          // Callback de progreso
          undefined,
          // Callback de error
          (error) => {
            console.error('Error cargando textura de Luna:', error);
          }
        );
      }
    });
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    // Actualizar la posición y rotación de cada cuerpo celeste
    this.celestialBodies.forEach(body => {
      if (body.object) {
        // Rotación sobre su propio eje (afectada por la velocidad)
        body.object.rotation.y += body.rotationSpeed * this.simulationSpeed;
        
        // Movimiento orbital (excepto el Sol)
        if (body.distance > 0) {
          const time = Date.now() * 0.001 * this.simulationSpeed;
          body.object.position.x = Math.cos(time * body.orbitalSpeed) * body.distance;
          body.object.position.z = Math.sin(time * body.orbitalSpeed) * body.distance;
          
          // Animar las lunas
          if (body.moons) {
            body.moons.forEach(moon => {
              if (moon.object && moon.object.parent) {
                // Rotar el pivot de la luna (afectado por la velocidad)
                moon.object.parent.rotation.y += moon.orbitalSpeed * this.simulationSpeed;
                // Rotar la luna sobre su propio eje
                moon.object.rotation.y += moon.rotationSpeed * this.simulationSpeed;
              }
            });
          }
        }
      }
    });
    
    // Actualizar los controles de órbita
    this.controls.update();
    
    // Renderizar la escena
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
