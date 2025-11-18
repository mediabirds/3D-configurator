import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import * as THREE from 'three'
import { Lens } from './meshes/lens'
import { Strap } from './meshes/strap'
import { Frame } from './meshes/frame'
import type { ConfiguratorOptions, FrameOption, LensOption, StrapOption } from './types'
import DefaultEnvironmentUrl from '../src/assets/autumn_field_puresky_1k.hdr?url'

export class Configurator {
    /**
     * Three Scene
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/scenes/Scene}
     */
    scene: THREE.Scene

    /**
     * Three OrbitControls
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#examples/en/controls/OrbitControls}
     */
    controls: OrbitControls

    /**
     * Three PerspectiveCamera
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera}
     */
    camera: THREE.PerspectiveCamera

    /**
     * Three WebGLRenderer
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer}
     */
    renderer: THREE.WebGLRenderer

    /**
     * GLTF Loader for loading models
     */
    private loader: GLTFLoader

    /**
     * Available configuration options
     */
    private options: ConfiguratorOptions

    /**
     * The current lens of the glasses
     */
    private currentLens?: Lens

    /**
     * The current frame of the glasses
     */
    private currentFrame?: Frame

    /**
     * The current strap of the glasses
     */
    private currentStrap?: Strap

    /**
     * Container for all goggle components
     */
    private goggleGroup: THREE.Group

    /**
     * Should not be called directly. Use `Configurator.create` instead.
     *
     * @param options   - Configuration options
     * @param element   - The element which the configurator will be appended to
     * @protected
     */
    protected constructor(
        options: ConfiguratorOptions,
        protected element: HTMLElement,
    ) {
        this.options = options
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.loader = new GLTFLoader()
        this.goggleGroup = new THREE.Group()

        element.appendChild(this.renderer.domElement)

        this.scene.add(this.goggleGroup)
        this.initRenderer()
        this.initScene()

        this.render()
    }

    /**
     * Get the current lens
     */
    get lens(): Lens | undefined {
        return this.currentLens
    }

    /**
     * Get the current frame
     */
    get frame(): Frame | undefined {
        return this.currentFrame
    }

    /**
     * Get the current strap
     */
    get strap(): Strap | undefined {
        return this.currentStrap
    }

    /**
     * Get available frame options
     */
    get frames(): FrameOption[] {
        return this.options.frames
    }

    /**
     * Get available lens options
     */
    get lenses(): LensOption[] {
        return this.options.lenses
    }

    /**
     * Get available strap options
     */
    get straps(): StrapOption[] {
        return this.options.straps
    }

    /**
     * Load a frame model and add it to the scene
     *
     * @param frameOption - The frame option to load
     */
    async loadFrame(frameOption: FrameOption): Promise<Frame> {
        try {
            // Remove current frame if exists
            if (this.currentFrame) {
                this.goggleGroup.remove(this.currentFrame.getModel())
            }

            const gltf = await this.loader.loadAsync(frameOption.modelPath)
            const frame = new Frame(gltf.scene, frameOption)
            this.currentFrame = frame
            this.goggleGroup.add(frame.getModel())

            return frame
        } catch (error) {
            console.error('Error loading frame:', error)
            throw error
        }
    }

    /**
     * Load a lens model and add it to the scene
     *
     * @param lensOption - The lens option to load
     */
    async loadLens(lensOption: LensOption): Promise<Lens> {
        try {
            // Remove current lens if exists
            if (this.currentLens) {
                this.goggleGroup.remove(this.currentLens.getModel())
            }

            const gltf = await this.loader.loadAsync(lensOption.modelPath)
            const lens = new Lens(gltf.scene, lensOption)
            this.currentLens = lens
            this.goggleGroup.add(lens.getModel())

            return lens
        } catch (error) {
            console.error('Error loading lens:', error)
            throw error
        }
    }

