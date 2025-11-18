import * as THREE from 'three'
import { Mesh } from './mesh'
import type { LensOption } from '../types'

/**
 * Recursively find the first mesh in a 3D object hierarchy
 */
function findMeshInModel(object: THREE.Object3D): THREE.Mesh | null {
    if ((object as THREE.Mesh).isMesh) {
        return object as THREE.Mesh
    }

    for (const child of object.children) {
        const mesh = findMeshInModel(child)
        if (mesh) {
            return mesh
        }
    }

    return null
}

export class Lens extends Mesh {
    readonly material: THREE.MeshPhysicalMaterial
    public option: LensOption

    constructor(
        readonly model: THREE.Group,
        option: LensOption,
    ) {
        // Find the main mesh in the model (recursively)
        const mesh = findMeshInModel(model)
        if (!mesh) {
            throw new Error('No mesh found in lens model')
        }

        super(mesh)
        this.option = option

        // Get the existing material or create a new physical material
        const existingMaterial = this.mesh.material as THREE.MeshStandardMaterial

        // Preserve the original color from the model if it exists
        // const modelColor = existingMaterial?.color ? existingMaterial.color.clone() : new THREE.Color(option.color)
        // console.log(modelColor)
        // // Create physical material for lens with model's original color
        // this.material = new THREE.MeshPhysicalMaterial({
        //     color: modelColor,
        //     metalness: 0.8,
        //     roughness: 0,
        //     iridescence: 1,
        //     iridescenceIOR: 1.2,
        //     ior: 0.02,
        //     transparent: true,
        //     opacity: 0.95,
        //     reflectivity: 0,
        // })

        //this.mesh.material = this.material
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

    /**
     * Get the complete model (group) for scene manipulation
     */
    getModel(): THREE.Group {
        return this.model
    }
}
