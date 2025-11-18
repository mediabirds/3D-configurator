# 3D Ski Goggle Configurator - File Upload Mode

## Overzicht

De configurator ondersteunt nu **lokale bestandsuploads** voor alle componenten. Gebruikers kunnen hun eigen GLB bestanden uploaden voor frame, lens en strap.

## Features

### 1. Frame Upload

- Upload een GLB/GLTF bestand voor het frame
- Pas de kleur aan met een color picker
- Het frame wordt direct in de 3D viewer geladen

### 2. Lens Upload

- Upload een GLB/GLTF bestand voor de lens
- Kies een lens kleur die het materiaal beïnvloedt
- Automatisch physisch lens materiaal met transparantie en iridescence

### 3. Strap Upload

- Upload een GLB/GLTF bestand voor de strap
- Optioneel: upload een print afbeelding (PNG, JPG, etc.)
- De print wordt als texture op de strap geplaatst

### 4. Geavanceerde Opties

- Frame kleur override met color picker
- Reset knop om alles te wissen en opnieuw te beginnen
- Automatische cleanup van object URLs

## Gebruik

### Starten

```bash
pnpm dev
```

Open http://localhost:5173 in je browser.

### GLB Bestanden Uploaden

1. **Frame uploaden:**
    - Klik op "Upload Frame GLB"
    - Selecteer je frame GLB bestand
    - Het frame wordt geladen en getoond

2. **Lens uploaden:**
    - Klik op "Upload Lens GLB"
    - Selecteer je lens GLB bestand
    - Pas optioneel de kleur aan met de color picker

3. **Strap uploaden:**
    - Klik op "Upload Strap GLB"
    - Selecteer je strap GLB bestand
    - Optioneel: upload een print afbeelding

### Kleuren Aanpassen

- **Lens Kleur:** Gebruik de color picker onder "Lens Model"
- **Frame Kleur:** Gebruik de color picker onder "Advanced Options"

### Reset

Klik op de "Reset All" knop om:

- Alle uploads te wissen
- De 3D scene te resetten
- De pagina opnieuw te laden

## Technische Details

### File Handling

De configurator gebruikt `URL.createObjectURL()` om lokale bestanden te laden:

```typescript
const fileURL = URL.createObjectURL(file)
const option: FrameOption = {
    id: 'uploaded-frame',
    name: file.name,
    modelPath: fileURL,
    color: '#000000',
}
await configurator.loadFrame(option)
```

### Memory Management

Object URLs worden automatisch opgeschoond:

- Bij het uploaden van een nieuw bestand (oude URL wordt ge-revoked)
- Bij het klikken op reset
- Bij het sluiten van de pagina (`beforeunload` event)

### Ondersteunde Formaten

**3D Modellen:**

- `.glb` (GLTF Binary)
- `.gltf` (GLTF JSON)

**Print Afbeeldingen:**

- `.png`
- `.jpg` / `.jpeg`
- `.webp`
- Alle standaard browser image formaten

## API Reference

### Configurator Methods

```typescript
// Load een frame vanuit file upload
await configurator.loadFrame(frameOption: FrameOption): Promise<Frame>

// Load een lens vanuit file upload
await configurator.loadLens(lensOption: LensOption): Promise<Lens>

// Load een strap vanuit file upload
await configurator.loadStrap(strapOption: StrapOption): Promise<Strap>
```

### Dynamic Color Changes

```typescript
// Verander lens kleur na uploaden
if (configurator.lens) {
    configurator.lens.setColor('#FF0000')
}

// Verander frame kleur na uploaden
if (configurator.frame) {
    configurator.frame.setColor('#0000FF')
}

// Pas strap print aan na uploaden
if (configurator.strap) {
    await configurator.strap.setPrint('/path/to/print.png')
}
```

## Integratie met WooCommerce

Voor productie kan je dit combineren met WooCommerce:

### Optie 1: Pre-loaded Assets + File Upload

Laad standaard assets uit WooCommerce, maar sta file uploads toe voor customization:

```typescript
const configuratorOptions: ConfiguratorOptions = {
    frames: [
        // WooCommerce frames
        { id: '1', name: 'Styx Black', modelPath: '/uploads/frame1.glb', color: '#000' },
    ],
    lenses: [
        // WooCommerce lenses
    ],
    straps: [
        // WooCommerce straps
    ],
}

const configurator = await Configurator.create(options, element)

// Enable file uploads for custom models
enableFileUploads(configurator)
```

### Optie 2: Hybrid Mode

Radio buttons voor WooCommerce producten + file upload optie:

```html
<div>
    <h4>Select Frame</h4>
    <label><input type="radio" name="frame" value="frame-1" /> Styx Black</label>
    <label><input type="radio" name="frame" value="frame-2" /> Orion White</label>
    <label><input type="radio" name="frame" value="custom" /> Upload Custom</label>
    <input type="file" id="custom-frame" style="display:none" />
</div>
```

## Troubleshooting

### Modellen laden niet

**Probleem:** GLB bestand wordt geüpload maar verschijnt niet

**Oplossingen:**

1. Controleer of het bestand een geldig GLB/GLTF formaat is
2. Open de browser console voor foutmeldingen
3. Controleer of het model meshes bevat (geen lege groups)

### Print verschijnt niet op strap

**Probleem:** Print afbeelding wordt geüpload maar niet getoond

**Oplossingen:**

1. Upload eerst de strap GLB voordat je de print upload
2. Controleer of de afbeelding niet te groot is (max 4096x4096)
3. Gebruik PNG voor beste resultaten

### Geheugen waarschuwingen

**Probleem:** Browser geeft geheugen waarschuwingen

**Oplossing:**
Gebruik de Reset knop regelmatig om oude object URLs op te ruimen.

## Development Notes

### File Upload Flow

1. User selecteert bestand via `<input type="file">`
2. `change` event wordt getriggerd
3. File wordt omgezet naar Object URL met `URL.createObjectURL()`
4. Option object wordt gemaakt met de Object URL als `modelPath`
5. `configurator.loadFrame/Lens/Strap()` wordt aangeroepen
6. GLTFLoader laadt het model vanaf de Object URL
7. Model wordt toegevoegd aan de scene

### Testing Locally

Test met je eigen GLB bestanden uit de `src/assets/` folder:

```
src/assets/frames/FRAME_Styx_MOST019_001.glb
src/assets/lenzen/KEPLER_ESKP115.glb
src/assets/straps/Strap_SD124_003.glb
```

Upload deze via de file inputs om te testen of alles werkt.
