import * as THREE from 'three'

export class Mesh {
    /**
     * Three MeshStandardMaterial
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/materials/MeshStandardMaterial}
     */
    readonly material: THREE.MeshPhysicalMaterial
    /**
     * Load textures using this loader
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/loaders/TextureLoader}
     */
    readonly textureLoader: THREE.TextureLoader

    constructor(readonly mesh: THREE.Mesh) {
        this.material = this.mesh.material as THREE.MeshPhysicalMaterial
        this.textureLoader = new THREE.TextureLoader()
    }

    /**
     * Set the color of the material
     *
     * Color can be any of the following:
     * - A hexadecimal number
     * - A CSS-style color string
     * - A THREE.Color instance
     * - An array of three numbers representing RGB
     * - An array of four numbers representing RGBA
     *
     *
     * @param color
     */
    setColor(color: THREE.ColorRepresentation) {
        this.material.color.set(color)
        this.material.envMap = null

        // Remove texture maps that might override color
        this.material.map = null
        this.material.specularColorMap = null

        // Reduce transmission to make color more visible
        this.material.transmission = 0.2 // Slightly transparent
        this.material.transparent = true
        this.material.opacity = 0.8

        // Adjust other properties
        this.material.metalness = 1
        this.material.roughness = 0.3

        this.material.needsUpdate = true

        const material = this.material.toJSON()
        delete material.images
    }
}
