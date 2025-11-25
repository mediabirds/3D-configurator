import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import type { FrameOption, LensOption, StrapOption } from './types'

/**
 * 3D Ski Goggle Configurator
 *
 * Manages a Three.js scene with three swappable components:
 * - Frame
 * - Lens
 * - Strap
 */
export class Configurator {
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private camera: THREE.PerspectiveCamera
    private controls: OrbitControls
    private loader: GLTFLoader
    private goggleGroup: THREE.Group

    private currentFrame: THREE.Group | null = null
    private currentLens: THREE.Group | null = null
    private currentStrap: THREE.Group | null = null

    /**
     * Create a new Configurator instance
     *
     * @param element - The HTML element to render into
     */
    constructor(private element: HTMLElement) {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.loader = new GLTFLoader()
        this.goggleGroup = new THREE.Group()

        this.init()
    }

    /**
     * Initialize the scene, renderer, and start the render loop
     */
    private init(): void {
        const { width, height } = this.element.getBoundingClientRect()

        // Setup renderer
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(0xffffff, 1)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1

        // Setup camera
        this.camera.position.set(150, 150, 150)

        // Setup controls
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.maxDistance = 500

        // Add goggle group to scene
        this.scene.add(this.goggleGroup)

        // Append renderer to DOM
        this.element.appendChild(this.renderer.domElement)

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this))

        // Start render loop
        this.render()
    }

    /**
     * Handle window resize
     */
    private handleResize(): void {
        const { width, height } = this.element.getBoundingClientRect()
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

    /**
     * Render loop
     */
    private render(): void {
        requestAnimationFrame(this.render.bind(this))
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * Load an HDR environment map
     *
     * @param url - URL to the HDR file
     */
    async setEnvironment(url: string): Promise<void> {
        const rgbeLoader = new RGBELoader()
        const texture = await rgbeLoader.loadAsync(url)
        texture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = texture
    }

    /**
     * Load a GLB model
     *
     * @param url - URL to the GLB file
     * @returns The loaded model as a THREE.Group
     */
    private async loadModel(url: string): Promise<THREE.Group> {
        const gltf = await this.loader.loadAsync(url)
        return gltf.scene
    }

    /**
     * Set the frame model
     *
     * @param option - Frame option containing the model URL
     */
    async setFrame(option: FrameOption): Promise<void> {
        // Remove current frame if exists
        if (this.currentFrame) {
            this.goggleGroup.remove(this.currentFrame)
            this.disposeModel(this.currentFrame)
        }

        // Load and add new frame
        this.currentFrame = await this.loadModel(option.modelUrl)
        this.goggleGroup.add(this.currentFrame)
    }

    /**
     * Set the lens model
     *
     * @param option - Lens option containing the model URL
     */
    async setLens(option: LensOption): Promise<void> {
        // Remove current lens if exists
        if (this.currentLens) {
            this.goggleGroup.remove(this.currentLens)
            this.disposeModel(this.currentLens)
        }

        // Load and add new lens
        this.currentLens = await this.loadModel(option.modelUrl)
        this.goggleGroup.add(this.currentLens)
    }

    /**
     * Set the strap model
     *
     * @param option - Strap option containing the model URL
     */
    async setStrap(option: StrapOption): Promise<void> {
        // Remove current strap if exists
        if (this.currentStrap) {
            this.goggleGroup.remove(this.currentStrap)
            this.disposeModel(this.currentStrap)
        }

        // Load and add new strap
        this.currentStrap = await this.loadModel(option.modelUrl)
        this.goggleGroup.add(this.currentStrap)
    }

    /**
     * Dispose of a model and its resources
     *
     * @param model - The model to dispose
     */
    private disposeModel(model: THREE.Group): void {
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose())
                } else {
                    child.material.dispose()
                }
            }
        })
    }

    /**
     * Dispose of the configurator and clean up resources
     */
    dispose(): void {
        window.removeEventListener('resize', this.handleResize.bind(this))

        if (this.currentFrame) this.disposeModel(this.currentFrame)
        if (this.currentLens) this.disposeModel(this.currentLens)
        if (this.currentStrap) this.disposeModel(this.currentStrap)

        this.renderer.dispose()
        this.controls.dispose()
    }
}
