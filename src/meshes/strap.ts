import * as THREE from 'three'
import { Mesh } from './mesh'
import type { StrapOption } from '../types'

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

export class Strap extends Mesh {
    public texture?: THREE.Texture
    public option: StrapOption

    constructor(
        readonly model: THREE.Group,
        option: StrapOption,
    ) {
        // Find the main mesh in the model (recursively)
        const mesh = findMeshInModel(model)
        if (!mesh) {
            throw new Error('No mesh found in strap model')
        }

        super(mesh)
        this.option = option

        // Apply print if provided
        if (option.printPath) {
            this.setPrint(option.printPath)
        } else if (option.color) {
            this.material.color.set(option.color)
        }
    }

    /**
     * Set the print on the strap
     *
     * Path can be any of the following:
     * - URL
     * - base64 encoded image
     * - data URL
     * - relative path
     *
     * @param path  - Path to resource
     */
    setPrint(path: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    texture.generateMipmaps = false

                    texture.flipY = false

                    texture.wrapS = THREE.ClampToEdgeWrapping
                    texture.wrapT = THREE.ClampToEdgeWrapping

                    texture.repeat.set(0.0544, 0.2)
                    texture.offset.set(0.01, 0.35)

                    const texturedMaterial = new THREE.MeshPhysicalMaterial({
                        map: texture,
                        side: THREE.FrontSide,
                    })

                    this.mesh.material = texturedMaterial
                    this.texture = texture
                    resolve(this.texture)
                },
                (progress) => {
                    console.log(progress)
                },
                (error) => {
                    reject(error)
                },
            )
        })
    }

    /**
     * Get the complete model (group) for scene manipulation
     */
    getModel(): THREE.Group {
        return this.model
    }
}
