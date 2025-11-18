# 3D Ski Goggle Configurator - Migration Guide

## Overzicht van Wijzigingen

De 3D configurator is volledig herbouwd om te werken met **losse 3D componenten** (frame, lens, strap) in plaats van één enkel 3D model met meerdere meshes.

## Nieuwe Structuur

### Bestanden

- **`src/types.ts`** - TypeScript interfaces voor configuratie data
- **`src/woocommerce-helpers.ts`** - Helper functies voor WooCommerce integratie
- **`src/configurator.ts`** - Hoofdklasse (volledig herschreven)
- **`src/meshes/`** - Frame, Lens en Strap klassen (aangepast voor losse modellen)
- **`src/index.ts`** - Demo implementatie met voorbeeld configuratie

### Hoe Het Werkt

#### 1. Configuratie Data Structure

```typescript
const configuratorOptions = {
    frames: [
        {
            id: 'frame-styx-019',
            name: 'Styx Black',
            modelPath: '/src/assets/frames/FRAME_Styx_MOST019_001.glb',
            color: '#000000',
        },
    ],
    lenses: [
        {
            id: 'lens-orange',
            name: 'Orange Lens',
            modelPath: '/src/assets/lenzen/KEPLER_ESKP115.glb',
            color: '#DB6404',
        },
    ],
    straps: [
        {
            id: 'strap-sd124',
            name: 'Strap SD124',
            modelPath: '/src/assets/straps/Strap_SD124_003.glb',
            printPath: '/SD144_Print-fixed.png',
        },
    ],
    defaultConfiguration: {
        frameId: 'frame-styx-019',
        lensId: 'lens-orange',
        strapId: 'strap-sd124',
    },
}
```

#### 2. Initialisatie

```typescript
const configurator = await Configurator.create(configuratorOptions, document.getElementById('configurator'))
```

#### 3. Componenten Wisselen

```typescript
// Wissel frame
await configurator.changeFrame('frame-styx-020')

// Wissel lens
await configurator.changeLens('lens-blue')

// Wissel strap
await configurator.changeStrap('strap-sd127')
```

#### 4. Kleuren Aanpassen (optioneel)

```typescript
// Verander lens kleur dynamisch
if (configurator.lens) {
    configurator.lens.setColor('#FF0000')
}

// Verander frame kleur dynamisch
if (configurator.frame) {
    configurator.frame.setColor('#0000FF')
}

// Verander strap print dynamisch
if (configurator.strap) {
    await configurator.strap.setPrint('/new-print.jpg')
}
```

## WooCommerce Integratie

### Optie 1: Direct Fetch van REST API

```typescript
import { fetchConfiguratorOptionsFromWooCommerce, Configurator } from './main'

const options = await fetchConfiguratorOptionsFromWooCommerce(
    'https://jouwsite.nl/wp-json/wc/v3/products/123/configurator-data',
)

const configurator = await Configurator.create(options, document.getElementById('configurator'))
```

### Optie 2: Data Attribute Methode

HTML:

```html
<div id="configurator" data-woocommerce-api="https://jouwsite.nl/wp-json/wc/v3/products/123/configurator-data"></div>
```

JavaScript:

```typescript
import { initConfiguratorFromDataAttribute } from './main'

const configurator = await initConfiguratorFromDataAttribute(document.getElementById('configurator'))
```

### WooCommerce Data Format

Het WooCommerce endpoint moet data teruggeven in dit formaat:

```json
{
    "frames": [
        {
            "id": "frame-1",
            "name": "Styx Black",
            "model_url": "https://jouwsite.nl/wp-content/uploads/models/frame1.glb",
            "color": "#000000",
            "price": 99.99,
            "sku": "FRAME-001"
        }
    ],
    "lenses": [
        {
            "id": "lens-1",
            "name": "Orange Lens",
            "model_url": "https://jouwsite.nl/wp-content/uploads/models/lens1.glb",
            "color": "#DB6404",
            "description": "High contrast lens",
            "price": 49.99,
            "sku": "LENS-001"
        }
    ],
    "straps": [
        {
            "id": "strap-1",
            "name": "Strap SD124",
            "model_url": "https://jouwsite.nl/wp-content/uploads/models/strap1.glb",
            "print_url": "https://jouwsite.nl/wp-content/uploads/prints/print1.png",
            "color": "#FFFFFF",
            "price": 29.99,
            "sku": "STRAP-001"
        }
    ],
    "default_configuration": {
        "frame_id": "frame-1",
        "lens_id": "lens-1",
        "strap_id": "strap-1"
    }
}
```

## WordPress Plugin Voorbeeld

Je kunt een custom WordPress plugin maken om deze data te genereren:

```php
<?php
// In je plugin of theme's functions.php

add_action('rest_api_init', function () {
    register_rest_route('wc/v3', '/products/(?P<id>\d+)/configurator-data', array(
        'methods' => 'GET',
        'callback' => 'get_product_configurator_data',
    ));
});

function get_product_configurator_data($request) {
    $product_id = $request['id'];
    $product = wc_get_product($product_id);

    // Haal custom fields op (bijvoorbeeld met ACF)
    $frames = get_field('configurator_frames', $product_id);
    $lenses = get_field('configurator_lenses', $product_id);
    $straps = get_field('configurator_straps', $product_id);

    return array(
        'frames' => $frames,
        'lenses' => $lenses,
        'straps' => $straps,
        'default_configuration' => array(
            'frame_id' => get_field('default_frame_id', $product_id),
            'lens_id' => get_field('default_lens_id', $product_id),
            'strap_id' => get_field('default_strap_id', $product_id),
        )
    );
}
```

## Voordelen van Nieuwe Structuur

✅ **Flexibel** - Elk onderdeel kan apart geladen en gewisseld worden
✅ **Uitbreidbaar** - Makkelijk om nieuwe frames, lenzen of straps toe te voegen
✅ **Type-safe** - TypeScript interfaces voor alle configuratie data
✅ **WooCommerce Ready** - Helper functies voor eenvoudige integratie
✅ **Multiple Variants** - Meerdere kleuren/prints per component mogelijk

## Migratie Checklist

- [x] Types gedefinieerd voor configuratie data
- [x] Mesh klassen aangepast voor losse GLB files
- [x] Configurator klasse volledig herschreven
- [x] Demo implementatie in `src/index.ts`
- [x] HTML UI aangepast met frame/lens/strap selectie
- [x] WooCommerce helper functies toegevoegd
- [ ] WordPress REST API endpoint maken
- [ ] 3D modellen uploaden naar WordPress
- [ ] ACF velden configureren voor product varianten
- [ ] Testen met echte WooCommerce data

## Development

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build
```

## Browser Testen

Open `http://localhost:5173` (of de poort die Vite aangeeft) en test:

1. Frame selectie (radio buttons aan linkerkant)
2. Lens kleur selectie (gekleurde cirkels)
3. Strap print selectie (print preview cirkels)

## Volgende Stappen

1. **WordPress Plugin Maken** - Zie voorbeeld hierboven
2. **ACF Velden Configureren** - Voor frames, lenses en straps
3. **3D Modellen Uploaden** - Naar WordPress media library
4. **Endpoint Testen** - Test of data correct terugkomt
5. **Integratie Testen** - Test met echte WooCommerce product pagina
