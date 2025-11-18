import * as THREE from 'three'
import { Mesh } from './mesh'
import type { FrameOption } from '../types'

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

export class Frame extends Mesh {
    public option: FrameOption

    constructor(
        readonly model: THREE.Group,
        option: FrameOption,
    ) {
        // Find the main mesh in the model (recursively)
        const mesh = findMeshInModel(model)
        if (!mesh) {
            throw new Error('No mesh found in frame model')
        }

        super(mesh)
        this.option = option

        // Keep the original color from the model
        // Only override if specifically provided in option
        if (option.color) {
            this.material.color.set(option.color)
        }
        // Otherwise, the model's own color will be preserved
    }

    /**
     * Get the complete model (group) for scene manipulation
     */
    getModel(): THREE.Group {
        return this.model
    }
}