    /**
     * Load a strap model and add it to the scene
     *
     * @param strapOption - The strap option to load
     */
    async loadStrap(strapOption: StrapOption): Promise<Strap> {
        try {
            // Remove current strap if exists
            if (this.currentStrap) {
                this.goggleGroup.remove(this.currentStrap.getModel())
            }

            const gltf = await this.loader.loadAsync(strapOption.modelPath)
            const strap = new Strap(gltf.scene, strapOption)
            this.currentStrap = strap
            this.goggleGroup.add(strap.getModel())

            return strap
        } catch (error) {
            console.error('Error loading strap:', error)
            throw error
        }
    }

    /**
     * Change the current frame
     *
     * @param frameId - ID of the frame to switch to
     */
    async changeFrame(frameId: string): Promise<Frame> {
        const frameOption = this.options.frames.find((f) => f.id === frameId)
        if (!frameOption) {
            throw new Error(`Frame with id ${frameId} not found`)
        }
        return this.loadFrame(frameOption)
    }

    /**
     * Change the current lens
     *
     * @param lensId - ID of the lens to switch to
     */
    async changeLens(lensId: string): Promise<Lens> {
        const lensOption = this.options.lenses.find((l) => l.id === lensId)
        if (!lensOption) {
            throw new Error(`Lens with id ${lensId} not found`)
        }
        return this.loadLens(lensOption)
    }

    /**
     * Change the current strap
     *
     * @param strapId - ID of the strap to switch to
     */
    async changeStrap(strapId: string): Promise<Strap> {
        const strapOption = this.options.straps.find((s) => s.id === strapId)
        if (!strapOption) {
            throw new Error(`Strap with id ${strapId} not found`)
        }
        return this.loadStrap(strapOption)
    }

    /**
     * Initialize the configurator
     *
     * @protected
     */
    protected init() {
        this.initRenderer()
        this.initScene()
    }

    /**
     * Initialize the renderer
     *
     * @protected
     */
    protected initRenderer() {
        const { width, height } = this.element.getBoundingClientRect()

        this.renderer.setSize(width, height)
        this.renderer.setClearColor(new THREE.Color(1, 1, 1), 1)

        this.renderer.toneMapping = THREE.CineonToneMapping
        this.renderer.toneMappingExposure = 1

        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.maxDistance = 500

        this.camera.position.set(150, 150, 150)
    }

    /**
     * Initialize the scene
     *
     * @protected
     */
    protected initScene() {
        this.setEnvironment(DefaultEnvironmentUrl)
    }

    /**
     * Render the scene
     *
     * @protected
     */
    protected render() {
        requestAnimationFrame(this.render.bind(this))

        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * Set the scene environment
     *
     * @param hdrimage - Path to the HDR image
     */
    public async setEnvironment(hdrimage: string) {
        try {
            const rgbeLoader = new RGBELoader()
            const texture = await rgbeLoader.loadAsync(hdrimage)

            texture.mapping = THREE.EquirectangularReflectionMapping
            this.scene.environment = texture
        } catch (error) {
            console.error('Error loading HDR image:', error)
            throw error
        }
    }

    /**
     * Create and initialize a new Configurator instance
     *
     * @param options   - Configuration options containing available frames, lenses, and straps
     * @param element   - Element which the configurator will be appended to
     */
    static async create(options: ConfiguratorOptions, element: HTMLElement): Promise<Configurator> {
        const configurator = new Configurator(options, element)

        // Load default configuration if provided
        const defaults = options.defaultConfiguration
        if (defaults) {
            const promises: Promise<any>[] = []

            if (defaults.frameId) {
                promises.push(configurator.changeFrame(defaults.frameId))
            }

            if (defaults.lensId) {
                promises.push(configurator.changeLens(defaults.lensId))
            }

            if (defaults.strapId) {
                promises.push(configurator.changeStrap(defaults.strapId))
            }

            await Promise.all(promises)
        }

        return configurator
    }
}
