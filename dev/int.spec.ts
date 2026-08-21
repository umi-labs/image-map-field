import path from 'path'
import { fileURLToPath } from 'url'
const dirname = path.dirname(fileURLToPath(import.meta.url))
import type { Payload } from 'payload'
import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

let payload: Payload
beforeAll(async () => { payload = await getPayload({ config }) })
afterAll(async () => { await payload.destroy() })

describe('image-map field on the maps collection', () => {
  test('registers the imageMap group (image + map)', () => {
    const group = payload.collections['maps'].config.fields.find(
      (f) => 'name' in f && f.name === 'imageMap',
    ) as { fields: { name?: string }[] }
    expect(group).toBeDefined()
    expect(group.fields.map((f) => f.name)).toEqual(['image', 'map'])
  })

  test('stores and reads back waypoints in the map JSON value', async () => {
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'plan' },
      filePath: path.resolve(dirname, 'assets/map.png'),
    })
    const doc = await payload.create({
      collection: 'maps',
      data: {
        title: 'Test Map',
        imageMap: { image: media.id, map: { waypoints: [{ id: 'x', x: 10, y: 20, name: 'Reception' }] } },
      } as never,
    })
    const read = await payload.findByID({ collection: 'maps', id: doc.id })
    const wps = (read.imageMap as { map?: { waypoints?: unknown[] } })?.map?.waypoints
    expect(wps).toHaveLength(1)
    expect((wps as { name: string }[])[0].name).toBe('Reception')
  })
})
