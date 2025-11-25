/**
 * Configuration types for the 3D ski goggle configurator
 */

/**
 * Represents a frame option from WooCommerce
 */
export interface FrameOption {
    id: string
    name: string
    modelUrl: string
}

/**
 * Represents a lens option from WooCommerce
 */
export interface LensOption {
    id: string
    name: string
    modelUrl: string
}

/**
 * Represents a strap option from WooCommerce
 */
export interface StrapOption {
    id: string
    name: string
    modelUrl: string
}

/**
 * WooCommerce product data structure
 */
export interface WooCommerceProductData {
    frames: FrameOption[]
    lenses: LensOption[]
    straps: StrapOption[]
    defaults?: {
        frameId?: string
        lensId?: string
        strapId?: string
    }
}
