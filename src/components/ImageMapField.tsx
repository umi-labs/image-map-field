'use client'

import { FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import { useEffect, useState } from 'react'
import MapEditor from './MapEditor/MapEditor.js'
import type { ImageMapValue, MapImage } from './MapEditor/types.js'

type ImageMapFieldProps = JSONFieldClientProps & {
  /** Upload collection slug for the base image, injected via clientProps. */
  mediaSlug?: string
}

/**
 * Client Field for the `map` JSON value. Reads the sibling `image` upload id,
 * fetches that media doc for its URL/dimensions, and renders the editor. All
 * pin edits are written straight back to the field via `useField` — Payload
 * persists them on save, so there's no bespoke endpoint.
 */
export const ImageMapField = ({ field, path, mediaSlug = 'media' }: ImageMapFieldProps) => {
  const { value, setValue } = useField<ImageMapValue>({ path: path || field.name })

  // Sibling `image` upload id lives one level up (…imageMap.image).
  const basePath = (path || field.name).split('.').slice(0, -1).join('.')
  const imagePath = basePath ? `${basePath}.image` : 'image'
  const imageId = useFormFields(([fields]) => fields[imagePath]?.value as string | number | undefined)

  const [image, setImage] = useState<MapImage | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!imageId) {
      setImage(null)
      return
    }
    fetch(`/api/${mediaSlug}/${imageId}?depth=0`)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!cancelled && doc) {
          setImage({ url: doc.url, alt: doc.alt, width: doc.width, height: doc.height })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [imageId, mediaSlug])

  return (
    <div className="field-type">
      <FieldLabel htmlFor={`field-${path}`} label={field?.label} />
      {!imageId && (
        <p style={{ color: 'var(--theme-elevation-500)', fontSize: '0.85rem' }}>
          Select an image above, then save — the map editor appears once an image is set.
        </p>
      )}
      {imageId && image?.url && (
        <MapEditor value={value || {}} image={image} onChange={(next) => setValue(next)} />
      )}
    </div>
  )
}

export default ImageMapField
