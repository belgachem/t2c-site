'use client'

import Script from 'next/script'
import { createElement } from 'react'

/**
 * Visualiseur 3D interactif (Google <model-viewer>), pour les fichiers .glb.
 */
export function ModelViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="lazyOnload"
      />
      {createElement('model-viewer', {
        src,
        alt,
        'camera-controls': '',
        'auto-rotate': '',
        'shadow-intensity': '0.8',
        exposure: '1',
        'touch-action': 'pan-y',
        loading: 'lazy',
        style: { width: '100%', height: '100%', background: '#0F2D52', borderRadius: '10px' },
      })}
    </>
  )
}
