import { Configurator } from './configurator'
import type { WooCommerceProductData } from './types'

import './style.css'

// Example: Simulated WooCommerce data (replace with actual API call)
const wooCommerceData: WooCommerceProductData = {
    frames: [
        { id: 'frame-1', name: 'Styx Black', modelUrl: '/assets/frames/FRAME_Styx_MOST019_001.glb' },
        { id: 'frame-2', name: 'Styx White', modelUrl: '/assets/frames/FRAME_Styx_MOST020_001.glb' },
    ],
    lenses: [
        { id: 'lens-1', name: 'Orange', modelUrl: '/assets/kepler/KEPLER_ESKP115.glb' },
        { id: 'lens-2', name: 'Blue', modelUrl: '/assets/kepler/KEPLER_ESKP116.glb' },
    ],
    straps: [
        { id: 'strap-1', name: 'Black Strap', modelUrl: '/assets/straps/Strap_SD124_003.glb' },
        { id: 'strap-2', name: 'White Strap', modelUrl: '/assets/straps/Strap_SD127_002.glb' },
    ],
    defaults: {
        frameId: 'frame-1',
        lensId: 'lens-1',
        strapId: 'strap-1',
    },
}

async function init() {
    const container = document.getElementById('configurator')
    if (!container) {
        throw new Error('Configurator container not found')
    }

    // Create configurator
    const configurator = new Configurator(container)

    // Load environment
    await configurator.setEnvironment('/assets/autumn_field_puresky_1k.hdr')

    // Load default models
    const defaultFrame = wooCommerceData.frames.find((f) => f.id === wooCommerceData.defaults?.frameId)
    const defaultLens = wooCommerceData.lenses.find((l) => l.id === wooCommerceData.defaults?.lensId)
    const defaultStrap = wooCommerceData.straps.find((s) => s.id === wooCommerceData.defaults?.strapId)

    if (defaultFrame) await configurator.setFrame(defaultFrame)
    if (defaultLens) await configurator.setLens(defaultLens)
    if (defaultStrap)
        await configurator.setStrap(defaultStrap)

        // Expose configurator globally for WooCommerce integration
    ;(window as any).configurator = configurator
    ;(window as any).wooCommerceData = wooCommerceData

    // Setup UI event listeners
    setupUI(configurator, wooCommerceData)
}

function setupUI(configurator: Configurator, data: WooCommerceProductData) {
    // Frame selection
    document.querySelectorAll('input[name="frame"]').forEach((input) => {
        input.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement
            const frame = data.frames.find((f) => f.id === target.value)
            if (frame) await configurator.setFrame(frame)
        })
    })

    // Lens selection
    document.querySelectorAll('input[name="lens"]').forEach((input) => {
        input.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement
            const lens = data.lenses.find((l) => l.id === target.value)
            if (lens) await configurator.setLens(lens)
        })
    })

    // Strap selection
    document.querySelectorAll('input[name="strap"]').forEach((input) => {
        input.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement
            const strap = data.straps.find((s) => s.id === target.value)
            if (strap) await configurator.setStrap(strap)
        })
    })
}

document.addEventListener('DOMContentLoaded', init)
