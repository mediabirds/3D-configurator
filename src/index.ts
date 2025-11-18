import { Configurator } from './configurator'
import type { ConfiguratorOptions, FrameOption, LensOption, StrapOption } from './types'

import './style.css'

// Initialize with empty options - models will be loaded from file uploads
const configuratorOptions: ConfiguratorOptions = {
    frames: [],
    lenses: [],
    straps: [],
}

document.addEventListener('DOMContentLoaded', async () => {
    const configurator = await Configurator.create(configuratorOptions, document.getElementById('configurator')!)

    // Track current file URLs to revoke them later
    let currentFrameURL: string | null = null
    let currentLensURL: string | null = null
    let currentStrapURL: string | null = null
    let currentPrintURL: string | null = null

    // Frame file upload
    const frameFileInput = document.getElementById('frame-file') as HTMLInputElement
    const frameNameSpan = document.getElementById('frame-name') as HTMLSpanElement

    frameFileInput.addEventListener('change', async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        try {
            // Revoke old URL if exists
            if (currentFrameURL) {
                URL.revokeObjectURL(currentFrameURL)
            }

            // Create object URL from file
            currentFrameURL = URL.createObjectURL(file)

            const frameOption: FrameOption = {
                id: 'uploaded-frame',
                name: file.name,
                modelPath: currentFrameURL,
            }

            await configurator.loadFrame(frameOption)
            frameNameSpan.textContent = file.name
            console.log('Frame loaded successfully:', file.name)
        } catch (error) {
            console.error('Error loading frame:', error)
            alert('Error loading frame. Please check the file format.')
        }
    })

    // Lens file upload
    const lensFileInput = document.getElementById('lens-file') as HTMLInputElement
    const lensNameSpan = document.getElementById('lens-name') as HTMLSpanElement

    lensFileInput.addEventListener('change', async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        try {
            // Revoke old URL if exists
            if (currentLensURL) {
                URL.revokeObjectURL(currentLensURL)
            }

            // Create object URL from file
            currentLensURL = URL.createObjectURL(file)

            const lensOption: LensOption = {
                id: 'uploaded-lens',
                name: file.name,
                modelPath: currentLensURL,
                color: '#000000', // Default color, but model's own color will be used
            }

            await configurator.loadLens(lensOption)
            lensNameSpan.textContent = file.name
            console.log('Lens loaded successfully:', file.name)
        } catch (error) {
            console.error('Error loading lens:', error)
            alert('Error loading lens. Please check the file format.')
        }
    })

    // Strap file upload
    const strapFileInput = document.getElementById('strap-file') as HTMLInputElement
    const strapPrintInput = document.getElementById('strap-print') as HTMLInputElement
    const strapNameSpan = document.getElementById('strap-name') as HTMLSpanElement

    strapFileInput.addEventListener('change', async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        try {
            // Revoke old URL if exists
            if (currentStrapURL) {
                URL.revokeObjectURL(currentStrapURL)
            }

            // Create object URL from file
            currentStrapURL = URL.createObjectURL(file)

            const strapOption: StrapOption = {
                id: 'uploaded-strap',
                name: file.name,
                modelPath: currentStrapURL,
            }

            await configurator.loadStrap(strapOption)
            strapNameSpan.textContent = file.name
            console.log('Strap loaded successfully:', file.name)
        } catch (error) {
            console.error('Error loading strap:', error)
            alert('Error loading strap. Please check the file format.')
        }
    })

    // Strap print upload
    strapPrintInput.addEventListener('change', async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file || !configurator.strap) return

        try {
            // Revoke old URL if exists
            if (currentPrintURL) {
                URL.revokeObjectURL(currentPrintURL)
            }

            // Create object URL from file
            currentPrintURL = URL.createObjectURL(file)

            await configurator.strap.setPrint(currentPrintURL)
            console.log('Print applied successfully:', file.name)
        } catch (error) {
            console.error('Error applying print:', error)
            alert('Error applying print. Please check the file format.')
        }
    })

    // Reset button
    const resetButton = document.getElementById('reset-button') as HTMLButtonElement
    resetButton.addEventListener('click', () => {
        // Revoke all object URLs
        if (currentFrameURL) URL.revokeObjectURL(currentFrameURL)
        if (currentLensURL) URL.revokeObjectURL(currentLensURL)
        if (currentStrapURL) URL.revokeObjectURL(currentStrapURL)
        if (currentPrintURL) URL.revokeObjectURL(currentPrintURL)

        // Reset file inputs
        frameFileInput.value = ''
        lensFileInput.value = ''
        strapFileInput.value = ''
        strapPrintInput.value = ''

        // Reset name spans
        frameNameSpan.textContent = 'None'
        lensNameSpan.textContent = 'None'
        strapNameSpan.textContent = 'None'

        // Reload page to reset Three.js scene
        window.location.reload()
    })

    // Clean up URLs when page is unloaded
    window.addEventListener('beforeunload', () => {
        if (currentFrameURL) URL.revokeObjectURL(currentFrameURL)
        if (currentLensURL) URL.revokeObjectURL(currentLensURL)
        if (currentStrapURL) URL.revokeObjectURL(currentStrapURL)
        if (currentPrintURL) URL.revokeObjectURL(currentPrintURL)
    })
})
