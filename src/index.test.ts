import { describe, expect, it } from 'vitest'
import { imageMap } from './index.js'

const groupFields = (f: ReturnType<typeof imageMap>) =>
  (f as { fields: { name?: string; relationTo?: string }[] }).fields

describe('imageMap field factory', () => {
  it('returns a group with image (upload) + map (json) fields', () => {
    const f = imageMap()
    expect((f as { name: string }).name).toBe('imageMap')
    const names = groupFields(f).map((x) => x.name)
    expect(names).toEqual(['image', 'map'])
  })

  it('respects a custom name and media slug', () => {
    const f = imageMap({ name: 'floorPlan', mediaSlug: 'assets' })
    expect((f as { name: string }).name).toBe('floorPlan')
    const image = groupFields(f).find((x) => x.name === 'image')
    expect(image?.relationTo).toBe('assets')
  })

  it('registers the client Field component with mediaSlug clientProps', () => {
    const f = imageMap({ mediaSlug: 'assets' })
    const map = groupFields(f).find((x) => x.name === 'map') as {
      admin: { components: { Field: { path: string; clientProps: { mediaSlug: string } } } }
    }
    expect(map.admin.components.Field.path).toBe('@foundrykit/image-map-field/client#ImageMapField')
    expect(map.admin.components.Field.clientProps.mediaSlug).toBe('assets')
  })

  it('applies overrides via deepMerge', () => {
    const f = imageMap({ overrides: { admin: { description: 'Pin the resort features.' } } })
    expect((f as { admin?: { description?: string } }).admin?.description).toBe('Pin the resort features.')
  })
})
