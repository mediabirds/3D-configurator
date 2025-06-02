import * as THREE from 'three'
import { Mesh } from './mesh'

export class Lens extends Mesh {
    readonly material: THREE.MeshPhysicalMaterial

    constructor(readonly mesh: THREE.Mesh) {
        super(mesh)

        this.material = mesh.material as THREE.MeshPhysicalMaterial
        console.log(mesh.material)
        this.mesh.material = this.material
    }

    /**
     * Sets the transparency of the lens
     *
     * @example
     * ```typescript
     * .setTransparency(0.5)
     * ```
     * @param value
     */
    setTransparency(value: number) {
        this.material.opacity = value
    }
}
