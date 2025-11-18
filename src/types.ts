/**
 * Configuration types for the 3D ski goggle configurator
 * These will later be populated from WordPress WooCommerce
 */

/**
 * Represents a frame option
 */
export interface FrameOption {
    id: string
    name: string
    modelPath: string
    color?: string
}

/**
 * Represents a lens option
 */
export interface LensOption {
    id: string
    name: string
    modelPath: string
    color: string
    description?: string
}

/**
 * Represents a strap option
 */
export interface StrapOption {
    id: string
    name: string
    modelPath: string
    printPath?: string
    color?: string
    description?: string
}

/**
 * Complete configuration for a goggle
 */
export interface GoggleConfiguration {
    frame: FrameOption
    lenses: LensOption[]
    straps: StrapOption[]
}

/**
 * Options for initializing the configurator
 */
export interface ConfiguratorOptions {
    frames: FrameOption[]
    lenses: LensOption[]
    straps: StrapOption[]
    defaultConfiguration?: {
        frameId?: string
        lensId?: string
        strapId?: string
    }
}
