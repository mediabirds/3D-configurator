import * as THREE from 'three'

export class Mesh {
    /**
     * Three MeshStandardMaterial
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/materials/MeshStandardMaterial}
     */
    readonly material: THREE.MeshStandardMaterial
    /**
     * Load textures using this loader
     *
     * @readonly
     * @see {@link https://threejs.org/docs/#api/en/loaders/TextureLoader}
     */
    readonly textureLoader: THREE.TextureLoader

    constructor(readonly mesh: THREE.Mesh) {
        this.material = this.mesh.material as THREE.MeshStandardMaterial
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
    }
}
