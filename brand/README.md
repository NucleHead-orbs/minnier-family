# Minnier-Family asset package v1

Approved dark-theme artwork: intertwined HM, ivory and cyan blue.

## Files
- brand-board.png: approved original presentation.
- logo-stacked-dark.png, logo-header-dark.png, monogram-dark.png: original artwork crops, opaque dark backgrounds.
- icon-*.png: web/app icon exports at 32, 48, 64, 128, 180, 192, 256 and 512 px.
- favicon.ico: 16/32/48/64 px browser favicon.
- manifest-icons.json: merge these icon entries into the existing application manifest; adjust asset paths.
- brand.css: suggested palette and live wordmark styling.

## Integration
Use icon-180.png for apple-touch-icon; icon-192.png and icon-512.png for the manifest. Icons are purpose any, not maskable. Keep the site's existing Manrope font loading and render the wordmark as live text with Manrope weight 600 for exact typography. Generated lettering in PNG artwork is an approximation of Manrope.

Colors are visual matches to the supplied screenshot, not extracted site CSS tokens. All assets are raster; 512 px icon is upscaled from the approved presentation crop. No SVG/vector or transparent asset is included: attempted transparent extraction did not preserve clean edges, so those exports were excluded. This package preserves the approved image rather than substituting altered artwork.
