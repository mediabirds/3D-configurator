/**
 * Helper utilities for integrating with WordPress WooCommerce
 */

import type { ConfiguratorOptions, FrameOption, LensOption, StrapOption } from './types'

/**
 * Interface for WooCommerce product variation data
 * This is an example structure - adjust based on your actual WooCommerce setup
 */
export interface WooCommerceProductData {
    frames: Array<{
        id: string
        name: string
        model_url: string
        color?: string
        price?: number
        sku?: string
    }>
    lenses: Array<{
        id: string
        name: string
        model_url: string
        color: string
        description?: string
        price?: number
        sku?: string
    }>
    straps: Array<{
        id: string
        name: string
        model_url: string
        print_url?: string
        color?: string
        description?: string
        price?: number
        sku?: string
    }>
    default_configuration?: {
        frame_id?: string
        lens_id?: string
        strap_id?: string
    }
}

/**
 * Convert WooCommerce product data to configurator options
 *
 * @param data - WooCommerce product data
 * @returns Configurator options
 */
export function wooCommerceToConfiguratorOptions(data: WooCommerceProductData): ConfiguratorOptions {
    const frames: FrameOption[] = data.frames.map((frame) => ({
        id: frame.id,
        name: frame.name,
        modelPath: frame.model_url,
        color: frame.color,
    }))

    const lenses: LensOption[] = data.lenses.map((lens) => ({
        id: lens.id,
        name: lens.name,
        modelPath: lens.model_url,
        color: lens.color,
        description: lens.description,
    }))

    const straps: StrapOption[] = data.straps.map((strap) => ({
        id: strap.id,
        name: strap.name,
        modelPath: strap.model_url,
        printPath: strap.print_url,
        color: strap.color,
        description: strap.description,
    }))

    return {
        frames,
        lenses,
        straps,
        defaultConfiguration: data.default_configuration
            ? {
                  frameId: data.default_configuration.frame_id,
                  lensId: data.default_configuration.lens_id,
                  strapId: data.default_configuration.strap_id,
              }
            : undefined,
    }
}

/**
 * Fetch configurator options from a WordPress REST API endpoint
 *
 * @param apiUrl - URL to the WooCommerce REST API endpoint
 * @returns Promise resolving to configurator options
 *
 * @example
 * ```typescript
 * const options = await fetchConfiguratorOptionsFromWooCommerce(
 *   'https://yoursite.com/wp-json/wc/v3/products/123/configurator-data'
 * )
 * const configurator = await Configurator.create(options, element)
 * ```
 */
export async function fetchConfiguratorOptionsFromWooCommerce(apiUrl: string): Promise<ConfiguratorOptions> {
    try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: WooCommerceProductData = await response.json()
        return wooCommerceToConfiguratorOptions(data)
    } catch (error) {
        console.error('Error fetching WooCommerce data:', error)
        throw error
    }
}

/**
 * Initialize configurator from WooCommerce data attribute
 * Useful for embedding configurator in WordPress pages
 *
 * @param element - The HTML element containing data-woocommerce-api attribute
 * @returns Promise resolving to configurator instance
 *
 * @example
 * HTML:
 * ```html
 * <div id="configurator" data-woocommerce-api="https://yoursite.com/wp-json/..."></div>
 * ```
 *
 * JavaScript:
 * ```typescript
 * import { initConfiguratorFromDataAttribute } from './woocommerce-helpers'
 * const configurator = await initConfiguratorFromDataAttribute(
 *   document.getElementById('configurator')
 * )
 * ```
 */
export async function initConfiguratorFromDataAttribute(element: HTMLElement) {
    const apiUrl = element.dataset.woocommerceApi
    if (!apiUrl) {
        throw new Error('Element must have data-woocommerce-api attribute')
    }

    const options = await fetchConfiguratorOptionsFromWooCommerce(apiUrl)

    // Dynamically import to avoid circular dependencies
    const { Configurator } = await import('./configurator')
    return Configurator.create(options, element)
}
