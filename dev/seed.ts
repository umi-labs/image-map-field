import path from 'path'
import type { Payload } from 'payload'
import { fileURLToPath } from 'url'
import { devUser } from './helpers/credentials.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: { email: { equals: devUser.email } },
  })
  if (!totalDocs) await payload.create({ collection: 'users', data: devUser })

  const { totalDocs: mapCount } = await payload.count({ collection: 'maps' })
  if (mapCount) return

  // Seed a base image (a generated placeholder) + a map doc with two pins.
  let mediaId: string | number | undefined
  try {
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Resort plan' },
      filePath: path.resolve(dirname, 'assets/map.png'),
    })
    mediaId = media.id
  } catch (e) {
    payload.logger.warn(`Seed image skipped: ${String(e)}`)
  }

  await payload.create({
    collection: 'maps',
    data: {
      title: 'Island Resort',
      imageMap: {
        image: mediaId,
        map: {
          waypoints: [
            { id: 'a', x: 28, y: 42, name: 'Beach Villas', type: 'villa' },
            { id: 'b', x: 62, y: 33, name: 'Main Pool', type: 'pool' },
            { id: 'c', x: 47, y: 68, name: 'Spa', type: 'spa' },
          ],
        },
      },
    } as never,
  })
}
